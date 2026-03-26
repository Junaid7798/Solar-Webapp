import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, DollarSign, Plus, Trash2, Save, FileText } from 'lucide-react';
import { usePersistedData } from '../../hooks/usePersistedData';

const stages = [
  'Site Survey',
  'Material Procurement',
  'Installation',
  'Net Metering',
  'MSEDCL Approval',
  'Subsidy Claim',
  'Handover',
];

interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export const ProjectDrawer = ({ isOpen, onClose, project, onSave }: any) => {
  const [activeTab, setActiveTab] = useState('progress');

  // Per-project expenses stored by project id
  const expenseKey = `expenses_${project?.id || 'new'}`;
  const [expenses, setExpenses] = usePersistedData<Expense[]>(expenseKey, [
    { id: 1, category: 'Labor', description: 'Mounting structure installation', amount: 12000, date: '2026-03-10' },
    { id: 2, category: 'Material', description: 'DC Cables & MC4 Connectors', amount: 8500, date: '2026-03-11' },
  ]);

  // Per-project current stage index stored by project id
  const stageKey = `stage_${project?.id || 'new'}`;
  const [currentStageIndex, setCurrentStageIndex] = usePersistedData<number>(
    stageKey,
    stages.indexOf(project?.status) >= 0 ? stages.indexOf(project?.status) : 0
  );

  // Add expense form state
  const [newExpense, setNewExpense] = useState({ category: 'Labor', description: '', amount: '' });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const projectValue = project?.value || 0;
  const netProfit = projectValue - totalExpenses;

  const handleAddExpense = () => {
    const amount = parseFloat(newExpense.amount);
    if (!newExpense.description || isNaN(amount) || amount <= 0) return;
    const entry: Expense = {
      id: Date.now(),
      category: newExpense.category,
      description: newExpense.description,
      amount,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses((prev) => [...prev, entry]);
    setNewExpense({ category: 'Labor', description: '', amount: '' });
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleMarkStageComplete = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handleSave = () => {
    if (onSave && project) {
      onSave({ ...project, status: stages[currentStageIndex], expenses: totalExpenses });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-sky-deep/40 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-surface shadow-2xl z-[301] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-depth text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber font-mono text-xs font-bold bg-amber-dim px-2 py-0.5 rounded">
                    {project?.id || 'NEW-PROJECT'}
                  </span>
                  <h2 className="text-xl font-display font-bold">{project?.customer || 'New Project'}</h2>
                </div>
                <p className="text-xs text-white/40">{project?.city || 'Location Pending'} • {project?.size || '0kW'} System</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-depth px-6">
              {['progress', 'expenses', 'docs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold transition-all border-b-2 capitalize ${
                    activeTab === tab ? 'border-amber text-white' : 'border-transparent text-white/30'
                  }`}
                >
                  {tab === 'progress' ? 'Progress Tracker' : tab === 'expenses' ? 'Expense Ledger' : 'Documents'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'progress' && (
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5" />
                    <div className="space-y-8">
                      {stages.map((stage, index) => {
                        const isCompleted = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                          <div key={stage} className="relative flex items-start gap-6 pl-10">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              isCompleted ? 'bg-emerald-500 text-white' :
                              isCurrent ? 'bg-amber text-depth ring-4 ring-amber/20' :
                              'bg-depth border-2 border-white/10 text-white/20'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : <span>{index + 1}</span>}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className={`font-bold ${isCompleted ? 'text-emerald' : isCurrent ? 'text-amber' : 'text-white/30'}`}>
                                  {stage}
                                </h4>
                                {isCompleted && <span className="text-[10px] font-bold text-white/30 uppercase">Completed</span>}
                              </div>
                              <p className="text-xs text-white/40">
                                {isCompleted ? 'Verification and documentation finished.' :
                                 isCurrent ? 'Currently in progress.' :
                                 'Awaiting previous stage completion.'}
                              </p>
                              {isCurrent && index < stages.length - 1 && (
                                <div className="mt-4 flex gap-2">
                                  <button
                                    onClick={handleMarkStageComplete}
                                    className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                                  >
                                    Mark as Completed
                                  </button>
                                </div>
                              )}
                              {isCurrent && index === stages.length - 1 && (
                                <div className="mt-4">
                                  <span className="text-xs font-bold text-emerald bg-emerald-dim px-3 py-1.5 rounded-lg">
                                    Project Complete
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="space-y-8">
                  {/* Financial Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-depth border border-white/5 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Project Value</p>
                      <p className="text-xl font-display font-bold text-white">₹{projectValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Total Expenses</p>
                      <p className="text-xl font-display font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-dim p-4 rounded-2xl border border-emerald/20">
                      <p className="text-[10px] font-bold text-emerald uppercase tracking-wider mb-1">Net Profit</p>
                      <p className={`text-xl font-display font-bold ${netProfit >= 0 ? 'text-emerald' : 'text-red-400'}`}>
                        ₹{netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Add Expense Form */}
                  <div className="bg-depth p-6 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Plus size={18} className="text-amber" />
                      Add New Expense
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Category</label>
                        <select
                          value={newExpense.category}
                          onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))}
                          className="admin-input w-full px-3 py-2 rounded-lg text-sm"
                        >
                          <option>Labor</option>
                          <option>Material</option>
                          <option>Transport</option>
                          <option>MSEDCL Fee</option>
                          <option>Misc</option>
                        </select>
                      </div>
                      <div className="col-span-2 lg:col-span-2">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Description</label>
                        <input
                          type="text"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense((p) => ({ ...p, description: e.target.value }))}
                          placeholder="e.g. Panel mounting labor"
                          className="admin-input w-full px-3 py-2 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))}
                          placeholder="0.00"
                          className="admin-input w-full px-3 py-2 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddExpense}
                      className="mt-4 w-full bg-amber text-depth py-2 rounded-lg font-bold text-sm hover:bg-amber-light transition-colors"
                    >
                      Add Expense Entry
                    </button>
                  </div>

                  {/* Expense List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-white/40 text-sm uppercase tracking-wider">Transactions</h4>
                    {expenses.length === 0 && (
                      <p className="text-center text-white/30 text-sm py-4">No expenses recorded yet.</p>
                    )}
                    {expenses.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-4 bg-depth border border-white/5 rounded-xl hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            exp.category === 'Labor' ? 'bg-sky-dim text-sky' : 'bg-amber-dim text-amber'
                          }`}>
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{exp.description}</p>
                            <p className="text-xs text-white/40">{exp.category} • {exp.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-red-400">₹{exp.amount.toLocaleString()}</p>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <DocCard title="Aadhar Card" status="Uploaded" />
                    <DocCard title="Electricity Bill" status="Uploaded" />
                    <DocCard title="Property Tax" status="Pending" isWarning />
                    <DocCard title="Site Photos" status="Uploaded" />
                    <DocCard title="Net Metering Form" status="Pending" isWarning />
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center justify-between">
                      Site Installation Photos
                      <button className="text-xs font-bold text-amber hover:text-amber-light transition-colors">Upload New</button>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-depth group relative">
                          <img
                            src={`https://picsum.photos/seed/solar-site-${i}/400/400`}
                            alt="Site"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="p-1.5 bg-red-500/20 rounded-full text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 hover:border-amber/50 hover:text-amber transition-all">
                        <Plus size={24} />
                        <span className="text-[10px] font-bold mt-1">Add Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-depth flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-depth border border-white/10 px-4 py-3 rounded-xl text-white/70 font-bold hover:border-white/20 hover:text-white transition-colors">
                <FileText size={20} />
                Generate Report
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-amber text-depth px-4 py-3 rounded-xl font-bold hover:bg-amber-light transition-colors shadow-lg"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DocCard = ({ title, status, isWarning }: any) => (
  <div className={`p-4 rounded-2xl border flex flex-col justify-between h-32 transition-all cursor-pointer hover:border-white/20 ${
    isWarning ? 'bg-amber-dim border-amber/20' : 'bg-depth border-white/5'
  }`}>
    <div className="flex justify-between items-start">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isWarning ? 'bg-amber/20 text-amber' : 'bg-sky-dim text-sky'}`}>
        <FileText size={16} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
        isWarning ? 'bg-amber/20 text-amber' : 'bg-emerald-dim text-emerald'
      }`}>
        {status}
      </span>
    </div>
    <p className={`font-bold text-sm ${isWarning ? 'text-amber-light' : 'text-white'}`}>{title}</p>
  </div>
);
