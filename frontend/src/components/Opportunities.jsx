import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Opportunities() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch AI matches and student's applications
        const [matchRes, appRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/ai/match/${payload.userId}`, { headers }),
          fetch(`${API_BASE_URL}/api/applications/student`, { headers }).catch(() => null)
        ]);

        if (matchRes.ok) {
          const matchData = await matchRes.json();
          setMatches(matchData.matches || []);
        }

        if (appRes && appRes.ok) {
          const appData = await appRes.json();
          if (Array.isArray(appData)) {
            const statusMap = {};
            appData.forEach((app) => {
              const id = app.internship?._id || app.internship || app.job?._id || app.job || app.jobId;
              if (id) {
                statusMap[id.toString()] = 'Applied';
              }
            });
            setApplicationStatus(statusMap);
          }
        }
      } catch (error) {
        console.error("Failed to load opportunities data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (jobId, matchScore) => {
    setApplyingTo(jobId);

    try {
      const token = localStorage.getItem('token');
      const numericScore = typeof matchScore === 'number' ? matchScore : parseInt(matchScore, 10) || 0;

      const response = await fetch(`${API_BASE_URL}/api/applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          internshipId: jobId,
          matchScore: numericScore
        })
      });

      const data = await response.json();

      if (response.ok) {
        setApplicationStatus((prev) => ({ ...prev, [jobId.toString()]: 'Applied' }));
      } else {
        setApplicationStatus((prev) => ({ ...prev, [jobId.toString()]: data.message || 'Already Applied' }));
      }
    } catch (error) {
      setApplicationStatus((prev) => ({ ...prev, [jobId.toString()]: 'Error' }));
      console.error("Network error:", error);
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
        {matches.map((match) => {
          const isApplied = Boolean(applicationStatus[match.jobId?.toString()]);

          return (
            <div key={match.jobId} className="bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow">
              
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

              <div className="bg-slate-50/50 rounded-xl p-4 mb-6 border border-slate-100 flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Engine Insights</h3>
                <ul className="space-y-1.5">
                  {match.insights?.map((insight, idx) => (
                    <li key={idx} className="text-sm text-slate-600 font-medium flex items-start gap-2">
                      <span className="text-[#6b9b8e] mt-0.5">✦</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                <div className="text-sm text-slate-500 font-medium">
                  {match.location && <span>📍 {match.location}</span>}
                  {match.location && match.stipend && <span className="mx-2">•</span>}
                  {match.stipend && <span>💰 {match.stipend}</span>}
                </div>

                <button
                  onClick={() => handleApply(match.jobId, match.matchScore)}
                  disabled={applyingTo === match.jobId || isApplied}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    isApplied
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-[#6b9b8e] hover:bg-[#5a867a] text-white'
                  }`}
                >
                  {applyingTo === match.jobId ? 'Applying...' : isApplied ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}