/**
 * gallery.js — Renderiza productos con slider modelo → prenda
 * Slide 1: Modelo usando la prenda | Slide 2: Prenda sola
 *
 * ESTRUCTURA CSS del slider:
 *   .img-slider { overflow:hidden; width:100% }
 *     └─ .slider-track { display:flex; width:200%; }  ← 2 slides lado a lado
 *           ├─ .slider-slide { flex: 0 0 50%; }       ← cada slide = 50% del track = 100% visible
 *           └─ .slider-slide { flex: 0 0 50%; }
 *
 * FÓRMULA: translateX(-(index * 50%)) sobre el track de 200%
 *   index=0 → translateX(0%)    → slide modelo visible
 *   index=1 → translateX(-50%)  → slide prenda visible
 */

let allProducts = [];
let activeFilter = 'all';

// ── Auto-play registry ──
const _sliderTimers = {};

// ──────────────────────────────────────────
// goToSlide: mueve el track al slide indicado
// Usa -50% por índice porque el track mide 200%
// ──────────────────────────────────────────
function goToSlide(productId, index) {
  const wrap = document.querySelector(`.img-slider[data-pid="${productId}"]`);
  if (!wrap) return;
  const track = wrap.querySelector('.slider-track');
  const dots  = wrap.querySelectorAll('.slider-dot');

  // Cada slide ocupa el 50% del track (que mide 200%).
  // index=0 → 0%, index=1 → -50%
  track.style.transform = `translateX(-${index * 50}%)`;

  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  wrap.dataset.current = String(index);
}

// ──────────────────────────────────────────
// initSlider: activa controles, auto-play y swipe táctil
// ──────────────────────────────────────────
function initSlider(productId, total) {
  const wrap = document.querySelector(`.img-slider[data-pid="${productId}"]`);
  if (!wrap || total < 2) return;

  let current = 0;

  // Helper: avanzar/retroceder
  const go = (idx) => { current = idx; goToSlide(productId, current); };
  const next = () => go((current + 1) % total);
  const prev = () => go((current - 1 + total) % total);

  // ── Puntos ──
  wrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.addEventListener('click', (e) => { e.stopPropagation(); go(i); });
  });

  // ── Flechas ──
  const prevBtn = wrap.querySelector('.slider-arrow.prev');
  const nextBtn = wrap.querySelector('.slider-arrow.next');
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // ── Swipe táctil (móvil) ──
  let touchStartX = 0;
  wrap.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
  }, { passive: true });

  // ── Auto-play cada 2.8s ──
  const startAutoPlay = () => {
    if (_sliderTimers[productId]) clearInterval(_sliderTimers[productId]);
    _sliderTimers[productId] = setInterval(next, 2800);
  };
  startAutoPlay();

  // ── Pausar al hover, reanudar al salir ──
  wrap.addEventListener('mouseenter', () => clearInterval(_sliderTimers[productId]));
  wrap.addEventListener('mouseleave', startAutoPlay);

  // Posición inicial
  goToSlide(productId, 0);
}

/**
 * Renderiza el grid de productos.
 * Para Firebase: llama a loadProducts() que retorna una Promise.
 */
async function initGallery() {
  allProducts = await loadProducts();
  renderProducts(allProducts);
  initFilters();
  initSearch();
}
 
