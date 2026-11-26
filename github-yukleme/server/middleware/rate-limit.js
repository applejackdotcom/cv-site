// MIDDLEWARE: basit IP bazlı hız sınırı, API kotanı (ve faturanı) korur.
// Tek sunuculu küçük bir site için yeterli; bellekte tutulur, yeniden başlatınca sıfırlanır.
export function rateLimit({ windowMs, max }) {
  const hits = new Map();
  setInterval(() => { const now = Date.now(); for (const [ip, h] of hits) if (now - h.start > windowMs) hits.delete(ip); }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now(), ip = req.ip;
    let h = hits.get(ip);
    if (!h || now - h.start > windowMs) { h = { start: now, count: 0 }; hits.set(ip, h); }
    if (++h.count > max) return res.status(429).json({ error: "Too many messages, please wait a minute." });
    next();
  };
}
