import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from './DashboardLayout';

export default function CompanyApplications() { // <-- MAKE SURE IT SAYS APPLICATIONS
  const [applicants, setApplicants] = useState([
    { 
      id: 1, 
      name: 'Ishan Gupta', 
      email: '01ishan.gupta@gmail.com', 
      role: 'Backend Developer', 
      skills: ['Node.js', 'Python'], 
      matchScore: 80,
      status: 'Pending',
      resumeFile: 'ishan_gupta_resume.pdf'
    }
  ]);

  const [selectedResume, setSelectedResume] = useState(null);

  // This function physically changes the button from 'Shortlist' to 'Shortlisted ✓'
  const handleShortlist = (id) => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Shortlisted' } : app
    ));
  };

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicant Pipeline</h1>
            <p className="text-slate-500 mt-1">Review candidates, analyze AI match scores, and manage your hiring flow.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter By Role</label>
            <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none">
              <option>All Active Roles</option>
              <option>Backend Developer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              <div className="bg-emerald-100 flex justify-end px-4 py-1.5">
                <span className="text-emerald-800 text-xs font-black flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  {app.matchScore}% Match
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 font-bold text-lg flex items-center justify-center border border-slate-200">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{app.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{app.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Applied For</div>
                  <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800">
                    {app.role}
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {app.skills.map(skill => (
                      <span key={skill} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => setSelectedResume(app)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    View Resume
                  </button>
                  <button 
                    onClick={() => handleShortlist(app.id)}
                    disabled={app.status === 'Shortlisted'}
                    className={`font-bold py-2.5 rounded-lg text-sm transition-colors ${
                      app.status === 'Shortlisted' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed' 
                        : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white shadow-sm'
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-scale-up border border-slate-100/50">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Document Viewer</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedResume.resumeFile}</p>
              </div>
              <button 
                onClick={() => setSelectedResume(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 bg-slate-200 flex items-center justify-center p-8">
              <div className="bg-white w-full max-w-2xl h-full shadow-lg border border-slate-300 rounded flex flex-col items-center justify-center text-slate-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-bold text-slate-600">{selectedResume.name}'s Resume</p>
                <p className="text-sm">PDF Rendering Placeholder</p>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}