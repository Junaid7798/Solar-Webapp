import React from 'react';
import { Calendar, Search, Plus, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { usePersistedData } from '../../hooks/usePersistedData';
import type { AMCContract, ColorKey } from '../../../types/admin';

export const AMC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');

  const [amcList] = usePersistedData('amc_list', [
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

  const handleRemind = (amc: AMCContract) => {
    const message = `Namaste ${amc.customer} ji, your solar system AMC service is ${amc.status === 'Overdue' ? 'overdue' : 'due soon'}. Next service date: ${amc.nextService}. Please contact us to schedule. - Asrar Solar`;
    window.open(`https://wa.me/91${amc.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">AMC Tracker</h1>
          <p className="text-white/40">Manage Annual Maintenance Contracts and service schedules.</p>
        </div>

        <button className="flex items-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
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
                    <button
                      onClick={() => handleRemind(amc)}
                      className="flex items-center gap-1 text-sky font-bold hover:text-sky-light transition-colors text-sm"
                    >
                      <Bell size={14} />
                      Remind
                    </button>
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
    </div>
  );
};

const StatBox = ({ title, value, icon: Icon, color }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  color: ColorKey;
}) => {
  const colors: Record<string, string> = {
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
