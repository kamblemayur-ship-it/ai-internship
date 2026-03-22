import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPostings: 0,
    totalApplicants: 0,
    aiMatchAccuracy: "92%"
  });

  // Fetch real count from your MongoDB
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const response = await fetch(`http://localhost:5000/api/internships/company/${payload.userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({ ...prev, totalPostings: data.length }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Company Overview</h1>
            <p className="text-slate-500 mt-1">Manage your internship postings and view top candidates.</p>
          </div>
          
          {/* THE WORKING BUTTON: This now navigates to your management page */}
          <button 
            onClick={() => navigate('/company/internships')}
            className="bg-[#6b9b8e] hover:bg-[#5a8679] text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Post a New Role
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Your Contribution</div>
            <div className="text-5xl font-black text-slate-800">{stats.totalPostings}</div>
            <div className="text-sm text-slate-500 mt-2">Internships Posted So Far</div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Active Pipeline</div>
            <div className="text-5xl font-black text-slate-800">{stats.totalApplicants}</div>
            <div className="text-sm text-slate-500 mt-2">Total Applicants Received</div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">AI Match Score</div>
            <div className="text-5xl font-black text-emerald-600">{stats.aiMatchAccuracy}</div>
            <div className="text-sm text-slate-500 mt-2">Avg. Candidate Compatibility</div>
          </div>
        </div>

        {/* Recent Matches Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Recent Applicant Matches</h3>
          </div>
          <div className="p-20 text-center">
            {stats.totalPostings === 0 ? (
              <div className="space-y-4">
                <p className="text-slate-400 font-medium">Matches will appear here after you post an internship.</p>
                <button 
                  onClick={() => navigate('/company/internships')}
                  className="text-[#6b9b8e] font-bold hover:underline"
                >
                  Create your first posting &rarr;
                </button>
              </div>
            ) : (
              <p className="text-slate-400 font-medium italic">Our AI is currently analyzing candidates for your active roles...</p>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}