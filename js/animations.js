/**
 * animations.js — Navbar · Hero · Petals · ScrollReveal · FloatingPromo · CardSliders
 *
 * initCardSliders():
 *   Usa IntersectionObserver para pausar sliders fuera del viewport
 *   (ahorra CPU con 80 tarjetas) y reanudarlos al volver a ser visibles.
 *   Se comunica con gallery.js exclusivamente via CustomEvents:
 *     'slider:pause'  → gallery.js detiene el setInterval
 *     'slider:resume' → gallery.js reactiva el setInterval
 */

/* ══ NAVBAR scroll effect ══ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ══ Hero entrance animations ══ */
function initHeroAnimations() {
  document.querySelectorAll('.hero-subtitle, .hero-title, .hero-desc, .hero-btns')
    .forEach(el => el.classList.add('animate-hero'));
}

/* ══ Falling petals ══ */
function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${8  + Math.random() * 14}px;
      height:${8 + Math.random() * 14}px;
      animation-duration:${6  + Math.random() * 8}s;
      animation-delay:${Math.random() * 8}s;
      opacity:${0.5 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

/* ══ Scroll Reveal ══ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══ Floating promo banner ══ */
function initFloatingPromo() {
  const messages = [
    '¡Cómprale algo especial a Mamá! 💝',
    'Regalos únicos para Mamá 🌸',
    '¡Haz que ella sonría hoy! ✨',
    'El amor se regala con estilo 👑',
  ];

  const textEl  = document.getElementById('promo-text');
  const promoEl = document.getElementById('float-promo');
  if (!textEl || !promoEl) return;

  let idx = 0;
  textEl.style.transition = 'opacity 0.4s, transform 0.4s';

  setInterval(() => {
    textEl.style.opacity   = '0';
    textEl.style.transform = 'translateY(5px)';
    setTimeout(() => {
      idx = (idx + 1) % messages.length;
      textEl.textContent     = messages[idx];
      textEl.style.opacity   = '1';
      textEl.style.transform = 'translateY(0)';
    }, 400);
  }, 3500);

  document.getElementById('close-promo')?.addEventListener('click', () => {
    promoEl.style.cssText += 'opacity:0;transform:scale(0.8);transition:all 0.3s';
    setTimeout(() => promoEl.style.display = 'none', 300);
  });

  promoEl.querySelector('.float-promo-inner')?.addEventListener('click', (e) => {
    if (e.target.id === 'close-promo') return;
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══ Card Slider Visibility Observer ══
 *
 * CÓMO FUNCIONA:
 *   1. Observa cada .product-card con IntersectionObserver.
 *   2. Cuando una tarjeta sale del viewport  → dispara 'slider:pause'  al .img-slider.
 *   3. Cuando una tarjeta entra al viewport  → dispara 'slider:resume' al .img-slider.
 *   4. gallery.js escucha esos eventos en cada .img-slider y gestiona su propio timer.
 *   5. MutationObserver observa tarjetas nuevas (tras filtrar/buscar).
 *
 * SIN acoplamiento directo a _sliderTimers ni a ninguna variable de gallery.js.
 */
function initCardSliders() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const dispatch = (card, eventName) => {
    const slider = card.querySelector('.img-slider');
    if (slider) slider.dispatchEvent(new CustomEvent(eventName, { bubbles: false }));
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      dispatch(e.target, e.isIntersecting ? 'slider:resume' : 'slider:pause');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px 100px 0px' });

  // Observar tarjetas ya en el DOM
  grid.querySelectorAll('.product-card').forEach(c => obs.observe(c));

  // Observar tarjetas añadidas dinámicamente (filtros / búsqueda)
  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('product-card')) {
          obs.observe(node);
        }
      });
    });
  }).observe(grid, { childList: true });
}
