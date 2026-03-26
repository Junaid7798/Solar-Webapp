import React from 'react';
import { LogOut, Bell, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/admin/dashboard':  'Dashboard',
  '/admin/leads':      'Leads',
  '/admin/quotations': 'Quotations',
  '/admin/projects':   'Projects',
  '/admin/inventory':  'Inventory',
  '/admin/profit':     'Financial Analytics',
  '/admin/amc':        'AMC Tracker',
  '/admin/reminders':  'Reminders',
  '/admin/gallery':    'Gallery',
  '/admin/templates':  'WhatsApp Templates',
  '/admin/content':    'Content',
};

export const TopBar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const pageTitle = routeLabels[location.pathname] ?? 'Admin';

  return (
    <header className="bg-[#0B0F1A] h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden w-7 h-7 rounded-lg bg-amber flex items-center justify-center">
          <Sun size={14} className="text-[#07090F]" fill="currentColor" />
        </div>
        <h1 className="font-display font-bold text-base md:text-lg text-white/90 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber rounded-full" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer active:scale-95 text-xs font-bold uppercase tracking-wider"
          title="Logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
