"use client";

import React, { useEffect, useState, use } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { SportActivity } from "@/lib/interface/sportactivity";
import { TransactionDetail } from "@/lib/interface/transactiondetail";
import { PaymentMethod } from "@/lib/interface/paymentmethod";

export default function TransactionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [activity, setActivity] = useState<SportActivity | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofUrl, setProofUrl] = useState("");
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
      if (result.result && !result.result.error) {
        transactionData = result.result;
      } else if (result.success && result.data) {
        transactionData = result.data;
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
        console.log(result);
        if (!result.error) {
            const data = result.result
            if (Array.isArray(data)) {
                const method = data.find((pm: any) => pm.id == id);
                if (method) {
                    setPaymentMethod(method);
                }
            }
        }

    } catch (error) {
        console.error("Error fetching payment methods:", error);
    }
  }

  const handleUploadProof = async () => {
    if (!proofUrl) {
      alert("Please enter a URL first");
      return;
    }

    const token = sessionStorage.getItem("token");
    setIsUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/update-proof-payment/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proof_payment_url: proofUrl,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Proof of payment updated successfully!");
        fetchTransactionDetail(); // Refresh data
        setProofUrl("");
      } else {
        alert(result.message || "Failed to update proof of payment");
      }
    } catch (error) {
      console.error("Error updating proof of payment:", error);
      alert("An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
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

        {/* SECTION 1: Transaction Detail */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Detail</h1>
              {transaction.invoice_id && (
                  <p className="text-sm text-gray-500">Invoice: {transaction.invoice_id}</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'success' || transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {transaction.status.toUpperCase()}
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Transaction Date</p>
              <p className="text-base text-gray-900">
                {transaction.order_date ? new Date(transaction.order_date).toLocaleString() : new Date(transaction.created_at).toLocaleString()}
              </p>
            </div>
            <div>
                {paymentMethod && (
                    <div className="mb-2">
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-900">{paymentMethod.name}</p>
                        </div>
                    </div>
                )}
            </div>
             <div>
              <p className="text-sm font-medium text-gray-500">Payment Deadline</p>
              <p className="text-base text-gray-900">
                {transaction.expired_date ? new Date(transaction.expired_date).toLocaleString() : 'N/A'}
              </p>
            </div>
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
                      {activity.description}
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
                        <p className="text-xs">{activity.city.city_name}, {activity.city.province.province_name}</p>
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

        {/* SECTION 3: Payment Proof */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Proof</h2>
          
          <div className="space-y-6">
            {transaction.proof_payment_url && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Current Proof of Payment
                </p>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 break-all">
                  <a
                    href={transaction.proof_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline text-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    View Proof of Payment
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {transaction.proof_payment_url 
                  ? "If you need to update your payment proof, enter the new URL below." 
                  : "Please upload your proof of payment URL to confirm your transaction."}
              </p>
              <div>
                <label htmlFor="proof-url" className="block text-sm font-medium text-gray-700 mb-1">
                  {transaction.proof_payment_url ? "New Proof URL" : "Proof URL"}
                </label>
                <input
                  type="url"
                  id="proof-url"
                  placeholder="https://example.com/my-receipt.jpg"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <button
                onClick={handleUploadProof}
                disabled={isUploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : (transaction.proof_payment_url ? 'Update Proof' : 'Submit Proof')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
