// YAPILANDIRMA KATMANI: tüm ortam değişkenleri tek yerden okunur.
// Lokalde .env dosyasından, deploy'da hosting panelindeki "Environment Variables"tan gelir.
export const config = {
  port: Number(process.env.PORT) || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  // Sırayla denenir: ilki yoğun/erişilemez ise bir sonrakine geçilir.
  geminiModels: ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"],
  isProd: process.env.NODE_ENV === "production"
};

if (!config.geminiApiKey) {
  console.warn("⚠️  GEMINI_API_KEY tanımlı değil. .env dosyasını oluştur (bkz. .env.example). Chatbot çalışmayacak.");
}
