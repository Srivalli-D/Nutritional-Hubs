import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Bot, PieChart, Utensils, Heart, ShieldCheck, Zap, Search } from "lucide-react";
import Navbar from "../components/Navbar";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="frosted-card p-8 group border-transparent hover:border-white/80"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/10`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm font-medium">{description}</p>
  </motion.div>
);

import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  
  return (
    <div className="bg-emerald-50/50 min-h-screen relative overflow-hidden">
      {/* Mesh Background Decorations */}
      <div className="mesh-bg-1 pointer-events-none" />
      <div className="mesh-bg-2 pointer-events-none" />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 font-display">
              <Zap className="w-3 h-3 fill-emerald-600" />
              Revolutionizing Nutrition with AI
            </div>
            <h1 className="font-display font-extrabold text-6xl lg:text-7xl text-emerald-950 leading-[1.1] mb-6 tracking-tight">
              Precision Wellness <span className="text-emerald-700">for the Modern</span> Human.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
              Nourishment Hub uses advanced AI to craft the perfect meal plans, tracks every nutrient, and provides 24/7 coaching to help you reach your peak performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={signInWithGoogle}
                className="bg-emerald-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-emerald-200"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={signInWithGoogle}
                className="bg-white text-emerald-900 border border-emerald-100 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all"
              >
                View Live Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-display">
                <span className="font-bold text-slate-900">12k+</span> users already healthy
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(45,74,45,0.3)]">
              <img 
                src="/src/assets/images/hero_healthy_food_1778967316618.png" 
                alt="Healthy food spread"
                className="w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Glass widgets */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-12 -right-12 glass p-6 rounded-[2rem] z-20 hidden xl:block min-w-[240px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <PieChart className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Energy Goal</p>
                  <p className="text-xl font-display font-bold text-slate-900">1,842 <span className="text-sm font-normal text-slate-400 px-0.5">kcal</span></p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-[2rem] z-20 hidden xl:block max-w-[280px]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Bot className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Coach Insight</p>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">"Optimal protein day! Your recovery score is up."</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display font-extrabold text-5xl text-slate-950 mb-6 tracking-tight">Complete Health Ecosystem</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Everything you need to master your nutrition and wellness in one modern, AI-integrated platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Bot} 
              title="AI Nutrition Assistant" 
              description="Instant nutritional analysis of any meal. Just describe it or snap a photo and let our AI do the work."
              color="bg-emerald-600"
            />
            <FeatureCard 
              icon={Utensils} 
              title="Smart Meal Planning" 
              description="Goal-based meal generation that respects your preferences, allergies, and dietary lifestyle."
              color="bg-orange-500"
            />
            <FeatureCard 
              icon={PieChart} 
              title="Deep Analytics" 
              description="Visualize your progress with beautiful, interactive charts tracking macros, weight, and trends."
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={Heart} 
              title="Wellness Score" 
              description="A proprietary algorithm that calculates your overall health based on daily habits and metrics."
              color="bg-rose-500"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Science-Based Tips" 
              description="Verified health suggestions powered by the latest nutritional research and medical data."
              color="bg-indigo-500"
            />
            <FeatureCard 
              icon={Search} 
              title="Smart Database" 
              description="Access millions of food items with verified nutritional data for precise daily tracking."
              color="bg-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] -mr-[400px] -mt-[400px] pointer-events-none" />
      <div className="absolute top-[30%] -left-[200px] w-[500px] h-[500px] bg-orange-50/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
