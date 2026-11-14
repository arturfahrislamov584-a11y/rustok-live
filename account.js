(() => {
  const SUB_KEY = 'rustok-subscription';
  const USER_KEY = 'rustok-user';
  const ORDER_KEY = 'rustok-orders';

  const $ = (selector) => document.querySelector(selector);

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  function money(value) {
    return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
  }

  function dateLabel(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/\s*г\.$/, '');
  }

  function planFor(sub) {
    const plan = RUSTOK_PLANS[sub?.planId];
    if (plan) return plan;
    return {
      name: sub?.planName || 'Start',
      price: sub?.price || 900,
      priceLabel: `${money(sub?.price || 900)}/мес`,
      audience: 'Подписка РуСток',
      downloads: sub?.downloads ?? 100,
      features: []
    };
  }

  function renderPayments(orders) {
    $('#payments-count').textContent = String(orders.length);
    if (!orders.length) {
      $('#payments').innerHTML = '<p class="panel-empty">Платежей пока нет. Оформите подписку или лицензию — операции появятся здесь.</p>';
      return;
    }
    $('#payments').innerHTML = orders
      .slice(0, 10)
      .map((order) => {
        const title =
          order.kind === 'subscription'
            ? `Подписка ${order.planName || 'РуСток'}`
            : `Лицензии · ${order.count || 1} поз.`;
        return `<div class="payment-row">
          <div class="payment-copy"><strong>${title}</strong><small>${dateLabel(order.createdAt)} · ${order.number || '—'}</small></div>
          <b>${money(order.total)}</b>
          <span class="payment-status">Демо</span>
        </div>`;
      })
      .join('');
  }

  function render() {
    const sub = readJSON(SUB_KEY, null);
    const user = readJSON(USER_KEY, {}) || {};
    const orders = readJSON(ORDER_KEY, []);
    const plan = sub ? planFor(sub) : null;

    $('#account-email').textContent = sub?.email || user.email || 'Гость';
    $('#account-company').textContent = sub?.company || user.company || 'Без компании';

    $('#account-empty').hidden = Boolean(sub);
    $('#account-active').hidden = !sub;

    if (sub) {
      const used = Math.max(0, Number(sub.downloadsUsed || 0));
      const limit = plan.downloads;
      const unlimited = limit === null || limit === undefined;
      $('#plan-name').textContent = plan.name;
      $('#plan-price').textContent = plan.priceLabel || `${money(plan.price)}/мес`;
      $('#plan-audience').textContent = plan.audience || '';
      $('#plan-features').innerHTML = (plan.features || []).map((feature) => `<li>${feature}</li>`).join('');
      $('#plan-usage').textContent = unlimited ? 'Без лимита' : `${used} из ${limit}`;
      $('#plan-progress').style.width = unlimited ? '100%' : `${Math.min(100, Math.round((used / limit) * 100))}%`;
      $('#plan-progress').classList.toggle('is-unlimited', unlimited);
      $('#plan-renew').textContent = dateLabel(sub.renewAt);
      $('#plan-cost').textContent = plan.priceLabel || `${money(plan.price)}/мес`;
      $('#plan-left').textContent = unlimited ? 'Без лимита' : `${Math.max(0, limit - used)} скачиваний`;
    }

    renderPayments(orders);
  }

  document.querySelectorAll('.doc-download').forEach((button) => {
    button.addEventListener('click', () => {
      window.rustokToast?.(`«${button.dataset.doc}» сформирован (демо)`, 'good');
    });
  });

  $('#activate-demo').addEventListener('click', () => {
    const start = new Date();
    const renew = new Date(start);
    renew.setMonth(renew.getMonth() + 1);
    const plan = RUSTOK_PLANS.start;
    const demo = {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      downloads: plan.downloads,
      downloadsUsed: 12,
      startedAt: start.toISOString(),
      renewAt: renew.toISOString(),
      email: 'demo@rustok.ru',
      company: 'Демо-компания'
    };
    localStorage.setItem(SUB_KEY, JSON.stringify(demo));
    localStorage.setItem(USER_KEY, JSON.stringify({ email: demo.email, company: demo.company }));
    window.rustokToast?.('Демо-подписка активирована', 'good');
    render();
  });

  $('#cancel-subscription').addEventListener('click', () => {
    if (!window.confirm('Отменить подписку? Доступ закроется сразу — это демо-режим.')) return;
    localStorage.removeItem(SUB_KEY);
    window.rustokToast?.('Подписка отменена (демо)');
    render();
  });

  render();
})();
