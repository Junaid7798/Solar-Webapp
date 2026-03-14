import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AMC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const amcList = [
    { id: 'AMC-001', customer: 'Suresh Patil', city: 'Nashik', size: '3kW', lastService: '12 Jan 2026', nextService: '12 Jul 2026', status: 'Active' },
    { id: 'AMC-002', customer: 'Priya Deshmukh', city: 'Pune', size: '5kW', lastService: '05 Feb 2026', nextService: '05 Aug 2026', status: 'Due Soon' },
    { id: 'AMC-003', customer: 'Rahul Verma', city: 'Mumbai', size: '10kW', lastService: '20 Aug 2025', nextService: '20 Feb 2026', status: 'Overdue' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-sky-deep mb-2">AMC Tracker</h1>
          <p className="text-gray-500">Manage Annual Maintenance Contracts and service schedules.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-sky-deep text-white px-5 py-2.5 rounded-xl hover:bg-sky transition-colors font-bold shadow-sm">
          <Plus size={20} />
          New AMC Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox title="Total Contracts" value="48" icon={Calendar} color="blue" />
        <StatBox title="Due This Month" value="12" icon={Clock} color="amber" />
        <StatBox title="Overdue" value="03" icon={AlertCircle} color="red" />
        <StatBox title="Completed" value="33" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sky/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by customer or contract ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors"
          />
        </div>
        <select className="px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun transition-colors appearance-none min-w-[150px]">
          <option>All Status</option>
          <option>Active</option>
          <option>Due Soon</option>
          <option>Overdue</option>
          <option>Expired</option>
        </select>
      </div>

      {/* AMC Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-sky/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-deep/5 border-b border-sky/10">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Contract ID</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Customer</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Last Service</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Next Service</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {amcList.map((amc) => (
                <tr key={amc.id} className="border-b border-sky/5 hover:bg-sky/5 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-sky-deep">{amc.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-sky-deep">{amc.customer}</div>
                    <div className="text-xs text-gray-500">{amc.city} • {amc.size}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{amc.lastService}</td>
                  <td className="p-4 text-sm font-medium text-sky-deep">{amc.nextService}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      amc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      amc.status === 'Due Soon' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {amc.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="flex items-center gap-1 text-sky-deep font-bold hover:text-sun transition-colors text-sm">
                      <Bell size={14} />
                      Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-sky/5 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-display font-bold text-sky-deep">{value}</p>
      </div>
    </div>
  );
};
