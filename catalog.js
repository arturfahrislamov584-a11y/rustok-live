const params = new URLSearchParams(location.search);
const type = RUSTOK_DATA[params.get('type')] ? params.get('type') : 'photo';
const query = (params.get('q') || '').trim();
const queryLower = query.toLowerCase();
const group = RUSTOK_DATA[type];
const assets = group.items.filter((item) => {
  if (!queryLower) return true;
  return `${item.name} ${item.city} ${item.region || ""} ${item.author} ${item.about} ${item.meta}`.toLowerCase().includes(queryLower);
});

const title = document.querySelector('#catalog-title');
title.textContent = '';
title.append(query ? 'Ищем ' : `${group.title} `);
const titleAccent = document.createElement('em');
titleAccent.textContent = query ? `«${query}»` : 'Рустока.';
title.append(titleAccent);
document.title = `${group.label} — РуСток`;
document.querySelector('#catalog-query').value = query;
document.querySelector(`[data-type="${type}"]`)?.classList.add('is-active');

const grid = document.querySelector('#asset-grid');
grid.innerHTML = assets.length
  ? assets
      .map((item, index) => {
        const label = type === 'photo' ? 'ЛИЦЕНЗИЯ РУСТОК' : item.meta.toUpperCase();
        return `<article class="asset">
          <a class="asset-link" href="asset.html?type=${type}&id=${encodeURIComponent(item.id)}">
            <img src="${item.url}" alt="${item.name}" data-skeleton${index > 3 ? ' loading="lazy"' : ''} />
            <span class="sub-badge">В подписке</span>
            <strong>${item.name}</strong>
            <small>${label}</small>
          </a>
          <div class="asset-bottom"><b>${rustokMoney(group.prices.standard)}</b><button class="heart" type="button" data-fav data-fav-type="${type}" data-fav-id="${item.id}" aria-label="В избранное" aria-pressed="false">♡</button></div>
        </article>`;
      })
      .join('')
  : '<p class="empty">Ничего не нашли. Попробуйте другой запрос.</p>';

let cart = rustokReadCart();

function renderCart() {
  document.querySelector('#cart-count').textContent = cart.length;
  document.querySelector('#cart-total').textContent = rustokMoney(cart.reduce((sum, entry) => sum + entry.price, 0));
  document.querySelector('#cart-items').innerHTML = cart.length
    ? cart
        .map(
          (entry, index) => `<div class="cart-item">
            <img src="${entry.url}" alt="" />
            <span>${entry.name}<small>${entry.license || 'Стандартная'} лицензия</small><b>${rustokMoney(entry.price)}</b></span>
            <button type="button" data-remove="${index}" aria-label="Удалить ${entry.name}">×</button>
          </div>`
        )
        .join('')
    : '<p class="empty">Пока пусто. Откройте материал и выберите лицензию.</p>';
  rustokWriteCart(cart);
}

function openCart() {
  document.querySelector('#cart-panel').classList.add('is-open');
  document.querySelector('#cart-backdrop').classList.add('is-open');
}

function closeCart() {
  document.querySelector('#cart-panel').classList.remove('is-open');
  document.querySelector('#cart-backdrop').classList.remove('is-open');
}

document.querySelector('#cart-button').addEventListener('click', openCart);
document.querySelector('#cart-close').addEventListener('click', closeCart);
document.querySelector('#cart-backdrop').addEventListener('click', closeCart);
document.querySelector('#cart-items').addEventListener('click', (event) => {
  const target = event.target.closest('[data-remove]');
  if (!target) return;
  cart.splice(Number(target.dataset.remove), 1);
  renderCart();
});

document.querySelector('#catalog-search').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.querySelector('#catalog-query').value.trim();
  location.href = value ? `?type=${type}&q=${encodeURIComponent(value)}` : `?type=${type}`;
});

document.querySelector('#checkout').addEventListener('click', (event) => {
  if (cart.length) {
    location.href = 'checkout.html';
    return;
  }
  const button = event.currentTarget;
  const original = button.textContent;
  button.textContent = 'Корзина пуста';
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCart();
});

renderCart();
