import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layout/AdminLayout';
import { AdminLogin } from './auth/AdminLogin';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Leads } from './pages/Leads/Leads';
import { Quotations } from './pages/Quotations/Quotations';
import { Projects } from './pages/Projects/Projects';
import { ProfitDashboard } from './pages/Profit/ProfitDashboard';
import { AMC } from './pages/AMC/AMC';
import { Reminders } from './pages/Reminders/Reminders';
import { GalleryManager } from './pages/Gallery/GalleryManager';
import { WhatsAppTemplates } from './pages/Templates/WhatsAppTemplates';
import { Inventory } from './pages/Inventory/Inventory';

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
        {/* Placeholder for content route */}
        <Route path="/content" element={<div className="p-8">Content Editor (Coming Soon)</div>} />
      </Routes>
    </AdminLayout>
  );
};
