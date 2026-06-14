/* ===========================
   3D ANİMASYONLU WEB SİTESİ
   script.js
   =========================== */

// ============================
// 1. ÖZEL İMLEÇ (Custom Cursor)
// ============================
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--cx', e.clientX + 'px');
  document.body.style.setProperty('--cy', e.clientY + 'px');
});

// ============================
// 2. PARTİKÜL SİSTEMİ
// ============================
function createParticles() {
  const container = document.getElementById('particles');
  const count = 60;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const x = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 10;
    const size = 1 + Math.random() * 3;

    // Bazı partiküller pembe veya mor renkte
    const colors = ['#00f5ff', '#7b2fff', '#ff2d78', '#00f5ff', '#00f5ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      animation-name: particleFloat;
    `;

    container.appendChild(p);
  }
}
createParticles();

// ============================
// 3. SAYAÇ ANİMASYONU (Counter)
// ============================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  requestAnimationFrame(update);
}

// Stats bar görünür olunca sayaçları başlat
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ============================
// 4. SCROLL REVEAL ANİMASYONU
// ============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay ile
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

// Reveal sınıfı ekle ve gözlemle
const revealEls = document.querySelectorAll(
  '.feature-card, .project-card, .section-header, .stat-item'
);
revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ============================
// 5. NAVBAR SCROLL EFEKTİ
// ============================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(5, 10, 20, 0.95)';
    navbar.style.padding = '12px 60px';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(5, 10, 20, 0.7)';
    navbar.style.padding = '20px 60px';
    navbar.style.boxShadow = 'none';
  }
});

// ============================
// 6. SMOOTH SCROLL
// ============================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Nav link smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    scrollToSection(id);
  });
});

// ============================
// 7. KÜPÜ MOUSE PARALLAX
// ============================
const cube = document.querySelector('.cube');
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;
let isManual = false;

document.addEventListener('mousemove', (e) => {
  if (!cube || isManual) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  targetRotY = ((e.clientX - cx) / cx) * 30;
  targetRotX = -((e.clientY - cy) / cy) * 30;
});

function lerpCube() {
  if (!cube) return;
  currentRotX += (targetRotX - currentRotX) * 0.05;
  currentRotY += (targetRotY - currentRotY) * 0.05;
  // Otomatik rotasyona ekle
  cube.style.animationPlayState = 'paused';
  // Basit döndürme (mouse ile)
  requestAnimationFrame(lerpCube);
}

// Not: Küp CSS animasyonu ile dönüyor,
// mouse ile ekstra katkı yapmak için bu fonksiyon kullanılabilir
// lerpCube();

// ============================
// 8. FEATURE CARD 3D TILT
// ============================
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    card.style.transform = `
      perspective(600px)
      rotateX(${-dy * 8}deg)
      rotateY(${dx * 8}deg)
      translateY(-8px)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================
// 9. FORM GÖNDER
// ============================
const sendBtn = document.querySelector('.btn-send');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.cyber-input');
    let filled = true;
    inputs.forEach(input => {
      if (!input.value.trim()) filled = false;
    });

    if (!filled) {
      sendBtn.querySelector('span').textContent = 'TÜM ALANLARI DOLDURUN!';
      sendBtn.style.background = 'linear-gradient(135deg, #ff2d78, #7b2fff)';
      setTimeout(() => {
        sendBtn.querySelector('span').textContent = 'GÖNDER';
        sendBtn.style.background = '';
      }, 2000);
      return;
    }

    sendBtn.querySelector('span').textContent = 'GÖNDERİLDİ ✓';
    sendBtn.style.background = 'linear-gradient(135deg, #00f5ff, #00c8d4)';
    inputs.forEach(input => input.value = '');

    setTimeout(() => {
      sendBtn.querySelector('span').textContent = 'GÖNDER';
      sendBtn.style.background = '';
    }, 3000);
  });
}

// ============================
// 10. GLITCH EFEKTİ (Logo)
// ============================
const logo = document.querySelector('.logo');
if (logo) {
  setInterval(() => {
    logo.style.textShadow = `
      2px 0 #ff2d78,
      -2px 0 #00f5ff
    `;
    setTimeout(() => {
      logo.style.textShadow = '';
    }, 100);
  }, 4000);
}

// ============================
// 11. PARALLAX SCROLL (Orbs)
// ============================
const orbs = document.querySelectorAll('.orb');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = 0.2 + i * 0.1;
    orb.style.transform += ` translateY(${scrollY * speed}px)`;
  });
}, { passive: true });

// ============================
// 12. SAYFA YÜKLENDİ MESAJİ
// ============================
window.addEventListener('load', () => {
  console.log('%c[NEXUS] 3D Animasyonlu Site Hazır! 🚀', 
    'color: #00f5ff; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00f5ff;'
  );
});