const CACHE_NAME = '7';
const CACHE_PREFIX = '1234';

const CACHE_URLS = [
    'bundle.js',
    'main.css',
    '/',
    '/meetings',
    '/people',
    '/profile',
    '/meet',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Install some cache');
            return cache.addAll(CACHE_URLS);
        }).then(function() {
            return self.skipWaiting();
        }).catch(function(err) {
            console.log('Error with cache open ', err);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (navigator.onLine) {
		return fetch(event.request);
    }
    console.log(event.request);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                console.log(response);
                // Cache hit - return response
                if (response) {
                    return response;
                }
            })
    );
});