// Service worker mínimo — existe SÓ pra habilitar a instalação como app
// ("Adicionar à tela inicial"/PWA), que exige um service worker
// registrado com handler de fetch. NÃO faz cache-first: a primeira
// versão fazia isso e, por conta disso, o navegador continuava servindo
// o HTML/JS antigo mesmo depois de um deploy novo no ar (o app parecia
// "não atualizar nunca" até o usuário limpar o cache manualmente).
// Sempre pega da rede primeiro; cache é só um fallback pra quando a rede
// cai de verdade (modo avião, sem sinal), nunca a fonte preferida.
const CACHE_NAME = "pokerpremium-shell-v2";
const SHELL_ASSETS = ["/manifest.json", "/logo-icon.svg", "/logo-192.png", "/logo-512.png"];

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
  // Nunca intercepta a navegação principal (HTML) nem os bundles JS/CSS
  // com hash — deixa o navegador buscar sempre a versão mais nova
  // direto da rede. Só serve do cache como fallback se a rede falhar.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
