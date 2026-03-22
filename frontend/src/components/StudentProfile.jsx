import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

export default function StudentProfile() {
  // State to toggle between viewing and editing
  const [isEditing, setIsEditing] = useState(false);
  
  // State holding the actual user data
  const [profile, setProfile] = useState({
    fullName: "Rohit",
    email: "rohit.student@example.com",
    education: "B.E. Information Technology",
    skills: "Java, Linux, React, Tailwind CSS",
    sector: "Software Engineering, AI",
    location: "Mumbai, Bangalore",
    duration: "6 Months",
    stipend: "20000"
  });

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = () => {
    // Here you would normally send a PUT/PATCH request to your backend
    console.log("Saving profile data to backend:", profile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-slate-500 mt-1">Manage your personal information and internship preferences.</p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${
              isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Save Changes
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Section: Personal Info */}
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Full Name</label>
                {isEditing ? (
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.fullName}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Email Address</label>
                {isEditing ? (
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.email}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Education</label>
                {isEditing ? (
                  <input type="text" name="education" value={profile.education} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.education}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Skills (comma separated)</label>
                {isEditing ? (
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.skills}</div>
                )}
              </div>

            </div>
          </div>

          {/* Section: Preferences */}
          <div className="p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Internship Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Preferred Sector(s)</label>
                {isEditing ? (
                  <input type="text" name="sector" value={profile.sector} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.sector}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Preferred Location(s)</label>
                {isEditing ? (
                  <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.location}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Preferred Duration</label>
                {isEditing ? (
                  <input type="text" name="duration" value={profile.duration} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.duration}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Minimum Stipend (per month)</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-500 font-medium">₹</span>
                    <input type="number" name="stipend" value={profile.stipend} onChange={handleChange} className="w-full border border-slate-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  </div>
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">₹{profile.stipend}</div>
                )}
              </div>

            </div>
          </div>

          {/* Section: Resume Upload (Visual only for now) */}
          <div className="p-8 border-t border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Resume Document</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-white">
              <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <div className="text-sm font-medium text-slate-700">rohit_resume_v2.pdf</div>
              <div className="text-xs text-slate-500 mt-1">Uploaded on March 20, 2026</div>
              {isEditing && (
                <button className="mt-4 text-sm font-medium text-[#6b9b8e] hover:text-[#5a8679] underline">Upload New Resume</button>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}