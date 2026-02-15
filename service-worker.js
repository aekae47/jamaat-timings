const CACHE_NAME = 'jot-v1';
const urlsToCache = [
  './',
  './index.html',
  'assets/jot-icon-1-512.png',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@700&family=Google+Sans+Pro:wght@600;700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker and Clean Up Old Caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve Cached Assets or Fetch from Network
self.addEventListener('fetch', event => {
  // We don't cache firebase api calls inside SW, firebase SDK handles its own offline logic
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis.com/firestore')) {
     return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
