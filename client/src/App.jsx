import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import { AuthProvider } from './providers/AuthProvider';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LoansPage from './pages/LoansPage';
import SharesPage from './pages/SharesPage';
import ProfilePage from './pages/ProfilePage';
import MembersPage from './pages/MembersPage';
import LoanApprovalPage from './pages/LoanApprovalPage';
import GroupManagementPage from './pages/GroupManagementPage';
import GroupMembersPage from './pages/GroupMembersPage';
import MaintenancePage from './pages/MaintenancePage';
import NotFound from './pages/NotFound';

import MainLayout from './components/MainLayout';
import AuthGuard from './components/AuthGuard'; // To protect routes

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  { path: '/maintenance', element: <MaintenancePage /> },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'loans',
        element: <LoansPage />,
      },
      {
        path: 'shares',
        element: <SharesPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      { path: 'members', element: <MembersPage /> }, 
    { path: 'manage-loans', element: <LoanApprovalPage /> }, 
    { path: 'manage-groups', element: <GroupManagementPage /> }, 
    { path: 'groups/:id/members', element: <GroupMembersPage /> }, 
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  return (
    <div className="app-container bg-vicoba-cream dark:bg-gray-950 min-h-screen transition-colors">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;