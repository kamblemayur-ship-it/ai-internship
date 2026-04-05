import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from './DashboardLayout';

export default function StudentApplications() {
  const [filter, setFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const [applications, setApplications] = useState(() => {
    const defaultApplications = [
      { id: 1, role: 'Data Analyst Intern', company: 'FinSecure Capital', date: '2026-03-15', status: 'Shortlisted', stipend: '₹25,000/month', duration: '3 Months', matchScore: 92, nextSteps: 'The company is reviewing your profile. Keep an eye on your email for an interview invite.' }
    ];
    const chatbotApps = JSON.parse(localStorage.getItem('alloCrossPageApps') || '[]');
    return [...chatbotApps, ...defaultApplications];
  });

  const filteredApps = filter === 'All' ? applications : applications.filter(app => app.status === filter);

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
            <p className="text-slate-600 mt-1 font-medium">Track your allocation status and upcoming interview pipelines.</p>
          </div>
          <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-xl shadow-sm border border-white/60">
            {['All', 'Pending', 'Shortlisted', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                  filter === status 
                    ? 'bg-white text-[#6b9b8e] shadow-sm border border-white' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl">
              <p className="text-slate-500 font-bold text-lg">No applications found in this category.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className="bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-[#6b9b8e]/40 group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/80 rounded-2xl border border-white shadow-sm flex items-center justify-center text-xl font-black text-[#6b9b8e]">
                    {app.company[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#6b9b8e] transition-colors">{app.role}</h3>
                    <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                      <span className="text-slate-700 font-bold">{app.company}</span>
                      <span>•</span>
                      Applied {app.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-center hidden sm:block">
                    <span className="block text-xl font-black text-[#6b9b8e]">{app.matchScore}%</span>
                    <span className="text-[9px] font-black uppercase text-slate-400">AI Match</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border backdrop-blur-md shadow-sm ${
                    app.status === 'Shortlisted' ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' :
                    app.status === 'Rejected' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                    'bg-amber-500/10 text-amber-700 border-amber-500/20'
                  }`}>
                    {app.status}
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-[#6b9b8e] transition-colors hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedApp && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-scale-up border border-white">
            
            <div className="p-8 border-b border-slate-200/50 bg-white/50 relative">
              <button onClick={() => setSelectedApp(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight pr-10">{selectedApp.role}</h2>
              <p className="text-slate-600 font-bold mt-2">{selectedApp.company}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Stipend</div>
                  <div className="font-bold text-slate-800">{selectedApp.stipend}</div>
                </div>
                <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Duration</div>
                  <div className="font-bold text-slate-800">{selectedApp.duration}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#6b9b8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Next Steps
                </h4>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-800 font-medium text-sm leading-relaxed">
                  {selectedApp.nextSteps}
                </div>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </DashboardLayout>
  );
}