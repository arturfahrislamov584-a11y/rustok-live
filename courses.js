const COURSES = {
  brand: {
    kicker: '12 УРОКОВ · ВИДЕО',
    title: 'Визуальный язык бренда',
    description: 'Как собрать узнаваемый визуальный язык: палитра, типографика, сетка и правила съёмки. Разбираем на реальных российских брендах.',
    points: ['12 видеоуроков по 18–25 минут', 'Разбор айдентики и мудбордов', 'Финальный проект — мини-гайд по бренду']
  },
  motion: {
    kicker: '8 УРОКОВ · ПРАКТИКА',
    title: 'Моушн без лишнего шума',
    description: 'Анимация, которая помогает смотреть, а не мешает: ритм, тайминги, кривые и сборка короткого рилса.',
    points: ['8 практических уроков', 'Разбор референсов и таймингов', 'Финальный проект — рилс на 15 секунд']
  },
  photo: {
    kicker: '14 УРОКОВ · ФОТО',
    title: 'Как снимать обычное необычно',
    description: 'Свет, композиция и наблюдение: как находить сюжет в повседневных городских сценах и не снимать открытки.',
    points: ['14 уроков: от света до серии', 'Съёмка на телефон и камеру', 'Разбор 50 кадров участников']
  }
};

const dialog = document.querySelector('#course-dialog');
const close = document.querySelector('#course-close');

document.querySelectorAll('.course-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    const data = COURSES[card.dataset.course];
    if (!data) return;
    document.querySelector('#course-kicker').textContent = data.kicker;
    document.querySelector('#course-title').textContent = data.title;
    document.querySelector('#course-description').textContent = data.description;
    document.querySelector('#course-points').innerHTML = data.points.map((point) => `<li>${point}</li>`).join('');
    dialog.showModal();
  });
});

close.addEventListener('click', () => dialog.close());

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
