import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({ activeRoles: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch the company profile
        const profileRes = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCompany(profileData);

          // 2. Fetch the company's posted internships to calculate real stats
          const jobsRes = await fetch(`http://localhost:5000/api/internships/company/${profileData._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (jobsRes.ok) {
             const jobsData = await jobsRes.json();
             
             // Calculate real numbers from the database
             const activeRoles = jobsData.filter(job => job.status !== 'Closed').length;
             const totalApplicants = jobsData.reduce((sum, job) => sum + (job.applicants || 0), 0);
             
             setStats({ activeRoles, totalApplicants });
          }
        }
      } catch (error) {
        console.error("Dashboard engine failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Initializing Dashboard...</div>;
  if (!company) return <div className="p-10 text-red-500">Failed to load company profile.</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 text-white rounded-3xl p-10 overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Welcome back, {company.name}.
          </h1>
          <p className="text-sm font-medium opacity-90 mb-8 max-w-lg leading-relaxed">
            Your recruitment pipeline is active. 
            {stats.totalApplicants === 0 
              ? " You currently have no pending applications." 
              : ` The AI engine has allocated ${stats.totalApplicants} high-probability candidates to your open requisitions.`
            }
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/company/applicants')}
              className="bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              Review Applicants
            </button>
            <button 
              onClick={() => navigate('/company/post')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-white/10 backdrop-blur-sm"
            >
              + Post New Role
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-48 h-48 bg-[#6b9b8e]/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* REAL-TIME STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-[#6b9b8e] flex items-center justify-center font-black text-[#6b9b8e] text-xl">
            {stats.activeRoles}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requisitions</div>
            <div className="font-bold text-slate-700 text-sm">Active Roles</div>
            <button onClick={() => navigate('/company/internships')} className="text-xs font-bold text-[#6b9b8e] hover:underline mt-1">Manage →</button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xl border border-blue-100">
             {stats.totalApplicants}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pipeline</div>
            <div className="font-bold text-slate-700 text-sm">Total Applicants</div>
            <button onClick={() => navigate('/company/applicants')} className="text-xs font-bold text-blue-600 hover:underline mt-1">View Queue →</button>
          </div>
        </div>

        <div className="bg-slate-50/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            AI Engine Status
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">
            Filtering enabled. Only candidates exceeding the minimum technical overlap threshold are shown in your queue.
          </p>
        </div>
      </div>

    </div>
  );
}