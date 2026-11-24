/**
 * Pinkie Pie & Mane 6 Y2K Party Live Wallpaper (v3.0 Production Edition)
 * Native Lively Wallpaper & Wallpaper Engine compatible.
 * Procedural Web Audio API, Hardware Monitor, Audio Visualizer,
 * Vector Face Rig, Parallax Gaze Tracking & Daily Y2K Widgets.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SoundFX Module (Procedural Web Audio API - Zero External Dependencies)
     ========================================================================== */

  class SoundFXController {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
      this.isUnlocked = false;

      const savedMute = localStorage.getItem('pinkie_y2k_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }

      const unlock = () => {
        this.init();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.isUnlocked = true;
      } catch (e) {
        console.warn('Web Audio API not supported or blocked:', e);
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('pinkie_y2k_muted', this.isMuted.toString());
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    /** Cute bubbly upward pitch-sweep sine wave (350Hz -> 780Hz) */
    playStickerPop() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    }

    /** Nostalgic two-tone pastel chime (587Hz D5 -> 880Hz A5) */
    playWindowSpawn(delayMs = 0) {
      if (this.isMuted || !this.ctx) return;
      setTimeout(() => {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.15);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880.00, now + 0.06);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(0.35, now + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.06);
        osc2.stop(now + 0.3);
      }, delayMs);
    }

    /** Crisp mechanical retro switch click + soft downward pop */
    playWindowClose() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const oscClick = this.ctx.createOscillator();
      const gainClick = this.ctx.createGain();
      oscClick.type = 'square';
      oscClick.frequency.setValueAtTime(1400, now);
      gainClick.gain.setValueAtTime(0.2, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      oscClick.connect(gainClick);
      gainClick.connect(this.masterGain);
      oscClick.start(now);
      oscClick.stop(now + 0.025);

      const oscPop = this.ctx.createOscillator();
      const gainPop = this.ctx.createGain();
      oscPop.type = 'sine';
      oscPop.frequency.setValueAtTime(620, now + 0.015);
      oscPop.frequency.exponentialRampToValueAtTime(310, now + 0.08);
      gainPop.gain.setValueAtTime(0.3, now + 0.015);
      gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      oscPop.connect(gainPop);
      gainPop.connect(this.masterGain);
      oscPop.start(now + 0.015);
      oscPop.stop(now + 0.09);
    }

    /** Reset sparkle chime sweep */
    playResetSparkle() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const baseNow = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = baseNow + idx * 0.055;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    }

    /** Party Cannon Confetti Boom + Whistle */
    playCannonBoom() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // Low bass impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.25);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);

      // Party whistle sweep
      const whistle = this.ctx.createOscillator();
      const wGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(440, now + 0.05);
      whistle.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
      wGain.gain.setValueAtTime(0.01, now + 0.05);
      wGain.gain.linearRampToValueAtTime(0.3, now + 0.12);
      wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      whistle.connect(wGain);
      wGain.connect(this.masterGain);
      whistle.start(now + 0.05);
      whistle.stop(now + 0.35);
    }

    /** Elements of Harmony Polyphonic Victory Chord */
    playHarmonyChord() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // Majestic chord: C5 (523.25), E5 (659.25), G5 (783.99), B5 (987.77), D6 (1174.66)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.04);
        gain.gain.setValueAtTime(0.01, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.04 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.04);
        osc.stop(now + 1.9);
      });
    }

    /** Pony Switcher Chime */
    playPonySwitchChime(ponyId) {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const pitches = {
        pinkie: [587, 880],
        twilight: [440, 660, 880],
        rainbow: [784, 1174],
        fluttershy: [659, 784],
        rarity: [698, 1046],
        applejack: [392, 587]
      };
      const sequence = pitches[ponyId] || [523, 784];
      sequence.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.22);
      });
    }

    playRainbowDashSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.5);
    }

    playTwilightSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [440, 554, 659, 880, 1108].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.28);
      });
    }

    playFluttershySFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [587, 659, 784, 880].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    }

    playRaritySFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [880, 1174, 1396, 1760].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    }

    playApplejackSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  }

  const soundFX = new SoundFXController();

  /* ==========================================================================
     2. Milestone 1: Static Character Palettes & Configurations
     ========================================================================== */

  const MANE_6_CHARACTERS = {
    pinkie: {
      id: 'pinkie',
      name: 'Pinkie Pie',
      coatColor: '#F6B2D1',
      eyeColor: '#4792B3',
      blushColor: '#FF4F93',
      file: 'assets/pinkie-idle.png',
      cmFile: 'assets/cm-pinkie.png',
      rig: {
        leftEye: { cx: 29.5, cy: 48.5, rx: 9.5, ry: 10.2 },
        rightEye: { cx: 64.5, cy: 48.5, rx: 9.5, ry: 10.2 },
        blushLeft: { cx: 22.5, cy: 57.5, rx: 6.8, ry: 3.8 },
        blushRight: { cx: 69.5, cy: 57.5, rx: 6.8, ry: 3.8 }
      }
    },
    twilight: {
      id: 'twilight',
      name: 'Twilight Sparkle',
      coatColor: '#D19FE8',
      eyeColor: '#662D91',
      blushColor: '#C2185B',
      file: 'assets/twilight.png',
      cmFile: 'assets/cm-twilight.png',
      rig: {
        leftEye: { cx: 34.0, cy: 45.0, rx: 9.0, ry: 9.8 },
        rightEye: { cx: 66.0, cy: 45.0, rx: 9.0, ry: 9.8 },
        blushLeft: { cx: 27.0, cy: 54.0, rx: 6.0, ry: 3.5 },
        blushRight: { cx: 72.0, cy: 54.0, rx: 6.0, ry: 3.5 }
      }
    },
    rainbow: {
      id: 'rainbow',
      name: 'Rainbow Dash',
      coatColor: '#A0D7F7',
      eyeColor: '#BF1868',
      blushColor: '#FF5252',
      file: 'assets/rainbow.png',
      cmFile: 'assets/cm-rainbow.png',
      rig: {
        leftEye: { cx: 32.0, cy: 46.0, rx: 9.2, ry: 10.0 },
        rightEye: { cx: 65.0, cy: 46.0, rx: 9.2, ry: 10.0 },
        blushLeft: { cx: 25.0, cy: 55.0, rx: 6.5, ry: 3.6 },
        blushRight: { cx: 70.0, cy: 55.0, rx: 6.5, ry: 3.6 }
      }
    },
    fluttershy: {
      id: 'fluttershy',
      name: 'Fluttershy',
      coatColor: '#FDF6AF',
      eyeColor: '#39B54A',
      blushColor: '#F48FB1',
      file: 'assets/fluttershy.png',
      cmFile: 'assets/cm-fluttershy.png',
      rig: {
        leftEye: { cx: 31.0, cy: 47.0, rx: 9.5, ry: 10.2 },
        rightEye: { cx: 64.0, cy: 47.0, rx: 9.5, ry: 10.2 },
        blushLeft: { cx: 24.0, cy: 56.0, rx: 6.8, ry: 3.8 },
        blushRight: { cx: 69.0, cy: 56.0, rx: 6.8, ry: 3.8 }
      }
    },
    rarity: {
      id: 'rarity',
      name: 'Rarity',
      coatColor: '#F4F3F8',
      eyeColor: '#2E3192',
      blushColor: '#9575CD',
      file: 'assets/rarity.png',
      cmFile: 'assets/cm-rarity.png',
      rig: {
        leftEye: { cx: 36.0, cy: 46.5, rx: 8.8, ry: 9.8 },
        rightEye: { cx: 63.5, cy: 46.5, rx: 8.8, ry: 9.8 },
        blushLeft: { cx: 30.0, cy: 55.0, rx: 6.2, ry: 3.5 },
        blushRight: { cx: 68.0, cy: 55.0, rx: 6.2, ry: 3.5 }
      }
    },
    applejack: {
      id: 'applejack',
      name: 'Applejack',
      coatColor: '#FDB953',
      eyeColor: '#4A993D',
      blushColor: '#FF7043',
      file: 'assets/applejack.png',
      cmFile: 'assets/cm-applejack.png',
      rig: {
        leftEye: { cx: 33.0, cy: 47.0, rx: 9.5, ry: 10.0 },
        rightEye: { cx: 65.5, cy: 47.0, rx: 9.5, ry: 10.0 },
        blushLeft: { cx: 26.0, cy: 56.0, rx: 6.8, ry: 3.8 },
        blushRight: { cx: 71.0, cy: 56.0, rx: 6.8, ry: 3.8 }
      }
    }
  };

  let currentCharacterId = 'pinkie';

  /* ==========================================================================
     3. Global State & Lively Playback Control
     ========================================================================== */

  let isPaused = false;
  let isChillMode = localStorage.getItem('pony_wallpaper_mode') === 'chill';
  let popupStickerThreshold = 7;
  let animFrameId = null;

  function updatePlaybackPause(shouldPause) {
    isPaused = shouldPause;
    if (isPaused) {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (soundFX.ctx && soundFX.ctx.state === 'running') {
        soundFX.ctx.suspend();
      }
    } else {
      if (soundFX.ctx && soundFX.ctx.state === 'suspended' && soundFX.isUnlocked) {
        soundFX.ctx.resume();
      }
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    }
  }

  document.addEventListener('visibilitychange', () => {
    updatePlaybackPause(document.hidden);
  });

  window.livelyWallpaperPlaybackChanged = function (data) {
    if (data && typeof data.isPaused !== 'undefined') {
      updatePlaybackPause(Boolean(data.isPaused));
    }
  };

  /* ==========================================================================
     4. Custom Y2K Pixel Cursor & Click Particles
     ========================================================================== */

  const cursorEl = document.getElementById('retro-cursor');
  const sparkleContainer = document.getElementById('sparkle-container');
  const rippleContainer = document.getElementById('ripple-container');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastSparkleTime = 0;

  // Parallax Gaze Tracking Targets & Smooth Lerp
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    // Calculate normalized cursor offset from screen center (-1.0 to 1.0)
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetParallaxX = (mouseX - cx) / cx;
    targetParallaxY = (mouseY - cy) / cy;

    const now = performance.now();
    if (now - lastSparkleTime > 32) {
      spawnMouseSparkle(mouseX, mouseY);
      lastSparkleTime = now;
    }
  });

  function spawnMouseSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'mouse-sparkle';
    const jx = (Math.random() - 0.5) * 14;
    const jy = (Math.random() - 0.5) * 14;
    sparkle.style.left = `${x + jx}px`;
    sparkle.style.top = `${y + jy}px`;

    const size = 12 + Math.random() * 10;
    const colors = ['#FF7EB3', '#FFA8CE', '#FFFFFF', '#FFB5D3', '#FF6097', '#9C27B0', '#00D2FF'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    sparkle.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24">
        <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="${color}" />
      </svg>
    `;
    sparkleContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
  }

  function triggerClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
  }

  /* ==========================================================================
     5. Milestone 1: Offscreen Star Cache & GPU Starfield Canvas
     ========================================================================== */

  const starCanvas = document.getElementById('starfield-canvas');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  let starDensity = 42;
  const starSpriteCache = {};

  const STAR_PALETTE = ['#FFFFFF', '#FFD6E7', '#FFB5D3', '#FFA8CE', '#FFE5F1', '#E1BEE7', '#B3E5FC'];
  const STAR_SIZES = [4, 7, 10, 13];

  function preRenderStarCache() {
    STAR_PALETTE.forEach((color) => {
      [4, 5].forEach((spikes) => {
        STAR_SIZES.forEach((sz) => {
          const key = `${color}_${spikes}_${sz}`;
          const pad = 12;
          const w = sz * 2 + pad * 2;
          const h = sz * 2 + pad * 2;

          const off = document.createElement('canvas');
          off.width = w;
          off.height = h;
          const oCtx = off.getContext('2d');

          oCtx.translate(w / 2, h / 2);
          oCtx.beginPath();
          const step = Math.PI / spikes;
          const outerR = sz;
          const innerR = sz * 0.42;

          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const x = Math.cos(i * step) * r;
            const y = Math.sin(i * step) * r;
            if (i === 0) oCtx.moveTo(x, y);
            else oCtx.lineTo(x, y);
          }
          oCtx.closePath();
          oCtx.fillStyle = color;
          oCtx.shadowColor = 'rgba(255, 181, 211, 0.7)';
          oCtx.shadowBlur = 6;
          oCtx.fill();

          starSpriteCache[key] = {
            canvas: off,
            halfW: w / 2,
            halfH: h / 2
          };
        });
      });
    });
  }

  function resizeStarCanvas() {
    const dpr = window.devicePixelRatio || 1;
    starCanvas.width = window.innerWidth * dpr;
    starCanvas.height = window.innerHeight * dpr;
    starCtx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < starDensity; i++) {
      const spikes = Math.random() > 0.4 ? 4 : 5;
      const szIdx = Math.floor(Math.random() * STAR_SIZES.length);
      const sz = STAR_SIZES[szIdx];
      const color = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: -0.2 - Math.random() * 0.4,
        speedY: 0.1 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0.35 + Math.random() * 0.65,
        cacheKey: `${color}_${spikes}_${sz}`
      });
    }
  }

  function renderStars() {
    starCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.speedX;
      s.y += s.speedY;
      s.rotation += s.rotSpeed;

      if (s.x < -20) s.x = window.innerWidth + 20;
      if (s.y > window.innerHeight + 20) s.y = -20;

      const sprite = starSpriteCache[s.cacheKey];
      if (sprite) {
        starCtx.save();
        starCtx.translate(s.x, s.y);
        starCtx.rotate(s.rotation);
        starCtx.globalAlpha = s.alpha;
        starCtx.drawImage(sprite.canvas, -sprite.halfW, -sprite.halfH);
        starCtx.restore();
      }
    }
  }

  /* ==========================================================================
     6. Milestone 3: Center Stage Pony Rig & Dynamic Expression Controller
     ========================================================================== */

  const pinkieCharacter = document.getElementById('pinkie-character');
  const pinkieIdleImg = document.getElementById('pinkie-idle-img');
  const pinkieSvgFallback = document.getElementById('pinkie-svg-fallback');
  const stickerSurface = document.getElementById('sticker-surface');

  const rigPatchLeft = document.getElementById('rig-eye-patch-left');
  const rigPatchRight = document.getElementById('rig-eye-patch-right');
  const rigBlushLeft = document.getElementById('rig-blush-left');
  const rigBlushRight = document.getElementById('rig-blush-right');
  const rigStarEyeLeft = document.getElementById('rig-star-eye-left');
  const rigStarEyeRight = document.getElementById('rig-star-eye-right');

  let exprTimeout = null;
  let lastClickTime = 0;
  let useSvgFallback = false;

  function switchMainCharacter(ponyId) {
    const char = MANE_6_CHARACTERS[ponyId];
    if (!char) return;
    currentCharacterId = ponyId;

    document.body.dataset.pony = ponyId;
    document.documentElement.style.setProperty('--character-coat-color', char.coatColor);
    document.documentElement.style.setProperty('--character-eye-color', char.eyeColor);

    // Update main image
    pinkieIdleImg.src = char.file;
    pinkieIdleImg.alt = char.name;

    // Adapt Vector Face Rig coordinates
    if (rigPatchLeft && rigPatchRight && char.rig) {
      rigPatchLeft.setAttribute('cx', char.rig.leftEye.cx);
      rigPatchLeft.setAttribute('cy', char.rig.leftEye.cy);
      rigPatchLeft.setAttribute('rx', char.rig.leftEye.rx);
      rigPatchLeft.setAttribute('ry', char.rig.leftEye.ry);

      rigPatchRight.setAttribute('cx', char.rig.rightEye.cx);
      rigPatchRight.setAttribute('cy', char.rig.rightEye.cy);
      rigPatchRight.setAttribute('rx', char.rig.rightEye.rx);
      rigPatchRight.setAttribute('ry', char.rig.rightEye.ry);

      if (rigBlushLeft && rigBlushRight && char.rig.blushLeft) {
        rigBlushLeft.setAttribute('cx', char.rig.blushLeft.cx);
        rigBlushLeft.setAttribute('cy', char.rig.blushLeft.cy);
        rigBlushRight.setAttribute('cx', char.rig.blushRight.cx);
        rigBlushRight.setAttribute('cy', char.rig.blushRight.cy);
      }
    }

    // Update dock active buttons
    const dockButtons = document.querySelectorAll('.pony-dock-btn');
    dockButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.pony === ponyId);
    });

    soundFX.playPonySwitchChime(ponyId);
    executeSignatureEffect(ponyId);
  }

  function clearAllExpressions() {
    pinkieCharacter.classList.remove('expr-blink', 'expr-happy', 'expr-wink', 'expr-starry');
  }

  function triggerPonyReaction(forcedExpr = null) {
    pinkieCharacter.classList.remove('pinkie-squish');
    void pinkieCharacter.offsetWidth;
    pinkieCharacter.classList.add('pinkie-squish');

    const now = performance.now();
    let chosenExpr = forcedExpr;
    if (!chosenExpr) {
      chosenExpr = (now - lastClickTime < 550) ? 'wink' : 'happy';
    }
    lastClickTime = now;

    clearAllExpressions();
    pinkieCharacter.classList.add(`expr-${chosenExpr}`);

    if (useSvgFallback) {
      const normalEyes = document.getElementById('svg-normal-eyes');
      const closedEyes = document.getElementById('svg-closed-eyes');
      if (normalEyes && closedEyes) {
        normalEyes.style.display = 'none';
        closedEyes.style.display = 'block';
      }
    }

    clearTimeout(exprTimeout);
    exprTimeout = setTimeout(() => {
      clearAllExpressions();
      if (useSvgFallback) {
        const normalEyes = document.getElementById('svg-normal-eyes');
        const closedEyes = document.getElementById('svg-closed-eyes');
        if (normalEyes && closedEyes) {
          normalEyes.style.display = 'block';
          closedEyes.style.display = 'none';
        }
      }
    }, chosenExpr === 'starry' ? 1200 : 450);
  }

  // Idle natural blink timer (checked against isPaused)
  setInterval(() => {
    if (isPaused) return;
    const isBusy =
      pinkieCharacter.classList.contains('expr-happy') ||
      pinkieCharacter.classList.contains('expr-wink') ||
      pinkieCharacter.classList.contains('expr-starry');

    if (!isBusy) {
      pinkieCharacter.classList.add('expr-blink');
      setTimeout(() => {
        pinkieCharacter.classList.remove('expr-blink');
      }, 160);
    }
  }, 3800);

  pinkieIdleImg.addEventListener('error', () => {
    useSvgFallback = true;
    const rigFrame = document.getElementById('pinkie-rig-frame');
    if (rigFrame) rigFrame.style.display = 'none';
    pinkieSvgFallback.style.display = 'flex';
  });

  /* ==========================================================================
     7. Milestone 3: Interactive Sticker Slapping, Harmony Combo & Party Cannon
     ========================================================================== */

  const STICKER_CONFIGS = [
    { type: 'star', file: 'assets/sticker-star.png' },
    { type: 'cm-pinkie', file: 'assets/cm-pinkie.png', isCutieMark: true, pony: 'pinkie' },
    { type: 'swirl', file: 'assets/sticker-swirl.png' },
    { type: 'cm-twilight', file: 'assets/cm-twilight.png', isCutieMark: true, pony: 'twilight' },
    { type: 'bone', file: 'assets/sticker-bone.png' },
    { type: 'cm-rainbow', file: 'assets/cm-rainbow.png', isCutieMark: true, pony: 'rainbow' },
    { type: 'cat', file: 'assets/sticker-cat.png' },
    { type: 'cm-fluttershy', file: 'assets/cm-fluttershy.png', isCutieMark: true, pony: 'fluttershy' },
    { type: 'bow', file: 'assets/sticker-bow.png' },
    { type: 'cm-rarity', file: 'assets/cm-rarity.png', isCutieMark: true, pony: 'rarity' },
    { type: 'heart', file: 'assets/sticker-heart.png' },
    { type: 'cm-applejack', file: 'assets/cm-applejack.png', isCutieMark: true, pony: 'applejack' }
  ];

  let stickerCycleIndex = 0;
  let currentStickerCount = 0;
  const activeRoundCutieMarks = new Set();
  let isCascadeActive = false;

  stickerSurface.addEventListener('pointerdown', (e) => {
    if (isCascadeActive) return;

    soundFX.init();

    const rect = stickerSurface.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    triggerClickRipple(e.clientX, e.clientY);
    triggerPonyReaction();
    soundFX.playStickerPop();

    slapSticker(pctX, pctY);
  });

  function slapSticker(pctX, pctY) {
    const config = STICKER_CONFIGS[stickerCycleIndex % STICKER_CONFIGS.length];
    stickerCycleIndex++;
    currentStickerCount++;

    if (config.isCutieMark && config.pony) {
      activeRoundCutieMarks.add(config.pony);
    }

    const rotation = (Math.random() - 0.5) * 44;
    const el = document.createElement('div');
    el.className = 'slapped-sticker';
    el.style.left = `${pctX}%`;
    el.style.top = `${pctY}%`;
    el.style.setProperty('--rot', `${rotation}deg`);

    const img = document.createElement('img');
    img.src = config.file;
    img.alt = config.type;
    img.draggable = false;
    el.appendChild(img);

    stickerSurface.appendChild(el);

    // Check Milestone 3: Elements of Harmony Combo (All 6 Mane 6 cutie marks placed!)
    if (activeRoundCutieMarks.size === 6) {
      triggerElementsOfHarmonyCombo();
      return;
    }

    // Check Popup Threshold in Party Mode (Chill mode suppresses disruptive popup cascade)
    if (!isChillMode && currentStickerCount >= popupStickerThreshold) {
      isCascadeActive = true;
      setTimeout(() => {
        triggerRetroWindowCascade();
      }, 350);
    }
  }

  /** Milestone 3: Full-Screen 6-Color Rainbow Combo */
  function triggerElementsOfHarmonyCombo() {
    soundFX.playHarmonyChord();
    triggerPonyReaction('starry');

    const comboOverlay = document.getElementById('harmony-combo-container');
    if (comboOverlay) {
      comboOverlay.classList.add('active');
      setTimeout(() => {
        comboOverlay.classList.remove('active');
        activeRoundCutieMarks.clear();
      }, 3400);
    }
    triggerCelebrationBurst();
  }

  /** Milestone 3: Party Cannon Reset with Parabolic Physics Flight */
  function triggerPartyCannonReset() {
    soundFX.playCannonBoom();

    const stickers = Array.from(stickerSurface.querySelectorAll('.slapped-sticker'));
    if (stickers.length === 0) {
      triggerCelebrationBurst();
      return;
    }

    stickers.forEach((st) => {
      const rect = st.getBoundingClientRect();
      st.classList.add('cannon-projectile');
      st.style.left = `${rect.left}px`;
      st.style.top = `${rect.top}px`;
      document.body.appendChild(st);

      let px = rect.left;
      let py = rect.top;
      let vx = (Math.random() - 0.5) * 22;
      let vy = -12 - Math.random() * 14;
      let rot = 0;
      const rotSpeed = (Math.random() - 0.5) * 20;
      const gravity = 0.88;

      function stepProjectile() {
        if (isPaused) {
          requestAnimationFrame(stepProjectile);
          return;
        }
        px += vx;
        py += vy;
        vy += gravity;
        rot += rotSpeed;

        st.style.left = `${px}px`;
        st.style.top = `${py}px`;
        st.style.transform = `rotate(${rot}deg) scale(1.1)`;

        if (py < window.innerHeight + 100) {
          requestAnimationFrame(stepProjectile);
        } else {
          st.remove();
        }
      }
      requestAnimationFrame(stepProjectile);
    });

    currentStickerCount = 0;
    activeRoundCutieMarks.clear();
    isCascadeActive = false;
    triggerCelebrationBurst();
    triggerPonyReaction();
  }

  /* ==========================================================================
     8. Milestone 2: Retro Windows 95/98 Pop-up Cascades & Drag Controller
     ========================================================================== */

  const windowOverlay = document.getElementById('window-overlay');
  let openWindows = [];
  let highestZIndex = 510;

  const MANE_6_CAMEOS = [
    {
      id: 'twilight',
      name: 'Twilight Sparkle',
      icon: '🔮',
      title: '🔮 · Twilight_Library.sys',
      themeClass: 'titlebar-twilight',
      file: 'assets/twilight.png'
    },
    {
      id: 'rainbow',
      name: 'Rainbow Dash',
      icon: '⚡',
      title: '⚡ · Sonic_Rainboom.avi',
      themeClass: 'titlebar-rainbow',
      file: 'assets/rainbow.png'
    },
    {
      id: 'fluttershy',
      name: 'Fluttershy',
      icon: '🌸',
      title: '🌸 · Kindness_Vibes.exe',
      themeClass: 'titlebar-fluttershy',
      file: 'assets/fluttershy.png'
    },
    {
      id: 'rarity',
      name: 'Rarity',
      icon: '💎',
      title: '💎 · Fabulous_Design.exe',
      themeClass: 'titlebar-rarity',
      file: 'assets/rarity.png'
    },
    {
      id: 'applejack',
      name: 'Applejack',
      icon: '🍎',
      title: '🍎 · Sweet_Apple_Acres.bat',
      themeClass: 'titlebar-applejack',
      file: 'assets/applejack.png'
    }
  ];

  function triggerRetroWindowCascade() {
    const cascadeTotal = 5;
    const startLeft = Math.max(16, (window.innerWidth - 380) * 0.15);
    const startTop = Math.max(20, (window.innerHeight - 300) * 0.12);
    const stepX = Math.min(38, (window.innerWidth - 380) / 7);
    const stepY = Math.min(36, (window.innerHeight - 300) / 7);

    for (let i = 0; i < cascadeTotal; i++) {
      const isCameo = i % 2 === 1;
      const type = isCameo ? 'cameo' : (i === cascadeTotal - 1 ? 'alert' : 'pinkie');
      const left = startLeft + i * stepX + (Math.random() - 0.5) * 16;
      const top = startTop + i * stepY + (Math.random() - 0.5) * 12;

      setTimeout(() => {
        if (!isCascadeActive) return;
        const win = createRetroWindow(type, left, top);
        windowOverlay.appendChild(win);
        openWindows.push(win);
        soundFX.playWindowSpawn();
        requestAnimationFrame(() => win.classList.add('is-open'));
      }, i * 140);
    }
  }

  function createRetroWindow(type, posX, posY) {
    const win = document.createElement('div');
    win.className = 'retro-window';
    win.style.left = `${posX}px`;
    win.style.top = `${posY}px`;
    win.style.zIndex = highestZIndex++;

    const titleBar = document.createElement('div');
    titleBar.className = 'retro-window-titlebar';

    const titleText = document.createElement('div');
    titleText.className = 'retro-title-text';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'retro-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close Window');
    closeBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      closeRetroWindow(win);
    });

    const winBody = document.createElement('div');

    if (type === 'pinkie') {
      titleBar.classList.add('titlebar-pinkie');
      titleText.innerHTML = '<span class="retro-title-icon">🎈</span><span>PinkieParty_32.dll</span>';

      winBody.className = 'retro-window-body';
      const img = document.createElement('img');
      img.className = 'popup-pinkie-closeup';
      img.src = 'assets/pinkie-idle.png';
      img.alt = 'Pinkie Pie Face';
      winBody.appendChild(img);

      const scan = document.createElement('div');
      scan.className = 'retro-scanlines';
      winBody.appendChild(scan);

    } else if (type === 'cameo') {
      const cameo = MANE_6_CAMEOS[Math.floor(Math.random() * MANE_6_CAMEOS.length)];
      titleBar.classList.add(cameo.themeClass);
      titleText.innerHTML = `<span class="retro-title-icon">${cameo.icon}</span><span>${cameo.title}</span>`;

      winBody.className = 'retro-window-body';
      const guestImg = document.createElement('img');
      guestImg.className = 'popup-guest-pony';
      guestImg.src = cameo.file;
      guestImg.alt = cameo.name;
      winBody.appendChild(guestImg);

    } else {
      win.classList.add('window-alert');
      titleBar.classList.add('titlebar-alert');
      titleText.innerHTML = '<span class="retro-title-icon">⚠️</span><span>PARTY_OVERFLOW.SYS</span>';

      winBody.className = 'retro-alert-body';
      const content = document.createElement('div');
      content.className = 'retro-alert-content';
      content.innerHTML = `
        <span class="retro-alert-icon">🧁</span>
        <div class="retro-alert-msg">PARTY QUOTA EXCEEDED!<br>Equestrian friendship overload in sector 7!</div>
      `;
      const okBtn = document.createElement('button');
      okBtn.type = 'button';
      okBtn.className = 'retro-alert-btn';
      okBtn.textContent = 'Party On!';
      okBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        closeRetroWindow(win);
      });
      winBody.appendChild(content);
      winBody.appendChild(okBtn);
    }

    titleBar.appendChild(titleText);
    titleBar.appendChild(closeBtn);
    win.appendChild(titleBar);
    win.appendChild(winBody);

    makeElementDraggable(win, titleBar);
    return win;
  }

  function makeElementDraggable(win, handle) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initLeft = 0, initTop = 0;

    const onPointerDown = (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      isDragging = true;
      win.classList.add('is-dragging');
      highestZIndex++;
      win.style.zIndex = highestZIndex;

      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initLeft = rect.left;
      initTop = rect.top;

      win.style.left = `${initLeft}px`;
      win.style.top = `${initTop}px`;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initLeft + dx;
      let newTop = initTop + dy;
      const winW = win.offsetWidth || 280;
      const winH = win.offsetHeight || 220;

      newLeft = Math.max(5, Math.min(window.innerWidth - winW - 5, newLeft));
      newTop = Math.max(5, Math.min(window.innerHeight - winH - 5, newTop));

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      win.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    handle.addEventListener('pointerdown', onPointerDown);
  }

  function closeRetroWindow(win) {
    soundFX.playWindowClose();
    win.classList.remove('is-open');
    win.classList.add('is-closing');
    openWindows = openWindows.filter((w) => w !== win);

    setTimeout(() => {
      win.remove();
      if (openWindows.length === 0) {
        completeLoopReset();
      }
    }, 240);
  }

  function completeLoopReset() {
    triggerRandomSignatureEffect();
    triggerCelebrationBurst();
    triggerPartyCannonReset();
  }

  /* ==========================================================================
     9. Milestone 2: Real-Time Audio Visualizer (Winamp Style)
     ========================================================================== */

  const winampVisualizer = document.getElementById('winamp-visualizer');
  const winampCanvas = document.getElementById('winamp-canvas');
  const winampCtx = winampCanvas.getContext('2d');
  const winampBpm = document.getElementById('winamp-bpm');
  const btnWinampMin = document.getElementById('btn-winamp-min');
  const btnWinampSim = document.getElementById('btn-winamp-sim');
  const btnVisualizerToggle = document.getElementById('btn-visualizer-toggle');

  let audioSpectrumData = new Float32Array(128);
  let isSimulatingAudio = false;
  let lastAudioTick = 0;

  btnWinampMin.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    winampVisualizer.classList.toggle('is-minimized');
  });

  btnVisualizerToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const isHidden = winampVisualizer.style.display === 'none';
    winampVisualizer.style.display = isHidden ? 'block' : 'none';
    btnVisualizerToggle.classList.toggle('active', isHidden);
  });

  btnWinampSim.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    isSimulatingAudio = !isSimulatingAudio;
    btnWinampSim.textContent = isSimulatingAudio ? 'SIM ACTIVE' : 'SIM TEST';
  });

  makeElementDraggable(winampVisualizer, document.getElementById('winamp-titlebar'));

  // Native Lively Wallpaper Audio Listener (128 Frequency Bands)
  window.livelyAudioListener = function (audioArray) {
    if (audioArray && audioArray.length > 0) {
      lastAudioTick = performance.now();
      const len = Math.min(audioArray.length, audioSpectrumData.length);
      for (let i = 0; i < len; i++) {
        audioSpectrumData[i] = audioArray[i];
      }
      processAudioBass();
    }
  };

  function processAudioBass() {
    let bassSum = 0;
    const bassBins = 16;
    for (let i = 0; i < bassBins; i++) {
      bassSum += audioSpectrumData[i] || 0;
    }
    const bassAvg = bassSum / bassBins; // 0.0 to 1.0

    // Drive Character Bounce & Scale
    const bounceY = -bassAvg * 18;
    const scaleAmp = 1 + bassAvg * 0.08;
    const glowAmp = bassAvg * 16;

    document.documentElement.style.setProperty('--bass-bounce', `${bounceY}px`);
    document.documentElement.style.setProperty('--bass-scale', scaleAmp.toString());
    document.documentElement.style.setProperty('--bass-glow', `${glowAmp}px`);

    winampBpm.textContent = `BASS: ${Math.round(bassAvg * 100)}%`;
  }

  function renderWinampEQ() {
    const w = winampCanvas.width;
    const h = winampCanvas.height;
    winampCtx.clearRect(0, 0, w, h);

    // If simulation mode or idle without active Lively audio
    const now = performance.now();
    if (isSimulatingAudio || (now - lastAudioTick > 2000 && !isPaused)) {
      for (let i = 0; i < audioSpectrumData.length; i++) {
        const freq = (i + 1) * 0.15;
        const val = (Math.sin(now * 0.006 + freq) * 0.5 + 0.5) * (1 - i / 128);
        audioSpectrumData[i] = Math.max(0.05, val * (isSimulatingAudio ? 0.9 : 0.25));
      }
      processAudioBass();
    }

    const bars = 24;
    const barWidth = Math.floor(w / bars) - 2;
    const step = Math.floor(128 / bars);

    for (let i = 0; i < bars; i++) {
      const val = audioSpectrumData[i * step] || 0;
      const barHeight = Math.max(3, Math.min(h - 2, val * (h - 2)));
      const x = i * (barWidth + 2) + 2;
      const y = h - barHeight;

      // Classic Winamp LED Segment Gradient: Green -> Yellow -> Red
      const grad = winampCtx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0.0, '#00FF66');
      grad.addColorStop(0.6, '#FFFF00');
      grad.addColorStop(1.0, '#FF0033');

      winampCtx.fillStyle = grad;
      winampCtx.fillRect(x, y, barWidth, barHeight);
    }
  }

  /* ==========================================================================
     10. Milestone 2: Live Hardware Monitor (Ponyville_TaskMgr.exe)
     ========================================================================== */

  const taskmgrWindow = document.getElementById('taskmgr-window');
  const btnTaskmgrToggle = document.getElementById('btn-taskmgr-toggle');
  const btnTaskmgrClose = document.getElementById('btn-taskmgr-close');
  const taskmgrTitlebar = document.getElementById('taskmgr-titlebar');
  const taskmgrCpuVal = document.getElementById('taskmgr-cpu-val');
  const taskmgrCpuCanvas = document.getElementById('taskmgr-cpu-canvas');
  const taskmgrCpuCtx = taskmgrCpuCanvas.getContext('2d');
  const taskmgrRamVal = document.getElementById('taskmgr-ram-val');
  const taskmgrRamFill = document.getElementById('taskmgr-ram-fill');
  const taskmgrGpuVal = document.getElementById('taskmgr-gpu-val');
  const taskmgrGpuFill = document.getElementById('taskmgr-gpu-fill');

  const cpuHistory = new Array(36).fill(12);

  btnTaskmgrToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const isHidden = taskmgrWindow.style.display === 'none';
    taskmgrWindow.style.display = isHidden ? 'flex' : 'none';
    btnTaskmgrToggle.classList.toggle('active', isHidden);
    if (isHidden) {
      taskmgrWindow.style.left = `${Math.max(20, (window.innerWidth - 380) * 0.5)}px`;
      taskmgrWindow.style.top = `${Math.max(20, (window.innerHeight - 300) * 0.4)}px`;
    }
  });

  btnTaskmgrClose.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    taskmgrWindow.style.display = 'none';
    btnTaskmgrToggle.classList.remove('active');
  });

  makeElementDraggable(taskmgrWindow, taskmgrTitlebar);

  // Native Lively Hardware Information Listener
  window.livelySystemInformation = function (data) {
    if (!data) return;
    let parsed = data;
    if (typeof data === 'string') {
      try { parsed = JSON.parse(data); } catch (e) { return; }
    }

    const cpu = Math.round(parsed.CurrentCpu || parsed.cpuUsage || parsed.cpu || 0);
    const ram = Math.round(
      parsed.CurrentRam && parsed.TotalRam
        ? (parsed.CurrentRam / parsed.TotalRam) * 100
        : (parsed.ramUsage || parsed.memory || 45)
    );
    const gpu = Math.round(parsed.CurrentGpu3D || parsed.gpuUsage || parsed.gpu || 22);

    updateTaskMgrUI(cpu, ram, gpu);
  };

  function updateTaskMgrUI(cpu, ram, gpu) {
    taskmgrCpuVal.textContent = `${cpu}%`;
    taskmgrRamVal.textContent = `${ram}%`;
    taskmgrRamFill.style.width = `${ram}%`;
    taskmgrGpuVal.textContent = `${gpu}%`;
    taskmgrGpuFill.style.width = `${gpu}%`;

    cpuHistory.push(cpu);
    if (cpuHistory.length > 36) cpuHistory.shift();
    renderCpuGraph();
  }

  function renderCpuGraph() {
    const w = taskmgrCpuCanvas.width;
    const h = taskmgrCpuCanvas.height;
    taskmgrCpuCtx.fillStyle = '#000000';
    taskmgrCpuCtx.fillRect(0, 0, w, h);

    // Green CRT oscilloscope grid
    taskmgrCpuCtx.strokeStyle = 'rgba(0, 150, 0, 0.35)';
    taskmgrCpuCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      taskmgrCpuCtx.beginPath();
      taskmgrCpuCtx.moveTo(x, 0);
      taskmgrCpuCtx.lineTo(x, h);
      taskmgrCpuCtx.stroke();
    }
    for (let y = 0; y < h; y += 15) {
      taskmgrCpuCtx.beginPath();
      taskmgrCpuCtx.moveTo(0, y);
      taskmgrCpuCtx.lineTo(w, y);
      taskmgrCpuCtx.stroke();
    }

    // Oscilloscope CPU trace
    taskmgrCpuCtx.strokeStyle = '#00FF66';
    taskmgrCpuCtx.lineWidth = 2;
    taskmgrCpuCtx.beginPath();
    const stepX = w / (cpuHistory.length - 1);
    cpuHistory.forEach((val, i) => {
      const cx = i * stepX;
      const cy = h - (val / 100) * (h - 6) - 3;
      if (i === 0) taskmgrCpuCtx.moveTo(cx, cy);
      else taskmgrCpuCtx.lineTo(cx, cy);
    });
    taskmgrCpuCtx.stroke();
  }

  // Standalone simulated hardware metrics ticker
  setInterval(() => {
    if (isPaused) return;
    const simCpu = Math.max(5, Math.min(95, Math.round(15 + Math.random() * 25 + Math.sin(Date.now() * 0.001) * 10)));
    const simRam = Math.max(30, Math.min(85, Math.round(44 + Math.sin(Date.now() * 0.0005) * 6)));
    const simGpu = Math.max(8, Math.min(75, Math.round(20 + Math.random() * 18)));
    updateTaskMgrUI(simCpu, simRam, simGpu);
  }, 1000);

  /* ==========================================================================
     11. Milestone 4: Daily Y2K Productivity Widgets (Clock & To-Do)
     ========================================================================== */

  const widgetClock = document.getElementById('widget-clock');
  const widgetTodo = document.getElementById('widget-todo');
  const btnWidgetsToggle = document.getElementById('btn-widgets-toggle');
  const btnClockClose = document.getElementById('btn-clock-close');
  const btnTodoClose = document.getElementById('btn-todo-close');

  btnWidgetsToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const isHidden = widgetClock.style.display === 'none';
    widgetClock.style.display = isHidden ? 'block' : 'none';
    widgetTodo.style.display = isHidden ? 'block' : 'none';
    btnWidgetsToggle.classList.toggle('active', isHidden);
    if (isHidden) {
      widgetClock.style.left = '24px';
      widgetClock.style.top = '36px';
      widgetTodo.style.left = `${window.innerWidth - 320}px`;
      widgetTodo.style.top = '36px';
    }
  });

  btnClockClose.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    widgetClock.style.display = 'none';
  });

  btnTodoClose.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    widgetTodo.style.display = 'none';
  });

  makeElementDraggable(widgetClock, document.getElementById('widget-clock-titlebar'));
  makeElementDraggable(widgetTodo, document.getElementById('widget-todo-titlebar'));

  // Clock & Calendar Logic
  const clockDigitalTime = document.getElementById('clock-digital-time');
  const clockDigitalDate = document.getElementById('clock-digital-date');
  const miniCalendarBody = document.getElementById('mini-calendar-body');

  function updateClockDisplay() {
    const now = new Date();
    clockDigitalTime.textContent = now.toLocaleTimeString();
    clockDigitalDate.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function renderMiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    miniCalendarBody.innerHTML = '';
    let row = document.createElement('tr');

    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
        miniCalendarBody.appendChild(row);
        row = document.createElement('tr');
      }
      const cell = document.createElement('td');
      cell.textContent = day;
      if (day === today) cell.className = 'today';
      row.appendChild(cell);
    }
    miniCalendarBody.appendChild(row);
  }

  updateClockDisplay();
  renderMiniCalendar();
  setInterval(updateClockDisplay, 1000);

  // Persistent To-Do List
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoCounter = document.getElementById('todo-counter');
  const btnTodoClear = document.getElementById('btn-todo-clear');

  let todos = [];
  try {
    const saved = localStorage.getItem('pony_todos');
    if (saved) todos = JSON.parse(saved);
  } catch (e) {
    todos = [];
  }

  if (todos.length === 0) {
    todos = [
      { id: 1, text: 'Bake cupcakes for Pinkie', done: true },
      { id: 2, text: 'Organize library with Twilight', done: false }
    ];
  }

  function saveAndRenderTodos() {
    localStorage.setItem('pony_todos', JSON.stringify(todos));
    todoList.innerHTML = '';

    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.done ? 'completed' : ''}`;

      const label = document.createElement('label');
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = todo.done;
      chk.addEventListener('change', () => {
        todo.done = chk.checked;
        saveAndRenderTodos();
      });

      const span = document.createElement('span');
      span.textContent = todo.text;

      label.appendChild(chk);
      label.appendChild(span);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'todo-del-btn';
      delBtn.textContent = '×';
      delBtn.setAttribute('aria-label', `Delete task: ${todo.text}`);
      delBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        todos = todos.filter((t) => t.id !== todo.id);
        saveAndRenderTodos();
      });

      li.appendChild(label);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });

    const doneCount = todos.filter((t) => t.done).length;
    todoCounter.textContent = `${doneCount} of ${todos.length} completed`;
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = todoInput.value.trim();
    if (!val) return;
    todos.push({
      id: Date.now(),
      text: val,
      done: false
    });
    todoInput.value = '';
    saveAndRenderTodos();
  });

  btnTodoClear.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    todos = todos.filter((t) => !t.done);
    saveAndRenderTodos();
  });

  saveAndRenderTodos();

  /* ==========================================================================
     12. Milestone 4: Mode Toggle (Party Mode vs Chill Mode)
     ========================================================================== */

  const btnModeToggle = document.getElementById('btn-mode-toggle');
  const iconModeParty = document.getElementById('icon-mode-party');
  const iconModeChill = document.getElementById('icon-mode-chill');

  function updateModeUI() {
    document.body.classList.toggle('chill-mode', isChillMode);
    if (isChillMode) {
      iconModeParty.style.display = 'none';
      iconModeChill.style.display = 'block';
    } else {
      iconModeParty.style.display = 'block';
      iconModeChill.style.display = 'none';
    }
    localStorage.setItem('pony_wallpaper_mode', isChillMode ? 'chill' : 'party');
  }

  btnModeToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    isChillMode = !isChillMode;
    updateModeUI();
    soundFX.playStickerPop();
  });

  updateModeUI();

  /* ==========================================================================
     13. Milestone 3: Mane 6 Fullscreen Signature Screen Effects
     ========================================================================== */

  const signatureEffectsContainer = document.getElementById('signature-effects-container');
  const resetBurstContainer = document.getElementById('reset-burst-container');

  function triggerRandomSignatureEffect() {
    const effects = ['rainbow', 'twilight', 'fluttershy', 'rarity', 'applejack'];
    const chosen = effects[Math.floor(Math.random() * effects.length)];
    executeSignatureEffect(chosen);
  }

  function executeSignatureEffect(name) {
    signatureEffectsContainer.innerHTML = '';

    if (name === 'rainbow') {
      soundFX.playRainbowDashSFX();
      const streak = document.createElement('div');
      streak.className = 'rd-rainbow-streak';
      signatureEffectsContainer.appendChild(streak);

      const shockwave = document.createElement('div');
      shockwave.className = 'rd-shockwave';
      signatureEffectsContainer.appendChild(shockwave);
      setTimeout(() => { signatureEffectsContainer.innerHTML = ''; }, 950);

    } else if (name === 'twilight') {
      soundFX.playTwilightSFX();
      const glow = document.createElement('div');
      glow.className = 'twi-aura-glow';
      signatureEffectsContainer.appendChild(glow);

      const ring = document.createElement('div');
      ring.className = 'twi-magic-ring';
      const starCount = 14;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'twi-orbit-star';
        const angle = (i / starCount) * Math.PI * 2;
        const dist = 220 + Math.random() * 260;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 720;
        star.style.setProperty('--tx', `${tx}px`);
        star.style.setProperty('--ty', `${ty}px`);
        star.style.setProperty('--rot', `${rot}deg`);

        const sz = 32 + Math.random() * 20;
        star.innerHTML = `
          <svg width="${sz}" height="${sz}" viewBox="0 0 100 100">
            <polygon points="50,0 60,38 100,50 60,62 50,100 40,62 0,50 40,38" fill="#FFF9A6" stroke="#9C27B0" stroke-width="4"/>
          </svg>
        `;
        ring.appendChild(star);
      }
      signatureEffectsContainer.appendChild(ring);
      setTimeout(() => { signatureEffectsContainer.innerHTML = ''; }, 1300);

    } else if (name === 'fluttershy') {
      soundFX.playFluttershySFX();
      const count = 12;
      for (let i = 0; i < count; i++) {
        const bf = document.createElement('div');
        bf.className = 'fs-butterfly';
        const sx = Math.random() * window.innerWidth * 0.8;
        const sy = window.innerHeight + 40;
        const ex = sx + (Math.random() - 0.5) * 350;
        const ey = -80;
        const dur = 2.0 + Math.random() * 1.0;
        const scale = 0.75 + Math.random() * 0.5;

        bf.style.setProperty('--sx', `${sx}px`);
        bf.style.setProperty('--sy', `${sy}px`);
        bf.style.setProperty('--ex', `${ex}px`);
        bf.style.setProperty('--ey', `${ey}px`);
        bf.style.setProperty('--duration', `${dur}s`);
        bf.style.setProperty('--sc', scale.toString());

        bf.innerHTML = `
          <div class="fs-wing-flap">
            <svg width="42" height="42" viewBox="0 0 100 100">
              <ellipse cx="36" cy="40" rx="28" ry="18" fill="#00E5FF" opacity="0.85" transform="rotate(-30 36 40)"/>
              <ellipse cx="64" cy="40" rx="28" ry="18" fill="#00E5FF" opacity="0.85" transform="rotate(30 64 40)"/>
              <ellipse cx="40" cy="62" rx="20" ry="12" fill="#FF4081" opacity="0.75" transform="rotate(-20 40 62)"/>
              <ellipse cx="60" cy="62" rx="20" ry="12" fill="#FF4081" opacity="0.75" transform="rotate(20 60 62)"/>
              <line x1="50" y1="20" x2="50" y2="78" stroke="#333" stroke-width="5" stroke-linecap="round"/>
            </svg>
          </div>
        `;
        signatureEffectsContainer.appendChild(bf);
      }
      setTimeout(() => { signatureEffectsContainer.innerHTML = ''; }, 3200);

    } else if (name === 'rarity') {
      soundFX.playRaritySFX();
      const count = 16;
      for (let i = 0; i < count; i++) {
        const dia = document.createElement('div');
        dia.className = 'rarity-diamond';
        const dx = Math.random() * window.innerWidth;
        const fallDur = 1.4 + Math.random() * 0.8;
        const drift = (Math.random() - 0.5) * 160;
        const ds = 0.6 + Math.random() * 0.7;

        dia.style.setProperty('--dx', `${dx}px`);
        dia.style.setProperty('--fall-dur', `${fallDur}s`);
        dia.style.setProperty('--drift', `${drift}px`);
        dia.style.setProperty('--ds', ds.toString());

        dia.innerHTML = `
          <svg width="44" height="44" viewBox="0 0 100 100">
            <polygon points="50,5 95,50 50,95 5,50" fill="#E1F5FE" stroke="#0288D1" stroke-width="4"/>
            <polygon points="50,22 78,50 50,78 22,50" fill="#FFFFFF" opacity="0.85"/>
          </svg>
        `;
        signatureEffectsContainer.appendChild(dia);
      }
      setTimeout(() => { signatureEffectsContainer.innerHTML = ''; }, 2400);

    } else if (name === 'applejack') {
      soundFX.playApplejackSFX();
      const appleCount = 8;
      for (let i = 0; i < appleCount; i++) {
        const apple = document.createElement('div');
        apple.className = 'aj-bouncing-apple';
        const ax = (window.innerWidth / (appleCount + 1)) * (i + 0.5) - 60;
        const dur = 1.4 + (i % 3) * 0.2;
        const isGolden = i % 3 === 0;
        const fillColor = isGolden ? '#FFD600' : '#FF1744';

        apple.style.setProperty('--ax', `${ax}px`);
        apple.style.setProperty('--bounce-dur', `${dur}s`);

        apple.innerHTML = `
          <svg width="56" height="56" viewBox="0 0 100 100">
            <circle cx="44" cy="54" r="26" fill="${fillColor}" stroke="#3E2723" stroke-width="3"/>
            <circle cx="56" cy="54" r="26" fill="${fillColor}" stroke="#3E2723" stroke-width="3"/>
            <path d="M 50 32 Q 54 20 62 22" fill="none" stroke="#5D4037" stroke-width="4.5"/>
            <ellipse cx="62" cy="22" rx="7" ry="3.5" fill="#76FF03" transform="rotate(-25 62 22)"/>
          </svg>
        `;
        signatureEffectsContainer.appendChild(apple);
      }
      setTimeout(() => { signatureEffectsContainer.innerHTML = ''; }, 2200);
    }
  }

  function triggerCelebrationBurst() {
    resetBurstContainer.innerHTML = '';
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.6;
    const count = 36;
    const colors = ['#FF7EB3', '#FFA8CE', '#FFFFFF', '#FFB5D3', '#FFE55C', '#FF6097', '#9C27B0', '#00D2FF'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 160 + Math.random() * 320;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 540;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      const size = 16 + Math.random() * 18;
      const color = colors[i % colors.length];

      particle.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24">
          <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="${color}" />
        </svg>
      `;
      resetBurstContainer.appendChild(particle);
    }

    setTimeout(() => {
      resetBurstContainer.innerHTML = '';
    }, 1200);
  }

  /* ==========================================================================
     14. Milestone 2: Lively Wallpaper Native Property Integration
     ========================================================================== */

  window.livelyPropertyListener = function (name, val) {
    if (name === 'characterSelect') {
      const ponyList = ['pinkie', 'twilight', 'rainbow', 'fluttershy', 'rarity', 'applejack'];
      let selectedId = 'pinkie';
      if (typeof val === 'number' && ponyList[val]) {
        selectedId = ponyList[val];
      } else if (typeof val === 'string') {
        const lower = val.toLowerCase();
        const match = ponyList.find((p) => lower.includes(p));
        if (match) selectedId = match;
      }
      switchMainCharacter(selectedId);

    } else if (name === 'popupThreshold') {
      popupStickerThreshold = Math.max(3, Math.min(20, parseInt(val, 10) || 7));

    } else if (name === 'ribbonSpeed') {
      const pct = Math.max(10, Math.min(300, parseInt(val, 10) || 100));
      const dur = Math.max(5, Math.round(22 * (100 / pct)));
      document.documentElement.style.setProperty('--ribbon-scroll-duration', `${dur}s`);

    } else if (name === 'starDensity') {
      starDensity = Math.max(10, Math.min(120, parseInt(val, 10) || 42));
      initStars();

    } else if (name === 'muteAudio') {
      if (soundFX.isMuted !== Boolean(val)) {
        soundFX.toggleMute();
        updateMuteIcons(soundFX.isMuted);
      }
    }
  };

  /* ==========================================================================
     15. Controls & Keyboard Accessibility
     ========================================================================== */

  const btnPartyGuest = document.getElementById('btn-party-guest');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const btnManualReset = document.getElementById('btn-manual-reset');

  function updateMuteIcons(muted) {
    if (muted) {
      iconSoundOn.style.display = 'none';
      iconSoundOff.style.display = 'block';
    } else {
      iconSoundOn.style.display = 'block';
      iconSoundOff.style.display = 'none';
    }
  }

  updateMuteIcons(soundFX.isMuted);

  btnPartyGuest.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    triggerPonyReaction();
    triggerRandomSignatureEffect();

    const safeLeft = 20 + Math.random() * 45;
    const safeTop = 16 + Math.random() * 35;
    const win = createRetroWindow('cameo', safeLeft, safeTop);
    windowOverlay.appendChild(win);
    openWindows.push(win);
    soundFX.playWindowSpawn();
    requestAnimationFrame(() => win.classList.add('is-open'));
  });

  btnSoundToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    const muted = soundFX.toggleMute();
    updateMuteIcons(muted);
    if (!muted) soundFX.playStickerPop();
  });

  btnManualReset.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    openWindows.forEach((w) => w.remove());
    openWindows = [];
    triggerPartyCannonReset();
  });

  // Mane 6 Dock Buttons
  const dockButtons = document.querySelectorAll('.pony-dock-btn');
  dockButtons.forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      soundFX.init();
      const ponyId = btn.dataset.pony;
      if (ponyId) switchMainCharacter(ponyId);
    });
  });

  // Keyboard accessibility: Escape closes topmost window
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openWindows.length > 0) {
        closeRetroWindow(openWindows[openWindows.length - 1]);
      } else if (taskmgrWindow.style.display !== 'none') {
        taskmgrWindow.style.display = 'none';
        btnTaskmgrToggle.classList.remove('active');
      } else if (widgetClock.style.display !== 'none' || widgetTodo.style.display !== 'none') {
        widgetClock.style.display = 'none';
        widgetTodo.style.display = 'none';
        btnWidgetsToggle.classList.remove('active');
      }
    }
  });

  /* ==========================================================================
     16. Main RAF Render Loop (Parallax Lerp, Starfield & Winamp Visualizer)
     ========================================================================== */

  function renderLoop() {
    if (!isPaused) {
      // 3D Parallax & Cursor Gaze Tracking Lerp
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      document.documentElement.style.setProperty('--parallax-bg-x', `${-currentParallaxX * 14}px`);
      document.documentElement.style.setProperty('--parallax-bg-y', `${-currentParallaxY * 10}px`);
      document.documentElement.style.setProperty('--parallax-ribbon-x', `${-currentParallaxX * 22}px`);
      document.documentElement.style.setProperty('--parallax-ribbon-y', `${-currentParallaxY * 8}px`);
      document.documentElement.style.setProperty('--parallax-char-x', `${currentParallaxX * 18}px`);
      document.documentElement.style.setProperty('--parallax-char-y', `${currentParallaxY * 12}px`);
      document.documentElement.style.setProperty('--parallax-eye-x', `${currentParallaxX * 9}px`);
      document.documentElement.style.setProperty('--parallax-eye-y', `${currentParallaxY * 7}px`);

      // Render Offscreen Starfield
      renderStars();

      // Render Winamp Equalizer
      renderWinampEQ();
    }
    animFrameId = requestAnimationFrame(renderLoop);
  }

  // Startup Initialization
  preRenderStarCache();
  window.addEventListener('resize', resizeStarCanvas);
  resizeStarCanvas();
  animFrameId = requestAnimationFrame(renderLoop);

})();
