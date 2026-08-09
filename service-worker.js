// Minimal service worker for QuickSlip.
// Its only job is to exist and register — that's what makes Chrome/Edge
// consider the page installable as a standalone app. It does not cache
// anything or change how the app behaves; every request just passes
// straight through to the network.

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});
