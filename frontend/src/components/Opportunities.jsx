import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

export default function StudentOpportunities() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ALL Active internships from the database
  const fetchAllInternships = async () => {
    try {
      setIsLoading(true);
      // We fixed the route to fetch only active jobs
      const response = await fetch('http://localhost:5000/api/internships/');
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error("Failed to fetch all internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInternships();
  }, []);

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Internship Opportunities</h1>
            <p className="text-sm text-slate-500 mt-1">Discover real roles tailored to your skills from our partner companies.</p>
          </div>
        </div>

        {/* Dynamic AI Banner */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-8 rounded-2xl border border-emerald-100 shadow flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold text-teal-900 mb-2">Smarter Matches with Allo</h2>
          <p className="text-teal-700 mb-6 max-w-md">Let Allo analyze your profile and instantly curate the highest-probability matches for you.</p>
          <button 
            onClick={() => navigate('/student/chat')} 
            className="flex items-center gap-2 bg-[#6b9b8e] hover:bg-[#5a8679] text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Ask Allo to Match Me
          </button>
        </div>

        {/* Live Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center text-slate-500 py-10">Loading real opportunities...</div>
          ) : internships.length === 0 ? (
            <div className="col-span-3 text-center text-slate-500 py-10">No active internships posted by companies yet.</div>
          ) : (
            internships.map((job) => (
              <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
                
                {/* Fixed Status Tag */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                  {job.status.toUpperCase()}
                </div>

                <div className="mb-4 pt-4 pr-16">
                  {/* Fixed Title Case */}
                  <h4 className="text-lg font-bold text-slate-900">{job.role}</h4>
                  <p className="text-sm text-slate-500 font-medium">{job.companyName} • {job.location}</p>
                </div>

                {/* Fixed Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Fixed Structural Layout */}
                <div className="space-y-3 text-sm text-slate-500 mb-6 border-t border-slate-100 pt-5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Stipend:</span>
                    <span className="font-bold text-[#6b9b8e]">{job.stipend}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Duration:</span>
                    <span className="font-bold text-slate-800">{job.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Positions:</span>
                    {/* Fixed Grammar: 1 Position / 2 Positions */}
                    <span className="font-bold text-slate-800">{job.capacity} {job.capacity === 1 ? 'Position' : 'Positions'}</span>
                  </div>
                </div>

                {/* Fixed Action Button */}
                <div className="mt-auto">
                  <button className="w-full py-2.5 bg-[#6b9b8e] hover:bg-[#5a8679] text-white rounded-lg font-semibold shadow transition-all">
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}