import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Utensils, 
  ChevronRight, 
  Plus, 
  Filter, 
  Target,
  Zap,
  Info
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MealPlanner() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [goal, setGoal] = useState("fat_loss");

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: {
            displayName: user?.displayName,
            weight: 70, // This could be fetched from Firestore user doc
            height: 175,
            goal: goal
          },
          goal
        })
      });
      const data = await response.json();
      setMealPlan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 pb-16 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Smart Meal Planner</h1>
          <p className="text-slate-500">AI-generated nutrition designed specifically for your goals and metabolism.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-full border border-slate-100 shadow-sm">
            {[
              { id: "fat_loss", label: "Fat Loss" },
              { id: "muscle_gain", label: "Muscle Gain" },
              { id: "maintenance", label: "Maintenance" }
            ].map(g => (
              <button 
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${goal === g.id ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {!mealPlan && !isLoading && (
        <div className="frosted-card p-20 flex flex-col items-center text-center bg-white/40 border-dashed border-slate-300">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <Sparkles className="text-emerald-600 w-10 h-10 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Ready to nourish?</h2>
          <p className="text-slate-500 max-w-md mb-8 font-medium">Click below to generate a hyper-personalized 1-day meal plan based on your current bio-metrics and goal.</p>
          <button 
            onClick={generatePlan}
            className="bg-emerald-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Generate Meal Plan <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="py-20 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-6 shadow-xl shadow-emerald-100"></div>
          <p className="text-emerald-800 font-bold text-xl animate-pulse font-display tracking-tight">Crafting your perfect menu...</p>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">Checking bio-metric alignment</p>
        </div>
      )}

      {mealPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            {Object.keys(mealPlan).map((time) => {
              const meal = mealPlan[time];
              if (!meal || typeof meal !== 'object' || Array.isArray(meal)) return null;
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={time} 
                  className="frosted-card overflow-hidden flex flex-col md:flex-row group"
                >
                  <div className="w-full md:w-64 h-48 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${meal.name}/400/300`} 
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm border-white/40">
                      {time}
                    </div>
                  </div>
                  <div className="flex-1 p-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-display font-bold text-slate-800 group-hover:text-emerald-700 transition-colors tracking-tight">{meal.name}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-display font-bold text-slate-900">{meal.estimated_calories || meal.calories}</span>
                        <span className="text-xs text-slate-400 font-bold ml-1 uppercase">kcal</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">{meal.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Prot.', val: (meal.macros?.protein || meal.protein || 0), unit: 'g', color: 'bg-emerald-100/50 text-emerald-700 shadow-inner' },
                        { label: 'Carbs', val: (meal.macros?.carbs || meal.carbs || 0), unit: 'g', color: 'bg-blue-100/50 text-blue-700 shadow-inner' },
                        { label: 'Fats', val: (meal.macros?.fats || meal.fats || 0), unit: 'g', color: 'bg-orange-100/50 text-orange-700 shadow-inner' },
                      ].map(m => (
                        <div key={m.label} className={`${m.color} px-4 py-2 rounded-2xl flex flex-col items-center`}>
                          <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{m.label}</span>
                          <span className="text-lg font-bold">{m.val}{m.unit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-[1.5rem] flex gap-3 items-start border border-white/60">
                      <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Coach Insight</p>
                        <p className="text-xs text-emerald-700 leading-relaxed italic font-medium">"{meal.why_fits_goal || meal.whyFits || 'Perfect for your current nutrition targets.'}"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-emerald-800 backdrop-blur-xl border border-emerald-700/50 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/10">
              <h4 className="font-display font-bold text-xl mb-6 tracking-tight">Daily Summary</h4>
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    <span>Protein</span>
                    <span>142g / 150g</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                    <div className="h-full bg-emerald-400 w-[95%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    <span>Carbs</span>
                    <span>180g / 200g</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                    <div className="h-full bg-blue-400 w-[80%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    <span>Fats</span>
                    <span>54g / 65g</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full">
                    <div className="h-full bg-orange-400 w-[75%] rounded-full shadow-[0_0_10px_rgba(fb,146,60,0.5)]" />
                  </div>
                </div>
              </div>
              <hr className="my-8 border-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Total Intake</p>
                  <p className="text-3xl font-display font-bold leading-tight">1,842</p>
                  <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">Calories</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Target className="text-emerald-400 w-6 h-6" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMealPlan(null)}
              className="w-full py-4 rounded-full bg-white/60 backdrop-blur-md border border-white text-slate-500 font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all sm:mt-4 hover:text-emerald-700"
            >
              Reset and Reroll
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
