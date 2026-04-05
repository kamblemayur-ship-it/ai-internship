import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalPage({ title }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-6 animate-fade-in relative z-10">
      
      {/* Background to match the global theme lightly */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-emerald-50/20 to-slate-200 -z-10"></div>

      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-10 sm:p-14 rounded-[2.5rem] shadow-xl border border-white">
        
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#6b9b8e] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Engine
          </Link>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-10 border-b border-slate-200 pb-6">
          Last Updated: April 2026 • Engine v2.0 Beta
        </p>

        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 p-5 rounded-2xl text-sm">
            <strong>Development Notice:</strong> The AI Allocation platform is currently in a closed development beta. By accessing this system, you agree to our testing protocols and understand that the predictive matching engine is undergoing continuous calibration.
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Data Parsing & NLP Processing</h2>
            <p>To generate accurate matches, our engine processes uploaded resumes (PDFs) and extracts technical signals. We do not sell this data to third parties. It is strictly cross-referenced against live company tech stacks.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Algorithmic Liability</h2>
            <p>The match scores (e.g., 98% Match) are generated via predictive AI. While we strive to eliminate human bias, AI Allocation is a routing tool. We do not guarantee internship placement, nor do we dictate the final hiring decisions of the companies on this platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Communication & Allo Assistant</h2>
            <p>Interactions with "Allo" are logged locally to provide session history and contextual continuity. You have the right to clear your local cache and terminate your chat history at any time.</p>
          </section>

          <p className="mt-12 pt-8 border-t border-slate-200 text-sm text-slate-400 italic">
            Full commercial legal documentation will be generated and enforced prior to public Series A launch.
          </p>
        </div>

      </div>
    </div>
  );
}