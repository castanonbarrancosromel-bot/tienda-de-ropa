/**
 * data.js — Catálogo de productos
 * Conectado a Supabase. Edita las credenciales abajo.
 */

// ══ SUPABASE CONFIG ══
const SUPABASE_URL  = 'https://qipivftteapqbagtjicn.supabase.co';
const SUPABASE_ANON = 'sb_publishable_MQuH2oWHRqpzHTS2SGXcDg_EN53l-JE'; // Publishable Key
const SB_TABLE      = 'products';

let _sb = null;
function getSB() {
  // Acepta tanto JWT (eyJ...) como el nuevo formato Publishable Key (sb_publishable_...)
  const isValid = SUPABASE_ANON.startsWith('eyJ') || SUPABASE_ANON.startsWith('sb_publishable_');
  if (!_sb && isValid && SUPABASE_URL.includes('supabase.co')) {
    _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _sb;
}

// ── Imágenes base del catálogo ──
// Usa rutas locales cuando existen; el navegador muestra el placeholder animado si no.
// Para activar imágenes reales: ejecuta copiar_modelos.ps1

// Helpers de imágenes inline (se muestran si el archivo local no existe)
const _IMG = {
  floral:    'https://images.unsplash.com/photo-1594938298603-c8148d0a8388?w=600&h=600&fit=crop&q=80',
  corazon:   'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop&q=80',
  mariposa:  'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=600&fit=crop&q=80',
  amor:      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop&q=80',
  rosas:     'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=600&fit=crop&q=80',
  family:    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&q=80',
  // Modelos
  m_floral:  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=700&fit=crop&q=80',
  m_corazon: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=700&fit=crop&q=80',
  m_marip:   'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=700&fit=crop&q=80',
  m_amor:    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=700&fit=crop&q=80',
  m_rosas:   'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&h=700&fit=crop&q=80',
  m_family:  'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=700&fit=crop&q=80',
};

// Mapa: ruta local de prenda → URL Unsplash de MODELO
// (se usa en buildCard() como slide 0)
const MODEL_IMAGE_MAP = {
  'assets/images/polo_floral.png':    _IMG.m_floral,
  'assets/images/polo_corazon.png':   _IMG.m_corazon,
  'assets/images/polo_mariposa.png':  _IMG.m_marip,
  'assets/images/polo_amor.png':      _IMG.m_amor,
  'assets/images/polo_rosas.png':     _IMG.m_rosas,
  'assets/images/polo_family.png':    _IMG.m_family,
};

// Mapa: ruta local de prenda → URL Unsplash de PRENDA
// (se usa en buildCard() como slide 1 cuando el archivo local no existe)
const PRENDA_IMAGE_MAP = {
  'assets/images/polo_floral.png':    _IMG.floral,
  'assets/images/polo_corazon.png':   _IMG.corazon,
  'assets/images/polo_mariposa.png':  _IMG.mariposa,
  'assets/images/polo_amor.png':      _IMG.amor,
  'assets/images/polo_rosas.png':     _IMG.rosas,
  'assets/images/polo_family.png':    _IMG.family,
};


const PRODUCTS_DB = [
  // ── BESTSELLERS ──
  { id:1,  name:"Polo Floral Mamá",         desc:"Bordado floral premium con nombre personalizado en Oro Rosa.",        price:120, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA1.png",    modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/modelo%201%20(1).png",    tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL"] },
  { id:2,  name:"Polo Corazón de Oro",      desc:"Diseño corazón con hilo dorado y texto 'Te Amo Mamá'.",               price:130, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA2.png",  modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/WhatsApp%20Image%202026-05-16%20at%2020.07.24.jpeg",  tags:["bestseller","new"],  badge:"new",        sizes:["S","M","L","XL"] },
  { id:3,  name:"Polo Mariposa Elegance",   desc:"Estampado mariposas en tonos Rose Gold. Edición limitada.",           price:145, oldPrice:180,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA%203.png", modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_95py2095py2095py%20(1).png", tags:["new","sale"],        badge:"sale",       sizes:["XS","S","M","L"] },
  { id:4,  name:"Pack Familiar Mamá",       desc:"3 polos coordinados para toda la familia con nombres personalizados.",price:320, oldPrice:420,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA4.png",   modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_cs8vcycs8vcycs8v.png",   tags:["bestseller","sale"], badge:"sale",       sizes:["S","M","L","XL"] },
  { id:5,  name:"Polo Amor de Madre",       desc:"Texto en cursiva dorada 'Amor de Madre' con rosas sutiles.",          price:115, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA5.png",     modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_l7qnj8l7qnj8l7qn.png",     tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:6,  name:"Polo Rosas Para Mamá",     desc:"Rosas rojas bordadas con fondo coral. Diseño especial.",              price:125, oldPrice:150,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA6.png",    modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_f6f7n2f6f7n2f6f7.png",    tags:["bestseller","sale"], badge:"bestseller", sizes:["S","M","L","XL"] },
  { id:7,  name:"Polo Jardín Secreto",      desc:"Estampado jardín floral multicolor. Algodón peinado suave.",          price:135, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA7.png",   modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_ogwqkmogwqkmogwq.png",   tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:8,  name:"Polo Atardecer Rosa",      desc:"Degradado atardecer en tonos rosa y durazno. Exclusivo.",             price:140, oldPrice:170,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA8.png",     modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_7xmlpc7xmlpc7xml.png",     tags:["sale","new"],        badge:"sale",       sizes:["S","M","L","XL","XXL"] },
  { id:9,  name:"Polo Vintage Mamá",        desc:"Diseño vintage con letras retro y flores silvestres.",                price:118, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA9.png",    modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_oudywwoudywwoudy.png",     tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L"] },
  { id:10, name:"Polo Luna y Estrellas",    desc:"Serigrafía luna creciente con constelaciones doradas.",               price:128, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA10.png",  modelImage:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/Gemini_Generated_Image_8yu7k38yu7k38yu7.png",  tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  // ── NUEVOS DISEÑOS ──
  { id:11, name:"Polo Primavera Eterna",    desc:"Flores de primavera bordadas a mano en tela premium.",                price:155, oldPrice:190,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA11.png",   modelImage:"assets/images/model_polo_floral.png",   tags:["new","sale"],        badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:12, name:"Polo Brisa del Mar",       desc:"Diseño marino con olas y gaviotas. Perfecto para el verano.",         price:122, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA12.png", modelImage:"assets/images/model_polo_mariposa.png", tags:["new"],               badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:13, name:"Polo Bohemio Floral",      desc:"Estilo boho con mandala y flores en colores tierra.",                 price:132, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA13.png",    modelImage:"assets/images/model_polo_rosas.png",    tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL"] },
  { id:14, name:"Polo Encanto Dorado",      desc:"Detalles dorados sublimados con diseño geométrico elegante.",         price:148, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA14.png",  modelImage:"assets/images/model_polo_corazon.png",  tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:15, name:"Polo Cielo Azul Mamá",     desc:"Azul cielo con nubes bordadas y nombre en lettering.",               price:125, oldPrice:145,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA15.png",     modelImage:"assets/images/model_polo_amor.png",     tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L","XL","XXL"] },
  { id:16, name:"Polo Abuela Especial",     desc:"Diseño floral con texto 'La mejor Abuela' personalizable.",          price:120, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA16.png",   modelImage:"assets/images/model_polo_floral.png",   tags:["bestseller","new"],  badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:17, name:"Polo Safari Chic",         desc:"Estampado animal print elegante en tonos camel y negro.",            price:138, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA17.png", modelImage:"assets/images/model_polo_mariposa.png", tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:18, name:"Polo Minimalista Rosa",    desc:"Diseño minimalista con pequeña flor bordada en el pecho.",           price:115, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA18.png",    modelImage:"assets/images/model_polo_rosas.png",    tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL","XXL"] },
  { id:19, name:"Polo Tropical Vibes",      desc:"Hojas tropicales y flores exóticas en colores vibrantes.",           price:142, oldPrice:165,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA19.png",  modelImage:"assets/images/model_polo_corazon.png",  tags:["sale","new"],        badge:"sale",       sizes:["S","M","L","XL"] },
  { id:20, name:"Polo Dulce Hogar",         desc:"'Hogar dulce hogar' con ilustración casita floral. Ideal para mamá.",price:130, oldPrice:null, image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA20.png",     modelImage:"assets/images/model_polo_amor.png",     tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL"] },
  // ── OFERTAS ──
  { id:21, name:"Polo Cerezos en Flor",     desc:"Inspirado en los cerezos japoneses. Sublimación en alta calidad.",   price:135, oldPrice:175,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA21.png",   modelImage:"assets/images/model_polo_floral.png",   tags:["sale","new"],        badge:"sale",       sizes:["S","M","L","XL","XXL"] },
  { id:22, name:"Polo Mariposas Libres",    desc:"Mariposas en vuelo con acuarela. Algodón 100% peinado.",             price:128, oldPrice:155,  image:"https://qipivftteapqbqgtjjcn.supabase.co/storage/v1/object/public/Imagenes%20de%20ropa/PRENDA22.png", modelImage:"assets/images/model_polo_mariposa.png", tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L"] },
  { id:23, name:"Polo Amanecer Andino",     desc:"Colores del amanecer andino con diseño geométrico autóctono.",       price:140, oldPrice:180,  image:"assets/images/polo_rosas.png",    modelImage:"assets/images/model_polo_rosas.png",    tags:["sale","bestseller"], badge:"sale",       sizes:["S","M","L","XL"] },
  { id:24, name:"Polo Abrazos de Mamá",     desc:"Ilustración manos abrazando corazón con nombres del núcleo familiar.",price:150,oldPrice:195,  image:"assets/images/polo_corazon.png",  modelImage:"assets/images/model_polo_corazon.png",  tags:["sale","bestseller"], badge:"sale",       sizes:["XS","S","M","L","XL","XXL"] },
  { id:25, name:"Polo Frase Inspiradora",   desc:"Frase motivacional en tipografía dorada sobre fondo blanco.",        price:110, oldPrice:135,  image:"assets/images/polo_amor.png",     modelImage:"assets/images/model_polo_amor.png",     tags:["sale"],              badge:"sale",       sizes:["S","M","L","XL","XXL"] },
  { id:26, name:"Polo Sunset Coral",        desc:"Degradado coral y melocotón. Diseño exclusivo edición verano.",      price:145, oldPrice:180,  image:"assets/images/polo_floral.png",   modelImage:"assets/images/model_polo_floral.png",   tags:["sale","new"],        badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:27, name:"Polo Estrellas Fugaces",   desc:"Estrellas y destellos plateados sobre azul noche. Mágico.",         price:132, oldPrice:160,  image:"assets/images/polo_mariposa.png", modelImage:"assets/images/model_polo_mariposa.png", tags:["sale"],              badge:"sale",       sizes:["S","M","L","XL"] },
  { id:28, name:"Polo Garden Party",        desc:"Jardín ilustrado con flores de acuarela pastel. Fresco y elegante.", price:138, oldPrice:170,  image:"assets/images/polo_rosas.png",    modelImage:"assets/images/model_polo_rosas.png",    tags:["sale","new"],        badge:"sale",       sizes:["XS","S","M","L","XL","XXL"] },
  { id:29, name:"Polo Lazo de Amor",        desc:"Gran lazo rosa con texto 'Para Mamá' en dorado.",                   price:118, oldPrice:148,  image:"assets/images/polo_corazon.png",  modelImage:"assets/images/model_polo_corazon.png",  tags:["sale","bestseller"], badge:"sale",       sizes:["S","M","L","XL"] },
  { id:30, name:"Polo Patchwork Floral",    desc:"Diseño patchwork de flores en tonos pasteles. Único.",              price:125, oldPrice:155,  image:"assets/images/polo_amor.png",     modelImage:"assets/images/model_polo_amor.png",     tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L"] },
  // ── MÁS COLECCIONES ──
  { id:31, name:"Polo Encaje Moderno",      desc:"Textura encaje sublimada con detalles florales en blanco.",          price:142, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:32, name:"Polo Colibrí & Flores",    desc:"Colibrí multicolor entre flores tropicales. Vibrante y único.",      price:148, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["new","bestseller"],  badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:33, name:"Polo Serenata Rosa",       desc:"Diseño serenata con notas musicales y rosas. Para mamás artistas.",  price:130, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:34, name:"Polo Girasoles Felices",   desc:"Girasoles amarillos sobre blanco. Alegre y luminoso.",              price:122, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL","XXL"] },
  { id:35, name:"Polo Elegancia Total",     desc:"Diseño monocromático elegante con detalles geométricos dorados.",   price:155, oldPrice:null, image:"assets/images/polo_amor.png",     tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:36, name:"Polo Brunch & Flores",     desc:"Ilustración brunch con flores y café. Divertido y moderno.",        price:128, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new","bestseller"],  badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:37, name:"Polo Mi Mamá Mi Heroína",  desc:"Texto heroína con capa y flores. El regalo más emotivo.",           price:135, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL","XXL"] },
  { id:38, name:"Polo Abstracto Pastel",    desc:"Arte abstracto en colores pastel. Diseño artístico exclusivo.",     price:145, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:39, name:"Polo Corazón Infinito",    desc:"Símbolo infinito formado por corazones. Amor eterno para mamá.",   price:125, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller","new"],  badge:"new",        sizes:["S","M","L","XL"] },
  { id:40, name:"Polo Acuarela Salvaje",    desc:"Flores silvestres en técnica acuarela. Arte en cada prenda.",       price:152, oldPrice:null, image:"assets/images/polo_amor.png",     tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:41, name:"Polo Petalos de Rosa",     desc:"Pétalos caídos sobre fondo crema. Romántico y sofisticado.",        price:138, oldPrice:165,  image:"assets/images/polo_floral.png",   tags:["sale","bestseller"], badge:"sale",       sizes:["S","M","L","XL"] },
  { id:42, name:"Polo Flores de Cerezo",    desc:"Sakura en plena floración. Edición primavera limitada.",            price:142, oldPrice:175,  image:"assets/images/polo_mariposa.png", tags:["sale","new"],        badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:43, name:"Polo Madreselva",          desc:"Enredadera de madreselva bordada. Delicado y femenino.",            price:130, oldPrice:160,  image:"assets/images/polo_rosas.png",    tags:["sale"],              badge:"sale",       sizes:["S","M","L","XL","XXL"] },
  { id:44, name:"Polo Te Quiero Mamá",      desc:"Lettering 'Te quiero mamá' en dorado con corazones.",              price:120, oldPrice:145,  image:"assets/images/polo_corazon.png",  tags:["sale","bestseller"], badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:45, name:"Polo Cielo Estrellado",    desc:"Van Gogh inspirado con flores. Arte en tu polo.",                  price:160, oldPrice:200,  image:"assets/images/polo_amor.png",     tags:["sale","new"],        badge:"sale",       sizes:["S","M","L","XL"] },
  { id:46, name:"Polo Mandala Zen",         desc:"Mandala floral en degradado morado y rosa. Energía positiva.",      price:135, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:47, name:"Polo Dulce Valentina",     desc:"Personalizable con nombre propio en caligrafía fina.",              price:125, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL"] },
  { id:48, name:"Polo Lluvia de Flores",    desc:"Flores cayendo en cascada. Estampado all-over exclusivo.",          price:148, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new","bestseller"],  badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:49, name:"Polo Magia Maternal",      desc:"Ilustración madre e hija con flores mágicas alrededor.",           price:155, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL","XXL"] },
  { id:50, name:"Polo Dorado Premium",      desc:"Todo impreso en dorado sobre blanco. Lujo accesible para mamá.",   price:165, oldPrice:null, image:"assets/images/polo_amor.png",     tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:51, name:"Polo Primroses",           desc:"Prímulas inglesas bordadas. Elegancia clásica atemporal.",          price:140, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:52, name:"Polo Libertad Floral",     desc:"Mariposa + flores en degradado libre. Edición especial.",          price:145, oldPrice:175,  image:"assets/images/polo_mariposa.png", tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L","XL","XXL"] },
  { id:53, name:"Polo Crisantemo",          desc:"Crisantemos orientales en negro y dorado. Sofisticado.",            price:150, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:54, name:"Polo Amapola Roja",        desc:"Amapolas rojas vibrantes sobre blanco. Llamativo y elegante.",     price:128, oldPrice:155,  image:"assets/images/polo_corazon.png",  tags:["sale","bestseller"], badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:55, name:"Polo Aquarelle Mamá",      desc:"Técnica acuarela con nombre y fecha especial personalizable.",      price:138, oldPrice:null, image:"assets/images/polo_amor.png",     tags:["bestseller","new"],  badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:56, name:"Polo Bouquet Nupcial",     desc:"Ramo nupcial con peonías y rosas. Romántico y sofisticado.",       price:145, oldPrice:180,  image:"assets/images/polo_floral.png",   tags:["sale","new"],        badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:57, name:"Polo Familia Unida",       desc:"Árbol genealógico con flores y nombres de la familia.",             price:160, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL","XXL"] },
  { id:58, name:"Polo Frida Inspirada",     desc:"Arte inspirado en Frida Kahlo con flores y colores bolivianos.",   price:155, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:59, name:"Polo Orquídea Exótica",    desc:"Orquídeas tropicales en sublimación ultra HD. Vibrante.",          price:148, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["new","bestseller"],  badge:"new",        sizes:["S","M","L","XL"] },
  { id:60, name:"Polo Sueños de Mamá",      desc:"Nubes, estrellas y corazones. Para soñar con la mejor mamá.",      price:122, oldPrice:148,  image:"assets/images/polo_amor.png",     tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L","XL","XXL"] },
  { id:61, name:"Polo Lavanda Provence",    desc:"Campos de lavanda francesa. Aroma visual de tranquilidad.",        price:135, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["S","M","L","XL"] },
  { id:62, name:"Polo Artesanal Bolivia",   desc:"Patrones bolivianos modernizados. Orgullo cultural en tu polo.",   price:158, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["bestseller","new"],  badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:63, name:"Polo Galaxia Rosa",        desc:"Galaxia en tonos rosas y lilas. Para mamás que brillan.",          price:142, oldPrice:170,  image:"assets/images/polo_rosas.png",    tags:["sale","new"],        badge:"sale",       sizes:["S","M","L","XL"] },
  { id:64, name:"Polo Café & Flores",       desc:"Taza de café con flores emergiendo. Para mamás cafeteras.",        price:125, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller"],        badge:"bestseller", sizes:["XS","S","M","L","XL"] },
  { id:65, name:"Polo Maternidad Glam",     desc:"Silueta madre con bebé y flores doradas alrededor.",               price:150, oldPrice:null, image:"assets/images/polo_amor.png",     tags:["new","bestseller"],  badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:66, name:"Polo Tigresa Floral",      desc:"Tigre con flores. Mamá poderosa y femenina. Edición limitada.",    price:162, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:67, name:"Polo Sweet Memories",      desc:"Polaroids con flores. Para recordar los mejores momentos.",        price:138, oldPrice:165,  image:"assets/images/polo_mariposa.png", tags:["sale"],              badge:"sale",       sizes:["S","M","L","XL"] },
  { id:68, name:"Polo Dalia Imperial",      desc:"Dalias en full bloom. Majestuoso y colorido. Tela stretch.",       price:145, oldPrice:null, image:"assets/images/polo_rosas.png",    tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:69, name:"Polo Amor Eterno",         desc:"Nudo celta de amor con flores celtas. Amor que no termina.",       price:132, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL"] },
  { id:70, name:"Polo Iris & Gold",         desc:"Flores de iris con detalles dorados. Lujo accesible.",             price:155, oldPrice:190,  image:"assets/images/polo_amor.png",     tags:["sale","new"],        badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:71, name:"Polo Cosmos Floral",       desc:"Cosmos flowers en lila y blanco. Delicadeza y distinción.",        price:128, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:72, name:"Polo Watercolor Dream",    desc:"Sueño acuarela con flores difuminadas. Arte contemporáneo.",       price:148, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["new","bestseller"],  badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:73, name:"Polo Cactus Bloom",        desc:"Cactus en flor del desierto andino. Original y moderno.",          price:122, oldPrice:148,  image:"assets/images/polo_rosas.png",    tags:["sale"],              badge:"sale",       sizes:["S","M","L","XL"] },
  { id:74, name:"Polo Novia Perfecta",      desc:"Para la mamá que fue y siempre será la novia más bella.",          price:145, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller","new"],  badge:"new",        sizes:["XS","S","M","L","XL","XXL"] },
  { id:75, name:"Polo Peonía Romántica",    desc:"Peonías rosas en bloom. El polo más romántico de la colección.",   price:138, oldPrice:168,  image:"assets/images/polo_amor.png",     tags:["sale","bestseller"], badge:"sale",       sizes:["S","M","L","XL"] },
  { id:76, name:"Polo Lluvia Dorada",       desc:"Efecto lluvia en dorado sobre blanco. Glamour cotidiano.",         price:152, oldPrice:null, image:"assets/images/polo_floral.png",   tags:["new"],               badge:"new",        sizes:["XS","S","M","L","XL"] },
  { id:77, name:"Polo Cuento de Hadas",     desc:"Ilustración cuento con castillo y flores. Mágico para mamá.",      price:135, oldPrice:null, image:"assets/images/polo_mariposa.png", tags:["new","bestseller"],  badge:"new",        sizes:["S","M","L","XL","XXL"] },
  { id:78, name:"Polo Madre Tierra",        desc:"Mandala tierra con flores nativas. Espiritualidad y naturaleza.",  price:142, oldPrice:175,  image:"assets/images/polo_rosas.png",    tags:["sale"],              badge:"sale",       sizes:["XS","S","M","L","XL"] },
  { id:79, name:"Polo Princesa Mamá",       desc:"Corona de flores con texto 'Mi Mamá es mi Reina'. Emotivo.",       price:130, oldPrice:null, image:"assets/images/polo_corazon.png",  tags:["bestseller"],        badge:"bestseller", sizes:["S","M","L","XL"] },
  { id:80, name:"Polo Colección Exclusiva", desc:"Diseño edición especial Día de la Madre 2026. Solo 50 unidades.",  price:200, oldPrice:260,  image:"assets/images/polo_amor.png",     tags:["sale","new","bestseller"],badge:"sale",  sizes:["XS","S","M","L","XL","XXL"] },
];

/**
 * loadProducts()
 * Carga desde Supabase si está configurado con clave válida, sino usa PRODUCTS_DB local.
 */
async function loadProducts() {
  const sb = getSB();
  if (sb) {
    try {
      const { data, error } = await sb
        .from(SB_TABLE)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(80);
      if (!error && data && data.length > 0) {
        console.log(`✅ ${data.length} productos cargados desde Supabase`);
        return data.map(p => ({
          id:       p.id,
          name:     p.name,
          desc:     p.description || '',
          price:    p.price,
          oldPrice: p.old_price || null,
          image:    p.image_url || 'assets/images/placeholder.png',
          tags:     p.category ? [p.category] : ['new'],
          badge:    p.category || 'new',
          sizes:    p.sizes ? p.sizes.split(',').map(s => s.trim()) : ['S','M','L','XL'],
        }));
      } else if (error) {
        console.warn('⚠️ Supabase error:', error.message);
      }
    } catch(e) { console.warn('⚠️ Supabase error:', e.message); }
  } else {
    console.warn('🔑 Clave Supabase no configurada. Para conectar el catálogo real:\n'
      + '1. Ve a https://supabase.com/dashboard/project/qipivftteapqbagtjicn/settings/api\n'
      + '2. Copia la "anon public key" (empieza con eyJ...)\n'
      + '3. Pégala en SUPABASE_ANON en js/data.js y en admin.html');
  }
  console.log('📦 Catálogo local activo (80 productos demo)');
  return new Promise(resolve => setTimeout(() => resolve(PRODUCTS_DB), 200));
}
