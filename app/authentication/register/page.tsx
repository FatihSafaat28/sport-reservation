"use client";
import React from "react";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setConfirmPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    c_password: string;
    phone_number: string;
    role: string;
  };
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: RegisterPayload = {
      name,
      email,
      password,
      c_password,
      phone_number,
      role: "user",
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
        alert("Register Gagal! Coba cek email / password mu!");
      } else {
        alert("Register Berhasil!");
        router.push("/authentication/login");
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
            <h1 className="text-2xl font-bold">REGISTER</h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Username</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Konfirmasi Password</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={c_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Phone Number</label>
                <input
                  className="border border-gray-200 rounded-lg p-2"
                  type="text"
                  placeholder="Phone Number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex mt-8">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-4 py-2 rounded-lg text-white"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
