// SUNUM KATMANI: CV verisini ve arayüz metinlerini sayfaya çizer. Veri /api/cv'den gelir.
import { $, esc } from "./utils.js";
import { lang, t, switchLang } from "./i18n.js";

const items = list => list.map(i => `
  <div class="item">
    <div class="top"><div><div class="title">${esc(i.title)}</div><div class="org">${esc(i.org)}</div></div><div class="date">${esc(i.date)}</div></div>
    ${i.points?.length ? `<ul>${i.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
  </div>`).join("");
const chips = list => `<div class="chips">${list.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>`;
const bullets = a => `<div class="item"><ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;

export function renderCV(CV) {
  const S = t.sections;
  document.documentElement.lang = lang;
  document.title = t.title(CV.name);

  $("name").textContent = CV.name;
  $("navName").textContent = CV.name;
  $("role").textContent = CV.role;
  $("summary").textContent = CV.summary;
  $("contact").innerHTML = CV.contact.map(c =>
    c.href ? `<a class="pill" href="${esc(c.href)}" target="_blank" rel="noopener">${esc(c.label)}</a>` : `<span class="pill">${esc(c.value)}</span>`
  ).join("");

  $("navLinks").innerHTML = ["experience", "volunteering", "education", "skills", "certificates"]
    .map(id => `<a href="#${id}">${esc(S[id])}</a>`).join("");

  // Dil düğmeleri (üstte ve kaydırınca görünen menüde)
  document.querySelectorAll(".lang-btn").forEach(b => {
    b.textContent = t.switchTo;
    b.setAttribute("lang", lang === "tr" ? "en" : "tr");
    b.onclick = switchLang;
  });

  $("cv").innerHTML = `
    <section id="experience" class="reveal"><h2>${esc(S.experience)}</h2>${items(CV.experience)}</section>
    <section id="projects" class="reveal"><h2>${esc(S.projects)}</h2>${items(CV.projects)}</section>
    <section id="volunteering" class="reveal"><h2>${esc(S.volunteering)}</h2>${items(CV.volunteering)}</section>
    <section id="education" class="reveal"><h2>${esc(S.education)}</h2>${items(CV.education)}</section>
    <section id="skills" class="reveal"><h2>${esc(S.skills)}</h2>${chips(CV.technicalSkills)}<div style="height:.6rem"></div>${chips(CV.softSkills)}</section>
    <section class="reveal"><h2>${esc(S.languages)}</h2>${chips(CV.languages)}</section>
    <section id="certificates" class="reveal"><h2>${esc(S.certificates)}</h2>${bullets(CV.certificates)}</section>
    <section class="reveal"><h2>${esc(S.additional)}</h2>${bullets(CV.additional)}</section>`;

  // Sohbet paneli metinleri
  $("fab").textContent = t.fab;
  $("chat").setAttribute("aria-label", t.chatTitle);
  $("chatTitle").textContent = t.chatTitle;
  $("closeBtn").setAttribute("aria-label", t.close);
  $("input").placeholder = t.placeholder;
  $("send").textContent = t.send;
}

// Scroll: nav materyali + bölümlerin yumuşakça belirmesi
export function initScrollEffects() {
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("on", scrollY > 80);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } else document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
}
