"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function AuthSideContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const isHost = role === "host";

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
      {/* Background Images with smooth crossfade */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sport and Fitness"
          fill
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            isHost ? "opacity-0" : "opacity-100"
          }`}
          priority
        />
        <Image
          src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1470&auto=format&fit=crop"
          alt="Sport Event Host"
          fill
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            isHost ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>

      {/* Dynamic Text with transition */}
      <div className="relative z-20 p-12 text-white w-full h-full flex flex-col justify-center max-w-lg mx-auto">
        {/* User Content */}
        <div
          className={`transition-all duration-500 transform ${
            isHost
              ? "opacity-0 translate-y-4 pointer-events-none absolute"
              : "opacity-100 translate-y-0 relative"
          }`}
        >
          <h2 className="text-4xl font-bold mb-6">Ayo Bergabung di Mabarin Sport!</h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Temukan teman mabar olahraga favoritmu dan ikuti berbagai event seru.
            Jangan sampai ketinggalan, daftar sekarang dan mulai aksimu!
          </p>
        </div>

        {/* Host Content */}
        <div
          className={`transition-all duration-500 transform ${
            isHost
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 -translate-y-4 pointer-events-none absolute"
          }`}
        >
          <h2 className="text-4xl font-bold mb-6">Kelola Event Olahragamu!</h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Buat dan kelola event olahraga di Mabarin. Jangkau lebih banyak peserta
            dan buat event yang seru!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden">
      {/* Left side - Dynamic Image & Text */}
      <Suspense
        fallback={
          <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>
        }
      >
        <AuthSideContent />
      </Suspense>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
