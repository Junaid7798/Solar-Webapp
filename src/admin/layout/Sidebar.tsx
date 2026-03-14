import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Briefcase, DollarSign, Calendar, Bell, Image, FileEdit, MessageSquare, Package } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Leads', path: '/admin/leads' },
  { icon: FileText, label: 'Quotations', path: '/admin/quotations' },
  { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
  { icon: Package, label: 'Inventory', path: '/admin/inventory' },
  { icon: DollarSign, label: 'Profit', path: '/admin/profit' },
  { icon: Calendar, label: 'AMC', path: '/admin/amc' },
  { icon: Bell, label: 'Reminders', path: '/admin/reminders' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: FileEdit, label: 'Content', path: '/admin/content' },
  { icon: MessageSquare, label: 'Templates', path: '/admin/templates' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sky-deep text-white flex flex-col h-full shrink-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-full bg-sun flex items-center justify-center">
          <span className="text-sky-deep font-bold text-lg">S</span>
        </div>
        <span className="font-display font-bold text-xl tracking-wide">
          SolarEdge <span className="text-sun">Pro</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-sun text-sky-deep font-bold shadow-[0_0_15px_rgba(255,179,71,0.15)]' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} className={isActive ? 'text-sky-deep' : 'text-gray-400'} />
                    <span className="tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-mid flex items-center justify-center text-sun font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-xs text-gray-400">System Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