// ──────────────────────────────────────────
// buildCard: construye la tarjeta con slider 2 slides
// Slide 0: modelo con la prenda
// Slide 1: prenda sola
// Si la imagen de modelo no existe aún, usa un placeholder
// elegante con gradiente y texto hasta que se copien las fotos
// ──────────────────────────────────────────
function buildCard(product) {
  const badgeMap = {
    bestseller: { cls: 'badge-bestseller', label: '⭐ Más Vendido' },
    new:        { cls: 'badge-new',        label: '✨ Nuevo' },
    sale:       { cls: 'badge-sale',       label: '🏷️ Oferta' },
  };
  const badge      = badgeMap[product.badge] || null;
  const oldPriceHtml = product.oldPrice
    ? `<span class="product-price-old">Bs. ${product.oldPrice}</span>` : '';
  const sizesHtml  = product.sizes.map(s =>
    `<button class="size-btn" data-size="${s}" onclick="selectSize(this, ${product.id})">${s}</button>`
  ).join('');

  // ── Resolver imagen de modelo ──
  // Prioridad: modelImage explícito > MODEL_IMAGE_MAP > placeholder CSS
  const modelImg = product.modelImage
    || (typeof MODEL_IMAGE_MAP !== 'undefined' ? MODEL_IMAGE_MAP[product.image] : null)
    || null; // null → se usará el placeholder CSS

  // ── Slide 0: Modelo ──
  // Si modelImg existe → <img>; si no → placeholder con estilo hasta que se copien las fotos
  const modelSlideContent = modelImg
    ? `<img src="${modelImg}" alt="Modelo usando ${product.name}" loading="lazy"
            onerror="this.parentElement.classList.add('slide-no-model')" />
       <span class="slide-label">📸 Modelo</span>`
    : `<div class="slide-model-placeholder">
         <span class="placeholder-icon">👗</span>
         <p class="placeholder-text">Foto de modelo<br/><em>próximamente</em></p>
       </div>
       <span class="slide-label">📸 Modelo</span>`;

  // ── Slide 1: Prenda sola ──
  const prendaSlideContent =
    `<img src="${product.image}" alt="${product.name}" loading="lazy" />
     <span class="slide-label">👗 Prenda</span>`;

  const slidesHtml =
    `<div class="slider-slide">${modelSlideContent}</div>
     <div class="slider-slide">${prendaSlideContent}</div>`;

  const dotsHtml =
    `<button class="slider-dot active" aria-label="Ver modelo"></button>
     <button class="slider-dot"         aria-label="Ver prenda"></button>`;

  const card = document.createElement('article');
  card.className  = 'product-card';
  card.dataset.id   = product.id;
  card.dataset.tags = product.tags.join(',');

  card.innerHTML = `
    <div class="product-img-wrap">
      <div class="img-slider" data-pid="${product.id}" data-current="0">
        <div class="slider-track">${slidesHtml}</div>
        <button class="slider-arrow prev" aria-label="Anterior">&#8249;</button>
        <button class="slider-arrow next" aria-label="Siguiente">&#8250;</button>
        <div class="slider-dots">${dotsHtml}</div>
      </div>
      ${badge ? `<span class="product-badge ${badge.cls}">${badge.label}</span>` : ''}
      <div class="quick-view-overlay">
        <button class="quick-view-btn" onclick="openQuickAdd(${product.id})">Agregar al Carrito</button>
      </div>
    </div>
    <div class="product-info">
      <p class="product-name">${product.name}</p>
      <p class="product-desc">${product.desc}</p>
      <div class="size-selector">${sizesHtml}</div>
      <div class="flex items-baseline">
        <span class="product-price">Bs. ${product.price}</span>
        ${oldPriceHtml}
      </div>
      <button class="add-cart-btn" id="add-btn-${product.id}" onclick="addToCartFromCard(${product.id})">
        🛍️ Agregar al Carrito
      </button>
    </div>`;
  return card;
}


// ── Render products to grid ──
function renderProducts(products) {
  const grid  = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';

  // Limpiar timers anteriores
  Object.keys(_sliderTimers).forEach(k => clearInterval(_sliderTimers[k]));

  if (products.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  products.forEach((p, i) => {
    const card = buildCard(p);
    // staggered entrance
    card.style.transitionDelay = `${i * 80}ms`;
    grid.appendChild(card);
    // trigger reveal + slider init after brief paint delay
    setTimeout(() => {
      card.classList.add('visible');
      initSlider(p.id, 2); // siempre 2 slides: modelo + prenda
    }, 50 + i * 80);
  });

  // Re-init lucide icons in new nodes
  lucide.createIcons();
}

// ── Size selection ──
const selectedSizes = {};
function selectSize(btn, productId) {
  const parent = btn.closest('.size-selector');
  parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSizes[productId] = btn.dataset.size;
}

// ── Add to cart from card ──
function addToCartFromCard(productId) {
  const product = allProducts.find(p => p.id === productId);
  const size = selectedSizes[productId];
  if (!size) {
    showToast('Por favor elige una talla 👗');
    // Highlight size buttons
    const card = document.querySelector(`[data-id="${productId}"]`);
    card.querySelectorAll('.size-btn').forEach(b => {
      b.style.borderColor = '#E86A7F';
      setTimeout(() => b.style.borderColor = '', 1500);
    });
    return;
  }
  Cart.add(product, size);
  showToast(`"${product.name}" agregado al carrito 🌸`);
}

// ── Quick add (from overlay) ──
function openQuickAdd(productId) {
  const product = allProducts.find(p => p.id === productId);
  const size = selectedSizes[productId] || product.sizes[2] || product.sizes[0];
  Cart.add(product, size);
  showToast(`"${product.name}" (Talla ${size}) agregado 🌸`);
  openCart();
}

// ── Filters ──
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

// ── Search ──
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
