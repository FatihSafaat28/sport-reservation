"use client";
import React, { useEffect, useState } from "react";

import { API_BASE_URL } from "@/lib/config";
// import Image from 'next/image'; // Uncomment if API provides images

import EventCardItems, { SportActivity } from "./components/event-card-items";

export default function UpcomingEvent() {
  const [events, setEvents] = useState<SportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDataEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sport-activities?per_page=999`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const result = await response.json();
        const activities: SportActivity[] = result.result.data;
        
        const now = new Date();

        const upcoming = activities
          .filter((event) => new Date(event.activity_date) > now) // Filter future events
          .sort(
            (a, b) =>
              new Date(a.activity_date).getTime() -
              new Date(b.activity_date).getTime(),
          ) // Sort nearest first
          .slice(0, 4); // Take top 4

        setEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDataEvent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold w-fit">Upcoming Event Mabar</h2>
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold w-fit">Upcoming Event Mabar</h2>
        <p className="text-gray-600 text-lg">
          Jadwal event mabar terdekat yang bisa kamu ikuti sekarang.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => {
            return (
              <EventCardItems key={event.id} event={event} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">
            Belum ada event olahraga yang tersedia saat ini.
          </p>
        </div>
      )}
    </div>
  );
}
