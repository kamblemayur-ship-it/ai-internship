import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  // THE LOGOUT ENGINE
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // DYNAMIC NAVIGATION ENGINE
  const navigationLinks = {
    Student: [
      { name: 'Opportunities', path: '/student/opportunities', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { name: 'My Applications', path: '/student/applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: 'Ask Allo', path: '/student/chat', icon: 'M9.663 17h4.673M12 3v1...' },
      { name: 'Profile', path: '/student/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ],
   Company: [
  { name: 'Dashboard', path: '/company/dashboard', icon: '...' },
  { name: 'Post Internship', path: '/company/internships', icon: '...' },
  { name: 'Applicants', path: '/company/applicants', icon: '...' },
],
    Admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { name: 'View Students', path: '/admin/students', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
      { name: 'View Startups', path: '/admin/startups', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { name: 'Announcements', path: '/admin/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
      { name: 'System Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ]
  };

  const links = navigationLinks[role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col p-6 space-y-10 transition-transform duration-300`}>
        <div className="text-2xl font-extrabold text-[#6b9b8e] tracking-tight">AI Allocation</div>

        <nav className="flex-1 space-y-3">
          {links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 shadow-inner' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-5 h-5 ${role === 'Student' && 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon}></path>
              </svg>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 text-sm text-slate-500 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
            {role ? role[0] : '?'}
          </div>
          <div>
            <div className="font-semibold text-slate-800">Logged in as:</div>
            <div className="font-mono text-xs">{role || 'Unknown'}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm shadow-slate-50">
          <h2 className="text-xl font-semibold text-slate-900">{role} Dashboard</h2>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-500">Welcome, {role}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Log Out
            </button>
          </div>
        </header>

        {/* Page Content Render Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}