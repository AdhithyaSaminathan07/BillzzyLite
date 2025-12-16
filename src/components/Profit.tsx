'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Loader2, AlertCircle } from 'lucide-react';

export default function ProfitSection() {
  const [activeTab, setActiveTab] = useState('daily');
  const [profitData, setProfitData] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Custom Date State
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    const fetchProfit = async () => {
      setLoading(true);
      setError('');
      try {
        let url = '';
        if (activeTab === 'custom') {
          if (!customStart || !customEnd) {
            setLoading(false);
            return; // Don't fetch if dates are missing
          }
          url = `/api/sales?startDate=${customStart}&endDate=${customEnd}`;
        } else {
          const periodParam = activeTab === 'daily' ? 'today' : activeTab;
          url = `/api/sales?period=${periodParam}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setProfitData(data.profit || 0);
      } catch (err) {
        setError('Failed to load profit data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, [activeTab, customStart, customEnd]); // Re-run when dates change

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full">

      {/* Header */}
      <div className="p-4 md:p-6 flex items-center gap-3 border-b border-gray-200">
        <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5a4fcf' }}>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Profit Overview</h2>
          <p className="text-xs md:text-sm text-gray-500">Track your earnings & growth</p>
        </div>
      </div>

      {/* Tab Navigation - Optimized for Mobile */}
      <div className="bg-gray-50 p-3 md:p-4">
        {/* Using Grid to keep tabs equal width on all screens */}
        <div className="grid grid-cols-4 gap-2">
          {['daily', 'weekly', 'monthly', 'custom'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 
                py-2 sm:py-3 px-1 sm:px-4 rounded-lg 
                text-xs sm:text-sm font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'text-white shadow-md transform scale-[1.02]'
                  : 'text-gray-600 bg-white hover:bg-gray-200 border border-gray-100'}
              `}
              style={activeTab === tab ? { backgroundColor: '#5a4fcf' } : {}}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {/* Custom Date Inputs */}
        {activeTab === 'custom' && (
          <div className="mt-3 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">From Date</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">To Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Area - Static Height Container for stability */}
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center text-center py-8 md:py-12 bg-gray-50 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#5a4fcf] mb-2" />
            <p className="text-sm text-gray-500">Calculating profit...</p>
          </div>
        ) : error ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center text-center py-8 md:py-12 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => setActiveTab(activeTab)} className="mt-2 text-xs text-red-700 underline">Retry</button>
          </div>
        ) : (
          <div className="min-h-[250px] flex flex-col items-center justify-center text-center py-8 md:py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5a4fcf]/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm z-10">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 z-10">
              Total {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Profit
            </h3>

            <div className="text-3xl md:text-4xl font-bold text-green-700 my-2 z-10">
              {formatCurrency(profitData || 0)}
            </div>

            <p className="text-xs md:text-sm text-gray-500 z-10">
              Net profit from sales {activeTab === 'custom' ? 'for selected range' : `this ${activeTab === 'daily' ? 'day' : activeTab === 'weekly' ? 'week' : 'month'}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}