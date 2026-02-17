export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Anda bisa menambahkan konstanta global lainnya di sini
export const API_VERSION = "v1";
export const API_BASE_URL = `${BASE_URL}/api/${API_VERSION}`;
