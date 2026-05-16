import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Utensils, Timer, Flame, Filter, Sparkles, ChefHat, Info } from "lucide-react";

export default function Recipes() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [dietary, setDietary] = useState("");

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: query,
          cuisine,
          dietary,
          preferences: ["high protein", "low carb"]
        })
      });
      const data = await response.json();
      setRecipes(data.recipes || []);
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
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Recipe Discovery</h1>
          <p className="text-slate-500 font-medium">Find the perfect meal based on what you have and what you need.</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm">
          {["Vegan", "Keto", "Gluten-Free"].map(d => (
            <button 
              key={d}
              onClick={() => setDietary(dietary === d ? "" : d)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${dietary === d ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-4xl mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
            placeholder="Ingredients you have (e.g., 'Spinach, Salmon, Lemon')..."
            className="w-full bg-white/60 backdrop-blur-md border border-white rounded-[2rem] pl-14 pr-6 py-5 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-xl shadow-emerald-900/5 text-lg"
          />
          <ChefHat className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-emerald-600 transition-colors" />
        </div>
        <button 
          onClick={fetchRecipes}
          disabled={isLoading}
          className="bg-emerald-900 text-white px-10 py-5 rounded-[2rem] font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/20 whitespace-nowrap flex items-center gap-2"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5 fill-emerald-400 text-emerald-400" />}
          Discover
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-emerald-800 font-bold text-xl animate-pulse font-display">Sourcing culinary inspiration...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recipes.map((recipe, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className="frosted-card overflow-hidden group flex flex-col h-full"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${recipe.name}/600/400`} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest border-white/40">
                    <Timer className="w-3 h-3 inline mr-1" /> {recipe.prep_time}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-display font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors uppercase italic">{recipe.name}</h3>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-display font-bold text-slate-900">{recipe.calories}</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kcal</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-8">
                    {[
                      { label: "P", val: recipe.macros?.protein, color: "bg-emerald-50 text-emerald-600" },
                      { label: "C", val: recipe.macros?.carbs, color: "bg-blue-50 text-blue-600" },
                      { label: "F", val: recipe.macros?.fats, color: "bg-orange-50 text-orange-600" },
                    ].map(m => (
                      <div key={m.label} className={`${m.color} h-10 w-10 rounded-xl flex flex-col items-center justify-center border border-white shadow-inner`}>
                        <span className="text-[9px] font-bold opacity-60 leading-none">{m.label}</span>
                        <span className="text-xs font-bold leading-none">{m.val}g</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients_list?.slice(0, 4).map((ing: string, idx: number) => (
                        <span key={idx} className="bg-white/60 px-3 py-1 rounded-lg text-[11px] font-semibold text-slate-600 border border-white">
                          {ing}
                        </span>
                      ))}
                      {recipe.ingredients_list?.length > 4 && <span className="text-[11px] font-bold text-emerald-600">+{recipe.ingredients_list.length - 4} more</span>}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-white/60 mb-8 mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">AI Pick</span>
                    </div>
                    <p className="text-xs text-emerald-700 italic font-medium leading-relaxed leading-snug">"{recipe.why_suits_user}"</p>
                  </div>

                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all text-sm shadow-xl shadow-slate-900/10">
                    View Full Recipe
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {!isLoading && recipes.length === 0 && (
          <div className="py-20 flex flex-col items-center opacity-30 text-center">
            <Utensils className="w-16 h-16 mb-6" />
            <p className="font-display font-medium text-lg">Enter your ingredients and goal to start discovered healthy flavors.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
