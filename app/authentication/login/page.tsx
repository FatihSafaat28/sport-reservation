"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [activeTab, setActiveTab] = useState<"user" | "host">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleParam === "host") {
      setActiveTab("host");
    } else {
      setActiveTab("user");
    }
  }, [roleParam]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleTabChange = (tab: "user" | "host") => {
    setActiveTab(tab);
    if (tab === "host") {
      router.replace("/authentication/login?role=host", { scroll: false });
    } else {
      router.replace("/authentication/login", { scroll: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error("Login Gagal! Coba cek email / password mu!");
      } else {
        // Fetch user profile to get role and validate
        try {
          const meResponse = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              Authorization: `Bearer ${result.data.token}`,
            },
          });
          const meResult = await meResponse.json();

          if (meResult.success && meResult.data) {
            const userRole = meResult.data.role;
            const requiredRole = activeTab === "host" ? "admin" : "user";

            if (userRole !== requiredRole) {
              // Role mismatch, perform logout
              await fetch(`${API_BASE_URL}/logout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${result.data.token}`,
                },
              });
              toast.error("Login Gagal! Coba cek email / password mu!");
              return;
            }

            // Save credentials
            sessionStorage.setItem("token", result.data.token);
            sessionStorage.setItem("email", result.data.email);
            sessionStorage.setItem("name", result.data.name);
            sessionStorage.setItem("role", userRole);

            toast.success("Login Berhasil!");
            // Jeda agar user melihat toast sebelum halaman dimuat ulang
            await new Promise((resolve) => setTimeout(resolve, 800));
            window.location.href = "/";
          } else {
            toast.error("Terjadi kesalahan data profil. Coba lagi!");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          toast.error("Gagal melakukan login. Masalah koneksi profil.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Terjadi kesalahan saat masuk. Silakan coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and password to login.
        </p>
      </div>

      {/* Premium Sliding Tab Switcher */}
      <div className="relative flex p-1 bg-gray-100 rounded-full">
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-blue-600 rounded-full transition-transform duration-300 ease-out shadow-md ${
            activeTab === "host" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          onClick={() => handleTabChange("user")}
          className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            activeTab === "user" ? "text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Member
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("host")}
          className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            activeTab === "host" ? "text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Host Event
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href={
            activeTab === "host"
              ? "/authentication/register?role=host"
              : "/authentication/register"
          }
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
