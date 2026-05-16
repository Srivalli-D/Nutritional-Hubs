export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  preferences: string[];
  goal: "weight_loss" | "muscle_gain" | "maintenance";
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  whyFits: string;
}

export interface DayPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

export interface Recipe {
  name: string;
  prep_time: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  ingredients_list: string[];
  instructions: string;
  why_it_suits_user: string;
}

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: "Dashboard" },
  { label: "Meal Plan", path: "/meal-plan", icon: "Utensils" },
  { label: "Recipes", path: "/recipes", icon: "Book" },
  { label: "Analytics", path: "/analytics", icon: "BarChart3" },
  { label: "Food Database", path: "/database", icon: "Search" },
  { label: "AI Coach", path: "/coach", icon: "MessageSquareText" },
  { label: "Fitness", path: "/fitness", icon: "Dumbbell" },
];
