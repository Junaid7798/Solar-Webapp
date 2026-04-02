import React from 'react';
import { Users, Calendar, Zap, TrendingUp, Star, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BeforeAfterSlider } from '../../../components/ui/BeforeAfterSlider';
import { Camera, History, ArrowRight } from 'lucide-react';
import { usePersistedData } from '../../hooks/usePersistedData';
import { useCountUp } from '../../hooks/useCountUp';
import type { Lead } from '../../../types/lead';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [period, setPeriod] = React.useState<'W' | 'M'>('W');
  const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined;

  const [projects] = usePersistedData('projects', []);
  const [amcList] = usePersistedData('amc_list', []);
  const [financeData] = usePersistedData('finance_data', [{ revenue: 0, expenses: 0 }]);

  React.useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      if (!GOOGLE_SHEETS_URL) return;
      setIsLoading(true);
      try {
        const response = await fetch(GOOGLE_SHEETS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data: Lead[] = await response.json();
        setLeads(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Dashboard fetch error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [GOOGLE_SHEETS_URL]);

  const stats = React.useMemo(() => {
    const totalLeads = leads.length;
    
    // Calculate leads this week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const leadsThisWeek = leads.filter(l => {
      const ts = l.timestamp || l.Timestamp || l[0];
      if (!ts) return false;
      return new Date(ts) > oneWeekAgo;
    }).length;

    // Calculate total system size (kW)
    const totalKW = leads.reduce((sum, l) => {
      const sizeStr = l.size || l.Size || l[8] || '0';
      const num = parseFloat(sizeStr.replace(/[^0-9.]/g, '')) || 0;
      return sum + num;
    }, 0);

    // Calculate leads by service for funnel
    const serviceCounts: Record<string, number> = {};
    leads.forEach(l => {
      const s = l.services || l.Services || l[6] || 'Other';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });

    const colors = ['#0D1B2A', '#FFB347', '#14213D', '#2D6A4F', '#7A8FA6'];
    const funnel = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));

    return {
      totalLeads,
      leadsThisWeek,
      totalKW: totalKW.toFixed(1),
      funnel
    };
  }, [leads]);

  const leadTrend = stats.totalLeads > 0 ? `+${Math.round((stats.leadsThisWeek / stats.totalLeads) * 100)}%` : '0%';

  const recentActivity = leads.slice(-5).reverse().map(l => ({
    title: `New Lead: ${l.name || l.Name || (l as any)[1] || 'Unknown'}`,
    time: l.timestamp || l.Timestamp || (l as any)[0] || 'Recently',
    icon: Users,
    color: 'text-blue-500'
  }));

  // Derived stats from real persisted data
  const amcCount = (amcList as any[]).length;
  const totalProfit = (financeData as any[]).reduce((sum: number, m: any) => sum + ((m.revenue || 0) - (m.expenses || 0)), 0);
  const profitLabel = totalProfit >= 100000
    ? `₹${(totalProfit / 100000).toFixed(1)}L`
    : totalProfit > 0 ? `₹${totalProfit.toLocaleString()}` : '₹0';

  // Priority projects: active ones sorted by urgency (just take first 2)
  const completedStatuses = ['Handover'];
  const activeProjects = (projects as any[]).filter((p: any) => !completedStatuses.includes(p.status));
  const priorityProjects = activeProjects.slice(0, 2);

  // Revenue trend from financeData — period controls label/display
  const revenueData = React.useMemo(() => {
    const all = financeData as any[];
    if (all.length === 0) {
      return [
        { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
        { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
        { name: 'Jul', value: 0 },
      ];
    }
    if (period === 'W') {
      return all.slice(-7).map((m: any, i: number) => ({
        name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] ?? `D${i + 1}`,
        value: m.revenue || 0,
      }));
    }
    return all.slice(-12).map((m: any, i: number) => ({
      name: m.month || m.name || `M${i + 1}`,
      value: m.revenue || 0,
    }));
  }, [financeData, period]);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Dashboard</h1>
          <p className="text-xs md:text-sm text-white/40">Welcome back, Admin.</p>
        </div>
        <button className="md:hidden w-10 h-10 rounded-full bg-amber text-depth flex items-center justify-center shadow-lg shadow-amber/20">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <StatCard title="Total Leads" value={stats.totalLeads.toString()} icon={Users} color="bg-sky-dim text-sky" trend={leadTrend} isPositive />
        <StatCard title="This Week" value={stats.leadsThisWeek.toString()} icon={Calendar} color="bg-amber-dim text-amber" />
        <StatCard title="Capacity" value={`${stats.totalKW} kW`} icon={Zap} color="bg-emerald-dim text-emerald" />
        <StatCard title="Profit" value={profitLabel} icon={TrendingUp} color="bg-emerald-dim text-emerald-light" />
        <StatCard title="Rating" value="4.8" icon={Star} color="bg-amber-dim text-amber-light" />
        <StatCard title="AMC" value={String(amcCount)} icon={Calendar} color="bg-sky-dim text-sky-light" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2 admin-card p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display text-white">Revenue Trend</h2>
              <p className="text-[10px] md:text-xs text-white/40">{period === 'W' ? 'Daily revenue for the current week' : 'Monthly revenue overview'}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setPeriod('W')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${period === 'W' ? 'bg-amber text-depth' : 'bg-depth text-white/40 hover:text-white'}`}>W</button>
              <button onClick={() => setPeriod('M')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${period === 'M' ? 'bg-amber text-depth' : 'bg-depth text-white/40 hover:text-white'}`}>M</button>
            </div>
          </div>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#131D35', color: '#CBD5E1', fontSize: '12px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Funnel Chart */}
        <motion.div variants={item} className="admin-card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold font-display text-white mb-6">Service Distribution</h2>
          <div className="h-[180px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnel} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} width={70} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#131D35', color: '#CBD5E1', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {stats.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5">
            {stats.funnel.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/40 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Projects Widget */}
        <motion.div variants={item} className="lg:col-span-2 admin-card p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold font-display text-white">Priority Projects</h2>
            <button onClick={() => navigate('/admin/projects')} className="text-xs font-bold text-amber hover:text-amber-light transition-colors">View All &rarr;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {priorityProjects.length > 0 ? priorityProjects.map((p: any, i: number) => (
              <ProjectMiniCard
                key={p.id}
                id={p.id}
                customer={p.customer}
                status={p.status}
                progress={p.progress ?? 0}
                deadline={p.deadline || p.date || '—'}
                isUrgent={i === 0}
              />
            )) : (
              <p className="col-span-2 text-xs text-white/30 italic py-4 text-center">No active projects. Create one in the Projects section.</p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="admin-card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold font-display text-white mb-6">Recent Activity</h2>
          <div className="space-y-5">
            {recentActivity.length > 0 ? (
              recentActivity.map((act, i) => (
                <ActivityItem
                  key={i}
                  title={act.title}
                  time={new Date(act.time).toLocaleString() !== 'Invalid Date' ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : act.time}
                  icon={act.icon}
                  color={act.color}
                />
              ))
            ) : (
              <p className="text-xs text-white/30 italic">No recent activity found.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Visual Proof Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="admin-card p-4 md:p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2">
                <History className="text-amber" size={20} />
                Visual Transformation
              </h2>
              <p className="text-[10px] md:text-xs text-white/40">Featured Before & After project</p>
            </div>
            <button className="text-xs font-bold text-amber flex items-center gap-1 hover:text-amber-light transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <BeforeAfterSlider 
            before="https://picsum.photos/seed/before_dash/800/600?grayscale" 
            after="https://picsum.photos/seed/after_dash/800/600" 
            labelBefore="Old Roof"
            labelAfter="Solar Power"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="admin-card p-4 md:p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display text-white flex items-center gap-2">
                <Camera className="text-amber" size={20} />
                Recent Testimonials
              </h2>
              <p className="text-[10px] md:text-xs text-white/40">Latest project completions</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={`https://picsum.photos/seed/testimony_${i}/400/400`}
                  alt="Testimonial"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent flex items-end p-2">
                  <span className="text-[9px] font-bold text-white truncate">Project #{100 + i}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/admin/gallery')} className="w-full mt-4 py-2 bg-depth text-white/70 rounded-xl text-xs font-bold hover:text-amber hover:bg-amber-dim transition-colors">
            Manage Gallery
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, isPositive }: any) => {
  const numericTarget = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const isNumeric = !isNaN(numericTarget) && numericTarget > 0;
  const prefix = String(value).match(/^[₹]/)?.[0] ?? '';
  const suffix = String(value).match(/[kW%L]+$/)?.[0] ?? '';
  const animated = useCountUp(isNumeric ? numericTarget : 0);
  const displayValue = isNumeric ? `${prefix}${animated}${suffix}` : value;

  return (
    <motion.div variants={item} className="admin-card p-3.5 md:p-5 flex flex-col">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="md:hidden" />
          <Icon size={20} className="hidden md:block" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[9px] md:text-[10px] font-bold ${isPositive ? 'text-emerald' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-[9px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider mb-0.5 md:mb-1">{title}</p>
      <p className="text-lg md:text-2xl font-display font-bold text-white">{displayValue}</p>
    </motion.div>
  );
};

const ProjectMiniCard = ({ id, customer, status, progress, deadline, isUrgent }: any) => (
  <div className={`p-4 rounded-xl border transition-all ${
    isUrgent ? 'border-amber/30 bg-amber-dim' : 'border-white/5 bg-depth'
  }`}>
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isUrgent ? 'text-amber' : 'text-white/40'}`}>{id}</p>
        <p className={`font-bold ${isUrgent ? 'text-amber-light' : 'text-white'}`}>{customer}</p>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        isUrgent ? 'bg-amber/20 text-amber' : 'bg-sky-dim text-sky'
      }`}>
        {status}
      </span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
      <div className={`h-full rounded-full ${isUrgent ? 'bg-amber' : 'bg-sky'}`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="flex justify-between items-center text-[10px] font-bold">
      <span className="text-white/30">Progress: {progress}%</span>
      <span className={isUrgent ? 'text-amber' : 'text-white/30'}>Due: {deadline}</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, icon: Icon, color }: any) => (
  <div className="flex gap-4">
    <div className={`w-8 h-8 rounded-lg bg-sky-dim flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="text-xs text-white/30">{time}</p>
    </div>
  </div>
);
