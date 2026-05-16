import React from "react";
import { Leaf } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { signInWithGoogle } = useAuth();
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl glass px-8 py-4 rounded-[2.5rem] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <span className="font-display font-bold text-2xl text-emerald-900 tracking-tight italic">Nourish.</span>
      </div>

      <div className="hidden lg:flex items-center gap-10">
        <a href="#features" className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition uppercase tracking-widest">Features</a>
        <a href="#meal-plan" className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition uppercase tracking-widest">Pricing</a>
        <a href="#coaching" className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition uppercase tracking-widest">Science</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={signInWithGoogle}
          className="text-xs font-bold text-slate-600 hover:text-emerald-700 font-display px-4 py-2 uppercase tracking-widest"
        >
          Sign in
        </button>
        <button 
          onClick={signInWithGoogle}
          className="bg-emerald-900 text-white text-xs font-bold px-8 py-3 rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 font-display uppercase tracking-widest"
        >
          Join Nourish
        </button>
      </div>
    </nav>
  );
}
