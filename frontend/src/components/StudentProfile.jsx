import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [newResume, setNewResume] = useState(null);

  // We leave the rest blank so it fills from the database/token
  const [profile, setProfile] = useState({
    fullName: "Student", 
    email: "",
    education: "B.E. Information Technology",
    skills: "Java, Node.js, React",
    sector: "Software Engineering, AI",
    location: "Mumbai, Bangalore",
    duration: "6 Months",
    stipend: "20000"
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // We use the ID from the token to ask the database for the real user document
        if (payload.userId) {
          const response = await fetch(`http://localhost:5000/api/users/${payload.userId}`);
          
          if (response.ok) {
            const data = await response.json();
            
            // Inject the real database data into the React state
            setProfile(prev => ({
              ...prev,
              fullName: data.name || "Student",
              email: data.email || "",
              skills: data.skills && data.skills.length > 0 ? data.skills.join(', ') : prev.skills
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewResume(file);
    } else {
      alert("Strictly PDF files are allowed.");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving profile data to backend:", profile);
    if (newResume) {
      console.log("File ready for upload pipeline:", newResume.name);
    }
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-slate-500 mt-1">Manage your personal information and internship preferences.</p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${
              isEditing ? 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
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
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.fullName}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Email Address</label>
                {isEditing ? (
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.email}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Education</label>
                {isEditing ? (
                  <input type="text" name="education" value={profile.education} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.education}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Skills (comma separated)</label>
                {isEditing ? (
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
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
                  <input type="text" name="sector" value={profile.sector} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.sector}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Preferred Location(s)</label>
                {isEditing ? (
                  <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.location}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Preferred Duration</label>
                {isEditing ? (
                  <input type="text" name="duration" value={profile.duration} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">{profile.duration}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Minimum Stipend</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-500 font-medium">₹</span>
                    <input type="number" name="stipend" value={profile.stipend} onChange={handleChange} className="w-full border border-slate-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  </div>
                ) : (
                  <div className="text-slate-900 font-medium px-4 py-2.5 bg-slate-50 rounded-lg border border-transparent">₹{profile.stipend}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Resume Upload (Interactive) */}
          <div className="p-8 border-t border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Resume Document</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-white">
              <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              
              {newResume ? (
                <div>
                  <div className="text-sm font-bold text-[#6b9b8e]">{newResume.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Ready to upload • {(newResume.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-700">
                {profile.fullName.toLowerCase().replace(/\s+/g, '_')}_resume.pdf
                </div>
              )}

              {isEditing && (
                <label className="mt-4 inline-block cursor-pointer text-sm font-bold text-[#6b9b8e] hover:text-[#5a8679] transition-colors underline">
                  {newResume ? 'Change Selected File' : 'Upload New Resume'}
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}