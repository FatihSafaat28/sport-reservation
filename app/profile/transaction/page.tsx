"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/lib/interface/transactiondetail";

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "success" | "cancelled"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filters = [
    { key: "all" as const, label: "All" },
    { key: "pending" as const, label: "Pending" },
    { key: "success" as const, label: "Success" },
    { key: "cancelled" as const, label: "Cancelled" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/authentication/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/my-transaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const result = await response.json();
      if (!result.result.error) {
        const data: TransactionDetail[] = result.result.data;

        // Auto-cancel expired pending transactions without proof
        const expiredPending = data.filter(
          (t) =>
            t.status === "pending" &&
            !t.proof_payment_url &&
            t.expired_date &&
            new Date(t.expired_date) < new Date(),
        );

        if (expiredPending.length > 0) {
          await Promise.all(
            expiredPending.map((t) =>
              fetch(`${API_BASE_URL}/transaction/cancel/${t.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }),
            ),
          );
          // Re-fetch after cancelling
          setLoading(true);
          return fetchTransactions();
        }
        data.sort(
          (a, b) =>
            new Date(b.expired_date).getTime() -
            new Date(a.expired_date).getTime(),
        );
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if a transaction is "pending" (includes proof checking)
  const isPending = (t: TransactionDetail) => t.status === "pending";

  // Check if a transaction is "success"
  const isSuccess = (t: TransactionDetail) =>
    t.status === "success" || t.status === "paid";

  // Check if a transaction is "cancelled"
  const isCancelled = (t: TransactionDetail) => t.status === "cancelled";

  // Filter & sort transactions based on active filter
  const filteredTransactions = (() => {
    let filtered: TransactionDetail[];

    switch (activeFilter) {
      case "pending":
        filtered = transactions.filter(isPending);
        break;
      case "success":
        filtered = transactions.filter(isSuccess);
        break;
      case "cancelled":
        filtered = transactions.filter(isCancelled);
        break;
      default:
        // "all" — sort pending first
        filtered = [...transactions].sort((a, b) => {
          const aPending = isPending(a) ? 0 : 1;
          const bPending = isPending(b) ? 0 : 1;
          return aPending - bPending;
        });
        break;
    }

    return filtered;
  })();

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // Reset page when filter changes
  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Derive display status and expires label
  const getDisplayInfo = (t: TransactionDetail) => {
    if (t.status === "pending" && t.proof_payment_url) {
      return {
        displayStatus: "PROOF CHECKING",
        statusClass: "bg-blue-100 text-blue-800",
        expiresLabel: "Proof under Checking",
      };
    }
    if (t.status === "success" || t.status === "paid") {
      return {
        displayStatus: t.status.toUpperCase(),
        statusClass: "bg-green-100 text-green-800",
        expiresLabel: null,
      };
    }
    if (t.status === "cancelled") {
      return {
        displayStatus: "CANCELLED",
        statusClass: "bg-red-100 text-red-800",
        expiresLabel: null,
      };
    }
    // Default: pending without proof
    return {
      displayStatus: "PENDING",
      statusClass: "bg-yellow-100 text-yellow-800",
      expiresLabel: t.expired_date
        ? new Date(t.expired_date).toLocaleString()
        : null,
    };
  };

  // Badge style for filter buttons
  const getFilterStyle = (key: string) => {
    if (key === activeFilter) {
      return "bg-blue-600 text-white shadow-sm";
    }
    return "bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="h-8 w-52 bg-gray-200 rounded-md animate-pulse mb-8" />

          {/* Filter Skeleton */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>

          {/* Transaction Card Skeletons */}
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                {/* Top Row: Invoice + Status */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3.5 w-44 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
                </div>

                {/* Activity Snapshot Skeleton */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Bottom Row: Price + Button */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Transactions
        </h1>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${getFilterStyle(filter.key)}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              {activeFilter === "all"
                ? "No transactions found."
                : `No ${activeFilter} transactions found.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {paginatedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      Invoice: {transaction.invoice_id}
                    </h3>
                    {(() => {
                      const info = getDisplayInfo(transaction);
                      return (
                        <>
                          <div className="text-sm text-gray-500 space-y-0.5">
                            <p>
                              Order Date:{" "}
                              {new Date(
                                transaction.order_date,
                              ).toLocaleDateString()}
                            </p>
                            {info.expiresLabel && (
                              <p className="text-red-500">
                                Expires: {info.expiresLabel}
                              </p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {(() => {
                    const info = getDisplayInfo(transaction);
                    return (
                      <div
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit whitespace-nowrap ${info.statusClass}`}
                      >
                        {info.displayStatus}
                      </div>
                    );
                  })()}
                </div>

                {/* Activity Snapshot */}
                {transaction.transaction_items?.sport_activities && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {transaction.transaction_items.sport_activities.title}
                    </h4>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                        {new Date(
                          transaction.transaction_items.sport_activities
                            .activity_date,
                        ).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {
                          transaction.transaction_items.sport_activities
                            .start_time
                        }{" "}
                        -{" "}
                        {
                          transaction.transaction_items.sport_activities
                            .end_time
                        }
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Price
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      IDR{" "}
                      {transaction.total_amount
                        ? transaction.total_amount.toLocaleString()
                        : "N/A"}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/profile/transaction/${transaction.id}`)
                    }
                    className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination — hidden when 5 or fewer items */}
        {filteredTransactions.length > perPage && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
