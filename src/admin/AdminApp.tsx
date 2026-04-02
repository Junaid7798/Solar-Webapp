import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layout/AdminLayout';
import { AdminLogin } from './auth/AdminLogin';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Leads = lazy(() => import('./pages/Leads/Leads').then((m) => ({ default: m.Leads })));
const Quotations = lazy(() => import('./pages/Quotations/Quotations').then((m) => ({ default: m.Quotations })));
const Projects = lazy(() => import('./pages/Projects/Projects').then((m) => ({ default: m.Projects })));
const ProfitDashboard = lazy(() => import('./pages/Profit/ProfitDashboard').then((m) => ({ default: m.ProfitDashboard })));
const AMC = lazy(() => import('./pages/AMC/AMC').then((m) => ({ default: m.AMC })));
const Reminders = lazy(() => import('./pages/Reminders/Reminders').then((m) => ({ default: m.Reminders })));
const GalleryManager = lazy(() => import('./pages/Gallery/GalleryManager').then((m) => ({ default: m.GalleryManager })));
const WhatsAppTemplates = lazy(() => import('./pages/Templates/WhatsAppTemplates').then((m) => ({ default: m.WhatsAppTemplates })));
const Inventory = lazy(() => import('./pages/Inventory/Inventory').then((m) => ({ default: m.Inventory })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <Loader2 className="animate-spin text-amber" size={32} />
  </div>
);

export const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profit" element={<ProfitDashboard />} />
          <Route path="/amc" element={<AMC />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/gallery" element={<GalleryManager />} />
          <Route path="/templates" element={<WhatsAppTemplates />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/content" element={<div className="p-8">Content Editor (Coming Soon)</div>} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};
