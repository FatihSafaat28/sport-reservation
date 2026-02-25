"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/authentication") || pathname.startsWith("/host/authentication");
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
