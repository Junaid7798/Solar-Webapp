import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';
import { usePersistedData } from '../../hooks/usePersistedData';

export const ProfitDashboard = () => {
  const [financeData, setFinanceData] = usePersistedData('profit_chart_data', [
    { name: 'Jan', revenue: 450000, expenses: 310000, profit: 140000 },
    { name: 'Feb', revenue: 520000, expenses: 340000, profit: 180000 },
    { name: 'Mar', revenue: 380000, expenses: 260000, profit: 120000 },
    { name: 'Apr', revenue: 610000, expenses: 410000, profit: 200000 },
    { name: 'May', revenue: 590000, expenses: 390000, profit: 200000 },
    { name: 'Jun', revenue: 720000, expenses: 480000, profit: 240000 },
  ]);

  const [categoryData, setCategoryData] = usePersistedData('profit_categories', [
    { name: 'Labor', value: 35, color: '#FFB347' },
    { name: 'Material', value: 45, color: '#0D1B2A' },
    { name: 'Transport', value: 10, color: '#00C896' },
    { name: 'Misc', value: 10, color: '#7A8FA6' },
  ]);

  const totalRevenue = (financeData as any[]).reduce((s: number, m: any) => s + (m.revenue || 0), 0);
  const totalExpenses = (financeData as any[]).reduce((s: number, m: any) => s + (m.expenses || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Financial Analytics</h1>
        <p className="text-white/40">Real-time tracking of revenue, expenses, and net profitability.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={fmt(totalRevenue)}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Total Expenses"
          value={fmt(totalExpenses)}
          icon={TrendingDown}
          color="red"
        />
        <MetricCard
          title="Net Profit"
          value={fmt(netProfit)}
          isPositive={netProfit >= 0}
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          isPositive={Number(profitMargin) >= 0}
          icon={Activity}
          color="sun"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-display text-white">Revenue vs Expenses</h2>
            <select className="admin-input text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB347" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FFB347" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D1B2A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0D1B2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#131D35', color: '#CBD5E1' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FFB347" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#0D1B2A" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="admin-card p-6">
          <h2 className="text-xl font-bold font-display text-white mb-8">Expense Breakdown</h2>
          <div className="h-[250px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-white/60">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Profit Bar Chart */}
      <div className="admin-card p-6">
        <h2 className="text-xl font-bold font-display text-white mb-8">Monthly Net Profit</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#131D35', color: '#CBD5E1' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Profit']}
              />
              <Bar dataKey="profit" fill="#00C896" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, isPositive = true, icon: Icon, color }: any) => {
  const colorClasses: any = {
    blue: 'bg-sky-dim text-sky',
    red: 'bg-red-500/10 text-red-400',
    emerald: 'bg-emerald-dim text-emerald',
    sun: 'bg-amber-dim text-amber',
  };

  return (
    <div className="admin-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
            isPositive ? 'bg-emerald-dim text-emerald' : 'bg-red-500/10 text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm font-bold text-white/40 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-display font-bold text-white">{value}</p>
    </div>
  );
};
