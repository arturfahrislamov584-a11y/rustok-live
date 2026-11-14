function initStars(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let width = 0;
  let height = 0;
  let last = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(190, Math.max(50, Math.round(width * height * 0.00022)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.3,
      a: Math.random() * 0.45 + 0.15,
      v: Math.random() * 4 + 1,
      tw: Math.random() * Math.PI * 2,
      tint: Math.random() < 0.12 ? '239,172,212' : '255,255,255'
    }));
  }

  function frame(time) {
    const dt = Math.min(64, time - last) / 1000;
    last = time;
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      if (!reduce) {
        star.y -= star.v * dt * 6;
        star.tw += dt * 2;
        if (star.y < -2) {
          star.y = height + 2;
          star.x = Math.random() * width;
        }
      }
      const alpha = star.a * (reduce ? 1 : 0.6 + 0.4 * Math.sin(star.tw));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.tint},${alpha.toFixed(3)})`;
      ctx.fill();
    }

    window.requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  window.requestAnimationFrame((time) => {
    last = time;
    frame(time);
  });
}

document.querySelectorAll('[data-stars]').forEach(initStars);
