import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, totalJobs: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Verify Admin Identity
        const profileRes = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.role !== 'Admin') {
            navigate('/login'); // Kick them out if they aren't an admin
            return;
          }
          setAdmin(profileData);

          // 2. Fetch Network Stats 
          // Note: We are pinging a generic /api/internships route for jobs right now.
          // You will need a dedicated Admin API route later to get exact user counts.
          const jobsRes = await fetch('http://localhost:5000/api/internships');
          let jobsCount = 0;
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            jobsCount = jobsData.length;
          }

          setStats({
            totalStudents: 'Pending API', // We need an Admin route for this
            totalCompanies: 'Pending API', // We need an Admin route for this
            totalJobs: jobsCount
          });
        }
      } catch (error) {
        console.error("Admin engine failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Initializing Control Room...</div>;
  if (!admin) return <div className="p-10 text-red-500">Unauthorized Access.</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 text-white rounded-3xl p-10 overflow-hidden shadow-2xl border border-slate-700">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black uppercase tracking-widest mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            System Override Active
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Network Control, {admin.name}.
          </h1>
          <p className="text-sm font-medium opacity-90 mb-8 max-w-lg leading-relaxed text-slate-300">
            You are viewing the global allocation matrix. All student profiles, company requisitions, and AI engine outputs are accessible from this terminal.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/admin/students')}
              className="bg-white text-slate-900 hover:bg-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-white/10 backdrop-blur-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Engine Parameters
            </button>
          </div>
        </div>
        
        {/* Abstract Admin Background Shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-48 h-48 bg-slate-500/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* GLOBAL STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center font-black text-slate-800 text-xl">
            {stats.totalJobs}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Capacity</div>
            <div className="font-bold text-slate-700 text-sm">Active Internships</div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6 opacity-60">
          <div className="w-16 h-16 rounded-full border-4 border-slate-300 flex items-center justify-center font-black text-slate-400 text-xl">
            ?
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Sync</div>
            <div className="font-bold text-slate-700 text-sm">{stats.totalStudents}</div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6 opacity-60">
          <div className="w-16 h-16 rounded-full border-4 border-slate-300 flex items-center justify-center font-black text-slate-400 text-xl">
            ?
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Sync</div>
            <div className="font-bold text-slate-700 text-sm">{stats.totalCompanies}</div>
          </div>
        </div>
      </div>

    </div>
  );
}