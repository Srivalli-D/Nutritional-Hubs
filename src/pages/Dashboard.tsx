import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Droplets, 
  Flame, 
  Target, 
  Plus, 
  ChevronRight,
  Apple,
  Coffee,
  Sun,
  Moon,
  Zap,
  Trophy,
  Activity,
  X,
  Utensils
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { format, startOfDay, endOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, unit, icon: Icon, color, bg }: any) => (
  <div className="frosted-card p-6 flex items-center gap-4 hover:scale-[1.02]">
    <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-inner`}>
      <Icon className={`w-7 h-7 ${color}`} />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-slate-800">{value}</span>
        <span className="text-sm text-slate-400 font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const StreakDisplay = ({ days }: { days: number }) => (
  <div className="relative group cursor-pointer inline-block">
    <div className="absolute inset-0 bg-orange-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full" />
    <div className="relative flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-[2rem] shadow-xl shadow-orange-950/5">
      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center animate-bounce-slow">
        <Zap className="w-7 h-7 text-orange-500 fill-orange-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Streak</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-slate-800">{days}</span>
          <span className="text-sm text-orange-500 font-bold uppercase tracking-tight">Days</span>
        </div>
      </div>
    </div>
  </div>
);

const MilestoneItem = ({ milestone, current, label, icon: Icon, color }: any) => {
  const isReached = current >= milestone;
  return (
    <div className={cn("p-4 rounded-3xl border flex flex-col items-center gap-2 transition-all relative", 
      isReached ? "bg-white border-white shadow-lg scale-105" : "bg-white/40 border-dashed border-slate-200 opacity-60")}>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isReached ? color : "bg-slate-100 text-slate-300")}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      {isReached && <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white"><Trophy className="w-3 h-3 text-white" /></div>}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streakDays, setStreakDays] = useState(14);
  const [intakes, setIntakes] = useState<any[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({ name: '', calories: '', protein: '', type: 'meal' });

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'intakes'),
      where('timestamp', '>=', startOfDay(new Date())),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIntakes(data);
    });

    return unsubscribe;
  }, [user]);

  const handleLogIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'intakes'), {
        userId: user.uid,
        name: logForm.name,
        calories: Number(logForm.calories),
        protein: Number(logForm.protein),
        type: logForm.type,
        timestamp: serverTimestamp()
      });
      setShowLogModal(false);
      setLogForm({ name: '', calories: '', protein: '', type: 'meal' });
    } catch (error) {
      console.error(error);
    }
  };

  const totals = intakes.reduce((acc, curr) => ({
    calories: acc.calories + (curr.calories || 0),
    protein: acc.protein + (curr.protein || 0),
    water: acc.water + (curr.type === 'water' ? 0.25 : 0) // Assume glass is 0.25L
  }), { calories: 0, protein: 0, water: 0 });

  const chartData = [
    { name: "Mon", calories: 1800, goal: 2000 },
    { name: "Tue", calories: 2100, goal: 2000 },
    { name: "Wed", calories: 1950, goal: 2000 },
    { name: "Thu", calories: 2300, goal: 2000 },
    { name: "Fri", calories: 2000, goal: 2000 },
    { name: "Sat", calories: 2400, goal: 2000 },
    { name: "Today", calories: totals.calories, goal: 2000 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 pb-16 max-w-7xl mx-auto relative z-10"
    >
      <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
              Good morning, {user?.displayName?.split(' ')[0] || 'Explorer'}
            </h1>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <p className="text-slate-500 font-medium">Your nutrition plan is optimized for <span className="text-emerald-600">high energy</span> today.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <StreakDisplay days={streakDays} />
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/10 active:scale-95 transition-all hover:bg-emerald-800 uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Log Intake
            </button>
          </div>
        </div>
      </header>

      {/* Gamification Strip */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <MilestoneItem milestone={7} current={streakDays} label="7 Day Goal" icon={Activity} color="bg-emerald-100 text-emerald-600" />
        <MilestoneItem milestone={14} current={streakDays} label="Fortnight" icon={Trophy} color="bg-orange-100 text-orange-600" />
        <MilestoneItem milestone={30} current={streakDays} label="Monthly" icon={Target} color="bg-blue-100 text-blue-600" />
        <div className="frosted-card p-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-emerald-500 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Reward</p>
          <p className="text-xs font-bold text-slate-800">Premium AI Insights</p>
          <p className="text-[9px] text-emerald-600 font-bold uppercase mt-1">16 Days Remaining</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Daily Calories" value={totals.calories.toLocaleString()} unit="/ 2200" icon={Flame} color="text-orange-600" bg="bg-orange-100/50" />
        <StatCard title="Water Intake" value={totals.water.toFixed(1)} unit="Liters" icon={Droplets} color="text-blue-600" bg="bg-blue-100/50" />
        <StatCard title="Protein" value={totals.protein} unit="g" icon={Target} color="text-rose-600" bg="bg-rose-100/50" />
        <div className="bg-emerald-600 p-6 rounded-[2rem] shadow-xl shadow-emerald-600/30 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform" />
          <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Health Score</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-display font-bold">94</span>
            <span className="text-sm text-emerald-100/80 font-medium">Excellent</span>
          </div>
          <p className="text-[10px] text-emerald-100/80 leading-relaxed font-medium uppercase tracking-tight">Top 5% of users today</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 frosted-card p-8 group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl text-slate-800 tracking-tight">Weight Trends</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-white transition-colors border border-transparent hover:border-slate-200">Weekly</button>
              <button className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.4)', stroke: '#fff', strokeWidth: 1 }} 
                  contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="calories" radius={[12, 12, 12, 12]} barSize={44}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.calories > entry.goal ? 'rgba(5, 150, 105, 0.8)' : 'rgba(5, 150, 105, 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="frosted-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl text-slate-800 tracking-tight">Daily Log</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Today</p>
          </div>
          <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto pr-2">
            {intakes.length === 0 ? (
              <div className="text-center py-12 opacity-40">
                <Utensils className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No logs yet</p>
              </div>
            ) : (
              intakes.map((item, i) => (
                <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl bg-white/80 border border-white shadow-sm transition-all hover:border-emerald-100">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${item.type === 'water' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                    {item.type === 'water' ? '💧' : '🥗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">
                        {item.timestamp?.toDate ? format(item.timestamp.toDate(), 'h:mm a') : 'Just now'}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{item.calories} kcal • {item.protein}g P</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-50">
                <h3 className="text-2xl font-display font-bold text-slate-900">Log Nutrition</h3>
                <button onClick={() => setShowLogModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLogIntake} className="p-8 space-y-6">
                <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl">
                  {['meal', 'water'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLogForm({ ...logForm, type: t })}
                      className={cn("flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", 
                        logForm.type === t ? "bg-white text-emerald-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {logForm.type === 'meal' ? (
                  <>
                    <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meal Name</label>
                    <input 
                      required
                      value={logForm.name}
                      onChange={(e) => setLogForm({ ...logForm, name: e.target.value })}
                      placeholder="e.g., Avocado Toast"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Calories</label>
                      <input 
                        required
                        type="number"
                        value={logForm.calories}
                        onChange={(e) => setLogForm({ ...logForm, calories: e.target.value })}
                        placeholder="0"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Protein (g)</label>
                      <input 
                        required
                        type="number"
                        value={logForm.protein}
                        onChange={(e) => setLogForm({ ...logForm, protein: e.target.value })}
                        placeholder="0"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="py-8 text-center bg-blue-50 rounded-[2rem] border border-blue-100">
                    <p className="text-xl font-display font-bold text-blue-900 mb-1">Log a Glass</p>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">0.25 Liters of Hydration</p>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 rounded-[2rem] bg-emerald-900 text-white font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirm Log <ChevronRight className="w-5 h-5 text-emerald-400" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* AI Suggestion Box */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="mt-8 p-8 bg-emerald-800 backdrop-blur-xl border border-emerald-700/50 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-emerald-900/10"
      >
        <div className="z-10 bg-emerald-400/20 p-5 rounded-3xl backdrop-blur-sm">
          <Apple className="w-10 h-10 text-emerald-300" />
        </div>
        <div className="z-10 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em]">AI Insight</span>
          </div>
          <p className="text-white font-display font-medium text-lg leading-snug">
            "Based on your heart rate trend, I suggest increasing Magnesium-rich foods today to optimize your recovery score."
          </p>
        </div>
        <button 
          onClick={() => navigate('/coach')}
          className="z-10 whitespace-nowrap bg-emerald-400 text-emerald-950 px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-400/20"
        >
          Chat with Coach
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-[60px] -ml-24 -mb-24" />
      </motion.div>
    </motion.div>
  );
}
