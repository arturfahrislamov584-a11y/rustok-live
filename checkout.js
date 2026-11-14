const params = new URLSearchParams(location.search);
const plan = rustokPlan(params.get('plan'));
const isPlan = Boolean(plan);
const form = document.querySelector('#order-form');
const layout = document.querySelector('#checkout-layout');
const success = document.querySelector('#order-success');
const emptyState = document.querySelector('#checkout-empty');

let cart = rustokReadCart();

const defaultSubtitle = 'Проверьте состав заказа и оставьте данные покупателя. В рабочей версии лицензии и файлы придут на почту сразу после оплаты.';

function typeLabel(type) {
  return RUSTOK_DATA[type]?.label || 'Материал';
}

function orderTotal() {
  return isPlan ? plan.price : cart.reduce((sum, entry) => sum + entry.price, 0);
}

function nextPaymentDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/\s*г\.$/, '');
}

function orderNumber() {
  return `РС-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function renderSummary() {
  if (isPlan) {
    layout.hidden = false;
    emptyState.hidden = true;
    success.hidden = true;

    document.querySelector('#summary-count').textContent = 'Подписка';
    document.querySelector('#summary-items').innerHTML = `<div class="plan-summary">
      <strong>${plan.name}</strong>
      <small>${plan.audience}</small>
      <ul>${plan.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
    </div>`;
    document.querySelector('#summary-subtotal-label').textContent = `Подписка ${plan.name}`;
    document.querySelector('#summary-subtotal').textContent = rustokMoney(plan.price);
    document.querySelector('#summary-total').textContent = rustokMoney(plan.price);
    document.querySelector('#summary-hint').textContent = `Следующее списание — ${nextPaymentDate()}. Отмена в личном кабинете.`;
    const add = document.querySelector('#summary-add');
    add.textContent = 'Сравнить тарифы →';
    add.href = 'pricing.html';

    document.querySelector('#checkout-subtitle').textContent = `Оформляете подписку ${plan.name}: ${
      plan.downloads ? `${plan.downloads} скачиваний в месяц` : 'неограниченные скачивания'
    }. Доступ откроется сразу после оплаты.`;
    document.title = `Подписка ${plan.name} — РуСток`;
    return;
  }

  document.querySelector('#checkout-subtitle').textContent = defaultSubtitle;
  document.querySelector('#summary-subtotal-label').textContent = 'Лицензии';
  document.querySelector('#summary-hint').textContent = 'НДС включён. Лицензия бессрочная, территория — весь мир.';
  const add = document.querySelector('#summary-add');
  add.textContent = 'Добавить ещё материал →';
  add.href = 'catalog.html?type=photo';

  if (!cart.length) {
    layout.hidden = true;
    success.hidden = true;
    emptyState.hidden = false;
    return;
  }

  layout.hidden = false;
  emptyState.hidden = true;
  success.hidden = true;

  document.querySelector('#summary-items').innerHTML = cart
    .map(
      (entry, index) => `<div class="order-item">
        <img src="${entry.url}" alt="" />
        <div><strong>${entry.name}</strong><small>${entry.license || 'Стандартная'} лицензия · ${typeLabel(entry.type)}</small></div>
        <b>${rustokMoney(entry.price)}</b>
        <button type="button" data-remove="${index}" aria-label="Удалить ${entry.name}">×</button>
      </div>`
    )
    .join('');

  document.querySelector('#summary-count').textContent = `${cart.length} поз.`;
  document.querySelector('#summary-subtotal').textContent = rustokMoney(orderTotal());
  document.querySelector('#summary-total').textContent = rustokMoney(orderTotal());
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('rustok-orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('rustok-orders', JSON.stringify(orders.slice(0, 20)));
}

function showSuccess(order) {
  document.querySelector('#order-number').textContent = order.number;
  document.querySelector('#success-total').textContent = rustokMoney(order.total);
  document.querySelector('#success-email').textContent = order.email;
  layout.hidden = true;
  emptyState.hidden = true;
  success.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelector('.pay-options').addEventListener('change', (event) => {
  if (event.target.name !== 'pay') return;
  document.querySelectorAll('.pay-option').forEach((option) => {
    option.classList.toggle('is-active', option.dataset.pay === event.target.value);
  });
});

document.querySelector('#summary-items').addEventListener('click', (event) => {
  const target = event.target.closest('[data-remove]');
  if (!target || isPlan) return;
  cart.splice(Number(target.dataset.remove), 1);
  rustokWriteCart(cart);
  renderSummary();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  const company = String(data.get('company') || '').trim();
  const pay = data.get('pay');

  if (isPlan) {
    const order = {
      number: orderNumber(),
      kind: 'subscription',
      plan: plan.id,
      planName: plan.name,
      period: 'month',
      downloads: plan.downloads,
      price: plan.price,
      total: plan.price,
      email,
      company,
      pay,
      createdAt: new Date().toISOString()
    };
    saveOrder(order);

    const renew = new Date();
    renew.setMonth(renew.getMonth() + 1);
    localStorage.setItem(
      'rustok-subscription',
      JSON.stringify({
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        downloads: plan.downloads,
        downloadsUsed: 0,
        startedAt: new Date().toISOString(),
        renewAt: renew.toISOString(),
        email,
        company
      })
    );
    localStorage.setItem('rustok-user', JSON.stringify({ email, company }));

    document.querySelector('#success-title').innerHTML = 'Подписка <em>активна.</em>';
    document.querySelector('#success-count-label').textContent = 'Скачиваний';
    document.querySelector('#success-count').textContent = plan.downloads ? String(plan.downloads) : 'Без лимита';
    const secondary = document.querySelector('#success-secondary');
    secondary.textContent = 'Открыть кабинет';
    secondary.href = 'account.html';
    showSuccess(order);
    return;
  }

  if (!cart.length) return;

  const order = {
    number: orderNumber(),
    kind: 'licenses',
    email,
    company,
    pay,
    total: orderTotal(),
    count: cart.length,
    createdAt: new Date().toISOString(),
    items: cart.map((entry) => ({
      id: entry.id,
      type: entry.type,
      name: entry.name,
      license: entry.license,
      price: entry.price
    }))
  };
  saveOrder(order);
  localStorage.setItem('rustok-user', JSON.stringify({ email, company }));

  document.querySelector('#success-title').innerHTML = 'Лицензии <em>в пути.</em>';
  document.querySelector('#success-count-label').textContent = 'Позиций';
  document.querySelector('#success-count').textContent = String(order.count);
  const secondary = document.querySelector('#success-secondary');
  secondary.textContent = 'Открыть студию автора';
  secondary.href = 'author.html';

  cart = [];
  rustokWriteCart(cart);
  showSuccess(order);
});

renderSummary();
