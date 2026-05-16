import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/nutrition/analyze", async (req, res) => {
    try {
      const { foodQuery } = req.body;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: `Provide detailed nutritional information for: ${foodQuery}. Include calories, protein, carbs, fats, and key vitamins. Format as JSON with keys: name, calories, protein, carbs, fats, vitamins (array), and a short fun_fact.` }] }],
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/meal-plan", async (req, res) => {
    try {
      const { userProfile, goal } = req.body;
      const prompt = `Create a 1-day personalized meal plan for a user with the following profile: ${JSON.stringify(userProfile)}. Goal: ${goal}. 
      Include Breakfast, Lunch, Dinner, and 2 Snacks. 
      For each meal, include: name, description, estimated_calories, macros (protein, carbs, fats), and why_it_fits_goal.
      Provide the response in structured JSON format.`;
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(result.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/coach", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...(history || []), { role: "user", parts: [{ text: message }] }],
        config: { 
          systemInstruction: "You are 'Nourish', a premium AI wellness coach. Your tone is supportive, professional, and health-conscious. Provide actionable, science-based health tips and meal suggestions."
        }
      });

      res.json({ text: result.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/recipes", async (req, res) => {
    try {
      const { preferences, ingredients, cuisine, dietary } = req.body;
      const prompt = `Suggest 4 personalized recipes based on:
      Ingredients: ${ingredients || "any"}
      Cuisine: ${cuisine || "any"}
      Dietary: ${dietary || "any"}
      User Preferences: ${JSON.stringify(preferences)}.
      
      For each recipe, provide: 
      name, prep_time, calories, macros (protein, carbs, fats), ingredients_list, instructions (short summary), and why_it_suits_user.
      Provide the response in structured JSON format with a "recipes" array.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(result.text || "{\"recipes\":[]}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nourishment Hub running at http://localhost:${PORT}`);
  });
}

startServer();
