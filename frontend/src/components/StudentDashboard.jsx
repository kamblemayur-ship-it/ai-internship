import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [matchCount, setMatchCount] = useState(0); // Add state for the real count
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
        // 1. Fetch the user profile
        const profileRes = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setStudent(profileData);

          // 2. Fetch the real AI match count
          const matchRes = await fetch(`http://localhost:5000/api/ai/match/${profileData._id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (matchRes.ok) {
             const matchData = await matchRes.json();
             // The backend sends { matchesFound: number }
             setMatchCount(matchData.matchesFound || 0); 
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

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Initializing Engine...</div>;
  if (!student) return <div className="p-10 text-red-500">Failed to load profile.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* HERO SECTION */}
      <div className="relative bg-[#1a2332] text-white rounded-3xl p-10 overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Welcome back, {student.name.split(' ')[0]}.
          </h1>
          <p className="text-sm font-medium opacity-90 mb-8 max-w-lg leading-relaxed">
            {matchCount === 0 
              ? "No active matches found. Upload more skills or wait for new internships."
              : `Your AI allocation engine has found ${matchCount} new high-probability internship matches since your last login.`
            }
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/student/opportunities')}
              className="bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              View AI Matches
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-white/10 backdrop-blur-sm">
              Browse All Jobs
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-48 h-48 bg-[#6b9b8e]/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-[#6b9b8e] flex items-center justify-center font-black text-[#6b9b8e] text-xl">
            {student.skills?.length || 0}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Skills</div>
            <div className="font-bold text-slate-700 text-sm">Active in Profile</div>
            <button onClick={() => navigate('/student/profile')} className="text-xs font-bold text-[#6b9b8e] hover:underline mt-1">Update Skills →</button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xl border border-blue-100">
             - 
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applications</div>
            <div className="font-bold text-slate-700 text-sm">Track your progress</div>
            <button onClick={() => navigate('/student/applications')} className="text-xs font-bold text-blue-600 hover:underline mt-1">View Status →</button>
          </div>
        </div>

        <div className="bg-emerald-50/50 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            System Status
          </div>
          <p className="text-xs font-medium text-emerald-800 leading-relaxed mb-3">
            Your engine is calibrated. Ensure your skills are up to date for maximum allocation accuracy.
          </p>
        </div>
      </div>

    </div>
  );
}