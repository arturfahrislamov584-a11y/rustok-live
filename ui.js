(() => {
  const FAV_KEY = 'rustok-favorites';

  function readFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      return Array.isArray(stored) ? stored.filter((entry) => entry && entry.type && entry.id) : [];
    } catch (error) {
      return [];
    }
  }

  function writeFavorites(list) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(list));
    } catch (error) {
      /* приватный режим */
    }
  }

  function isFavorite(type, id) {
    return readFavorites().some((entry) => entry.type === type && entry.id === id);
  }

  function toggleFavorite(type, id) {
    const list = readFavorites();
    const index = list.findIndex((entry) => entry.type === type && entry.id === id);
    if (index >= 0) {
      list.splice(index, 1);
      writeFavorites(list);
      return false;
    }
    list.push({ type, id });
    writeFavorites(list);
    return true;
  }

  function favoritesCount() {
    return readFavorites().length;
  }

  let toastStack = null;

  function toast(message, tone) {
    if (!toastStack) {
      toastStack = document.createElement('div');
      toastStack.className = 'toast-stack';
      toastStack.setAttribute('role', 'status');
      toastStack.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastStack);
    }
    const item = document.createElement('div');
    item.className = `toast${tone ? ` toast--${tone}` : ''}`;
    item.textContent = message;
    toastStack.appendChild(item);
    window.setTimeout(() => {
      item.classList.add('is-out');
      window.setTimeout(() => item.remove(), 280);
    }, 2800);
  }

  function syncCounts() {
    const total = favoritesCount();
    document.querySelectorAll('[data-fav-count]').forEach((node) => {
      node.textContent = String(total);
      node.hidden = total === 0;
    });
  }

  function syncFavorites() {
    document.querySelectorAll('[data-fav]').forEach((button) => {
      const type = button.dataset.favType;
      const id = button.dataset.favId;
      if (!type || !id) return;
      const active = isFavorite(type, id);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (button.classList.contains('heart')) {
        button.textContent = active ? '♥' : '♡';
      }
      const glyph = button.querySelector('[data-fav-glyph]');
      if (glyph) glyph.textContent = active ? '♥' : '♡';
      const label = button.querySelector('[data-fav-label]');
      if (label) label.textContent = active ? 'В избранном' : 'В избранное';
    });
    syncCounts();
  }

  function hydrateImages(root) {
    (root || document).querySelectorAll('img[data-skeleton]:not([data-skel-ready])').forEach((image) => {
      image.dataset.skelReady = '1';
      const done = () => image.classList.add('is-loaded');
      if (image.complete && image.naturalWidth) {
        done();
      } else {
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      }
    });
  }

  function buildDrawerLinks(header) {
    const items = [];
    const seen = new Set();
    header.querySelectorAll('nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || seen.has(href)) return;
      seen.add(href);
      const clone = link.cloneNode(true);
      clone.querySelectorAll('[data-fav-count], b').forEach((node) => node.remove());
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      items.push({ href, text });
    });
    if (!seen.has('favorites.html')) items.push({ href: 'favorites.html', text: 'Избранное' });
    if (!seen.has('account.html')) items.push({ href: 'account.html', text: 'Кабинет' });
    if (!seen.has('business.html')) items.push({ href: 'business.html', text: 'Для юрлиц' });
    return items
      .map((item) => {
        const badge = item.href === 'favorites.html' ? ' <b class="nav-drawer-count" data-fav-count hidden>0</b>' : '';
        return `<a href="${item.href}">${item.text}${badge}</a>`;
      })
      .join('');
  }

  function initNavigation() {
    const header = document.querySelector('.site-nav') || document.querySelector('.bar') || document.querySelector('.author-bar');
    if (!header || header.dataset.navReady) return;
    header.dataset.navReady = '1';
    header.classList.add('has-burger');

    const nav = header.querySelector('.site-nav-links, nav');
    if (nav) {
      if (!nav.querySelector('a[href="favorites.html"]')) {
        const favorites = document.createElement('a');
        favorites.href = 'favorites.html';
        favorites.className = 'nav-extra';
        favorites.innerHTML = 'Избранное <b class="nav-fav-count" data-fav-count hidden>0</b>';
        nav.appendChild(favorites);
      }
      if (!header.querySelector('a[href="account.html"]')) {
        const account = document.createElement('a');
        account.href = 'account.html';
        account.className = 'nav-extra';
        account.textContent = 'Кабинет';
        nav.appendChild(account);
      }
    }

    const burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Открыть меню');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    const host = header.querySelector('.site-nav-actions') || header;
    host.appendChild(burger);

    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="nav-drawer-backdrop" data-drawer-close></div>
      <div class="nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Меню сайта">
        <div class="nav-drawer-top">
          <a class="nav-drawer-brand" href="index.html">РуСток</a>
          <button class="nav-drawer-close" type="button" aria-label="Закрыть меню" data-drawer-close>×</button>
        </div>
        <nav class="nav-drawer-links">${buildDrawerLinks(header)}</nav>
        <div class="nav-drawer-actions">
          <a class="nav-drawer-cta" href="pricing.html">Подписка от 900 ₽/мес</a>
          <a class="nav-drawer-cta nav-drawer-cta--ghost" href="business.html">Счёт и документы для юрлиц</a>
        </div>
        <p class="nav-drawer-note">Россия — в каждом кадре</p>
      </div>`;
    document.body.appendChild(drawer);

    const closeButton = drawer.querySelector('.nav-drawer-close');

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      closeButton.focus();
    }

    function closeDrawer() {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      burger.focus();
    }

    burger.addEventListener('click', openDrawer);
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('[data-drawer-close]')) closeDrawer();
      if (event.target.closest('.nav-drawer-links a')) closeDrawer();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDrawer();
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav]');
    if (!button) return;
    const type = button.dataset.favType;
    const id = button.dataset.favId;
    if (!type || !id) return;
    event.preventDefault();
    event.stopPropagation();
    const added = toggleFavorite(type, id);
    syncFavorites();
    toast(added ? 'Материал добавлен в избранное' : 'Материал убран из избранного');
    document.dispatchEvent(new CustomEvent('rustok:favorites', { detail: { type, id, added } }));
  });

  function init() {
    initNavigation();
    syncFavorites();
    hydrateImages();
    const observer = new MutationObserver(() => hydrateImages());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.rustokFavorites = {
    read: readFavorites,
    has: isFavorite,
    toggle: toggleFavorite,
    count: favoritesCount,
    clear() {
      writeFavorites([]);
      syncFavorites();
      document.dispatchEvent(new CustomEvent('rustok:favorites', { detail: { cleared: true } }));
    }
  };
  window.rustokToast = toast;
  window.rustokSyncFavorites = syncFavorites;
  window.rustokHydrateImages = hydrateImages;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
