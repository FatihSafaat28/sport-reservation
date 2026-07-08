"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter, useParams } from "next/navigation";
import { TransactionDetail } from "@/lib/interface/transactiondetail";
import Link from "next/link";
import { toast } from "sonner";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  useEffect(() => {
    const email = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
    if (!token || email !== ADMIN_EMAIL) {
      router.push("/admin/authentication/login");
      return;
    }
    fetchTransaction();
  }, [token, router]);

  const fetchTransaction = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/transaction/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        setTransaction(data.result);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  const getExpirationReason = () => {
    if (!transaction) return null;
    const now = new Date();

    const activity = transaction.transaction_items?.sport_activities;
    if (activity) {
      const eventStartTime = new Date(`${activity.activity_date}T${activity.start_time}`);
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

    const activity = transaction.transaction_items?.sport_activities;
    if (activity) {
      const eventStartTime = new Date(`${activity.activity_date}T${activity.start_time}`).getTime();
      if (eventStartTime < computedExpiredTime) {
        computedExpiredTime = eventStartTime;
      }
    }

    return new Date(computedExpiredTime);
  };

  const handleUpdateStatus = async (newStatus: "success" | "failed") => {
    if (!token) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transaction/update-status/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.error) {
        toast.success(`Status transaksi berhasil diupdate`);
        fetchTransaction();
      } else {
        toast.error(data.message || "Gagal mengupdate status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelTransaction = async () => {
    if (!token) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transaction/cancel/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "success" }),
      });
      const data = await res.json();
      if (!data.error) {
        toast.success("Transaksi berhasil dibatalkan!");
        fetchTransaction();
      } else {
        toast.error(data.message || "Gagal membatalkan transaksi.");
      }
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatActivityDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success": return "bg-green-50 text-green-600 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "failed":
      case "cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const isFinalStatus = (status: string) => {
    const s = status.toLowerCase();
    return s === "success" || s === "cancelled";
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading transaction detail...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
        <p className="text-gray-500 mb-6">Transaksi yang dicari tidak ditemukan.</p>
        <Link href="/admin/managetransaction" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Manage Transaction
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        href="/admin/managetransaction"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Manage Transaction
      </Link>

      {/* Transaction Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Transaction Detail</h1>
              <p className="text-sm text-gray-500">{transaction.invoice_id}</p>
            </div>
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(transaction.status)} ${isTxExpired ? "opacity-60" : ""}`}>
              {transaction.status.toLowerCase() === "failed"
                ? (isTxExpired ? "rejected (expired)" : "rejected")
                : transaction.status}
            </span>
          </div>

          {/* User Info */}
          {transaction.user && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {transaction.user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{transaction.user.name}</p>
                <p className="text-sm text-gray-500">{transaction.user.email}</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Invoice ID</span>
              <span className="font-medium text-gray-900">{transaction.invoice_id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">{transaction.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-semibold text-blue-600">{formatPrice(transaction.total_amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Order Date</span>
              <span className="font-medium text-gray-900">{formatDate(transaction.order_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Expired Date</span>
              <span className="font-medium text-gray-900">
                {getDynamicExpiredDate() ? formatDate(getDynamicExpiredDate()!.toISOString()) : "N/A"}
              </span>
            </div>
          </div>

          {/* Event Info */}
          {transaction.transaction_items?.sport_activities && (
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event
              </h3>
              <p className="font-semibold text-gray-900 mb-1">{transaction.transaction_items.sport_activities.title}</p>
              <p className="text-sm text-gray-600">{transaction.transaction_items.sport_activities.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatActivityDate(transaction.transaction_items.sport_activities.activity_date)} • {transaction.transaction_items.sport_activities.start_time} - {transaction.transaction_items.sport_activities.end_time}
              </p>
            </div>
          )}

          {/* Proof of Payment */}
          {transaction.proof_payment_url && (
            <div className="p-4 bg-green-50/50 rounded-lg border border-green-100 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Proof of Payment
              </h3>
              <div className="rounded-lg overflow-hidden border border-green-200 bg-white mb-3">
                <img
                  src={transaction.proof_payment_url}
                  alt="Proof of Payment"
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
              <div className="flex justify-end mt-2">
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

          {/* Action Buttons */}
          {!isFinalStatus(transaction.status) && (
            isTxExpired ? (
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 inline-block">
                  {getExpirationReason() === "event_started"
                    ? "✓ Event ini sudah berlangsung. Transaksi ini tidak dapat diproses lagi."
                    : "✓ Masa tenggang transaksi ini telah berakhir. Transaksi sudah kedaluwarsa secara otomatis."}
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleUpdateStatus("success")}
                    disabled={updating || !transaction.proof_payment_url}
                    className="flex-1 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-center cursor-pointer"
                  >
                    {updating ? "Updating..." : "✓ Approve Payment"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("failed")}
                    disabled={updating || !transaction.proof_payment_url}
                    className="flex-1 px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-center cursor-pointer"
                  >
                    {updating ? "Updating..." : "✗ Reject Payment"}
                  </button>
                  {transaction.status !== "failed" && (
                    <button
                      onClick={handleCancelTransaction}
                      disabled={updating}
                      className="flex-1 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
                    >
                      {updating ? "Updating..." : "✗ Cancel Booking"}
                    </button>
                  )}
                </div>
                {!transaction.proof_payment_url && (
                  <p className="mt-3 text-xs text-center text-red-500 font-medium">
                    Payment proof is required to approve or reject this transaction.
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
