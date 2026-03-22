import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // This fetches REAL data from your MongoDB via your Node.js backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/');
        if (!response.ok) throw new Error('Failed to fetch data from the server.');
        
        const data = await response.json();
        
        // We only want to see students on this page
        const studentData = data.filter(user => user.role.toLowerCase() === 'student');
        setStudents(studentData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <DashboardLayout role="Admin">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Database</h1>
            <p className="text-slate-500 mt-1">Live feed of all registered students from the MongoDB database.</p>
          </div>
          <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            Total Records: {students.length}
          </div>
        </div>

        {/* Status Indicators */}
        {isLoading && (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <svg className="animate-spin h-8 w-8 text-[#6b9b8e] mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="30" strokeLinecap="round"></circle>
            </svg>
            Loading live database records...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center font-medium">
            Error: {error}
            <div className="text-sm mt-2 text-red-500">Make sure your Node.js backend server is running on port 5000.</div>
          </div>
        )}

        {/* The Live Data Table */}
        {!isLoading && !error && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-5 font-semibold">Name & Contact</th>
                    <th className="p-5 font-semibold">Technical Skills</th>
                    <th className="p-5 font-semibold">Allocation Status</th>
                    <th className="p-5 font-semibold text-right">System ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-sm text-slate-500">{student.email}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {student.skills && student.skills.length > 0 ? (
                            student.skills.map((skill, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                          student.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {student.status || 'Available'}
                        </span>
                      </td>
                      <td className="p-5 text-right font-mono text-xs text-slate-400">
                        {student._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {students.length === 0 && (
                <div className="p-10 text-center text-slate-500">
                  No students found in the database.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}