import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));