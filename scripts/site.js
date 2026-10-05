// Comportamiento de la página pública: carrusel, botón "volver arriba" y año del footer.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // ---- Carrusel ----
  const track = document.getElementById('metalCarousel');
  if (track) {
    const slides = track.children.length;
    const dots = document.querySelectorAll('#metalDots span');
    let index = 0;

    const go = (direction) => {
      index = (index + direction + slides) % slides;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    document.getElementById('metalPrev').addEventListener('click', () => go(-1));
    document.getElementById('metalNext').addEventListener('click', () => go(1));

    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    }, { passive: true });
  }

  // ---- Galería (lightbox propio) ----
  const items = Array.from(document.querySelectorAll('#gallery-container .gallery-item'));
  const lb = document.getElementById('lightbox');
  if (items.length && lb) {
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    const lbCount = document.getElementById('lbCount');
    let index = 0;
    let isOpen = false;
    let lastFocus = null;
    let token = 0;

    const caption = (i) => I18n.t(items[i].dataset.i18nKey);
    const updateText = () => {
      lbCap.textContent = caption(index);
      lbImg.alt = caption(index);
      lbCount.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    };

    // Cambia de foto con fundido: se precarga la nueva y solo entonces se intercambia, sin saltos de tamaño.
    const show = (i, instant) => {
      index = (i + items.length) % items.length;
      const src = items[index].getAttribute('href');
      const mine = ++token;
      updateText();
      const swap = () => {
        if (mine !== token) return;
        lbImg.src = src;
        lbImg.classList.remove('fading');
      };
      if (instant) { swap(); return; }
      lbImg.classList.add('fading');
      const pre = new Image();
      const loaded = new Promise((r) => { pre.onload = pre.onerror = r; });
      pre.src = src;
      // espera el fundido de salida (250 ms) y la carga de la nueva antes de intercambiar
      Promise.all([loaded, new Promise((r) => setTimeout(r, 250))]).then(swap);
    };

    const open = (i) => {
      lastFocus = document.activeElement;
      isOpen = true;
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
      show(i, true);
      document.getElementById('lbClose').focus();
    };
    const close = () => {
      isOpen = false;
      token++;
      lb.classList.remove('on');
      lbImg.removeAttribute('src');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); open(i); }));
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', () => show(index - 1));
    document.getElementById('lbNext').addEventListener('click', () => show(index + 1));

    let swiped = false;
    lb.addEventListener('click', (e) => {
      if (swiped) { swiped = false; return; }
      if (e.target === lb || e.target.classList.contains('lb-stage')) close();
    });

    let touch = null;
    lb.addEventListener('touchstart', (e) => {
      swiped = false;
      touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (!touch) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; show(index + (dx < 0 ? 1 : -1)); }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    document.addEventListener('langchange', () => { if (isOpen) updateText(); });
  }

  // ---- Volver arriba ----
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => backToTop.classList.toggle('visible', window.scrollY > 300);
  window.addEventListener('scroll', onScroll, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
});
