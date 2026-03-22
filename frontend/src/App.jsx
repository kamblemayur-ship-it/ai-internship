import StudentProfile from './components/StudentProfile';
import AdminAnnouncements from './components/AdminAnnouncements';
import AdminStudents from './components/AdminStudents';
import AdminSettings from './components/AdminSettings';
import CompanyApplications from './components/CompanyApplications';
import CompanyProfile from './components/CompanyProfile';
import Chatbot from './components/Chatbot';
import StudentAI from './components/StudentAI';
import AdminStartups from './components/AdminStartups';
import StudentApplications from './components/StudentApplications';
import CompanyInternships from './components/CompanyInternships'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --------------------------------------------------------------------------
// PATH VERIFICATION PROTOCOL (Image #1 is empty, so I am guessing paths)
// Ensure these paths match where you ACTUALLY saved the new files.
// --------------------------------------------------------------------------
import Login from './components/Login'; 
import Opportunities from './components/Opportunities'; 
import CompanyDashboard from './components/CompanyDashboard'; // Add this
import AdminDashboard from './components/AdminDashboard'; // Add this

// Temporary placeholders for other navigation pages until built
const Applications = () => <div className="p-10 text-xl font-bold">Applications (Under Construction)</div>;
const StudentsList = () => <div className="p-10 text-xl font-bold">Student Database (Under Construction)</div>;
const StartupsList = () => <div className="p-10 text-xl font-bold">Startup Database (Under Construction)</div>;
const SystemSettings = () => <div className="p-10 text-xl font-bold">Settings (Under Construction)</div>;
const NotFound = () => <div className="p-10 text-center text-2xl font-bold text-red-500 h-screen flex items-center justify-center">404: Page Not Found</div>;

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Default Route: Force everyone to login page initially */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* THE STUDENT SITE (Upgraded to DashboardLayout) */}
          <Route path="/student/opportunities" element={<Opportunities />} />
          <Route path="/student/chat" element={<Chatbot />} />
          <Route path="/student/applications" element={<StudentApplications />} />

         {/* THE COMPANY SITE */}
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/internships" element={<CompanyInternships />} />
          <Route path="/company/applicants" element={<CompanyApplications />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/post" element={<CompanyInternships />} />
          <Route path="/student/ai" element={<StudentAI />} />
          <Route path="/student/profile" element={<StudentProfile />} />

          {/* THE ADMIN SITE (Upgraded to AdminDashboard) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/startups" element={<AdminStartups />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Catch-All (If a user types a bad URL, show 404 instead of blank) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}