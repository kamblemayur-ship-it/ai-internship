import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from './DashboardLayout';

export default function CompanyInternships() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the form
  const [formData, setFormData] = useState({
    roleName: '',
    skills: '',
    stipend: '',
    capacity: '',
    duration: '',
    location: ''
  });

  // Mock data for the table so it isn't empty
  const [internships, setInternships] = useState([
    { id: 1, role: 'Backend Developer Intern', skills: ['Node.js', 'MongoDB'], stipend: '₹30,000/month', capacity: 5, status: 'Active' }
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveInternship = () => {
    // Force the comma-separated string into a clean Array for MongoDB
    const cleanSkills = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    
    const newInternship = {
      id: Date.now(),
      role: formData.roleName,
      skills: cleanSkills,
      stipend: formData.stipend,
      capacity: formData.capacity || 1,
      status: 'Active'
    };

    setInternships([newInternship, ...internships]);
    setIsModalOpen(false);
    setFormData({ roleName: '', skills: '', stipend: '', capacity: '', duration: '', location: '' });
  };

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Internships</h1>
            <p className="text-slate-500 mt-1">Create and monitor your live postings in the database.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#6b9b8e] hover:bg-[#5a8679] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Post New Internship
          </button>
        </div>

        {/* Internships Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-5">Role & Skills</div>
            <div className="col-span-3">Stipend</div>
            <div className="col-span-2 text-center">Capacity</div>
            <div className="col-span-2 text-center">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {internships.map((job) => (
              <div key={job.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-5">
                  <div className="font-bold text-slate-800">{job.role}</div>
                  <div className="text-xs text-slate-500 mt-1">{job.skills.join(' • ')}</div>
                </div>
                <div className="col-span-3 font-medium text-slate-600">{job.stipend}</div>
                <div className="col-span-2 text-center font-bold text-slate-700">{job.capacity} slots</div>
                <div className="col-span-2 flex justify-center">
                  <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREMIUM MODAL USING CREATE PORTAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-scale-up border border-slate-100/50">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Internship Post</h2>
                <p className="text-sm text-slate-500 mt-1">Configure role details for the allocation engine.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body - Grid Form */}
            <div className="p-8 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role Title</label>
                <input 
                  type="text" name="roleName" value={formData.roleName} onChange={handleInputChange} 
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills (Comma Separated)</label>
                <input 
                  type="text" name="skills" value={formData.skills} onChange={handleInputChange} 
                  placeholder="e.g. React, Node.js, AWS"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Stipend</label>
                  <input 
                    type="text" name="stipend" value={formData.stipend} onChange={handleInputChange} 
                    placeholder="e.g. ₹25,000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hiring Capacity</label>
                  <input 
                    type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} 
                    placeholder="e.g. 3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                  <input 
                    type="text" name="duration" value={formData.duration} onChange={handleInputChange} 
                    placeholder="e.g. 6 Months"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                  <input 
                    type="text" name="location" value={formData.location} onChange={handleInputChange} 
                    placeholder="e.g. Remote / Mumbai"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6b9b8e] focus:outline-none transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveInternship}
                className="px-8 py-2.5 bg-[#6b9b8e] hover:bg-[#5a8679] text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Save to Database
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </DashboardLayout>
  );
}