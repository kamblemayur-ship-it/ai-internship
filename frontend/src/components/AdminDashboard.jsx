import React from 'react';
import DashboardLayout from './DashboardLayout';

export default function AdminDashboard() {
  // Mock Data matching Image #5
  const topMetrics = [
    { label: "Total Students", value: "20", icon: "M12 14l9-5-9-5-9 5 9 5z" },
    { label: "Total Companies", value: "10", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16h14z" },
    { label: "Total Internships", value: "12", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "AI Accuracy", value: "94.7%", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ];

  // Data for the Bar Chart
  const sectorData = [
    { sector: "IT", capacity: 80, demand: 120 },
    { sector: "Fintech", capacity: 50, demand: 80 },
    { sector: "Marketing", capacity: 100, demand: 90 },
    { sector: "Data Science", capacity: 60, demand: 150 },
  ];

  return (
    <DashboardLayout role="Admin">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">System-wide analytics, capacity monitoring, and AI fairness metrics.</p>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metric.icon}></path>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">{metric.label}</div>
                <div className="text-2xl font-extrabold text-slate-800">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bar Chart: Demand vs Capacity */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Demand vs Capacity by Sector</h3>
            
            {/* Pure CSS Bar Chart */}
            <div className="relative h-64 border-b border-l border-slate-200 pb-2 pl-2 flex items-end justify-around pt-4">
              
              {/* Y-Axis Labels (Simulated) */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between -ml-8 text-xs text-slate-400 py-2">
                <span>160</span>
                <span>120</span>
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-slate-100 w-full z-0"></div>
                ))}
              </div>

              {/* Bars */}
              {sectorData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 z-10 h-full justify-end">
                  <div className="flex gap-2 items-end h-[85%]">
                    {/* Capacity Bar (Green) */}
                    <div 
                      className="w-8 bg-[#8dbd8d] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer group relative"
                      style={{ height: `${(data.capacity / 160) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {data.capacity}
                      </div>
                    </div>
                    {/* Demand Bar (Blue) */}
                    <div 
                      className="w-8 bg-[#6b8cce] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer group relative"
                      style={{ height: `${(data.demand / 160) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {data.demand}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-2">{data.sector}</span>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8dbd8d] rounded-sm"></div>
                <span className="text-xs text-slate-600">Internship Capacity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#6b8cce] rounded-sm"></div>
                <span className="text-xs text-slate-600">Student Demand</span>
              </div>
            </div>
          </div>

          {/* Pie Chart: Diversity Metrics */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Diversity & Fairness Metrics</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 h-64">
              
              {/* Pure CSS Conic Gradient Pie Chart */}
              <div 
                className="w-48 h-48 rounded-full shadow-inner border-4 border-white relative"
                style={{
                  background: 'conic-gradient(#6b8cce 0% 25%, #8dbd8d 25% 45%, #a78bfa 45% 65%, #f472b6 65% 100%)'
                }}
              >
                {/* Labels floating on the pie chart (simulated) */}
                <div className="absolute top-4 right-4 text-white text-[10px] font-bold drop-shadow-md">25%</div>
                <div className="absolute bottom-6 right-8 text-white text-[10px] font-bold drop-shadow-md">20%</div>
                <div className="absolute bottom-6 left-6 text-white text-[10px] font-bold drop-shadow-md">20%</div>
                <div className="absolute top-8 left-6 text-white text-[10px] font-bold drop-shadow-md">35%</div>
              </div>

              {/* Pie Chart Legend */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#6b8cce] rounded-sm"></div>
                  <span className="text-sm font-medium text-slate-600">Urban (25%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#8dbd8d] rounded-sm"></div>
                  <span className="text-sm font-medium text-slate-600">Rural/Aspirational (20%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#a78bfa] rounded-sm"></div>
                  <span className="text-sm font-medium text-slate-600">Male (20%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#f472b6] rounded-sm"></div>
                  <span className="text-sm font-medium text-slate-600">Female (35%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}