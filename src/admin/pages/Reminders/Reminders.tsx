import React from 'react';
import { Bell, CheckCircle2, Plus } from 'lucide-react';
import { usePersistedData } from '../../hooks/usePersistedData';

export const Reminders = () => {
  const [activeTab, setActiveTab] = React.useState('pending');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newTask, setNewTask] = React.useState({ type: '', customer: '', date: '', priority: 'Medium' });

  const [reminders, setReminders] = usePersistedData('reminders', [
    { id: 1, type: 'MSEDCL Approval', customer: 'Suresh Patil', date: '2026-03-15', priority: 'High', status: 'Pending' },
    { id: 2, type: 'Subsidy Claim', customer: 'Priya Deshmukh', date: '2026-03-18', priority: 'Medium', status: 'Pending' },
    { id: 3, type: 'Site Survey', customer: 'Rahul Verma', date: '2026-03-12', priority: 'High', status: 'Completed' },
  ]);

  const handleComplete = (id: number) => {
    setReminders((prev: any[]) =>
      prev.map((r) => r.id === id ? { ...r, status: 'Completed' } : r)
    );
  };

  const handleAddTask = () => {
    if (!newTask.type || !newTask.customer || !newTask.date) return;
    const task = {
      id: Date.now(),
      type: newTask.type,
      customer: newTask.customer,
      date: newTask.date,
      priority: newTask.priority,
      status: 'Pending',
    };
    setReminders((prev: any[]) => [...prev, task]);
    setNewTask({ type: '', customer: '', date: '', priority: 'Medium' });
    setShowAddForm(false);
  };

  const displayed = (reminders as any[]).filter(
    (r) => r.status.toLowerCase() === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Reminders & Tasks</h1>
          <p className="text-white/40">Track critical deadlines for approvals and subsidies.</p>
        </div>

        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="admin-card p-6 space-y-4">
          <h3 className="font-bold text-white">New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-1">Task Type</label>
              <input
                value={newTask.type}
                onChange={(e) => setNewTask((p) => ({ ...p, type: e.target.value }))}
                placeholder="e.g. MSEDCL Approval"
                className="admin-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-1">Customer</label>
              <input
                value={newTask.customer}
                onChange={(e) => setNewTask((p) => ({ ...p, customer: e.target.value }))}
                placeholder="Customer name"
                className="admin-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask((p) => ({ ...p, date: e.target.value }))}
                className="admin-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
                className="admin-input w-full px-3 py-2 rounded-xl text-sm"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddTask}
              className="px-5 py-2 bg-amber text-depth rounded-xl font-bold text-sm hover:bg-amber-light transition-colors"
            >
              Save Task
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2 bg-depth text-white/40 rounded-xl font-bold text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-card rounded-t-2xl px-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'pending' ? 'border-amber text-white' : 'border-transparent text-white/30'
          }`}
        >
          Pending Tasks
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'completed' ? 'border-amber text-white' : 'border-transparent text-white/30'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="bg-card rounded-b-2xl border-x border-b border-white/5 p-6">
        <div className="space-y-4">
          {displayed.length === 0 && (
            <p className="text-center text-white/30 text-sm py-6">No {activeTab} tasks.</p>
          )}
          {displayed.map((reminder: any) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 bg-depth border border-white/5 rounded-2xl hover:border-amber/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  reminder.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-sky-dim text-sky'
                }`}>
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{reminder.type}</h3>
                  <p className="text-sm text-white/40">{reminder.customer} • Due {reminder.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  reminder.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-sky-dim text-sky'
                }`}>
                  {reminder.priority} Priority
                </span>
                {activeTab === 'pending' && (
                  <button
                    onClick={() => handleComplete(reminder.id)}
                    className="w-10 h-10 rounded-full bg-depth border border-white/10 flex items-center justify-center text-white/20 hover:text-emerald hover:border-emerald/50 transition-all"
                    title="Mark as completed"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
