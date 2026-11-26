// GİRİŞ NOKTASI: dili belirle, veriyi al, sayfayı çiz, paneli ve chatbot'u bağla.
import { lang } from "./i18n.js";
import { getCV } from "./api.js";
import { renderCV, initScrollEffects } from "./render-cv.js";
import { initChatPanel } from "./chat-panel.js";
import { initChatbot } from "./chatbot.js";

const CV = await getCV(lang);
renderCV(CV);
initScrollEffects();
const bot = initChatbot(CV);
initChatPanel({ onFirstOpen: bot.greet });
