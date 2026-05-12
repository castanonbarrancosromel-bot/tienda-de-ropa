/**
 * cart.js — Carrito de compras en memoria
 * Gestiona items, totales y sidebar UI.
 */

const Cart = (() => {
  let items = []; // { product, size, qty }

  // ── Public API ──
  function add(product, size) {
    const existing = items.find(i => i.product.id === product.id && i.size === size);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ product, size, qty: 1 });
    }
    _render();
    _updateCount();
  }

  function remove(productId, size) {
    items = items.filter(i => !(i.product.id === productId && i.size === size));
    _render();
    _updateCount();
  }

  function changeQty(productId, size, delta) {
    const item = items.find(i => i.product.id === productId && i.size === size);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) remove(productId, size);
    else { _render(); _updateCount(); }
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  }

  function getWhatsAppMessage() {
    const lines = items.map(i =>
      `• ${i.product.name} (Talla ${i.size}) x${i.qty} — Bs. ${i.product.price * i.qty}`
    ).join('\n');
    const total = getTotal();
    return encodeURIComponent(
      `¡Hola! Quiero realizar el siguiente pedido para el Día de la Madre:\n\n${lines}\n\n*TOTAL: Bs. ${total}*\n\nPor favor, confirme disponibilidad y método de pago. ¡Gracias! 🌸`
    );
  }

  // ── Private: Render sidebar ──
  function _render() {
    const container = document.getElementById('cart-items');
    const emptyEl   = document.getElementById('cart-empty');
    const totalEl   = document.getElementById('cart-total');

    // Remove old items (keep the empty state div)
    const oldItems = container.querySelectorAll('.cart-item');
    oldItems.forEach(el => el.remove());

    if (items.length === 0) {
      emptyEl.style.display = 'block';
      totalEl.textContent = '0';
      return;
    }

    emptyEl.style.display = 'none';

    items.forEach(({ product, size, qty }) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="cart-item-img" />
        <div class="flex-1 min-w-0">
          <p class="cart-item-name truncate">${product.name}</p>
          <p class="cart-item-size">Talla: ${size}</p>
          <div class="flex items-center gap-2 mt-1">
            <button class="qty-btn" onclick="Cart.changeQty(${product.id},'${size}',-1)">−</button>
            <span class="text-sm font-semibold text-gray-600">${qty}</span>
            <button class="qty-btn" onclick="Cart.changeQty(${product.id},'${size}',1)">+</button>
          </div>
        </div>
        <div class="text-right flex flex-col items-end gap-1">
          <span class="cart-item-price">Bs. ${product.price * qty}</span>
          <button onclick="Cart.remove(${product.id},'${size}')"
            class="text-gray-300 hover:text-red-400 transition-colors text-xs">✕</button>
        </div>`;
      container.appendChild(el);
    });

    totalEl.textContent = getTotal();
  }

  function _updateCount() {
    const total = items.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-count').textContent = total;
    // Pulse animation
    const btn = document.getElementById('cart-count');
    btn.classList.remove('scale-125');
    void btn.offsetWidth;
    btn.classList.add('scale-125');
    setTimeout(() => btn.classList.remove('scale-125'), 300);
  }

  return { add, remove, changeQty, getTotal, getWhatsAppMessage };
})();
