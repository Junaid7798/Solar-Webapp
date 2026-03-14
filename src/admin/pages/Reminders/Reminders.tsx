import React, { useState } from 'react';
import { Bell, Calendar, CheckCircle2, Clock, AlertCircle, Plus, Search } from 'lucide-react';

export const Reminders = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const reminders = [
    { id: 1, type: 'MSEDCL Approval', customer: 'Suresh Patil', date: '2026-03-15', priority: 'High', status: 'Pending' },
    { id: 2, type: 'Subsidy Claim', customer: 'Priya Deshmukh', date: '2026-03-18', priority: 'Medium', status: 'Pending' },
    { id: 3, type: 'Site Survey', customer: 'Rahul Verma', date: '2026-03-12', priority: 'High', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-sky-deep mb-2">Reminders & Tasks</h1>
          <p className="text-gray-500">Track critical deadlines for approvals and subsidies.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-sky-deep text-white px-5 py-2.5 rounded-xl hover:bg-sky transition-colors font-bold shadow-sm">
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky/5 bg-white rounded-t-2xl px-6">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'pending' ? 'border-sun text-sky-deep' : 'border-transparent text-gray-400'
          }`}
        >
          Pending Tasks
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'completed' ? 'border-sun text-sky-deep' : 'border-transparent text-gray-400'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border-x border-b border-sky/5 p-6">
        <div className="space-y-4">
          {reminders.filter(r => r.status.toLowerCase() === activeTab).map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 bg-light-bg border border-sky/5 rounded-2xl hover:border-sun transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  reminder.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sky-deep">{reminder.type}</h3>
                  <p className="text-sm text-gray-500">{reminder.customer} • Due {reminder.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  reminder.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {reminder.priority} Priority
                </span>
                <button className="w-10 h-10 rounded-full bg-white border border-sky/10 flex items-center justify-center text-gray-300 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
