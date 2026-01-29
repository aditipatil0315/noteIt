import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateSummary } from "./gemini.js";

dotenv.config();

console.log(
  "GEMINI KEY:",
  process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing"
);

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("✅ PDF Summary Backend Running");
});

// Test Gemini directly
app.get("/test-gemini", async (req, res) => {
  try {
    const summary = await generateSummary("This is a test sentence.");
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main summary endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await generateSummary(text);
    res.json({ summary });
  } catch (error) {
    console.error("❌ Summary error:", error);
    res.status(500).json({ error: "Summary generation failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
