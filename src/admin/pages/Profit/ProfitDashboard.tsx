import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 450000, expenses: 310000, profit: 140000 },
  { name: 'Feb', revenue: 520000, expenses: 340000, profit: 180000 },
  { name: 'Mar', revenue: 380000, expenses: 260000, profit: 120000 },
  { name: 'Apr', revenue: 610000, expenses: 410000, profit: 200000 },
  { name: 'May', revenue: 590000, expenses: 390000, profit: 200000 },
  { name: 'Jun', revenue: 720000, expenses: 480000, profit: 240000 },
];

const categoryData = [
  { name: 'Labor', value: 35, color: '#FFB347' },
  { name: 'Material', value: 45, color: '#0D1B2A' },
  { name: 'Transport', value: 10, color: '#00C896' },
  { name: 'Misc', value: 10, color: '#7A8FA6' },
];

export const ProfitDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-sky-deep mb-2">Financial Analytics</h1>
        <p className="text-gray-500">Real-time tracking of revenue, expenses, and net profitability.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value="₹32.4L" 
          change="+12.5%" 
          isPositive={true} 
          icon={DollarSign}
          color="blue"
        />
        <MetricCard 
          title="Total Expenses" 
          value="₹21.8L" 
          change="+8.2%" 
          isPositive={false} 
          icon={TrendingDown}
          color="red"
        />
        <MetricCard 
          title="Net Profit" 
          value="₹10.6L" 
          change="+24.1%" 
          isPositive={true} 
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard 
          title="Profit Margin" 
          value="32.7%" 
          change="+2.4%" 
          isPositive={true} 
          icon={Activity}
          color="sun"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-sky/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-display">Revenue vs Expenses</h2>
            <select className="text-xs font-bold bg-light-bg border-none rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FFB347" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#0D1B2A" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-sky/5 shadow-sm">
          <h2 className="text-xl font-bold font-display mb-8">Expense Breakdown</h2>
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
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-sky-deep">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Profit Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-sky/5 shadow-sm">
        <h2 className="text-xl font-bold font-display mb-8">Monthly Net Profit</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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

const MetricCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    sun: 'bg-sun/10 text-sun',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-sky/5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-display font-bold text-sky-deep">{value}</p>
    </div>
  );
};
