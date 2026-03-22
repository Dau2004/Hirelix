import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import HRLayout from './layouts/HRLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import ApplicantDashboard from './pages/applicant/Dashboard';
import BrowseJobs from './pages/applicant/BrowseJobs';
import ApplyForm from './pages/applicant/ApplyForm';
import MyApplications from './pages/applicant/MyApplications';

import HRDashboard from './pages/hr/Dashboard';
import PostJob from './pages/hr/PostJob';
import Rankings from './pages/hr/Rankings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public + Applicant routes (top navbar) ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/applicant/dashboard" element={
              <ProtectedRoute role="applicant"><ApplicantDashboard /></ProtectedRoute>
            } />
            <Route path="/applicant/jobs" element={
              <ProtectedRoute role="applicant"><BrowseJobs /></ProtectedRoute>
            } />
            <Route path="/applicant/jobs/:id/apply" element={
              <ProtectedRoute role="applicant"><ApplyForm /></ProtectedRoute>
            } />
            <Route path="/applicant/applications" element={
              <ProtectedRoute role="applicant"><MyApplications /></ProtectedRoute>
            } />
          </Route>

          {/* ── HR routes (sidebar layout) ── */}
          <Route element={<ProtectedRoute role="hr"><HRLayout /></ProtectedRoute>}>
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            <Route path="/hr/jobs/new" element={<PostJob />} />
            <Route path="/hr/jobs/:id/rankings" element={<Rankings />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
