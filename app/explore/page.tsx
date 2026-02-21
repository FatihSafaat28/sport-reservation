import { Suspense } from "react";
import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import FilterActivity from "./filteractivity";
import ActivityList from "./activitylist";

interface ExplorePageProps {
  searchParams: Promise<{
    search?: string;
    sport_category_id?: string;
    city_id?: string;
  }>;
}

async function fetchActivities(
  search: string,
  sportCategoryId: string,
  cityId: string
): Promise<SportActivity[]> {
  try {
    const params = new URLSearchParams({
      is_paginate: "false",
    });

    if (search) params.set("search", search);
    if (sportCategoryId) params.set("sport_category_id", sportCategoryId);
    if (cityId) params.set("city_id", cityId);

    const res = await fetch(
      `${API_BASE_URL}/sport-activities?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch activities");

    const json = await res.json();
    const data: SportActivity[] = json.result || [];
    return data.sort((a, b) =>
      new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()
    );
  } catch (err) {
    console.error("Error fetching activities:", err);
    return [];
  }
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const sportCategoryId = params.sport_category_id || "";
  const cityId = params.city_id || "";

  const activities = await fetchActivities(search, sportCategoryId, cityId);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Filter Section */}
      <Suspense fallback={<FilterSkeleton />}>
        <FilterActivity />
      </Suspense>

      {/* Activity List */}
      <ActivityList activities={activities} />
    </main>
  );
}

function FilterSkeleton() {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-[65px] z-10 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[58px] bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-[42px] mt-3 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex gap-2 mt-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[32px] w-24 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
