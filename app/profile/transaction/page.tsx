"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { TransactionDetail } from "@/lib/interface/transactiondetail";

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofUrlInputs, setProofUrlInputs] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/authentication/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/my-transaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const result = await response.json();
      console.log(result.result.data)
      if (!result.result.error) {
        setTransactions(result.result.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProofUrlChange = (transactionId: string, value: string) => {
    setProofUrlInputs(prev => ({
      ...prev,
      [transactionId]: value
    }));
  };

  const handleUploadProof = async (transactionId: string) => {
    const url = proofUrlInputs[transactionId];
    if (!url) {
      alert("Please enter a URL first");
      return;
    }

    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/update-proof-payment/${transactionId}`, {
        method: "POST", // API for update usually POST or PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proof_payment_url: url
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Proof of payment updated successfully!");
        fetchTransactions(); // Refresh list to see updated status or url
        setProofUrlInputs(prev => {
            const newState = {...prev};
            delete newState[transactionId];
            return newState;
        });
      } else {
        alert(result.message || "Failed to update proof of payment");
      }
    } catch (error) {
      console.error("Error updating proof of payment:", error);
      alert("An error occurred");
    }
  };


  if (loading) {
     return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Transactions</h1>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      Invoice: {transaction.invoice_id}
                    </h3>
                    <div className="text-sm text-gray-500 space-y-0.5">
                        <p>Order Date: {new Date(transaction.order_date).toLocaleDateString()}</p>
                        {transaction.expired_date && (
                            <p className="text-red-500">Expires: {new Date(transaction.expired_date).toLocaleString()}</p>
                        )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    transaction.status === 'success' || transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </div>
                </div>

                {/* Activity Snapshot */}
                {transaction.transaction_items?.sport_activities && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <h4 className="font-semibold text-gray-900 truncate">
                            {transaction.transaction_items.sport_activities.title}
                        </h4>
                        <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {new Date(transaction.transaction_items.sport_activities.activity_date).toLocaleDateString()}
                            </div>
                             <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {transaction.transaction_items.sport_activities.start_time} - {transaction.transaction_items.sport_activities.end_time}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                   <div className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                      <span className="font-bold text-lg text-gray-900">
                         IDR {transaction.total_amount ? transaction.total_amount.toLocaleString() : 'N/A'}
                      </span>
                   </div>

                  <button
                    onClick={() => router.push(`/profile/transaction/${transaction.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
