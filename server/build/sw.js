/* Service worker расписания.
   Стратегия — network-first: пока есть сеть, всегда отдаём свежую версию
   (поэтому на всех устройствах видно одно и то же), а офлайн — из кэша.
   API (/schedule, /upload) не кэшируем вообще. */

const CACHE = "nevsky-schedule-v5";
const SHELL = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // данные расписания и загрузка docx — всегда напрямую в сеть
  if (url.pathname.startsWith("/schedule") || url.pathname.startsWith("/upload")) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200 && fresh.type === "basic") {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          const shell =
            (await caches.match("/index.html")) || (await caches.match("/"));
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});
