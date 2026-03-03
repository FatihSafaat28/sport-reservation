import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mabarin - Platform Reservasi Olahraga & Mabar",
    template: "%s | Mabarin",
  },
  description:
    "Cari event olahraga, booking dengan mudah, dan langsung mabar tanpa ribet! Temukan aktivitas olahraga terdekat dan bergabung bersama komunitas di Mabarin.",
  keywords: [
    "olahraga",
    "reservasi olahraga",
    "mabar",
    "sport reservation",
    "event olahraga",
    "booking lapangan",
    "komunitas olahraga",
    "Mabarin",
  ],
  authors: [{ name: "Mabarin Team" }],
  openGraph: {
    title: "Mabarin - Platform Reservasi Olahraga & Mabar",
    description:
      "Cari event olahraga, booking dengan mudah, dan langsung mabar tanpa ribet!",
    siteName: "Mabarin",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mabarin - Platform Reservasi Olahraga & Mabar",
    description:
      "Cari event olahraga, booking dengan mudah, dan langsung mabar tanpa ribet!",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    // Basketball icons created by ranksol graphics - Flaticon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
      
    </html>
  );
}
