import React from "react";
import Link from "next/link";

export interface SportActivity {
  id: number;
  title: string;
  description: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  price: number;
  address: string;
  city: {
    city_name: string;
    province: {
      province_name: string;
    };
  };
  organizer: {
    name: string;
    email: string;
  };
  sport_category?: {
    name: string;
  };
  participants: {
    user : {
      name : string;
    }
  }[]
  slot: number;
}

interface EventCardItemsProps {
  event: SportActivity;
}

export default function EventCardItems({ event }: EventCardItemsProps) {
  return (
    <Link href={`/activity/${event.id}`} className="group">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">
              {event.sport_category?.name || "Sport"}
            </span>
            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              IDR {event.price.toLocaleString("id-ID")}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="line-clamp-1">
                  {event.address}, {event.city.city_name},{" "}
                  {event.city.province.province_name}
                </span>
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="line-clamp-1">{event.organizer.name}</span>
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  {event.participants.length || 0} / {event.slot} Participants
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase">
              Date
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {event.activity_date}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 font-medium uppercase">
              Time
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {event.start_time.split(":").slice(0, 2).join(":")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
