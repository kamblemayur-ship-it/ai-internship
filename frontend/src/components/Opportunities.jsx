import React, { useState, useEffect } from 'react';

export default function Opportunities() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null); // Tracks which button is loading
  const [applicationStatus, setApplicationStatus] = useState({}); // Tracks applied jobs

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Extract ID from token to feed the AI Engine
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // 1. Hit the AI Engine
        const response = await fetch(`http://localhost:5000/api/ai/match/${payload.userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // The backend returns { student, matchesFound, matches: [...] }
          setMatches(data.matches || []);
        }
      } catch (error) {
        console.error("Failed to fetch AI matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    
    try {
      const token = localStorage.getItem('token');
      
      // 2. Hit the Application Pipeline
      const response = await fetch(`http://localhost:5000/api/applications/${jobId}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        // Mark as successfully applied in the UI
        setApplicationStatus(prev => ({ ...prev, [jobId]: 'Applied' }));
      } else {
        // Handle duplicates or errors
        setApplicationStatus(prev => ({ ...prev, [jobId]: data.message }));
      }
    } catch (error) {
      setApplicationStatus(prev => ({ ...prev, [jobId]: 'Engine Error' }));
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-slate-500 font-bold animate-pulse">Running AI Allocation Engine...</div>;
  }

  if (matches.length === 0) {
    return <div className="p-10 text-slate-500">No active internships found.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Opportunities</h1>
        <p className="text-slate-500 font-medium mt-1">AI-curated matches based on your technical stack.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div key={match.jobId} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow">
            
            {/* Header: Company & Match Score */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{match.role}</h2>
                <p className="text-sm font-semibold text-[#6b9b8e]">{match.company}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-2xl font-black ${match.matchScore >= 80 ? 'text-emerald-600' : match.matchScore >= 50 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {match.matchScore}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match</span>
              </div>
            </div>

            {/* AI Insights Section */}
            <div className="bg-slate-50/50 rounded-xl p-4 mb-6 border border-slate-100 flex-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Engine Insights</h3>
              <ul className="space-y-1.5">
                {match.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-slate-600 font-medium flex items-start gap-2">
                    <span className="text-[#6b9b8e] mt-0.5">✦</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer: Details & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
              <div className="text-sm text-slate-500 font-medium">
                {match.location && <span>📍 {match.location}</span>}
                {match.location && match.stipend && <span className="mx-2">•</span>}
                {match.stipend && <span>💰 {match.stipend}</span>}
              </div>
              
              <button
                onClick={() => handleApply(match.jobId)}
                disabled={applyingTo === match.jobId || applicationStatus[match.jobId]}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  applicationStatus[match.jobId] === 'Applied' || applicationStatus[match.jobId]?.includes('already')
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : applicationStatus[match.jobId]
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-[#6b9b8e] hover:bg-[#5a867a] text-white'
                }`}
              >
                {applyingTo === match.jobId ? 'Applying...' : 
                 applicationStatus[match.jobId] === 'Applied' ? 'Applied ✓' : 
                 applicationStatus[match.jobId] ? 'Already Applied' : 
                 'Apply Now'}
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}