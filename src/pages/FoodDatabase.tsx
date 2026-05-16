import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Info, Plus, Wind, Activity, Zap, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FoodDatabase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const analyzeFood = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/nutrition/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodQuery: query })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToIntake = async () => {
    if (!user || !result) return;
    setIsLogging(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'intakes'), {
        userId: user.uid,
        name: result.name,
        calories: Number(result.calories),
        protein: Number(result.protein),
        carbs: Number(result.carbs),
        fats: Number(result.fats),
        type: 'meal',
        timestamp: serverTimestamp()
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="p-8 pb-16 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Smart Food Database</h1>
        <p className="text-slate-500">Get instant AI-powered nutritional analysis for any food item.</p>
      </header>

      <div className="max-w-3xl mb-12">
        <div className="relative group">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeFood()}
            placeholder="Search for any food (e.g., '100g of Grilled Salmon')..."
            className="w-full bg-white/60 backdrop-blur-md border border-white rounded-[2rem] pl-14 pr-6 py-5 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-xl shadow-emerald-900/5 text-lg group-hover:border-slate-300 font-medium"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-emerald-600 transition-colors" />
          <button 
            onClick={analyzeFood}
            disabled={isLoading || !query.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-95"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Analyze"}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20"
          >
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-6 shadow-xl shadow-emerald-100"></div>
            <p className="text-emerald-800 font-bold font-display text-xl animate-pulse tracking-tight">Analyzing nutrient profile...</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            <div className="frosted-card p-10 relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-display font-extrabold text-slate-800 capitalize tracking-tight">{result.name}</h2>
                <div className="bg-emerald-100/50 p-4 rounded-2xl shadow-inner">
                  <Activity className="text-emerald-600 w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2rem] border border-white/60 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Energy</p>
                  <p className="text-4xl font-display font-bold text-slate-800">{result.calories}<span className="text-sm font-bold text-slate-400 ml-1 uppercase">kcal</span></p>
                </div>
                <div className="bg-emerald-800 backdrop-blur-xl p-8 rounded-[2rem] border border-emerald-700/50 text-white shadow-xl shadow-emerald-900/10">
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2">Health Impact</p>
                  <p className="text-3xl font-display font-bold tracking-tight">Optimal</p>
                </div>
              </div>

              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Macro-nutrient Balance</h3>
              <div className="flex flex-col gap-6 mb-12">
                {[
                  { label: "Protein", val: result.protein, max: 50, color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
                  { label: "Carbs", val: result.carbs, max: 100, color: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" },
                  { label: "Fats", val: result.fats, max: 30, color: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" },
                ].map(macro => (
                  <div key={macro.label}>
                    <div className="flex justify-between text-[11px] font-bold mb-3 uppercase tracking-wider">
                      <span className="text-slate-500">{macro.label}</span>
                      <span className="text-slate-800 font-display">{macro.val}g</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((parseFloat(macro.val) / (macro.label === 'Carbs' ? 100 : 50)) * 100, 100)}%` }}
                        className={`h-full ${macro.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-white/60 mt-auto shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">AI Fun Fact</p>
                </div>
                <p className="text-sm text-emerald-700 leading-relaxed italic font-medium">"{result.fun_fact}"</p>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-[80px] -mr-32 -mt-32 -z-10" />
            </div>

            <div className="flex flex-col gap-8">
              <div className="frosted-card p-8 group border-transparent hover:border-white/80 transition-all">
                <h3 className="font-display font-bold text-xl text-slate-800 mb-8 tracking-tight uppercase">Key Micro-nutrients</h3>
                <div className="flex flex-wrap gap-3">
                  {result.vitamins?.map((v: string) => (
                    <div key={v} className="bg-emerald-100/50 text-emerald-700 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-white shadow-sm hover:scale-105 transition-transform cursor-default">
                      {v}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-800 backdrop-blur-xl p-10 rounded-[3rem] border border-emerald-700/50 text-white shadow-2xl shadow-emerald-900/10 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Zap className="text-emerald-400 w-5 h-5 fill-emerald-400" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Deep Insights</p>
                </div>
                <p className="text-xl leading-snug text-emerald-50 font-display font-medium mb-10 group-hover:translate-x-1 transition-transform">
                  This item contains high levels of <span className="text-emerald-400 font-bold underline decoration-2 underline-offset-4">{result.vitamins?.[0] || 'Omega-3'}</span> which is excellent for your recovery goals.
                </p>
                <button 
                  onClick={addToIntake}
                  disabled={isLogging}
                  className="w-full bg-emerald-400 text-emerald-950 py-5 rounded-[2rem] font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-400/20 text-sm italic"
                >
                  {isLogging ? <div className="w-5 h-5 border-2 border-emerald-950/30 border-t-emerald-950 rounded-full animate-spin" /> : <Plus className="w-5 h-5" />}
                  Add to intake
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!result && !isLoading && (
          <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium max-w-xs">Type a food name above to start your nutritional audit.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
