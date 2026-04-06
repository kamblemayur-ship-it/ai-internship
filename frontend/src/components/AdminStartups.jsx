import React, { useState, useEffect } from 'react';

export default function AdminStartups() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // PRE-WIRED: This points to the Admin route we are going to build next.
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/admin/users/companies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.warn("Admin API pending. Returning empty list.");
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 font-bold text-slate-500 animate-pulse">Accessing Organization Database...</div>;

  return (
    // BLIND SPOT FIXED: No <DashboardLayout> wrapper.
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/30 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Directory</h1>
          <p className="text-slate-600 mt-1 font-medium">Global view of all verified company accounts on the network.</p>
        </div>
        
        <div className="w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-slate-800 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b9b8e]/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-3xl overflow-hidden">
        {companies.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Awaiting Database Connection</h3>
            <p className="text-slate-500 mt-2">The Admin API routes have not been initialized yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200/50 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-5 font-bold">Organization</th>
                  <th className="p-5 font-bold">Contact Email</th>
                  <th className="p-5 font-bold">Joined</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-white/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center shadow-inner">
                          {company.name[0].toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-800">{company.name}</div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-medium text-slate-600">{company.email}</td>
                    <td className="p-5 text-xs font-medium text-slate-500">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <button className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100">
                        Revoke Access
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