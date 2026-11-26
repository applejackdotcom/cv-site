// CHATBOT UI: mesaj baloncukları, öneriler, form gönderimi.
import { $, esc } from "./utils.js";
import { sendChat } from "./api.js";
import { lang, t } from "./i18n.js";

const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

export function initChatbot(CV) {
  const msgsEl = $("msgs"), inputEl = $("input"), sendEl = $("send"), form = $("form");
  const history = []; // { role: "user" | "model", text }

  function addMsg(text, cls) {
    const d = document.createElement("div");
    d.className = "m " + cls;
    if (cls === "bot") d.innerHTML = fmt(text); else d.textContent = text;
    msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight;
    return d;
  }

  function greet() {
    const first = CV.name.split(" ")[0];
    addMsg(t.greet(CV.name), "bot");
    t.suggestions(first).forEach(q => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = q;
      b.onclick = () => { inputEl.value = q; form.requestSubmit(); };
      $("sugg").appendChild(b);
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const q = inputEl.value.trim();
    if (!q || sendEl.disabled) return;
    inputEl.value = ""; $("sugg").style.display = "none";
    addMsg(q, "user");
    history.push({ role: "user", text: q });
    sendEl.disabled = true;
    const typing = addMsg("", "bot");
    typing.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';
    try {
      const answer = await sendChat(history, lang);
      typing.innerHTML = fmt(answer);
      history.push({ role: "model", text: answer });
    } catch (err) {
      typing.remove(); history.pop();
      addMsg(t.error + err.message, "err");
    } finally {
      sendEl.disabled = false; msgsEl.scrollTop = msgsEl.scrollHeight; inputEl.focus({ preventScroll: true });
    }
  });

  return { greet };
}
