
const CACHE_NAME = 'sk-ems-meds-v2.0';
const STATIC_CACHE = 'sk-ems-static-v2.0';
const MEDICAL_DATA_CACHE = 'sk-ems-medical-data-v2.0';
const RUNTIME_CACHE = 'sk-ems-runtime-v2.0';

// Critical resources that must be cached for offline functionality
const CRITICAL_RESOURCES = [
  '/',
  '/medications',
  '/favorites',
  '/manifest.json',
  '/placeholder.svg'
];

// Medical data endpoints that should be cached
const MEDICAL_DATA_ENDPOINTS = [
  '/api/medications',
  '/api/dosing',
  '/api/indications',
  '/api/contraindications',
  '/api/administration'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Saskatchewan EMS Medications Service Worker v2.0');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES).catch(err => {
          console.warn('[SW] Failed to cache some critical resources:', err);
          // Don't fail installation if some resources can't be cached
        });
      }),
      caches.open(MEDICAL_DATA_CACHE).then((cache) => {
        console.log('[SW] Preparing medical data cache');
        return cache;
      }),
      caches.open(RUNTIME_CACHE).then((cache) => {
        console.log('[SW] Preparing runtime cache');
        return cache;
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Saskatchewan EMS Medications Service Worker v2.0');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, MEDICAL_DATA_CACHE, CACHE_NAME, RUNTIME_CACHE].includes(cacheName)) {
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

// Enhanced fetch handler with better error handling and caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle Supabase API requests (medical data)
  if (url.hostname.includes('supabase.co') || MEDICAL_DATA_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
    event.respondWith(handleMedicalDataRequest(request));
    return;
  }
  
  // Handle static resources and app routes
  if (url.origin === location.origin) {
    event.respondWith(handleAppRequest(request));
    return;
  }
  
  // Handle external resources
  event.respondWith(handleExternalRequest(request));
});

// Network-first strategy for medical data (fresh data preferred, fallback to cache)
async function handleMedicalDataRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache fresh medical data
      const responseClone = response.clone();
      const cache = await caches.open(MEDICAL_DATA_CACHE);
      await cache.put(request, responseClone);
      return response;
    }
    
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.log('[SW] Network failed for medical data, serving cached version:', error);
    
    // Fallback to cached medical data
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response for medical data
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Medical data not available offline. Please check your connection.' 
      }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503 
      }
    );
  }
}

// Cache-first strategy for app resources
async function handleAppRequest(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      const responseClone = response.clone();
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch app resource:', error);
    
    // For navigation requests, return the app shell
    if (request.mode === 'navigate') {
      const appShell = await caches.match('/');
      if (appShell) {
        return appShell;
      }
    }
    
    throw error;
  }
}

// Runtime caching for external resources
async function handleExternalRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache external resources with shorter TTL
      const responseClone = response.clone();
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    // Fallback to cached version for external resources
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle background sync for critical updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(syncMedicalData());
  }
});

async function syncMedicalData() {
  try {
    console.log('[SW] Syncing medical data in background');
    
    const endpoints = [
      'https://qsvuxmcykpbzvvpzjqvd.supabase.co/rest/v1/medications?select=*&order=medication_name.asc',
      'https://qsvuxmcykpbzvvpzjqvd.supabase.co/rest/v1/medication_dosing?select=*',
      'https://qsvuxmcykpbzvvpzjqvd.supabase.co/rest/v1/medication_indications?select=*'
    ];
    
    const cache = await caches.open(MEDICAL_DATA_CACHE);
    
    await Promise.all(
      endpoints.map(async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdnV4bWN5a3BienZ2cHpqcXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTkyODMsImV4cCI6MjA2NTg5NTI4M30.O66DBMoAu6T59BoYzXB47jhJCTytsWwPV9Asz3O7zPg',
              'accept-profile': 'public'
            }
          });
          
          if (response.ok) {
            await cache.put(url, response.clone());
          }
        } catch (error) {
          console.warn('[SW] Failed to sync endpoint:', url, error);
        }
      })
    );
    
    console.log('[SW] Medical data sync completed');
  } catch (error) {
    console.error('[SW] Medical data sync failed:', error);
  }
}

// Periodic cache cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    event.waitUntil(cleanupCaches());
  }
});

async function cleanupCaches() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    
    // Remove old runtime cache entries (older than 24 hours)
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
    
    await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get('date');
          if (dateHeader && new Date(dateHeader).getTime() < cutoffTime) {
            await cache.delete(request);
          }
        }
      })
    );
    
    console.log('[SW] Cache cleanup completed');
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}
