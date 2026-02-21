"use client";

import { useState, useEffect } from "react";
import EventCardItems from "../components/event-card-items";
import { SportActivity } from "@/lib/interface/sportactivity";

interface ActivityListProps {
  activities: SportActivity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [hideExpired, setHideExpired] = useState(true);

  // ── Responsive items per page ──────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const newPerPage = window.innerWidth < 768 ? 6 : 12;
      setItemsPerPage((prev) => {
        if (prev !== newPerPage) {
          return newPerPage;
        }
        return prev;
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Reset to page 1 when activities change (new filter applied) ───
  useEffect(() => {
    setCurrentPage(1);
  }, [activities]);

  // ── Reset to page 1 when hideExpired changes ──────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [hideExpired]);

  // ── Filter expired activities ──────────────────────────────────────
  const filteredActivities = hideExpired
    ? activities.filter((event) => {
        const now = new Date();
        const eventEnd = new Date(`${event.activity_date}T${event.end_time}`);
        return eventEnd >= now;
      })
    : activities;

  // ── Pagination calculation ─────────────────────────────────────────
  const totalEvents = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalEvents / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredActivities.slice(startIndex, endIndex);

  // ── Pagination helpers ─────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ─── Count Section ──────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Explore Events</h1>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
            Found {totalEvents} events
          </span>
        </div>
        <div className="flex justify-end items-center gap-2 mt-4">
          <label
            htmlFor="hideExpired"
            className="text-sm font-medium text-gray-600 cursor-pointer select-none"
          >
            Hide Expired
          </label>
          <input
            type="checkbox"
            id="hideExpired"
            checked={hideExpired}
            onChange={(e) => setHideExpired(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </section>

      {/* ─── Event List Section ─────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        {paginatedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedEvents.map((event) => (
                <EventCardItems key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-500 max-w-[300px]">
              Try adjusting your search filters or check back later for new
              events.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
