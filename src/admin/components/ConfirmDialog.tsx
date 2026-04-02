import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-[401] p-6"
        >
          <div className="bg-surface border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/40 mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2.5 bg-depth border border-white/10 text-white/70 rounded-xl font-bold hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
