"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

interface TransactionBase {
  id: string;
  total_amount: number;
  invoice_id: string;
  proof_payment_url?: string;
  status: string;
  order_date: string;
  user: {
    name: string;
    email: string;
  };
}

interface TransactionDetail extends TransactionBase {
  payment_method?: string;
  expired_at?: string;
}

interface TransactionDialogProps {
  transaction: TransactionBase;
  token: string;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export default function TransactionDialog({ transaction, token, onClose, onStatusUpdated }: TransactionDialogProps) {
  const [detail, setDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/transaction/${transaction.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        setDetail(data.result);
      }
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transaction/update-status/${transaction.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "success" }),
      });
      const data = await res.json();
      console.log(data)
      if (!data.error) {
        alert("Status transaksi berhasil diupdate!");
        onStatusUpdated();
      } else {
        alert(data.message || "Gagal mengupdate status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success": return "bg-green-50 text-green-600 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "failed":
      case "cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const tx = detail || transaction;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Transaction Detail</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {tx.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{tx.user?.name || "Unknown"}</p>
                <p className="text-sm text-gray-500">{tx.user?.email || ""}</p>
              </div>
            </div>

            {/* Status */}
            <div className={`inline-block px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(tx.status)}`}>
              Status: {tx.status}
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Invoice ID</span>
                <span className="font-medium text-gray-900">{tx.invoice_id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold text-blue-600">{formatPrice(tx.total_amount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Order Date</span>
                <span className="font-medium text-gray-900">{formatDate(tx.order_date)}</span>
              </div>
            </div>

            {/* Proof of Payment */}
            {tx.proof_payment_url && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Proof of Payment</p>
                <a
                  href={tx.proof_payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Payment Proof
                </a>
              </div>
            )}

            {/* Update Status Button */}
            {tx.status.toLowerCase() !== "success" && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Approve Transaction (Set to Success)"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
