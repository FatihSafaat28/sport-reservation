import React from "react";
import Image from "next/image";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        {/* Overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sport and Fitness"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Ayo Bergabung di Mabarin Sport!</h2>
          <p className="text-lg text-gray-200">
            Temukan teman mabar olahraga favoritmu dan ikuti berbagai event seru. Jangan sampai ketinggalan, daftar sekarang dan mulai aksimu!
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
