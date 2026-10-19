/**
 * A Moment of Calm • Realistic Botanical Blooming Journey
 * Procedural Organic Canvas Engine with Smooth Scroll Interpolation,
 * Layered Petal Shading, Dew Drops, and Ambient Particle Physics.
 */

// ==========================================
// 1. Initialization & Canvas Setup
// ==========================================
const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');
const scrollIndicator = document.getElementById('scrollIndicator');
const finalCard = document.getElementById('finalCard');
const replayBtn = document.getElementById('replayBtn');
const audioToggle = document.getElementById('audioToggle');

let width, height, dpr;
let currentScrollProgress = 0;
let targetScrollProgress = 0;

// Mouse / Breeze Interactivity
let mouseX = 0, mouseY = 0;
let targetSway = 0, currentSway = 0;

function resize() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resize);
resize();

// Track Mouse for gentle wind breeze
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / width - 0.5;
  mouseY = e.clientY / height - 0.5;
  targetSway = mouseX * 25;
});

// ==========================================
// 2. Ambient Stardust & Pollen Particles
// ==========================================
class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.size = Math.random() * 2 + 0.6;
    this.speedY = Math.random() * 0.4 + 0.15;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX + currentSway * 0.02;
    this.pulse += this.pulseSpeed;

    if (this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
    }
  }

  draw(context, progress) {
    const glowingAlpha = (this.alpha * (0.6 + 0.4 * Math.sin(this.pulse))) * (0.4 + progress * 0.6);
    context.save();
    context.fillStyle = `rgba(247, 231, 180, ${glowingAlpha})`;
    context.shadowColor = 'rgba(212, 175, 55, 0.4)';
    context.shadowBlur = 6;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

const particles = Array.from({ length: 50 }, () => new Particle());

// ==========================================
// 3. Scroll Sync & Physics Loop
// ==========================================
function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetScrollProgress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
  
  if (scrollIndicator) {
    scrollIndicator.style.height = `${targetScrollProgress * 100}%`;
  }

  // Trigger final card visibility
  if (targetScrollProgress > 0.88) {
    finalCard.classList.add('visible');
  } else {
    finalCard.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Replay button smooth scroll
if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// 4. Botanical Rendering Engine
// ==========================================

/**
 * Draws the organic curved stem with botanical thickness,
 * bark shading, and natural sway.
 */
function drawStem(progress, sway) {
  if (progress <= 0.02) return null;

  const startX = width / 2;
  const startY = height + 10;
  
  // Stem ascends as progress goes from 0.02 to 0.55
  const growthFactor = Math.min(Math.max((progress - 0.02) / 0.55, 0), 1);
  const easedGrowth = Math.pow(growthFactor, 0.85);

  const targetFlowerY = height * 0.44;
  const currentTipY = startY - (startY - targetFlowerY) * easedGrowth;

  // Organic Bezier curve control points
  const cp1x = startX - 20 + sway * 0.3;
  const cp1y = startY - (startY - currentTipY) * 0.35;
  const cp2x = startX + 30 + sway * 0.7;
  const cp2y = startY - (startY - currentTipY) * 0.75;
  const endX = startX + sway;
  const endY = currentTipY;

  // Stem gradient (Deep botanical forest green with soft ambient highlight)
  const stemGrad = ctx.createLinearGradient(startX, startY, endX, endY);
  stemGrad.addColorStop(0, '#0c1a14');
  stemGrad.addColorStop(0.5, '#1b3b2b');
  stemGrad.addColorStop(1, '#2d5e46');

  ctx.save();
  ctx.strokeStyle = stemGrad;
  ctx.lineWidth = Math.max(6 - (1 - easedGrowth) * 2, 3);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
  ctx.stroke();

  // Subtle stem edge highlight
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Leaves emerging as stem grows
  if (growthFactor > 0.35) {
    const leaf1Factor = Math.min((growthFactor - 0.35) / 0.3, 1);
    drawLeaf(cp1x + 10, cp1y, -1, leaf1Factor, sway * 0.4);
  }
  if (growthFactor > 0.65) {
    const leaf2Factor = Math.min((growthFactor - 0.65) / 0.3, 1);
    drawLeaf(cp2x - 10, cp2y, 1, leaf2Factor, sway * 0.6);
  }

  ctx.restore();

  return { x: endX, y: endY, growthFactor };
}

/**
 * Draws a realistic botanical leaf with central vein.
 */
function drawLeaf(x, y, direction, scale, sway) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((direction * 0.6) + sway * 0.02);
  ctx.scale(direction * scale, scale);

  const leafGrad = ctx.createLinearGradient(0, 0, 70, -25);
  leafGrad.addColorStop(0, '#13281e');
  leafGrad.addColorStop(0.5, '#224d38');
  leafGrad.addColorStop(1, '#347253');

  ctx.fillStyle = leafGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(25, -20, 60, -25, 80, -5);
  ctx.bezierCurveTo(60, 20, 25, 15, 0, 0);
  ctx.fill();

  // Leaf central vein
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(40, -5, 78, -5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws an individual organic petal with realistic curved shading,
 * soft translucent gradients, and subtle velvet highlights.
 */
function drawPetal(x, y, angle, length, width, openRatio, petalHue = 'white') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Curvature expands as openRatio grows
  const effectiveLen = length * (0.3 + 0.7 * openRatio);
  const effectiveWidth = width * (0.2 + 0.8 * openRatio);

  // Petal gradient: Ivory white with soft warm champagne core & subtle rose-gold shadow
  const grad = ctx.createRadialGradient(0, -effectiveLen * 0.3, 5, 0, -effectiveLen * 0.6, effectiveLen);
  if (petalHue === 'sepals') {
    grad.addColorStop(0, '#2d5e46');
    grad.addColorStop(0.7, '#1b3b2b');
    grad.addColorStop(1, '#0e1f17');
  } else {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.4, 'rgba(252, 248, 240, 0.92)');
    grad.addColorStop(0.75, 'rgba(245, 235, 220, 0.85)');
    grad.addColorStop(1, 'rgba(220, 205, 185, 0.7)');
  }

  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 12;

  // Bezier petal shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    -effectiveWidth * 0.8, -effectiveLen * 0.35,
    -effectiveWidth, -effectiveLen * 0.85,
    0, -effectiveLen
  );
  ctx.bezierCurveTo(
    effectiveWidth, -effectiveLen * 0.85,
    effectiveWidth * 0.8, -effectiveLen * 0.35,
    0, 0
  );
  ctx.fill();

  // Subtle translucent rim light on petal edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Central petal spine/fold
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -effectiveLen * 0.75);
  ctx.stroke();

  // Occasional Glistening Dew Drop
  if (openRatio > 0.7 && length > 65) {
    drawDewDrop(effectiveWidth * 0.25, -effectiveLen * 0.55, 3);
  }

  ctx.restore();
}

