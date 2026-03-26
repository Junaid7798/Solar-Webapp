import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Briefcase, Package } from 'lucide-react';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home',     path: '/admin/dashboard' },
  { icon: Users,           label: 'Leads',    path: '/admin/leads' },
  { icon: FileText,        label: 'Quotes',   path: '/admin/quotations' },
  { icon: Briefcase,       label: 'Projects', path: '/admin/projects' },
  { icon: Package,         label: 'Stock',    path: '/admin/inventory' },
];

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0F1A]/95 backdrop-blur-xl border-t border-white/5 px-2 py-2 z-50 flex justify-around items-center safe-area-bottom">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-90 ${
              isActive
                ? 'text-amber'
                : 'text-white/30 hover:text-white/60'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
