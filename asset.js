const params = new URLSearchParams(location.search);
const type = params.get('type') || 'photo';
const assetId = params.get('id') || '';
const found = rustokAsset(type, assetId);

const main = document.querySelector('#asset-main');
const relatedSection = document.querySelector('#related');
const notFound = document.querySelector('#not-found');
let selectedLicense = 'standard';
let cart = rustokReadCart();

function money(value) {
  return rustokMoney(value);
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function titleMarkup(name) {
  const words = name.split(' ');
  const last = words.pop();
  const head = words.length ? `${words.join(' ')} ` : '';
  return `${head}<em>${last}</em>`;
}

function renderAsset() {
  const { group, item } = found;
  document.title = `${item.name} — РуСток`;
  document.querySelector('#crumb-type').textContent = group.label;
  document.querySelector('#crumb-type').href = `catalog.html?type=${type}`;
  document.querySelector('#crumb-name').textContent = item.name;
  document.querySelector('#related-all').href = `catalog.html?type=${type}`;

  const image = document.querySelector('#preview-image');
  image.src = item.url;
  image.alt = item.name;
  document.querySelector('#preview-caption').innerHTML = `<span>${group.label} · ${item.city}</span><span>РуСток / ${String(group.items.indexOf(item) + 1).padStart(2, '0')}</span>`;

  document.querySelector('#asset-eyebrow').textContent = `${group.label} · ${item.city}`;
  document.querySelector('#asset-title').innerHTML = titleMarkup(item.name);
  document.querySelector('#author-avatar').textContent = initials(item.author);
  document.querySelector('#author-name').textContent = item.author;
  document.querySelector('#author-city').textContent = `Автор · ${item.city}`;
  document.querySelector('#asset-about').textContent = item.about;

  const favButton = document.querySelector('#fav-asset');
  if (favButton) {
    favButton.dataset.favType = type;
    favButton.dataset.favId = item.id;
  }

  const options = document.querySelector('#license-options');
  options.innerHTML = Object.values(RUSTOK_LICENSES)
    .map(
      (license) => `<label class="license-option" data-license="${license.id}">
        <input type="radio" name="license" value="${license.id}" ${license.id === selectedLicense ? 'checked' : ''} />
        <span class="license-mark" aria-hidden="true"></span>
        <span class="license-copy"><b>${license.name}</b><small>${license.short}</small></span>
        <strong>${money(rustokPrice(type, license.id))}</strong>
      </label>`
    )
    .join('');

  options.addEventListener('change', (event) => {
    if (event.target.name === 'license') setLicense(event.target.value);
  });

  document.querySelector('#meta-list').innerHTML = [
    ['Тип материала', group.label],
    ['Формат', item.meta],
    ['Ориентация', item.orientation],
    ['Город', item.city],
    ['Релизы', item.releases],
    ['Лицензия', `<span id="meta-license">${RUSTOK_LICENSES[selectedLicense].name}</span>`]
  ]
    .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
    .join('');

  setLicense(selectedLicense);
  renderRelated(group, item);
}

function setLicense(licenseId) {
  selectedLicense = licenseId;
  document.querySelectorAll('.license-option').forEach((option) => {
    const active = option.dataset.license === licenseId;
    option.classList.toggle('is-active', active);
    const input = option.querySelector('input');
    if (input) input.checked = active;
  });
  document.querySelector('#asset-price').textContent = money(rustokPrice(type, licenseId));
  document.querySelector('#license-note').textContent = RUSTOK_LICENSES[licenseId].terms;
  const metaLicense = document.querySelector('#meta-license');
  if (metaLicense) metaLicense.textContent = RUSTOK_LICENSES[licenseId].name;
}

function renderRelated(group, item) {
  const siblings = group.items.filter((entry) => entry.id !== item.id).slice(0, 3);
  relatedSection.hidden = siblings.length === 0;
  const grid = document.querySelector('#related-grid');
  grid.innerHTML = siblings
    .map(
      (entry) => `<a class="related-card" href="asset.html?type=${type}&id=${encodeURIComponent(entry.id)}">
        <img src="${entry.url}" alt="${entry.name}" data-skeleton loading="lazy" />
        <span>${group.label} · ${entry.city}</span>
        <strong>${entry.name}</strong>
        <small>${money(rustokPrice(type, 'standard'))} · ${entry.author}</small>
      </a>`
    )
    .join('');
}

function renderCart() {
  const count = document.querySelector('#cart-count');
  count.textContent = cart.length;
  document.querySelector('#cart-total').textContent = money(cart.reduce((sum, entry) => sum + entry.price, 0));
  const items = document.querySelector('#cart-items');
  items.innerHTML = cart.length
    ? cart
        .map(
          (entry, index) => `<div class="cart-item">
            <img src="${entry.url}" alt="" />
            <span>${entry.name}<small>${entry.license || 'Стандартная'} лицензия</small><b>${money(entry.price)}</b></span>
            <button type="button" data-remove="${index}" aria-label="Удалить ${entry.name}">×</button>
          </div>`
        )
        .join('')
    : '<p class="empty">Пока пусто. Добавьте материал из каталога.</p>';
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

function addToCart() {
  if (!found) return;
  const already = cart.some((entry) => entry.id === found.item.id && entry.licenseId === selectedLicense);
  const button = document.querySelector('#add-to-cart');
  if (already) {
    openCart();
    return;
  }
  cart.push({
    id: found.item.id,
    type,
    name: found.item.name,
    url: found.item.url,
    price: rustokPrice(type, selectedLicense),
    license: RUSTOK_LICENSES[selectedLicense].name,
    licenseId: selectedLicense
  });
  renderCart();
  openCart();
  const original = button.innerHTML;
  button.innerHTML = 'Добавлено <span>✓</span>';
  window.setTimeout(() => {
    button.innerHTML = original;
  }, 1600);
}

document.querySelector('.bar').insertAdjacentHTML(
  'beforeend',
  '<button class="cart-button" id="cart-button" type="button">Корзина <b id="cart-count">0</b></button>'
);

if (!found) {
  main.hidden = true;
  relatedSection.hidden = true;
  notFound.hidden = false;
  document.title = 'Материал не найден — РуСток';
} else {
  renderAsset();
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
document.querySelector('#add-to-cart').addEventListener('click', addToCart);
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

const lightbox = document.querySelector('#lightbox');

if (found && lightbox) {
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxTitle = document.querySelector('#lightbox-title');
  const lightboxEyebrow = document.querySelector('#lightbox-eyebrow');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const lightboxCounter = document.querySelector('#lightbox-counter');
  const lightboxPrice = document.querySelector('#lightbox-price');
  const lightboxFigure = document.querySelector('#lightbox-figure');
  const lightboxZoom = document.querySelector('#lightbox-zoom');
  const gallery = found.group.items;
  let lightboxIndex = Math.max(0, gallery.indexOf(found.item));
  let lastFocus = null;

  function syncLightboxPrice() {
    lightboxPrice.textContent = `${RUSTOK_LICENSES[selectedLicense].name} · ${money(rustokPrice(type, selectedLicense))}`;
  }

  function updateLightbox() {
    const item = gallery[lightboxIndex];
    lightboxImage.src = item.url;
    lightboxImage.alt = item.name;
    lightboxTitle.textContent = item.name;
    lightboxEyebrow.textContent = `${found.group.label} · ${item.city}`;
    lightboxCaption.textContent = `${item.author} · ${item.meta}`;
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${gallery.length}`;
    lightboxFigure.classList.remove('is-zoomed');
    lightboxZoom.textContent = 'Увеличить';
    syncLightboxPrice();
  }

  function openLightbox() {
    lastFocus = document.activeElement;
    lightboxIndex = Math.max(0, gallery.indexOf(found.item));
    updateLightbox();
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    document.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('is-locked');
    lightboxFigure.classList.remove('is-zoomed');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function stepLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + gallery.length) % gallery.length;
    updateLightbox();
  }

  function toggleZoom() {
    const zoomed = lightboxFigure.classList.toggle('is-zoomed');
    lightboxZoom.textContent = zoomed ? 'Уменьшить' : 'Увеличить';
  }

  document.querySelector('#open-lightbox')?.addEventListener('click', openLightbox);
  document.querySelectorAll('[data-lightbox-close]').forEach((element) => element.addEventListener('click', closeLightbox));
  document.querySelector('#lightbox-prev')?.addEventListener('click', () => stepLightbox(-1));
  document.querySelector('#lightbox-next')?.addEventListener('click', () => stepLightbox(1));
  lightboxZoom.addEventListener('click', toggleZoom);
  lightboxImage.addEventListener('click', toggleZoom);
  document.querySelector('#lightbox-license')?.addEventListener('click', () => {
    closeLightbox();
    const block = document.querySelector('.license-block');
    block?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    block?.querySelector('input')?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });
}