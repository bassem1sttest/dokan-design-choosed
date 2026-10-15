/* =========================================================
   دكان زمان — شعارات العملاء في صفحة «عملاؤنا»
   شريطان من الشعارات يتحركان باستمرار في اتجاهين متعاكسين (مثل الشريط المتحرك في الرئيسية).
   ---------------------------------------------------------
   لكل عميل سطر: name = اسم العميل (لقارئ الشاشة فقط)، logo = مسار الشعار.
   ضع الشعار في assets/img/clients (PNG أو SVG بخلفية شفافة يفضّل) وأضف سطرًا هنا.
   ========================================================= */
window.DOKAN_CLIENTS = [
  { name: 'البنك المركزي المصري', logo: 'assets/img/clients/central-bank-of-egypt.webp' },
  { name: 'فوري', logo: 'assets/img/clients/fawry.svg' },
  { name: 'البريد المصري', logo: 'assets/img/clients/egypt-post.webp' },
  { name: 'Red Sea Mix', logo: 'assets/img/clients/red-sea-mix.webp' },
  { name: 'كير مصر', logo: 'assets/img/clients/care-egypt.webp' },
  { name: 'TransGlobe Logistics', logo: 'assets/img/clients/tgl.webp' },
  { name: 'DAIS Global', logo: 'assets/img/clients/dais-global.webp' },
  { name: 'Keyframe Digital Solutions', logo: 'assets/img/clients/keyframe.webp' },
];

/* marquee: each row holds the list twice and slides by half its width, so the loop never shows a gap.
   It pauses on hover and off-screen (data-anim, main.js), and stands still for reduced motion. Runs before main.js. */
(() => {
  const host = document.querySelector('[data-clients]');
  const list = window.DOKAN_CLIENTS || [];
  if (!host || !list.length) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  // repeat the logos until one copy is comfortably wider than the screen
  const repeat = Math.max(1, Math.ceil(12 / list.length));
  const items = Array.from({ length: repeat }, () => list).flat();
  const ul = (logos, hidden) => `<ul${hidden ? ' aria-hidden="true"' : ''}>${logos.map(c =>
    `<li class="tile"><img src="${esc(c.logo)}" alt="${hidden ? '' : esc(c.name)}" loading="lazy" decoding="async"></li>`).join('')}</ul>`;
  const row = (logos, rev) => `
          <div class="lm__row"><div class="lm__track${rev ? ' lm__track--rev' : ''}">${ul(logos, false)}${ul(logos, true)}</div></div>`;
  host.innerHTML = row(items, false) + row([...items].reverse(), true);
})();
