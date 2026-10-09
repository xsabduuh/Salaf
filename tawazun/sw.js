const CACHE='tawazon-v1.0.1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icons/icon-180.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png'];
// Tolerant install: a single missing asset (e.g. icons not uploaded yet) must not abort the whole offline setup.
self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE)
    .then(cache=>Promise.allSettled(ASSETS.map(u=>cache.add(u).catch(()=>null))))
    .then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
  }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
