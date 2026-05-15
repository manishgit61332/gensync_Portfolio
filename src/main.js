/* ============================================================
   GenSync Main — main.js
   Scroll reveals, navbar, portfolio filter, video modal,
   testimonials, counters, magnetic cursor, and smooth scroll
   ============================================================ */
import Lenis from 'lenis';
import { initHero3D } from './hero-3d.js';

const isLocalPreview = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(location.hostname);
const isProductionHost = location.protocol === 'https:' && location.hostname === 'www.gensync.in';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchOrSmallScreen = window.matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)').matches;
const scrollEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const scrollOptions = {
  duration: 1.15,
  easing: scrollEase,
};

function scrollToTarget(target, options = {}) {
  const lenis = window.lenis;
  const mergedOptions = { ...scrollOptions, ...options };

  if (lenis?.scrollTo && !prefersReducedMotion) {
    lenis.scrollTo(target, mergedOptions);
    return;
  }

  if (target === 0 || target === 'top') {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    return;
  }

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const offset = mergedOptions.offset || 0;
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

// Register Service Worker only on production. Local preview must stay uncached.
if ('serviceWorker' in navigator && isProductionHost) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
} else if ('serviceWorker' in navigator && isLocalPreview) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => registrations.forEach((registration) => registration.unregister()))
    .catch(() => {});
}

// ── Scroll Reveal (Intersection Observer) ──────────────────
function initScrollReveal() {
  return;
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

  const showReveal = (element) => {
    element.classList.add('visible');

    if (element.classList.contains('reveal-stagger')) {
      Array.from(element.children).forEach((child, index) => {
        child.style.animationDelay = `${index * 100}ms`;
        child.classList.add('stagger-visible');
      });
    }
  };

  const showHashTarget = () => {
    if (!location.hash || location.hash.length <= 1) return;
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;

    target
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .project-card')
      .forEach(showReveal);
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showReveal(entry.target);
        // Don't unobserve — keep it visible
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
  requestAnimationFrame(showHashTarget);
  window.addEventListener('hashchange', showHashTarget);

  // Separate observer for glass-shine: toggles visible off on exit so animation replays
  const shineEls = document.querySelectorAll('.glass-shine');
  if (shineEls.length) {
    const shineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });
    shineEls.forEach(el => shineObserver.observe(el));
  }
}

// ── Navbar Scroll ──────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navbar) return;

  let ticking = false;

  const updateNavbar = () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  const requestNavbarUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateNavbar();
    });
  };

  window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
  updateNavbar();
}

// ── Mobile Menu ────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Filter Triggers (Service Cards) ────────────────────────
function initFilterTriggers() {
  document.querySelectorAll('[data-filter-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const filter = trigger.dataset.filterTrigger;
      // Small delay to allow smooth scroll to finish if needed
      setTimeout(() => {
        const tab = document.querySelector(`.portfolio-tab[data-filter="${filter}"]`);
        if (tab) tab.click();
      }, 100);
    });
  });
}

// ── Smooth Scroll for Anchor Links ─────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = anchor.getAttribute('href');
      if (target && target !== '#') scrollToTarget(target, { offset: -128 });
    });
  });
}

