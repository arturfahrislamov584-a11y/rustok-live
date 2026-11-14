(() => {
  const form = document.querySelector('#b2b-form');
  const success = document.querySelector('#b2b-success');
  const number = document.querySelector('#b2b-number');
  const reset = document.querySelector('#b2b-reset');
  const scrollButton = document.querySelector('#request-scroll');
  const section = document.querySelector('#contract');
  const nameInput = form?.querySelector('[name="name"]');
  const KEY = 'rustok-b2b-requests';

  function requestNumber() {
    return `B2B-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  scrollButton?.addEventListener('click', () => {
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => nameInput?.focus({ preventScroll: true }), 380);
  });

  document.querySelector('#request-requisites')?.addEventListener('click', () => {
    window.rustokToast?.('Карточка компании и реквизиты отправлены (демо)', 'good');
  });

  document.querySelectorAll('.doc-download').forEach((button) => {
    button.addEventListener('click', () => {
      window.rustokToast?.(`«${button.dataset.doc}» сформирован (демо)`, 'good');
    });
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const request = {
      number: requestNumber(),
      name: String(data.get('name') || '').trim(),
      company: String(data.get('company') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      comment: String(data.get('comment') || '').trim(),
      createdAt: new Date().toISOString()
    };
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      list.unshift(request);
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
    } catch (error) {
      /* приватный режим */
    }
    if (number) number.textContent = request.number;
    form.hidden = true;
    if (success) success.hidden = false;
    window.rustokToast?.('Заявка отправлена — ответим в течение дня', 'good');
  });

  reset?.addEventListener('click', () => {
    form?.reset();
    if (form) form.hidden = false;
    if (success) success.hidden = true;
    nameInput?.focus();
  });
})();
