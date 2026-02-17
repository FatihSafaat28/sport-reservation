"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Uncomment if API provides images

interface SportActivity {
  id: number;
  title: string;
  description: string;
  activity_date: string;
  start_time: string; // ISO String
  end_time: string;
  price: number;
  address: string;
  sport_category?: {
    name: string;
    image_url?: string;
  };
  participants_count?: number;
  max_participants?: number;
}

export default function UpcomingEvent() {
  const [events, setEvents] = useState<SportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Fallback or env

  useEffect(() => {
    const getDataEvent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/sport-activities`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const result = await response.json();
        console.log(result.result.data)
        
        // Adjust this depending on actual API structure. 
        // Assuming result.data contains the array or result itself is the array.
        const activities: SportActivity[] = result.result.data || result; 

        const now = new Date();

        const upcoming = activities
          .filter(event => new Date(event.activity_date) > now) // Filter future events
          .sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()) // Sort nearest first
          .slice(0, 4); // Take top 4

        setEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDataEvent();
  }, [BASE_URL]);

  if (isLoading) {
    return (
        <div className="flex flex-col gap-6 py-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold w-fit">Upcoming Sports Event</h2>
                <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold w-fit">
          Upcoming Sports Event
        </h2>
        <p className="text-gray-600 text-lg">Aktivitas terdekat yang bisa kamu ikuti sekarang.</p>
      </div>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => {
                return (
                    <Link href={`/activity/${event.id}`} key={event.id} className="group">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                                        {event.sport_category?.name || 'Sport'}
                                    </span>
                                    <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                        IDR {event.price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        <span className="line-clamp-1">{event.address}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 font-medium uppercase">Date</span>
                                    <span className="text-sm font-semibold text-gray-700">{event.activity_date}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 font-medium uppercase">Time</span>
                                    <span className="text-sm font-semibold text-gray-700">
                                        {event.start_time.split(':').slice(0, 2).join(':')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">Belum ada event olahraga yang tersedia saat ini.</p>
        </div>
      )}
    </div>
  )
}
