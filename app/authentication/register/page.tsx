"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [activeTab, setActiveTab] = useState<"user" | "host">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setConfirmPassword] = useState("");
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
      router.replace("/authentication/register?role=host", { scroll: false });
    } else {
      router.replace("/authentication/register", { scroll: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== c_password) {
      toast.error("Password dan Confirm Password tidak sama!");
      return;
    }
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      c_password,
      phone_number: "",
      role: activeTab === "host" ? "admin" : "user",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error("Register Gagal! Coba cek email / password mu!");
      } else {
        toast.success("Register Berhasil!");
        const loginRedirectPath =
          activeTab === "host"
            ? "/authentication/login?role=host"
            : "/authentication/login";
        router.push(loginRedirectPath);
      }
    } catch (error) {
      console.error("Error during register:", error);
      toast.error("Terjadi kesalahan saat pendaftaran. Silakan coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to start booking your mabar events
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
            type="text"
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="c_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="c_password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
              type="password"
              placeholder="••••••••"
              value={c_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/20 mt-2 cursor-pointer flex items-center justify-center gap-2"
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
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={
            activeTab === "host"
              ? "/authentication/login?role=host"
              : "/authentication/login"
          }
          className="font-semibold text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function Register() {
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
      <RegisterForm />
    </Suspense>
  );
}
