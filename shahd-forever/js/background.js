(function () {
  const canvas = document.getElementById("bg-hearts");
  const ctx = canvas.getContext("2d");
  const colors = CONFIG.colors.hearts;
  let w = 0, h = 0, dpr = 1, hearts = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(60, Math.max(22, (w * h) / 22000)));
    while (hearts.length < target) hearts.push(spawn(true));
    hearts.length = target;
  }

  function spawn(initial) {
    const size = 10 + Math.random() * 34;
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + size + Math.random() * 120,
      size,
      speed: 0.25 + Math.random() * 0.9,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.004 + Math.random() * 0.01,
      amp: 10 + Math.random() * 30,
      color: colors[(Math.random() * colors.length) | 0],
      alpha: 0.25 + Math.random() * 0.55,
      rot: (Math.random() - 0.5) * 0.6,
    };
  }

  function drawHeart(x, y, s, color, alpha, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = s * 0.6;
    ctx.beginPath();
    const t = s / 2;
    ctx.moveTo(0, t * 0.6);
    ctx.bezierCurveTo(-t * 1.6, -t * 0.4, -t * 0.8, -t * 1.5, 0, -t * 0.6);
    ctx.bezierCurveTo(t * 0.8, -t * 1.5, t * 1.6, -t * 0.4, 0, t * 0.6);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < hearts.length; i++) {
      const p = hearts[i];
      p.y -= p.speed;
      p.drift += p.driftSpeed;
      const x = p.x + Math.sin(p.drift) * p.amp;
      drawHeart(x, p.y, p.size, p.color, p.alpha, p.rot + Math.sin(p.drift) * 0.2);
      if (p.y < -p.size * 2) hearts[i] = spawn(false);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);
  resize();
  requestAnimationFrame(frame);
})();
