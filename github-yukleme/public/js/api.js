// API İSTEMCİSİ: tarayıcı sadece KENDİ sunucumuzla konuşur. Google API anahtarı tarayıcıya hiç gelmez.
async function request(path, options) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const getCV = lang => request(`/api/cv?lang=${encodeURIComponent(lang)}`);

// history: [{ role: "user" | "model", text }]
export const sendChat = (history, lang) => request("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ history, lang })
}).then(d => d.reply);
