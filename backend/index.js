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

// 🔍 TEST ROUTE (ADD THIS)
app.get("/test-summary", async (req, res) => {
  try {
    const summary = await generateSummary(
      "Cats need regular hydration and vet checkups."
    );
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actual summarize API
app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await generateSummary(text);
    res.json({ summary });

  } catch (err) {
    console.error("❌ Summary Error:", err.message);
    res.status(500).json({ error: "Summary generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
