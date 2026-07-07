import { API_BASE_URL } from "@/lib/config";
import { SportActivity } from "@/lib/interface/sportactivity";
import Link from "next/link";
import ParticipantsList from "./ParticipantsList";
import BookingDialog from "./BookingDialog";
import BookingWrapper from "./BookingWrapper";
import { parseEventDescription } from "@/lib/utils/eventHelper";


export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(`${API_BASE_URL}/sport-activities/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch events");
  const result = await response.json();
  const activity: SportActivity = result.result

  // Parse description metadata
  const { mainDescription, paymentInfo } = parseEventDescription(activity.description);

  // Check if event is expired
  const eventEnd = new Date(`${activity.activity_date}T${activity.end_time}`);
  const isExpired = eventEnd < new Date();

  // Check if event is fully booked
  const isFullyBooked = (activity.participants?.length || 0) >= activity.slot;


  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-[65px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link
            href="/explore"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {activity.title}
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-3">
                {activity.sport_category?.name || "Sport Event"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {activity.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(activity.activity_date)}
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activity.start_time.split(":").slice(0, 2).join(":")} - {activity.end_time.split(":").slice(0, 2).join(":")}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activity.city?.city_name_full}, {activity.city?.province?.province_name}
                </div>
              </div>

               {/* Booking Section */}
               <BookingWrapper>
               <div className="hidden md:block lg:hidden mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-medium">Price</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(activity.price)}
                    </span>
                  </div>
                   {isExpired ? (
                     <button disabled className="w-full py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed">
                       Event Ended
                     </button>
                   ) : isFullyBooked ? (
                     <button disabled className="w-full py-3 bg-orange-400 text-white font-semibold rounded-xl cursor-not-allowed">
                       Fully Booked
                     </button>
                   ) : (
                     <BookingDialog 
                       activity={activity} 
                       className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200 cursor-pointer"
                     />
                   )}
               </div>
               </BookingWrapper>
            </div>

            {/* Description */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {mainDescription}
              </p>
            </section>

            {/* Organizer */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Organizer</h2>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                    {activity.organizer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{activity.organizer.name}</h3>
                    <p className="text-gray-500 text-sm">Event Organizer</p>
                  </div>
                </div>
                {paymentInfo?.phone && (
                  <a
                    href={`https://wa.me/${paymentInfo.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.86.002-2.636-1.023-5.11-2.884-6.973C16.59 1.908 14.12 .883 11.486.883c-5.44 0-9.866 4.418-9.87 9.861-.002 1.814.478 3.59 1.39 5.162l-.994 3.63 3.725-.977zm11.387-7.716c-.301-.15-1.78-.879-2.056-.979-.275-.1-.475-.15-.675.15-.1.15-.3.35-.425.5-.125.15-.25.15-.55 0-2.979-1.49-3.675-2.071-4.225-3.021-.125-.225-.25-.375-.375-.525-.125-.15-.225-.225-.375-.225-.15 0-.3 0-.45.075-.15.075-.6 1.05-.6 2.025 0 .975.7 1.925.8 2.05.1.125 1.375 2.1 3.325 2.95.45.2.825.325 1.125.425.475.15.9.125 1.25.075.375-.05 1.78-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                    </svg>
                    Chat Host
                  </a>
                )}
              </div>
            </section>

             {/* Location */}
             <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </div>
                 <div>
                    <p className="text-gray-900 font-medium">{activity.address}</p>
                    <p className="text-gray-500 text-sm mt-1">{activity.city?.city_name_full}, {activity.city?.province?.province_name}</p>
                    <Link href={activity.map_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-flex items-center gap-1">
                        View on Google Maps
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </Link>
                 </div>
              </div>
            </section>

            {/* Participants */}
            <ParticipantsList participants={activity.participants || []} totalSlots={activity.slot} />
          </div>

          {/* Sidebar - Desktop Price Card */}
          <BookingWrapper>
          <div className="hidden lg:block">
            <div className="sticky top-[168px] bg-white rounded-2xl p-6 shadow-lg ring-1 ring-gray-100">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 font-medium">Price</span>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(activity.price)}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">{formatDate(activity.activity_date)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium text-gray-900">{activity.start_time.split(":").slice(0, 2).join(":")} WIB</span>
                    </div>
                </div>



                {isExpired ? (
                  <button disabled className="w-full py-3.5 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed">
                    Event Ended
                  </button>
                ) : isFullyBooked ? (
                  <button disabled className="w-full py-3.5 bg-orange-400 text-white font-semibold rounded-xl cursor-not-allowed">
                    Fully Booked
                  </button>
                ) : (
                  <BookingDialog 
                    activity={activity}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] cursor-pointer"
                  />
                )}
                
                <p className="text-xs text-center text-gray-400 mt-2">
                  Secure transaction guaranteed
                </p>
              </div>
            </div>
          </div>
          </BookingWrapper>
        </div>
      </div>

          {/* Mobile Sticky Footer Price */}
          <BookingWrapper>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 safe-area-bottom">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(activity.price)}</p>
              </div>
              {isExpired ? (
                <button disabled className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed">
                  Event Ended
                </button>
              ) : isFullyBooked ? (
                <button disabled className="px-8 py-3 bg-orange-400 text-white font-semibold rounded-xl cursor-not-allowed">
                  Fully Booked
                </button>
              ) : (
                <BookingDialog 
                  activity={activity}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 cursor-pointer"
                />
              )}
            </div>
          </div>
          </BookingWrapper>
    </main>
  );
}
