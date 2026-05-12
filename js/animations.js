/**
 * animations.js — Scroll Reveal, Navbar, Petals & Floating Promo
 */

// ══ NAVBAR scroll effect ══
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ══ Hero entrance animation ══
function initHeroAnimations() {
  const els = document.querySelectorAll(
    '.hero-subtitle, .hero-title, .hero-desc, .hero-btns'
  );
  els.forEach(el => {
    el.classList.add('animate-hero');
  });
}

// ══ Falling petals ══
function initPetals() {
  const container = document.getElementById('petals');
  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 8;
    const size = 8 + Math.random() * 14;
    petal.style.cssText = `
      left:${left}%;
      width:${size}px;
      height:${size}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${0.5 + Math.random() * 0.5};
    `;
    container.appendChild(petal);
  }
}

// ══ Scroll Reveal ══
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => observer.observe(el));
}

// ══ Floating promo messages ══
function initFloatingPromo() {
  const messages = [
    '¡Cómprale algo especial a Mamá! 💝',
    'Regalos únicos para Mamá 🌸',
    '¡Haz que ella sonría hoy! ✨',
    'El amor se regala con estilo 👑',
  ];
  let idx = 0;
  const textEl = document.getElementById('promo-text');
  const promoEl = document.getElementById('float-promo');

  // Cycle messages
  setInterval(() => {
    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(5px)';
    setTimeout(() => {
      idx = (idx + 1) % messages.length;
      textEl.textContent = messages[idx];
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 400);
  }, 3500);

  textEl.style.transition = 'opacity 0.4s, transform 0.4s';

  // Close button
  document.getElementById('close-promo').addEventListener('click', () => {
    promoEl.style.opacity = '0';
    promoEl.style.transform = 'scale(0.8)';
    promoEl.style.transition = 'all 0.3s';
    setTimeout(() => { promoEl.style.display = 'none'; }, 300);
  });

  // Click navigates to gallery
  promoEl.querySelector('.float-promo-inner').addEventListener('click', (e) => {
    if (e.target.id === 'close-promo') return;
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  });
}
