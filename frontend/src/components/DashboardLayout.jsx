import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState(() => {
    const cached = localStorage.getItem('cachedFirstName');
    return cached && cached !== 'undefined' ? cached : role;
  });

useEffect(() => {
    const fetchUserName = async () => {
      // 1. Check cache first to avoid unnecessary API calls
      const cached = localStorage.getItem('cachedFirstName');
      if (cached && cached !== 'undefined') return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 2. Call the new /me endpoint (No need to decode the ID manually!)
        const response = await fetch(`http://localhost:5000/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.name) {
            // 3. Logic to extract first name
            const displayName = role === 'Company' ? data.name : data.name.split(' ')[0];
            setFirstName(displayName);
            localStorage.setItem('cachedFirstName', displayName);
          }
        } else if (response.status === 401) {
          // If token is expired/invalid, log them out
          handleLogout();
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    fetchUserName();
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cachedFirstName');
    navigate('/login');
  };

  const navigationLinks = {
    Student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { name: 'Opportunities', path: '/student/opportunities', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { name: 'My Applications', path: '/student/applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: 'Ask Allo', path: '/student/chat', icon: 'M9.663 17h4.673M12 3v1M12 3v1' },
      { name: 'Profile', path: '/student/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ],
    Company: [
      { name: 'Dashboard', path: '/company/dashboard', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { name: 'Post Internship', path: '/company/internships', icon: 'M12 4v16m8-8H4' },
      { name: 'Applicants', path: '/company/applicants', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
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
    // STRICT h-screen prevents global scrolling
    <div className="flex w-full h-screen relative overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 h-full flex flex-col p-6 space-y-10 z-20 bg-white/40 backdrop-blur-xl border-r border-white/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="text-2xl font-extrabold text-[#6b9b8e] tracking-tight drop-shadow-sm">AI Allocation</div>

        <nav className="flex-1 space-y-3">
          {links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                isActive 
                  ? 'bg-white/60 text-emerald-800 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.05)] border border-white/50' 
                  : 'text-slate-600 hover:bg-white/40 hover:text-slate-900 border border-transparent'
              }`}
            >
              <svg className={`w-5 h-5 ${role === 'Student' && 'text-[#6b9b8e]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon}></path>
              </svg>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-300/30 text-sm text-slate-500 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/60 border border-white/80 rounded-full flex items-center justify-center font-bold text-slate-600 shadow-sm">
            {role ? role[0] : '?'}
          </div>
          <div>
            <div className="font-bold text-slate-800">Logged in as:</div>
            <div className="font-mono text-xs font-semibold text-slate-500">{role || 'Unknown'}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        
        {/* ABSOLUTE GLASS HEADER */}
        <header className="absolute top-0 w-full h-20 flex items-center justify-between px-10 z-30 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)]">
          <h2 className="text-xl font-bold text-slate-900">{role} Dashboard</h2>
          
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-slate-600 bg-white/40 px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
              Welcome, {firstName}
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors p-2 hover:bg-white/40 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Log Out
            </button>
          </div>
        </header>

        {/* SCROLLABLE MAIN AREA (pt-20 pushes content down so it doesn't hide behind the header instantly) */}
        <main key={location.pathname} className="flex-1 h-full overflow-y-auto pt-20 relative z-0 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}