// ── Portfolio Filter ───────────────────────────────────────
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const moreSection = document.querySelector('.portfolio-more-header');
      const compactGrid = document.querySelector('.portfolio-compact-grid');

      // Show/Hide More Selected Work based on filter
      if (moreSection && compactGrid) {
        if (filter === 'web' || filter === 'all') {
          moreSection.style.display = '';
          compactGrid.style.display = '';
        } else {
          moreSection.style.display = 'none';
          compactGrid.style.display = 'none';
        }
      }

      cards.forEach((card, i) => {
        const categories = (card.dataset.categories || card.dataset.category || '')
          .split(/\s+/)
          .filter(Boolean);
        const show = filter === 'all' || categories.includes(filter);
        
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        
        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ── Video Modal ────────────────────────────────────────────
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const closeBtn = document.getElementById('videoModalClose');

  document.querySelectorAll('.project-card[data-youtube], .project-card[data-drive]').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.youtube) {
        const youtubeId = card.dataset.youtube;
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      } else if (card.dataset.drive) {
        const driveId = card.dataset.drive;
        iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
      }
      
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Link-based project cards
  document.querySelectorAll('.project-card[data-link]').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.dataset.link;
      if (link) window.open(link, '_blank');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

// ── Testimonials Carousel ──────────────────────────────────
function initTestimonials() {
  const testimonials = [
    {
      quote: "We rebuilt our entire web presence with GenSync. The site loads fast, looks like a Series B company made it, and our demo requests went up 240% in the first month.",
      author: "David Chen",
      role: "CEO at NexusData (YC W23)"
    },
    {
      quote: "Most agencies take 6 weeks to ship a landing page. GenSync had a working, production-ready site with custom 3D assets in 8 days. The speed is unmatched.",
      author: "Sarah Jenkins",
      role: "VP Marketing, Lumina"
    },
    {
      quote: "We needed a full rebrand, a product film, and a web platform for our public launch. GenSync delivered everything in 3 weeks. One cohesive team, zero friction.",
      author: "Marcus Thorne",
      role: "Co-founder, Atmos Energy"
    },
    {
      quote: "Their CREA system straight up replaced 15 hours of my weekly admin work. It manages outreach, follows up with leads, and syncs everything automatically.",
      author: "Elena Rodriguez",
      role: "Founder, Bloom Studio"
    }
  ];

  const quote = document.getElementById('testimonialQuote');
  const author = document.getElementById('testimonialAuthor');
  const role = document.getElementById('testimonialRole');
  const dots = document.querySelectorAll('.testimonial-dot');
  const progressBar = document.getElementById('testimonialProgressBar');
  const container = document.querySelector('.testimonials-container');

  if (!quote || !author || !role || dots.length === 0) return;

  let current = 0;
  let interval;
  let paused = false;

  function showTestimonial(index) {
    current = index;
    const t = testimonials[index];
    
    // Fade out
    quote.style.opacity = '0';
    quote.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      quote.textContent = t.quote;
      author.textContent = t.author;
      role.textContent = t.role;
      
      // Fade in
      quote.style.opacity = '1';
      quote.style.transform = 'translateY(0)';
    }, 300);

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

    // Reset progress bar
    if (progressBar) {
      progressBar.classList.remove('running');
      // Force reflow
      void progressBar.offsetWidth;
      progressBar.classList.add('running');
    }
  }

  // Add transitions
  quote.style.transition = 'opacity 0.3s, transform 0.3s';

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showTestimonial(parseInt(dot.dataset.index));
      resetInterval();
    });
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      if (!paused) {
        showTestimonial((current + 1) % testimonials.length);
      }
    }, 5000);
  }

  // Pause on hover
  if (container) {
    container.addEventListener('mouseenter', () => { paused = true; });
    container.addEventListener('mouseleave', () => { 
      paused = false;
      resetInterval();
      showTestimonial(current); // restart progress bar
    });
  }

  // Start progress bar on first load
  if (progressBar) {
    progressBar.classList.add('running');
  }

  resetInterval();
}

// ── Counter Animation ──────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          
          counter.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }
        
        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ── Card Mouse Tracking (Glow Effect) ──────────────────────
function initCardGlow() {
  if (isTouchOrSmallScreen || prefersReducedMotion) return;

  document.querySelectorAll('.service-card, .card, .team-card, .compact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

// ── Magnetic Button Effect ─────────────────────────────────
function initMagneticButtons() {
  return;
}

// ── Lenis Smooth Scroll ────────────────────────────────────
function initLenis() {
  if (prefersReducedMotion || isTouchOrSmallScreen) return;

  const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.12,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    anchors: {
      ...scrollOptions,
      offset: -128,
    },
  });

  window.lenis = lenis;
}

// ── Custom Portfolio Cursor ────────────────────────────────
function initCustomCursor() {
  return;
  const cursor = document.getElementById('portfolioCursor');
  if (!cursor) return;

  // Only on pointer devices
  if (window.matchMedia('(hover: none)').matches) return;

  const portfolio = document.querySelector('.portfolio');
  if (!portfolio) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Smooth follow with lerp
  function animate() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  portfolio.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Show/hide on project cards
  const cards = portfolio.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      // Contextual label
      if (card.dataset.youtube || card.dataset.drive) {
        cursor.textContent = 'Play';
      } else if (card.dataset.link) {
        cursor.textContent = 'Open';
      } else {
        cursor.textContent = 'View';
      }
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
    });
  });

  // Hide when leaving portfolio entirely
  portfolio.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
}

