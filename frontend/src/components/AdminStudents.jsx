import React, { useState, useEffect } from 'react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // PRE-WIRED: This points to the Admin route we are going to build next.
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/users/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.warn("Admin API pending. Returning empty list.");
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Accessing Student Database...</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-600 mt-1 font-medium">Global view of all registered student accounts on the network.</p>
        </div>
        
        <div className="w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-3xl overflow-hidden">
        {students.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Awaiting Database Connection</h3>
            <p className="text-slate-500 mt-2">The Admin API routes have not been initialized yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200/50 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-5 font-bold">Student Name</th>
                  <th className="p-5 font-bold">Contact</th>
                  <th className="p-5 font-bold">Technical Skills</th>
                  <th className="p-5 font-bold">Joined</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6b9b8e]/10 text-[#6b9b8e] font-bold rounded-xl flex items-center justify-center border border-[#6b9b8e]/20">
                          {student.name[0].toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-800">{student.name}</div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600">{student.email}</td>
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1">
                        {student.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                        {student.skills?.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400">+{student.skills.length - 3}</span>
                        )}
                        {!student.skills?.length && <span className="text-xs text-slate-400 italic">No skills added</span>}
                      </div>
                    </td>
                    <td className="p-5 text-xs font-medium text-slate-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <button className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100">
                        Remove
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