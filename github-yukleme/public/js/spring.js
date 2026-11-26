// YAY (SPRING) MOTORU
// Apple'ın damping ratio + response parametreleri. Her zaman mevcut değerden ve mevcut hızdan devam eder,
// yani her an yakalanıp yönü değiştirilebilir (interruptible).
export class Spring {
  constructor(x) { this.x = x; this.v = 0; this.target = x; this.zeta = 1; this.resp = .4; this.raf = 0; this.onUpdate = () => {}; this.onRest = () => {}; }
  to(target, { zeta = 1, response = .4, velocity } = {}) {
    this.target = target; this.zeta = zeta; this.resp = response;
    if (velocity !== undefined) this.v = velocity;
    this.run();
  }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
  run() {
    if (this.raf) return;
    let last = performance.now();
    const step = now => {
      const dt = Math.min((now - last) / 1000, .064); last = now;
      const k = (2 * Math.PI / this.resp) ** 2, c = 2 * this.zeta * Math.sqrt(k);
      const n = Math.max(1, Math.ceil(dt / .004)), h = dt / n;
      for (let i = 0; i < n; i++) { this.v += (-k * (this.x - this.target) - c * this.v) * h; this.x += this.v * h; }
      if (Math.abs(this.v) < .001 && Math.abs(this.x - this.target) < .0005) {
        this.x = this.target; this.v = 0; this.raf = 0; this.onUpdate(this.x); this.onRest(); return;
      }
      this.onUpdate(this.x);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
}

export const project = (v, d = .998) => (v / 1000) * d / (1 - d);                       // momentum projection (px/s -> px)
export const rubber = (over, dim, c = .55) => (over * dim * c) / (dim + c * Math.abs(over)); // soft boundary
