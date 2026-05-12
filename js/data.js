/**
 * data.js — Catálogo de productos
 * Preparado para Firebase: reemplaza loadProducts() con un fetch a Firestore.
 */

// ── Simulated product database (replace with Firebase fetch) ──
const PRODUCTS_DB = [
  {
    id: 1,
    name: "Polo Floral Mamá",
    desc: "Bordado floral premium con nombre personalizado en Oro Rosa.",
    price: 120,
    oldPrice: null,
    image: "assets/images/polo_floral.png",
    tags: ["bestseller"],
    badge: "bestseller",
    sizes: ["XS","S","M","L","XL"],
  },
  {
    id: 2,
    name: "Polo Corazón de Oro",
    desc: "Diseño corazón con hilo dorado y texto 'Te Amo Mamá'.",
    price: 130,
    oldPrice: null,
    image: "assets/images/polo_corazon.png",
    tags: ["bestseller","new"],
    badge: "new",
    sizes: ["S","M","L","XL"],
  },
  {
    id: 3,
    name: "Polo Mariposa Elegance",
    desc: "Estampado mariposas en tonos Rose Gold. Edición limitada.",
    price: 145,
    oldPrice: 180,
    image: "assets/images/polo_mariposa.png",
    tags: ["new","sale"],
    badge: "sale",
    sizes: ["XS","S","M","L"],
  },
  {
    id: 4,
    name: "Pack Familiar Mamá",
    desc: "3 polos coordinados para toda la familia con nombres.",
    price: 320,
    oldPrice: 420,
    image: "assets/images/polo_family.png",
    tags: ["bestseller","sale"],
    badge: "sale",
    sizes: ["S","M","L","XL"],
  },
  {
    id: 5,
    name: "Polo Amor de Madre",
    desc: "Texto en cursiva dorada 'Amor de Madre' con rosas sutiles.",
    price: 115,
    oldPrice: null,
    image: "assets/images/polo_amor.png",
    tags: ["new"],
    badge: "new",
    sizes: ["XS","S","M","L","XL","XXL"],
  },
  {
    id: 6,
    name: "Polo Rosas Para Mamá",
    desc: "Rosas rojas bordadas con fondo coral. Diseño especial Día de la Madre.",
    price: 125,
    oldPrice: 150,
    image: "assets/images/polo_rosas.png",
    tags: ["bestseller","sale"],
    badge: "bestseller",
    sizes: ["S","M","L","XL"],
  },
];

/**
 * loadProducts()
 * Actualmente retorna datos locales.
 * Para conectar Firebase, reemplaza el contenido con:
 *
 *   const db = firebase.firestore();
 *   const snap = await db.collection('products').get();
 *   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
 */
async function loadProducts() {
  // Simulate async (network latency) — remove when using Firebase
  return new Promise(resolve => setTimeout(() => resolve(PRODUCTS_DB), 300));
}
