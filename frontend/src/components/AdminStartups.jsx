import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

export default function AdminStartups() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch REAL data from your MongoDB via your Node.js backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/');
        if (!response.ok) throw new Error('Failed to fetch data from the server.');
        
        const data = await response.json();
        
        // We only want to see companies on this page
        const companyData = data.filter(user => user.role.toLowerCase() === 'company');
        setCompanies(companyData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <DashboardLayout role="Admin">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registered Startups & Companies</h1>
            <p className="text-slate-500 mt-1">Live feed of all employer partners in the allocation network.</p>
          </div>
          <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            Total Partners: {companies.length}
          </div>
        </div>

        {/* Status Indicators */}
        {isLoading && (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <svg className="animate-spin h-8 w-8 text-[#6b9b8e] mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="30" strokeLinecap="round"></circle>
            </svg>
            Loading partner network data...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center font-medium">
            Error: {error}
            <div className="text-sm mt-2 text-red-500">Ensure your backend server is running on port 5000.</div>
          </div>
        )}

        {/* The Live Data Table */}
        {!isLoading && !error && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-5 font-semibold">Company & Contact</th>
                    <th className="p-5 font-semibold">Required Tech Stack</th>
                    <th className="p-5 font-semibold">Platform Status</th>
                    <th className="p-5 font-semibold text-right">System ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((company) => (
                    <tr key={company._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{company.name}</div>
                        <div className="text-sm text-slate-500">{company.email}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {company.skills && company.skills.length > 0 ? (
                            company.skills.map((skill, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">General Hiring</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                          company.status === 'Available' || company.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {company.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-5 text-right font-mono text-xs text-slate-400">
                        {company._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {companies.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <div className="text-slate-500 font-medium">No companies found in the database.</div>
                  <p className="text-sm text-slate-400 mt-1">Register a company account to see it appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}