import React, { useState, useEffect } from 'react';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State Management
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: '',
    address: '',
    newSkill: ''
  });

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
          setEditForm(prev => ({
            ...prev,
            phone: data.phone || '',
            address: data.address || ''
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Skill Management Functions
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!editForm.newSkill.trim()) return;
    
    // Prevent duplicates
    if (profile.skills?.includes(editForm.newSkill.trim())) {
      setEditForm({ ...editForm, newSkill: '' });
      return;
    }

    setProfile(prev => ({
      ...prev,
      skills: [...(prev.skills || []), editForm.newSkill.trim()]
    }));
    setEditForm({ ...editForm, newSkill: '' });
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!isEditing) return;
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: editForm.phone,
          address: editForm.address,
          skills: profile.skills
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData); // Update UI with DB truth
        setIsEditing(false);
      } else {
        alert("Failed to save profile data.");
      }
    } catch (error) {
      console.error("Network error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Loading Profile Matrix...</div>;
  if (!profile) return <div className="p-10 text-red-500">Error loading profile. Please log in again.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Identity & Stack</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage your personal details and AI-matching parameters.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
            isEditing 
              ? 'bg-[#6b9b8e] hover:bg-[#5a867a] text-white' 
              : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {saving ? 'Syncing...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Identity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center">
            <div className="w-28 h-28 bg-gradient-to-br from-[#6b9b8e]/20 to-[#6b9b8e]/5 rounded-full border-4 border-white flex items-center justify-center text-4xl font-black text-[#6b9b8e] shadow-lg mb-4">
              {profile.name ? profile.name[0].toUpperCase() : '?'}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-500 font-medium mb-4">{profile.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-slate-800 text-white shadow-sm">
              {profile.role}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200/50 pb-2">Contact Details</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
              {isEditing ? (
                <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 text-sm font-medium" placeholder="+91 98765 43210" />
              ) : (
                <div className="text-sm font-bold text-slate-800">{editForm.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Current Location</label>
              {isEditing ? (
                <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 text-sm font-medium" placeholder="Mumbai, Maharashtra" />
              ) : (
                <div className="text-sm font-bold text-slate-800">{editForm.address || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Technical Stack */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm min-h-full">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#6b9b8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Technical Capabilities
              </h3>
            </div>

            {/* AI Warning */}
            {(!profile.skills || profile.skills.length === 0) && !isEditing && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm font-medium mb-6">
                Your technical stack is empty. The AI allocation engine requires skills to match you with internships. Click 'Edit Profile' to add them.
              </div>
            )}

            {/* Skill Input (Only visible when editing) */}
            {isEditing && (
              <form onSubmit={handleAddSkill} className="mb-6 flex gap-2">
                <input 
                  type="text" 
                  value={editForm.newSkill}
                  onChange={e => setEditForm({...editForm, newSkill: e.target.value})}
                  className="flex-1 bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 text-sm font-medium" 
                  placeholder="Type a skill (e.g. React, Node.js) and press Enter..." 
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                  Add
                </button>
              </form>
            )}

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-2.5">
              {profile.skills?.map((skill, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${isEditing ? 'bg-white border border-slate-300 pr-2' : 'bg-slate-800 text-white'}`}>
                  <span className={isEditing ? 'text-slate-700' : 'text-white'}>{skill}</span>
                  
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                * Note: Removing skills may lower your AI match probability for certain roles.
              </p>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}