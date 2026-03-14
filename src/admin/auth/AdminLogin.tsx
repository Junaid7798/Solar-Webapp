import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      onLogin();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-sky-deep flex items-center justify-center p-6 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sky-mid hover:text-sun transition-colors font-bold uppercase tracking-wider text-sm"
      >
        <ArrowLeft size={20} /> Back to Website
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sky-mid border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-sun/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-sun" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold text-white text-center mb-2">Admin Login</h1>
        <p className="text-gray text-center mb-8">Enter the master password to access the ERP dashboard.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (admin123)"
              className="w-full bg-sky-deep border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sun transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-sun hover:bg-sun-light text-sky-deep font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,179,71,0.2)]"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};
