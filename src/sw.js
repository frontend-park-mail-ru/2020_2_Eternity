let CACHE_NAME = 'offline-fallback';
let urlsToCache = [
    '/',
    '/Pin/'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    )
    // console.log('SW Установлен');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(() => {
                    // return true IF YOU WANT TO REMOVE OLD CACHE
                }).map((cacheName) => {
                    return caches.delete(cacheName)
                })
            )
        })
    )
    // console.log('SW Активирован');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // console.log('Отдан кэш')
                    return cachedResponse;
                }
                // console.log('Запрос направлен в сеть')
                return fetch(event.request);
            })
        )
});