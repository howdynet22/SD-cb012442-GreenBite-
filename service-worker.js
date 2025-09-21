// Name of cache
const CACHE_NAME = "greenbitev1";

// Files to cache
const ASSETS_TO_CACHE = [
  "index.html",
  "contact.html",
  "mindfulness.html",
  "recipes.html",
  "workout.html",
  "calculator.html",
  "styles/styles.css",
  "scripts/main.js",
  "scripts/mindfulness.js",
  "images/favicon.png",
  "recipes.json",
];

// Install event - cache assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});
