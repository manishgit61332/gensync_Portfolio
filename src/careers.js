document.documentElement.classList.add('careers-js');

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateNavbar = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 36);
};

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

const closeMenu = () => {
  menuToggle?.classList.remove('active');
  mobileMenu?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

menuToggle?.addEventListener('click', () => {
  const willOpen = !mobileMenu?.classList.contains('open');
  menuToggle.classList.toggle('active', willOpen);
  mobileMenu?.classList.toggle('open', willOpen);
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  document.body.style.overflow = willOpen ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const revealElements = document.querySelectorAll('.career-reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px',
  });

  revealElements.forEach((element) => observer.observe(element));
}

document.querySelectorAll('.careers-apply-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'careers_apply_click', {
      link_text: link.textContent.trim(),
      page_location: window.location.href,
    });
  });
});
