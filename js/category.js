/* Dokan Zaman — category.html: one page for every supply area, built from js/catalog.js.
   category.html?c=<id>  (unknown or missing id → the first area).
   Runs before main.js (both deferred), so the reveal / card effects in main.js see the rendered content. */
(() => {
  const C = window.DOKAN_CATALOG;
  const main = document.getElementById('cat-page');
  if (!C || !main) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const money = n => new Intl.NumberFormat('ar-EG').format(n);
  const ARROW = '<svg class="ico"><use href="#i-arrow"/></svg>';

  const cats = C.categories;
  const wanted = new URLSearchParams(location.search).get('c');
  const idx = Math.max(0, cats.findIndex(c => c.id === wanted));
  const cat = cats[idx];

  document.title = `${cat.title} | دكان زمان`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${cat.title} من دكان زمان للتوريدات العمومية: ${cat.summary}`;

  // price: [from, to] → «من ٥٨ إلى ٩٢ ج.م»; one number → «٧٥ ج.م»; empty → «السعر عند الطلب»
  const price = p => {
    if (p.price === null || p.price === undefined || p.price === '') return 'السعر عند الطلب';
    const unit = p.unit ? ` <small>${esc(p.unit)}</small>` : '';
    if (Array.isArray(p.price)) return `من <span class="num">${money(p.price[0])}</span> إلى <span class="num">${money(p.price[1])}</span> ${esc(C.currency)}` + unit;
    return `<span class="num">${money(p.price)}</span> ${esc(C.currency)}` + unit;
  };

  // product photos: the first is the main one, the rest are reached with the arrows / dots / a swipe
  const photos = p => (p.images && p.images.length ? p.images : [p.image || cat.image]);
  const gallery = p => {
    const list = photos(p), many = list.length > 1;
    return `<div class="supply-card__media prod-gal">
              <div class="prod-gal__track">${list.map((src, i) => `<span class="prod-gal__slide"><img src="${esc(src)}" alt="${esc(p.name)}${many ? ` — صورة ${ar(i + 1)}` : ''}" width="720" height="480" ${i ? 'loading="lazy" ' : ''}decoding="async" data-fallback="${esc(cat.image)}"></span>`).join('')}</div>${many ? `
              <button class="prod-gal__btn prod-gal__btn--prev" type="button" aria-label="الصورة السابقة">${ARROW}</button>
              <button class="prod-gal__btn prod-gal__btn--next" type="button" aria-label="الصورة التالية">${ARROW}</button>
              <div class="prod-gal__dots">${list.map((_, i) => `<button type="button" aria-label="صورة ${ar(i + 1)} من ${ar(list.length)}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div>` : ''}
            </div>`;
  };

  const products = cat.products.map((p, k) => `
          <article class="supply-card prod-card" data-reveal style="--d:${((k % 3) * 0.06).toFixed(2)}s">
            ${gallery(p)}
            <span class="prod-card__price">${price(p)}</span>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.desc)}</p>
          </article>`).join('');

  const services = cat.services.map((s, k) => `
          <li class="tile" data-reveal style="--d:${(k * 0.05).toFixed(2)}s"><b>${ar(k + 1)}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('');

  main.innerHTML = `
    <section class="page-hero2">
      <div class="wrap cat-hero">
        <div class="tile tile--dark page-hero2__tile" data-reveal>
          <nav class="crumbs2" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><span aria-hidden="true">/</span><a href="categories.html">مجالات التوريد</a><span aria-hidden="true">/</span><span aria-current="page">${esc(cat.title)}</span></nav>
          <h1>${esc(cat.title)}</h1>
          <p>${esc(cat.summary)}</p>
          <div class="row-btns">
            <a href="contact.html" class="pill pill--orange pill--lg">اطلب عرض سعر ${ARROW}</a>
            <a href="#products" class="pill pill--ghost pill--lg">المنتجات (${ar(cat.products.length)})</a>
          </div>
        </div>
        <figure class="tile tile--photo cat-hero__photo" data-reveal style="--d:.06s">
          <img src="${esc(cat.image)}" alt="${esc(cat.title)}" width="720" height="480" decoding="async">
          <figcaption><b>${ar(idx + 1)}</b> من ${ar(cats.length)} مجالات توريد</figcaption>
        </figure>
      </div>
    </section>

    <section class="sec" id="products">
      <div class="wrap">
        <header class="sec__head sec__head--split" data-reveal>
          <div>
            <span class="tag"><i></i> المنتجات</span>
            <h2>منتجات .. <span class="hl">${esc(cat.title)}</span></h2>
          </div>
          <p class="sec__lead">${esc(C.priceNote)}</p>
        </header>
        <div class="supply-grid prod-grid">${products}
        </div>
      </div>
    </section>

    <section class="sec sec--tint" id="services">
      <div class="wrap">
        <header class="sec__head" data-reveal>
          <span class="tag"><i></i> ماذا نقدم؟</span>
          <h2>ماذا نقدم في .. <span class="hl">${esc(cat.title)}</span></h2>
        </header>
        <ol class="steps-lite cat-services">${services}
        </ol>
      </div>
    </section>

    <section class="sec sec--cta">
      <div class="wrap">
        <div class="tile tile--orange cta-tile" data-reveal>
          <div>
            <h2>محتاجين ${esc(cat.title)}؟</h2>
            <p>أرسلوا قائمة احتياجاتكم وسنعود إليكم بعرض سعر مناسب.</p>
          </div>
          <a href="contact.html" class="pill pill--line pill--lg">اطلب عرض سعر ${ARROW}</a>
        </div>
      </div>
    </section>`;

  // a missing product photo falls back to the area photo
  main.querySelectorAll('img[data-fallback]').forEach(img => img.addEventListener('error', () => {
    if (img.src.indexOf(img.dataset.fallback) === -1) img.src = img.dataset.fallback;
  }, { once: true }));

  // galleries: arrows, dots, swipe (native scroll-snap; RTL scrollLeft runs negative) and autoplay.
  // Autoplay: each gallery moves on its own, a little out of step with its neighbours; it pauses while the
  // card is hovered or touched, when it is off-screen or the tab is hidden, and never runs for reduced motion.
  const AUTOPLAY = 3200;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  main.querySelectorAll('.prod-gal').forEach((gal, gi) => {
    const track = gal.querySelector('.prod-gal__track'), slides = [...track.children];
    if (slides.length < 2) return;
    const dots = [...gal.querySelectorAll('.prod-gal__dots button')];
    const index = () => Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
    let current = 0;
    const go = i => {
      const n = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[n].offsetLeft - slides[0].offsetLeft });
    };
    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { current = index(); dots.forEach((d, k) => d.toggleAttribute('aria-current', k === current)); });
    }, { passive: true });
    // keep the same photo in place when the card is resized
    new ResizeObserver(() => { track.style.scrollBehavior = 'auto'; track.scrollLeft = slides[current].offsetLeft - slides[0].offsetLeft; track.style.scrollBehavior = ''; }).observe(track);
    gal.querySelector('.prod-gal__btn--prev').addEventListener('click', () => go(index() - 1));
    gal.querySelector('.prod-gal__btn--next').addEventListener('click', () => go(index() + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));

    if (reduceMotion) return;
    const card = gal.closest('.prod-card');
    let timer = 0, hovered = false, visible = false;
    const schedule = (wait = AUTOPLAY) => {
      clearTimeout(timer);
      if (hovered || !visible || document.hidden) return;
      timer = setTimeout(() => { go(index() + 1); schedule(); }, wait);
    };
    card.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    card.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    track.addEventListener('touchstart', () => { hovered = true; schedule(); }, { passive: true });
    track.addEventListener('touchend', () => { setTimeout(() => { hovered = false; schedule(); }, 2500); }, { passive: true });
    gal.addEventListener('click', () => schedule());          // a manual step restarts the countdown
    document.addEventListener('visibilitychange', () => schedule());
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(AUTOPLAY + (gi % 3) * 700); }, { threshold: .5 }).observe(gal);
  });

})();
