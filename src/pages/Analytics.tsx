import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { TrendingDown, TrendingUp, Calendar } from "lucide-react";

const weightData = [
  { day: "01", weight: 75.2 },
  { day: "05", weight: 74.8 },
  { day: "10", weight: 75.0 },
  { day: "15", weight: 74.3 },
  { day: "20", weight: 73.9 },
  { day: "25", weight: 74.1 },
  { day: "30", weight: 73.5 },
];

export default function Analytics() {
  return (
    <div className="p-8 pb-16 max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Health Analytics</h1>
          <p className="text-slate-500">Track your physiological progress over time.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
          <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest">Weight</button>
          <button className="px-4 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest">BMI</button>
          <button className="px-4 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest">Body Fat %</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-3 frosted-card p-10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-display font-bold text-slate-800 tracking-tight">Weight Progress (kg)</h3>
            <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-100/50 px-4 py-2 rounded-2xl text-[10px] uppercase tracking-widest shadow-inner">
              <TrendingDown className="w-4 h-4" /> -1.7kg this month
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.8)', 
                    background: 'rgba(255,255,255,0.8)', 
                    backdropFilter: 'blur(10px)', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#059669" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-800 backdrop-blur-xl border border-emerald-700/50 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-emerald-900/10">
          <div>
            <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center mb-10 shadow-lg backdrop-blur-md">
              <Calendar className="text-emerald-300 w-7 h-7" />
            </div>
            <h4 className="text-2xl font-display font-bold mb-4 tracking-tight">Active Plan</h4>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-10 italic font-medium">"Consistent tracking shows you're 84% more likely to reach your target by June 15th."</p>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3">Protein Streak</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-400 w-[92%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3">Rest Cycles</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-teal-400 w-[71%] shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                </div>
              </div>
            </div>
          </div>
          <button className="mt-12 bg-white text-emerald-950 py-5 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-xl">
            Audit Trends
          </button>
        </div>
      </div>

    </div>
  );
}
