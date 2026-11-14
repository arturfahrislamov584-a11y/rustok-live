const reelWrap = document.querySelector('.reel-wrap');
const stage = document.querySelector('.reel-stage');
const cards = [...document.querySelectorAll('.reel-card')];
const title = stage.querySelector('h1');
const description = stage.querySelector('.reel-description');
const end = stage.querySelector('.reel-end');
const progressBar = stage.querySelector('.reel-progress span');
const fullReel = stage.querySelector('.full-reel');

const cardStates = [
  {x: 5, y: -8, r: 7, s: 1.9},
  {x: 35, y: -25, r: -4, s: .7},
  {x: 23, y: 20, r: 12, s: .72},
  {x: -13, y: 13, r: -15, s: .75},
  {x: -25, y: -21, r: 15, s: .62},
];

function clamp(value) { return Math.min(Math.max(value, 0), 1); }
function updateReel() {
  const bounds = reelWrap.getBoundingClientRect();
  const progress = clamp(-bounds.top / (bounds.height - window.innerHeight));
  const settle = clamp((progress - .08) / .62);
  const fade = clamp((progress - .63) / .22);
  const fullFrame = clamp((progress - .48) / .23);
  progressBar.style.setProperty('--progress', `${progress * 100}%`);
  cards.forEach((card, index) => {
    const state = cardStates[index];
    const scale = 1 + (state.s - 1) * settle;
    card.style.transform = `translate(${state.x * settle}vw, ${state.y * settle}vh) rotate(${state.r * settle}deg) scale(${scale})`;
    card.style.opacity = index === 0 ? `${1 - fade * .35}` : `${1 - fade}`;
  });
  title.style.transform = `translateY(${-settle * 60}px) scale(${1 - settle * .08})`;
  title.style.opacity = `${1 - fade * 1.3}`;
  description.style.transform = `translateY(${-settle * 42}px)`;
  description.style.opacity = `${1 - fade * 1.4}`;
  fullReel.style.opacity = fullFrame;
  fullReel.style.transform = `scale(${1.12 - fullFrame * .12})`;
  end.style.opacity = fade;
  end.style.transform = `translateY(${20 - fade * 20}px)`;
}
window.addEventListener('scroll', () => window.requestAnimationFrame(updateReel), {passive:true});
updateReel();

const field = document.querySelector('.trail-field');
const trailPictures = [
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=640&q=80'
];
let previousPoint; let pictureIndex = 0;
field.addEventListener('pointermove', (event) => {
  const bounds = field.getBoundingClientRect();
  const point = {x:event.clientX - bounds.left, y:event.clientY - bounds.top};
  if (!previousPoint || Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) > 54) {
    const frame = document.createElement('div');
    frame.className = 'trail-frame';
    frame.style.left = `${point.x - 75}px`;
    frame.style.top = `${point.y - 54}px`;
    frame.style.backgroundImage = `url(${trailPictures[pictureIndex++ % trailPictures.length]})`;
    frame.style.rotate = `${(Math.random() - .5) * 20}deg`;
    field.append(frame); window.setTimeout(() => frame.remove(), 1050); previousPoint = point;
  }
});
field.addEventListener('pointerleave', () => {previousPoint = null;});
