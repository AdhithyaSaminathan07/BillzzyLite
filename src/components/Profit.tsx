'use client';
import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function ProfitSection() {
  const [activeTab, setActiveTab] = useState('daily');

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
        <div className="grid grid-cols-3 gap-2">
          {['daily', 'weekly', 'monthly'].map((tab) => (
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
      </div>

      {/* Content Area - Static Height Container for stability */}
      <div className="p-4 md:p-6">
        <div className="min-h-[250px] flex flex-col items-center justify-center text-center py-8 md:py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Profit Data
          </h3>
          
          <p className="text-xs md:text-sm text-gray-500 max-w-[250px] md:max-w-md mx-auto">
            Connect your backend API to visualize real-time {activeTab} profit statistics here.
          </p>

          {/* Simulated Data Pill (Static Visual) */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Waiting for data...
          </div>

        </div>
      </div>
    </div>
  );
}