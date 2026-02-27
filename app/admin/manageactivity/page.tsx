"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportCategory } from "@/lib/interface/sportcategory";
import { SportActivity } from "@/lib/interface/sportactivity";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ManageEventPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Category state
  const [categories, setCategories] = useState<SportCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  // Activity state
  const [activities, setActivities] = useState<SportActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingActivityId, setDeletingActivityId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    if (!t || email !== ADMIN_EMAIL) {
      router.push("/admin/authentication/login");
      return;
    }
    setToken(t);
    fetchCategories();
    fetchActivities(t);
  }, [router]);

  // ─── CATEGORY CRUD ─────────────────────────────────────────

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories?is_paginate=false`);
      const data = await res.json();
      if (data.result) setCategories(data.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (!data.error) {
        setNewCategoryName("");
        fetchCategories();
        alert("Kategori berhasil dibuat!");
      } else {
        alert(data.message || "Gagal membuat kategori.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!token || !editCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editCategoryName.trim() }),
      });
      const data = await res.json();
      if (!data.error) {
        setEditingCategoryId(null);
        setEditCategoryName("");
        fetchCategories();
        alert("Kategori berhasil diupdate!");
      } else {
        alert(data.message || "Gagal mengupdate kategori.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!token) return;
    setDeletingCategoryId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/sport-categories/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        fetchCategories();
        alert("Kategori berhasil dihapus!");
      } else {
        alert(data.message || "Gagal menghapus kategori.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // ─── ACTIVITY CRUD ─────────────────────────────────────────

  const fetchActivities = async (t: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities?is_paginate=false`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (!data.error) {
        const all: SportActivity[] = data.result || [];
        const now = new Date();

        const active = [...all]
          .filter((a) => new Date(a.activity_date) >= now)
          .sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime());

        const ended = [...all]
          .filter((a) => new Date(a.activity_date) < now)
          .sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime());

        setActivities([...active, ...ended]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!token) return;
    setDeletingActivityId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/sport-activities/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) {
        fetchActivities(token);
        alert("Event berhasil dihapus!");
      } else {
        alert(data.message || "Gagal menghapus event.");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setDeletingActivityId(null);
      setShowDeleteConfirm(null);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const filteredActivities = activities.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Event</h1>
        <p className="text-gray-500 mt-1">Kelola kategori olahraga dan event activity</p>
      </div>

      {/* ─── CATEGORY SECTION ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Sport Categories
        </h2>

        {/* Create Category */}
        <form onSubmit={handleCreateCategory} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nama kategori baru..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={categoryLoading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {categoryLoading ? "..." : "+ Add"}
          </button>
        </form>

        {/* Category List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4 col-span-full">Belum ada kategori.</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${editingCategoryId === cat.id ? "col-span-full" : ""}`}
              >
                {editingCategoryId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white text-gray-900"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateCategory(cat.id)}
                      disabled={categoryLoading}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingCategoryId(null); setEditCategoryName(""); }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingCategoryId(cat.id); setEditCategoryName(cat.name); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={deletingCategoryId === cat.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── EVENT ACTIVITY SECTION ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Event Activities ({filteredActivities.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari event..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {activityLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-400">Tidak ada event ditemukan.</p>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Event</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden lg:table-cell">Organizer</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium hidden sm:table-cell">Price</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 px-3 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivities.map((activity) => {
                  const isPast = new Date(activity.activity_date) < new Date();
                  return (
                    <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <Link
                          href={`/admin/manageactivity/${activity.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {activity.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                          {activity.sport_category?.name || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 hidden sm:table-cell">{formatDate(activity.activity_date)}</td>
                      <td className="py-3 px-3 text-gray-500 hidden lg:table-cell">{activity.organizer?.name || "-"}</td>
                      <td className="py-3 px-3 text-gray-700 font-medium hidden sm:table-cell">{formatPrice(activity.price)}</td>
                      <td className="py-3 px-3">
                        {isPast ? (
                          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">Ended</span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Active</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/manageactivity/${activity.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Detail"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm(activity.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* Delete Activity Confirmation Dialog */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Event?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Event ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteActivity(showDeleteConfirm)}
                disabled={deletingActivityId === showDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingActivityId === showDeleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
