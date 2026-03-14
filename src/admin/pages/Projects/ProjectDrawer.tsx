import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Circle, DollarSign, Plus, Trash2, Save, FileText } from 'lucide-react';

const stages = [
  'Site Survey',
  'Material Procurement',
  'Installation',
  'Net Metering',
  'MSEDCL Approval',
  'Subsidy Claim',
  'Handover'
];

export const ProjectDrawer = ({ isOpen, onClose, project }: any) => {
  const [activeTab, setActiveTab] = useState('progress');
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Labor', description: 'Mounting structure installation', amount: 12000, date: '2026-03-10' },
    { id: 2, category: 'Material', description: 'DC Cables & MC4 Connectors', amount: 8500, date: '2026-03-11' },
  ]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const projectValue = project?.value || 0;
  const netProfit = projectValue - totalExpenses;

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
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-2xl z-[301] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sky/5 bg-sky-deep text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sun font-mono text-xs font-bold bg-sun/10 px-2 py-0.5 rounded">
                    {project?.id || 'NEW-PROJECT'}
                  </span>
                  <h2 className="text-xl font-display font-bold">{project?.customer || 'New Project'}</h2>
                </div>
                <p className="text-xs text-gray-400">{project?.city || 'Location Pending'} • {project?.size || '0kW'} System</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-sky/5 bg-light-bg px-6">
              <button 
                onClick={() => setActiveTab('progress')}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'progress' ? 'border-sun text-sky-deep' : 'border-transparent text-gray-400'
                }`}
              >
                Progress Tracker
              </button>
              <button 
                onClick={() => setActiveTab('expenses')}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'expenses' ? 'border-sun text-sky-deep' : 'border-transparent text-gray-400'
                }`}
              >
                Expense Ledger
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'docs' ? 'border-sun text-sky-deep' : 'border-transparent text-gray-400'
                }`}
              >
                Documents
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'progress' && (
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
                    <div className="space-y-8">
                      {stages.map((stage, index) => {
                        const isCompleted = index < 3; // Mock logic
                        const isCurrent = index === 3;
                        
                        return (
                          <div key={stage} className="relative flex items-start gap-6 pl-10">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              isCompleted ? 'bg-emerald-500 text-white' : 
                              isCurrent ? 'bg-sun text-sky-deep ring-4 ring-sun/20' : 
                              'bg-white border-2 border-gray-200 text-gray-300'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : <span>{index + 1}</span>}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className={`font-bold ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-sky-deep' : 'text-gray-400'}`}>
                                  {stage}
                                </h4>
                                {isCompleted && <span className="text-[10px] font-bold text-gray-400 uppercase">Completed 12 Mar</span>}
                              </div>
                              <p className="text-xs text-gray-500">
                                {isCompleted ? 'Verification and documentation finished.' : 
                                 isCurrent ? 'Currently coordinating with MSEDCL team.' : 
                                 'Awaiting previous stage completion.'}
                              </p>
                              {isCurrent && (
                                <div className="mt-4 flex gap-2">
                                  <button className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors">
                                    Mark as Completed
                                  </button>
                                  <button className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                                    Add Note
                                  </button>
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
                    <div className="bg-sky-deep text-white p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Value</p>
                      <p className="text-xl font-display font-bold">₹{projectValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Total Expenses</p>
                      <p className="text-xl font-display font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Net Profit</p>
                      <p className="text-xl font-display font-bold text-emerald-600">₹{netProfit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Expense Form */}
                  <div className="bg-light-bg p-6 rounded-2xl border border-sky/5">
                    <h4 className="font-bold text-sky-deep mb-4 flex items-center gap-2">
                      <Plus size={18} className="text-sun" />
                      Add New Expense
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                        <select className="w-full px-3 py-2 bg-white border border-sky/10 rounded-lg text-sm focus:outline-none focus:border-sun">
                          <option>Labor</option>
                          <option>Material</option>
                          <option>Transport</option>
                          <option>MSEDCL Fee</option>
                          <option>Misc</option>
                        </select>
                      </div>
                      <div className="col-span-2 lg:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input type="text" placeholder="e.g. Panel mounting labor" className="w-full px-3 py-2 bg-white border border-sky/10 rounded-lg text-sm focus:outline-none focus:border-sun" />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                        <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-white border border-sky/10 rounded-lg text-sm focus:outline-none focus:border-sun" />
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-sky-deep text-white py-2 rounded-lg font-bold text-sm hover:bg-sky transition-colors">
                      Add Expense Entry
                    </button>
                  </div>

                  {/* Expense List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sky-deep text-sm uppercase tracking-wider">Recent Transactions</h4>
                    {expenses.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-4 bg-white border border-sky/5 rounded-xl hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            exp.category === 'Labor' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-sky-deep text-sm">{exp.description}</p>
                            <p className="text-xs text-gray-400">{exp.category} • {exp.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-red-500">₹{exp.amount.toLocaleString()}</p>
                          <button className="text-gray-300 hover:text-red-500 transition-colors">
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
                    <h4 className="font-bold text-sky-deep mb-4 flex items-center justify-between">
                      Site Installation Photos
                      <button className="text-xs font-bold text-sun hover:underline">Upload New</button>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-sky/5 bg-light-bg group relative">
                          <img 
                            src={`https://picsum.photos/seed/solar-site-${i}/400/400`} 
                            alt="Site" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-sky-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="p-1.5 bg-white rounded-full text-sky-deep hover:bg-sun transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="aspect-square rounded-xl border-2 border-dashed border-sky/10 flex flex-col items-center justify-center text-gray-400 hover:border-sun hover:text-sun transition-all">
                        <Plus size={24} />
                        <span className="text-[10px] font-bold mt-1">Add Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-sky/5 bg-light-bg flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-sky/10 px-4 py-3 rounded-xl text-sky-deep font-bold hover:bg-sky/5 transition-colors">
                <FileText size={20} />
                Generate Report
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-sun text-sky-deep px-4 py-3 rounded-xl font-bold hover:bg-sun-light transition-colors shadow-lg">
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
  <div className={`p-4 rounded-2xl border flex flex-col justify-between h-32 transition-all cursor-pointer hover:shadow-md ${
    isWarning ? 'bg-amber-50 border-amber-100' : 'bg-white border-sky/5'
  }`}>
    <div className="flex justify-between items-start">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-sky/5 text-sky-deep'}`}>
        <FileText size={16} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
        isWarning ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-700'
      }`}>
        {status}
      </span>
    </div>
    <p className={`font-bold text-sm ${isWarning ? 'text-amber-900' : 'text-sky-deep'}`}>{title}</p>
  </div>
);
