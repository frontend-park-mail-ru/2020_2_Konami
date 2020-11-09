const CACHE_NAME = 'onmeet-v1.0.1';
const CACHE_PREFIX = 'onmeet';

const CACHE_URLS = [
    'bundle.js',
    'main.css',
    '/',
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
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (navigator.onLine) {
                    return fetch(event.request).then(
                        function(response) {
                            // Check if we received a valid response
                            if(!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            let responseToCache = response.clone();
                            if (event.request.method === 'GET') {
                                caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                            }

                            return response;
                        }
                    );
                } else if (response) {
                    return response;
                } else {
                    const fallbackResponse = {status: 228};

                    console.log('offline');

                    return new Response(JSON.stringify(fallbackResponse), {
                        headers: {'Content-Type': 'application/json'}
                    });
                }
            })
    );
});
