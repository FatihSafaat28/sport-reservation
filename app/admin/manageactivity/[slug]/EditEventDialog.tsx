"use client";

import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import { SportCategory } from "@/lib/interface/sportcategory";
import { Province } from "@/lib/interface/province";
import { City } from "@/lib/interface/city";

interface EditEventDialogProps {
  activity: SportActivity;
  token: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditEventDialog({ activity, token, onClose, onUpdated }: EditEventDialogProps) {
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState(activity.address);
  const [mapUrl, setMapUrl] = useState(activity.map_url || "");
  const [slot, setSlot] = useState(String(activity.slot));
  const [price, setPrice] = useState(String(activity.price));
  const [activityDate, setActivityDate] = useState(activity.activity_date?.split("T")[0] || "");
  const [startTime, setStartTime] = useState(activity.start_time || "");
  const [endTime, setEndTime] = useState(activity.end_time || "");

  // Options
  const [categories, setCategories] = useState<SportCategory[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    fetchCategories();
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (provinceId) {
      fetchCities(provinceId);
    }
  }, [provinceId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories?is_paginate=false`);
      const json = await res.json();
      setCategories(json.result);
      if (activity.sport_category) {
        const found = json.result.find((c: SportCategory) => c.name === activity.sport_category?.name);
        if (found) setSportCategoryId(String(found.id));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/provinces?is_paginate=false`);
      const json = await res.json();
      setProvinces(json.result);
      if (activity.city?.province?.province_name) {
        const found = json.result.find(
          (p: Province) => p.province_name === activity.city.province.province_name
        );
        if (found) setProvinceId(String(found.province_id));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchCities = async (provId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/cities/${provId}?is_paginate=false`);
      const json = await res.json();
      const data = json.result.sort((a: City, b: City) =>
        a.city_name_full.localeCompare(b.city_name_full)
      );
      setCities(data);
      if (isInitialLoad.current && activity.city?.city_name_full) {
        const found = data.find(
          (c: City) => c.city_name_full === activity.city.city_name_full
        );
        if (found) setCityId(String(found.city_id));
        isInitialLoad.current = false;
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      sport_category_id: Number(sportCategoryId),
      city_id: Number(cityId),
      title,
      description,
      slot: Number(slot),
      price: Number(price),
      address,
      activity_date: activityDate,
      start_time: startTime.slice(0, 5),
      end_time: endTime.slice(0, 5),
      map_url: mapUrl,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities/update/${activity.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.error) {
        alert("Event berhasil diupdate!");
        onUpdated();
      } else {
        alert(result.message || "Gagal mengupdate event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Edit Event</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} min-h-[90px] resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Sport Category</label>
            <select className={`${inputClass} cursor-pointer`} value={sportCategoryId} onChange={(e) => setSportCategoryId(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Province</label>
              <select className={`${inputClass} cursor-pointer`} value={provinceId} onChange={(e) => { setProvinceId(e.target.value); setCityId(""); }} required>
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p.province_id} value={p.province_id}>{p.province_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <select className={`${inputClass} cursor-pointer`} value={cityId} onChange={(e) => setCityId(e.target.value)} disabled={!provinceId} required>
                <option value="">{!provinceId ? "Select Province First" : "Select City"}</option>
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>{c.city_name_full}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input type="text" className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Google Maps URL</label>
            <input type="url" className={inputClass} value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} value={activityDate} onChange={(e) => setActivityDate(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Start Time</label>
              <input type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input type="time" className={inputClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slot</label>
              <input type="number" min="1" className={inputClass} value={slot} onChange={(e) => setSlot(e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Price (IDR)</label>
              <input type="number" min="0" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
