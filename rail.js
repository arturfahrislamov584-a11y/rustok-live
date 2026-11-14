(() => {
  const rail = document.querySelector('#rail');
  if (!rail || typeof RUSTOK_DATA === 'undefined') return;

  const labels = { photo: 'Фото', video: 'Видео', audio: 'Звук', template: 'Шаблоны' };
  const items = [];
  Object.entries(RUSTOK_DATA).forEach(([type, group]) => {
    group.items.forEach((item) => items.push({ type, group, item }));
  });

  rail.innerHTML = items
    .map(
      ({ type, group, item }) => `<article class="page-card">
        <a class="page-card-link" href="asset.html?type=${type}&id=${encodeURIComponent(item.id)}">
          <img class="page-card-img" src="${item.url}" alt="${item.name}" loading="lazy" />
          <span class="page-card-type">${labels[type] || group.label}</span>
          <h3>${item.name}</h3>
          <p>${rustokMoney(group.prices.standard)} · ${item.city}</p>
          <span class="page-card-arrow" aria-hidden="true">↗</span>
        </a>
      </article>`
    )
    .join('');

  document.querySelectorAll('[data-rail]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = Number(button.dataset.rail) || 1;
      rail.scrollBy({ left: direction * 288, behavior: 'smooth' });
    });
  });
})();
