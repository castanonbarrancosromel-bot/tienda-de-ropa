/**
 * gallery.js — Renderiza productos con slider modelo → prenda
 * Slide 1: Modelo usando la prenda | Slide 2: Prenda sola
 *
 * ESTRUCTURA CSS:
 *   .img-slider  { overflow:hidden; width:100%; height:100% }
 *   .slider-track{ display:flex; width:200%; }   ← 2 slides juntos
 *   .slider-slide{ flex: 0 0 50%; }              ← cada slide = 100% visible
 *
 * FÓRMULA: translateX(-(index × 50%))
 *   index=0 → translateX(0)   → modelo visible
 *   index=1 → translateX(-50%)→ prenda visible
 */

'use strict';

let allProducts  = [];
let activeFilter = 'all';

// Registro global de timers de auto-play (accesible desde animations.js)
const _sliderTimers = {};

/* ═══════════════════════════════════════════════
   SLIDER CORE
═══════════════════════════════════════════════ */

/** Mueve el track al slide [index] */
function goToSlide(pid, index) {
  const wrap  = document.querySelector(`.img-slider[data-pid="${pid}"]`);
  if (!wrap) return;
  wrap.querySelector('.slider-track').style.transform = `translateX(-${index * 50}%)`;
  wrap.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === index));
  wrap.dataset.current = index;
}

/** Inicializa controles, auto-play y swipe para una tarjeta */
function initSlider(pid, total) {
  const wrap = document.querySelector(`.img-slider[data-pid="${pid}"]`);
  if (!wrap || total < 2) return;

  let cur = 0;
  const go   = (i) => { cur = ((i % total) + total) % total; goToSlide(pid, cur); };
  const next = ()  => go(cur + 1);
  const prev = ()  => go(cur - 1);

  // Dots
  wrap.querySelectorAll('.slider-dot').forEach((dot, i) =>
    dot.addEventListener('click', (e) => { e.stopPropagation(); go(i); })
  );

  // Flechas
  wrap.querySelector('.slider-arrow.prev')?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  wrap.querySelector('.slider-arrow.next')?.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Swipe táctil
  let tx = 0;
  wrap.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend',   (e) => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  }, { passive: true });

  // Auto-play
  const startAP = () => {
    clearInterval(_sliderTimers[pid]);
    _sliderTimers[pid] = setInterval(next, 3000);
  };
  startAP();

  // Pausa al hover / touch
  wrap.addEventListener('mouseenter', () => clearInterval(_sliderTimers[pid]));
  wrap.addEventListener('mouseleave', startAP);
  wrap.addEventListener('touchstart', () => clearInterval(_sliderTimers[pid]), { passive: true });
  wrap.addEventListener('touchend',   () => setTimeout(startAP, 4000),         { passive: true });

  // Señales de animations.js (IntersectionObserver de viewport)
  wrap.addEventListener('slider:resume', startAP);
  wrap.addEventListener('slider:pause',  () => clearInterval(_sliderTimers[pid]));

  // Estado inicial
  goToSlide(pid, 0);
}

/* ═══════════════════════════════════════════════
   GALLERY INIT
═══════════════════════════════════════════════ */

async function initGallery() {
  allProducts = await loadProducts();
  renderProducts(allProducts);
  initFilters();
  initSearch();
}

/* ═══════════════════════════════════════════════
   BUILD CARD  (con slider modelo → prenda)
═══════════════════════════════════════════════ */

