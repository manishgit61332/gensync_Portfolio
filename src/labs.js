/* ============================================================
   GenSync Labs — labs.js
   Scroll reveals, navbar, mobile menu, smooth scroll, 
   typing animation
   ============================================================ */

import Lenis from 'lenis';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const scrollOptions = {
  duration: 1.15,
  easing: scrollEase,
};

// ── Scroll Reveal ──────────────────────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ── Navbar ─────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;

  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateNavbar();
    });
  }, { passive: true });

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

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Smooth Scroll (Lenis) ──────────────────────────────────
function initSmoothScroll() {
  if (prefersReducedMotion) return;

  const lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.085,
    wheelMultiplier: 0.82,
    touchMultiplier: 1,
    anchors: {
      ...scrollOptions,
      offset: -80,
    },
  });

  window.lenis = lenis;

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target && target !== '#') {
        lenis.scrollTo(target, { ...scrollOptions, offset: -80 });
      }
    });
  });
}

// ── Magnetic Buttons ───────────────────────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.btn-labs, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-2px) translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── Arch Node Hover Glow ───────────────────────────────────
function initArchNodes() {
  document.querySelectorAll('.arch-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.transform = 'scale(1.05)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.transform = '';
    });
  });
}

// ── Terminal Typing Effect ─────────────────────────────────
function initTerminalTyping() {
  const terminal = document.querySelector('.terminal-body');
  if (!terminal) return;

  const lines = terminal.querySelectorAll('.line');
  lines.forEach(line => {
    line.style.display = 'none'; // Hide everything initially
  });

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.unobserve(entries[0].target);
      runTerminalSequence(lines);
    }
  }, { threshold: 0.3 });

  observer.observe(terminal);
}

async function runTerminalSequence(lines) {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cmdSpan = line.querySelector('.cmd');
    
    if (cmdSpan && cmdSpan.hasAttribute('data-text')) {
      const fullText = cmdSpan.getAttribute('data-text');
      cmdSpan.textContent = '';
      line.style.display = 'block';
      
      // Type out the command
      for (let char of fullText) {
        cmdSpan.textContent += char;
        await delay(Math.random() * 20 + 15); // Blazing fast hacker speed
      }
      await delay(250); // Pause before hitting 'Enter'
    } else {
      // Dump output logs
      line.style.display = 'block';
      await delay(50); // Fast log dump
    }
  }
}

// ── Initialize ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initMagneticButtons();
  initArchNodes();
  initTerminalTyping();
});
