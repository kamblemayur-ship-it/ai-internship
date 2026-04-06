import React, { useState, useEffect } from 'react';

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // REALITY CHECK: Fetching actual company user data from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Loading Organization Data...</div>;
  if (!profile) return <div className="p-10 text-red-500">Error loading profile. Please log in again.</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> here. Just the raw container.
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="border-b border-white/30 pb-5">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Profile</h1>
        <p className="text-slate-600 mt-1 font-medium">Manage your company's presence on the allocation network.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 items-start">
        
        {/* Avatar */}
        <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-inner shrink-0">
          {profile.name ? profile.name[0].toUpperCase() : '?'}
        </div>
        
        {/* Details */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-500 font-medium">{profile.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Account Type: {profile.role}
            </div>
          </div>
          
          {/* Organization Info Display */}
          <div className="pt-6 border-t border-slate-200/50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Network Status
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-600 text-sm font-medium leading-relaxed">
              Your organization is verified on the network. You are currently authorized to post requisitions and access the AI applicant pipeline. To update your core organization details, please contact network administration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}