import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from './DashboardLayout';

export default function StudentApplications() {
  const [filter, setFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const applications = [
    { id: 1, role: 'Data Analyst Intern', company: 'FinSecure Capital', date: '2026-03-15', status: 'Shortlisted', stipend: '₹25,000/month', duration: '3 Months', matchScore: 92, nextSteps: 'The company is reviewing your profile. Keep an eye on your email for an interview invite.' },
    { id: 2, role: 'Backend Developer Intern', company: 'InnovateTech Solutions', date: '2026-03-22', status: 'Pending', stipend: '₹30,000/month', duration: '6 Months', matchScore: 88, nextSteps: 'Your application has been received and is waiting for initial AI screening.' },
    { id: 3, role: 'Frontend Developer Intern', company: 'TechNova', date: '2026-02-10', status: 'Rejected', stipend: '₹15,000/month', duration: '3 Months', matchScore: 65, nextSteps: 'Unfortunately, the company moved forward with other candidates. Keep applying!' },
    { id: 4, role: 'Cloud Engineer Intern', company: 'QuantumCore AI', date: '2026-03-01', status: 'Selected', stipend: '₹45,000/month', duration: '6 Months', matchScore: 96, nextSteps: 'Congratulations! HR will contact you shortly with the official offer letter.' }
  ];

  const filteredApps = filter === 'All' ? applications : applications.filter(app => app.status === filter);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Selected': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-slate-500 mt-1">Track the status of your internship applications in real-time.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Your Application History</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected'].map(f => (
                <button 
                  key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${filter === f ? 'bg-[#6b9b8e] border-[#6b9b8e] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Role</div><div className="col-span-4">Company</div><div className="col-span-2 text-center">Applied Date</div><div className="col-span-2 text-center">Status</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div key={app.id} onClick={() => setSelectedApp(app)} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="col-span-4 font-bold text-slate-800 group-hover:text-[#6b9b8e] transition-colors">{app.role}</div>
                <div className="col-span-4 text-slate-600 font-medium">{app.company}</div>
                <div className="col-span-2 text-center text-sm text-slate-500 font-mono">{app.date}</div>
                <div className="col-span-2 flex justify-center"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(app.status)}`}>{app.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REACT PORTAL: Mounts the modal directly to the <body> so nothing can overlap it */}
      {selectedApp && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-up border border-slate-100/50">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div><h2 className="text-xl font-bold text-slate-900">{selectedApp.role}</h2><p className="text-slate-500 font-medium mt-1">{selectedApp.company}</p></div>
              <button onClick={() => setSelectedApp(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${getStatusStyles(selectedApp.status)}`}>
                <div><div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-0.5">Current Status</div><div className="text-lg font-black">{selectedApp.status}</div></div>
                <div className="text-right"><div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-0.5">Applied On</div><div className="font-mono font-bold">{selectedApp.date}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stipend</div><div className="font-bold text-slate-800">{selectedApp.stipend}</div></div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</div><div className="font-bold text-slate-800">{selectedApp.duration}</div></div>
                <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Match Score</div><div className="font-black text-[#6b9b8e] text-lg">{selectedApp.matchScore}%</div></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Message from Allo</h4>
                <p className="text-sm text-slate-600 bg-emerald-50 border border-emerald-100 p-4 rounded-xl leading-relaxed">{selectedApp.nextSteps}</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedApp(null)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors shadow-sm">Close Details</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}