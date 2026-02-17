"use client";
import React from "react";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  type LoginPayload = {
    email: string;
    password: string;
  };
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: LoginPayload = {
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
        alert("Login Gagal! Coba cek email / password mu!");
      } else {
        alert("Login Berhasil!");
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("email", result.data.email);
        sessionStorage.setItem("name", result.data.name);
        // Use window.location for hard refresh to update navbar
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <main>
      <section className="px-8 sm:px-12 lg:px-20 py-6">
        <div className="w-fit mx-auto flex justify-center items-center flex-col gap-4 border border-gray-200 rounded-lg p-6 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">LOGIN</h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex mt-8">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-4 py-2 rounded-lg text-white"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
