import React, { useState } from 'react';
import { LogOut, Bell, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePersistedData } from '../hooks/usePersistedData';

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
  const [showNotifs, setShowNotifs] = useState(false);

  const [reminders] = usePersistedData('reminders', []);
  const [amcList] = usePersistedData('amc_list', []);

  const notifications = [
    ...(reminders as any[])
      .filter((r: any) => r.status === 'Pending' && new Date(r.date) <= new Date())
      .map((r: any) => ({ type: 'Reminder', text: `${r.type} for ${r.customer} is overdue`, priority: 'high' })),
    ...(amcList as any[])
      .filter((a: any) => a.status === 'Overdue')
      .map((a: any) => ({ type: 'AMC', text: `AMC for ${a.customer} is overdue`, priority: 'high' })),
    ...(amcList as any[])
      .filter((a: any) => a.status === 'Due Soon')
      .map((a: any) => ({ type: 'AMC', text: `AMC for ${a.customer} due soon`, priority: 'medium' })),
  ];

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
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-95"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0B0F1A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white text-sm">Notifications ({notifications.length})</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0
                  ? <p className="p-4 text-white/30 text-sm">All clear!</p>
                  : notifications.map((n, i) => (
                      <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${n.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber/20 text-amber'}`}>
                          {n.type}
                        </span>
                        <p className="text-sm text-white/70 mt-1">{n.text}</p>
                      </div>
                    ))
                }
              </div>
            </div>
          )}
        </div>
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
