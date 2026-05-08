// NAV scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Burger menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Trigger hero elements immediately
document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});

// Counter animation
const counters = document.querySelectorAll('.stat__num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.target;
      let current = 0;
      const inc = target / 40;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { e.target.textContent = target; clearInterval(timer); }
        else { e.target.textContent = Math.ceil(current); }
      }, 30);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// Canvas particle animation
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,162,39,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,105,20,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

// Form
const inscricaoForm = document.getElementById('inscricaoForm');
if (inscricaoForm) inscricaoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  this.classList.add('hide');
  document.getElementById('formSuccess').classList.add('show');
});

// Seamless marquee
(function() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const set = track.querySelector('.manifesto__set');
  if (!set) return;

  // Clone sets so content always fills the screen
  for (let i = 0; i < 8; i++) {
    track.appendChild(set.cloneNode(true));
  }

  // GAP must match CSS gap: 72px on .manifesto__track
  const GAP = 72;
  const unitWidth = set.offsetWidth + GAP;

  let pos = 0;
  function tick() {
    pos += 1.2;
    if (pos >= unitWidth) pos -= unitWidth;
    track.style.transform = `translateX(-${pos}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