/**
 * Draws a realistic glistening dew drop with specular light reflex.
 */
function drawDewDrop(dx, dy, radius) {
  ctx.save();
  ctx.translate(dx, dy);

  // Dew drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 1, radius, 0, Math.PI * 2);
  ctx.fill();

  // Dew drop liquid
  const dropGrad = ctx.createRadialGradient(-1, -1, 0.5, 0, 0, radius);
  dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  dropGrad.addColorStop(0.6, 'rgba(220, 240, 255, 0.3)');
  dropGrad.addColorStop(1, 'rgba(150, 180, 200, 0.6)');

  ctx.fillStyle = dropGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Specular flare
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Renders the full multi-layered Camellia / White Rose bloom.
 * Unfolds layer by layer based on scroll progress (0.45 -> 1.0).
 */
function drawFlowerBloom(tipX, tipY, progress, sway) {
  if (progress < 0.35) return;

  // Blooming ratio from 0.45 to 0.95
  const bloomProgress = Math.min(Math.max((progress - 0.45) / 0.5, 0), 1);
  const easedBloom = Math.pow(bloomProgress, 1.2);

  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.rotate(sway * 0.015);

  // Radiant Golden Aura / Background Glow
  if (bloomProgress > 0.1) {
    const auraRadius = (160 + bloomProgress * 120) * (width < 600 ? 0.75 : 1);
    const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, auraRadius);
    auraGrad.addColorStop(0, `rgba(247, 231, 180, ${0.35 * bloomProgress})`);
    auraGrad.addColorStop(0.5, `rgba(212, 175, 55, ${0.12 * bloomProgress})`);
    auraGrad.addColorStop(1, 'rgba(11, 15, 20, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const baseScale = width < 600 ? 0.72 : 1.0;
  ctx.scale(baseScale, baseScale);

  // 1. Outer Green Protective Sepals
  const sepalCount = 5;
  for (let i = 0; i < sepalCount; i++) {
    const angle = (i * (Math.PI * 2 / sepalCount)) + 0.3;
    drawPetal(0, 0, angle, 50, 22, Math.min(easedBloom * 1.3, 1), 'sepals');
  }

  // 2. Layer 1 (Outer Petals - Broad, stately, 7 petals)
  const l1Count = 7;
  const l1Open = Math.min(Math.max((bloomProgress - 0.1) / 0.75, 0), 1);
  for (let i = 0; i < l1Count; i++) {
    const angle = (i * (Math.PI * 2 / l1Count)) + (i % 2 === 0 ? 0.05 : -0.05);
    drawPetal(0, 0, angle, 110, 52, l1Open);
  }

  // 3. Layer 2 (Middle Petals - Elegant, offset, 7 petals)
  const l2Count = 7;
  const l2Open = Math.min(Math.max((bloomProgress - 0.25) / 0.7, 0), 1);
  for (let i = 0; i < l2Count; i++) {
    const angle = (i * (Math.PI * 2 / l2Count)) + (Math.PI / l2Count) + 0.08;
    drawPetal(0, 0, angle, 90, 44, l2Open);
  }

  // 4. Layer 3 (Inner Petals - Delicate, cupping inward, 6 petals)
  const l3Count = 6;
  const l3Open = Math.min(Math.max((bloomProgress - 0.4) / 0.6, 0), 1);
  for (let i = 0; i < l3Count; i++) {
    const angle = (i * (Math.PI * 2 / l3Count)) + 0.25;
    drawPetal(0, 0, angle, 68, 36, l3Open);
  }

  // 5. Flower Core (Golden Stamens & Pollen filaments)
  if (bloomProgress > 0.5) {
    const stamenFactor = Math.min((bloomProgress - 0.5) / 0.5, 1);
    const stamenCount = 28;

    for (let i = 0; i < stamenCount; i++) {
      const angle = (i * (Math.PI * 2 / stamenCount)) + (i * 0.1);
      const dist = (12 + (i % 3) * 6) * stamenFactor;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist;

      // Filament
      ctx.strokeStyle = `rgba(247, 231, 180, ${0.7 * stamenFactor})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      // Golden Anther Tip
      ctx.fillStyle = `rgba(212, 175, 55, ${0.9 * stamenFactor})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing center heart
    const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 16);
    coreGrad.addColorStop(0, `rgba(255, 230, 150, ${0.95 * stamenFactor})`);
    coreGrad.addColorStop(0.6, `rgba(212, 175, 55, ${0.6 * stamenFactor})`);
    coreGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ==========================================
// 5. Main Canvas Render Loop
// ==========================================
function render() {
  // Smooth Interpolation for silky motion
  currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
  currentSway += (targetSway - currentSway) * 0.05;

  // Clear Screen with deep atmospheric vignette
  ctx.clearRect(0, 0, width, height);

  // Background Ambient Radial Vignette
  const bgGrad = ctx.createRadialGradient(
    width / 2 + currentSway * 0.5, height * 0.45, 80,
    width / 2, height / 2, Math.max(width, height) * 0.75
  );
  bgGrad.addColorStop(0, '#15222c');
  bgGrad.addColorStop(0.5, '#0d151c');
  bgGrad.addColorStop(1, '#070a0e');

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw Stardust Particles
  particles.forEach(p => {
    p.update();
    p.draw(ctx, currentScrollProgress);
  });

  // Render Botanical Flower
  const stemData = drawStem(currentScrollProgress, currentSway);
  if (stemData) {
    drawFlowerBloom(stemData.x, stemData.y, currentScrollProgress, currentSway);
  }

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// ==========================================
// 6. Built-in Zen Audio Synthesizer (Web Audio API)
// ==========================================
// Plays serene, gentle meditation chimes & natural harmonic breeze
// without needing any external audio file downloads.
let audioCtx = null;
let isAudioPlaying = false;
let ambientInterval = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playZenChime(freq = 432) {
  if (!audioCtx || !isAudioPlaying) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 3.6);
}

const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Peaceful C Major Pentatonic

function toggleAudio() {
  initAudio();
  isAudioPlaying = !isAudioPlaying;

  if (isAudioPlaying) {
    audioToggle.classList.add('playing');
    playZenChime(pentatonicScale[0]);
    ambientInterval = setInterval(() => {
      const note = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
      playZenChime(note);
    }, 4000);
  } else {
    audioToggle.classList.remove('playing');
    if (ambientInterval) clearInterval(ambientInterval);
  }
}

if (audioToggle) {
  audioToggle.addEventListener('click', toggleAudio);
}
