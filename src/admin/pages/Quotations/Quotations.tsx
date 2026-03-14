import React, { useState } from 'react';
import { FileText, Plus, Search, Download, ExternalLink, Trash2, Eye, MapPin, Calendar, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Quotations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for now - in real app this would come from Sheet 3
  const [quotations] = useState([
    { id: 'QT-2024-001', customer: 'Suresh Patil', city: 'Nashik', size: '3kW', date: '12 Mar 2026', status: 'Sent', total: '₹92,000' },
    { id: 'QT-2024-002', customer: 'Priya Deshmukh', city: 'Pune', size: '5kW', date: '10 Mar 2026', status: 'Accepted', total: '₹1,40,000' },
  ]);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-sky-deep mb-1">Quotations</h1>
          <p className="text-xs md:text-sm text-gray-500">Manage and track solar quotes.</p>
        </div>
        
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-sun text-sky-deep px-5 py-2.5 rounded-xl hover:bg-sun-light transition-colors font-bold shadow-sm text-sm">
          <Plus size={18} />
          New Quotation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-sky/5 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search quotes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors text-sm"
          />
        </div>
        <select className="px-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors appearance-none text-sm">
          <option>All Status</option>
          <option>Sent</option>
          <option>Accepted</option>
          <option>Rejected</option>
          <option>Revised</option>
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {quotations.map((quote, i) => (
          <motion.div 
            key={quote.id} 
            variants={itemAnim}
            className="bg-white p-4 rounded-2xl shadow-sm border border-sky/5 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-sun bg-sun/10 px-1.5 py-0.5 rounded uppercase tracking-wider">{quote.id}</span>
                <h3 className="font-bold text-sky-deep mt-1 leading-tight">{quote.customer}</h3>
              </div>
              <button className="text-gray-400 p-1">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-sun" /> {quote.city}</span>
              <span className="flex items-center gap-1"><Calendar size={12} className="text-sun" /> {quote.date}</span>
              <span className="font-bold text-sky-deep">{quote.size} System</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-sky/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Amount</span>
                <span className="text-sm font-bold text-sky-deep">{quote.total}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {quote.status}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-2 bg-light-bg text-sky-deep rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                <Eye size={14} /> View
              </button>
              <button className="flex-1 py-2 bg-sky-deep text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                <ExternalLink size={14} /> Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sky/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-deep/5 border-b border-sky/10">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Quote ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Customer</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">System</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Amount</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quote) => (
                <tr key={quote.id} className="border-b border-sky/5 hover:bg-sky/5 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-sky-deep">{quote.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-sky-deep">{quote.customer}</div>
                    <div className="text-xs text-gray-500">{quote.city}</div>
                  </td>
                  <td className="p-4 text-sm font-medium">{quote.size}</td>
                  <td className="p-4 text-sm text-gray-500">{quote.date}</td>
                  <td className="p-4 font-bold text-sky-deep">{quote.total}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-gray-400 hover:text-sky-deep transition-colors" title="View PDF">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-sun transition-colors" title="Share WhatsApp">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
