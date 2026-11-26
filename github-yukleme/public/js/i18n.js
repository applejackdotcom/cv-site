// DİL KATMANI: arayüz metinleri ve seçili dil. CV içeriği sunucudan dile göre gelir (data/cv.<dil>.json).
const STRINGS = {
  en: {
    title: name => `${name} | CV`,
    sections: { experience: "Experience", projects: "Projects", volunteering: "Volunteering", education: "Education", skills: "Skills", languages: "Languages", certificates: "Certificates", additional: "Additional info" },
    fab: "Ask about me",
    chatTitle: "CV Assistant",
    close: "Close",
    placeholder: "Ask about my CV",
    send: "Send",
    greet: name => `Hi! I'm the CV assistant for ${name}. Ask me about experience, projects, skills or background.`,
    suggestions: first => [`Who is ${first}?`, `What experience does ${first} have?`, "What are the technical skills?", "Tell me about the chess background"],
    error: "Error: ",
    switchTo: "Türkçe"
  },
  tr: {
    title: name => `${name} | Özgeçmiş`,
    sections: { experience: "Deneyim", projects: "Projeler", volunteering: "Gönüllülük", education: "Eğitim", skills: "Yetenekler", languages: "Diller", certificates: "Sertifikalar", additional: "Ek bilgiler" },
    fab: "Bana sor",
    chatTitle: "CV Asistanı",
    close: "Kapat",
    placeholder: "CV'm hakkında sor",
    send: "Gönder",
    greet: name => `Merhaba! Ben ${name} için CV asistanıyım. Deneyim, projeler, yetenekler veya geçmiş hakkında sorabilirsin.`,
    suggestions: first => [`${first} kimdir?`, `${first}'in deneyimleri neler?`, "Teknik yetenekleri neler?", "Satranç geçmişini anlat"],
    error: "Hata: ",
    switchTo: "English"
  }
};

const LANGS = Object.keys(STRINGS);
const KEY = "lang";
const pick = v => (LANGS.includes(v) ? v : null);

// Öncelik: ?lang= adres parametresi → daha önce seçilen → tarayıcı dili → İngilizce
function detect() {
  const fromUrl = pick(new URLSearchParams(location.search).get("lang"));
  if (fromUrl) return fromUrl;
  try { const saved = pick(localStorage.getItem(KEY)); if (saved) return saved; } catch {}
  return (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";
}

export const lang = detect();
export const t = STRINGS[lang];
export const otherLang = lang === "tr" ? "en" : "tr";

export function switchLang() {
  try { localStorage.setItem(KEY, otherLang); } catch {}
  const url = new URL(location.href);
  url.searchParams.set("lang", otherLang);
  location.href = url.toString();
}