function buildCard(product) {
  const badgeMap = {
    bestseller: { cls:'badge-bestseller', label:'⭐ Más Vendido' },
    new:        { cls:'badge-new',        label:'✨ Nuevo'       },
    sale:       { cls:'badge-sale',       label:'🏷️ Oferta'     },
  };
  const badge        = badgeMap[product.badge] || null;

  const sizesHtml    = product.sizes
    .map(s => `<button class="size-btn" data-size="${s}" onclick="selectSize(this,${product.id})">${s}</button>`)
    .join('');

  // Imagen del modelo: campo explícito → MODEL_IMAGE_MAP (Unsplash) → null
  const modelImg = product.modelImage
    || (typeof MODEL_IMAGE_MAP !== 'undefined' ? MODEL_IMAGE_MAP[product.image] : null)
    || null;

  // Imagen de prenda: ruta local → PRENDA_IMAGE_MAP (Unsplash fallback)
  const prendaSrc = (typeof PRENDA_IMAGE_MAP !== 'undefined' && PRENDA_IMAGE_MAP[product.image])
    ? PRENDA_IMAGE_MAP[product.image]
    : product.image;

  /* ── Slide 0: Modelo ── */
  const slide0Html = modelImg
    ? `<img src="${modelImg}" alt="Modelo – ${product.name}" loading="lazy"
            onerror="this.closest('.slider-slide').classList.add('slide-no-model')">
       <span class="slide-label">📸 Modelo</span>`
    : `<div class="slide-model-placeholder">
         <span class="placeholder-icon">👗</span>
         <p class="placeholder-text">Foto de modelo<br><em>próximamente</em></p>
       </div>
       <span class="slide-label">📸 Modelo</span>`;

  /* ── Slide 1: Prenda ── */
  const slide1Html = `
    <img src="${prendaSrc}" alt="${product.name}" loading="lazy">
    <span class="slide-label">👗 Prenda</span>`;

  const card = document.createElement('article');
  card.className    = 'product-card';
  card.dataset.id   = product.id;
  card.dataset.tags = product.tags.join(',');

  card.innerHTML = `
    <div class="product-img-wrap">

      <!-- SLIDER -->
      <div class="img-slider" data-pid="${product.id}" data-current="0">
        <div class="slider-track">
          <div class="slider-slide">${slide0Html}</div>
          <div class="slider-slide">${slide1Html}</div>
        </div>
        <!-- Flechas -->
        <button class="slider-arrow prev" aria-label="Anterior">&#8249;</button>
        <button class="slider-arrow next" aria-label="Siguiente">&#8250;</button>
        <!-- Indicadores -->
        <div class="slider-dots">
          <button class="slider-dot active" aria-label="Modelo"></button>
          <button class="slider-dot"        aria-label="Prenda"></button>
        </div>
      </div>

      ${badge ? `<span class="product-badge ${badge.cls}">${badge.label}</span>` : ''}
      <div class="quick-view-overlay">
        <button class="quick-view-btn" onclick="openQuickAdd(${product.id})">
          Agregar al Carrito
        </button>
      </div>
    </div>

    <div class="product-info">
      <p class="product-name">${product.name}</p>
      <p class="product-desc">${product.desc}</p>
      <div class="size-selector">${sizesHtml}</div>

      <button class="add-cart-btn" id="add-btn-${product.id}"
              onclick="addToCartFromCard(${product.id})">
        🛍️ Agregar al Carrito
      </button>
    </div>`;

  return card;
}

/* ═══════════════════════════════════════════════
   RENDER GRID
═══════════════════════════════════════════════ */

function renderProducts(products) {
  const grid  = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');

  // Limpiar timers anteriores
  Object.keys(_sliderTimers).forEach(k => { clearInterval(_sliderTimers[k]); delete _sliderTimers[k]; });
  grid.innerHTML = '';

  if (!products.length) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  products.forEach((p, i) => {
    const card = buildCard(p);
    card.style.transitionDelay = `${i * 55}ms`;
    grid.appendChild(card);

    // Stagger: reveal visual + init slider
    setTimeout(() => {
      card.classList.add('visible');
      initSlider(p.id, 2);
    }, 80 + i * 55);
  });

  lucide.createIcons();
}

/* ═══════════════════════════════════════════════
   TALLAS, CARRITO, FILTROS, BÚSQUEDA
═══════════════════════════════════════════════ */

const selectedSizes = {};

function selectSize(btn, productId) {
  btn.closest('.size-selector').querySelectorAll('.size-btn')
     .forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSizes[productId] = btn.dataset.size;
}

function addToCartFromCard(productId) {
  const product = allProducts.find(p => p.id === productId);
  const size    = selectedSizes[productId];
  if (!size) {
    showToast('Por favor elige una talla 👗');
    document.querySelector(`[data-id="${productId}"]`)
      ?.querySelectorAll('.size-btn')
      .forEach(b => { b.style.borderColor = '#E86A7F'; setTimeout(() => b.style.borderColor = '', 1500); });
    return;
  }
  Cart.add(product, size);
  showToast(`"${product.name}" agregado al carrito 🌸`);
}

function openQuickAdd(productId) {
  const product = allProducts.find(p => p.id === productId);
  const size    = selectedSizes[productId] || product.sizes[1] || product.sizes[0];
  Cart.add(product, size);
  showToast(`"${product.name}" (Talla ${size}) agregado 🌸`);
  openCart();
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFiltersAndSearch();
    });
  });
}

function initSearch() {
  document.getElementById('search-input').addEventListener('input', applyFiltersAndSearch);
}

function applyFiltersAndSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  let filtered = allProducts;

  if (activeFilter !== 'all') {
    filtered = filtered.filter(p => p.tags.includes(activeFilter));
  }
  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
    );
  }
  renderProducts(filtered);
}
