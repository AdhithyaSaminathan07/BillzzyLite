'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Filter, X, Receipt, Wallet, CreditCard, Smartphone } from 'lucide-react';

interface Bill {
  createdAt: string;
  amount: number;
  paymentMethod: string;
}

export default function BillingHistory() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
    fetchHistory('', ''); // Fetch all bills initially
  }, []);

  const fetchHistory = async (from: string, to: string) => {
    try {
      const url = from && to 
        ? `/api/billing-history?from=${from}&to=${to}`
        : '/api/billing-history'; // Fetch all if no dates
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch billing history');
      const data = await res.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching billing history:', error);
      setBills([]);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(fromDate, toDate);
    setShowFilters(false);
  };

  const handleClear = () => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
    fetchHistory('', ''); // Fetch all bills
    setShowFilters(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPaymentIcon = (method: string) => {
    const methodLower = method.toLowerCase();
    if (methodLower === 'cash') return <Wallet className="w-4 h-4" />;
    if (methodLower === 'qr' || methodLower === 'upi') return <Smartphone className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  const getPaymentColor = (method: string) => {
    const methodLower = method.toLowerCase();
    if (methodLower === 'cash') return 'bg-green-100 text-green-700 border-green-200';
    if (methodLower === 'qr' || methodLower === 'upi') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="h-full bg-gray-50 overflow-y-auto pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">Billing History</h1>
                <p className="text-xs text-gray-500">{bills.length} transactions</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
            >
              {showFilters ? <X className="w-5 h-5 text-indigo-600" /> : <Filter className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleFilter} className="space-y-2.5 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">From Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">To Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Apply Filter
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Bar */}
        {bills.length > 0 && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Total Amount</span>
              <span className="text-lg font-bold text-indigo-700">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bills List */}
      <div className="p-3">
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No bills found</p>
            <p className="text-xs text-gray-500">Try adjusting your date filters</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {bills.map((bill, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-3.5">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Bill #{bills.length - index}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(bill.createdAt)}</span>
                          <span>•</span>
                          <span>{formatTime(bill.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{bill.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Payment Method</span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getPaymentColor(bill.paymentMethod)}`}>
                      {getPaymentIcon(bill.paymentMethod)}
                      <span className="text-xs font-semibold capitalize">{bill.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}