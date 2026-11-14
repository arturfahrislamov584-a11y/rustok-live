const dot = document.querySelector('.cursor-dot');
document.querySelector('.nav')?.insertAdjacentHTML('beforeend', '<a href="author.html">Авторам</a>');
const hero = document.querySelector('.hero');
const mosaic = document.querySelector('.mosaic');
const heroTitle = hero.querySelector('h1');
const heroCopy = hero.querySelector('.hero-copy');
const search = hero.querySelector('.search');
const orbitOne = hero.querySelector('.orbit-one');
const tiles = [
  ['.tile-city', 120, -170], ['.tile-dance', -95, -115], ['.tile-food', 165, 55],
  ['.tile-nature', -170, 85], ['.tile-maker', -55, 160], ['.tile-run', 115, -85],
].map(([selector, x, y]) => ({ element: hero.querySelector(selector), x, y }));

window.addEventListener('pointermove', (event) => { dot.style.left = `${event.clientX}px`; dot.style.top = `${event.clientY}px`; });
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));

const form = document.querySelector('#search-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  const query = input.value.trim();
  if (query) { window.location.href = `catalog.html?type=photo&q=${encodeURIComponent(query)}`; }
});

let ticking = false;
function animateHeroOnScroll() {
  const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.8), 0), 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  mosaic.style.transform = `scale(${1 - eased * 0.09}) translateY(${-eased * 52}px)`;
  mosaic.style.opacity = `${1 - eased * 0.38}`;
  heroTitle.style.transform = `translateY(${-eased * 55}px) scale(${1 - eased * 0.045})`;
  heroCopy.style.transform = `translateY(${-eased * 30}px)`;
  search.style.transform = `translateY(${eased * 25}px) scale(${1 - eased * 0.03})`;
  orbitOne.style.transform = `rotate(${eased * 62}deg) scale(${1 + eased * 0.16})`;
  tiles.forEach(({ element, x, y }) => {
    if (!element) return;
    element.style.translate = `${x * eased}px ${y * eased}px`;
    element.style.opacity = `${1 - eased * 0.24}`;
  });
  hero.classList.toggle('is-scrolling', progress > 0.015);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(animateHeroOnScroll); ticking = true; }
}, { passive: true });
animateHeroOnScroll();
