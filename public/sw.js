
const CACHE_NAME = 'sk-ems-meds-v1.1';
const STATIC_CACHE = 'sk-ems-static-v1.1';
const MEDICAL_DATA_CACHE = 'sk-ems-medical-data-v1.1';

// Critical resources that must be cached for offline functionality
const CRITICAL_RESOURCES = [
  '/',
  '/medications',
  '/favorites',
  '/manifest.json'
];

// Medical data endpoints that should be cached
const MEDICAL_DATA_ENDPOINTS = [
  '/api/medications',
  '/api/dosing',
  '/api/indications'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Saskatchewan EMS Medications Service Worker');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      caches.open(MEDICAL_DATA_CACHE).then((cache) => {
        console.log('[SW] Preparing medical data cache');
        return cache;
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Saskatchewan EMS Medications Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, MEDICAL_DATA_CACHE, CACHE_NAME].includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle medical data with network-first strategy (fresh data preferred)
  if (MEDICAL_DATA_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh medical data
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(MEDICAL_DATA_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached medical data if network fails
          console.log('[SW] Network failed, serving cached medical data');
          return caches.match(request);
        })
    );
    return;
  }
  
  // Handle static resources with cache-first strategy
  if (request.method === 'GET' && (url.origin === location.origin || CRITICAL_RESOURCES.includes(url.pathname))) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request).then((response) => {
            // Don't cache if it's not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
            
            return response;
          });
        })
    );
    return;
  }
  
  // For all other requests, just fetch normally
  event.respondWith(fetch(request));
});

// Handle background sync for critical updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(
      // Sync critical medical data in background
      fetch('/api/medications')
        .then(response => response.json())
        .then(() => {
          console.log('[SW] Medical data synced successfully');
        })
        .catch((error) => {
          console.log('[SW] Medical data sync failed:', error);
        })
    );
  }
});
