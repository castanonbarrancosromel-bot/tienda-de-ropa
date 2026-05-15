/**
 * animations.js — Navbar · Hero · Petals · ScrollReveal · FloatingPromo · CardSliders · FlowerCanvas · RoseGarden
 */

/* ══ ROSE GARDEN SVG — Jardín de rosas en la base del hero ══ */
function initRoseGarden() {
  const el = document.getElementById('rose-garden');
  if (!el) return;
  const ns = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => {
    const e = document.createElementNS(ns, tag);
    for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
    return e;
  };

  function makeRose(svg, cx, cy, r, c1, c2) {
    svg.appendChild(mk('circle',{cx,cy,r:r*1.5,fill:c1,opacity:'0.10'}));
    for (let i=0;i<5;i++){
      const a=(i/5)*Math.PI*2;
      const px=cx+Math.cos(a)*r*1.1, py=cy+Math.sin(a)*r*1.1;
      svg.appendChild(mk('ellipse',{cx:px,cy:py,rx:r*0.62,ry:r*0.42,
        fill:i%2===0?c1:c2,opacity:'0.88',
        transform:`rotate(${a*180/Math.PI+90},${px},${py})`}));
    }
    svg.appendChild(mk('circle',{cx,cy,r:r*0.68,fill:c2}));
    svg.appendChild(mk('circle',{cx,cy,r:r*0.33,fill:c1}));
    svg.appendChild(mk('circle',{cx,cy,r:r*0.13,fill:'#4A148C',opacity:'0.55'}));
  }

  function makeLeaf(svg,cx,cy,rx,ry,angle){
    svg.appendChild(mk('ellipse',{cx,cy,rx,ry,fill:'#2D6A2D',opacity:'0.80',
      transform:`rotate(${angle},${cx},${cy})`}));
  }

  function makeBush(svg, x, groundY, height, sc, roses) {
    const sw=sc*3.5;
    svg.appendChild(mk('path',{
      d:`M${x},${groundY} C${x-sw},${groundY-height*0.3} ${x-sw*1.5},${groundY-height*0.6} ${x-sw*0.8},${groundY-height}`,
      stroke:'#5D3A1A','stroke-width':sw,fill:'none','stroke-linecap':'round'}));
    [{t:.44,ox:-height*.17},{t:.65,ox:height*.19},{t:.82,ox:-height*.13}].forEach(b=>{
      const by=groundY-height*b.t, bx=x+b.ox;
      svg.appendChild(mk('path',{
        d:`M${x-sw*.6},${by} Q${(x+bx)/2},${by-height*.03} ${bx},${by-height*.06}`,
        stroke:'#5D3A1A','stroke-width':sw*.6,fill:'none','stroke-linecap':'round'}));
      makeLeaf(svg,bx,by-height*.03,sc*8,sc*3.5,b.ox>0?30:-30);
    });
    makeLeaf(svg,x-sw*2,groundY-height*.38,sc*10,sc*4,-38);
    makeLeaf(svg,x+sw,  groundY-height*.52,sc*9, sc*3.8, 28);
    roses.forEach(r=>{
      makeRose(svg,x-sw*.8+r.dx*sc, groundY-height*r.ht, r.r*sc, r.c1, r.c2);
    });
  }

  const W=1440, H=260;
  const svg=mk('svg',{xmlns:ns,viewBox:`0 0 ${W} ${H}`,
    preserveAspectRatio:'xMidYMax meet',style:`width:100%;height:${H}px;display:block;`});

  const defs=mk('defs',{});
  const g=mk('linearGradient',{id:'gnd2',x1:'0',y1:'0',x2:'0',y2:'1'});
  g.appendChild(mk('stop',{offset:'0%','stop-color':'#1E5E1E'}));
  g.appendChild(mk('stop',{offset:'100%','stop-color':'#14521A'}));
  defs.appendChild(g); svg.appendChild(defs);
  svg.appendChild(mk('ellipse',{cx:'720',cy:'250',rx:'780',ry:'20',fill:'#1A6B1A',opacity:'0.45'}));
  svg.appendChild(mk('rect',{x:'0',y:'246',width:'1440',height:'14',fill:'url(#gnd2)'}));

  const M1='#FF4DC8',M2='#E91E8C',P1='#FFE0F0',P2='#FFB3D9';
  [
    {x:55,  h:H*.72,sc:.85,r:[{dx:0,ht:1.0,r:11,c1:M1,c2:M2},{dx:-14,ht:.55,r:8,c1:P1,c2:P2},{dx:12,ht:.46,r:7,c1:M1,c2:M2}]},
    {x:175, h:H*.44,sc:.65,r:[{dx:0,ht:1.0,r:9,c1:P1,c2:P2},{dx:12,ht:.55,r:6,c1:M1,c2:M2}]},
    {x:308, h:H*.92,sc:1.1, r:[{dx:0,ht:1.0,r:14,c1:M1,c2:M2},{dx:-22,ht:.52,r:10,c1:P1,c2:P2},{dx:24,ht:.48,r:9,c1:M1,c2:M2},{dx:-14,ht:.73,r:8,c1:P1,c2:P2},{dx:10,ht:.83,r:7,c1:M1,c2:M2}]},
    {x:445, h:H*.38,sc:.60,r:[{dx:0,ht:1.0,r:8,c1:M1,c2:M2},{dx:-10,ht:.52,r:5,c1:P1,c2:P2}]},
    {x:578, h:H*.62,sc:.82,r:[{dx:0,ht:1.0,r:11,c1:P1,c2:P2},{dx:16,ht:.55,r:7,c1:M1,c2:M2},{dx:-14,ht:.48,r:7,c1:P1,c2:P2}]},
    {x:730, h:H*.97,sc:1.2, r:[{dx:0,ht:1.0,r:16,c1:M1,c2:M2},{dx:-28,ht:.52,r:11,c1:P1,c2:P2},{dx:28,ht:.48,r:10,c1:M1,c2:M2},{dx:-16,ht:.76,r:9,c1:P1,c2:P2},{dx:16,ht:.81,r:8,c1:M1,c2:M2},{dx:0,ht:.62,r:7,c1:P1,c2:P2}]},
    {x:878, h:H*.40,sc:.62,r:[{dx:0,ht:1.0,r:8,c1:P1,c2:P2},{dx:10,ht:.5,r:5,c1:M1,c2:M2}]},
    {x:1010,h:H*.78,sc:.95,r:[{dx:0,ht:1.0,r:13,c1:M1,c2:M2},{dx:-20,ht:.53,r:9,c1:P1,c2:P2},{dx:18,ht:.47,r:8,c1:M1,c2:M2},{dx:-8,ht:.75,r:7,c1:P1,c2:P2}]},
    {x:1160,h:H*.55,sc:.75,r:[{dx:0,ht:1.0,r:10,c1:P1,c2:P2},{dx:14,ht:.52,r:7,c1:M1,c2:M2},{dx:-12,ht:.48,r:6,c1:P1,c2:P2}]},
    {x:1295,h:H*.38,sc:.58,r:[{dx:0,ht:1.0,r:8,c1:M1,c2:M2}]},
    {x:1400,h:H*.60,sc:.78,r:[{dx:0,ht:1.0,r:11,c1:P1,c2:P2},{dx:-12,ht:.52,r:7,c1:M1,c2:M2}]},
  ].forEach(b=>makeBush(svg,b.x,H-5,b.h,b.sc,b.r));

  el.appendChild(svg);
}

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
    ['#F48FB1','#E91E8C'], // rosa vibrante
    ['#FFD700','#D4AF37'], // dorado
    ['#FCE4EC','#F48FB1'], // rosa pastel
    ['#FFF9C4','#F0D060'], // dorado claro
    ['#FFFFFF','#F8BBD0'], // blanco-rosa
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
