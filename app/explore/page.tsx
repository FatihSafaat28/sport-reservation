"use client";

import React, { useEffect, useState } from "react";
import EventCardItems, {
  SportActivity,
} from "../components/event-card-items";
import { API_BASE_URL } from "@/lib/config";

export default function ExplorePage() {
  const [events, setEvents] = useState<SportActivity[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SportActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [provinceFilter, setProvinceFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Derived options for filters
  const [categories, setCategories] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, provinceFilter, cityFilter, categoryFilter]);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setItemsPerPage(6); // Mobile
    } else {
      setItemsPerPage(12); // Tablet & Desktop
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sport-activities?per_page=999`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      const data: SportActivity[] = result.result.data || result;
      
      const now = new Date();
      const validEvents = data.sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime())

      setEvents(validEvents);
      
      // Extract unique options for filters
      const uniqueCategories = Array.from(new Set(validEvents.map(e => e.sport_category?.name || "Sport").filter(Boolean))).sort();
      const uniqueProvinces = Array.from(new Set(validEvents.map(e => e.city.province.province_name).filter(Boolean))).sort();
      const uniqueCities = Array.from(new Set(validEvents.map(e => e.city.city_name).filter(Boolean))).sort();
      
      setCategories(uniqueCategories);
      setProvinces(uniqueProvinces);
      setCities(uniqueCities);

    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = events;

    if (provinceFilter) {
      result = result.filter((e) =>
        e.city.province.province_name
          .toLowerCase()
          .includes(provinceFilter.toLowerCase())
      );
    }
    if (cityFilter) {
      result = result.filter((e) =>
        e.city.city_name.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    if (categoryFilter) {
      result = result.filter((e) =>
        (e.sport_category?.name || "Sport")
          .toLowerCase()
          .includes(categoryFilter.toLowerCase())
      );
    }

    setFilteredEvents(result);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Filter Section */}
      <section className="bg-white border-b border-gray-200 sticky top-[65px] z-10 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 md:px-8 py-2 md:mb-2">
          <div className="flex md:hidden justify-between items-center">
            <span className="font-semibold text-gray-900">Filters</span>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <form
            className={`grid grid-cols-1 mt-4 md:mt-0 md:grid-cols-4 gap-4 ${
              showMobileFilters ? "block" : "hidden md:grid"
            }`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Province
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
              >
                <option value="">All Provinces</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                City
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setProvinceFilter("");
                  setCityFilter("");
                  setCategoryFilter("");
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-colors text-sm h-[42px]"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Count Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Explore Events</h1>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
            Found {filteredEvents.length} events
          </span>
        </div>
      </section>

      {/* Event List Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[380px] bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : currentEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentEvents.map((event) => (
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
                {[...Array(totalPages)].map((_, i) => (
                    <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-600"
                    }`}
                    >
                    {i + 1}
                    </button>
                ))}
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
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-500 max-w-[300px]">
              Try adjusting your search filters or check back later for new events.
            </p>
            <button
                onClick={() => {
                  setProvinceFilter("");
                  setCityFilter("");
                  setCategoryFilter("");
                }}
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
