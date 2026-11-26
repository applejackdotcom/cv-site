// PANEL: AÇ / KAPAT / SÜRÜKLE (sadece UI hareketi, API ile ilgisi yok)
import { $, clamp01, reduceMotion } from "./utils.js";
import { Spring, project, rubber } from "./spring.js";

export function initChatPanel({ onFirstOpen }) {
  const chat = $("chat"), fab = $("fab"), grab = $("grab"), inputEl = $("input");
  let D = 600;              // paneli tamamen dışarı iten mesafe
  let isOpen = false, opened = false;
  const sp = new Spring(0); // 0 = kapalı, 1 = açık

  const measure = () => { D = chat.offsetHeight + 40; };
  function render(p) {
    const c = clamp01(p);
    if (reduceMotion.matches) {
      chat.style.transform = "none"; chat.style.opacity = c;
      fab.style.transform = "none";
    } else {
      const y = (1 - p) * D;
      const s = 1 - (1 - Math.min(p, 1)) * .06;
      chat.style.transform = `translate3d(0,${y}px,0) scale(${s})`;
      chat.style.opacity = clamp01(p * 1.8);
      fab.style.transform = `scale(${1 - .12 * c})`;
    }
    fab.style.opacity = 1 - clamp01(p * 1.5);
    fab.style.pointerEvents = p > .4 ? "none" : "auto";
  }
  sp.onUpdate = render;
  sp.onRest = () => { if (!isOpen) { chat.style.visibility = "hidden"; chat.setAttribute("aria-hidden", "true"); } };
  render(0); chat.setAttribute("aria-hidden", "true");

  const springCfg = extra => reduceMotion.matches ? { zeta: 1, response: .12, ...extra } : { zeta: 1, response: .42, ...extra };

  function open() {
    if (!isOpen) {
      isOpen = true; measure();
      chat.style.visibility = "visible"; chat.removeAttribute("aria-hidden");
      if (!opened) { opened = true; onFirstOpen?.(); }
    }
    sp.to(1, springCfg());
    inputEl.focus({ preventScroll: true });
  }
  function close() {
    isOpen = false;
    sp.to(0, springCfg());
    fab.focus({ preventScroll: true });
  }
  fab.addEventListener("click", open);
  $("closeBtn").addEventListener("click", close);
  addEventListener("keydown", e => { if (e.key === "Escape" && isOpen) close(); });
  addEventListener("resize", () => { if (isOpen) measure(); });

  // Sürükle-kapat: işaretçiyi 1:1 takip et, bırakınca hızı yaya devret, momentumla hedefi seç
  let drag = null;
  grab.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    grab.setPointerCapture(e.pointerId);
    sp.stop(); measure();
    drag = { y0: e.clientY, off0: (1 - sp.x) * D, hist: [{ t: e.timeStamp, y: e.clientY }], off: (1 - sp.x) * D };
  });
  grab.addEventListener("pointermove", e => {
    if (!drag) return;
    let off = drag.off0 + (e.clientY - drag.y0);
    if (off < 0) off = -rubber(-off, D);
    drag.off = off;
    drag.hist.push({ t: e.timeStamp, y: e.clientY });
    if (drag.hist.length > 6) drag.hist.shift();
    sp.x = 1 - off / D; sp.v = 0; render(sp.x);
  });
  const endDrag = () => {
    if (!drag) return;
    const h = drag.hist, a = h[0], b = h[h.length - 1];
    const v = b.t > a.t ? (b.y - a.y) / (b.t - a.t) * 1000 : 0; // px/s
    const shouldClose = drag.off + project(v) > D * .35;
    drag = null;
    isOpen = !shouldClose;
    const momentum = Math.abs(v) > 300;
    sp.to(shouldClose ? 0 : 1, { zeta: momentum ? .8 : 1, response: reduceMotion.matches ? .12 : .32, velocity: -v / D });
    if (shouldClose) fab.focus({ preventScroll: true });
  };
  grab.addEventListener("pointerup", endDrag);
  grab.addEventListener("pointercancel", endDrag);

  return { open, close };
}
