// Sempre incremente a versão ao atualizar (ex: v4, v5...)
const CACHE_NAME = "santarubi-cache-v3";  

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/calculadora.js",
  "/manifest.json",
  "/logo.png",
  "/logo_192x192.png",
  "/logo_512x512.png"
];

// Instala e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // ativa nova versão imediatamente
});

// Ativa e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // força clientes a usarem esta versão
});

// Network first: sempre busca versão nova do GitHub
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // offline: usa cache
  );
});
