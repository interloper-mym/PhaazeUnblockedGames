/* Phaaze Games — Service Worker
   Caches everything on install, serves from cache forever after. */

const CACHE_NAME = "phaaze-v1";

/* Files we want available OFFLINE immediately after install.
   Add/remove as needed. Paths are relative to the SW's location (repo root). */
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./games.json",
  "./manifest.json",

  /* Thumbnails */
  "./photos/NEWfav.png",
  "./photos/klona.jpg",
  "./photos/Unfair-Undyne-cropped.jpg",
  "./photos/nox__wakfu__render_by_trowo2_dg8n8se-fullview.png",
  "./photos/truck.png",
  "./photos/Clustertruck.jpg",
  "./photos/cookie clicker.jpg",
  "./photos/endacopia.png",
  "./photos/fnfscdm.png",
  "./photos/hl1.png",
  "./photos/hollowkinght.png",
  "./photos/silksong.jpg",
  "./photos/runmo.png",
  "./photos/ragdollarchers.png",
  "./photos/crackhouse.png",
  "./photos/vs sonic round 2.png",
  "./photos/bad-time-simulator-sans-fight.jpg",
  "./photos/emujs.png",
  "./photos/fish.jpg",
  "./photos/gd.png",
  "./photos/gta3.png",
  "./photos/craftmine.png",
  "./photos/flash.png",
  "./photos/supermonkeyball.png",
  "./photos/tree.png",

  /* Egg room assets */
  "./assets/tree.png",
  "./assets/man.mp3",

  /* Game HTML wrappers */
  "./games/Klonoa_Empire_of_Dreams.html",
  "./games/NGAHHHsim.html",
  "./games/RUINS.html",
  "./games/wakfumini.html",
  "./games/BERGENTRUCK 201x.html",
  "./games/ClusterTruck.html",
  "./games/Cookie Clicker.html",
  "./games/ENDACOPIA.html",
  "./games/Friday Night Funkin': VS. Seek's Cool Deltarune.html",
  "./games/Half Life.html",
  "./games/Hollow Knight.html",
  "./games/Hollow Knight: Silksong.html",
  "./games/Little Runmo.html",
  "./games/Ragdoll Archers.html",
  "./games/Raldi's Crackhouse.html",
  "./games/VS Rewrite: ROUND 2.html",
  "./games/badtimesim.html",
  "./games/emujs.html",
  "./games/fish.html",
  "./games/gdweb.html",
  "./games/gta3.html",
  "./games/mc1.12.2.html",
  "./games/ruffle.html",
  "./games/smb.html",
  "./games/eggroom.html"
];

/* Install: pre-cache the core files. */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn("Some precache URLs failed:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

/* Activate: clean up old caches. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch: cache-first, then network. Whatever the network returns
   gets added to the cache, so the next time it's offline-available. */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  /* Don't cache non-GET or chrome-extension requests. */
  if (req.method !== "GET") return;
  if (req.url.startsWith("chrome-extension://")) return;
  if (req.url.startsWith("moz-extension://")) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        /* Cache the response if it's a normal HTTP(S) response. */
        if (
          res &&
          res.status === 200 &&
          (res.type === "basic" || res.type === "cors" || res.type === "default")
        ) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch((err) => {
        /* Offline and no cache — show a minimal fallback. */
        return new Response("Offline. This file wasn't cached yet.", {
          status: 503,
          statusText: "Service Worker offline fallback",
          headers: { "Content-Type": "text/plain" }
        });
      });
    })
  );
});

/* Allow the page to ask the SW for status. */
self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "phaaze-status") return;
  caches.open(CACHE_NAME).then((cache) => {
    cache.keys().then((keys) => {
      event.source.postMessage({
        type: "phaaze-status-reply",
        count: keys.length,
        name: CACHE_NAME
      });
    });
  });
});
