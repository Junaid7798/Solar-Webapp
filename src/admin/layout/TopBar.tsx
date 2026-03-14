import React from 'react';
import { LogOut, Menu, Bell } from 'lucide-react';

export const TopBar = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <header className="bg-white h-16 md:h-20 border-b border-sky/5 flex items-center justify-between px-4 md:px-8 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-lg bg-sun flex items-center justify-center">
          <span className="text-sky-deep font-bold text-sm">S</span>
        </div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-sky-deep">
          SolarEdge <span className="text-sun font-normal">Pro</span>
        </h2>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative text-gray-400 hover:text-sky-deep transition-colors p-2">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-[10px] md:text-sm font-bold uppercase tracking-wider"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
