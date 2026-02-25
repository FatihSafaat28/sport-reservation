"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { SportActivity } from "@/lib/interface/sportactivity";

const ADMIN_EMAIL = "axionadmin123@mail.com";

interface Transaction {
  id: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    runningEvents: 0,
    endedEvents: 0,
    totalTransactions: 0,
    successTransactions: 0,
    pendingTransactions: 0,
    cancelledTransactions: 0,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token || email !== ADMIN_EMAIL) {
      router.push("/admin/authentication/login");
      return;
    }
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const [activitiesRes, transactionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/sport-activities?is_paginate=false`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/all-transaction?is_paginate=false`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const activitiesData = await activitiesRes.json();
      const transactionsData = await transactionsRes.json();

      const now = new Date();
      let runningEvents = 0;
      let endedEvents = 0;
      const activities: SportActivity[] = activitiesData.result || [];
      activities.forEach((a) => {
        if (new Date(a.activity_date) >= now) {
          runningEvents++;
        } else {
          endedEvents++;
        }
      });

      const transactions: Transaction[] = transactionsData.result || [];
      let successCount = 0;
      let pendingCount = 0;
      let cancelledCount = 0;
      transactions.forEach((t) => {
        const s = t.status.toLowerCase();
        if (s === "success") successCount++;
        else if (s === "pending") pendingCount++;
        else if (s === "cancelled" || s === "failed") cancelledCount++;
      });

      setStats({
        totalEvents: activities.length,
        runningEvents,
        endedEvents,
        totalTransactions: transactions.length,
        successTransactions: successCount,
        pendingTransactions: pendingCount,
        cancelledTransactions: cancelledCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Running Events",
      value: stats.runningEvents,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      label: "Ended Events",
      value: stats.endedEvents,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-gray-50 text-gray-600",
      iconBg: "bg-gray-200",
    },
  ];

  const transactionCards = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-indigo-50 text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      label: "Success",
      value: stats.successTransactions,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      label: "Pending",
      value: stats.pendingTransactions,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-yellow-50 text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      label: "Cancelled",
      value: stats.cancelledTransactions,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview platform Mabarin Sport</p>
      </div>

      {/* Events Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Event Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transaction Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {transactionCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
