const CACHE_NAME = "santarubi-cache-v2"; // altere a versão sempre que mudar algo
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
  self.skipWaiting(); // força ativar nova versão
});

// Ativa, remove caches antigos e assume clientes imediatamente
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
  self.clients.claim(); // faz com que a nova versão atue sem precisar fechar o navegador
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request) // sempre tenta pegar a versão mais nova primeiro
      .then((response) => {
        // salva no cache a nova versão
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // se offline, usa o cache
  );
});
