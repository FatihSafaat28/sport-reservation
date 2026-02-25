"use client";

import { useState, useEffect } from "react";

export default function BookingWrapper({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  if (isAdmin) return null;

  return <>{children}</>;
}
