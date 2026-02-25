import React from "react";
import AdminNavbar from "./components/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50">{children}</main>
    </>
  );
}
