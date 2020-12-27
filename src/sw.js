let CACHE_NAME = 'offline-fallback';
const timeout = 10000;

let urlsToCache = [
    './',
    './img/'
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
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    )
    // console.log('SW Активирован');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fromNetwork(event.request, timeout).catch(() => fromCache(event.request))
    );
    event.waitUntil(update(event.request));
});

// Запрос к сети
const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            if (request.method === 'GET') {
                update(request);
            }
        }, reject);
    });

// Запрос к кешу
const fromCache = (request) => {
    caches.open(CACHE_NAME).then(cache => {
            cache.match(request).then(matching => matching || cache.match('/offline/'))
        }
    );
}

// Кеширование полученного ответа если нет кеша
const update = (request) => {
    caches.open(CACHE_NAME).then(cache => {
            fetch(request).then(response => cache.put(request, response))
        }
    );
}
