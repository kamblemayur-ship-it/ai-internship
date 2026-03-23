import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
  <div className="p-10 text-center text-2xl font-bold text-slate-400 h-screen flex items-center justify-center bg-slate-50">
    404: Route Not Found in Engine
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
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
    </Router>
  );
}