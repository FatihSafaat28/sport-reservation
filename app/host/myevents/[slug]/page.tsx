"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import EditEventDialog from "./EditEventDialog";
import TransactionDialog from "./TransactionDialog";
import { TransactionDetail } from "@/lib/interface/transactiondetail";


export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [activity, setActivity] = useState<SportActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Transaction/Participant state
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities/${slug}`);
      const data = await res.json();
      if (!data.error) {
        setActivity(data.result);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/all-transaction?is_paginate=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        // Filter transactions for this activity
        const filtered = (data.result || []).filter(
          (t: TransactionDetail) => t.transaction_items?.sport_activity_id === Number(slug)
        );
        setTransactions(filtered);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [token, slug]);

  useEffect(() => {
    if (!token) {
      router.push("/host/authentication/login");
      return;
    }
    fetchActivity();
    fetchTransactions();
  }, [token, router, fetchActivity, fetchTransactions]);

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities/delete/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        alert("Event berhasil dihapus!");
        router.push("/host/myevents");
      } else {
        alert(data.message || "Gagal menghapus event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success": return "bg-green-50 text-green-600";
      case "pending": return "bg-yellow-50 text-yellow-600";
      case "failed":
      case "cancelled": return "bg-red-50 text-red-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading event detail...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">Event yang kamu cari tidak ditemukan.</p>
        <Link href="/host/myevents" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to My Events
        </Link>
      </div>
    );
  }

  const isPast = new Date(activity.activity_date) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Back Button */}
      <Link
        href="/host/myevents"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Events
      </Link>

      {/* Event Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* Title & Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              {activity.sport_category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                  {activity.sport_category.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isPast ? (
                <span className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-500 rounded-full">Ended</span>
              ) : (
                <span className="px-3 py-1.5 text-sm font-medium bg-green-50 text-green-600 rounded-full">Active</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">{activity.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(activity.activity_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Time</p>
                <p className="text-sm font-medium text-gray-900">{activity.start_time} - {activity.end_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Location</p>
                <p className="text-sm font-medium text-gray-900">{activity.address}</p>
                <p className="text-xs text-gray-500">{activity.city?.city_name_full}, {activity.city?.province?.province_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Price</p>
                <p className="text-sm font-medium text-blue-600">{formatPrice(activity.price)}</p>
              </div>
            </div>
          </div>

          {/* Slot Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">Participants</p>
              <p className="text-sm font-medium text-gray-900">
                {activity.participants?.length || 0} / {activity.slot} slot
              </p>
            </div>
          </div>

          {/* Map Link */}
          {activity.map_url && (
            <a
              href={activity.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Google Maps
            </a>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowEditDialog(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Edit Event
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm border border-red-200"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            User Transaction List ({transactions.length})
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Belum ada peserta yang mendaftar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => {
                    setSelectedTransaction(tx);
                    setShowTransactionDialog(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {tx.username.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Event?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Event &quot;{activity.title}&quot; akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Dialog */}
      {showEditDialog && (
        <EditEventDialog
          activity={activity}
          token={token!}
          onClose={() => setShowEditDialog(false)}
          onUpdated={() => {
            setShowEditDialog(false);
            fetchActivity();
          }}
        />
      )}

      {/* Transaction Detail Dialog */}
      {showTransactionDialog && selectedTransaction && (
        <TransactionDialog
          transaction={selectedTransaction}
          token={token!}
          onClose={() => {
            setShowTransactionDialog(false);
            setSelectedTransaction(null);
          }}
          onStatusUpdated={() => {
            setShowTransactionDialog(false);
            setSelectedTransaction(null);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}
