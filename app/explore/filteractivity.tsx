"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SportCategory } from "@/lib/interface/sportcategory";
import { Province } from "@/lib/interface/province";
import { City } from "@/lib/interface/city";
import { API_BASE_URL } from "@/lib/config";

export default function FilterActivity() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial values from URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategoryId = searchParams.get("sport_category_id") || "";
  const initialProvinceId = searchParams.get("province_id") || "";
  const initialCityId = searchParams.get("city_id") || "";

  // Filter state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [selectedProvinceId, setSelectedProvinceId] = useState(initialProvinceId);
  const [selectedCityId, setSelectedCityId] = useState(initialCityId);
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

  // ── Push filters to URL ──────────────────────────────────────────
  const pushFiltersToUrl = useCallback(
    (overrides?: {
      search?: string;
      sport_category_id?: string;
      city_id?: string;
      province_id?: string;
    }) => {
      const params = new URLSearchParams();

      const search = overrides?.search ?? searchQuery;
      const categoryId = overrides?.sport_category_id ?? selectedCategoryId;
      const provinceId = overrides?.province_id ?? selectedProvinceId;
      const cityId = overrides?.city_id ?? selectedCityId;

      if (search.trim()) params.set("search", search.trim());
      if (categoryId) params.set("sport_category_id", categoryId);
      if (provinceId) params.set("province_id", provinceId);
      if (cityId) params.set("city_id", cityId);

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [searchQuery, selectedCategoryId, selectedProvinceId, selectedCityId, pathname, router]
  );

  // ── Fetch categories & provinces ─────────────────────────────────
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
    }
  }, [selectedProvinceId]);

  // ── Debounced search → push to URL ──────────────────────────────
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      pushFiltersToUrl({ search: searchQuery });
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    try {
      const res = await fetch(`${API_BASE_URL}/location/cities/${provinceId}`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const json = await res.json();
      setCities(json.result.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handleCategorySelect = (categoryId: string) => {
    const newVal = selectedCategoryId === categoryId ? "" : categoryId;
    setSelectedCategoryId(newVal);
    pushFiltersToUrl({ sport_category_id: newVal });
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedCityId("");
    pushFiltersToUrl({ province_id: provinceId, city_id: "" });
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    pushFiltersToUrl({ city_id: cityId });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("");
    setSelectedProvinceId("");
    setSelectedCityId("");
    setCities([]);
    router.push(pathname, { scroll: false });
  };

  // ── Active filter indicator ──────────────────────────────────────
  const hasActiveFilters =
    searchQuery || selectedCategoryId || selectedProvinceId || selectedCityId;

  return (
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
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
                Hide Filters
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
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
              className={`w-full px-4 py-2 font-medium text-white rounded-lg transition-colors text-sm h-[38px] ${
                hasActiveFilters
                  ? "bg-blue-600 hover:bg-blue-700"
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                pushFiltersToUrl({ search: "" });
              }}
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
  );
}