// ── Parallax CTA Orbs ──────────────────────────────────────
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.cta-orb');
  if (!orbs.length || prefersReducedMotion || isTouchOrSmallScreen) return;

  let ticking = false;
  const updateOrbs = () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = i === 0 ? 0.04 : -0.03;
      orb.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateOrbs();
    });
  }, { passive: true });
}

// ── Portfolio Card Staggered Reveal ────────────────────────
function initPortfolioReveal() {
  return;
  const cards = document.querySelectorAll('.portfolio-grid .project-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

// ── Back to Top Button ─────────────────────────────────────
function initBackToTop() {
  return;
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  let ticking = false;

  const updateButton = () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateButton();
    });
  }, { passive: true });

  btn.addEventListener('click', () => {
    scrollToTarget(0);
  });
}

// ── Small Interaction Sparks ───────────────────────────────
function initDelightInteractions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.btn, .project-btn, .portfolio-tab, .hero-work-word, .hero-object-card, .service-link, .testimonial-dot'
  );
  let lastSpark = 0;

  const createSpark = (event) => {
    const now = performance.now();
    if (now - lastSpark < 90) return;
    lastSpark = now;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const spark = document.createElement('span');
    spark.className = 'touch-spark';
    spark.style.setProperty('--spark-x', `${x}px`);
    spark.style.setProperty('--spark-y', `${y}px`);
    document.body.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
  };

  targets.forEach((target) => {
    target.addEventListener('pointerdown', createSpark, { passive: true });
  });
}

function showMicroToast(message) {
  let toast = document.querySelector('.micro-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'micro-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 1800);
}

function initEasterEggs() {
  const logo = document.querySelector('.nav-logo');
  let logoClicks = 0;
  let logoTimer;

  if (logo) {
    logo.addEventListener('click', () => {
      logoClicks += 1;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => {
        logoClicks = 0;
      }, 900);

      if (logoClicks >= 4) {
        logoClicks = 0;
        showMicroToast('Messy context accepted. Ship mode on.');
      }
    });
  }

  let typed = '';
  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;

    typed = (typed + event.key.toLowerCase()).slice(-8);
    if (typed.endsWith('ship')) {
      typed = '';
      showMicroToast('Proof first. Pretty second. Shipped anyway.');
    }
  });
}

// ── Scroll-Depth CTA Banner ───────────────────────────────
function initScrollCta() {
  const cta = document.getElementById('scrollCta');
  const closeBtn = document.getElementById('scrollCtaClose');
  if (!cta || !closeBtn) return;
  if (window.matchMedia('(max-width: 900px), (hover: none)').matches) return;

  let dismissed = false;
  let shown = false;
  let ticking = false;

  const updateCta = () => {
    if (dismissed) return;

    const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;

    if (scrollPercent > 0.75 && !shown) {
      cta.classList.add('visible');
      shown = true;
    }
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateCta();
    });
  }, { passive: true });

  closeBtn.addEventListener('click', () => {
    cta.classList.remove('visible');
    dismissed = true;
  });
}

// ── Smooth Page Transitions ───────────────────────────────
function initPageTransitions() {
  return;
}

// ── Preloader ─────────────────────────────────────────────
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  let hidden = false;

  const hidePreloader = () => {
    if (hidden) return;
    hidden = true;
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 600); // Show logo for minimum 600ms
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader, { once: true });
  }

  setTimeout(hidePreloader, 1400);
}

// ── Modal Keyboard Trap (Accessibility) ───────────────────
function initModalTrap() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('videoModalClose');
  if (!modal || !closeBtn) return;

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeBtn.click();
    }
  });

  // Trap Tab within modal when open
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    closeBtn.focus();
  });
}

// ── Initialize Everything ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLenis();
  initHero3D();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initFilterTriggers();
  initPortfolioFilter();
  initVideoModal();
  initTestimonials();
  initCounters();
  initCardGlow();
  initMagneticButtons();
  initCustomCursor();
  initParallaxOrbs();
  initDelightInteractions();
  initEasterEggs();
  initPortfolioReveal();
  initBackToTop();
  initScrollCta();
  initPageTransitions();
  initModalTrap();
});
