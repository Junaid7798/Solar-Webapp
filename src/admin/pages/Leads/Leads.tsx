import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, AlertCircle, Search, Filter, Download, FilePlus, MapPin, Phone, Mail, Calendar as CalendarIcon, ChevronRight, X, Zap, Home, MessageSquare } from 'lucide-react';
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

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');

  // Quotation Drawer state
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined;

  const openQuoteDrawer = (lead: Lead) => {
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
      const data: Lead[] = await response.json();
      setLeads([...data].reverse());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load leads';
      setFetchError(message);
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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Leads</h1>
          <p className="text-xs md:text-sm text-white/40">Manage your website quote requests.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={fetchLeads}
            disabled={isLoading || !GOOGLE_SHEETS_URL}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-depth border border-white/10 px-4 py-2.5 rounded-xl text-white/70 hover:border-white/20 hover:text-white transition-colors font-bold disabled:opacity-50 text-sm"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber text-depth px-4 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold disabled:opacity-50 text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 admin-card p-3 md:p-4">
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="admin-input w-full pl-9 pr-8 py-2 rounded-xl appearance-none text-sm"
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
        <div className="bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          <p>{fetchError}</p>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading && leads.length === 0 ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="admin-card p-4 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded-lg" />
                    <div className="h-3 w-20 bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-5 w-10 bg-white/10 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-3 w-24 bg-white/5 rounded-lg" />
                  <div className="h-3 w-20 bg-white/5 rounded-lg" />
                </div>
                <div className="h-5 w-28 bg-white/5 rounded-lg" />
                <div className="pt-3 border-t border-white/5 flex gap-2">
                  <div className="flex-1 h-8 bg-white/5 rounded-lg" />
                  <div className="flex-1 h-8 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-white/30">
            <p className="text-xs">No leads found.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <motion.div
              key={`${lead.timestamp ?? lead.Timestamp ?? ''}-${lead.phone ?? lead.Phone ?? ''}`}
              variants={item}
              className="admin-card p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white">{lead.name || lead.Name || lead[1]}</h3>
                  <p className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <CalendarIcon size={10} />
                    {new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-sky-dim text-sky px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  New
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-white/40">
                  <Phone size={12} className="text-amber" />
                  {lead.phone || lead.Phone || lead[2]}
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <MapPin size={12} className="text-amber" />
                  {lead.city || lead.City || lead[4]}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="bg-emerald-dim text-emerald px-2 py-0.5 rounded text-[10px] font-bold">
                  {lead.services || lead.Services || lead[6]}
                </span>
              </div>

              <div className="pt-3 border-t border-white/5 flex gap-2">
                <button onClick={() => setDetailLead(lead)} className="flex-1 py-2 bg-depth text-white/70 rounded-lg text-xs font-bold hover:text-white transition-colors">
                  Details
                </button>
                <button
                  onClick={() => openQuoteDrawer(lead)}
                  className="flex-1 py-2 bg-sky text-depth rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-sky-light transition-colors"
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
      <div className="hidden md:block admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-depth border-b border-white/5">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Name</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Contact</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Location</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Services</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              key={filteredLeads.length}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {isLoading && leads.length === 0 ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      <td className="p-4"><div className="h-3 w-20 bg-white/10 rounded" /></td>
                      <td className="p-4"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                      <td className="p-4 space-y-1.5"><div className="h-3 w-24 bg-white/10 rounded" /><div className="h-3 w-32 bg-white/5 rounded" /></td>
                      <td className="p-4"><div className="h-3 w-20 bg-white/10 rounded" /></td>
                      <td className="p-4"><div className="h-5 w-24 bg-white/10 rounded-md" /></td>
                      <td className="p-4"><div className="h-3 w-20 bg-white/5 rounded" /></td>
                    </tr>
                  ))}
                </>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/30">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <motion.tr key={`${lead.timestamp ?? lead.Timestamp ?? ''}-${lead.phone ?? lead.Phone ?? ''}`} variants={item} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4 text-xs text-white/40 whitespace-nowrap">
                      {new Date(lead.timestamp || lead.Timestamp || lead[0]).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-white">{lead.name || lead.Name || lead[1]}</td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-white">{lead.phone || lead.Phone || lead[2]}</div>
                      <div className="text-white/40">{lead.email || lead.Email || lead[3]}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-white/70">{lead.city || lead.City || lead[4]}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="inline-block bg-emerald-dim text-emerald px-2 py-0.5 rounded text-[10px] font-bold">
                        {lead.services || lead.Services || lead[6]}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setDetailLead(lead)} className="text-white/50 font-bold hover:text-amber transition-colors">
                          Details
                        </button>
                        <button
                          onClick={() => openQuoteDrawer(lead)}
                          className="flex items-center gap-1 text-sky font-bold hover:text-sky-light transition-colors"
                        >
                          <FilePlus size={14} />
                          Quote
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {detailLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetailLead(null)}
              className="fixed inset-0 bg-void/60 backdrop-blur-sm z-[300]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-[301] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-depth text-white">
                <div>
                  <h2 className="text-xl font-display font-bold">{detailLead.name || detailLead.Name || (detailLead as any)[1]}</h2>
                  <p className="text-xs text-white/40">Lead Details</p>
                </div>
                <button onClick={() => setDetailLead(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Close">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <DetailRow icon={Phone} label="Phone" value={detailLead.phone || detailLead.Phone || (detailLead as any)[2]} />
                <DetailRow icon={Mail} label="Email" value={detailLead.email || detailLead.Email || (detailLead as any)[3]} />
                <DetailRow icon={MapPin} label="City" value={detailLead.city || detailLead.City || (detailLead as any)[4]} />
                <DetailRow icon={Home} label="Address" value={detailLead.address || detailLead.Address || (detailLead as any)[5]} />
                <DetailRow icon={Zap} label="Services" value={detailLead.services || detailLead.Services || (detailLead as any)[6]} />
                <DetailRow icon={CalendarIcon} label="Date" value={new Date(detailLead.timestamp || detailLead.Timestamp || (detailLead as any)[0]).toLocaleString()} />
                <DetailRow icon={MessageSquare} label="Message" value={detailLead.message || detailLead.Message || (detailLead as any)[11]} />
              </div>
              <div className="p-6 border-t border-white/5 bg-depth">
                <button
                  onClick={() => { setDetailLead(null); openQuoteDrawer(detailLead); }}
                  className="w-full flex items-center justify-center gap-2 bg-amber text-depth px-4 py-3 rounded-xl font-bold hover:bg-amber-light transition-colors shadow-lg"
                >
                  <FilePlus size={18} />
                  Create Quotation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuotationDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        leadData={selectedLead}
      />
    </motion.div>
  );
};

const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-dim flex items-center justify-center text-amber flex-shrink-0 mt-0.5">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-white">{String(value)}</p>
      </div>
    </div>
  );
};
