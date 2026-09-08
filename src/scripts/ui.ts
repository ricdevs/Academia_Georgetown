function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initReveal() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!nodes.length) return;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  nodes.forEach((el) => io.observe(el));
}

function initMenu() {
  const btn = document.getElementById('menu-btn');
  const navEl = document.getElementById('mobile-nav');
  if (!btn || !navEl) return;
  btn.addEventListener('click', () => {
    const open = navEl.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
}

function initToggles() {
  document.querySelectorAll<HTMLElement>('[data-toggle]').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('.ag-toggle-title');
    const panel = item.querySelector<HTMLElement>('.ag-toggle-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.style.maxHeight = '0px';
      }
    });
  });
}

function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-viewport]');
    const track = root.querySelector<HTMLElement>('[data-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (!viewport || !track) return;

    const desktopShow = Number(root.dataset.show || 3);
    const desktopScroll = Number(root.dataset.scroll || 1);
    const gap = Number(root.dataset.gap || 15);
    let index = 0;
    let slideW = 0;
    const reduced = prefersReducedMotion();

    const slides = () => [...track.children] as HTMLElement[];

    const visible = () => (window.innerWidth < 981 ? 1 : desktopShow);
    const step = () => (window.innerWidth < 981 ? 1 : desktopScroll);

    function layout(animate = true) {
      const n = visible();
      const count = slides().length;
      const width = viewport!.clientWidth;
      slideW = (width - gap * (n - 1)) / n;
      slides().forEach((s) => {
        s.style.flex = `0 0 ${slideW}px`;
        s.style.width = `${slideW}px`;
        s.style.marginRight = `${gap}px`;
      });
      const max = Math.max(0, count - n);
      if (index > max) index = 0;
      track!.style.transition = animate && !reduced ? 'transform 1.5s ease' : 'none';
      track!.style.transform = `translateX(-${index * (slideW + gap)}px)`;
    }

    function go(dir: number) {
      const n = visible();
      const count = slides().length;
      const max = Math.max(0, count - n);
      const sc = step();
      index += dir * sc;
      if (index > max) index = 0;
      if (index < 0) index = max;
      layout(true);
    }

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    window.addEventListener('resize', () => layout(false));
    layout(false);
  });
}

initReveal();
initMenu();
initToggles();
initCarousels();
document.addEventListener('astro:page-load', () => {
  initReveal();
  initMenu();
  initToggles();
  initCarousels();
});
