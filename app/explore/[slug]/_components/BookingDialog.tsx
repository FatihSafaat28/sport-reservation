'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { SportActivity } from '@/lib/interface/sportactivity';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BookingDialogProps {
  activity: SportActivity;
  className?: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  image_url: string;
  virtual_account_number: string;
  virtual_account_name: string;
}

export default function BookingDialog({ activity, className }: BookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && paymentMethods.length === 0) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    setIsLoadingMethods(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`);
      const data = await response.json();
      if (response.ok) {
        setPaymentMethods(data.result);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods', error);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  const handleBookClick = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Please login first to book an activity.");
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPaymentId) {
      alert("Please select a payment method.");
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sport_activity_id: activity.id,
          payment_method_id: selectedPaymentId
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Booking successful!");
        setIsOpen(false);
        router.push('/dashboard'); // Redirect to dashboard or relevant page
      } else {
        alert(result.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred during booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!activity) return null;

  return (
    <>
      <button onClick={handleBookClick} className={className}>
        Book Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-2">
                        {activity.sport_category?.name || "Sport Event"}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Confirm Booking</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Activity Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Activity</label>
                    <p className="font-semibold text-gray-900 text-lg">{activity.title}</p>
                  </div>
                  
                  
                  <div>
                     <label className="text-xs font-medium text-gray-500 uppercase">Price</label>
                     <p className="text-xl font-bold text-blue-600">{formatPrice(activity.price)}</p>
                  </div>

                  <div>
                     <label className="text-xs font-medium text-gray-500 uppercase">Date</label>
                     <p className="font-medium text-gray-900">{formatDate(activity.activity_date)}</p>
                  </div>

                  <div>
                     <label className="text-xs font-medium text-gray-500 uppercase">Time</label>
                     <p className="font-medium text-gray-900">
                        {activity.start_time.split(":").slice(0, 2).join(":")} - {activity.end_time.split(":").slice(0, 2).join(":")}
                     </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Location</label>
                    <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{activity.address}</p>
                        <p className="text-gray-500">{activity.city?.city_name}, {activity.city?.province?.province_name}</p>
                        {activity.map_url && (
                             <a 
                                href={activity.map_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1 mt-2 font-medium"
                             >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                View Location
                             </a>
                        )}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                   <label className="text-sm font-bold text-gray-900 mb-3 block">Payment Method</label>
                   {isLoadingMethods ? (
                      <div className="flex justify-center items-center py-8">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                   ) : (
                      <div className="space-y-2 h-fit overflow-y-auto px-2 py-1">
                         {paymentMethods.length > 0 ? (
                           paymentMethods.map((method) => (
                             <button
                               key={method.id}
                               onClick={() => setSelectedPaymentId(method.id)}
                               className={`w-full text-left p-3 rounded-xl border transition-all ${
                                 selectedPaymentId === method.id 
                                 ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                                 : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                               }`}
                             >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     {method.image_url ? (
                                        <div className="h-8 w-12 relative shrink-0">
                                           <img 
                                              src={method.image_url} 
                                              alt={method.name} 
                                              className="w-full h-full object-contain"
                                           />
                                        </div>
                                     ) : (
                                        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-bold">
                                           {method.name.charAt(0)}
                                        </div>
                                     )}
                                     <span className={`font-medium text-sm ${selectedPaymentId === method.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {method.name}
                                     </span>
                                  </div>
                                  {selectedPaymentId === method.id && (
                                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                     </svg>
                                  )}
                                </div>
                                {selectedPaymentId === method.id && (
                                <div className="p-1 text-xs text-gray-600">
                                      <p><span className="font-semibold">Account Name:</span> {method.virtual_account_name}</p>
                                      <p><span className="font-semibold">Account Number:</span> {method.virtual_account_number}</p>
                                </div>
                                )}
                             </button>
                           ))
                         ) : (
                             <p className="text-sm text-gray-500">No payment methods available.</p>
                         )}
                      </div>
                   )}
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || !selectedPaymentId}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Processing...
                    </span>
                  ) : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
