import React from "react";
import { Dumbbell, Timer, Flame, PlayCircle, Star, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const WORKOUTS = [
  { title: "Morning Yoga Flow", level: "Beginner", duration: "20 min", kcal: 120, img: "https://picsum.photos/seed/yoga/300/200" },
  { title: "HIIT Intensity", level: "Advanced", duration: "35 min", kcal: 450, img: "https://picsum.photos/seed/hiit/300/200" },
  { title: "Core Stability", level: "Intermediate", duration: "15 min", kcal: 180, img: "https://picsum.photos/seed/core/300/200" },
  { title: "Strength Training", level: "Intermediate", duration: "45 min", kcal: 320, img: "https://picsum.photos/seed/strength/300/200" },
];

export default function Fitness() {
  return (
    <div className="p-8 pb-16 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Fitness Studio</h1>
        <p className="text-slate-500">Complemented workout plans for your nutritional intake.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Minutes", value: "42", unit: "min", icon: Timer, color: "text-emerald-600", bg: "bg-emerald-100/50" },
          { label: "Workout Streak", value: "5", unit: "days", icon: Star, color: "text-amber-600", bg: "bg-amber-100/50" },
          { label: "Energy Used", value: "1.2k", unit: "kcal", icon: Flame, color: "text-orange-600", bg: "bg-orange-100/50" },
          { label: "Total Load", value: "Medium", unit: "level", icon: Dumbbell, color: "text-blue-600", bg: "bg-blue-100/50" },
        ].map(s => (
          <div key={s.label} className="frosted-card p-6 flex items-center gap-4 hover:scale-[1.02] border-transparent">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shadow-inner`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">{s.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-display font-bold text-slate-800">{s.value}</span>
                <span className="text-xs text-slate-400 font-bold uppercase">{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-display font-bold text-slate-800 mb-8 tracking-tight uppercase">Curated Workouts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {WORKOUTS.map((w, i) => (
          <motion.div 
            whileHover={{ y: -8 }}
            key={i} 
            className="frosted-card overflow-hidden group cursor-pointer border-transparent hover:border-white/80"
          >
            <div className="h-44 bg-slate-100 relative overflow-hidden">
              <img src={w.img} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/40 transition-colors flex items-center justify-center backdrop-blur-[2px] group-hover:backdrop-blur-none">
                <PlayCircle className="text-white w-14 h-14 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl" />
              </div>
              <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border-white/20">
                {w.duration}
              </div>
            </div>
            <div className="p-6">
              <span className="px-3 py-1 rounded-xl bg-slate-100/50 text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4 inline-block shadow-inner">{w.level}</span>
              <h4 className="font-display font-bold text-slate-800 mb-6 group-hover:text-emerald-700 transition-colors leading-tight">{w.title}</h4>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Flame className="w-4 h-4 text-orange-500" /> {w.kcal} kcal
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-emerald-800 backdrop-blur-xl border border-emerald-700/50 p-8 rounded-[3rem] shadow-2xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-emerald-400/20 rounded-[2rem] flex items-center justify-center shrink-0 backdrop-blur-md shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
            <Dumbbell className="text-emerald-300 w-10 h-10" />
          </div>
          <div>
            <h4 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">AI Kinetic Engine</h4>
            <p className="text-emerald-100/70 text-sm max-w-md font-medium leading-relaxed">Let our AI build a routine that syncs perfectly with your real-time bio-metrics and caloric surplus.</p>
          </div>
        </div>
        <button className="bg-emerald-400 text-emerald-950 px-10 py-5 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-emerald-400/20 text-sm relative z-10 uppercase tracking-widest">
          Build Routine <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 -z-0" />
      </div>

    </div>
  );
}
