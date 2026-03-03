"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/lib/interface/transactiondetail";
import Link from "next/link";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ManageTransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!token || email !== ADMIN_EMAIL) {
      router.push("/admin/authentication/login");
      return;
    }
    fetchTransactions(token);
  }, [router]);

  const fetchTransactions = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/all-transaction?is_paginate=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        const sorted = (data.result || []).sort(
          (a: TransactionDetail, b: TransactionDetail) =>
            new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
        );
        setTransactions(sorted);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success": return "bg-green-50 text-green-600";
      case "pending": return "bg-yellow-50 text-yellow-600";
      case "failed":
      case "cancelled": return "bg-red-50 text-red-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.invoice_id?.toLowerCase().includes(q) ||
      t.user?.name?.toLowerCase().includes(q) ||
      t.user?.email?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q) ||
      t.transaction_items?.sport_activities?.title?.toLowerCase().includes(q)
    );
  });

  const perPage = isMobile ? 10 : 15;
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Transaction</h1>
        <p className="text-gray-500 mt-1">Kelola semua transaksi yang ada di platform</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Search & Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            All Transactions ({filteredTransactions.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari invoice, user, event..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400">Tidak ada transaksi ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Invoice</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden sm:table-cell">User ID</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden lg:table-cell">Event</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden sm:table-cell">Amount</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 px-3 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/managetransaction/${tx.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-xs"
                      >
                        {tx.invoice_id}
                      </Link>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tx.user?.name || tx.user_id}</p>
                        <p className="text-xs text-gray-400">{tx.user?.email || ""}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <span className="text-gray-600 line-clamp-1">{tx.transaction_items?.sport_activities?.title || "-"}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700 hidden sm:table-cell">{formatPrice(tx.total_amount)}</td>
                    <td className="py-3 px-3 text-gray-500 hidden md:table-cell text-xs">{formatDate(tx.order_date)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/managetransaction/${tx.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        title="View Detail"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => (
                  <span key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-1 text-gray-400 text-sm">…</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
