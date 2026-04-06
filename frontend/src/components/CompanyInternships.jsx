import React, { useState, useEffect } from 'react';

export default function CompanyInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role: '', description: '', skills: '', stipend: '', duration: '', location: '', capacity: 1
  });

  // Fetch the company's posted internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Decode token to get the company ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        const companyId = payload.userId;

        // THE FIX: Added the Authorization header here
        const response = await fetch(`http://localhost:5000/api/internships/company/${companyId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setInternships(data);
        }
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newJob = await response.json();
        setInternships([newJob, ...internships]); // Add to the top of the list
        setShowForm(false); // Close form
        setFormData({ role: '', description: '', skills: '', stipend: '', duration: '', location: '', capacity: 1 }); // Reset form
      } else {
        const errorData = await response.json();
        alert(`Failed to post job: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Engine Failure: Could not post internship.");
    }
  };

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Loading Company Data...</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Internships</h1>
          <p className="text-slate-600 mt-1 font-medium">Post opportunities and feed data to the AI allocation engine.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6b9b8e] hover:bg-[#5a867a] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          {showForm ? 'Cancel Form' : '+ Post New Internship'}
        </button>
      </div>

      {/* THE POSTING FORM */}
      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl border border-[#6b9b8e]/30 p-8 rounded-3xl shadow-lg animate-scale-up">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Requisition</h2>
          <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role Title</label>
              <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="e.g. React Developer" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="e.g. Remote, Mumbai" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Skills (Comma Separated)</label>
              <input type="text" required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="e.g. React, Node.js, MongoDB" />
              <p className="text-[10px] text-[#6b9b8e] font-bold mt-1">Crucial: The AI Engine uses these exact keywords to match students.</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stipend</label>
              <input type="text" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="e.g. ₹15,000/month" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
              <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="e.g. 3 Months" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50" placeholder="Describe the day-to-day responsibilities..."></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
                Deploy to Network
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE POSTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internships.length === 0 && !showForm ? (
          <div className="col-span-2 text-center py-20 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl">
            <p className="text-slate-500 font-bold text-lg">No active requisitions. Post an internship to begin AI allocation.</p>
          </div>
        ) : (
          internships.map((job) => (
            <div key={job._id} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.role}</h3>
                  <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                    <span className="text-slate-700 font-bold">{job.location || 'Remote'}</span>
                    <span>•</span>
                    {job.stipend || 'Unpaid'}
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  {job.status || 'Active'}
                </span>
              </div>
              
              <div className="flex-1 mt-2 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {job.skills?.map((skill, i) => (
                    <span key={i} className="text-xs font-bold bg-white text-slate-600 border border-slate-200 px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Applicants: <span className="text-slate-900">{job.applicants || 0}</span></span>
                <span className="text-slate-400 font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}