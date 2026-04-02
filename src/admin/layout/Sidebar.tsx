import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Briefcase, DollarSign,
  Calendar, Bell, Image, MessageSquare, Package,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { config } from '../../config';

const navSections = [
  {
    label: 'Core',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users,            label: 'Leads',      path: '/admin/leads' },
      { icon: FileText,         label: 'Quotations', path: '/admin/quotations' },
      { icon: Briefcase,        label: 'Projects',   path: '/admin/projects' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: Package,    label: 'Inventory', path: '/admin/inventory' },
      { icon: DollarSign, label: 'Profit',    path: '/admin/profit' },
      { icon: Calendar,   label: 'AMC',       path: '/admin/amc' },
      { icon: Bell,       label: 'Reminders', path: '/admin/reminders' },
    ],
  },
  {
    label: 'Content',
    items: [
      { icon: Image,         label: 'Gallery',   path: '/admin/gallery' },
      { icon: MessageSquare, label: 'Templates', path: '/admin/templates' },
    ],
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`hidden md:flex flex-col h-full shrink-0 bg-[#0B0F1A] border-r border-white/5 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/5 shrink-0 h-16 ${collapsed ? 'justify-center px-3' : 'px-5 gap-3'}`}>
        <div className="w-8 h-8 rounded-xl bg-amber flex items-center justify-center shrink-0">
          <Zap size={15} className="text-[#07090F]" fill="currentColor" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-display font-bold text-base text-white whitespace-nowrap overflow-hidden"
            >
              {config.businessName.split(' ')[0]}{' '}
              <span className="text-amber">{config.businessName.split(' ').slice(1).join(' ') || 'Solar'}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pt-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-white/20"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`relative flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group ${
                        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-amber/10 text-amber font-bold'
                          : 'text-white/40 hover:text-white hover:bg-white/5 active:scale-95'
                      }`}
                    >
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber rounded-full" />
                      )}
                      <item.icon
                        size={17}
                        className={`shrink-0 ${isActive ? 'text-amber drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'group-hover:text-white'}`}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="text-sm whitespace-nowrap overflow-hidden flex-1"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && !collapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 shrink-0 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-7 h-7 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center text-amber font-bold text-xs shrink-0">
              A
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white/80 truncate leading-tight">Admin</p>
              <p className="text-[10px] text-white/25 truncate leading-tight">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center justify-center gap-2 rounded-xl text-white/25 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer active:scale-95 w-full py-2 text-xs font-bold"
        >
          {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={13} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};
