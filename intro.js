(() => {
  const intro = document.querySelector('#intro');
  const nav = document.querySelector('#site-nav');
  const skip = document.querySelector('#skip-intro');
  const root = document.documentElement;
  const key = 'rustok-intro-skipped';
  const params = new URLSearchParams(location.search);
  const force = params.get('intro') === '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const lerp = (from, to, t) => from + (to - from) * t;

  function showNav() {
    nav?.classList.add('is-shown');
  }

  function removeIntro(remember) {
    if (remember) {
      try {
        localStorage.setItem(key, '1');
      } catch (error) {
        /* приватный режим */
      }
    }
    intro?.remove();
    root.style.setProperty('--intro-h', '0px');
    showNav();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (new URLSearchParams(location.search).has('intro')) {
      history.replaceState(null, '', location.pathname + location.hash);
    }
  }

  if (!intro) {
    showNav();
    return;
  }

  if (force) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      /* приватный режим */
    }
  }

  let remembered = false;
  try {
    remembered = localStorage.getItem(key) === '1';
  } catch (error) {
    remembered = false;
  }

  if (reduce || (!force && remembered)) {
    intro.remove();
    root.style.setProperty('--intro-h', '0px');
    showNav();
    return;
  }

  let raf = null;

  function frame() {
    raf = null;
    const rect = intro.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const progress = span > 0 ? clamp01(-rect.top / span) : 1;

    root.style.setProperty('--zoom', lerp(1, 1.16, progress).toFixed(3));
    root.style.setProperty('--zoom-win', lerp(0.72, 1, progress).toFixed(4));
    root.style.setProperty('--fade-copy', String(clamp01((progress - 0.55) / 0.3)));

    nav?.classList.toggle('is-shown', progress > 0.985);
    if (progress < 1) raf = window.requestAnimationFrame(frame);
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!raf) raf = window.requestAnimationFrame(frame);
    },
    { passive: true }
  );
  window.addEventListener('resize', frame);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') removeIntro(true);
  });

  skip?.addEventListener('click', () => removeIntro(true));

  frame();
})();
