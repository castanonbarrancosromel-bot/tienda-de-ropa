/**
 * animations.js — Navbar · Hero · Petals · ScrollReveal · FloatingPromo · CardSliders · FlowerCanvas
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

/* ══ FLOWER CANVAS — Flores interactivas y realistas ══ */
function initFlowerCanvas() {
  const canvas = document.getElementById('flower-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PAL = [
    ['#F4D0D6','#E8A0AA'], ['#FADADD','#F4A0B0'],
    ['#F9E4D4','#E8C4A0'], ['#FFE8EE','#F4B8C8'], ['#FFF0F5','#DDA0B8'],
  ];

  function nz(x,y,t){ return Math.sin(x*.8+t*.4)*Math.cos(y*.6+t*.3)*.5+Math.sin(x*.3-t*.2)*Math.cos(y*1.1+t*.5)*.3; }

  class Flower {
    constructor(){ this.init(true); }
    init(first){
      this.x=Math.random()*canvas.width;
      this.y=first?Math.random()*canvas.height:-80;
      this.z=.3+Math.random()*.7;
      this.r=(15+Math.random()*20)*this.z;
      this.n=5+Math.floor(Math.random()*4);
      this.a=Math.random()*Math.PI*2; this.av=(Math.random()-.5)*.009;
      this.vx=(Math.random()-.5)*.4; this.vy=.18+Math.random()*.22;
      const c=PAL[Math.floor(Math.random()*PAL.length)];
      this.p1=c[0]; this.p2=c[1];
      this.ph=Math.random()*Math.PI*2; this.bs=.012+Math.random()*.015; this.ba=.07+Math.random()*.1;
      this.al=(.5+Math.random()*.4)*this.z;
      this.tp=Math.floor(Math.random()*3);
    }
    petal(r,n,c,rot){
      for(let i=0;i<n;i++){
        ctx.save(); ctx.rotate((i/n)*Math.PI*2+rot);
        const g=ctx.createLinearGradient(0,0,0,-r);
        g.addColorStop(0,c[0]+'bb'); g.addColorStop(1,c[1]+'ee');
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.bezierCurveTo(r*.5,-r*.3,r*.5,-r*.9,0,-r);
        ctx.bezierCurveTo(-r*.5,-r*.9,-r*.5,-r*.3,0,0);
        ctx.fillStyle=g; ctx.fill(); ctx.restore();
      }
    }
    draw(t){
      const br=1+Math.sin(this.ph+t*this.bs)*this.ba;
      const r=this.r*br;
      ctx.save(); ctx.globalAlpha=this.al;
      ctx.translate(this.x,this.y); ctx.rotate(this.a);
      if(this.tp===0){ this.petal(r,this.n,[this.p1,this.p2],0); this.petal(r*.6,this.n,[this.p2,this.p1],Math.PI/this.n); }
      else if(this.tp===1){
        for(let i=0;i<5;i++){
          ctx.save(); ctx.rotate(i/5*Math.PI*2);
          const g=ctx.createLinearGradient(0,0,0,-r);
          g.addColorStop(0,this.p2+'aa'); g.addColorStop(1,this.p1);
          ctx.beginPath(); ctx.moveTo(0,0);
          ctx.bezierCurveTo(r*.6,-r*.2,r*.55,-r*.8,r*.12,-r);
          ctx.bezierCurveTo(0,-r*1.06,0,-r*1.06,-r*.12,-r);
          ctx.bezierCurveTo(-r*.55,-r*.8,-r*.6,-r*.2,0,0);
          ctx.fillStyle=g; ctx.fill(); ctx.restore();
        }
      } else {
        const n=this.n+3;
        for(let i=0;i<n;i++){
          ctx.save(); ctx.rotate(i/n*Math.PI*2);
          ctx.beginPath(); ctx.moveTo(0,0);
          ctx.bezierCurveTo(r*.22,-r*.3,r*.22,-r*.8,0,-r*1.1);
          ctx.bezierCurveTo(-r*.22,-r*.8,-r*.22,-r*.3,0,0);
          ctx.fillStyle=this.p1+'cc'; ctx.fill(); ctx.restore();
        }
      }
      const cg=ctx.createRadialGradient(0,0,0,0,0,r*.22);
      cg.addColorStop(0,'#fff8f0ee'); cg.addColorStop(1,this.p2);
      ctx.beginPath(); ctx.arc(0,0,r*.22,0,Math.PI*2);
      ctx.fillStyle=cg; ctx.fill(); ctx.restore();
    }
    update(t,mx,my){
      const w=nz(this.x*.003,this.y*.003,t)*.6;
      this.vx+=w*.015; this.vx*=.98;
      const dx=this.x-mx, dy=this.y-my, d=Math.hypot(dx,dy), rep=130*this.z;
      if(d<rep&&d>1){ const f=(rep-d)/rep; this.vx+=dx/d*f*2; this.vy-=dy/d*f*.5; }
      this.x+=this.vx*this.z; this.y+=this.vy*this.z;
      this.a+=this.av; this.ph+=this.bs;
      if(this.x<-100) this.x=canvas.width+50;
      if(this.x>canvas.width+100) this.x=-50;
      if(this.y>canvas.height+100) this.init(false);
    }
  }

  function resize(){ canvas.width=canvas.offsetWidth||innerWidth; canvas.height=canvas.offsetHeight||innerHeight; }
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const N=Math.min(48,Math.max(20,Math.floor(canvas.width*canvas.height/18000)));
  const FL=Array.from({length:N},()=>new Flower()).sort((a,b)=>a.z-b.z);

  let mx=-999,my=-999;
  canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
  canvas.addEventListener('mouseleave',()=>{mx=-999;my=-999;});
  canvas.addEventListener('touchmove',e=>{const r=canvas.getBoundingClientRect();mx=e.touches[0].clientX-r.left;my=e.touches[0].clientY-r.top},{passive:true});

  let t=0,raf,on=true;
  function loop(){
    if(!on)return; raf=requestAnimationFrame(loop); t+=.5;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    FL.forEach(f=>{f.update(t,mx,my);f.draw(t);});
  }
  loop();

  const hero=document.getElementById('hero');
  if(hero) new IntersectionObserver(([e])=>{on=e.isIntersecting; if(on)loop(); else cancelAnimationFrame(raf);},{threshold:.05}).observe(hero);
}
