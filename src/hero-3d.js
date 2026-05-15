// ── Hero 3D Wireframe Sphere ───────────────────────────────
// Lightweight canvas-based wireframe — no Three.js dependency
// Draws a rotating wireframe sphere with orange-tinted lines

export function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  canvas.style.display = 'none';
  canvas.setAttribute('aria-hidden', 'true');
}
