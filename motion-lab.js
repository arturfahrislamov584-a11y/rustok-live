const buttons = [...document.querySelectorAll('[data-scene]')];
const scenes = [...document.querySelectorAll('.scene')];

function activateScene(id) {
  scenes.forEach((scene) => scene.classList.toggle('is-active', scene.id === id));
  buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.scene === id));
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
buttons.forEach((button) => button.addEventListener('click', () => activateScene(button.dataset.scene)));

const kinetic = document.querySelector('.kinetic-stage');
const kineticCards = [...kinetic.querySelectorAll('.kinetic-card')];
kinetic.addEventListener('pointermove', (event) => {
  const bounds = kinetic.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  kineticCards.forEach((card, index) => {
    const depth = (index + 1) * 7;
    card.style.translate = `${x * depth}px ${y * depth}px`;
  });
});
kinetic.addEventListener('pointerleave', () => kineticCards.forEach((card) => { card.style.translate = '0 0'; }));

const trail = document.querySelector('.trail-stage');
const trailImages = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=600&q=80'
];
let lastPoint = null;
let imageIndex = 0;
trail.addEventListener('pointermove', (event) => {
  const bounds = trail.getBoundingClientRect();
  const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 58) {
    const image = document.createElement('div');
    image.className = 'trail-image';
    image.style.left = `${point.x - 78}px`;
    image.style.top = `${point.y - 52}px`;
    image.style.backgroundImage = `url(${trailImages[imageIndex++ % trailImages.length]})`;
    image.style.rotate = `${(Math.random() - .5) * 18}deg`;
    trail.append(image);
    window.setTimeout(() => image.remove(), 1150);
    lastPoint = point;
  }
});
trail.addEventListener('pointerleave', () => { lastPoint = null; });

const lens = document.querySelector('.lens-stage');
const lensMain = lens.querySelector('.lens-main img');
const lensCircle = lens.querySelector('.lens-circle');
lens.addEventListener('pointermove', (event) => {
  const bounds = lens.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  lensMain.style.transform = `scale(1.1) translate(${x * -28}px, ${y * -20}px)`;
  lensCircle.style.transform = `translate(${x * 45}px, ${y * 45}px) rotate(${x * 16}deg)`;
});
lens.addEventListener('pointerleave', () => { lensMain.style.transform = ''; lensCircle.style.transform = ''; });
