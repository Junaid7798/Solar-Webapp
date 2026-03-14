import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Briefcase, Package } from 'lucide-react';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/admin/dashboard' },
  { icon: Users, label: 'Leads', path: '/admin/leads' },
  { icon: FileText, label: 'Quotes', path: '/admin/quotations' },
  { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
  { icon: Package, label: 'Stock', path: '/admin/inventory' },
];

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-sky/5 px-2 py-2 z-50 flex justify-around items-center">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              isActive 
                ? 'text-sun scale-110' 
                : 'text-gray-400'
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
