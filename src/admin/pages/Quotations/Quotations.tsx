import React, { useState, useMemo } from 'react';
import { Plus, Search, ExternalLink, Trash2, MapPin, Calendar, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { usePersistedData } from '../../hooks/usePersistedData';
import { QuotationDrawer } from './QuotationDrawer';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

interface Quotation {
  id: string;
  customer: string;
  city: string;
  size: string;
  date: string;
  status: string;
  total: string;
}

const statusColors: Record<string, string> = {
  Sent: 'bg-sky-dim text-sky',
  Accepted: 'bg-emerald-dim text-emerald',
  Rejected: 'bg-red-500/10 text-red-400',
  Revised: 'bg-amber-dim text-amber',
};

export const Quotations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const defaultQuotations: Quotation[] = [
    { id: 'QT-2024-001', customer: 'Suresh Patil', city: 'Nashik', size: '3kW', date: '12 Mar 2026', status: 'Sent', total: '₹92,000' },
    { id: 'QT-2024-002', customer: 'Priya Deshmukh', city: 'Pune', size: '5kW', date: '10 Mar 2026', status: 'Accepted', total: '₹1,40,000' },
  ];
  const [quotations, setQuotations] = usePersistedData('quotations', defaultQuotations);

  const filtered = useMemo(() => quotations.filter((q: Quotation) => {
    const matchSearch =
      q.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || q.status === statusFilter;
    return matchSearch && matchStatus;
  }), [quotations, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this quotation? This cannot be undone.')) return;
    setQuotations((prev: any[]) => prev.filter((q) => q.id !== id));
  };

  const handleShare = (quote: any) => {
    const message = `Namaste ${quote.customer} ji, your solar quotation (${quote.id}) is ready. System: ${quote.size}. Amount: ${quote.total}. Please contact us for details.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Quotations</h1>
            <p className="text-xs md:text-sm text-white/40">Manage and track solar quotes.</p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm text-sm"
          >
            <Plus size={18} />
            New Quotation
          </button>
        </div>

        {/* Filters */}
        <div className="admin-card p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search by customer, ID, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input px-4 py-2 rounded-xl appearance-none text-sm"
          >
            <option>All Status</option>
            <option>Sent</option>
            <option>Accepted</option>
            <option>Rejected</option>
            <option>Revised</option>
          </select>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.map((quote) => (
            <motion.div
              key={quote.id}
              variants={itemAnim}
              className="admin-card p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber bg-amber-dim px-1.5 py-0.5 rounded uppercase tracking-wider">{quote.id}</span>
                  <h3 className="font-bold text-white mt-1 leading-tight">{quote.customer}</h3>
                </div>
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/40">
                <span className="flex items-center gap-1"><MapPin size={12} className="text-amber" /> {quote.city}</span>
                <span className="flex items-center gap-1"><Calendar size={12} className="text-amber" /> {quote.date}</span>
                <span className="font-bold text-white/70">{quote.size} System</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Amount</span>
                  <span className="text-sm font-bold text-white">{quote.total}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusColors[quote.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {quote.status}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleShare(quote)}
                  className="flex-1 py-2 bg-sky-dim text-sky rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-sky/20 transition-colors"
                >
                  <ExternalLink size={14} /> Share
                </button>
                <button
                  onClick={() => handleDelete(quote.id)}
                  className="py-2 px-3 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No quotations match your search.</p>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-depth border-b border-white/5">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Quote ID</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Customer</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">System</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Date</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Amount</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((quote) => (
                  <tr key={quote.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4 font-mono text-sm font-bold text-amber">{quote.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{quote.customer}</div>
                      <div className="text-xs text-white/40">{quote.city}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-white/70">{quote.size}</td>
                    <td className="p-4 text-sm text-white/40">{quote.date}</td>
                    <td className="p-4 font-bold text-white">{quote.total}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${statusColors[quote.status] ?? 'bg-white/5 text-white/40'}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleShare(quote)}
                          className="p-2 text-white/30 hover:text-amber transition-colors"
                          title="Share via WhatsApp"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="p-2 text-white/30 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-white/30 text-sm">No quotations match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <QuotationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={(q) => setQuotations((prev: any[]) => [q, ...prev])}
      />
    </>
  );
};
