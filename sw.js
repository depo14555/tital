// Версія кешу – змінюйте при оновленні ресурсів
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  // Додайте інші файли, які хочете кешувати
];

// Встановлення сервісного працівника та кешування файлів
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Кеш відкрито');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активація: очищення старих кешів
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Очищення кешу: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехоплення запитів і повернення кешованої версії, якщо є
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
