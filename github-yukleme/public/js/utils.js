// Küçük yardımcılar: tüm modüller buradan alır.
export const $ = id => document.getElementById(id);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const clamp01 = v => Math.min(1, Math.max(0, v));
export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
