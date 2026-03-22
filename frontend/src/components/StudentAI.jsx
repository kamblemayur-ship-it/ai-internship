import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';

// Mock Data: What your AI backend SHOULD return after analyzing the student's profile
const aiGeneratedMatches = [
  {
    id: 101,
    role: "Frontend Developer Intern",
    company: "InnovateTech Solutions",
    matchScore: 98,
    stipend: "₹35,000/month",
    location: "Bangalore",
    insights: [
      "100% Skill Overlap (React, Tailwind CSS)",
      "Matches your preferred location (Bangalore)",
      "Company historically hires candidates from your university"
    ]
  },
  {
    id: 102,
    role: "React Native Developer Intern",
    company: "AppFlow Dynamics",
    matchScore: 89,
    stipend: "₹30,000/month",
    location: "Remote",
    insights: [
      "Strong core JavaScript alignment",
      "Missing native mobile experience, compensated by high aptitude scores",
      "Remote role fits your secondary preference"
    ]
  },
  {
    id: 103,
    role: "UI/UX Prototyper",
    company: "DesignHub",
    matchScore: 76,
    stipend: "₹20,000/month",
    location: "Pune",
    insights: [
      "Frontend implementation skills perfectly align",
      "Requires stronger Figma portfolio for maximum probability"
    ]
  }
];

export default function StudentAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);

  // Simulating the delay of an AI model processing data
  const analyzeProfile = () => {
    setIsAnalyzing(true);
    setResultsReady(false);
    
    // In reality, this setTimeout is replaced by your await fetch('/api/ai/match')
    setTimeout(() => {
      setIsAnalyzing(false);
      setResultsReady(true);
    }, 2500);
  };

  return (
    <DashboardLayout role="Student">
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart AI Allocation</h1>
          <p className="text-slate-500 mt-1">Our proprietary engine analyzes your skills, portfolio, and market demand to find your highest-probability placements.</p>
        </div>

        {/* The Execution Engine */}
        {!resultsReady && (
          <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isAnalyzing ? 'bg-emerald-100 animate-pulse' : 'bg-slate-100'}`}>
              <svg className={`w-10 h-10 ${isAnalyzing ? 'text-emerald-600 animate-spin' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{isAnalyzing ? 'Analyzing your profile...' : 'Ready to find your match?'}</h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                {isAnalyzing 
                  ? 'Cross-referencing your skills against 450+ active internship requirements and historical placement data.' 
                  : 'Click below to run the allocation algorithm against currently open positions.'}
              </p>
            </div>

            <button 
              onClick={analyzeProfile}
              disabled={isAnalyzing}
              className={`px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all ${
                isAnalyzing 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#6b9b8e] hover:bg-[#5a8679] text-white hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              {isAnalyzing ? 'Processing...' : 'Run AI Allocation Engine'}
            </button>
          </div>
        )}

        {/* The Results Grid */}
        {resultsReady && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-bold text-slate-800">Your Top Recommended Roles</h3>
              <button onClick={analyzeProfile} className="text-sm text-[#6b9b8e] font-semibold hover:underline">Re-run Analysis</button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {aiGeneratedMatches.map((match) => (
                <div key={match.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Match Score Badge */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-4" 
                       style={{ borderColor: match.matchScore >= 90 ? '#10b981' : match.matchScore >= 80 ? '#3b82f6' : '#f59e0b' }}>
                    <span className="text-3xl font-black text-slate-800">{match.matchScore}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Match</span>
                  </div>

                  {/* Core Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{match.role}</h4>
                      <p className="text-sm font-medium text-slate-600">{match.company} • {match.location}</p>
                    </div>
                    
                    {/* AI Insights Engine Output */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                        AI Insights
                      </div>
                      <ul className="space-y-1">
                        {match.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span> {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <div className="text-lg font-bold text-slate-800">{match.stipend}</div>
                    <button className="w-full md:w-auto bg-[#6b9b8e] hover:bg-[#5a8679] text-white px-8 py-2.5 rounded-lg font-semibold shadow transition-all">
                      1-Click Apply
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}