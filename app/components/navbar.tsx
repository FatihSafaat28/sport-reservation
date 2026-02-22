"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem("token");
    const name = sessionStorage.getItem("name");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Get token BEFORE removing it
      const token = sessionStorage.getItem("token");

      // Call logout API
      const logout = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await logout.json();

      if (!result) {
        alert("Logout Gagal!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("name");

      // Redirect to home with hard refresh
      window.location.href = "/";
    }
  };

  const menu = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="mx-auto px-8 md:px-8 xl:max-w-[1440px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <h1 className="text-2xl font-bold text-white">Mabarin!</h1>
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon switching */}
              <div className="relative w-6 h-6">
                {isOpen ? (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Merged Menu & Buttons */}
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } text-center absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 flex-col gap-4 shadow-xl md:flex md:static md:flex-row md:items-center md:justify-between md:bg-transparent md:border-none md:shadow-none md:p-0 md:w-full`}
            id="navbar-menu"
          >
            {/* Desktop Center Spacer (Invisible) to help center the menu */}
            <div className="hidden md:block w-px"></div>

            {/* Desktop/Mobile Menu Links */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {/* Desktop/Mobile Auth Buttons */}
            <div className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row md:items-center gap-3 pt-4 border-t border-gray-800 md:pt-0 md:border-none`}>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors focus:outline-none"
                  >
                    <span className="text-sm">Hi, <span className="font-semibold text-white">{userName}</span></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/profile/transaction"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        Transaction
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                          setIsOpen(false);
                        }}
                        className="block w-full text-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/authentication/login"
                    className="px-5 py-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/authentication/register"
                    className="px-5 py-2 w-full md:w-auto border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold rounded-full transition-all duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
