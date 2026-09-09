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

function cloneLoopSlides(source: HTMLElement[], start: number, n: number) {
  const out: HTMLElement[] = [];
  if (!source.length || n <= 0) return out;
  for (let i = 0; i < n; i++) {
    const idx = ((start + i) % source.length + source.length) % source.length;
    const node = source[idx].cloneNode(true) as HTMLElement;
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('tabindex', '-1');
    node.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
      el.setAttribute('tabindex', '-1');
    });
    out.push(node);
  }
  return out;
}

function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (root.dataset.carouselReady === '1') return;
    const viewport = root.querySelector<HTMLElement>('[data-viewport]');
    const track = root.querySelector<HTMLElement>('[data-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (!viewport || !track) return;
    root.dataset.carouselReady = '1';

    const desktopShow = Number(root.dataset.show || 3);
    const desktopScroll = Number(root.dataset.scroll || 1);
    const gap = Number(root.dataset.gap || 15);
    const autoplayMs = Number(root.dataset.autoplay || 0);
    const reduced = prefersReducedMotion();
    const originals = [...track.children] as HTMLElement[];
    const realCount = originals.length;
    const offset = Math.max(desktopShow, 1) + Math.max(desktopScroll, 1);
    const canLoop = realCount > 1;

    if (canLoop) {
      cloneLoopSlides(originals, realCount - offset, offset).forEach((node) => {
        track.insertBefore(node, track.firstChild);
      });
      cloneLoopSlides(originals, 0, offset).forEach((node) => {
        track.appendChild(node);
      });
    }

    const slides = () => [...track.children] as HTMLElement[];
    const visible = () => (window.innerWidth < 981 ? 1 : desktopShow);
    const step = () => (window.innerWidth < 981 ? 1 : desktopScroll);

    let index = canLoop ? offset : 0;
    let slideW = 0;
    let lastWidth = 0;
    let moving = false;
    let pendingResize = false;
    let hovered = false;
    let autoplayTimer = 0;
    let unlockTimer = 0;

    function xform() {
      return `translate3d(-${index * (slideW + gap)}px, 0, 0)`;
    }

    function setTransform(animate: boolean) {
      const next = xform();
      if (reduced || !animate) {
        track!.style.transition = 'none';
        track!.style.transform = next;
        void track!.offsetWidth;
        track!.style.removeProperty('transition');
        return;
      }
      track!.style.removeProperty('transition');
      track!.style.transform = next;
    }

    function measure() {
      const n = visible();
      const width = viewport!.clientWidth;
      lastWidth = width;
      slideW = n > 0 ? (width - gap * (n - 1)) / n : width;
      slides().forEach((s) => {
        s.style.flex = `0 0 ${slideW}px`;
        s.style.width = `${slideW}px`;
        s.style.marginRight = `${gap}px`;
      });
      if (!canLoop) {
        const max = Math.max(0, realCount - n);
        if (index > max) index = max;
        if (index < 0) index = 0;
      }
    }

    function normalize() {
      if (!canLoop) return;
      if (index >= offset + realCount) {
        index -= realCount;
        setTransform(false);
      } else if (index < offset) {
        index += realCount;
        setTransform(false);
      }
    }

    function armAutoplay() {
      window.clearTimeout(autoplayTimer);
      if (reduced || autoplayMs <= 0 || hovered || document.hidden || moving) return;
      autoplayTimer = window.setTimeout(() => go(1), autoplayMs);
    }

    function finishMove() {
      if (!moving) return;
      moving = false;
      window.clearTimeout(unlockTimer);
      normalize();
      if (pendingResize) {
        pendingResize = false;
        measure();
        setTransform(false);
      }
      armAutoplay();
    }

    function go(dir: number) {
      const sc = step();
      if (canLoop) {
        if (dir > 0) {
          const seam = offset + realCount;
          const nextIndex = index + sc;
          index = nextIndex > seam ? seam : nextIndex;
        } else {
          index -= sc;
        }
      } else {
        const max = Math.max(0, realCount - visible());
        index += dir * sc;
        if (index > max) index = 0;
        if (index < 0) index = max;
      }
      window.clearTimeout(autoplayTimer);
      window.clearTimeout(unlockTimer);
      if (reduced) {
        moving = false;
        normalize();
        setTransform(false);
        return;
      }
      moving = true;
      setTransform(true);
      unlockTimer = window.setTimeout(finishMove, 1650);
    }

    function onResize() {
      const width = viewport!.clientWidth;
      if (width === lastWidth) return;
      if (moving) {
        pendingResize = true;
        return;
      }
      measure();
      setTransform(false);
    }

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('transitionend', (e) => {
      if (e.target !== track || e.propertyName !== 'transform') return;
      finishMove();
    });
    window.addEventListener('resize', onResize);
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(onResize).observe(viewport);
    }

    if (autoplayMs > 0 && !reduced) {
      root.addEventListener('mouseenter', () => {
        hovered = true;
        window.clearTimeout(autoplayTimer);
      });
      root.addEventListener('mouseleave', () => {
        hovered = false;
        armAutoplay();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) window.clearTimeout(autoplayTimer);
        else armAutoplay();
      });
    }

    measure();
    setTransform(false);
    armAutoplay();
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
