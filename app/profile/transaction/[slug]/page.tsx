"use client";

import { useEffect, useState, use } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { SportActivity } from "@/lib/interface/sportactivity";
import { TransactionDetail } from "@/lib/interface/transactiondetail";
import { parseEventDescription } from "@/lib/utils/eventHelper";
import { toast } from "sonner";

interface ExtendedPaymentMethod {
  id: number;
  name: string;
  description: string;
  virtual_account_number?: string;
  virtual_account_name?: string;
}

export default function TransactionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [activity, setActivity] = useState<SportActivity | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<ExtendedPaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  const { mainDescription, paymentInfo } = activity 
    ? parseEventDescription(activity.description) 
    : { mainDescription: "", paymentInfo: null };

  const getExpirationReason = () => {
    if (!transaction) return null;
    const now = new Date();

    const act = transaction.transaction_items?.sport_activities || activity;
    if (act) {
      const eventStartTime = new Date(`${act.activity_date}T${act.start_time}`);
      if (now > eventStartTime) {
        return "event_started";
      }
    }

    if (transaction.status === "failed" && transaction.updated_at) {
      const rejectTime = new Date(transaction.updated_at).getTime();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      if (now.getTime() > rejectTime + twoDaysInMs) {
        return "grace_expired";
      }
    }

    if (transaction.status === "pending" && !transaction.proof_payment_url && transaction.expired_date) {
      const expiredTime = new Date(transaction.expired_date).getTime();
      if (now.getTime() > expiredTime) {
        return "pending_expired";
      }
    }

    return null;
  };

  const isTxExpired = getExpirationReason() !== null;

  const getDynamicExpiredDate = () => {
    if (!transaction) return null;
    if (transaction.status !== "failed" || !transaction.updated_at) {
      return transaction.expired_date ? new Date(transaction.expired_date) : null;
    }

    const rejectTime = new Date(transaction.updated_at).getTime();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    let computedExpiredTime = rejectTime + twoDaysInMs;

    const act = transaction.transaction_items?.sport_activities || activity;
    if (act) {
      const eventStartTime = new Date(`${act.activity_date}T${act.start_time}`).getTime();
      if (eventStartTime < computedExpiredTime) {
        computedExpiredTime = eventStartTime;
      }
    }

    return new Date(computedExpiredTime);
  };

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchTransactionDetail();
  }, [slug]);

  const fetchTransactionDetail = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/authentication/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/transaction/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction detail");
      }

      const result = await response.json();
      
      let transactionData = null;
      if(!result.error){
        transactionData = result.result;
      }

      if (transactionData) {
        setTransaction(transactionData);
        
        if (transactionData.transaction_items?.sport_activity_id) {
          fetchSportActivity(transactionData.transaction_items.sport_activity_id, token);
        }
        
        if (transactionData.payment_method_id) {
          fetchPaymentMethod(transactionData.payment_method_id, token);
        }
      }

    } catch (error) {
      console.error("Error fetching transaction detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSportActivity = async (id: number, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sport-activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!result.error) {
        setActivity(result.result);
      }
    } catch (error) {
      console.error("Error fetching sport activity:", error);
    }
  };

  const fetchPaymentMethod = async (id: number, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment-methods`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!result.error) {
            const data = result.result
            if (Array.isArray(data)) {
                const method = data.find((pm: ExtendedPaymentMethod) => pm.id == id);
                if (method) {
                    setPaymentMethod(method);
                }
            }
        }

    } catch (error) {
        console.error("Error fetching payment methods:", error);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Validate image type
      if (!selected.type.startsWith("image/")) {
        toast.warning("Only image files are allowed (JPG, PNG, etc.)");
        e.target.value = "";
        return;
      }
      // Validate max size 512KB
      if (selected.size > 512 * 1024) {
        toast.warning(`File size (${(selected.size / 1024).toFixed(0)} KB) exceeds the 512 KB limit. Please choose a smaller image.`);
        e.target.value = "";
        return;
      }
      setProofFile(selected);
      setProofPreview(URL.createObjectURL(selected));
    }
  };

  const handleUploadProof = async () => {
    if (!proofFile) {
      toast.warning("Please select an image file first");
      return;
    }

    const token = sessionStorage.getItem("token");
    setIsUploading(true);
    try {
      // Step 1: Upload image to get URL
      const formData = new FormData();
      formData.append("file", proofFile);

      const uploadRes = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadResult = await uploadRes.json();
      if (uploadResult.error) {
        toast.error(uploadResult.message || "Failed to upload image");
        return;
      }

      const imageUrl = uploadResult.result;

      // Step 2: Send the URL to update proof of payment
      const response = await fetch(`${API_BASE_URL}/transaction/update-proof-payment/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proof_payment_url: imageUrl,
        }),
      });

      const result = await response.json();
      if (!result.error) {
        toast.success("Proof of payment updated successfully!");
        fetchTransactionDetail();
        setProofFile(null);
        setProofPreview(null);
      } else {
        toast.error(result.message || "Failed to update proof of payment");
      }
    } catch (error) {
      console.error("Error updating proof of payment:", error);
      toast.error("An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Back Button Skeleton */}
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />

          {/* SECTION 1: Transaction Detail Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3.5 w-56 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-1.5 h-5 w-40 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Activity Details Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse mb-4" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                {/* Category Badge + Title */}
                <div>
                  <div className="h-6 w-16 bg-blue-100 rounded-md animate-pulse mb-2" />
                  <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Description + Details split */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Description */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3.5 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-3.5 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-3.5 w-3/4 bg-gray-100 rounded animate-pulse" />
                  </div>

                  {/* Right: Date, Location, Organizer */}
                  <div className="w-full md:w-1/3 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3.5 w-full bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Payment Proof Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-4" />
            <div className="space-y-4">
              <div className="h-3.5 w-72 bg-gray-100 rounded animate-pulse" />
              <div>
                <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-9 w-full bg-gray-100 rounded-md animate-pulse" />
              </div>
              <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <h1 className="text-xl">Transaction not found</h1>
        <button
          onClick={() => router.push('/profile/transaction')}
          className="text-blue-600 hover:underline"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => router.push('/profile/transaction')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Transactions
        </button>

        {/* Warning Banner for Rejected Payment */}
        {transaction.status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-red-900 text-base">Bukti Pembayaran Ditolak</h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  Bukti transfer yang Anda unggah ditolak oleh Host. Silakan periksa kembali detail transaksi, pastikan nominal transfer sesuai, lalu unggah bukti transfer baru yang valid di bagian bawah halaman ini.
                </p>
              </div>
            </div>
            {paymentInfo?.phone && (
              <a
                href={`https://wa.me/${paymentInfo.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm shadow-green-100 hover:shadow-none cursor-pointer w-full sm:w-auto text-center"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.01-5.118-2.858-6.97-1.851-1.852-4.307-2.871-6.953-2.872-5.449 0-9.873 4.42-9.877 9.866-.001 1.77.465 3.498 1.348 5.011l-.995 3.635 3.738-.98l-.092-.058zm9.251-6.421c-.269-.134-1.597-.788-1.846-.878-.25-.09-.432-.134-.613.134-.181.269-.703.878-.862 1.057-.159.18-.318.202-.587.067-.269-.134-1.135-.419-2.162-1.336-.799-.713-1.338-1.593-1.495-1.862-.158-.269-.017-.415.118-.55.122-.121.27-.314.405-.471.135-.158.18-.27.27-.449.09-.18.045-.337-.023-.472-.068-.135-.613-1.478-.839-2.02-.22-.53-.442-.457-.613-.466-.159-.008-.34-.01-.522-.01-.182 0-.477.067-.726.337-.25.269-.953.931-.953 2.27 0 1.338.976 2.628 1.112 2.808.136.18 1.92 2.931 4.65 4.113.65.28 1.157.447 1.552.572.653.208 1.248.179 1.718.109.524-.078 1.597-.652 1.823-1.282.227-.63.227-1.169.159-1.28-.068-.113-.25-.18-.519-.314z"/>
                </svg>
                Tanya Host (WhatsApp)
              </a>
            )}
          </div>
        )}

        {/* SECTION 1: Transaction Detail */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Detail</h1>
              {transaction.invoice_id && (
                  <p className="text-sm text-gray-500">Invoice: {transaction.invoice_id}</p>
              )}
            </div>
            {(() => {
              const isProofChecking = transaction.status === 'pending' && transaction.proof_payment_url;
              const displayStatus = isProofChecking 
                ? 'PROOF CHECKING' 
                : transaction.status === 'failed' 
                  ? 'REJECTED' 
                  : transaction.status.toUpperCase();
              const statusClass = isProofChecking ? 'bg-blue-100 text-blue-800'
                : (transaction.status === 'success' || transaction.status === 'paid') ? 'bg-green-100 text-green-800'
                : transaction.status === 'failed' ? 'bg-red-100 text-red-800 border border-red-200'
                : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                : transaction.status === 'cancelled' ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800';
              return (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                  {displayStatus}
                </div>
              );
            })()}
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction Date</p>
              <p className="text-base text-gray-900">
                {transaction.order_date ? new Date(transaction.order_date).toLocaleString() : new Date(transaction.created_at).toLocaleString()}
              </p>
            </div>
            <div>
                {(paymentInfo?.bank_name || paymentMethod) && (
                    <div className="mb-2">
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-900">{paymentInfo?.bank_name || paymentMethod?.name}</p>
                        </div>
                    </div>
                )}
            </div>
             {(() => {
              if (transaction.status === 'success' || transaction.status === 'paid' || transaction.status === 'cancelled') return null;
              const isProofChecking = transaction.status === 'pending' && transaction.proof_payment_url;
              return (
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Deadline</p>
                  <p className="text-base text-gray-900">
                    {isProofChecking ? 'Proof under Checking' : (getDynamicExpiredDate() ? getDynamicExpiredDate()!.toLocaleString() : 'N/A')}
                  </p>
                </div>
              );
            })()}
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-base font-bold text-gray-900">
                IDR {transaction.total_amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Activity Detail */}
        {activity ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Details</h2>
            <div className="flex flex-col md:flex-row gap-6">              
              {/* Content */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-md mb-2">
                    {activity.sport_category?.name || 'Sport'}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                </div>
                
                {/* Split Layout: Description (Left) & Details (Right) */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Description */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                      {mainDescription}
                    </p>
                  </div>

                  {/* Right: Details (Date, Location, Organizer) */}
                  <div className="w-full md:w-1/3 flex flex-col gap-4 text-sm text-gray-600 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    {/* Date & Time */}
                    <div className="flex gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Date & Time</p>
                        <p>{new Date(activity.activity_date).toLocaleDateString()}</p>
                        <p className="text-xs">{activity.start_time} - {activity.end_time}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p>{activity.address}</p>
                        <p className="text-xs">{activity.city?.city_name_full || ""}, {activity.city?.province?.province_name || ""}</p>
                        {activity.map_url && (
                          <a href={activity.map_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">View on Map</a>
                        )}
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Organizer</p>
                        <p>{activity.organizer.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
             <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center text-gray-500">
                {transaction.transaction_items?.sport_activity_id ? 'Loading Activity Details...' : 'Activity details not available'}
             </div>
        )}

        {/* Payment Instructions */}
        {transaction.status === 'pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-blue-900">Payment Instructions</h2>
            <p className="text-sm text-blue-700 leading-relaxed">
              Silakan lakukan transfer sesuai detail rekening host di bawah ini, lalu unggah bukti transfer di bagian bawah halaman ini.
            </p>
            
            <div className="bg-white rounded-xl border border-blue-100 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase">Bank Tujuan</span>
                <span className="font-bold text-gray-900">{paymentInfo?.bank_name || paymentMethod?.name || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase">Nomor Rekening</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900">
                    {paymentInfo?.bank_account || paymentMethod?.virtual_account_number || 'N/A'}
                  </span>
                  {(paymentInfo?.bank_account || paymentMethod?.virtual_account_number) && (
                    <button
                      onClick={() => {
                        const accNum = paymentInfo?.bank_account || paymentMethod?.virtual_account_number;
                        if (accNum) {
                          navigator.clipboard.writeText(accNum);
                          toast.success('Nomor rekening berhasil disalin!');
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                      title="Salin Nomor Rekening"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase">Nama Penerima</span>
                <span className="font-semibold text-gray-900">
                  {paymentInfo?.account_holder || paymentMethod?.virtual_account_name || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Transfer</span>
                <span className="font-bold text-blue-600">IDR {transaction.total_amount.toLocaleString()}</span>
              </div>
            </div>
            
            {paymentInfo?.phone && (
              <div className="text-center">
                <a
                  href={`https://wa.me/${paymentInfo.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Butuh bantuan? Hubungi Host via WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Payment Proof */}
        {transaction.status === 'cancelled' || transaction.status === 'success' || transaction.status === 'paid' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Proof</h2>
            <p className="text-sm text-gray-500">
              {transaction.status === 'cancelled'
                ? 'This transaction has been cancelled. You can no longer submit proof of payment.'
                : 'This transaction has been completed successfully.'}
            </p>
            {(transaction.status === 'success' || transaction.status === 'paid') && transaction.proof_payment_url && (
              <div className="mt-4 space-y-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center max-h-64">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={transaction.proof_payment_url}
                    alt="Proof of Payment"
                    className="max-h-60 w-full object-contain p-1"
                  />
                </div>
                <div className="flex justify-end">
                  <a
                    href={transaction.proof_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Full Payment Proof
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : isTxExpired ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Proof</h2>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {getExpirationReason() === "event_started"
                  ? "Event ini sudah dimulai/berlangsung. Anda tidak dapat mengunggah bukti pembayaran lagi."
                  : "Masa tenggang unggah ulang bukti pembayaran (2 hari) telah berakhir. Transaksi ini telah kedaluwarsa secara otomatis."}
              </p>
              {transaction.proof_payment_url && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Proof of Payment Submitted
                  </p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center max-h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={transaction.proof_payment_url}
                      alt="Proof of Payment"
                      className="max-h-60 w-full object-contain p-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={transaction.proof_payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Full Payment Proof
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Proof</h2>
          
          <div className="space-y-6">
            {transaction.proof_payment_url && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Current Proof of Payment
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center max-h-64">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={transaction.proof_payment_url}
                    alt="Proof of Payment"
                    className="max-h-60 w-full object-contain p-1"
                  />
                </div>
                <div className="flex justify-end">
                  <a
                    href={transaction.proof_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Full Payment Proof
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {transaction.proof_payment_url 
                  ? "If you need to update your payment proof, select a new image below." 
                  : "Please upload your proof of payment image to confirm your transaction."}
              </p>
              <div>
                <label htmlFor="proof-file" className="block text-sm font-medium text-gray-700 mb-1">
                  {transaction.proof_payment_url ? "New Proof Image" : "Proof Image"}
                </label>
                <input
                  type="file"
                  id="proof-file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  * Format yang didukung: JPG, PNG, WEBP (Maksimal 512 KB)
                </p>
              </div>
              {proofPreview && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={proofPreview}
                    alt="Preview"
                    className="w-full max-h-60 object-contain bg-gray-50"
                  />
                </div>
              )}
              <button
                onClick={handleUploadProof}
                disabled={isUploading || !proofFile}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : (transaction.proof_payment_url ? 'Update Proof' : 'Submit Proof')}
              </button>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
