import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

// Mock Database: The student's application history
const applicationHistory = [
  { id: 1, role: "Data Analyst Intern", company: "FinSecure Capital", appliedDate: "2026-03-15", status: "Shortlisted" },
  { id: 2, role: "Backend Developer Intern", company: "InnovateTech Solutions", appliedDate: "2026-03-22", status: "Pending" },
  { id: 3, role: "Frontend Developer Intern", company: "TechNova", appliedDate: "2026-02-10", status: "Rejected" },
  { id: 4, role: "Cloud Engineer Intern", company: "QuantumCore AI", appliedDate: "2026-03-01", status: "Selected" }
];

export default function StudentApplications() {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState('All');

  // The Filter Engine
  const filteredApplications = activeTab === 'All' 
    ? applicationHistory 
    : applicationHistory.filter(app => app.status === activeTab);

  // Dynamic Status Color formatting
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // Pending
    }
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-slate-500 mt-1">Track the status of your internship applications in real-time.</p>
        </div>

        {/* The Application Tracking Interface */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Controls & Tabs */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800">Your Application History</h3>
            
            {/* The Tab Array */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-[#6b9b8e] text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* The Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="p-5 font-semibold">Role</th>
                  <th className="p-5 font-semibold">Company</th>
                  <th className="p-5 font-semibold">Applied Date</th>
                  <th className="p-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-slate-800">{app.role}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm font-medium text-slate-600">{app.company}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-slate-500 font-mono">{app.appliedDate}</div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-block px-3 py-1 text-xs font-bold border rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty State Fallback */}
            {filteredApplications.length === 0 && (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <div className="text-slate-500 font-medium">No applications found in this category.</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}