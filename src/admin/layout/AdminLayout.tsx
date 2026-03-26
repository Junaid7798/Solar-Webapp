import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { QuickActions } from './QuickActions';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export const AdminLayout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#07090F] text-silver overflow-hidden font-body">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <TopBar onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#07090F] p-4 md:p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav />
        <QuickActions />
      </div>
    </div>
  );
};
