import React, { useState, useEffect } from 'react';

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the data from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/applications/company', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.warn("Failed to fetch applications. Check backend terminal.");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // 2. Handle Accepting or Rejecting a candidate
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update the UI instantly without needing a page refresh
        setApplications(applications.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        alert("Engine Warning: Failed to update application status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 3. Loading Screen
  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Scanning Application Matrix...</div>;

  // 4. Main UI Render
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="border-b border-white/30 pb-5">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicant Pipeline</h1>
        <p className="text-slate-600 mt-1 font-medium">Review AI-matched candidates for your active requisitions.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-3xl overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Pipeline is Empty</h3>
            <p className="text-slate-500 mt-2">No students have applied to your roles yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200/50 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-5 font-bold">Candidate</th>
                  <th className="p-5 font-bold">Role</th>
                  <th className="p-5 font-bold">AI Match</th>
                  <th className="p-5 font-bold text-center">Status</th>
                  <th className="p-5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center shadow-inner">
                          {app.student?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{app.student?.name || 'Unknown Candidate'}</div>
                          <div className="text-xs text-slate-500 font-medium">{app.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-slate-700">{app.job?.role || 'Unknown Role'}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${
                          app.matchScore >= 80 ? 'text-emerald-600' :
                          app.matchScore >= 50 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {app.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                        app.status === 'Reviewed' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-slate-200 text-slate-600 border border-slate-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                        disabled={app.status === 'Accepted'}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-100"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                        disabled={app.status === 'Rejected'}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-100"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}