import React from 'react';
import LegalPage from './components/LegalPage';
import DashboardLayout from './components/DashboardLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';

// --- PUBLIC ROUTES ---
import LandingPage from './components/LandingPage';
import Login from './components/Login';

// --- STUDENT ROUTES ---
import StudentDashboard from './components/StudentDashboard';
import Opportunities from './components/Opportunities';
import Chatbot from './components/Chatbot';
import StudentApplications from './components/StudentApplications';
import StudentProfile from './components/StudentProfile';
import StudentAI from './components/StudentAI';

// --- COMPANY ROUTES ---
import CompanyDashboard from './components/CompanyDashboard';
import CompanyInternships from './components/CompanyInternships';
import CompanyApplications from './components/CompanyApplications';
import CompanyProfile from './components/CompanyProfile';

// --- ADMIN ROUTES ---
import AdminDashboard from './components/AdminDashboard';
import AdminStudents from './components/AdminStudents';
import AdminStartups from './components/AdminStartups';
import AdminAnnouncements from './components/AdminAnnouncements';
import AdminSettings from './components/AdminSettings';

// --- FALLBACK COMPONENT ---
const NotFound = () => (
  <div className="p-10 text-center text-2xl font-bold text-slate-400 h-screen flex items-center justify-center bg-transparent">
    404: Route Not Found in Engine
  </div>
);

export default function App() {
  return (
    <Router>
      {/* 1. THE GLOBAL CANVAS: This ensures the gradient and blobs exist on EVERY page */}
      <div className="min-h-screen font-sans bg-gradient-to-br from-slate-100 via-emerald-50/50 to-slate-200 relative overflow-hidden flex flex-col">
        
        {/* Abstract background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#6b9b8e]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

        {/* 2. THE ROUTER: All pages render on top of the canvas */}
        <div className="relative z-10 flex-1 flex flex-col">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
            <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
            
            {/* THE STUDENT SITE */}
            <Route path="/student/dashboard" element={<DashboardLayout role="Student"><StudentDashboard /></DashboardLayout>} />
            <Route path="/student/opportunities" element={<DashboardLayout role="Student"><Opportunities /></DashboardLayout>}/>
            <Route path="/student/chat" element={<DashboardLayout role="Student"><Chatbot /></DashboardLayout>} />
            <Route path="/student/applications" element={<DashboardLayout role="Student"><StudentApplications /></DashboardLayout>} />
            <Route path="/student/profile" element={<DashboardLayout role="Student"><StudentProfile /></DashboardLayout>} />
            <Route path="/student/ai" element={<DashboardLayout role="Student"><StudentAI /></DashboardLayout>} />

            {/* THE COMPANY SITE */}
            <Route path="/company/dashboard" element={<DashboardLayout role="Company"><CompanyDashboard /></DashboardLayout>} />
            <Route path="/company/internships" element={<DashboardLayout role="Company"><CompanyInternships /></DashboardLayout>} />
            <Route path="/company/post" element={<DashboardLayout role="Company"><CompanyInternships /></DashboardLayout>} />
            <Route path="/company/applicants" element={<DashboardLayout role="Company"><CompanyApplications /></DashboardLayout>} />
            <Route path="/company/profile" element={<DashboardLayout role="Company"><CompanyProfile /></DashboardLayout>} />

            {/* THE ADMIN SITE */}
            <Route path="/admin/dashboard" element={<DashboardLayout role="Admin"><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/students" element={<DashboardLayout role="Admin"><AdminStudents /></DashboardLayout>} />
            <Route path="/admin/startups" element={<DashboardLayout role="Admin"><AdminStartups /></DashboardLayout>} />
            <Route path="/admin/announcements" element={<DashboardLayout role="Admin"><AdminAnnouncements /></DashboardLayout>} />
            <Route path="/admin/settings" element={<DashboardLayout role="Admin"><AdminSettings /></DashboardLayout>} />

            {/* CATCH-ALL FOR BAD URLS */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}