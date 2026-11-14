(() => {
  const section = document.querySelector('#atlas');
  if (!section) return;

  const map = section.querySelector('#atlas-map');
  const select = section.querySelector('#atlas-select');
  const nameNode = section.querySelector('#atlas-region-name');
  const metaNode = section.querySelector('#atlas-region-meta');
  const itemsNode = section.querySelector('#atlas-region-items');
  const photoFigure = section.querySelector('#atlas-region-photo');
  const photoImage = section.querySelector('#atlas-region-photo-img');
  const photoLink = section.querySelector('#atlas-region-photo-link');
  const photoCaption = section.querySelector('#atlas-region-photo-caption');
  const searchInput = section.querySelector('#atlas-search');
  const regionOptions = section.querySelector('#atlas-region-options');
  const shareButton = section.querySelector('#atlas-share');
  let photos = {};
  let regions = [];
  const labels = { photo: 'Фото', video: 'Видео', audio: 'Звук', template: 'Шаблон' };
  const cityRegion = {
    'Москва': 'Москва',
    'Санкт-Петербург': 'Санкт-Петербург',
    'Казань': 'Татарстан',
    'Алтай': 'Алтай',
    'Владивосток': 'Приморский край',
    'Екатеринбург': 'Свердловская область'
  };

  if (!map || !select || !nameNode || !metaNode || !itemsNode) return;

  function itemRegion(item) {
    return item.region || cityRegion[item.city] || '';
  }

  function regionItems(name) {
    const result = [];
    Object.entries(RUSTOK_DATA).forEach(([type, group]) => {
      group.items.forEach((item) => {
        if (itemRegion(item) === name) result.push({ type, group, item });
      });
    });
    return result;
  }

  function materialsLabel(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'материал';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'материала';
    return 'материалов';
  }

  function renderItems(name) {
    const items = regionItems(name);
    nameNode.textContent = name;
    metaNode.textContent = items.length
      ? `${items.length} ${materialsLabel(items.length)} в каталоге`
      : 'Материалов пока нет — регион собирается вместе с авторами.';

    const photo = photos[name];
    if (photoFigure && photoImage && photo?.file) {
      photoImage.src = `assets/regions/${photo.file}`;
      photoImage.alt = `Фото региона ${name}`;
      photoLink.href = photo.page || 'https://ru.wikipedia.org/';
      if (photoCaption) photoCaption.textContent = photo.title ? `Фото · ${photo.title}` : 'Фото региона';
      photoFigure.hidden = false;
    } else if (photoFigure) {
      photoFigure.hidden = true;
    }

    if (items.length) {
      const cards = items.slice(0, 4).map(({ type, group, item }) => {
        const href = `asset.html?type=${type}&id=${encodeURIComponent(item.id)}`;
        return `<a class="atlas-item" href="${href}">
          <img src="${item.url}" alt="${item.name}" data-skeleton />
          <span><strong>${item.name}</strong><small>${labels[type] || group.label} · ${item.city}</small></span>
        </a>`;
      });
      const more = items.length > 4
        ? `<a class="atlas-all" href="catalog.html?type=${items.some((entry) => entry.type === 'photo') ? 'photo' : items[0].type}&q=${encodeURIComponent(name)}">Смотреть в каталоге →</a>`
        : '';
      itemsNode.innerHTML = cards.join('') + more;
      itemsNode.querySelectorAll('.atlas-item img').forEach((image) => {
        image.addEventListener('error', () => image.closest('.atlas-item')?.remove(), { once: true });
      });
    } else {
      itemsNode.innerHTML = `<div class="atlas-empty">В этом регионе пока нет работ. <a href="author.html">Стать автором →</a></div>`;
    }

    select.value = name;
    if (searchInput) searchInput.value = name;
    map.querySelectorAll('.region.is-active').forEach((region) => {
      region.classList.remove('is-active');
      region.setAttribute('aria-pressed', 'false');
    });
    const target = [...map.querySelectorAll('.region')].find((region) => region.dataset.region === name);
    if (target) {
      target.classList.add('is-active');
      target.setAttribute('aria-pressed', 'true');
    }
  }

  function updateHash(name) {
    const hash = `#region=${encodeURIComponent(name)}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
  }

  function selectRegion(name, syncUrl = true) {
    if (!name) return;
    renderItems(name);
    if (syncUrl) updateHash(name);
  }

  async function init() {
    try {
      const [names, svgText, photoData] = await Promise.all([
        fetch('regions-ru.json').then((response) => {
          if (!response.ok) throw new Error('regions');
          return response.json();
        }),
        fetch('assets/russia-map.svg').then((response) => {
          if (!response.ok) throw new Error('map');
          return response.text();
        }),
        fetch('region-photos.json?v=2')
          .then((response) => (response.ok ? response.json() : {}))
          .catch(() => ({}))
      ]);

      photos = photoData || {};

      regions = Object.entries(names)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

      select.innerHTML = regions
        .map(({ name }) => {
          const count = regionItems(name).length;
          return `<option value="${name}">${name}${count ? ` · ${count}` : ''}</option>`;
        })
        .join('');

      const documentSvg = new DOMParser().parseFromString(svgText, 'image/svg+xml');
      if (documentSvg.querySelector('parsererror')) throw new Error('svg');
      map.replaceChildren(document.importNode(documentSvg.documentElement, true));

      map.querySelectorAll('g.region').forEach((group) => {
        const codeClass = [...group.classList].find((className) => className.startsWith('RU-'));
        const code = codeClass ? codeClass.slice(3) : '';
        const name = names[code];
        if (!name) return;
        const count = regionItems(name).length;
        group.dataset.region = name;
        group.setAttribute('role', 'button');
        group.setAttribute('tabindex', '0');
        group.setAttribute('aria-label', count ? `${name}, ${count} материалов` : `${name}, материалов пока нет`);
        group.setAttribute('aria-pressed', 'false');
        if (count) group.classList.add('has-items');

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = count ? `${name} — ${count} ${materialsLabel(count)}` : `${name} — скоро`;
        group.appendChild(title);

        group.addEventListener('click', () => selectRegion(name));
        group.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectRegion(name);
          }
        });
      });

      select.addEventListener('change', () => selectRegion(select.value));

      if (regionOptions) {
        regionOptions.innerHTML = regions.map(({ name }) => `<option value="${name}"></option>`).join('');
      }

      function findRegion(value) {
        const query = value.trim().toLowerCase();
        if (!query) return null;
        return (
          regions.find((region) => region.name.toLowerCase() === query) ||
          regions.find((region) => region.name.toLowerCase().startsWith(query)) ||
          regions.find((region) => region.name.toLowerCase().includes(query))
        );
      }

      function applySearch() {
        const region = findRegion(searchInput.value);
        if (region) {
          selectRegion(region.name);
          searchInput.value = region.name;
        } else {
          window.rustokToast?.('Регион не найден', 'warn');
        }
      }

      if (searchInput) {
        searchInput.addEventListener('change', applySearch);
        searchInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            applySearch();
          }
        });
      }

      if (shareButton) {
        shareButton.addEventListener('click', async () => {
          const url = `${location.origin}${location.pathname}#region=${encodeURIComponent(nameNode.textContent)}`;
          try {
            await navigator.clipboard.writeText(url);
            window.rustokToast?.('Ссылка на регион скопирована', 'good');
          } catch (error) {
            window.prompt('Скопируйте ссылку на регион', url);
          }
        });
      }

      const hashMatch = location.hash.match(/^#region=(.+)$/);
      const hashName = hashMatch ? decodeURIComponent(hashMatch[1]) : '';
      const initial =
        regions.find((region) => region.name === hashName) ||
        regions.find((region) => region.name === 'Москва') ||
        regions.find((region) => regionItems(region.name).length) ||
        regions[0];
      selectRegion(initial.name, false);
      if (hashName) section.scrollIntoView({ behavior: 'auto', block: 'start' });

      window.addEventListener('hashchange', () => {
        const match = location.hash.match(/^#region=(.+)$/);
        if (!match) return;
        const name = decodeURIComponent(match[1]);
        if (regions.some((region) => region.name === name)) {
          selectRegion(name, false);
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } catch (error) {
      map.innerHTML = '<div class="atlas-map-error">Схема не загрузилась. Выберите регион в списке справа.</div>';
    }
  }

  init();
})();
