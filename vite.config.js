import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Бэкенд (Express) по умолчанию на :4400, можно переопределить: API_PROXY=http://host:port
const API = process.env.API_PROXY || "http://localhost:4400";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    // mqtt в App.js тянет node-встроенные модули (events, buffer, ...).
    nodePolyfills({ include: ["events", "buffer", "process", "util", "stream"] }),
  ],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000,
    proxy: {
      // XHR/fetch на эти пути уходит на Express, а переходы в браузере
      // (Accept: text/html), напр. на клиентский роут /schedule, отдают SPA.
      "/schedule": {
        target: API,
        bypass: (req) =>
          req.headers.accept?.includes("text/html") ? "/index.html" : null,
      },
      "/upload": API,
      "/uploads": API,
    },
  },
});
