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
  const isAuthPage = pathname.startsWith("/authentication");

  return (
    <>
      <Navbar />
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
