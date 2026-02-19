"use client";

import React, { useEffect, useState, useRef } from "react";
import EventCardItems from "../components/event-card-items";
import { SportActivity } from "@/lib/interface/sportactivity";
import { API_BASE_URL } from "@/lib/config";

// Interfaces for API responses
interface SportCategory {
  id: number;
  name: string;
}

interface Province {
  province_id: number;
  province_name: string;
}

interface City {
  city_id: number;
  city_name: string;
}

export default function ExplorePage() {
  // Events data & loading
  const [events, setEvents] = useState<SportActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination (server-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Options from API
  const [categories, setCategories] = useState<SportCategory[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Debounce timer for search
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Category scroll ref (mobile)
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // ── Responsive per_page ──────────────────────────────────────────
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

  // ── Fetch categories & provinces ────────────────────────
  useEffect(() => {
    fetchCategories();
    fetchProvinces();
  }, []);

  // ── Fetch cities when province changes ───────────────────────────
  useEffect(() => {
    if (selectedProvinceId) {
      fetchCities(selectedProvinceId);
    } else {
      setCities([]);
      setSelectedCityId("");
    }
  }, [selectedProvinceId]);

  // ── Fetch events when any filter / page / perPage changes ────────
  useEffect(() => {
    fetchEvents();
  }, [currentPage, itemsPerPage, selectedCategoryId, selectedCityId]);

  // ── Debounced search ─────────────────────────────────────────────
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchEvents();
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // ── API Calls ────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      setCategories(json.result.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/provinces`);
      if (!res.ok) throw new Error("Failed to fetch provinces");
      const json = await res.json();
      setProvinces(json.result.data);
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const fetchCities = async (provinceId: string) => {
    setLoadingCities(true);
    setSelectedCityId("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/location/cities/${provinceId}`
      );
      if (!res.ok) throw new Error("Failed to fetch cities");
      const json = await res.json();
      setCities(json.result.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        is_paginate: "true",
        per_page: String(itemsPerPage),
        page: String(currentPage),
      });

      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategoryId)
        params.set("sport_category_id", selectedCategoryId);
      if (selectedCityId) params.set("city_id", selectedCityId);

      const res = await fetch(
        `${API_BASE_URL}/sport-activities?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      const json = await res.json();

      const data: SportActivity[] = json.result?.data || json.data || [];
      const lastPage = json.result?.last_page || 1;
      const total = json.result?.total || data.length;

      setEvents(data);
      setTotalPages(lastPage);
      setTotalEvents(total);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? "" : categoryId));
    setCurrentPage(1);
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedCityId("");
    setCurrentPage(1);
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("");
    setSelectedProvinceId("");
    setSelectedCityId("");
    setCities([]);
    setCurrentPage(1);
  };

  // ── Pagination helpers ───────────────────────────────────────────
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

  // ── Active filter indicator ──────────────────────────────────────
  const hasActiveFilters =
    searchQuery || selectedCategoryId || selectedProvinceId || selectedCityId;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ─── Filter Section ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 sticky top-[65px] z-10 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3">
          {/* Mobile toggle */}
          <div className="flex md:hidden justify-between items-center mb-2">
            <span className="font-semibold text-gray-900">Filters</span>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {showMobileFilters ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                  Hide Filters
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  Show Filters
                </>
              )}
            </button>
          </div>
          {/* Location Filters */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${
              showMobileFilters ? "block" : "hidden md:grid"
            }`}
          >
            {/* Province */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Province
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                value={selectedProvinceId}
                onChange={(e) => handleProvinceChange(e.target.value)}
              >
                <option value="">All Provinces</option>
                {provinces.map((p) => (
                  <option key={p.province_id} value={p.province_id}>
                    {p.province_name}
                  </option>
                ))}
              </select>
            </div>

            {/* City (dependent on Province) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                City
              </label>
              <select
                className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none ${
                  !selectedProvinceId
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!selectedProvinceId}
              >
                <option value="">
                  {!selectedProvinceId
                    ? "Select Province First"
                    : loadingCities
                    ? "Loading cities..."
                    : "All Cities"}
                </option>
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={`w-full px-4 py-2 font-medium rounded-lg transition-colors text-sm h-[38px] ${
                  hasActiveFilters
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-400 text-blue-500 cursor-not-allowed"
                }`}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Badges */}
          {categories.length > 0 && (
            <div
              ref={categoryScrollRef}
              className="mt-3 flex gap-2 overflow-x-auto md:overflow-x-visible md:flex-wrap md:overflow-y-hidden scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(String(cat.id))}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 shrink-0 ${
                    selectedCategoryId === String(cat.id)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ─── Count Section ──────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Explore Events</h1>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
            Found {totalEvents} events
          </span>
        </div>
      </section>

      {/* ─── Event List Section ─────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div
                key={i}
                className="h-[380px] bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events.map((event) => (
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
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
