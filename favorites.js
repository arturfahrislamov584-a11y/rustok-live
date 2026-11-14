(() => {
  const grid = document.querySelector('#favorites-grid');
  const empty = document.querySelector('#favorites-empty');
  const toolbar = document.querySelector('#fav-toolbar');
  const total = document.querySelector('#favorites-total');
  const download = document.querySelector('#fav-download');
  const clear = document.querySelector('#fav-clear');
  const labels = { photo: 'Фото', video: 'Видео', audio: 'Звук', template: 'Шаблон' };

  function entries() {
    const stored = window.rustokFavorites?.read() || [];
    const seen = new Set();
    const result = [];
    stored.forEach(({ type, id }) => {
      const key = `${type}:${id}`;
      if (seen.has(key)) return;
      const group = RUSTOK_DATA[type];
      const item = group?.items.find((entry) => entry.id === id);
      if (!item) return;
      seen.add(key);
      result.push({ type, group, item });
    });
    return result;
  }

  function render() {
    const items = entries();
    const has = items.length > 0;
    total.textContent = String(items.length);
    grid.hidden = !has;
    toolbar.hidden = !has;
    empty.hidden = has;

    if (!has) {
      grid.innerHTML = '';
      return;
    }

    grid.innerHTML = items
      .map(({ type, group, item }) => {
        const href = `asset.html?type=${type}&id=${encodeURIComponent(item.id)}`;
        return `<article class="fav-card">
          <a class="fav-card-link" href="${href}">
            <span class="fav-card-media"><img src="${item.url}" alt="${item.name}" data-skeleton /></span>
            <span class="fav-card-copy">
              <span class="eyebrow">${labels[type] || group.label} · ${item.city}</span>
              <strong>${item.name}</strong>
              <small>${item.author} · ${rustokMoney(group.prices.standard)}</small>
            </span>
          </a>
          <div class="fav-card-actions">
            <a class="fav-open" href="${href}">Выбрать лицензию →</a>
            <button class="heart is-active" type="button" data-fav data-fav-type="${type}" data-fav-id="${item.id}" aria-label="Убрать из избранного" aria-pressed="true">♥</button>
          </div>
        </article>`;
      })
      .join('');

    window.rustokHydrateImages?.(grid);
  }

  download.addEventListener('click', () => {
    const items = entries();
    if (!items.length) return;
    const rows = items.map(({ type, group, item }, index) => {
      const typeLabel = labels[type] || group.label;
      return `${index + 1}. ${item.name} — ${typeLabel}, ${item.city}, автор ${item.author}.\n   ${location.origin}/asset.html?type=${type}&id=${item.id}`;
    });
    const blob = new Blob([`Подборка РуСток\n\n${rows.join('\n\n')}\n`], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rustok-izbrannoe.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    window.rustokToast?.('Подборка сохранена', 'good');
  });

  clear.addEventListener('click', () => {
    if (!entries().length) return;
    if (!window.confirm('Очистить подборку?')) return;
    window.rustokFavorites.clear();
    window.rustokToast?.('Подборка очищена');
  });

  document.addEventListener('rustok:favorites', render);
  render();
})();
