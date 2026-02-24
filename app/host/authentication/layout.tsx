import React from "react";
import Image from "next/image";

export default function HostAuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1470&auto=format&fit=crop"
          alt="Sport Event Host"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Kelola Event Olahragamu!</h2>
          <p className="text-lg text-gray-200">
            Buat dan kelola event olahraga di Mabarin. Jangkau lebih banyak peserta dan buat event yang seru!
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
