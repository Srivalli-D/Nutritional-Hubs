import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MealPlanner from "./pages/MealPlanner";
import Recipes from "./pages/Recipes";
import Analytics from "./pages/Analytics";
import FoodDatabase from "./pages/FoodDatabase";
import AICoach from "./pages/AICoach";
import Fitness from "./pages/Fitness";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-800 font-medium animate-pulse">Nourishing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!user ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="flex relative overflow-hidden bg-emerald-50/50">
          {/* Mesh Background Decoration */}
          <div className="mesh-bg-1 pointer-events-none" />
          <div className="mesh-bg-2 pointer-events-none" />
          
          <Sidebar onLogout={logout} />
          <main className="flex-1 min-h-screen relative overflow-x-hidden z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/meal-plan" element={<MealPlanner />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/database" element={<FoodDatabase />} />
                <Route path="/coach" element={<AICoach />} />
                <Route path="/fitness" element={<Fitness />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
