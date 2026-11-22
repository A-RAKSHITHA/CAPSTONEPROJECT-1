import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import HealthAssessment from './pages/user/HealthAssessment';
import AssessmentResult from './pages/user/AssessmentResult';
import Lifestyle from './pages/user/Lifestyle';
import HealthJourney from './pages/user/HealthJourney';
import FollowUpView from './pages/user/FollowUpView';
import UserMessages from './pages/user/UserMessages';
import UserNotifications from './pages/user/UserNotifications';
import UserProfile from './pages/user/UserProfile';

// Health Worker Pages
import NurseDashboard from './pages/healthWorker/NurseDashboard';
import PriorityReviews from './pages/healthWorker/PriorityReviews';
import AssignedMembers from './pages/healthWorker/AssignedMembers';
import MemberDetail from './pages/healthWorker/MemberDetail';
import FollowUpManager from './pages/healthWorker/FollowUpManager';
import NurseMessages from './pages/healthWorker/NurseMessages';
import NurseNotifications from './pages/healthWorker/NurseNotifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CommunityMembers from './pages/admin/CommunityMembers';
import HealthWorkers from './pages/admin/HealthWorkers';
import AssessmentsList from './pages/admin/AssessmentsList';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminTrends from './pages/admin/AdminTrends';

const AppLayout = ({ children, allowedRoles }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900">
        {/* Fixed Header: Always visible, never disappears on scrolling */}
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Application Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar: Stays fixed on the left, independent scroll */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content Area: Only this container scrolls */}
          <main className="flex-1 h-full overflow-y-auto flex flex-col focus:outline-none bg-slate-50">
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (user.role === 'ROLE_NURSE') return <Navigate to="/nurse/dashboard" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public / Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Community Member Routes */}
          <Route
            path="/user/dashboard"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <UserDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/user/health-assessment"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <HealthAssessment />
              </AppLayout>
            }
          />
          <Route
            path="/user/assessment-result"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <AssessmentResult />
              </AppLayout>
            }
          />
          <Route
            path="/user/lifestyle"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <Lifestyle />
              </AppLayout>
            }
          />
          <Route
            path="/user/history"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <HealthJourney />
              </AppLayout>
            }
          />
          <Route
            path="/user/health-journey"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <HealthJourney />
              </AppLayout>
            }
          />
          <Route
            path="/user/follow-ups"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <FollowUpView />
              </AppLayout>
            }
          />
          <Route
            path="/user/follow-up"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <FollowUpView />
              </AppLayout>
            }
          />
          <Route
            path="/user/messages"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <UserMessages />
              </AppLayout>
            }
          />
          <Route
            path="/user/notifications"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <UserNotifications />
              </AppLayout>
            }
          />
          <Route
            path="/user/alerts"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <UserNotifications />
              </AppLayout>
            }
          />
          <Route
            path="/user/profile"
            element={
              <AppLayout allowedRoles={['ROLE_USER', 'ROLE_NURSE', 'ROLE_ADMIN']}>
                <UserProfile />
              </AppLayout>
            }
          />

          {/* Health Worker Routes */}
          <Route
            path="/nurse/dashboard"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <NurseDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/priority-list"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <PriorityReviews />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/priority-reviews"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <PriorityReviews />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/members"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <AssignedMembers />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/assigned-members"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <AssignedMembers />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/members/:id"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <MemberDetail />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/follow-ups"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <FollowUpManager />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/messages"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <NurseMessages />
              </AppLayout>
            }
          />
          <Route
            path="/nurse/notifications"
            element={
              <AppLayout allowedRoles={['ROLE_NURSE', 'ROLE_ADMIN']}>
                <NurseNotifications />
              </AppLayout>
            }
          />

          {/* District Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <CommunityMembers />
              </AppLayout>
            }
          />
          <Route
            path="/admin/community-members"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <CommunityMembers />
              </AppLayout>
            }
          />
          <Route
            path="/admin/nurses"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <HealthWorkers />
              </AppLayout>
            }
          />
          <Route
            path="/admin/health-workers"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <HealthWorkers />
              </AppLayout>
            }
          />
          <Route
            path="/admin/assessments"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <AssessmentsList />
              </AppLayout>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <AdminStatistics />
              </AppLayout>
            }
          />
          <Route
            path="/admin/trends"
            element={
              <AppLayout allowedRoles={['ROLE_ADMIN']}>
                <AdminTrends />
              </AppLayout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
