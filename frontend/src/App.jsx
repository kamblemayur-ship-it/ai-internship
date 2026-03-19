import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CandidateDashboard from './components/CandidateDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Chatbot from './components/Chatbot';

// Temporary Placeholder Components
import Home from './components/Home';


function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif' }}>
{/* Secured, Modernized Navigation Bar */}
        <nav style={{ height: '70px', padding: '0 30px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          
          {/* Brand / Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* CSS Faux Logo Icon */}
            <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              AI
            </div>
            {/* Styled Brand Name */}
            <span style={{ color: 'white', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              Smart<span style={{ color: '#38bdf8' }}>Allocation</span>
            </span>
          </Link>
          
          {/* Navigation Links & Actions */}
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            {(() => {
              const storedUser = localStorage.getItem('user');
              const currentUser = storedUser ? JSON.parse(storedUser) : null;

              if (currentUser) {
                return (
                  <>
                    {/* ONLY show to Students */}
                    {currentUser.role === 'student' && (
                      <Link to="/candidate" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Candidate Dashboard</Link>
                    )}
                    
                    {/* ONLY show to Companies */}
                    {currentUser.role === 'company' && (
                      <Link to="/company" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Company Dashboard</Link>
                    )}

                    {/* Show to EVERYONE logged in */}
                    <Link to="/profile" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Edit Profile</Link>
                    
                    {/* Subtle Vertical Divider */}
                    <div style={{ width: '1px', height: '24px', background: '#334155', margin: '0 5px' }}></div> 

                    {/* Modernized Logout Button */}
                    <button 
                      onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; }}
                      style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.background = 'rgba(248, 113, 113, 0.1)'; }}
                      onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
                    >
                      Logout ({currentUser.name})
                    </button>
                  </>
                );
              } else {
                return (
                  <>
                    <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Login</Link>
                    <Link to="/register" style={{ background: '#2563eb', color: 'white', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'background 0.2s' }}>Register</Link>
                  </>
                );
              }
            })()}
          </div>
        </nav>

        {/* Page Content Changes Based on URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/company" element={<CompanyDashboard />} />
        </Routes>

        {/* Global Chatbot Overlay */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;