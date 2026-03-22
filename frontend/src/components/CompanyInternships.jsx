import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function CompanyInternships() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: '', description: '', skills: '', stipend: '', capacity: '', duration: '', location: ''
  });

  // HELPER: Get the real company ID from the login token
  const getUserData = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { id: payload.userId, name: 'My Company' }; 
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
    return { id: '507f1f77bcf86cd799439011', name: 'InnovateTech' }; 
  };

  // NEW: The missing Fetch function to get data from MongoDB
  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const user = getUserData();
      const response = await fetch(`http://localhost:5000/api/internships/company/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetch when the page first loads
  useEffect(() => {
    fetchInternships();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveInternship = async () => {
    if (!formData.role || !formData.skills || !formData.stipend) {
      alert("Please fill in Role, Skills, and Stipend.");
      return;
    }

    setIsSubmitting(true);
    const user = getUserData();

    const payload = {
      companyId: user.id,
      companyName: user.name,
      ...formData
    };

    try {
      const response = await fetch('http://localhost:5000/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ role: '', description: '', skills: '', stipend: '', capacity: '', duration: '', location: '' });
        await fetchInternships(); // Refresh the list with the new data
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="Company">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Internships</h1>
            <p className="text-slate-500 mt-1">Your live postings in the database.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#6b9b8e] hover:bg-[#5a8679] text-white px-5 py-2.5 rounded-lg font-medium shadow flex items-center gap-2">
            Post New Internship
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-slate-400">Loading live data...</div>
          ) : internships.length === 0 ? (
            <div className="p-10 text-center text-slate-500 italic">No internships found. Create one to see it here.</div>
          ) : (
            internships.map((job) => (
              <div key={job._id} className="p-6 border-b border-slate-100 flex justify-between items-center last:border-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{job.role}</h3>
                  <div className="text-sm text-slate-500 mb-2">{job.location} • {job.duration}</div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#6b9b8e]">{job.stipend}</div>
                  <div className="text-xs text-slate-400 font-bold">{job.capacity} slots</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal logic remains the same as previous turn */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-xl font-bold">New Internship Post</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" name="role" placeholder="Role Name" value={formData.role} onChange={handleInputChange} className="w-full border p-2 rounded" />
              <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleInputChange} className="w-full border p-2 rounded" />
              <div className="flex gap-4">
                <input type="text" name="stipend" placeholder="Stipend" value={formData.stipend} onChange={handleInputChange} className="flex-1 border p-2 rounded" />
                <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleInputChange} className="flex-1 border p-2 rounded" />
              </div>
              <div className="flex gap-4">
                <input type="text" name="duration" placeholder="Duration" value={formData.duration} onChange={handleInputChange} className="flex-1 border p-2 rounded" />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="flex-1 border p-2 rounded" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500">Cancel</button>
              <button onClick={handleSaveInternship} disabled={isSubmitting} className="bg-[#6b9b8e] text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save to DB'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}