import React, { useState } from 'react';
import { Calendar, Search, Plus, Bell, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePersistedData } from '../../hooks/usePersistedData';
import { useConfirm } from '../../hooks/useConfirm';

interface AMCRecord {
  id: string;
  customer: string;
  city: string;
  size: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: string;
}

export const AMC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingAMC, setEditingAMC] = useState<AMCRecord | null>(null);
  const { openConfirm, ConfirmDialogWrapper } = useConfirm();

  const [amcList, setAmcList] = usePersistedData<AMCRecord[]>('amc_list', [
    { id: 'AMC-001', customer: 'Suresh Patil', city: 'Nashik', size: '3kW', phone: '9876543210', lastService: '12 Jan 2026', nextService: '12 Jul 2026', status: 'Active' },
    { id: 'AMC-002', customer: 'Priya Deshmukh', city: 'Pune', size: '5kW', phone: '9823456789', lastService: '05 Feb 2026', nextService: '05 Aug 2026', status: 'Due Soon' },
    { id: 'AMC-003', customer: 'Rahul Verma', city: 'Mumbai', size: '10kW', phone: '9011223344', lastService: '20 Aug 2025', nextService: '20 Feb 2026', status: 'Overdue' },
  ]);

  const totalContracts = amcList.length;
  const dueSoon = amcList.filter((a) => a.status === 'Due Soon').length;
  const overdue = amcList.filter((a) => a.status === 'Overdue').length;
  const active = amcList.filter((a) => a.status === 'Active').length;

  const filtered = amcList.filter((a) => {
    const matchSearch =
      a.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRemind = (amc: AMCRecord) => {
    const message = `Namaste ${amc.customer} ji, your solar system AMC service is ${amc.status === 'Overdue' ? 'overdue' : 'due soon'}. Next service date: ${amc.nextService}. Please contact us to schedule. - Asrar Solar`;
    window.open(`https://wa.me/91${amc.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSaveAMC = (record: AMCRecord) => {
    setAmcList((prev) => {
      const exists = prev.some((a) => a.id === record.id);
      return exists
        ? prev.map((a) => (a.id === record.id ? record : a))
        : [record, ...prev];
    });
    setShowDrawer(false);
    setEditingAMC(null);
  };

  const handleDeleteAMC = async (id: string) => {
    const confirmed = await openConfirm({
      title: 'Delete Contract',
      message: 'Are you sure? This cannot be undone.',
    });
    if (confirmed) {
      setAmcList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const openNewDrawer = () => {
    setEditingAMC(null);
    setShowDrawer(true);
  };

  const openEditDrawer = (amc: AMCRecord) => {
    setEditingAMC(amc);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">AMC Tracker</h1>
          <p className="text-white/40">Manage Annual Maintenance Contracts and service schedules.</p>
        </div>

        <button onClick={openNewDrawer} className="flex items-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm">
          <Plus size={20} />
          New AMC Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox title="Total Contracts" value={String(totalContracts)} icon={Calendar} color="blue" />
        <StatBox title="Due This Month" value={String(dueSoon)} icon={Clock} color="amber" />
        <StatBox title="Overdue" value={String(overdue).padStart(2, '0')} icon={AlertCircle} color="red" />
        <StatBox title="Active" value={String(active)} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Filters */}
      <div className="admin-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search by customer or contract ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input px-4 py-2.5 rounded-xl appearance-none min-w-[150px]"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Due Soon</option>
          <option>Overdue</option>
          <option>Expired</option>
        </select>
      </div>

      {/* AMC Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-depth border-b border-white/5">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Contract ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Customer</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Last Service</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Next Service</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((amc) => (
                <tr key={amc.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-amber">{amc.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{amc.customer}</div>
                    <div className="text-xs text-white/40">{amc.city} • {amc.size}</div>
                  </td>
                  <td className="p-4 text-sm text-white/40">{amc.lastService}</td>
                  <td className="p-4 text-sm font-medium text-white/70">{amc.nextService}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      amc.status === 'Active' ? 'bg-emerald-dim text-emerald' :
                      amc.status === 'Due Soon' ? 'bg-amber-dim text-amber' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {amc.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditDrawer(amc)} className="text-white/50 font-bold hover:text-amber transition-colors text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleRemind(amc)} className="flex items-center gap-1 text-sky font-bold hover:text-sky-light transition-colors text-sm">
                        <Bell size={14} />
                        Remind
                      </button>
                      <button onClick={() => handleDeleteAMC(amc.id)} className="text-white/30 font-bold hover:text-red-400 transition-colors text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/30 text-sm">No contracts match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AMC Drawer */}
      <AMCDrawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setEditingAMC(null); }}
        onSave={handleSaveAMC}
        existing={editingAMC}
      />
    </div>
  );
};

const AMCDrawer = ({ isOpen, onClose, onSave, existing }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AMCRecord) => void;
  existing?: AMCRecord | null;
}) => {
  const [form, setForm] = useState<Partial<AMCRecord>>(
    existing || { customer: '', city: '', size: '', phone: '', lastService: '', nextService: '', status: 'Active' }
  );

  React.useEffect(() => {
    setForm(existing || { customer: '', city: '', size: '', phone: '', lastService: '', nextService: '', status: 'Active' });
  }, [existing]);

  const handleSave = () => {
    if (!form.customer || !form.phone) return;
    onSave({
      id: existing?.id || `AMC-${String(Date.now()).slice(-4)}`,
      customer: form.customer!,
      city: form.city || '',
      size: form.size || '',
      phone: form.phone!,
      lastService: form.lastService || new Date().toLocaleDateString('en-IN'),
      nextService: form.nextService || '',
      status: form.status || 'Active',
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-[301] flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-depth">
                <h2 className="text-xl font-bold text-white">{existing ? 'Edit AMC' : 'New AMC Contract'}</h2>
                <button onClick={onClose} aria-label="Close"><X size={24} className="text-white" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {['customer', 'phone', 'city', 'size', 'lastService', 'nextService'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-white/40 uppercase mb-1">{field}</label>
                    <input
                      type={field.includes('Service') ? 'date' : 'text'}
                      value={(form as any)[field] || ''}
                      onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                      className="admin-input w-full px-4 py-2.5 rounded-xl"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="admin-input w-full px-4 py-2.5 rounded-xl">
                    <option>Active</option>
                    <option>Due Soon</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-depth">
                <button onClick={handleSave}
                  className="w-full bg-amber text-depth font-bold py-3 rounded-xl hover:bg-amber-light transition-colors">
                  Save Contract
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const StatBox = ({ title, value, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'bg-sky-dim text-sky',
    amber: 'bg-amber-dim text-amber',
    red: 'bg-red-500/10 text-red-400',
    emerald: 'bg-emerald-dim text-emerald',
  };
  return (
    <div className="admin-card p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-display font-bold text-white">{value}</p>
      </div>
    </div>
  );
};
