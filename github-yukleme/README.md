# CV Site

Kişisel CV sitesi + Google Gemini destekli "CV Assistant" chatbot.

## Katmanlar

```
cv-site/
├── data/
│   ├── cv.en.json              VERİ: İngilizce CV (sayfa + chatbot)
│   └── cv.tr.json              VERİ: Türkçe CV
├── public/                     FRONTEND (tarayıcı)
│   ├── index.html              iskelet
│   ├── css/styles.css          stil
│   └── js/
│       ├── main.js             giriş noktası
│       ├── i18n.js             arayüz çevirileri + dil seçimi (TR/EN)
│       ├── api.js              kendi sunucumuza istekler (/api/cv, /api/chat)
│       ├── render-cv.js        CV'yi sayfaya çizer
│       ├── chat-panel.js       panel aç/kapat/sürükle
│       ├── chatbot.js          mesajlar, öneriler, form
│       ├── spring.js           yay animasyon motoru
│       └── utils.js            yardımcılar
├── server/                     BACKEND (Node + Express)
│   ├── index.js                uygulama: statik dosyalar + /api
│   ├── config.js               ortam değişkenleri
│   ├── routes/api.js           GET /api/cv, POST /api/chat (doğrulama)
│   ├── middleware/rate-limit.js  IP başına dakikada 10 mesaj
│   └── services/
│       ├── cv.js               cv.<dil>.json okur, system prompt'u kurar
│       └── gemini.js           Google Gemini API çağrısı (anahtar sadece burada)
├── .env.example                şablon (git'e girer)
└── .env                        gerçek anahtar (git'e GİRMEZ)
```

Akış: `tarayıcı → /api/chat (senin sunucun) → Gemini API`. API anahtarı tarayıcıya hiç inmez.

## Lokal kurulum

1. Node.js 22+ kurulu olmalı (`node -v`).
2. Bağımlılıkları kur: `npm install`
3. `.env.example` dosyasını `.env` olarak kopyala, `GEMINI_API_KEY` değerini https://aistudio.google.com/apikey adresinden alıp yapıştır.
4. Çalıştır: `npm run dev` → http://localhost:3000 (dosya değişince kendini yeniden başlatır)

CV'yi güncellemek için `data/cv.en.json` (İngilizce) ve `data/cv.tr.json` (Türkçe) dosyalarını düzenle. Dil adresle de seçilebilir: `/?lang=tr`, `/?lang=en`.

## Deploy (ör. Render / Railway)

- Build: `npm install` · Start: `npm start`
- Hosting panelinde Environment Variables'a `GEMINI_API_KEY` ekle. `.env` dosyasını yükleme.
- Google AI Studio'da anahtar için kota/bütçe sınırı koy.
