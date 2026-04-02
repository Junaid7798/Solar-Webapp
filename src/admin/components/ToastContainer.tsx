import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-24 md:bottom-6 right-6 z-[500] flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          className={`px-4 py-3 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-sky text-[#07090F]'
          }`}
        >
          {toast.type === 'success' ? '\u2713' : toast.type === 'error' ? '\u2715' : '\u2139'} {toast.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
