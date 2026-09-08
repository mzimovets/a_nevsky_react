import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode намеренно отключён: даёт двойной вызов эффектов и ломает Tiptap useEditor
  <App />
);

// PWA: регистрируем service worker. Он network-first, поэтому новая версия
// подхватывается сама; при смене SW один раз перезагружаем страницу, чтобы
// на телефоне-«приложении» и на сайте всегда было одно и то же.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        // проверять обновление при запуске и раз в час, и при возврате на вкладку
        reg.update();
        setInterval(() => reg.update(), 60 * 60 * 1000);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update();
        });
      })
      .catch(() => {});

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
