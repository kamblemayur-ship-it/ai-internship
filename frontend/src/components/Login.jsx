import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function Login() {
  // Core Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration-specific State
  const [name, setName] = useState('');
  const [skills, setSkills] = useState(''); // Comma-separated string
  
  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('Student');
  const [isLogin, setIsLogin] = useState(true);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timeout);
  }, [role, isLogin]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg(''); 
    if (newRole === 'Admin') setIsLogin(true); // Force login for Admin, prevent open admin registration
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');
    setIsLoading(true);

    try {
      const endpoint = isLogin 
        ? 'http://localhost:5000/api/users/login' 
        : 'http://localhost:5000/api/users/register';
      
      // Build the payload dynamically based on whether we are logging in or registering
      const payload = { email, password, role };
      
      if (!isLogin) {
        payload.name = name;
        // The backend expects an array. Convert the comma-separated string to an array.
        payload.skills = skills ? skills.split(',').map(s => s.trim()) : [];
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // If Registration was successful, automatically switch to Login mode
      if (!isLogin) {
        setIsLogin(true);
        setErrorMsg('');
        alert("Registration successful! Please log in.");
        setIsLoading(false);
        return;
      }

      // If Login was successful, save token and route
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        if (role === 'Student') navigate('/student/dashboard');
        else if (role === 'Company') navigate('/company/dashboard');
        else if (role === 'Admin') navigate('/admin/dashboard');
      }

    } catch (err) {
      console.error("Auth Error:", err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pronoun = role === 'Student' || role === 'Company' ? 'a' : 'an';
  const heading = isLogin ? `Welcome Back, ${role}` : `Create ${pronoun} ${role} Account`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-slate-800">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transition-all duration-500 ease-in-out">
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
          {['Student', 'Company', 'Admin'].map((r) => (
            <button key={r} onClick={() => handleRoleChange(r)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${role === r ? 'bg-white shadow text-slate-900 border border-gray-200' : 'text-gray-500 hover:text-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className={`transition-opacity duration-300 ease-in-out ${animate ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">{heading}</h2>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* EXTRA FIELDS FOR REGISTRATION ONLY */}
            {!isLogin && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {role === 'Company' ? 'Company Name' : 'Full Name'}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'Company' ? "e.g. InnovateTech" : "e.g. John Doe"}
                    required={!isLogin}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                  />
                </div>

                {role === 'Student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills</label>
                    <input 
                      type="text" 
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Node.js, Python..." 
                      required={!isLogin && role === 'Student'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                    />
                    <p className="text-xs text-slate-400 mt-1">Comma separated (Required for AI allocation)</p>
                  </div>
                )}
              </div>
            )}

            {/* ALWAYS SHOW EMAIL & PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'Company' ? 'Work Email' : 'Email Address'}
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "••••••••" : "Create a password"} 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#6b9b8e] hover:bg-[#5a8679] text-white font-medium py-2.5 rounded-lg transition-colors duration-300 mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {role !== 'Admin' && (
            <div className="text-center mt-6">
              <button onClick={() => setIsLogin(!isLogin)} type="button" className="text-sm text-gray-500 hover:text-slate-800 transition-colors">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-semibold text-slate-700">{isLogin ? "Register" : "Sign In"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}