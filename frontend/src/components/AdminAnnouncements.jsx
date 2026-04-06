import React, { useState, useEffect } from 'react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', targetAudience: 'All', priority: 'Standard'
  });

  // PRE-WIRED: Fetch existing announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/announcements', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        } else {
          console.warn("Admin API pending. Starting with empty broadcast log.");
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newAnnouncement = await response.json();
        setAnnouncements([newAnnouncement, ...announcements]);
      } else {
        // TEMPORARY: Simulate UI update since the backend route doesn't exist yet
        const fakeAnnouncement = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        setAnnouncements([fakeAnnouncement, ...announcements]);
      }
      
      setShowForm(false);
      setFormData({ title: '', content: '', targetAudience: 'All', priority: 'Standard' });
      
    } catch (error) {
      console.error("Error posting broadcast:", error);
      alert("Engine Failure: Could not broadcast message.");
    }
  };

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Accessing Broadcast Matrix...</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Broadcasts</h1>
          <p className="text-slate-600 mt-1 font-medium">Push announcements and system alerts to network participants.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
          {showForm ? 'Cancel Broadcast' : 'New Broadcast'}
        </button>
      </div>

      {/* THE BROADCAST FORM */}
      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-lg animate-scale-up">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Compose Network Message</h2>
          <form onSubmit={handlePostAnnouncement} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Line</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50" placeholder="e.g. Platform Maintenance scheduled for..." />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Audience</label>
              <select value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50 font-medium">
                <option value="All">All Network Users</option>
                <option value="Students">Students Only</option>
                <option value="Companies">Organizations Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Level</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50 font-medium">
                <option value="Standard">Standard Update</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Alert (Red)</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Content</label>
              <textarea required rows="4" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400/50" placeholder="Enter broadcast details..."></textarea>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
                Transmit to Network
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BROADCAST LOG */}
      <div className="space-y-4">
        {announcements.length === 0 && !showForm ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl">
            <p className="text-slate-500 font-bold text-lg">No active broadcasts. The network is quiet.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className={`bg-white/80 backdrop-blur-md border shadow-sm rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start transition-all hover:shadow-md ${
              announcement.priority === 'Critical' ? 'border-red-300' : 
              announcement.priority === 'High' ? 'border-amber-300' : 
              'border-white'
            }`}>
              
              <div className="shrink-0 pt-1">
                {announcement.priority === 'Critical' ? (
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center border border-red-200 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                ) : announcement.priority === 'High' ? (
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center border border-amber-200 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center border border-slate-200 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{announcement.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    announcement.priority === 'Critical' ? 'bg-red-500 text-white' : 
                    announcement.priority === 'High' ? 'bg-amber-500 text-white' : 
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {announcement.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-slate-300 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    To: {announcement.targetAudience}
                  </span>
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-3">
                  {announcement.content}
                </p>
                
                <div className="text-xs font-bold text-slate-400">
                  Broadcasted: {new Date(announcement.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="shrink-0 pt-1 hidden md:block">
                <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}