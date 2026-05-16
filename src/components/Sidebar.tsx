import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BarChart3, 
  Search, 
  MessageSquareText, 
  Dumbbell,
  LogOut,
  Leaf,
  BookOpen
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Meal Plan", path: "/meal-plan", icon: UtensilsCrossed },
  { label: "Recipes", path: "/recipes", icon: BookOpen },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Database", path: "/database", icon: Search },
  { label: "AI Coach", path: "/coach", icon: MessageSquareText },
  { label: "Fitness", path: "/fitness", icon: Dumbbell },
];

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-64 h-full bg-white/40 backdrop-blur-2xl border-r border-white/60 p-6 flex flex-col z-10 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent italic">Nourish.</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group text-sm font-semibold",
              isActive 
                ? "bg-white/60 border border-white text-emerald-700 shadow-sm" 
                : "text-slate-500 hover:bg-white/40 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600")} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-6">
        <div className="p-4 bg-emerald-600/10 rounded-[2rem] border border-emerald-100 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Weekly Streak</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-emerald-700">14 Days</span>
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-300 bg-white overflow-hidden shadow-sm">
            <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">Elena Rose</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pro Member</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/></svg>
);
