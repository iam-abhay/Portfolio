import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectManager from './pages/admin/ProjectManager';
import SkillManager from './pages/admin/SkillManager';
import ExpManager from './pages/admin/ExpManager';
import EduManager from './pages/admin/EduManager';
import CertManager from './pages/admin/CertManager';
import ProfileManager from './pages/admin/ProfileManager';

export default function App() {
  return (
    <Routes>
      {/* Public Recruiter Portfolio Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Hidden Admin Authentication Route */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Protected Admin CMS Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<ProjectManager />} />
        <Route path="skills" element={<SkillManager />} />
        <Route path="experience" element={<ExpManager />} />
        <Route path="education" element={<EduManager />} />
        <Route path="certifications" element={<CertManager />} />
        <Route path="profile" element={<ProfileManager />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
