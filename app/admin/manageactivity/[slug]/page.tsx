"use client";

import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "axionadmin123@mail.com";

export default function AdminEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [activity, setActivity] = useState<SportActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  useEffect(() => {
    const email = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;
    if (!token || email !== ADMIN_EMAIL) {
      router.push("/admin/authentication/login");
      return;
    }
    fetchActivity();
  }, [token, router]);

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
        router.push("/admin/manageactivity");
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12">
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
      <div className="max-w-[1440px] mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">Event yang dicari tidak ditemukan.</p>
        <Link href="/admin/manageactivity" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Manage Event
        </Link>
      </div>
    );
  }

  const isPast = new Date(activity.activity_date) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        href="/admin/manageactivity"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Manage Event
      </Link>

      {/* Event Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Title & Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              {activity.sport_category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full mb-2">
                  {activity.sport_category.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{activity.title}</h1>
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

          {/* Slot & Organizer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Participants</p>
                <p className="text-sm font-medium text-gray-900">{activity.participants?.length || 0} / {activity.slot} slot</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Organizer</p>
                <p className="text-sm font-medium text-gray-900">{activity.organizer?.name || "-"}</p>
                <p className="text-xs text-gray-500">{activity.organizer?.email || ""}</p>
              </div>
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

          {/* Delete Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
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
      {activity.participants && activity.participants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Participants ({activity.participants.length})
            </h2>
            <div className="space-y-2">
              {activity.participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {p.user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{p.user?.name || "Unknown"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
