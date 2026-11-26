// ROUTE (CONTROLLER) KATMANI: HTTP isteğini doğrular, servisleri çağırır, cevabı döner.
import { Router } from "express";
import { getCV, getSystemPrompt } from "../services/cv.js";
import { generateReply } from "../services/gemini.js";
import { rateLimit } from "../middleware/rate-limit.js";

export const api = Router();

api.get("/cv", (req, res) => res.json(getCV(req.query.lang)));

const MAX_TURNS = 20, MAX_CHARS = 500;

api.post("/chat", rateLimit({ windowMs: 60_000, max: 10 }), async (req, res) => {
  const history = req.body?.history;
  const valid = Array.isArray(history) && history.length > 0 && history.length <= MAX_TURNS &&
    history.every(m => (m?.role === "user" || m?.role === "model") && typeof m.text === "string" && m.text.length > 0 && m.text.length <= (m.role === "user" ? MAX_CHARS : 4000)) &&
    history.at(-1).role === "user";
  if (!valid) return res.status(400).json({ error: "Invalid message." });

  try {
    const reply = await generateReply({ systemPrompt: getSystemPrompt(req.body?.lang), history });
    res.json({ reply });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Server error." });
  }
});
