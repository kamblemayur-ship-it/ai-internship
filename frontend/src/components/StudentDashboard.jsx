import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  // Dynamic State for the User
  const [studentName, setStudentName] = useState("Student");
  
  // Mock data for the dashboard stats (we will wire these to the DB later)
  const profileCompleteness = 85; 
  const activeApplications = 2;
  const newAiMatches = 5;

  useEffect(() => {
    // 1. Grab the token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // 2. Decode the middle section of the JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // 3. Set the name. (If your backend includes the name in the token, we use it. 
        // If it only includes the ID, we fetch the full profile from the database).
        if (payload.name) {
          setStudentName(payload.name);
        } else if (payload.userId) {
          fetchUserData(payload.userId);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // Fallback function to get the name from the database if it isn't in the token
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Update the state with the real name from the database
        setStudentName(data.name || "Student");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Dynamic Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            {/* The name is now dynamically injected here */}
            <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back, {studentName}.</h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Your AI allocation engine has found {newAiMatches} new high-probability internship matches since your last login.
            </p>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => navigate('/student/chat')}
                className="bg-[#6b9b8e] hover:bg-[#5a8679] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                View AI Matches
              </button>
              <button 
                onClick={() => navigate('/student/opportunities')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-sm"
              >
                Browse All Jobs
              </button>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
              <circle cx="80" cy="50" r="40" />
              <circle cx="90" cy="20" r="20" />
            </svg>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Completeness Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-6">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#6b9b8e]" strokeDasharray={`${profileCompleteness}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                {profileCompleteness}%
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Profile Status</h3>
              <p className="font-semibold text-slate-800">Looks good.</p>
              <button onClick={() => navigate('/student/profile')} className="text-[#6b9b8e] text-sm font-bold mt-1 hover:underline">Update Skills &rarr;</button>
            </div>
          </div>

          {/* Active Applications Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <span className="text-2xl font-black text-blue-600">{activeApplications}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Applications</h3>
              <p className="font-semibold text-slate-800">Currently pending.</p>
              <button onClick={() => navigate('/student/applications')} className="text-blue-600 text-sm font-bold mt-1 hover:underline">Track Status &rarr;</button>
            </div>
          </div>

          {/* Next Steps Action Card */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
            <h3 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Action Required
            </h3>
            <p className="text-sm text-emerald-700 mb-3">Upload your latest resume to boost your AI match accuracy.</p>
            <button onClick={() => navigate('/student/profile')} className="text-sm font-bold text-emerald-800 underline decoration-2 underline-offset-2">Go to Profile</button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}