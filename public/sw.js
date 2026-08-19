// Service worker mínimo — existe principalmente pra habilitar a
// instalação como app ("Adicionar à tela inicial"), não pra cache
// agressivo. Só guarda o "shell" estático do app (HTML/JS/CSS/ícones);
// NUNCA intercepta chamadas de API ou WebSocket do backend (outro
// domínio), pra não arriscar servir dado de jogo desatualizado.
const CACHE_NAME = "pokerpremium-shell-v1";
const SHELL_ASSETS = ["/", "/index.html", "/manifest.json", "/logo-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
