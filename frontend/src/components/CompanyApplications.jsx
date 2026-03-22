import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function CompanyApplications() {
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');

  // Decode Token to get Company ID
  const getCompanyId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        return JSON.parse(atob(token.split('.')[1])).userId;
      }
    } catch (e) {
      console.error("Token error", e);
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const companyId = getCompanyId();
        if (!companyId) throw new Error("Not logged in properly.");

        // 1. Fetch the Company's Jobs
        const jobsRes = await fetch(`http://localhost:5000/api/internships/company/${companyId}`);
        const jobsData = jobsRes.ok ? await jobsRes.json() : [];
        setInternships(jobsData);

        // 2. Fetch all Students (Simulating applicants for the prototype)
        const usersRes = await fetch(`http://localhost:5000/api/users/`);
        const usersData = usersRes.ok ? await usersRes.json() : [];
        
        // Filter out companies/admins, keep only students
        const studentData = usersData.filter(u => u.role.toLowerCase() === 'student');
        
        // Map them to random jobs for the prototype UI if no formal applications exist yet
        const enrichedApplicants = studentData.map((student, index) => {
          const assignedJob = jobsData.length > 0 ? jobsData[index % jobsData.length] : { role: 'General Application' };
          // Generate a fake AI match score based on skills length just for the UI
          const mockScore = student.skills.length > 0 ? Math.min(60 + (student.skills.length * 10), 98) : 45;
          
          return {
            ...student,
            appliedFor: assignedJob.role,
            matchScore: mockScore,
            status: mockScore > 80 ? 'Shortlisted' : 'Under Review'
          };
        });

        // Sort by highest match score first
        setApplicants(enrichedApplicants.sort((a, b) => b.matchScore - a.matchScore));

      } catch (error) {
        console.error("Failed to load pipeline data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredApplicants = selectedRole === 'All' 
    ? applicants 
    : applicants.filter(a => a.appliedFor === selectedRole);

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicant Pipeline</h1>
            <p className="text-slate-500 mt-1">Review candidates, analyze AI match scores, and manage your hiring flow.</p>
          </div>
          
          {/* Job Filter Dropdown */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Filter by Role</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none min-w-[200px]"
            >
              <option value="All">All Active Roles</option>
              {internships.map(job => (
                <option key={job._id} value={job.role}>{job.role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* The Pipeline Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
             Loading applicant data from database...
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <h3 className="text-lg font-bold text-slate-700">No applicants yet</h3>
            <p className="text-slate-500 mt-1">Candidates matching this role will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant) => (
              <div key={applicant._id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
                
                {/* AI Score Banner */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl font-bold text-xs flex items-center gap-1.5 ${
                  applicant.matchScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                  applicant.matchScore >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
                  {applicant.matchScore}% Match
                </div>

                {/* Candidate Info */}
                <div className="flex items-center gap-4 mb-5 pt-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">
                    {applicant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{applicant.name}</h3>
                    <p className="text-sm text-slate-500">{applicant.email}</p>
                  </div>
                </div>

                {/* Applied Role */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Applied For</div>
                  <div className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {applicant.appliedFor}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="mb-6 flex-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.skills.length > 0 ? applicant.skills.map((skill, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">
                        {skill}
                      </span>
                    )) : (
                      <span className="text-slate-400 text-xs italic">No skills listed</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto border-t border-slate-100 pt-5">
                  <button className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
                    View Resume
                  </button>
                  <button className="py-2 bg-[#6b9b8e] hover:bg-[#5a8679] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                    Shortlist
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}