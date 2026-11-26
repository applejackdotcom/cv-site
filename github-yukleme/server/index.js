// SUNUCU GİRİŞ NOKTASI: statik dosyaları (public/) ve API'yi (/api) tek uygulamada sunar.
import express from "express";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { api } from "./routes/api.js";

const app = express();
app.set("trust proxy", 1);                 // Render/Railway gibi proxy arkasında gerçek IP için
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.use("/api", api);
app.use(express.static(fileURLToPath(new URL("../public", import.meta.url))));

app.listen(config.port, () => {
  console.log(`CV site running → http://localhost:${config.port}  (models: ${config.geminiModels.join(" → ")})`);
});
