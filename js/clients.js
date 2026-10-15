/* =========================================================
   دكان زمان — شعارات العملاء في صفحة «عملاؤنا» (عرض متحرك يتغير تلقائيًا)
   ---------------------------------------------------------
   لكل عميل سطر: name = اسم العميل (يُقرأ لقارئ الشاشة ولا يظهر تحت الصورة)، logo = مسار الصورة،
   fit: 'cover' = صورة تملأ الكارت (صور المشاريع)؛ بدونها تظهر الصورة كاملة كشعار في منتصف الكارت.
   لتغيير صورة: ضع الملف في assets/img/clients واكتب مساره هنا. لإضافة عميل: أضف سطرًا جديدًا.
   ========================================================= */
window.DOKAN_CLIENTS = [
  { name: 'البنك المركزي المصري', logo: 'assets/img/clients/central-bank-of-egypt.webp' },
  { name: 'Edge Holding — OIA', logo: 'assets/img/clients/edge-holding-oia.webp', fit: 'cover' },
  { name: 'البريد المصري', logo: 'assets/img/clients/egypt-post.webp' },
  { name: 'Red Sea Mix', logo: 'assets/img/clients/red-sea-mix.webp', fit: 'cover' },
  { name: 'فوري', logo: 'assets/img/clients/fawry.svg' },
  { name: 'The Icon Residence', logo: 'assets/img/clients/the-icon-residence.webp', fit: 'cover' },
  { name: 'كير مصر', logo: 'assets/img/clients/care-egypt.webp' },
  { name: 'Edge Holding', logo: 'assets/img/clients/edge-holding-1.webp', fit: 'cover' },
  { name: 'TransGlobe Logistics', logo: 'assets/img/clients/tgl.webp' },
  { name: 'SIRA Community', logo: 'assets/img/clients/sira.webp', fit: 'cover' },
  { name: 'DAIS Global', logo: 'assets/img/clients/dais-global.webp' },
  { name: 'Edge Holding', logo: 'assets/img/clients/edge-holding-2.webp', fit: 'cover' },
  { name: 'Keyframe Digital Solutions', logo: 'assets/img/clients/keyframe.webp' },
  { name: 'مشروع سكني', logo: 'assets/img/clients/residential-project.webp', fit: 'cover' },
  { name: 'Edge Holding', logo: 'assets/img/clients/edge-holding-3.webp', fit: 'cover' },
];

/* carousel: scroll-snap track + arrows + dots + autoplay (pauses on hover / focus / touch, off-screen,
   hidden tab, and when the visitor prefers reduced motion). Runs before main.js (both deferred). */
(() => {
  const host = document.querySelector('[data-clients]');
  const list = window.DOKAN_CLIENTS || [];
  if (!host || !list.length) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const ARROW = '<svg class="ico"><use href="#i-arrow"/></svg>';
  const DELAY = 2200;   // time on each slide (ms)

  // the arrows sit on the image (they appear on hover); the dots and the progress bar sit under it
  host.innerHTML = `
          <div class="cl-stage">
            <div class="cl-track" tabindex="0" aria-label="شعارات عملائنا">
              ${list.map((c, i) => `<figure class="cl-slide" aria-label="${ar(i + 1)} من ${ar(list.length)}">
                <div class="tile cl-card${c.fit === 'cover' ? ' cl-card--photo' : ''}"><img src="${esc(c.logo)}" alt="${esc(c.name)}" ${i > 1 ? 'loading="lazy" ' : ''}decoding="async"></div>
              </figure>`).join('\n              ')}
            </div>
            <button class="cl-btn cl-btn--prev" type="button" aria-label="السابق">${ARROW}</button>
            <button class="cl-btn cl-btn--next" type="button" aria-label="التالي">${ARROW}</button>
          </div>
          <div class="cl-controls"><div class="cl-dots"></div></div>
          <div class="cl-progress" aria-hidden="true"><span></span></div>`;

  const track = host.querySelector('.cl-track');
  const slides = [...track.children];
  const dotsBox = host.querySelector('.cl-dots');
  const bar = host.querySelector('.cl-progress span');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let perView = 1, positions = 1, current = 0, timer = 0, paused = false, visible = true;

  const measure = () => {
    const w = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    perView = Math.max(1, Math.round((track.clientWidth + gap) / (w + gap)));
    positions = Math.max(1, slides.length - perView + 1);
    dotsBox.innerHTML = Array.from({ length: positions }, (_, i) => `<button type="button" aria-label="الموضع ${ar(i + 1)}"></button>`).join('');
    [...dotsBox.children].forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));
    current = Math.min(current, positions - 1);
    mark();
  };
  const offset = i => slides[i].offsetLeft - slides[0].offsetLeft;     // negative in RTL — scrollLeft is too
  const index = () => {
    const x = Math.abs(track.scrollLeft);
    let best = 0;
    slides.forEach((s, i) => { if (Math.abs(Math.abs(offset(i)) - x) < Math.abs(Math.abs(offset(best)) - x)) best = i; });
    return Math.min(best, positions - 1);
  };
  const mark = () => [...dotsBox.children].forEach((d, i) => d.toggleAttribute('aria-current', i === current));
  const go = i => { current = (i + positions) % positions; track.scrollTo({ left: offset(current) }); mark(); };

  // autoplay with a progress bar that fills during each interval
  const restart = () => {
    clearTimeout(timer);
    bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)';
    if (reduce || paused || !visible || document.hidden || positions < 2) return;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `transform ${DELAY}ms linear`; bar.style.transform = 'scaleX(1)'; }));
    timer = setTimeout(() => { go(current + 1); restart(); }, DELAY);
  };
  const pause = on => { paused = on; restart(); };

  host.querySelector('.cl-btn--prev').addEventListener('click', () => { go(current - 1); restart(); });
  host.querySelector('.cl-btn--next').addEventListener('click', () => { go(current + 1); restart(); });
  let raf = 0;
  track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { current = index(); mark(); }); }, { passive: true });
  host.addEventListener('mouseenter', () => pause(true));
  host.addEventListener('mouseleave', () => pause(false));
  host.addEventListener('focusin', () => pause(true));
  host.addEventListener('focusout', () => pause(false));
  track.addEventListener('touchstart', () => pause(true), { passive: true });
  track.addEventListener('touchend', () => setTimeout(() => pause(false), 2500), { passive: true });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current + 1); restart(); }      // RTL: left = next
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current - 1); restart(); }
  });
  document.addEventListener('visibilitychange', restart);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; restart(); }, { threshold: .25 }).observe(host);
  new ResizeObserver(() => { measure(); track.style.scrollBehavior = 'auto'; track.scrollLeft = offset(current); track.style.scrollBehavior = ''; }).observe(track);
  measure();
  restart();
})();
