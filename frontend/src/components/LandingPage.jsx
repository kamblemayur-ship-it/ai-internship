import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent font-sans animate-fade-in flex flex-col relative z-10">
      
      {/* NAVIGATION BAR (Fixed: Dark Glassmorphism) */}
      <header className="absolute top-0 w-full z-50 bg-slate-900/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6b9b8e] rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            {/* Fixed: Changed text-slate-900 to text-white for visibility on dark glass */}
            <span className="text-xl font-black text-white tracking-tight">AI Allocation</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Fixed: Changed text-slate-600 to text-slate-300 */}
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            {/* Fixed: Swapped dark button for an Emerald button so it pops against the dark header */}
            <Link to="/register" className="bg-[#6b9b8e] text-white hover:bg-[#5a8679] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(107,155,142,0.39)] hover:shadow-[0_6px_20px_rgba(107,155,142,0.23)] hover:-translate-y-0.5">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col">
        {/* Fixed: Removed the mt-2 that was severing the background, and adjusted border opacity */}
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900/95 backdrop-blur-2xl overflow-hidden rounded-b-[3rem] shadow-2xl border-b border-white/10">
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

          <div className="relative max-w-7xl mx-auto px-6 text-center z-10 animate-scale-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Engine v2.0 is Live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Stop searching.<br />Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6b9b8e] to-emerald-400">matching.</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              The first internship ecosystem driven entirely by predictive AI. We analyze student repositories and company tech stacks to generate high-probability hiring matches with zero bias.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register?role=student" className="w-full sm:w-auto px-8 py-4 bg-[#6b9b8e] hover:bg-[#5a8679] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(107,155,142,0.6)] flex items-center justify-center gap-2 hover:-translate-y-1">
                I am a Student
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <Link to="/register?role=company" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center hover:-translate-y-1">
                I am a Company
              </Link>
            </div>
          </div>
        </div>

        {/* VALUE PROPOSITION SECTION */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How the Engine Works</h2>
            <p className="text-slate-600 font-medium mt-2">Ditch the manual resume screening.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Parsing</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">Upload your PDF. Our NLP model strips out the noise and extracts pure technical signals, creating a semantic profile instantly.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white group">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Algorithmic Allocation</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">We don't do job boards. The engine actively cross-references your skills against live company demands and generates a match score.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white group">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Pipeline</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">Once matched, applications bypass the HR black hole and go directly into the company's verified tracking dashboard.</p>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/40 bg-white/20 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600 font-bold">
          <p>© 2026 AI Allocation Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}