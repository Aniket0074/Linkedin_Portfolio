// ===== Navigation =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Particle Background =====
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(w * h / 12000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: ['#06b6d4', '#8b5cf6', '#10b981', '#ec4899'][Math.floor(Math.random() * 4)]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ===== Live Chart =====
(function initLiveChart() {
  const canvas = document.getElementById('liveChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const points = 40;
  const datasets = [
    { color: '#06b6d4', data: [], offset: 0 },
    { color: '#8b5cf6', data: [], offset: 2 },
    { color: '#10b981', data: [], offset: 4 }
  ];

  datasets.forEach(d => {
    for (let i = 0; i < points; i++) {
      d.data.push(30 + Math.random() * 40);
    }
  });

  function drawChart() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(148,163,184,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (H / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    datasets.forEach(d => {
      d.data.shift();
      d.data.push(30 + Math.random() * 40 + Math.sin(Date.now() / 500 + d.offset) * 10);

      ctx.beginPath();
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;

      d.data.forEach((val, i) => {
        const x = (i / (points - 1)) * W;
        const y = H - (val / 100) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Fill gradient
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, d.color + '30');
      grad.addColorStop(1, d.color + '00');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawChart);
  }

  drawChart();
})();

// ===== Skills Radar Chart =====
(function initRadar() {
  const canvas = document.getElementById('skillsRadar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxR = 120;
  const labels = ['Observability', 'Cloud', 'DevOps', 'K8s', 'Pre-Sales', 'Java/APM'];
  const values = [0.95, 0.85, 0.82, 0.88, 0.90, 0.80];
  const n = labels.length;
  let progress = 0;

  function getPoint(i, r) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  }

  function drawRadar(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const [x, y] = getPoint(i, (maxR / 4) * ring);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(148,163,184,0.12)';
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const [x, y] = getPoint(i, maxR);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(148,163,184,0.1)';
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    values.forEach((v, i) => {
      const [x, y] = getPoint(i, maxR * v * p);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, 'rgba(6,182,212,0.35)');
    grad.addColorStop(1, 'rgba(139,92,246,0.15)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots
    values.forEach((v, i) => {
      const [x, y] = getPoint(i, maxR * v * p);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#0a0e17';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  function animate() {
    if (progress < 1) {
      progress += 0.02;
      drawRadar(Math.min(progress, 1));
      requestAnimationFrame(animate);
    } else {
      drawRadar(1);
    }
  }

  const radarObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      progress = 0;
      animate();
      radarObserver.unobserve(canvas);
    }
  }, { threshold: 0.3 });

  radarObserver.observe(canvas);
})();

// ===== Counter Animation =====
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = target * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== Skill Bar Animation =====
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar__fill').forEach(bar => skillBarObserver.observe(bar));

// ===== Scroll Fade-in =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.highlight-card, .timeline__item, .skill-bar, .cert-card, .about__text, .tech-icon, .stat-card'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.style.color = item.getAttribute('href') === `#${current}` ? 'var(--text-primary)' : '';
  });
});
