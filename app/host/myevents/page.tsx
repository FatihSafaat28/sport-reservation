"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyEventsPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<SportActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/host/authentication/login");
      return;
    }
    fetchUserAndEvents(token);
  }, [router]);

  const fetchUserAndEvents = async (token: string) => {
    try {
      // Fetch current user to get ID
      const meRes = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (!meData.success) {
        router.push("/host/authentication/login");
        return;
      }
      const currentUserId = meData.data.id;
      setUserId(currentUserId);

      // Fetch all activities
      const activitiesRes = await fetch(
        `${API_BASE_URL}/sport-activities?is_paginate=false`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const activitiesData = await activitiesRes.json();
      if (!activitiesData.error) {
        // Filter by organizer id
        const myActivities = activitiesData.result.filter(
          (a: SportActivity) => a.organizer?.id === currentUserId
        );
        setActivities(myActivities);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
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
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] min-h-screen mx-auto px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] min-h-screen mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-500 mt-1">
            Kelola semua event olahraga yang kamu buat
          </p>
        </div>
        <Link
          href="/host/myevents/create"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </Link>
      </div>

      {/* Event Grid or Empty State */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada event</h3>
          <p className="text-gray-400 mb-6">Mulai buat event pertamamu sekarang!</p>
          <Link
            href="/host/myevents/create"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((event) => {
            const isPast = new Date(event.activity_date) < new Date();
            return (
              <Link
                key={event.id}
                href={`/host/myevents/${event.id}`}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    {isPast ? (
                      <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                        Ended
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {event.sport_category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full mb-3">
                      {event.sport_category.name}
                    </span>
                  )}

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.activity_date)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.start_time} - {event.end_time}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="line-clamp-1">
                      {event.city?.city_name_full}, {event.city?.province?.province_name}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatPrice(event.price)}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.participants?.length || 0}/{event.slot}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
