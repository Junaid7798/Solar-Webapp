import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, AlertCircle, Search, Filter, Download, FilePlus, MapPin, Phone, Mail, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { QuotationDrawer } from '../Quotations/QuotationDrawer';
import { motion, AnimatePresence } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Leads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');

  // Quotation Drawer state
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwUmgoqjRHlLb72LP9HhTQYVwCRWy8vQapr4OPoubFCQnGZckoqQ_IeYX4nCZQ6_5hjQw/exec';

  const openQuoteDrawer = (lead: any) => {
    setSelectedLead(lead);
    setIsQuoteDrawerOpen(true);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (!GOOGLE_SHEETS_URL) return;
    
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch(GOOGLE_SHEETS_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setLeads(data.reverse());
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-sky-deep mb-1">Leads</h1>
          <p className="text-xs md:text-sm text-gray-500">Manage your website quote requests.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={fetchLeads}
            disabled={isLoading || !GOOGLE_SHEETS_URL}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-sky/10 px-4 py-2.5 rounded-xl text-sky-deep hover:bg-sky/5 transition-colors font-bold disabled:opacity-50 shadow-sm text-sm"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-sky-deep text-white px-4 py-2.5 rounded-xl hover:bg-sky transition-colors font-bold disabled:opacity-50 text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-sky/5">
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors text-sm"
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors appearance-none text-sm"
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
      </div>

      {fetchError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          <p>{fetchError}</p>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading && leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="animate-spin mx-auto mb-3 text-sun" size={24} />
            <p className="text-xs">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-xs">No leads found.</p>
          </div>
        ) : (
          filteredLeads.map((lead, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="bg-white p-4 rounded-2xl shadow-sm border border-sky/5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sky-deep">{lead.name || lead.Name || lead[1]}</h3>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <CalendarIcon size={10} />
                    {new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  New
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone size={12} className="text-sun" />
                  {lead.phone || lead.Phone || lead[2]}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={12} className="text-sun" />
                  {lead.city || lead.City || lead[4]}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="bg-teal/10 text-teal px-2 py-0.5 rounded text-[10px] font-bold">
                  {lead.services || lead.Services || lead[6]}
                </span>
              </div>

              <div className="pt-3 border-t border-sky/5 flex gap-2">
                <button className="flex-1 py-2 bg-light-bg text-sky-deep rounded-lg text-xs font-bold hover:bg-sky/5 transition-colors">
                  Details
                </button>
                <button 
                  onClick={() => openQuoteDrawer(lead)}
                  className="flex-1 py-2 bg-teal text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-teal-600 transition-colors"
                >
                  <FilePlus size={14} />
                  Quote
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sky/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-deep/5 border-b border-sky/10">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Contact</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Location</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Services</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <RefreshCw className="animate-spin mx-auto mb-3 text-sun" size={28} />
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, i) => (
                  <tr key={i} className="border-b border-sky/5 hover:bg-sky/5 transition-colors">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-sky-deep">{lead.name || lead.Name || lead[1]}</td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-sky-deep">{lead.phone || lead.Phone || lead[2]}</div>
                      <div className="text-gray-400">{lead.email || lead.Email || lead[3]}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-sky-deep">{lead.city || lead.City || lead[4]}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="inline-block bg-teal/10 text-teal px-2 py-0.5 rounded text-[10px] font-bold">
                        {lead.services || lead.Services || lead[6]}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-3">
                        <button className="text-sky-deep font-bold hover:text-sun transition-colors">
                          Details
                        </button>
                        <button 
                          onClick={() => openQuoteDrawer(lead)}
                          className="flex items-center gap-1 text-teal font-bold hover:text-teal-600 transition-colors"
                        >
                          <FilePlus size={14} />
                          Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuotationDrawer 
        isOpen={isQuoteDrawerOpen} 
        onClose={() => setIsQuoteDrawerOpen(false)} 
        leadData={selectedLead} 
      />
    </motion.div>
  );
};
