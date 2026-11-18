const V='items-v2';
const SHELL=['./','index.html','manifest.json','vendor/xlsx.full.min.js','vendor/chart.umd.js','fonts/cairo-arabic-400-normal.woff2','fonts/cairo-arabic-600-normal.woff2','fonts/cairo-arabic-700-normal.woff2','fonts/cairo-arabic-800-normal.woff2','fonts/cairo-latin-400-normal.woff2','fonts/cairo-latin-700-normal.woff2','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  // صفحة التطبيق: الشبكة أولاً علشان التحديثات توصل، والنسخة المحفوظة لو مفيش نت
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  // ملفات التطبيق نفسه: من الكاش أولاً
  if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x})));return}
  // مكتبات Firebase من gstatic: تتحفظ علشان تشتغل بسرعة، وباقي الطلبات (Firestore/Auth) تعدي عادي
  if(u.hostname==='www.gstatic.com'){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x})))}
});
