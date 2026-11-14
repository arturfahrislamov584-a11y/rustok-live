const dialog = document.querySelector('#upload-dialog');
const grid = document.querySelector('#work-grid');
const count = document.querySelector('#review-count');
const tabs = [...document.querySelectorAll('.tabs button')];
let filter = 'all';

function applyFilter() {
  [...grid.querySelectorAll('.work-card')].forEach((card) => {
    const status = card.querySelector('.status');
    const live = status ? status.classList.contains('live') : false;
    const review = status ? status.classList.contains('review') : false;
    card.hidden = filter === 'live' ? !live : filter === 'review' ? !review : false;
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.toggle('active', item === tab));
    filter = tab.dataset.filter || 'all';
    applyFilter();
  });
});

document.querySelector('#open-upload').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-upload').addEventListener('click', () => dialog.close());

document.querySelector('#file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  document.querySelector('.drop-zone b').textContent = file.name;
  document.querySelector('.drop-zone span').textContent = 'Файл выбран и готов к отправке';
});

document.querySelector('#submit-upload').addEventListener('click', () => {
  const title = document.querySelector('#upload-title').value.trim() || 'Новая работа';
  const file = document.querySelector('#file-input').files[0];
  if (!file) {
    document.querySelector('.drop-zone span').textContent = 'Сначала выберите файл';
    return;
  }

  const url = URL.createObjectURL(file);
  grid.insertAdjacentHTML(
    'afterbegin',
    `<article class="work-card">
      <img src="${url}" alt="${title}" />
      <div><span class="status review">На модерации</span><h3>${title}</h3><small>Мы сообщим, когда работа появится в каталоге</small></div>
    </article>`
  );
  count.textContent = Number(count.textContent) + 1;
  dialog.close();
  document.querySelector('#upload-title').value = '';
  document.querySelector('#file-input').value = '';
  document.querySelector('.drop-zone b').textContent = 'Выберите файл';
  document.querySelector('.drop-zone span').textContent = 'Фото или видео до 2 ГБ';
  applyFilter();
  window.rustokToast?.('Работа отправлена на модерацию');
});

document.querySelector('#payout-request')?.addEventListener('click', () => {
  const button = document.querySelector('#payout-request');
  button.disabled = true;
  button.innerHTML = 'Заявка отправлена <span>✓</span>';
  window.rustokToast?.('Заявка на выплату 24 860 ₽ отправлена (демо)', 'good');
  window.setTimeout(() => {
    button.disabled = false;
    button.innerHTML = 'Вывести средства <span>↗</span>';
  }, 2400);
});

applyFilter();
