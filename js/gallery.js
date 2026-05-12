/**
 * gallery.js — Renderiza productos con filtros dinámicos y búsqueda
 */

let allProducts = [];
let activeFilter = 'all';

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

// ── Build product card HTML ──
function buildCard(product) {
  const badgeMap = {
    bestseller: { cls: 'badge-bestseller', label: '⭐ Más Vendido' },
    new:        { cls: 'badge-new',        label: '✨ Nuevo' },
    sale:       { cls: 'badge-sale',       label: '🏷️ Oferta' },
  };
  const badge = badgeMap[product.badge] || null;
  const oldPriceHtml = product.oldPrice
    ? `<span class="product-price-old">Bs. ${product.oldPrice}</span>` : '';
  const sizesHtml = product.sizes.map(s =>
    `<button class="size-btn" data-size="${s}" onclick="selectSize(this, ${product.id})">${s}</button>`
  ).join('');

  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.id = product.id;
  card.dataset.tags = product.tags.join(',');
  card.innerHTML = `
    <div class="product-img-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
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
    // trigger reveal after brief paint delay
    setTimeout(() => card.classList.add('visible'), 50 + i * 80);
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
