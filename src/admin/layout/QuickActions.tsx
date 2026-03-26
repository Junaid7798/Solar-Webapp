import React, { useState } from 'react';
import { Plus, X, UserPlus, Briefcase, FileText, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <UserPlus size={20} />, label: 'New Lead', path: '/admin/leads', color: 'bg-sky text-depth' },
    { icon: <Briefcase size={20} />, label: 'New Project', path: '/admin/projects', color: 'bg-amber text-depth' },
    { icon: <FileText size={20} />, label: 'New Quote', path: '/admin/quotations', color: 'bg-emerald text-depth' },
    { icon: <Package size={20} />, label: 'Add Stock', path: '/admin/inventory', color: 'bg-surface text-white border border-white/10' },
  ];

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse items-end gap-3 mb-4">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="bg-card px-3 py-1 rounded-lg text-xs font-bold text-white/70 shadow-lg border border-white/10">
                  {action.label}
                </span>
                <button
                  onClick={() => handleAction(action.path)}
                  className={`${action.color} p-3 rounded-full shadow-lg hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-500 text-white rotate-45' : 'bg-amber text-depth rotate-0'
        } p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95`}
      >
        <Plus size={24} className="transition-transform" />
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-void/60 backdrop-blur-md -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
