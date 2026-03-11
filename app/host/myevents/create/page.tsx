"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportCategory } from "@/lib/interface/sportcategory";
import { Province } from "@/lib/interface/province";
import { City } from "@/lib/interface/city";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [slot, setSlot] = useState("");
  const [price, setPrice] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Options
  const [categories, setCategories] = useState<SportCategory[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/host/authentication/login");
      return;
    }
    fetchCategories();
    fetchProvinces();
  }, [router]);

  useEffect(() => {
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
      setCityId("");
    }
  }, [provinceId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories?is_paginate=false`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      setCategories(json.result);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/provinces?is_paginate=false`);
      if (!res.ok) throw new Error("Failed to fetch provinces");
      const json = await res.json();
      setProvinces(json.result);
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const fetchCities = async (provId: string) => {
    setLoadingCities(true);
    try {
      const res = await fetch(`${API_BASE_URL}/location/cities/${provId}?is_paginate=false`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const json = await res.json();
      const data = json.result.sort((a: City, b: City) =>
        a.city_name_full.localeCompare(b.city_name_full)
      );
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/host/authentication/login");
      return;
    }

    const payload = {
      sport_category_id: Number(sportCategoryId),
      city_id: Number(cityId),
      title,
      description,
      slot: Number(slot),
      price: Number(price.toString().replace(/\./g, "")),
      address,
      activity_date: activityDate,
      start_time: startTime,
      end_time: endTime,
      map_url: mapUrl,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.error) {
        alert("Event berhasil dibuat!");
        router.push("/host/myevents");
      } else {
        alert(result.message || "Gagal membuat event. Coba lagi!");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Terjadi kesalahan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  
  const formatNumber = (val: string) => {
    if (!val) return "";
    const res = val.replace(/\D/g, "");
    return res.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/host/myevents"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Events
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
        <p className="text-gray-500 mt-1">Isi detail event olahraga yang ingin kamu buat</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            type="text"
            className={inputClass}
            placeholder="Nama event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            className={`${inputClass} min-h-[120px] resize-y`}
            placeholder="Deskripsi event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className={labelClass}>Sport Category</label>
          <select
            id="category"
            className={`${inputClass} cursor-pointer`}
            value={sportCategoryId}
            onChange={(e) => setSportCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Location: Province & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="province" className={labelClass}>Province</label>
            <select
              id="province"
              className={`${inputClass} cursor-pointer`}
              value={provinceId}
              onChange={(e) => {
                setProvinceId(e.target.value);
                setCityId("");
              }}
              required
            >
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p.province_id} value={p.province_id}>{p.province_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <select
              id="city"
              className={`${inputClass} ${!provinceId ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              disabled={!provinceId}
              required
            >
              <option value="">
                {!provinceId ? "Select Province First" : loadingCities ? "Loading..." : "Select City"}
              </option>
              {cities.map((c) => (
                <option key={c.city_id} value={c.city_id}>{c.city_name_full}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <input
            id="address"
            type="text"
            className={inputClass}
            placeholder="Alamat lengkap venue"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Map URL */}
        <div>
          <label htmlFor="mapUrl" className={labelClass}>Google Maps URL</label>
          <input
            id="mapUrl"
            type="url"
            className={inputClass}
            placeholder="https://maps.google.com/..."
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}>Activity Date</label>
            <input
              id="date"
              type="date"
              className={inputClass}
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className={labelClass}>Start Time</label>
            <input
              id="startTime"
              type="time"
              className={inputClass}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className={labelClass}>End Time</label>
            <input
              id="endTime"
              type="time"
              className={inputClass}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Slot & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="slot" className={labelClass}>Slot (Max Participants)</label>
            <input
              id="slot"
              type="number"
              min="1"
              className={inputClass}
              placeholder="e.g. 20"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>Price (IDR)</label>
            <input
              id="price"
              type="text"
              className={inputClass}
              placeholder="e.g. 50.000"
              value={price}
              onChange={(e) => setPrice(formatNumber(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Link
            href="/host/myevents"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
