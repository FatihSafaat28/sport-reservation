"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check if user is logged in
    const token = sessionStorage.getItem("token");
    const name = sessionStorage.getItem("name");
    const role = sessionStorage.getItem("role");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserRole(role || "user");
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");

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
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
      window.location.href = "/";
    }
  };

  const menu = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];

  // ============================================
  // MOBILE UI
  // ============================================
  if (isMobile) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <h1 className="text-2xl font-bold text-white">Mabarin!</h1>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm">Hi, <span className="font-semibold text-white">{userName}</span></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative w-6 h-6">
                    {isOpen ? (
                      <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-4 shadow-xl text-center" id="mobile-menu">
            {/* Menu Links */}
            <div className="flex flex-col gap-2">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu (logged in) */}
            {isLoggedIn && (
              <div className="flex flex-col gap-1 pt-4 border-t border-gray-800">
                <Link
                  href={userRole === "admin" ? "/host/profile" : "/profile"}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {userRole === "admin" ? (
                  <Link
                    href="/host/myevents"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                    onClick={() => setIsOpen(false)}
                  >
                    My Events
                  </Link>
                ) : (
                  <Link
                    href="/profile/transaction"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Transaction
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block text-center"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Auth Buttons (not logged in) */}
            {!isLoggedIn && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                <Link
                  href="/authentication/login"
                  className="px-5 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/authentication/register"
                  className="px-5 py-2 w-full border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold rounded-full transition-all duration-200 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }

  // ============================================
  // DESKTOP / TABLET UI
  // ============================================
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="mx-auto px-8 xl:max-w-[1440px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Mabarin!</h1>
            </Link>
          </div>

          {/* Menu + Auth Section */}
          <div className="flex items-center justify-between w-full">
            {/* Center Spacer */}
            <div className="w-px"></div>

            {/* Menu Links */}
            <div className="flex items-center gap-6">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
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
                        href={userRole === "admin" ? "/host/profile" : "/profile"}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      {userRole === "admin" ? (
                        <Link
                          href="/host/myevents"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Events
                        </Link>
                      ) : (
                        <Link
                          href="/profile/transaction"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Transaction
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
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
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/authentication/register"
                    className="px-5 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold rounded-full transition-all duration-200 text-center"
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
