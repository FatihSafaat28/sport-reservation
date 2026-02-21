"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { User } from "@/lib/interface/user";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/authentication/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        setEditName(result.data.name);
        setEditPhone(result.data.phone_number);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/update-user/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          phone_number: editPhone,
          email: user.email,
          role: user.role,
        }),
      });

      const result = await response.json();
      if (!result.error) {
        alert("Profile updated successfully!");
        setUser({ ...user, name: editName, phone_number: editPhone });
        setIsEditing(false);
        sessionStorage.setItem("name", editName);
        window.location.reload(); 
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/update-user/${user.id}`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email,
            role: user.role,
            phone_number: user.phone_number,
            password: newPassword,
            c_password: confirmPassword
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Password changed successfully!");
        setIsChangingPassword(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(result.message || "Failed to change password");
      }
    } catch (error) {
        console.error("Error changing password:", error);
        alert("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Header Skeleton */}
          <div>
            <div className="h-8 w-56 bg-gray-200 rounded-md animate-pulse" />
            <div className="mt-2 h-4 w-80 bg-gray-200 rounded-md animate-pulse" />
          </div>

          {/* Personal Information Card Skeleton */}
          <div className="bg-white sm:rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-4 py-5 sm:p-6">
              {/* Card Title */}
              <div className="h-5 w-44 bg-gray-200 rounded-md animate-pulse mb-4" />

              {/* 3-column fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="mt-2 h-4 w-32 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Edit Button Skeleton */}
                <div className="mt-4">
                  <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Card Skeleton */}
          <div className="bg-white sm:rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-4 py-5 sm:p-6">
              {/* Card Title */}
              <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-4" />

              {/* Change Password Button Skeleton */}
              <div className="h-9 w-40 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center pt-20">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white sm:rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Personal Information
            </h3>
            
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                   <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className={`mt-1 text-sm ${user.phone_number ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {user.phone_number || "Add your phone number"}
                    </dd>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                     <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 text-sm text-gray-500">
                        {user.email} (Cannot be changed)
                    </div>
                  </div>

                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setEditName(user.name);
                        setEditPhone(user.phone_number);
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white sm:rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Security
            </h3>
            
            {!isChangingPassword ? (
                 <button
                 onClick={() => setIsChangingPassword(true)}
                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
               >
                 Change Password
               </button>
            ) : (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                     <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="mt-1">
                            <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <div className="mt-1">
                            <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
                            />
                        </div>
                    </div>
                     <div className="flex gap-3">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update Password
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsChangingPassword(false);
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
