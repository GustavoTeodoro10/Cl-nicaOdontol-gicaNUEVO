// ─── PREFERÊNCIA DE MOVIMENTO ────────────────────────────────────────────────
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── GOATCOUNTER: listener único para todos os CTAs ──────────────────────────
document.querySelectorAll('[data-gc-event]').forEach(el => {
  el.addEventListener('click', () => {
    const evt = el.dataset.gcEvent;
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: evt, title: evt, event: true });
    }
  });
});

// ─── NAV: scroll effect ───────────────────────────────────────────────────────
const nav = document.getElementById('main-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('nav-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── NAV: menu mobile ─────────────────────────────────────────────────────────
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');
const iconOpen  = toggle && toggle.querySelector('.icon-open');
const iconClose = toggle && toggle.querySelector('.icon-close');

function closeMenu() {
  if (!menu) return;
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (iconOpen)  iconOpen.style.display  = '';
  if (iconClose) iconClose.style.display = 'none';
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (iconOpen)  iconOpen.style.display  = isOpen ? 'none' : '';
    if (iconClose) iconClose.style.display = isOpen ? '' : 'none';
  });

  // Fechar ao clicar em link interno
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Fechar com Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// ─── CARROSSEL: loop infinito por CSS animation + clone ──────────────────────
(function () {
  const track = document.getElementById('carousel-sorrisos');
  if (!track) return;

  // Duplica os itens para o loop contínuo ser seamless (original + clone = 100%)
  Array.from(track.children).forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // prefers-reduced-motion: pausa a animação CSS (itens ainda visíveis)
  if (prefersReduced) {
    track.style.animationPlayState = 'paused';
    return;
  }

  // Pausa/retoma no toque (hover é tratado só no CSS)
  track.addEventListener('touchstart', () => {
    track.classList.add('is-paused');
  }, { passive: true });
  track.addEventListener('touchend', () => {
    setTimeout(() => track.classList.remove('is-paused'), 2000);
  }, { passive: true });
})();

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
if (!prefersReduced) {
  const items = document.querySelectorAll('[data-reveal]');
  if (items.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }
}
