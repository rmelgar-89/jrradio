const CACHE_NAME = 'jr-radio-v1';
const urlsToCache = [
    '/app.html',
    '/img/logo.jpeg',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Don't cache the audio stream or RSS feeds
    if (event.request.url.includes('radio.jrradiodmv.com') || event.request.url.includes('radio.co') || event.request.url.includes('rss2json')) {
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});
