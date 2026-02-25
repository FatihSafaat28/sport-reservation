import React from "react";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
}
