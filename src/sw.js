let CACHE_NAME = 'offline-fallback';
let urlsToCache = [
    '/',
    '/static',
    '/images'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    )
    console.log('SW Установлен');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    // return true IF YOU WANT TO REMOVE OLD CACHE
                }).map((cacheName) => {
                    return caches.delete(cacheName)
                })
            )
        })
    )
    console.log('SW Активирован');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
        )
    // TODO: что кешируем-с
    console.log('Произошол зопрос');
});