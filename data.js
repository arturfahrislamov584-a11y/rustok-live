const RUSTOK_LICENSES = {
  standard: {
    id: 'standard',
    name: 'Стандартная',
    short: 'Цифровые проекты',
    terms: 'Соцсети, сайты, презентации и digital-реклама. До 500 000 показов, без мерча и наружных носителей.'
  },
  extended: {
    id: 'extended',
    name: 'Расширенная',
    short: 'Реклама и мерч',
    terms: 'Реклама, наружные носители, мерч и печать без ограничения тиража. Перепродажа материала запрещена.'
  }
};

const RUSTOK_DATA = {
  photo: {
    label: 'Фото',
    title: 'Фотографии',
    prices: { standard: 690, extended: 2490 },
    items: [
      {
        id: 'kremlin-embankment',
        name: 'Кремлёвская набережная',
        url: 'https://www.fantasyway.ru/images/jatoms/tours/9822-steny-i-bashni-kremlya/fd7e0ad18b744bdf8df80e479d2ca982.jpeg',
        author: 'Илья Ветров',
        city: 'Москва',
        region: 'Москва',
        meta: '4480 × 6720 · JPG',
        orientation: 'Вертикально',
        releases: 'Есть имущественный релиз',
        about: 'Рассвет над Москвой-рекой: кремлёвские стены, пустой мост и вода без ряби. Кадр для обложек, travel-проектов и городских подборок.'
      },
      {
        id: 'summer-evening',
        name: 'Летний вечер',
        url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
        author: 'Полина Гай',
        city: 'Алтай',
        region: 'Алтай',
        meta: '6000 × 4000 · JPG',
        orientation: 'Горизонтально',
        releases: 'Релиз не требуется',
        about: 'Тёплый свет на склоне, трава и мягкая дымка перед закатом. Универсальный фон для лендингов и презентаций.'
      },
      {
        id: 'honest-portrait',
        name: 'Честный портрет',
        url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85',
        author: 'Лера Соколова',
        city: 'Екатеринбург',
        region: 'Свердловская область',
        meta: '4000 × 6000 · JPG',
        orientation: 'Вертикально',
        releases: 'Есть модельный и имущественный релизы',
        about: 'Портрет без постановочной глянцевости: естественный свет, спокойная мимика, место для текста справа.'
      },
      {
        id: 'city-after-rain',
        name: 'Город после дождя',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
        author: 'Артём Мельник',
        city: 'Санкт-Петербург',
        region: 'Санкт-Петербург',
        meta: '5472 × 3648 · JPG',
        orientation: 'Горизонтально',
        releases: 'Релиз не требуется',
        about: 'Мокрый асфальт, отражения витрин и низкое небо. Подходит для урбанистических серий и обложек подкастов.'
      }
    ]
  },
  video: {
    label: 'Видео',
    title: 'Видео',
    prices: { standard: 890, extended: 3990 },
    items: [
      {
        id: 'city-rhythm',
        name: 'Ритм города',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
        author: 'Артём Мельник',
        city: 'Санкт-Петербург',
        region: 'Санкт-Петербург',
        meta: '00:18 · 4K · 25 fps',
        orientation: 'Горизонтально',
        releases: 'Релиз не требуется',
        about: 'Панорама вдоль набережной: машины, свет фар и отражения в воде. Черновой цвет уже приведён к нейтральному.'
      },
      {
        id: 'movement',
        name: 'Движение',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85',
        author: 'Ника Орлова',
        city: 'Москва',
        region: 'Москва',
        meta: '00:12 · 4K · 50 fps',
        orientation: 'Вертикально',
        releases: 'Есть модельный релиз',
        about: 'Пластика тела в контровом свете, замедление на 50%. Материал для Reels, обложек треков и афиш.'
      },
      {
        id: 'field',
        name: 'Поле',
        url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85',
        author: 'Полина Гай',
        city: 'Алтай',
        region: 'Алтай',
        meta: '00:24 · 4K · 25 fps',
        orientation: 'Горизонтально',
        releases: 'Релиз не требуется',
        about: 'Длинный проезд по грунтовой дороге среди трав. Естественный свет, минимум движения в кадре.'
      },
      {
        id: 'workshop',
        name: 'Мастерская',
        url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85',
        author: 'Илья Ветров',
        city: 'Казань',
        region: 'Татарстан',
        meta: '00:16 · 4K · 25 fps',
        orientation: 'Горизонтально',
        releases: 'Есть модельный релиз',
        about: 'Руки за работой: дерево, инструмент, пыль в луче света. Подходит для производственных и ремесленных сюжетов.'
      }
    ]
  },
  audio: {
    label: 'Звук',
    title: 'Звук',
    prices: { standard: 190, extended: 890 },
    items: [
      {
        id: 'morning-city',
        name: 'Утренний город',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85',
        author: 'Степан Крылов',
        city: 'Москва',
        region: 'Москва',
        meta: '02:14 · WAV 48 кГц',
        orientation: 'Стерео',
        releases: 'Авторская композиция, права подтверждены',
        about: 'Спокойный эмбиент с редкими полевыми записями улицы. Хорош под подкасты, таймлапсы и утренние подборки.'
      },
      {
        id: 'quiet-kitchen',
        name: 'Тихая кухня',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
        author: 'Вера Ким',
        city: 'Владивосток',
        region: 'Приморский край',
        meta: '01:48 · WAV 48 кГц',
        orientation: 'Стерео',
        releases: 'Авторская композиция, права подтверждены',
        about: 'Тёплый лоу-фай: посуда, кофе, мягкий ритм. Для кулинарных роликов и стримов.'
      },
      {
        id: 'road',
        name: 'Дорога',
        url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85',
        author: 'Степан Крылов',
        city: 'Алтай',
        region: 'Алтай',
        meta: '03:02 · WAV 48 кГц',
        orientation: 'Стерео',
        releases: 'Авторская композиция, права подтверждены',
        about: 'Гитарный мотив и медленный подъём к припеву. Для travel-монтажа и заставок.'
      },
      {
        id: 'free-rhythm',
        name: 'Свободный ритм',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85',
        author: 'Даня Волк',
        city: 'Казань',
        region: 'Татарстан',
        meta: '02:36 · WAV 48 кГц',
        orientation: 'Стерео',
        releases: 'Авторская композиция, права подтверждены',
        about: 'Живая перкуссия и бас без вокала. Энергичный фон для спорта, событий и рекламных нарезок.'
      }
    ]
  },
  template: {
    label: 'Шаблоны',
    title: 'Шаблоны',
    prices: { standard: 390, extended: 1490 },
    items: [
      {
        id: 'poster-01',
        name: 'Постер 01',
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
        author: 'Студия РуСток',
        city: 'Москва',
        region: 'Москва',
        meta: 'Figma · 4 макета · A2',
        orientation: 'Вертикально',
        releases: 'Шрифты с открытой лицензией',
        about: 'Редакционный постер с крупной типографикой и сеткой под фото. Меняются палитра, кегль и формат.'
      },
      {
        id: 'portfolio',
        name: 'Портфолио',
        url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
        author: 'Студия РуСток',
        city: 'Москва',
        region: 'Москва',
        meta: 'Figma · 12 секций',
        orientation: 'Адаптивный',
        releases: 'Шрифты с открытой лицензией',
        about: 'Одностраничное портфолио для фотографа или дизайнера: крупные кейсы, контакты, форма брифа.'
      },
      {
        id: 'presentation',
        name: 'Презентация',
        url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
        author: 'Студия РуСток',
        city: 'Москва',
        region: 'Москва',
        meta: 'Figma · Slides · 24 слайда',
        orientation: '16:9',
        releases: 'Шрифты с открытой лицензией',
        about: 'Деловая презентация с титулом, метриками, таймлайном и финальным слайдом под контакты.'
      },
      {
        id: 'cover',
        name: 'Обложка',
        url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85',
        author: 'Студия РуСток',
        city: 'Москва',
        region: 'Москва',
        meta: 'PSD · AI · 3 размера',
        orientation: 'Универсально',
        releases: 'Шрифты с открытой лицензией',
        about: 'Комплект обложек для соцсетей и видео: три размера, слои с фото и текстом разделены.'
      }
    ]
  }
};

