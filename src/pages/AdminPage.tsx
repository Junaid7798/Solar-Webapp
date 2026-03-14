import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Lock, LogOut, RefreshCw, AlertCircle, ArrowLeft, Search, Filter, Download, Users, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Lead {
  timestamp?: string; Timestamp?: string;
  name?: string; Name?: string;
  phone?: string; Phone?: string;
  email?: string; Email?: string;
  city?: string; City?: string;
  address?: string; Address?: string;
  services?: string; Services?: string;
  bill?: string; Bill?: string;
  size?: string; Size?: string;
  roof?: string; Roof?: string;
  time?: string; Time?: string;
  message?: string; Message?: string;
  [key: number]: string;
}

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');

  const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined;

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  const fetchLeads = async () => {
    if (!GOOGLE_SHEETS_URL) return;
    
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch(GOOGLE_SHEETS_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data: Lead[] = await response.json();
      setLeads([...data].reverse());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load leads';
      setFetchError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Derived state for filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const name = String(lead.name || lead.Name || lead[1] || '').toLowerCase();
      const email = String(lead.email || lead.Email || lead[3] || '').toLowerCase();
      const phone = String(lead.phone || lead.Phone || lead[2] || '').toLowerCase();
      const city = String(lead.city || lead.City || lead[4] || '').toLowerCase();
      const services = String(lead.services || lead.Services || lead[6] || '').toLowerCase();
      
      const matchesSearch = 
        name.includes(searchTerm.toLowerCase()) || 
        email.includes(searchTerm.toLowerCase()) || 
        phone.includes(searchTerm.toLowerCase()) ||
        city.includes(searchTerm.toLowerCase());
        
      const matchesFilter = serviceFilter === 'All' || services.includes(serviceFilter.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchTerm, serviceFilter]);

  // Stats
  const totalLeads = leads.length;
  const recentLeads = leads.filter(lead => {
    const dateStr = lead.timestamp || lead.Timestamp || lead[0];
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    
    const headers = ['Date', 'Name', 'Phone', 'Email', 'City', 'Address', 'Services', 'Bill', 'Size', 'Roof', 'Time', 'Message'];
    
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => {
        return [
          `"${new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}"`,
          `"${lead.name || lead.Name || lead[1] || ''}"`,
          `"${lead.phone || lead.Phone || lead[2] || ''}"`,
          `"${lead.email || lead.Email || lead[3] || ''}"`,
          `"${lead.city || lead.City || lead[4] || ''}"`,
          `"${lead.address || lead.Address || lead[5] || ''}"`,
          `"${lead.services || lead.Services || lead[6] || ''}"`,
          `"${lead.bill || lead.Bill || lead[7] || ''}"`,
          `"${lead.size || lead.Size || lead[8] || ''}"`,
          `"${lead.roof || lead.Roof || lead[9] || ''}"`,
          `"${lead.time || lead.Time || lead[10] || ''}"`,
          `"${lead.message || lead.Message || lead[11] || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `solar_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
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
          <p className="text-gray text-center mb-8">Enter the generic password to access the dashboard.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
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
  }

  return (
    <div className="min-h-screen bg-light-bg text-sky-deep">
      {/* Admin Header */}
      <header className="bg-sky-deep text-white py-4 px-6 md:px-12 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-10 h-10 rounded-full bg-sun flex items-center justify-center hover:scale-105 transition-transform">
            <span className="text-sky-deep font-bold text-xl">S</span>
          </Link>
          <span className="font-display font-bold text-2xl tracking-wide">
            Admin <span className="text-sun">Dashboard</span>
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sky/10 flex items-center justify-center text-sky-deep">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray uppercase tracking-wider">Total Leads</p>
              <p className="text-3xl font-display font-bold">{totalLeads}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray uppercase tracking-wider">New This Week</p>
              <p className="text-3xl font-display font-bold">{recentLeads}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sun/10 flex items-center justify-center text-sun">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray uppercase tracking-wider">Filtered Results</p>
              <p className="text-3xl font-display font-bold">{filteredLeads.length}</p>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-sky/5">
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={18} />
              <input 
                type="text" 
                placeholder="Search name, email, city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors"
              />
            </div>
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={18} />
              <select 
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors appearance-none"
              >
                <option value="All">All Services</option>
                <option value="Installation">Installation</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inverter">Inverter</option>
                <option value="Battery">Battery</option>
                <option value="AMC">AMC</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={exportToCSV}
              disabled={filteredLeads.length === 0}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-sky-deep text-white px-4 py-2 rounded-xl hover:bg-sky transition-colors font-bold disabled:opacity-50"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button 
              onClick={fetchLeads}
              disabled={isLoading || !GOOGLE_SHEETS_URL}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-light-bg border border-sky/10 px-4 py-2 rounded-xl text-sky-deep hover:bg-sky/5 transition-colors font-bold disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {fetchError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{fetchError}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-sky/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-deep/5 border-b border-sky/10">
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Date</th>
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Name</th>
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Contact</th>
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Location</th>
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Services</th>
                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-sky-mid">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray">
                        <RefreshCw className="animate-spin mx-auto mb-2 text-sun" size={24} />
                        Loading leads...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray">
                        No leads found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={`${lead.timestamp ?? lead.Timestamp ?? ''}-${lead.phone ?? lead.Phone ?? ''}`} className="border-b border-sky/5 hover:bg-sky/5 transition-colors">
                        <td className="p-4 text-sm text-gray whitespace-nowrap">
                          {new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold">{lead.name || lead.Name || lead[1]}</td>
                        <td className="p-4 text-sm">
                          <div>{lead.phone || lead.Phone || lead[2]}</div>
                          <div className="text-gray">{lead.email || lead.Email || lead[3]}</div>
                        </td>
                        <td className="p-4 text-sm">
                          <div>{lead.city || lead.City || lead[4]}</div>
                          <div className="text-gray truncate max-w-[150px]" title={lead.address || lead.Address || lead[5]}>
                            {lead.address || lead.Address || lead[5]}
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <span className="inline-block bg-teal/10 text-teal px-2 py-1 rounded text-xs font-bold">
                            {lead.services || lead.Services || lead[6]}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray">
                          <div>Bill: ₹{lead.bill || lead.Bill || lead[7]}</div>
                          <div>Size: {lead.size || lead.Size || lead[8]}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
