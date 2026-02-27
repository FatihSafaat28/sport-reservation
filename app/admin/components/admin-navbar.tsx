"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
      window.location.href = "/admin/authentication/login";
    }
  };

  const menu = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: "Manage Event",
      href: "/admin/manageactivity",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Manage Transaction",
      href: "/admin/managetransaction",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto px-6 xl:max-w-[1440px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <h1 className="text-2xl font-bold text-white">Mabarin!</h1>
              <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                Admin
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {isLoggedIn && (
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <div className="relative w-6 h-6">
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </button>
          </div>
          )}

          {/* Desktop Menu */}
          {isLoggedIn && (
          <div className="hidden md:flex md:items-center md:gap-1">
            {menu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          )}

          {/* Desktop Logout */}
          {isLoggedIn && (
          <div className="hidden md:flex md:items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isLoggedIn && (
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden pb-4 border-t border-gray-800 mt-2 pt-4`}
        >
          <div className="flex flex-col gap-1">
            {menu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 mt-2 border-t border-gray-800 pt-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
        )}
      </div>
    </nav>
  );
}
