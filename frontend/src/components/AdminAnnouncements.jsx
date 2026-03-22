import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

export default function AdminAnnouncements() {
  // State for the form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All');

  // State for the history (Mock Data matching your screenshot)
  const [history, setHistory] = useState([
    {
      id: 1,
      title: "Application Deadline Approaching",
      audience: "Students",
      date: "3/20/2026",
      content: "The deadline for all summer internship applications is this Friday. Please submit your applications soon!"
    },
    {
      id: 2,
      title: "Update Internship Postings",
      audience: "Companies",
      date: "3/18/2026",
      content: "Please ensure all your company internship postings for the new cycle are updated by the end of the month."
    }
  ]);

  // Handle sending a new announcement
  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnnouncement = {
      id: Date.now(),
      title,
      audience,
      date: new Date().toLocaleDateString(),
      content
    };

    // Add to the top of the history list
    setHistory([newAnnouncement, ...history]);
    
    // Clear the form
    setTitle('');
    setContent('');
    setAudience('All');
  };

  // Handle deleting an announcement
  const handleDelete = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <DashboardLayout role="Admin">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Announcements</h1>
          <p className="text-slate-500 mt-1">Broadcast system-wide messages to students and companies.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Create Announcement Form */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Create Announcement</h3>
            
            <form onSubmit={handleSend} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., System Maintenance Notice"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea 
                  rows="5" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none bg-white"
                >
                  <option value="All">All (Students & Companies)</option>
                  <option value="Students">Students Only</option>
                  <option value="Companies">Companies Only</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#6b9b8e] hover:bg-[#5a8679] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm mt-4"
              >
                Send Announcement
              </button>
            </form>
          </div>

          {/* Right Column: Sent History */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Sent History</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No announcements sent yet.</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl relative group">
                    
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 pr-20">{item.title}</h4>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                      To: {item.audience} | On: {item.date}
                    </div>
                    
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}