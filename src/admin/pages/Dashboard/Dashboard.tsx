import React from 'react';
import { Users, Calendar, Zap, TrendingUp, Star, ShieldCheck, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { motion } from 'motion/react';
import { BeforeAfterSlider } from '../../../components/ui/BeforeAfterSlider';
import { Camera, History, ArrowRight } from 'lucide-react';

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

const revenueData = [
  { name: 'Mon', value: 45000 },
  { name: 'Tue', value: 52000 },
  { name: 'Wed', value: 48000 },
  { name: 'Thu', value: 61000 },
  { name: 'Fri', value: 55000 },
  { name: 'Sat', value: 67000 },
  { name: 'Sun', value: 59000 },
];

const funnelData = [
  { name: 'Leads', value: 120, color: '#0D1B2A' },
  { name: 'Quotes', value: 85, color: '#FFB347' },
  { name: 'Site Visit', value: 45, color: '#14213D' },
  { name: 'Closed', value: 24, color: '#2D6A4F' },
];

export const Dashboard = () => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-sky-deep mb-1">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-500">Welcome back, Admin.</p>
        </div>
        <button className="md:hidden w-10 h-10 rounded-full bg-sun text-sky-deep flex items-center justify-center shadow-lg shadow-sun/20">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <StatCard title="New Leads" value="12" icon={Users} color="bg-blue-100 text-blue-600" trend="+15%" isPositive />
        <StatCard title="Active" value="8" icon={Zap} color="bg-amber-100 text-amber-600" />
        <StatCard title="Delivered" value="24" icon={ShieldCheck} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Profit" value="₹4.8L" icon={TrendingUp} color="bg-purple-100 text-purple-600" trend="+24%" isPositive />
        <StatCard title="Rating" value="4.8" icon={Star} color="bg-sun/20 text-sun" />
        <StatCard title="AMC" value="18" icon={Calendar} color="bg-teal/20 text-teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display">Revenue Trend</h2>
              <p className="text-[10px] md:text-xs text-gray-400">Daily revenue for the current week</p>
            </div>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 text-[10px] font-bold bg-sky-deep text-white rounded-lg">W</button>
              <button className="px-2.5 py-1 text-[10px] font-bold bg-light-bg text-gray-500 rounded-lg">M</button>
            </div>
          </div>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB347" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FFB347" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#FFB347" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Funnel Chart */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold font-display mb-6">Lead Funnel</h2>
          <div className="h-[180px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#0D1B2A' }} width={70} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5">
            {funnelData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-sky-deep">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Projects Widget */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold font-display">Priority Projects</h2>
            <button className="text-xs font-bold text-sky-deep hover:text-sun transition-colors">View All &rarr;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <ProjectMiniCard 
              id="PRJ-2024-001" 
              customer="Suresh Patil" 
              status="Installation" 
              progress={45} 
              deadline="Tomorrow"
              isUrgent
            />
            <ProjectMiniCard 
              id="PRJ-2024-002" 
              customer="Priya Deshmukh" 
              status="MSEDCL Approval" 
              progress={75} 
              deadline="24 Mar"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold font-display mb-6">Recent Activity</h2>
          <div className="space-y-5">
            <ActivityItem 
              title="New Lead: Amit Shah" 
              time="2 mins ago" 
              icon={Users} 
              color="text-blue-500" 
            />
            <ActivityItem 
              title="Quote Sent: QT-1024" 
              time="45 mins ago" 
              icon={TrendingUp} 
              color="text-purple-500" 
            />
            <ActivityItem 
              title="Payment: ₹45,000" 
              time="2 hours ago" 
              icon={ShieldCheck} 
              color="text-emerald-500" 
            />
          </div>
        </motion.div>
      </div>

      {/* Visual Proof Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display flex items-center gap-2">
                <History className="text-sun" size={20} />
                Visual Transformation
              </h2>
              <p className="text-[10px] md:text-xs text-gray-400">Featured Before & After project</p>
            </div>
            <button className="text-xs font-bold text-sun flex items-center gap-1 hover:underline">
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

        <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-sky/5 p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold font-display flex items-center gap-2">
                <Camera className="text-sun" size={20} />
                Recent Testimonies
              </h2>
              <p className="text-[10px] md:text-xs text-gray-400">Latest project completions</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img 
                  src={`https://picsum.photos/seed/testimony_${i}/400/400`} 
                  alt="Testimony" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-deep/60 to-transparent flex items-end p-2">
                  <span className="text-[9px] font-bold text-white truncate">Project #{100 + i}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 bg-light-bg text-sky-deep rounded-xl text-xs font-bold hover:bg-sky/5 transition-colors">
            Manage Gallery
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, isPositive }: any) => (
  <motion.div variants={item} className="bg-white p-3.5 md:p-5 rounded-2xl shadow-sm border border-sky/5 flex flex-col">
    <div className="flex justify-between items-start mb-3 md:mb-4">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={16} className="md:hidden" />
        <Icon size={20} className="hidden md:block" />
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 text-[9px] md:text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </div>
      )}
    </div>
    <p className="text-[9px] md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1">{title}</p>
    <p className="text-lg md:text-2xl font-display font-bold text-sky-deep">{value}</p>
  </motion.div>
);

const ProjectMiniCard = ({ id, customer, status, progress, deadline, isUrgent }: any) => (
  <div className={`p-4 rounded-xl border transition-all ${
    isUrgent ? 'border-amber-200 bg-amber-50' : 'border-sky/10 bg-light-bg'
  }`}>
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isUrgent ? 'text-amber-600' : 'text-gray-400'}`}>{id}</p>
        <p className={`font-bold ${isUrgent ? 'text-amber-900' : 'text-sky-deep'}`}>{customer}</p>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
        isUrgent ? 'bg-amber-200 text-amber-800' : 'bg-sky/10 text-sky-deep'
      }`}>
        {status}
      </span>
    </div>
    <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2">
      <div className={`h-full rounded-full ${isUrgent ? 'bg-amber-500' : 'bg-sky-deep'}`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="flex justify-between items-center text-[10px] font-bold">
      <span className="text-gray-400">Progress: {progress}%</span>
      <span className={isUrgent ? 'text-amber-600' : 'text-gray-400'}>Due: {deadline}</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, icon: Icon, color }: any) => (
  <div className="flex gap-4">
    <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-sm font-bold text-sky-deep">{title}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);
