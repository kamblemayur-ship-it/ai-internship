import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from './DashboardLayout';

export default function CompanyApplications() {
  const [applicants, setApplicants] = useState([
    { 
      id: 1, 
      name: 'Ishan Gupta', 
      email: '01ishan.gupta@gmail.com', 
      role: 'Backend Developer', 
      skills: ['Node.js', 'Python', 'MongoDB'], 
      matchScore: 80,
      status: 'Pending',
      resumeFile: 'ishan_gupta_resume.pdf'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      email: 'priya.s@example.com', 
      role: 'Frontend Developer', 
      skills: ['React', 'Tailwind', 'Figma'], 
      matchScore: 95,
      status: 'Pending',
      resumeFile: 'priya_sharma_ui.pdf'
    }
  ]);

  const [selectedResume, setSelectedResume] = useState(null);

  const handleShortlist = (id) => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Shortlisted' } : app
    ));
  };

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className="flex justify-between items-end border-b border-white/30 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicant Pipeline</h1>
            <p className="text-slate-600 mt-1 font-medium">Review candidates, analyze AI match scores, and manage your hiring flow.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 drop-shadow-sm">Filter By Role</label>
            <select className="bg-white/60 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all cursor-pointer hover:bg-white/80">
              <option>All Active Roles</option>
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => (
            <div key={app.id} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-[#6b9b8e]/40 group">
              
              <div className="bg-emerald-500/10 border-b border-white/40 flex justify-end px-4 py-2">
                <span className="text-emerald-700 text-xs font-black flex items-center gap-1 drop-shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  {app.matchScore}% Match
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/80 text-[#6b9b8e] font-black text-xl flex items-center justify-center border border-white shadow-sm">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-[#6b9b8e] transition-colors">{app.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{app.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Applied For</div>
                  <div className="bg-white/50 border border-white/60 px-3 py-2 rounded-lg text-sm font-bold text-slate-800 shadow-sm">
                    {app.role}
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Technical Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {app.skills.map(skill => (
                      <span key={skill} className="bg-slate-800/5 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-800/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => setSelectedResume(app)}
                    className="bg-white/80 hover:bg-white text-slate-700 border border-white shadow-sm font-bold py-2.5 rounded-xl text-sm transition-all hover:shadow-md"
                  >
                    View Resume
                  </button>
                  <button 
                    onClick={() => handleShortlist(app.id)}
                    disabled={app.status === 'Shortlisted'}
                    className={`font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm ${
                      app.status === 'Shortlisted' 
                        ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 cursor-not-allowed backdrop-blur-md' 
                        : 'bg-[#6b9b8e] hover:bg-[#5a8679] hover:shadow-md text-white border border-[#6b9b8e]'
                    }`}
                  >
                    {app.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedResume && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-scale-up border border-white">
            
            <div className="px-6 py-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Document Viewer</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedResume.resumeFile}</p>
              </div>
              <button 
                onClick={() => setSelectedResume(null)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 bg-slate-100/50 flex items-center justify-center p-8">
              <div className="bg-white w-full max-w-2xl h-full shadow-lg border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-bold text-slate-600">{selectedResume.name}'s Resume</p>
                <p className="text-sm font-medium">PDF Rendering Placeholder</p>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}