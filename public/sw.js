// sw.js

self.addEventListener("install", (event) => {
  console.log("[SW] Installed");

  // Activate the new service worker immediately.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");

  event.waitUntil(
    (async () => {
      // Take control of all existing tabs immediately.
      await self.clients.claim();
    })(),
  );
});

// Optional: Listen for messages from the app.
// Useful later for things like forcing an update,
// clearing data, or handling push notifications.
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);
});
