import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!process.env.GOOGLE_AI_API_KEY) {
      return res.status(500).json({ error: "Clé API Google manquante" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    res.json({ text });
  } catch (err) {
    console.error("Erreur API:", err);
    res.status(500).json({ error: "Erreur serveur IA" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});