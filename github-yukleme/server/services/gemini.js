// SERVİS KATMANI: Google Gemini API ile konuşan tek yer. Anahtar sadece burada, sunucuda kullanılır.
import { config } from "../config.js";

const fail = (message, status = 502) => Object.assign(new Error(message), { status });
// Bu durumlarda bir sonraki modeli dene: yoğunluk, kota, model kaldırılmış, sunucu hatası, zaman aşımı
const RETRYABLE = new Set([404, 429, 500, 503, "timeout"]);

async function callModel(model, { systemPrompt, history }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": config.geminiApiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.4, maxOutputTokens: 1000, thinkingConfig: { thinkingLevel: "low" } }
      }),
      signal: AbortSignal.timeout(15_000)
    });
  } catch {
    return { code: "timeout" };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { code: res.status, message: data?.error?.message };
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("");
  return text ? { text } : { code: "empty" };
}

export async function generateReply(input) {
  if (!config.geminiApiKey) throw fail("Chatbot is not configured yet.", 503);

  let last;
  for (const model of config.geminiModels) {
    last = await callModel(model, input);
    if (last.text) return last.text;
    // Ayrıntılı hata sadece sunucu loguna; ziyaretçiye genel mesaj.
    console.error(`Gemini ${model}:`, last.code, last.message || "");
    if (!RETRYABLE.has(last.code)) break;
  }
  if (last.code === 429) throw fail("Too many requests, please try again shortly.");
  if (last.code === "empty") throw fail("Empty response (may be a safety filter).");
  throw fail("The assistant is unavailable right now, please try again.");
}
