import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock Data matching your screenshot
  const [profile, setProfile] = useState({
    companyName: "InnovateTech Solutions",
    officialEmail: "hr@innovatetech.com",
    industry: "Information Technology",
    hrContact: "Ms. Priya Singh",
    website: "https://innovatetech.com",
    description: "A leading provider of cloud-based solutions, driving innovation in the tech industry.",
    capacity: "10"
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving company profile to backend:", profile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Company Profile</h1>
            <p className="text-slate-500 mt-1">Manage your corporate details and internship capacity.</p>
          </div>
        </div>

        {/* Completion Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold text-slate-600">
            <span>Profile Completion</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-[#6b9b8e] h-2 rounded-full w-full"></div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
          
          <div className="absolute top-6 right-6">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-5 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${
                isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Company Information</h3>
            
            <div className="flex flex-col md:flex-row gap-12">
              
              {/* Left Column: Avatar & Status */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-lg">
                  {/* Placeholder for Company Logo */}
                  <img src="https://via.placeholder.com/150/cbd5e1/64748b?text=Logo" alt="Company Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-medium mb-1">Account Status</div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                </div>
              </div>

              {/* Right Column: Form Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Company Name</label>
                  {isEditing ? (
                    <input type="text" name="companyName" value={profile.companyName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">{profile.companyName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Official Email</label>
                  {isEditing ? (
                    <input type="email" name="officialEmail" value={profile.officialEmail} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">{profile.officialEmail}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Industry</label>
                  {isEditing ? (
                    <input type="text" name="industry" value={profile.industry} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">{profile.industry}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">HR Contact Details</label>
                  {isEditing ? (
                    <input type="text" name="hrContact" value={profile.hrContact} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">{profile.hrContact}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Website</label>
                  {isEditing ? (
                    <input type="text" name="website" value={profile.website} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <a href={profile.website} className="text-[#6b9b8e] hover:underline font-medium px-4 py-2 block bg-slate-50 rounded-lg border border-slate-100">{profile.website}</a>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Company Description</label>
                  {isEditing ? (
                    <textarea rows="3" name="description" value={profile.description} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none"></textarea>
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 min-h-[80px]">{profile.description}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1.5">Internship Capacity</label>
                  {isEditing ? (
                    <input type="number" name="capacity" value={profile.capacity} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" />
                  ) : (
                    <div className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">{profile.capacity}</div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}