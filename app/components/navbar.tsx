'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="mx-auto px-8 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <h1 className="text-2xl font-bold text-white">
                Mabarin!
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
              Login
            </button>
            <button className="px-5 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-semibold rounded-full transition-all duration-200">
              Register
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon switching logic */}
              <div className="relative w-6 h-6">
                <svg
                  className={`absolute inset-0 w-6 h-6 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`absolute inset-0 w-6 h-6 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-gray-900 border-t border-gray-800 shadow-xl">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-3 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-800 flex flex-col gap-3">
            <button className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20">
              Login
            </button>
            <button className="w-full px-5 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white text-base font-semibold rounded-lg transition-all">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
