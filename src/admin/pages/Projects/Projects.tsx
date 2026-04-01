import React, { useState, useMemo } from 'react';
import { Briefcase, Plus, Search, Filter, ChevronRight, Clock, CheckCircle2, AlertCircle, DollarSign, MapPin, Calendar } from 'lucide-react';
import { ProjectDrawer } from './ProjectDrawer';
import { motion } from 'motion/react';
import { usePersistedData } from '../../hooks/usePersistedData';
import type { Project } from '../../../types/admin';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Use persisted data instead of static mock
  const [projects, setProjects] = usePersistedData('projects', [
    { 
      id: 'PRJ-2024-001', 
      customer: 'Suresh Patil', 
      city: 'Nashik', 
      size: '3kW', 
      status: 'Installation', 
      progress: 45,
      value: 180000,
      expenses: 110000,
      startDate: '01 Mar 2026'
    },
    { 
      id: 'PRJ-2024-002', 
      customer: 'Priya Deshmukh', 
      city: 'Pune', 
      size: '5kW', 
      status: 'MSEDCL Approval', 
      progress: 75,
      value: 250000,
      expenses: 165000,
      startDate: '25 Feb 2026'
    },
  ]);

  const completedStatuses = ['Handover'];
  const activeCount = projects.filter((p) => !completedStatuses.includes(p.status)).length;
  const doneCount = projects.filter((p) => completedStatuses.includes(p.status)).length;
  const margins = projects.map((p) => p.value > 0 ? ((p.value - p.expenses) / p.value) * 100 : 0);
  const avgMargin = margins.length > 0 ? Math.round(margins.reduce((a, b) => a + b, 0) / margins.length) : 0;

  const filtered = useMemo(() => projects.filter((p) => {
    const matchSearch =
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = stageFilter === 'All Stages' || p.status === stageFilter;
    return matchSearch && matchStage;
  }), [projects, searchTerm, stageFilter]);

  const openProject = (project: Project | null) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleSaveProject = (updated: Project) => {
    setProjects((prev) =>
      prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p)
    );
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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Projects</h1>
          <p className="text-xs md:text-sm text-white/40">Track installation progress and finances.</p>
        </div>
        
        <button 
          onClick={() => openProject(null)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber text-depth px-5 py-2.5 rounded-xl hover:bg-amber-light transition-colors font-bold shadow-sm text-sm"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <motion.div variants={itemAnim} className="admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sky-dim text-sky flex items-center justify-center shrink-0">
            <Clock size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Active</p>
            <p className="text-lg md:text-2xl font-display font-bold text-white">{String(activeCount).padStart(2, '0')}</p>
          </div>
        </motion.div>
        <motion.div variants={itemAnim} className="admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-dim text-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Done</p>
            <p className="text-lg md:text-2xl font-display font-bold text-white">{String(doneCount).padStart(2, '0')}</p>
          </div>
        </motion.div>
        <motion.div variants={itemAnim} className="col-span-2 md:col-span-1 admin-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-dim text-amber flex items-center justify-center shrink-0">
            <DollarSign size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">Avg. Margin</p>
            <p className="text-lg md:text-2xl font-display font-bold text-white">{avgMargin}%</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="admin-card p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="admin-input w-full pl-9 pr-8 py-2 rounded-xl appearance-none text-sm"
          >
            <option>All Stages</option>
            <option>Site Survey</option>
            <option>Procurement</option>
            <option>Installation</option>
            <option>Net Metering</option>
            <option>MSEDCL Approval</option>
            <option>Subsidy Claim</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((project) => (
          <motion.div 
            key={project.id}
            variants={itemAnim}
            onClick={() => openProject(project)}
            className="admin-card p-4 md:p-6 hover:border-amber/30 transition-all cursor-pointer group"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber/10 text-amber flex items-center justify-center font-bold shrink-0 text-sm md:text-base">
                  {project.customer[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[9px] md:text-xs font-bold text-amber bg-amber-dim px-1.5 py-0.5 rounded shrink-0">{project.id}</span>
                    <h3 className="font-display font-bold text-base md:text-xl text-white truncate">{project.customer}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-sm text-white/40">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-amber" /> {project.city}</span>
                    <span className="flex items-center gap-1"><Briefcase size={12} className="text-amber" /> {project.size}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-amber" /> {project.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-md w-full">
                <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                  <span className="text-sky uppercase tracking-wider">{project.status}</span>
                  <span className="text-white/40">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-8 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left lg:text-right">
                  <p className="text-[9px] md:text-xs font-bold text-white/30 uppercase tracking-wider mb-0.5">Profitability</p>
                  <p className="font-display font-bold text-sm md:text-lg text-emerald">
                    ₹{(project.value - project.expenses).toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="text-white/20 group-hover:text-amber transition-colors shrink-0" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </motion.div>
  );
};
