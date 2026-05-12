/**
 * app.js — Main application entry point
 * Orchestrates all modules: Gallery, Cart, Animations.
 *
 * Firebase ready: uncomment initFirebase() when credentials are available.
 */

// ══ TOAST Notification ══
function showToast(msg, duration = 2800) {
  const toast  = document.getElementById('toast');
  const msgEl  = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.classList.remove('hidden', 'show');
  void toast.offsetWidth; // reflow
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}

// ══ Cart Sidebar ══
function openCart() {
  const sidebar  = document.getElementById('cart-sidebar');
  const overlay  = document.getElementById('cart-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => { overlay.style.opacity = '1'; }, 10);
  sidebar.style.transform = 'translateX(0)';
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  sidebar.style.transform = 'translateX(100%)';
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

// ══ Firebase Stub (uncomment & fill when ready) ══
/*
async function initFirebase() {
  const firebaseConfig = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
  // Products will be loaded via loadProducts() in data.js
}
*/

// ══ APP INIT ══
document.addEventListener('DOMContentLoaded', async () => {

  // Init Lucide icons
  lucide.createIcons();

  // Animations
  initNavbar();
  initHeroAnimations();
  initPetals();
  initScrollReveal();
  initFloatingPromo();

  // Gallery (async — Firebase ready)
  await initGallery();

  // Re-run scroll reveal after gallery painted
  setTimeout(initScrollReveal, 400);

  // ── Cart sidebar events ──
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // ── Checkout → WhatsApp ──
  document.getElementById('checkout-btn').addEventListener('click', () => {
    const total = Cart.getTotal();
    if (total === 0) {
      showToast('¡Agrega productos al carrito primero! 🛍️');
      return;
    }
    const msg = Cart.getWhatsAppMessage();
    window.open(`https://wa.me/59170000000?text=${msg}`, '_blank');
  });

  // ── Keyboard ESC closes cart ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

});
