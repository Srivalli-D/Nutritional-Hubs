import React, { useState, useEffect } from "react";
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
import { TrendingDown, TrendingUp, Calendar, Plus, X, Weight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from "firebase/firestore";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function Analytics() {
  const { user } = useAuth();
  const [weightLogs, setWeightLogs] = useState<any[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'weightLogs'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          weight: d.weight,
          day: d.timestamp?.toDate ? format(d.timestamp.toDate(), 'MM/dd') : '...',
          ...d
        };
      });
      setWeightLogs(data);
    });

    return unsubscribe;
  }, [user]);

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWeight) return;
    setIsLogging(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'weightLogs'), {
        userId: user.uid,
        weight: Number(newWeight),
        timestamp: serverTimestamp()
      });
      setShowLogModal(false);
      setNewWeight("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
    }
  };

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 0;
  const initialWeight = weightLogs.length > 0 ? weightLogs[0].weight : 0;
  const diff = currentWeight - initialWeight;

  return (
    <div className="p-8 pb-16 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Health Analytics</h1>
          <p className="text-slate-500">Track your physiological progress over time.</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 gap-1 shadow-sm">
          <button className="px-6 py-2 bg-emerald-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/10 active:scale-95 transition-all" onClick={() => setShowLogModal(true)}>
            <Plus className="w-3 h-3 inline mr-2" /> Log Weight
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-3 frosted-card p-10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-display font-bold text-slate-800 tracking-tight">Weight Progress (kg)</h3>
            {weightLogs.length > 1 && (
              <div className={cn("flex items-center gap-2 font-bold px-4 py-2 rounded-2xl text-[10px] uppercase tracking-widest shadow-inner", 
                diff <= 0 ? "text-emerald-700 bg-emerald-100/50" : "text-rose-700 bg-rose-100/50")}>
                {diff <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {Math.abs(diff).toFixed(1)}kg overall
              </div>
            )}
          </div>
          <div className="h-[400px] w-full">
            {weightLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightLogs}>
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
                    domain={['dataMin - 2', 'dataMax + 2']} 
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <Weight className="w-16 h-16 mb-4" />
                <p className="font-display font-bold text-xl uppercase tracking-widest">No data logged yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-800 backdrop-blur-xl border border-emerald-700/50 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-emerald-900/10">
          <div>
            <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center mb-10 shadow-lg backdrop-blur-md">
              <Calendar className="text-emerald-300 w-7 h-7" />
            </div>
            <h4 className="text-2xl font-display font-bold mb-4 tracking-tight uppercase italic text-emerald-400">Status Report</h4>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-10 italic font-medium">"Your consistency in tracking determines the accuracy of my nutritional forecasts."</p>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3">Goal Progress</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-400 w-[65%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10">
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-3 leading-none underline">Current Cycle</p>
            <p className="text-3xl font-display font-bold mb-1">{currentWeight || '--'} <span className="text-sm font-medium text-emerald-300 tracking-normal italic">kg</span></p>
            <p className="text-[10px] text-emerald-100/40 font-bold uppercase tracking-widest">Last weight recorded</p>
          </div>
        </div>
      </div>

      {/* Weight Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
              className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-50">
                <h3 className="text-2xl font-display font-bold text-slate-900">Log Weight</h3>
                <button onClick={() => setShowLogModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLogWeight} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Weight (kg)</label>
                    <input 
                      required
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="e.g., 74.5"
                      className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-display text-2xl font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLogging}
                  className="w-full py-5 rounded-[2rem] bg-emerald-900 text-white font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLogging ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Entry"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
