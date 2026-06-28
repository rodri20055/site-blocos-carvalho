// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const text = el.textContent.trim();
  const prefix = text.match(/^[+]?/) ? text.match(/^[+]/)?.[0] || '' : '';
  const suffix = text.match(/[MK%h]+$/) ? text.match(/[MK%h]+$/)[0] : '';
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;
  const duration = 1800;
  const start = performance.now();
  el.dataset.counted = '1';
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(ease * num);
    el.textContent = (prefix ? '+' : '') + val + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = text;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-num').forEach(el => counterObserver.observe(el));

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  const icon = hamburger.querySelector('i');
  icon.className = open ? 'fas fa-times' : 'fas fa-bars';
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMenu() {
  mobileNav.classList.remove('open');
  const icon = hamburger.querySelector('i');
  if (icon) icon.className = 'fas fa-bars';
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (navbar && mobileNav && !navbar.contains(e.target)) closeMenu();
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== PRODUCT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    // apanha todos os cards independentemente do ID ou classe
    document.querySelectorAll('[data-cat]').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? 'flex' : 'none';
      // garante que cards visíveis voltam a animar
      if (match) {
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const nome     = document.getElementById('nome').value.trim();
    const email    = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone')?.value.trim() || '';
    const assunto  = document.getElementById('assunto')?.value || '';
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) return;

    const texto = `Olá! O meu nome é ${nome}.${assunto ? '\nAssunto: ' + assunto : ''}${telefone ? '\nTelefone: ' + telefone : ''}\n\n${mensagem}\n\nEmail: ${email}`;
    window.open(`https://wa.me/351965023275?text=${encodeURIComponent(texto)}`, '_blank');
    this.reset();
    showToast('✓ A abrir WhatsApp com a sua mensagem...');
  });
}

// ===== TOAST =====
function showToast(msg) {
  const existing = document.querySelector('.site-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'site-toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '96px', right: '28px',
    background: '#2c2416', color: '#f5f0e8',
    padding: '13px 22px', borderRadius: '10px',
    fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '.88rem',
    boxShadow: '0 4px 24px rgba(0,0,0,.25)', zIndex: '9999',
    opacity: '0', transition: 'opacity .3s ease',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== COOKIE BANNER =====
(function() {
  if (localStorage.getItem('cookie-consent')) return;
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.classList.remove('hidden');
  document.getElementById('cookieAccept').addEventListener('click', function() {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.add('hidden');
  });
  document.getElementById('cookieReject').addEventListener('click', function() {
    localStorage.setItem('cookie-consent', 'rejected');
    banner.classList.add('hidden');
  });
})();