const RUSTOK_PLANS = {
  start: {
    id: 'start',
    name: 'Start',
    price: 900,
    priceLabel: '900 ₽/мес',
    audience: 'Фрилансеры и блогеры',
    downloads: 100,
    features: [
      '100 скачиваний в месяц',
      'Фото, видео, звук и шаблоны',
      'Базовые фильтры и поиск',
      'Лицензия для цифровых проектов'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 1900,
    priceLabel: '1 900 ₽/мес',
    audience: 'SMM-команды и дизайнеры',
    downloads: 500,
    features: [
      '500 скачиваний в месяц',
      'AI-теги и умный поиск',
      'Аналитика скачиваний',
      'Расширенная лицензия на выбор',
      'Приоритетная поддержка'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4500,
    priceLabel: 'от 4 500 ₽/мес',
    audience: 'Телеканалы и корпорации',
    downloads: null,
    features: [
      'Неограниченные скачивания',
      'Корпоративная лицензия и SLA',
      'Закрывающие документы для бухгалтерии',
      'Персональный менеджер',
      'Годовой контракт'
    ]
  }
};

const RUSTOK_PLAN_ORDER = ['start', 'pro', 'enterprise'];

function rustokPlan(id) {
  return RUSTOK_PLANS[id] || null;
}

function rustokAsset(type, id) {
  const group = RUSTOK_DATA[type];
  if (!group) return null;
  const item = group.items.find((entry) => entry.id === id);
  return item ? { type, group, item } : null;
}

function rustokPrice(type, license) {
  return RUSTOK_DATA[type].prices[license];
}

function rustokMoney(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function rustokReadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('rustok-cart') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function rustokWriteCart(cart) {
  localStorage.setItem('rustok-cart', JSON.stringify(cart));
}
