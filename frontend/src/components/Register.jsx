import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Read the URL. If they clicked "I am a Company", default to the Company tab.
  const initialRole = searchParams.get('role') === 'company' ? 'Company' : 'Student';
  const [activeTab, setActiveTab] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Update state if the URL changes while on the page
  useEffect(() => {
    const roleFromUrl = searchParams.get('role') === 'company' ? 'Company' : 'Student';
    setActiveTab(roleFromUrl);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // MOCK SUBMIT: In a real app, you POST to /api/auth/register here.
    // For now, we simulate a successful registration, create a fake token, and route them.
    console.log(`Registering ${activeTab}:`, formData);
    
    // Fake token payload so the dashboard doesn't crash
    const fakePayload = btoa(JSON.stringify({ 
      userId: '12345', 
      name: formData.name, 
      role: activeTab 
    }));
    localStorage.setItem('token', `fakeHeader.${fakePayload}.fakeSignature`);
    localStorage.setItem('cachedFirstName', formData.name.split(' ')[0]);

    // Send them to their respective dashboard
    if (activeTab === 'Student') {
      navigate('/student/dashboard');
    } else {
      navigate('/company/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#6b9b8e] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">AI Allocation</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#6b9b8e] hover:text-[#5a8679] transition-colors">
            Log in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Role Toggle Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
            <button
              onClick={() => setActiveTab('Student')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
                activeTab === 'Student' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveTab('Company')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${
                activeTab === 'Company' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Company
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {activeTab === 'Company' ? 'Company Name' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6b9b8e] focus:border-transparent sm:text-sm font-medium transition-all bg-slate-50 focus:bg-white"
                placeholder={activeTab === 'Company' ? "e.g. InnovateTech" : "e.g. Ishan Gupta"}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6b9b8e] focus:border-transparent sm:text-sm font-medium transition-all bg-slate-50 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6b9b8e] focus:border-transparent sm:text-sm font-medium transition-all bg-slate-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#6b9b8e] hover:bg-[#5a8679] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b9b8e] transition-all"
            >
              Create {activeTab} Account
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}