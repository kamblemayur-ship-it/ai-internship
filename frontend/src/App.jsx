import React from 'react';
import LegalPage from './components/LegalPage';
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
        
        {/* Abstract background blobs (pointer-events-none stops them from blocking clicks) */}
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
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/opportunities" element={<Opportunities />} />
            <Route path="/student/chat" element={<Chatbot />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/ai" element={<StudentAI />} />

            {/* THE COMPANY SITE */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/internships" element={<CompanyInternships />} />
            <Route path="/company/post" element={<CompanyInternships />} />
            <Route path="/company/applicants" element={<CompanyApplications />} />
            <Route path="/company/profile" element={<CompanyProfile />} />

            {/* THE ADMIN SITE */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/startups" element={<AdminStartups />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* CATCH-ALL FOR BAD URLS */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}