/**
 * Pinkie Pie & Mane 6 Y2K Party Live Wallpaper (v4.0 Production Edition)
 * Native Lively Wallpaper & Wallpaper Engine compatible.
 * Procedural Web Audio API, Hardware Monitor, Audio Visualizer,
 * Multi-Pose Sprite Library, Locked 1:1 Vector Face Rig, Visual Eye Rig Tuner (Ctrl+E),
 * Smart Sticker Placement, Petting Gestures, Speech Bubbles & Themed Particles.
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

    /** Soft melodic chime for head-patting */
    playPettingChime() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const freqs = [659.25, 880.00, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.18, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.18);
      });
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

      const whistle = this.ctx.createOscillator();
      const wGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(440, now + 0.05);
      whistle.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
      wGain.gain.setValueAtTime(0.01, now + 0.05);
      wGain.gain.linearRampToValueAtTime(0.3, now + 0.12);
      wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      whistle.connect(wGain);
      whistle.connect(this.masterGain);
      whistle.start(now + 0.05);
      whistle.stop(now + 0.35);
    }

    /** Elements of Harmony Polyphonic Victory Chord */
    playHarmonyChord() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
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
     2. Tasks 1 & 2: Mane 6 Character Data Model with Multi-Pose Library
     ========================================================================== */

  const MANE_6_CHARACTERS = {
    pinkie: {
      id: 'pinkie',
      name: 'Pinkie Pie',
      particleType: 'balloons',
      quotes: [
        'Did someone say PARTY?! 🎉',
        'Life is a party, dress like it! 🧁',
        'Laughter makes everything 100% better! 🎈',
        'You can never have too many cupcakes!'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Peek-a-boo',
          file: 'assets/poses/pinkie-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FAB7D0',
          eyeColor: '#4792B3',
          blushColor: '#FF4F93',
          eyeRig: {
            leftEye: { cx: 37.5, cy: 60.5, rx: 10.5, ry: 12.5, rot: -4, hidden: false },
            rightEye: { cx: 72.5, cy: 59.0, rx: 11.0, ry: 13.0, rot: 4, hidden: false },
            blushLeft: { cx: 29.0, cy: 71.0, rx: 6.5, ry: 3.5 },
            blushRight: { cx: 79.0, cy: 70.0, rx: 6.5, ry: 3.5 }
          }
        },
        {
          id: 'pose2',
          label: 'Milkshake Sip',
          file: 'assets/poses/pinkie-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#ECBDD8',
          eyeColor: '#4792B3',
          blushColor: '#FF4F93',
          eyeRig: {
            leftEye: { cx: 41.5, cy: 48.0, rx: 6.2, ry: 8.5, rot: 0, hidden: false },
            rightEye: { cx: 41.5, cy: 48.0, rx: 6.2, ry: 8.5, rot: 0, hidden: true },
            blushLeft: { cx: 47.0, cy: 56.0, rx: 5.0, ry: 3.0 },
            blushRight: { cx: 47.0, cy: 56.0, rx: 0.0, ry: 0.0 }
          }
        },
        {
          id: 'pose3',
          label: 'Party Glasses',
          file: 'assets/poses/pinkie-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#F8B9CF',
          eyeColor: '#4792B3',
          blushColor: '#FF4F93',
          eyeRig: {
            leftEye: { cx: 36.5, cy: 39.5, rx: 7.5, ry: 8.5, rot: -8, hidden: false },
            rightEye: { cx: 57.5, cy: 42.5, rx: 8.0, ry: 8.8, rot: 8, hidden: false },
            blushLeft: { cx: 30.0, cy: 48.0, rx: 5.5, ry: 3.2 },
            blushRight: { cx: 64.0, cy: 52.0, rx: 5.5, ry: 3.2 }
          }
        }
      ]
    },
    twilight: {
      id: 'twilight',
      name: 'Twilight Sparkle',
      particleType: 'magic',
      quotes: [
        'According to chapter 4, friendship is magic! 🔮',
        'A tidy desktop leads to a happy mind! 📚',
        'Magic happens when we work together! ✨',
        'Study break? Time to read another book!'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Standing',
          file: 'assets/poses/twilight-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#CAAAD1',
          eyeColor: '#662D91',
          blushColor: '#C2185B',
          eyeRig: {
            leftEye: { cx: 34.0, cy: 48.0, rx: 11.0, ry: 13.0, rot: -5, hidden: false },
            rightEye: { cx: 64.0, cy: 44.0, rx: 11.5, ry: 13.5, rot: 5, hidden: false },
            blushLeft: { cx: 27.0, cy: 61.0, rx: 6.0, ry: 3.5 },
            blushRight: { cx: 72.0, cy: 56.0, rx: 6.0, ry: 3.5 }
          }
        },
        {
          id: 'pose2',
          label: 'Adorkable Sit',
          file: 'assets/poses/twilight-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#D19FE3',
          eyeColor: '#662D91',
          blushColor: '#C2185B',
          eyeRig: {
            leftEye: { cx: 34.0, cy: 30.5, rx: 4.5, ry: 5.8, rot: 0, hidden: false },
            rightEye: { cx: 45.0, cy: 31.0, rx: 4.5, ry: 5.8, rot: 0, hidden: false },
            blushLeft: { cx: 29.0, cy: 37.5, rx: 3.8, ry: 2.2 },
            blushRight: { cx: 49.0, cy: 37.5, rx: 3.8, ry: 2.2 }
          }
        },
        {
          id: 'pose3',
          label: 'Joyful Grin',
          file: 'assets/poses/twilight-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#C391B7',
          eyeColor: '#662D91',
          blushColor: '#C2185B',
          eyeRig: {
            leftEye: { cx: 42.5, cy: 42.0, rx: 8.5, ry: 10.5, rot: -4, hidden: false },
            rightEye: { cx: 61.5, cy: 41.5, rx: 8.5, ry: 10.5, rot: 4, hidden: false },
            blushLeft: { cx: 33.0, cy: 55.0, rx: 6.0, ry: 3.5 },
            blushRight: { cx: 69.0, cy: 54.0, rx: 6.0, ry: 3.5 }
          }
        }
      ]
    },
    rainbow: {
      id: 'rainbow',
      name: 'Rainbow Dash',
      particleType: 'clouds',
      quotes: [
        'This desktop is at least 20% cooler now! ⚡',
        'Awesome as I wanna be! 🌈',
        'Speed is my middle name!',
        'Clear skies ahead in 10 seconds flat!'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Smug Standing',
          file: 'assets/poses/rainbow-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#8EE2FF',
          eyeColor: '#BF1868',
          blushColor: '#FF5252',
          eyeRig: {
            leftEye: { cx: 43.5, cy: 49.5, rx: 9.0, ry: 11.5, rot: -4, hidden: false },
            rightEye: { cx: 70.5, cy: 53.5, rx: 9.5, ry: 11.5, rot: 4, hidden: false },
            blushLeft: { cx: 36.0, cy: 61.0, rx: 6.0, ry: 3.5 },
            blushRight: { cx: 76.0, cy: 64.0, rx: 6.0, ry: 3.5 }
          }
        },
        {
          id: 'pose2',
          label: 'Reading Chill',
          file: 'assets/poses/rainbow-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#9DDAF6',
          eyeColor: '#BF1868',
          blushColor: '#FF5252',
          eyeRig: {
            leftEye: { cx: 62.5, cy: 37.5, rx: 4.2, ry: 5.5, rot: -3, hidden: false },
            rightEye: { cx: 72.5, cy: 38.0, rx: 4.2, ry: 5.5, rot: 3, hidden: false },
            blushLeft: { cx: 57.0, cy: 44.0, rx: 4.0, ry: 2.2 },
            blushRight: { cx: 75.5, cy: 44.0, rx: 4.0, ry: 2.2 }
          }
        },
        {
          id: 'pose3',
          label: 'Wonderbolt Ready',
          file: 'assets/poses/rainbow-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#9DD9F8',
          eyeColor: '#BF1868',
          blushColor: '#FF5252',
          eyeRig: {
            leftEye: { cx: 70.0, cy: 31.5, rx: 6.5, ry: 8.5, rot: -3, hidden: false },
            rightEye: { cx: 85.0, cy: 30.5, rx: 5.0, ry: 7.5, rot: 3, hidden: false },
            blushLeft: { cx: 65.0, cy: 40.0, rx: 4.5, ry: 2.6 },
            blushRight: { cx: 88.0, cy: 39.0, rx: 4.0, ry: 2.4 }
          }
        }
      ]
    },
    fluttershy: {
      id: 'fluttershy',
      name: 'Fluttershy',
      particleType: 'butterflies',
      quotes: [
        'Yay... 🌸',
        'Take a deep breath, you are doing great. 🦋',
        'Kindness is the greatest magic of all! 💕',
        'The little woodland critters say hello!'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Gentle Peek',
          file: 'assets/poses/fluttershy-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FAF5AB',
          eyeColor: '#39B54A',
          blushColor: '#F48FB1',
          eyeRig: {
            leftEye: { cx: 36.0, cy: 63.5, rx: 11.5, ry: 15.0, rot: -4, hidden: false },
            rightEye: { cx: 68.5, cy: 64.0, rx: 12.0, ry: 15.0, rot: 4, hidden: false },
            blushLeft: { cx: 27.0, cy: 78.0, rx: 7.0, ry: 3.8 },
            blushRight: { cx: 77.0, cy: 78.0, rx: 7.0, ry: 3.8 }
          }
        },
        {
          id: 'pose2',
          label: 'Happy Stand',
          file: 'assets/poses/fluttershy-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FDF6AF',
          eyeColor: '#39B54A',
          blushColor: '#F48FB1',
          eyeRig: {
            leftEye: { cx: 29.0, cy: 27.5, rx: 4.0, ry: 4.8, rot: -5, hidden: false },
            rightEye: { cx: 39.5, cy: 27.5, rx: 5.2, ry: 5.5, rot: 5, hidden: false },
            blushLeft: { cx: 24.5, cy: 34.5, rx: 3.5, ry: 2.0 },
            blushRight: { cx: 43.0, cy: 34.5, rx: 4.0, ry: 2.2 }
          }
        },
        {
          id: 'pose3',
          label: 'Butterfly Sit',
          file: 'assets/poses/fluttershy-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FDF6AF',
          eyeColor: '#39B54A',
          blushColor: '#F48FB1',
          eyeRig: {
            leftEye: { cx: 33.0, cy: 27.0, rx: 4.8, ry: 5.8, rot: -4, hidden: false },
            rightEye: { cx: 43.0, cy: 27.5, rx: 5.2, ry: 6.2, rot: 4, hidden: false },
            blushLeft: { cx: 29.0, cy: 35.0, rx: 4.0, ry: 2.2 },
            blushRight: { cx: 48.0, cy: 35.0, rx: 4.0, ry: 2.2 }
          }
        }
      ]
    },
    rarity: {
      id: 'rarity',
      name: 'Rarity',
      particleType: 'gems',
      quotes: [
        'Simply fabulous, darling! 💎',
        'One must always maintain aesthetic perfection! ✨',
        'Elegance is not just a style, it is a way of life!',
        'Every detail deserves careful couture.'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Glamour Peek',
          file: 'assets/poses/rarity-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#EEF1F3',
          eyeColor: '#2E3192',
          blushColor: '#9575CD',
          eyeRig: {
            leftEye: { cx: 66.0, cy: 56.5, rx: 7.0, ry: 10.0, rot: -6, hidden: false },
            rightEye: { cx: 84.0, cy: 58.5, rx: 6.8, ry: 10.0, rot: 6, hidden: false },
            blushLeft: { cx: 60.0, cy: 67.0, rx: 5.0, ry: 3.0 },
            blushRight: { cx: 88.0, cy: 69.0, rx: 4.5, ry: 2.8 }
          }
        },
        {
          id: 'pose2',
          label: 'Elegant Sit',
          file: 'assets/poses/rarity-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#EDF1F4',
          eyeColor: '#2E3192',
          blushColor: '#9575CD',
          eyeRig: {
            leftEye: { cx: 36.5, cy: 27.5, rx: 3.5, ry: 3.5, rot: 0, hidden: false },
            rightEye: { cx: 43.5, cy: 27.5, rx: 4.5, ry: 3.8, rot: 0, hidden: false },
            blushLeft: { cx: 31.5, cy: 33.0, rx: 3.2, ry: 2.0 },
            blushRight: { cx: 47.0, cy: 33.5, rx: 3.5, ry: 2.0 }
          }
        },
        {
          id: 'pose3',
          label: 'Dramatic Tilt',
          file: 'assets/poses/rarity-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#DCDAF5',
          eyeColor: '#2E3192',
          blushColor: '#9575CD',
          eyeRig: {
            leftEye: { cx: 53.5, cy: 27.5, rx: 5.5, ry: 6.5, rot: 3, hidden: false },
            rightEye: { cx: 39.0, cy: 27.5, rx: 4.5, ry: 4.5, rot: -3, hidden: true },
            blushLeft: { cx: 35.0, cy: 34.5, rx: 4.2, ry: 2.5 },
            blushRight: { cx: 58.0, cy: 34.5, rx: 4.5, ry: 2.6 }
          }
        }
      ]
    },
    applejack: {
      id: 'applejack',
      name: 'Applejack',
      particleType: 'apples',
      quotes: [
        'Honest work for honest ponies, sugarcube! 🍎',
        'Do not use fancy mathematics to muddy the issue! 🤠',
        'Stick with your friends through thick and thin!',
        'Time for a fresh batch of apple fritters!'
      ],
      poses: [
        {
          id: 'pose1',
          label: 'Proud Peek',
          file: 'assets/poses/applejack-pose1.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FABA62',
          eyeColor: '#4A993D',
          blushColor: '#FF7043',
          eyeRig: {
            leftEye: { cx: 35.5, cy: 61.0, rx: 11.5, ry: 14.5, rot: -4, hidden: false },
            rightEye: { cx: 72.5, cy: 61.5, rx: 11.5, ry: 14.5, rot: 4, hidden: false },
            blushLeft: { cx: 26.0, cy: 76.0, rx: 7.0, ry: 4.0 },
            blushRight: { cx: 81.0, cy: 76.0, rx: 7.0, ry: 4.0 }
          }
        },
        {
          id: 'pose2',
          label: 'Apple Basket',
          file: 'assets/poses/applejack-pose2.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#FABA62',
          eyeColor: '#4A993D',
          blushColor: '#FF7043',
          eyeRig: {
            leftEye: { cx: 41.0, cy: 30.5, rx: 4.8, ry: 5.5, rot: -4, hidden: false },
            rightEye: { cx: 51.0, cy: 30.5, rx: 5.2, ry: 5.8, rot: 4, hidden: false },
            blushLeft: { cx: 36.0, cy: 37.5, rx: 4.2, ry: 2.4 },
            blushRight: { cx: 56.0, cy: 37.5, rx: 4.2, ry: 2.4 }
          }
        },
        {
          id: 'pose3',
          label: 'Honest Gaze',
          file: 'assets/poses/applejack-pose3.png',
          scale: 1.0,
          offsetY: 0,
          coatColor: '#E8A452',
          eyeColor: '#4A993D',
          blushColor: '#FF7043',
          eyeRig: {
            leftEye: { cx: 39.0, cy: 46.5, rx: 5.5, ry: 6.2, rot: -3, hidden: false },
            rightEye: { cx: 55.0, cy: 45.5, rx: 6.5, ry: 6.8, rot: 3, hidden: false },
            blushLeft: { cx: 34.0, cy: 55.0, rx: 4.8, ry: 2.8 },
            blushRight: { cx: 61.0, cy: 54.0, rx: 4.8, ry: 2.8 }
          }
        }
      ]
    }
  };

  // Restore saved character & pose preference
  let currentCharacterId = localStorage.getItem('pony_active_char') || 'pinkie';
  if (!MANE_6_CHARACTERS[currentCharacterId]) currentCharacterId = 'pinkie';
  let currentPoseIndex = parseInt(localStorage.getItem('pony_active_pose') || '0', 10);
  if (isNaN(currentPoseIndex) || currentPoseIndex < 0 || currentPoseIndex > 2) currentPoseIndex = 0;

  /* ==========================================================================
     3. Global State & Lively Playback Control
     ========================================================================== */

  let isPaused = false;
  let isChillMode = localStorage.getItem('pony_wallpaper_mode') === 'chill';
  let popupStickerThreshold = 7;
  let animFrameId = null;
  let lastUserActivityTime = performance.now();
  let isSleepyActive = false;

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
     4. Custom Y2K Pixel Cursor & Parallax Lerp
     ========================================================================== */

  const cursorEl = document.getElementById('retro-cursor');
  const sparkleContainer = document.getElementById('sparkle-container');
  const rippleContainer = document.getElementById('ripple-container');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastSparkleTime = 0;

  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  function recordUserActivity() {
    lastUserActivityTime = performance.now();
    if (isSleepyActive) {
      wakeUpFromSleepy();
    }
  }

  window.addEventListener('pointermove', (e) => {
    recordUserActivity();
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

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

  window.addEventListener('pointerdown', recordUserActivity);
  window.addEventListener('keydown', recordUserActivity);

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
     5. Task 7: Theme-Morphing Ambient Background Particles Canvas
     ========================================================================== */

  const starCanvas = document.getElementById('starfield-canvas');
  const starCtx = starCanvas.getContext('2d');
  let ambientParticles = [];
  let starDensity = 42;
  const particleSpriteCache = {};

  function preRenderParticleSprites() {
    // 1. Classic Stars
    const starColors = ['#FFFFFF', '#FFD6E7', '#FFB5D3', '#FFA8CE', '#E1BEE7', '#B3E5FC'];
    starColors.forEach((col) => {
      [4, 5].forEach((spikes) => {
        [6, 10, 14].forEach((sz) => {
          const off = document.createElement('canvas');
          const pad = 12;
          const w = sz * 2 + pad * 2;
          off.width = w;
          off.height = w;
          const oCtx = off.getContext('2d');
          oCtx.translate(w / 2, w / 2);
          oCtx.beginPath();
          const step = Math.PI / spikes;
          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? sz : sz * 0.42;
            const x = Math.cos(i * step) * r;
            const y = Math.sin(i * step) * r;
            if (i === 0) oCtx.moveTo(x, y);
            else oCtx.lineTo(x, y);
          }
          oCtx.closePath();
          oCtx.fillStyle = col;
          oCtx.shadowColor = col;
          oCtx.shadowBlur = 6;
          oCtx.fill();
          particleSpriteCache[`star_${col}_${spikes}_${sz}`] = off;
        });
      });
    });

    // 2. Balloons / Confetti (Pinkie)
    const balloonColors = ['#FF4081', '#FF80AB', '#00E5FF', '#FFD600', '#76FF03'];
    balloonColors.forEach((col) => {
      const off = document.createElement('canvas');
      off.width = 32;
      off.height = 40;
      const oCtx = off.getContext('2d');
      oCtx.fillStyle = col;
      oCtx.shadowColor = col;
      oCtx.shadowBlur = 4;
      oCtx.beginPath();
      oCtx.ellipse(16, 16, 11, 14, 0, 0, Math.PI * 2);
      oCtx.fill();
      oCtx.beginPath();
      oCtx.moveTo(14, 30);
      oCtx.lineTo(18, 30);
      oCtx.lineTo(16, 33);
      oCtx.closePath();
      oCtx.fill();
      particleSpriteCache[`balloon_${col}`] = off;
    });

    // 3. Mini Butterflies (Fluttershy)
    const fsColors = ['#00E5FF', '#FF4081', '#FFF176'];
    fsColors.forEach((col) => {
      const off = document.createElement('canvas');
      off.width = 30;
      off.height = 30;
      const oCtx = off.getContext('2d');
      oCtx.fillStyle = col;
      oCtx.globalAlpha = 0.85;
      oCtx.beginPath();
      oCtx.ellipse(10, 12, 8, 5, -0.5, 0, Math.PI * 2);
      oCtx.ellipse(20, 12, 8, 5, 0.5, 0, Math.PI * 2);
      oCtx.fill();
      particleSpriteCache[`butterfly_${col}`] = off;
    });

    // 4. Diamonds / Gems (Rarity)
    const gemColors = ['#E1F5FE', '#80DEEA', '#B39DDB', '#FFFFFF'];
    gemColors.forEach((col) => {
      const off = document.createElement('canvas');
      off.width = 28;
      off.height = 28;
      const oCtx = off.getContext('2d');
      oCtx.fillStyle = col;
      oCtx.shadowColor = col;
      oCtx.shadowBlur = 5;
      oCtx.beginPath();
      oCtx.moveTo(14, 2);
      oCtx.lineTo(26, 14);
      oCtx.lineTo(14, 26);
      oCtx.lineTo(2, 14);
      oCtx.closePath();
      oCtx.fill();
      particleSpriteCache[`gem_${col}`] = off;
    });

    // 5. Apples (Applejack)
    ['#FF1744', '#FFD600'].forEach((col) => {
      const off = document.createElement('canvas');
      off.width = 28;
      off.height = 28;
      const oCtx = off.getContext('2d');
      oCtx.fillStyle = col;
      oCtx.beginPath();
      oCtx.arc(11, 15, 8, 0, Math.PI * 2);
      oCtx.arc(17, 15, 8, 0, Math.PI * 2);
      oCtx.fill();
      oCtx.fillStyle = '#4CAF50';
      oCtx.fillRect(13, 4, 3, 6);
      particleSpriteCache[`apple_${col}`] = off;
    });

    // 6. Arcane 6-Point Magic Stars (Twilight Sparkle)
    ['#E040FB', '#CE93D8', '#FFF9A6'].forEach((col) => {
      const off = document.createElement('canvas');
      off.width = 32;
      off.height = 32;
      const oCtx = off.getContext('2d');
      oCtx.translate(16, 16);
      oCtx.fillStyle = col;
      oCtx.shadowColor = '#9C27B0';
      oCtx.shadowBlur = 5;
      oCtx.beginPath();
      for (let i = 0; i < 12; i++) {
        const r = i % 2 === 0 ? 12 : 4.5;
        const a = (i * Math.PI) / 6;
        if (i === 0) oCtx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else oCtx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      oCtx.closePath();
      oCtx.fill();
      particleSpriteCache[`magic_${col}`] = off;
    });

    // 7. Fluffy Clouds & Mini Lightning Bolts (Rainbow Dash)
    const cloudOff = document.createElement('canvas');
    cloudOff.width = 44;
    cloudOff.height = 28;
    const cCtx = cloudOff.getContext('2d');
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    cCtx.shadowColor = '#80DEEA';
    cCtx.shadowBlur = 4;
    cCtx.beginPath();
    cCtx.arc(14, 16, 8, 0, Math.PI * 2);
    cCtx.arc(22, 12, 10, 0, Math.PI * 2);
    cCtx.arc(30, 16, 8, 0, Math.PI * 2);
    cCtx.fill();
    particleSpriteCache['cloud_white'] = cloudOff;

    const boltOff = document.createElement('canvas');
    boltOff.width = 24;
    boltOff.height = 30;
    const bCtx = boltOff.getContext('2d');
    bCtx.fillStyle = '#FFD600';
    bCtx.shadowColor = '#00E5FF';
    bCtx.shadowBlur = 4;
    bCtx.beginPath();
    bCtx.moveTo(14, 2);
    bCtx.lineTo(6, 16);
    bCtx.lineTo(12, 16);
    bCtx.lineTo(9, 28);
    bCtx.lineTo(19, 13);
    bCtx.lineTo(13, 13);
    bCtx.closePath();
    bCtx.fill();
    particleSpriteCache['cloud_bolt'] = boltOff;
  }

  function resizeStarCanvas() {
    const dpr = window.devicePixelRatio || 1;
    starCanvas.width = window.innerWidth * dpr;
    starCanvas.height = window.innerHeight * dpr;
    starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initAmbientParticles();
    fitRigFrame();
  }

  function initAmbientParticles() {
    ambientParticles = [];
    for (let i = 0; i < starDensity; i++) {
      ambientParticles.push(createAmbientParticle(true));
    }
  }

  function createAmbientParticle(randomY = false) {
    const char = MANE_6_CHARACTERS[currentCharacterId] || MANE_6_CHARACTERS.pinkie;
    const pType = char.particleType || 'balloons';
    let sprite = null;

    if (pType === 'balloons') {
      const cols = ['#FF4081', '#FF80AB', '#00E5FF', '#FFD600', '#76FF03'];
      sprite = particleSpriteCache[`balloon_${cols[Math.floor(Math.random() * cols.length)]}`];
    } else if (pType === 'butterflies') {
      const cols = ['#00E5FF', '#FF4081', '#FFF176'];
      sprite = particleSpriteCache[`butterfly_${cols[Math.floor(Math.random() * cols.length)]}`];
    } else if (pType === 'gems') {
      const cols = ['#E1F5FE', '#80DEEA', '#B39DDB', '#FFFFFF'];
      sprite = particleSpriteCache[`gem_${cols[Math.floor(Math.random() * cols.length)]}`];
    } else if (pType === 'apples') {
      const cols = ['#FF1744', '#FFD600'];
      sprite = particleSpriteCache[`apple_${cols[Math.floor(Math.random() * cols.length)]}`];
    } else if (pType === 'magic') {
      const cols = ['#E040FB', '#CE93D8', '#FFF9A6'];
      sprite = particleSpriteCache[`magic_${cols[Math.floor(Math.random() * cols.length)]}`];
    } else if (pType === 'clouds') {
      sprite = Math.random() > 0.3 ? particleSpriteCache['cloud_white'] : particleSpriteCache['cloud_bolt'];
    } else {
      const cols = ['#FFFFFF', '#FFD6E7', '#FFB5D3', '#E1BEE7', '#B3E5FC'];
      const c = cols[Math.floor(Math.random() * cols.length)];
      sprite = particleSpriteCache[`star_${c}_${Math.random() > 0.4 ? 4 : 5}_10`];
    }

    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 20,
      speedX: (Math.random() - 0.5) * 0.7,
      speedY: -0.3 - Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: 0.35 + Math.random() * 0.6,
      scale: 0.7 + Math.random() * 0.6,
      sprite: sprite
    };
  }

  function renderAmbientParticles() {
    starCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < ambientParticles.length; i++) {
      const p = ambientParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;

      if (p.y < -35) {
        ambientParticles[i] = createAmbientParticle(false);
        continue;
      }

      if (p.sprite) {
        starCtx.save();
        starCtx.translate(p.x, p.y);
        starCtx.rotate(p.rot);
        starCtx.scale(p.scale, p.scale);
        starCtx.globalAlpha = p.alpha;
        starCtx.drawImage(p.sprite, -p.sprite.width / 2, -p.sprite.height / 2);
        starCtx.restore();
      }
    }
  }

  /* ==========================================================================
     6. Tasks 2 & 3: Locked Vector Face Rig & Live Calibration Architecture
     ========================================================================== */

  const pinkieCharacter = document.getElementById('pinkie-character');
  const pinkieIdleImg = document.getElementById('pinkie-idle-img');
  const pinkieSvgFallback = document.getElementById('pinkie-svg-fallback');
  const stickerSurface = document.getElementById('sticker-surface');

  const rigEyeLeftGroup = document.getElementById('rig-eye-left-group');
  const rigEyeRightGroup = document.getElementById('rig-eye-right-group');
  const rigPatchLeft = document.getElementById('rig-eye-patch-left');
  const rigPatchRight = document.getElementById('rig-eye-patch-right');
  const rigLashLeft = document.getElementById('rig-lash-left');
  const rigLashRight = document.getElementById('rig-lash-right');
  const rigLashLeftAcc1 = document.getElementById('rig-lash-left-acc1');
  const rigLashLeftAcc2 = document.getElementById('rig-lash-left-acc2');
  const rigLashRightAcc1 = document.getElementById('rig-lash-right-acc1');
  const rigLashRightAcc2 = document.getElementById('rig-lash-right-acc2');

  const rigBlushLeft = document.getElementById('rig-blush-left');
  const rigBlushRight = document.getElementById('rig-blush-right');
  const rigStarEyeLeft = document.getElementById('rig-star-eye-left');
  const rigStarEyeRight = document.getElementById('rig-star-eye-right');
  const tunerBboxLeft = document.getElementById('tuner-bbox-left');
  const tunerBboxRight = document.getElementById('tuner-bbox-right');

  const speechBubble = document.getElementById('pony-speech-bubble');
  const speechBubbleText = document.getElementById('speech-bubble-text');
  let speechBubbleTimeout = null;

  let exprTimeout = null;
  let lastReactionTime = 0;
  let useSvgFallback = false;
  let sleepyZzzTimer = null;

  // Offscreen canvas for alpha-aware sticker testing
  let alphaCanvas = document.createElement('canvas');
  let alphaCtx = alphaCanvas.getContext('2d');
  let alphaImageData = null;

  function fitRigFrame() {
    const rigFrameEl = document.getElementById('pinkie-rig-frame');
    const wrapperEl = document.getElementById('pinkie-wrapper');
    if (!rigFrameEl || !wrapperEl || !pinkieIdleImg.naturalWidth || !pinkieIdleImg.naturalHeight) return;

    const maxW = wrapperEl.clientWidth || 500;
    const maxH = wrapperEl.clientHeight || 500;
    const scale = Math.min(maxW / pinkieIdleImg.naturalWidth, maxH / pinkieIdleImg.naturalHeight);
    rigFrameEl.style.width = `${Math.round(pinkieIdleImg.naturalWidth * scale)}px`;
    rigFrameEl.style.height = `${Math.round(pinkieIdleImg.naturalHeight * scale)}px`;
  }

  function getCurrentPose() {
    const char = MANE_6_CHARACTERS[currentCharacterId] || MANE_6_CHARACTERS.pinkie;
    const poses = char.poses || [];
    return poses[currentPoseIndex] || poses[0];
  }

  function updateEyeRigUI(eyeRig) {
    if (!eyeRig) return;
    const l = eyeRig.leftEye;
    const r = eyeRig.rightEye;
    const bl = eyeRig.blushLeft;
    const br = eyeRig.blushRight;

    // 1. Left Eye Group
    if (rigEyeLeftGroup && l) {
      rigEyeLeftGroup.setAttribute('transform', `translate(${l.cx}, ${l.cy}) rotate(${l.rot || 0})`);
      rigEyeLeftGroup.style.display = l.hidden ? 'none' : '';
      if (rigPatchLeft) {
        rigPatchLeft.setAttribute('rx', l.rx);
        rigPatchLeft.setAttribute('ry', l.ry);
      }
      if (rigLashLeft) {
        rigLashLeft.setAttribute('d', `M ${-l.rx * 0.85} ${l.ry * 0.15} Q 0 ${-l.ry * 0.78} ${l.rx * 0.85} ${l.ry * 0.15}`);
      }
      if (rigLashLeftAcc1) {
        rigLashLeftAcc1.setAttribute('d', `M ${-l.rx * 0.7} ${-l.ry * 0.05} L ${-l.rx * 1.05} ${-l.ry * 0.35}`);
      }
      if (rigLashLeftAcc2) {
        rigLashLeftAcc2.setAttribute('d', `M ${-l.rx * 0.35} ${-l.ry * 0.45} L ${-l.rx * 0.55} ${-l.ry * 0.8}`);
      }
      if (rigStarEyeLeft) {
        rigStarEyeLeft.setAttribute('transform', `translate(${l.cx}, ${l.cy})`);
        rigStarEyeLeft.style.display = l.hidden ? 'none' : '';
      }
      if (tunerBboxLeft) {
        tunerBboxLeft.setAttribute('x', -l.rx);
        tunerBboxLeft.setAttribute('y', -l.ry);
        tunerBboxLeft.setAttribute('width', l.rx * 2);
        tunerBboxLeft.setAttribute('height', l.ry * 2);
      }
    }

    // 2. Right Eye Group
    if (rigEyeRightGroup && r) {
      rigEyeRightGroup.setAttribute('transform', `translate(${r.cx}, ${r.cy}) rotate(${r.rot || 0})`);
      rigEyeRightGroup.style.display = r.hidden ? 'none' : '';
      if (rigPatchRight) {
        rigPatchRight.setAttribute('rx', r.rx);
        rigPatchRight.setAttribute('ry', r.ry);
      }
      if (rigLashRight) {
        rigLashRight.setAttribute('d', `M ${-r.rx * 0.85} ${r.ry * 0.15} Q 0 ${-r.ry * 0.78} ${r.rx * 0.85} ${r.ry * 0.15}`);
      }
      if (rigLashRightAcc1) {
        rigLashRightAcc1.setAttribute('d', `M ${r.rx * 0.7} ${-r.ry * 0.05} L ${r.rx * 1.05} ${-r.ry * 0.35}`);
      }
      if (rigLashRightAcc2) {
        rigLashRightAcc2.setAttribute('d', `M ${r.rx * 0.35} ${-r.ry * 0.45} L ${r.rx * 0.55} ${-r.ry * 0.8}`);
      }
      if (rigStarEyeRight) {
        rigStarEyeRight.setAttribute('transform', `translate(${r.cx}, ${r.cy})`);
        rigStarEyeRight.style.display = r.hidden ? 'none' : '';
      }
      if (tunerBboxRight) {
        tunerBboxRight.setAttribute('x', -r.rx);
        tunerBboxRight.setAttribute('y', -r.ry);
        tunerBboxRight.setAttribute('width', r.rx * 2);
        tunerBboxRight.setAttribute('height', r.ry * 2);
      }
    }

    // 3. Blushes
    if (rigBlushLeft && bl) {
      rigBlushLeft.setAttribute('cx', bl.cx);
      rigBlushLeft.setAttribute('cy', bl.cy);
      rigBlushLeft.setAttribute('rx', bl.rx);
      rigBlushLeft.setAttribute('ry', bl.ry);
    }
    if (rigBlushRight && br) {
      rigBlushRight.setAttribute('cx', br.cx);
      rigBlushRight.setAttribute('cy', br.cy);
      rigBlushRight.setAttribute('rx', br.rx);
      rigBlushRight.setAttribute('ry', br.ry);
    }
  }

  function applyActivePose(skipEffect = false) {
    const char = MANE_6_CHARACTERS[currentCharacterId] || MANE_6_CHARACTERS.pinkie;
    const pose = getCurrentPose();
    if (!pose) return;

    document.body.dataset.pony = currentCharacterId;
    document.documentElement.style.setProperty('--character-coat-color', pose.coatColor || '#F6B2D1');
    document.documentElement.style.setProperty('--character-eye-color', pose.eyeColor || '#4792B3');
    document.documentElement.style.setProperty('--character-blush-1', pose.blushColor || '#FF4F93');

    // Update sprite image & rig-frame transform (keeps SVG & stickers locked 1:1)
    pinkieIdleImg.src = pose.file;
    pinkieIdleImg.alt = `${char.name} (${pose.label})`;
    const rigFrameEl = document.getElementById('pinkie-rig-frame');
    if (rigFrameEl) {
      rigFrameEl.style.transform = `translateY(${pose.offsetY || 0}px) scale(${pose.scale || 1.0})`;
    }
    fitRigFrame();

    updateEyeRigUI(pose.eyeRig);

    // Update Pose Switcher button text & title
    const btnPoseSwitch = document.getElementById('btn-pose-switch');
    if (btnPoseSwitch) {
      btnPoseSwitch.title = `Current: ${char.name} - ${pose.label} (Pose ${currentPoseIndex + 1}/3) - Click to cycle poses`;
    }

    // Update dock active buttons
    const dockButtons = document.querySelectorAll('.pony-dock-btn');
    dockButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.pony === currentCharacterId);
    });

    // Save preferences
    localStorage.setItem('pony_active_char', currentCharacterId);
    localStorage.setItem('pony_active_pose', currentPoseIndex.toString());

    if (!skipEffect) {
      soundFX.playPonySwitchChime(currentCharacterId);
      executeSignatureEffect(currentCharacterId);
    }
  }

  function switchMainCharacter(ponyId) {
    if (!MANE_6_CHARACTERS[ponyId]) return;
    currentCharacterId = ponyId;
    currentPoseIndex = 0; // reset to pose 1 on pony switch
    applyActivePose(false);
    initAmbientParticles(); // morph background particles
  }

  function cycleCharacterPose() {
    const char = MANE_6_CHARACTERS[currentCharacterId];
    if (!char || !char.poses) return;
    currentPoseIndex = (currentPoseIndex + 1) % char.poses.length;
    applyActivePose(true);
    soundFX.playStickerPop();
    triggerPonyReaction('wink');
  }

  // Sample Alpha Mask & fit Rig Frame 1:1 on image load
  pinkieIdleImg.addEventListener('load', () => {
    fitRigFrame();
    try {
      const w = pinkieIdleImg.naturalWidth || 400;
      const h = pinkieIdleImg.naturalHeight || 400;
      alphaCanvas.width = w;
      alphaCanvas.height = h;
      alphaCtx.clearRect(0, 0, w, h);
      alphaCtx.drawImage(pinkieIdleImg, 0, 0, w, h);
      alphaImageData = alphaCtx.getImageData(0, 0, w, h).data;
    } catch (e) {
      alphaImageData = null;
    }
  });

  pinkieIdleImg.addEventListener('error', () => {
    useSvgFallback = true;
    const rigFrame = document.getElementById('pinkie-rig-frame');
    if (rigFrame) rigFrame.style.display = 'none';
    pinkieSvgFallback.style.display = 'flex';
  });

  function clearAllExpressions() {
    pinkieCharacter.classList.remove('expr-blink', 'expr-happy', 'expr-wink', 'expr-starry', 'expr-sleepy', 'expr-shy');
  }

  function triggerPonyReaction(forcedExpr = null) {
    pinkieCharacter.classList.remove('pinkie-squish');
    void pinkieCharacter.offsetWidth;
    pinkieCharacter.classList.add('pinkie-squish');

    const now = performance.now();
    let chosenExpr = forcedExpr;
    if (!chosenExpr) {
      chosenExpr = (now - lastReactionTime < 550) ? 'wink' : 'happy';
    }
    lastReactionTime = now;

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
    }, chosenExpr === 'starry' ? 1200 : (chosenExpr === 'shy' ? 1400 : 450));
  }

  // Idle natural blink timer (checked against isPaused & isSleepyActive)
  setInterval(() => {
    if (isPaused || isSleepyActive) return;
    const isBusy =
      pinkieCharacter.classList.contains('expr-happy') ||
      pinkieCharacter.classList.contains('expr-wink') ||
      pinkieCharacter.classList.contains('expr-starry') ||
      pinkieCharacter.classList.contains('expr-shy');

    if (!isBusy) {
      pinkieCharacter.classList.add('expr-blink');
      setTimeout(() => {
        pinkieCharacter.classList.remove('expr-blink');
      }, 160);
    }
  }, 3800);

  // Inactivity Sleepy Trigger (Task 7)
  setInterval(() => {
    if (isPaused || isSleepyActive) return;
    const now = performance.now();
    const threshold = isChillMode ? 8000 : 30000;
    if (now - lastUserActivityTime > threshold) {
      triggerSleepyState();
    }
  }, 3000);

  function triggerSleepyState() {
    if (isSleepyActive) return;
    isSleepyActive = true;
    clearAllExpressions();
    pinkieCharacter.classList.add('expr-sleepy');
    spawnSleepyZzz();
  }

  function wakeUpFromSleepy() {
    if (!isSleepyActive) return;
    isSleepyActive = false;
    clearTimeout(sleepyZzzTimer);
    sleepyZzzTimer = null;
    clearAllExpressions();
    triggerPonyReaction('wink');
  }

  function spawnSleepyZzz() {
    clearTimeout(sleepyZzzTimer);
    if (!isSleepyActive || isPaused) return;
    const zzzContainer = document.getElementById('sleepy-zzz-container');
    if (!zzzContainer) return;

    const z = document.createElement('div');
    z.className = 'pixel-zzz';
    z.textContent = 'Zzz';
    z.style.left = '62%';
    z.style.top = '28%';
    zzzContainer.appendChild(z);

    setTimeout(() => z.remove(), 2600);
    if (isSleepyActive) {
      sleepyZzzTimer = setTimeout(spawnSleepyZzz, 1800);
    }
  }

  /* ==========================================================================
     7. Task 5: Alpha-Aware Smart Sticker Placement (Avoid Eyes)
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

    let pctX = (clickX / rect.width) * 100;
    let pctY = (clickY / rect.height) * 100;

    // Smart Sticker Placement: Check eye exclusion & alpha transparency
    const smartTarget = calculateSmartStickerPlacement(pctX, pctY);
    pctX = smartTarget.x;
    pctY = smartTarget.y;

    triggerClickRipple(e.clientX, e.clientY);
    triggerPonyReaction();
    soundFX.playStickerPop();

    slapSticker(pctX, pctY);
  });

  function isPointValidForSticker(pctX, pctY, eyeRig) {
    if (pctX < 6 || pctX > 94 || pctY < 6 || pctY > 94) return false;
    const l = eyeRig.leftEye;
    const r = eyeRig.rightEye;
    const exclusionRadius = 13.0;
    const distL = l && !l.hidden ? Math.hypot(pctX - l.cx, pctY - l.cy) : 999;
    const distR = r && !r.hidden ? Math.hypot(pctX - r.cx, pctY - r.cy) : 999;
    if (distL < exclusionRadius || distR < exclusionRadius) return false;

    if (alphaImageData && alphaCanvas.width > 0) {
      const px = Math.max(0, Math.min(alphaCanvas.width - 1, Math.floor((pctX / 100) * alphaCanvas.width)));
      const py = Math.max(0, Math.min(alphaCanvas.height - 1, Math.floor((pctY / 100) * alphaCanvas.height)));
      const idx = (py * alphaCanvas.width + px) * 4 + 3;
      if ((alphaImageData[idx] || 0) < 35) return false;
    }
    return true;
  }

  function calculateSmartStickerPlacement(pctX, pctY) {
    const pose = getCurrentPose();
    if (!pose || !pose.eyeRig) return { x: pctX, y: pctY };

    if (isPointValidForSticker(pctX, pctY, pose.eyeRig)) {
      return { x: pctX, y: pctY };
    }

    // Spiral search outward & slightly toward character silhouette center (50, 58)
    for (let radius = 8; radius <= 48; radius += 5) {
      for (let step = 0; step < 12; step++) {
        const angle = (step / 12) * Math.PI * 2;
        const candX = pctX + Math.cos(angle) * radius;
        const candY = pctY + Math.sin(angle) * radius;
        if (isPointValidForSticker(candX, candY, pose.eyeRig)) {
          return { x: candX, y: candY };
        }
      }
    }

    // Safe fallback on lower chest/cheek silhouette
    const fallbacks = [
      { x: 50, y: 74 },
      { x: 38, y: 76 },
      { x: 62, y: 76 },
      { x: 50, y: 24 }
    ];
    for (const fb of fallbacks) {
      if (isPointValidForSticker(fb.x, fb.y, pose.eyeRig)) return fb;
    }
    return { x: 50, y: 75 };
  }

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

    // Check Milestone 3: Elements of Harmony Combo
    if (activeRoundCutieMarks.size === 6) {
      triggerElementsOfHarmonyCombo();
      return;
    }

    // Check Popup Threshold in Party Mode
    if (!isChillMode && currentStickerCount >= popupStickerThreshold) {
      isCascadeActive = true;
      setTimeout(() => {
        triggerRetroWindowCascade();
      }, 350);
    }
  }

  /* ==========================================================================
     8. Task 5: Head-Pat (Petting) Gesture & Double-Click Speech Bubbles
     ========================================================================== */

  const rigFrame = document.getElementById('pinkie-rig-frame');
  const headpatContainer = document.getElementById('headpat-container');

  let patHistory = [];
  let lastDirection = 0;
  let patReversals = 0;
  let patStartTime = 0;

  // Head-Pat Listener attached to stickerSurface (which sits directly over rigFrame)
  stickerSurface.addEventListener('pointermove', (e) => {
    if (isTunerOpen || isCascadeActive) return;
    const rect = rigFrame.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Petting is registered over the upper 42% of the pony's head/mane
    if (relY > rect.height * 0.42 || relX < 0 || relX > rect.width) {
      patReversals = 0;
      return;
    }

    const now = performance.now();
    patHistory.push({ x: relX, t: now });
    patHistory = patHistory.filter((p) => now - p.t < 1200);

    if (patHistory.length >= 3) {
      const prev = patHistory[patHistory.length - 2];
      const dx = relX - prev.x;
      const dir = dx > 2 ? 1 : (dx < -2 ? -1 : 0);

      if (dir !== 0 && dir !== lastDirection) {
        patReversals++;
        lastDirection = dir;
        if (patReversals === 1) patStartTime = now;

        if (patReversals >= 3) {
          const duration = now - patStartTime;
          soundFX.playPettingChime();

          if (duration > 2000) {
            triggerPonyReaction('shy'); // Sustained petting triggers shy blush!
          } else {
            triggerPonyReaction('happy');
          }

          spawnPettingHeart(relX, relY);
          patReversals = 1; // keep chaining
        }
      }
    }
  });

  function spawnPettingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'petting-heart';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 50;
    heart.style.setProperty('--dx', `${dx}px`);

    const colors = ['#FF4081', '#FF80AB', '#FFD54F', '#FFF9A6', '#00E5FF'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    const sz = 16 + Math.random() * 12;

    heart.innerHTML = `
      <svg width="${sz}" height="${sz}" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${col}"/>
      </svg>
    `;
    headpatContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  // Double-Click Y2K Speech Bubble
  stickerSurface.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const char = MANE_6_CHARACTERS[currentCharacterId] || MANE_6_CHARACTERS.pinkie;
    const quotes = char.quotes || ['Friendship is magic! ✨'];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    speechBubbleText.textContent = quote;
    speechBubble.style.display = 'block';
    soundFX.playStickerPop();
    triggerPonyReaction('happy');

    clearTimeout(speechBubbleTimeout);
    speechBubbleTimeout = setTimeout(() => {
      speechBubble.style.display = 'none';
    }, 4000);
  });

  /* ==========================================================================
     9. Task 3: Visual Eye Rig Tuner (Ctrl + E)
     ========================================================================== */

  const eyeRigTuner = document.getElementById('eye-rig-tuner');
  const btnTunerClose = document.getElementById('btn-tuner-close');
  const tunerCharSelect = document.getElementById('tuner-char-select');
  const tunerPoseSelect = document.getElementById('tuner-pose-select');
  const inputLeftCx = document.getElementById('input-left-cx');
  const inputLeftCy = document.getElementById('input-left-cy');
  const inputLeftRx = document.getElementById('input-left-rx');
  const inputLeftRy = document.getElementById('input-left-ry');
  const inputLeftRot = document.getElementById('input-left-rot');
  const chkLeftHide = document.getElementById('chk-left-hide');
  const inputRightCx = document.getElementById('input-right-cx');
  const inputRightCy = document.getElementById('input-right-cy');
  const inputRightRx = document.getElementById('input-right-rx');
  const inputRightRy = document.getElementById('input-right-ry');
  const inputRightRot = document.getElementById('input-right-rot');
  const chkRightHide = document.getElementById('chk-right-hide');
  const inputCoatColor = document.getElementById('input-coat-color');
  const textCoatColor = document.getElementById('text-coat-color');
  const inputPoseScale = document.getElementById('input-pose-scale');
  const inputPoseOffset = document.getElementById('input-pose-offset');
  const btnTunerCopy = document.getElementById('btn-tuner-copy');
  const tunerToast = document.getElementById('tuner-toast');

  let isTunerOpen = false;
  let isDraggingEye = null;

  function initTunerControls() {
    // Populate Char select
    tunerCharSelect.innerHTML = '';
    Object.keys(MANE_6_CHARACTERS).forEach((k) => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = MANE_6_CHARACTERS[k].name;
      tunerCharSelect.appendChild(opt);
    });

    tunerCharSelect.addEventListener('change', () => {
      switchMainCharacter(tunerCharSelect.value);
      updateTunerPoseOptions();
      syncTunerWithActivePose();
    });

    tunerPoseSelect.addEventListener('change', () => {
      currentPoseIndex = parseInt(tunerPoseSelect.value, 10);
      applyActivePose(true);
      syncTunerWithActivePose();
    });

    // Wire Eye Rig Inputs
    const wireInput = (el, valSpan, propPath) => {
      el.addEventListener('input', () => {
        if (valSpan) valSpan.textContent = el.type === 'range' && el.id.includes('rot') ? `${el.value}°` : el.value;
        const pose = getCurrentPose();
        if (!pose || !pose.eyeRig) return;
        setDeepProp(pose.eyeRig, propPath, el.type === 'checkbox' ? el.checked : parseFloat(el.value));
        updateEyeRigUI(pose.eyeRig);
      });
    };

    wireInput(inputLeftCx, document.getElementById('val-left-cx'), 'leftEye.cx');
    wireInput(inputLeftCy, document.getElementById('val-left-cy'), 'leftEye.cy');
    wireInput(inputLeftRx, document.getElementById('val-left-rx'), 'leftEye.rx');
    wireInput(inputLeftRy, document.getElementById('val-left-ry'), 'leftEye.ry');
    wireInput(inputLeftRot, document.getElementById('val-left-rot'), 'leftEye.rot');
    wireInput(chkLeftHide, null, 'leftEye.hidden');

    wireInput(inputRightCx, document.getElementById('val-right-cx'), 'rightEye.cx');
    wireInput(inputRightCy, document.getElementById('val-right-cy'), 'rightEye.cy');
    wireInput(inputRightRx, document.getElementById('val-right-rx'), 'rightEye.rx');
    wireInput(inputRightRy, document.getElementById('val-right-ry'), 'rightEye.ry');
    wireInput(inputRightRot, document.getElementById('val-right-rot'), 'rightEye.rot');
    wireInput(chkRightHide, null, 'rightEye.hidden');

    // Coat color
    inputCoatColor.addEventListener('input', () => {
      textCoatColor.value = inputCoatColor.value;
      const pose = getCurrentPose();
      if (pose) pose.coatColor = inputCoatColor.value;
      document.documentElement.style.setProperty('--character-coat-color', inputCoatColor.value);
    });
    textCoatColor.addEventListener('change', () => {
      inputCoatColor.value = textCoatColor.value;
      const pose = getCurrentPose();
      if (pose) pose.coatColor = textCoatColor.value;
      document.documentElement.style.setProperty('--character-coat-color', textCoatColor.value);
    });

    // Scale & Offset (applied to rigFrame so face rig & stickers remain locked 1:1)
    inputPoseScale.addEventListener('input', () => {
      document.getElementById('val-pose-scale').textContent = inputPoseScale.value;
      const pose = getCurrentPose();
      if (!pose) return;
      pose.scale = parseFloat(inputPoseScale.value);
      rigFrame.style.transform = `translateY(${pose.offsetY || 0}px) scale(${pose.scale || 1.0})`;
    });

    inputPoseOffset.addEventListener('input', () => {
      document.getElementById('val-pose-offset').textContent = `${inputPoseOffset.value}px`;
      const pose = getCurrentPose();
      if (!pose) return;
      pose.offsetY = parseFloat(inputPoseOffset.value);
      rigFrame.style.transform = `translateY(${pose.offsetY || 0}px) scale(${pose.scale || 1.0})`;
    });

    // Copy JSON Config button with fallback for file:// contexts
    btnTunerCopy.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const pose = getCurrentPose();
      if (!pose) return;
      const jsonStr = JSON.stringify(pose, null, 2);
      const copyFallback = () => {
        const ta = document.createElement('textarea');
        ta.value = jsonStr;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        ta.remove();
        showTunerToast();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonStr).then(showTunerToast).catch(copyFallback);
      } else {
        copyFallback();
      }
    });

    btnTunerClose.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      toggleEyeRigTuner(false);
    });

    makeElementDraggable(eyeRigTuner, document.getElementById('eye-rig-tuner-titlebar'));
  }

  function setDeepProp(obj, path, val) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function updateTunerPoseOptions() {
    const char = MANE_6_CHARACTERS[currentCharacterId];
    tunerPoseSelect.innerHTML = '';
    if (!char || !char.poses) return;
    char.poses.forEach((p, idx) => {
      const opt = document.createElement('option');
      opt.value = idx.toString();
      opt.textContent = `${idx + 1}. ${p.label}`;
      tunerPoseSelect.appendChild(opt);
    });
  }

  function syncTunerWithActivePose() {
    tunerCharSelect.value = currentCharacterId;
    tunerPoseSelect.value = currentPoseIndex.toString();
    const pose = getCurrentPose();
    if (!pose || !pose.eyeRig) return;

    const l = pose.eyeRig.leftEye || {};
    const r = pose.eyeRig.rightEye || {};

    inputLeftCx.value = l.cx || 30;
    document.getElementById('val-left-cx').textContent = l.cx || 30;
    inputLeftCy.value = l.cy || 48;
    document.getElementById('val-left-cy').textContent = l.cy || 48;
    inputLeftRx.value = l.rx || 9.5;
    document.getElementById('val-left-rx').textContent = l.rx || 9.5;
    inputLeftRy.value = l.ry || 10.2;
    document.getElementById('val-left-ry').textContent = l.ry || 10.2;
    inputLeftRot.value = l.rot || 0;
    document.getElementById('val-left-rot').textContent = `${l.rot || 0}°`;
    chkLeftHide.checked = Boolean(l.hidden);

    inputRightCx.value = r.cx || 65;
    document.getElementById('val-right-cx').textContent = r.cx || 65;
    inputRightCy.value = r.cy || 48;
    document.getElementById('val-right-cy').textContent = r.cy || 48;
    inputRightRx.value = r.rx || 9.5;
    document.getElementById('val-right-rx').textContent = r.rx || 9.5;
    inputRightRy.value = r.ry || 10.2;
    document.getElementById('val-right-ry').textContent = r.ry || 10.2;
    inputRightRot.value = r.rot || 0;
    document.getElementById('val-right-rot').textContent = `${r.rot || 0}°`;
    chkRightHide.checked = Boolean(r.hidden);

    inputCoatColor.value = pose.coatColor || '#F6B2D1';
    textCoatColor.value = pose.coatColor || '#F6B2D1';
    inputPoseScale.value = pose.scale || 1.0;
    document.getElementById('val-pose-scale').textContent = pose.scale || 1.0;
    inputPoseOffset.value = pose.offsetY || 0;
    document.getElementById('val-pose-offset').textContent = `${pose.offsetY || 0}px`;
  }

  function showTunerToast() {
    tunerToast.classList.add('show');
    setTimeout(() => tunerToast.classList.remove('show'), 2200);
  }

  function toggleEyeRigTuner(force = null) {
    isTunerOpen = force !== null ? force : !isTunerOpen;
    eyeRigTuner.style.display = isTunerOpen ? 'block' : 'none';
    document.body.classList.toggle('tuner-mode-active', isTunerOpen);
    if (isTunerOpen) {
      updateTunerPoseOptions();
      syncTunerWithActivePose();
    }
  }

  // On-screen direct dragging of eye groups in Tuner Mode
  [
    { el: rigEyeLeftGroup, which: 'left' },
    { el: rigEyeRightGroup, which: 'right' }
  ].forEach(({ el, which }) => {
    el.addEventListener('pointerdown', (e) => {
      if (!isTunerOpen) return;
      e.stopPropagation();
      isDraggingEye = which;

      const onMove = (ev) => {
        if (!isDraggingEye) return;
        const rect = rigFrame.getBoundingClientRect();
        const pctX = Math.round(((ev.clientX - rect.left) / rect.width) * 1000) / 10;
        const pctY = Math.round(((ev.clientY - rect.top) / rect.height) * 1000) / 10;
        const pose = getCurrentPose();
        if (!pose || !pose.eyeRig) return;

        if (isDraggingEye === 'left') {
          pose.eyeRig.leftEye.cx = pctX;
          pose.eyeRig.leftEye.cy = pctY;
          inputLeftCx.value = pctX;
          document.getElementById('val-left-cx').textContent = pctX;
          inputLeftCy.value = pctY;
          document.getElementById('val-left-cy').textContent = pctY;
        } else {
          pose.eyeRig.rightEye.cx = pctX;
          pose.eyeRig.rightEye.cy = pctY;
          inputRightCx.value = pctX;
          document.getElementById('val-right-cx').textContent = pctX;
          inputRightCy.value = pctY;
          document.getElementById('val-right-cy').textContent = pctY;
        }
        updateEyeRigUI(pose.eyeRig);
      };

      const onUp = () => {
        isDraggingEye = null;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  });

  // Ctrl + E to toggle Tuner
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      toggleEyeRigTuner();
    }
  });

  /* ==========================================================================
     10. Milestone 3: Elements of Harmony & Party Cannon Reset
     ========================================================================== */

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
     11. Milestone 2: Retro Pop-up Window Cascade
     ========================================================================== */

  const windowOverlay = document.getElementById('window-overlay');
  let openWindows = [];
  let highestZIndex = 510;

  const MANE_6_CAMEOS = [
    { id: 'twilight', name: 'Twilight Sparkle', icon: '🔮', title: '🔮 · Twilight_Library.sys', themeClass: 'titlebar-twilight', file: 'assets/poses/twilight-pose1.png' },
    { id: 'rainbow', name: 'Rainbow Dash', icon: '⚡', title: '⚡ · Sonic_Rainboom.avi', themeClass: 'titlebar-rainbow', file: 'assets/poses/rainbow-pose1.png' },
    { id: 'fluttershy', name: 'Fluttershy', icon: '🌸', title: '🌸 · Kindness_Vibes.exe', themeClass: 'titlebar-fluttershy', file: 'assets/poses/fluttershy-pose1.png' },
    { id: 'rarity', name: 'Rarity', icon: '💎', title: '💎 · Fabulous_Design.exe', themeClass: 'titlebar-rarity', file: 'assets/poses/rarity-pose1.png' },
    { id: 'applejack', name: 'Applejack', icon: '🍎', title: '🍎 · Sweet_Apple_Acres.bat', themeClass: 'titlebar-applejack', file: 'assets/poses/applejack-pose1.png' }
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
      img.src = 'assets/poses/pinkie-pose1.png';
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

  function makeElementDraggable(win, handle, onSave = null) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initLeft = 0, initTop = 0;

    const onPointerDown = (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
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
      win.style.right = 'auto';
      win.style.bottom = 'auto';

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
      if (onSave) onSave({ left: parseInt(win.style.left, 10), top: parseInt(win.style.top, 10) });
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
     12. Milestone 2: Real-Time Audio Visualizer (Winamp Style)
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
    const bassAvg = bassSum / bassBins;

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

      const grad = winampCtx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0.0, '#00FF66');
      grad.addColorStop(0.6, '#FFFF00');
      grad.addColorStop(1.0, '#FF0033');

      winampCtx.fillStyle = grad;
      winampCtx.fillRect(x, y, barWidth, barHeight);
    }
  }

  /* ==========================================================================
     13. Milestone 2: Live Hardware Monitor (Ponyville_TaskMgr.exe)
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
  const tabTaskmgrPerf = document.getElementById('tab-taskmgr-perf');
  const tabTaskmgrPonies = document.getElementById('tab-taskmgr-ponies');
  const taskmgrContent = document.getElementById('taskmgr-content');
  const taskmgrPoniesView = document.getElementById('taskmgr-ponies-view');

  const cpuHistory = new Array(36).fill(12);

  if (tabTaskmgrPerf && tabTaskmgrPonies && taskmgrContent && taskmgrPoniesView) {
    tabTaskmgrPerf.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      tabTaskmgrPerf.classList.add('active');
      tabTaskmgrPonies.classList.remove('active');
      taskmgrContent.style.display = 'flex';
      taskmgrPoniesView.style.display = 'none';
    });
    tabTaskmgrPonies.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      tabTaskmgrPonies.classList.add('active');
      tabTaskmgrPerf.classList.remove('active');
      taskmgrPoniesView.style.display = 'flex';
      taskmgrContent.style.display = 'none';
    });
  }

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

  setInterval(() => {
    if (isPaused) return;
    const simCpu = Math.max(5, Math.min(95, Math.round(15 + Math.random() * 25 + Math.sin(Date.now() * 0.001) * 10)));
    const simRam = Math.max(30, Math.min(85, Math.round(44 + Math.sin(Date.now() * 0.0005) * 6)));
    const simGpu = Math.max(8, Math.min(75, Math.round(20 + Math.random() * 18)));
    updateTaskMgrUI(simCpu, simRam, simGpu);
  }, 1000);

  /* ==========================================================================
     14. Milestone 4: Daily Y2K Productivity Widgets (Clock & To-Do)
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

  // Clock
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

  // To-Do List
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
      { id: 2, text: 'Study friendship books with Twilight', done: false }
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
    todos.push({ id: Date.now(), text: val, done: false });
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
     15. Task 4: Taskbar-Safe, Draggable & Collapsible Control Dock
     ========================================================================== */

  const wallpaperControls = document.getElementById('wallpaper-controls');
  const dockDragHandle = document.getElementById('dock-drag-handle');
  const btnDockCollapse = document.getElementById('btn-dock-collapse');
  const btnPoseSwitch = document.getElementById('btn-pose-switch');
  const btnModeToggle = document.getElementById('btn-mode-toggle');
  const iconModeParty = document.getElementById('icon-mode-party');
  const iconModeChill = document.getElementById('icon-mode-chill');
  const btnPartyGuest = document.getElementById('btn-party-guest');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const btnManualReset = document.getElementById('btn-manual-reset');

  // Restore saved dock position
  try {
    const savedPos = localStorage.getItem('pony_dock_position');
    if (savedPos) {
      const pos = JSON.parse(savedPos);
      if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
        const safeLeft = Math.max(5, Math.min(window.innerWidth - 120, pos.left));
        const safeTop = Math.max(5, Math.min(window.innerHeight - 60, pos.top));
        wallpaperControls.style.left = `${safeLeft}px`;
        wallpaperControls.style.top = `${safeTop}px`;
        wallpaperControls.style.right = 'auto';
        wallpaperControls.style.bottom = 'auto';
      }
    }
  } catch (e) {}

  // Dragging dock
  makeElementDraggable(wallpaperControls, dockDragHandle, (pos) => {
    localStorage.setItem('pony_dock_position', JSON.stringify(pos));
  });

  // Double-click on drag handle resets to default position (bottom: 76px; right: 24px)
  dockDragHandle.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    localStorage.removeItem('pony_dock_position');
    wallpaperControls.style.left = 'auto';
    wallpaperControls.style.top = 'auto';
    wallpaperControls.style.right = '24px';
    wallpaperControls.style.bottom = '76px';
  });

  // Collapsible dock toggle
  const savedCollapsed = localStorage.getItem('pony_dock_collapsed') === 'true';
  if (savedCollapsed) {
    wallpaperControls.classList.add('is-collapsed');
  }

  btnDockCollapse.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    const isNowCollapsed = wallpaperControls.classList.toggle('is-collapsed');
    localStorage.setItem('pony_dock_collapsed', isNowCollapsed.toString());
  });

  // Pose Switcher Button
  btnPoseSwitch.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    cycleCharacterPose();
  });

  // Mode Toggle (Party vs Chill Mode)
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

  // Sound Mute Toggle
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

  btnSoundToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    const muted = soundFX.toggleMute();
    updateMuteIcons(muted);
    if (!muted) soundFX.playStickerPop();
  });

  // Party Guest Button
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

  // Manual Reset Button
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

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isTunerOpen) {
        toggleEyeRigTuner(false);
      } else if (openWindows.length > 0) {
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
     16. Milestone 3: Fullscreen Signature Screen Effects
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
     17. Milestone 2: Lively Wallpaper Native Property Integration
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
      initAmbientParticles();

    } else if (name === 'muteAudio') {
      if (soundFX.isMuted !== Boolean(val)) {
        soundFX.toggleMute();
        updateMuteIcons(soundFX.isMuted);
      }
    }
  };

  /* ==========================================================================
     18. Main RAF Render Loop
     ========================================================================== */

  function renderLoop() {
    if (!isPaused) {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      document.documentElement.style.setProperty('--parallax-bg-x', `${-currentParallaxX * 14}px`);
      document.documentElement.style.setProperty('--parallax-bg-y', `${-currentParallaxY * 10}px`);
      document.documentElement.style.setProperty('--parallax-ribbon-x', `${-currentParallaxX * 22}px`);
      document.documentElement.style.setProperty('--parallax-ribbon-y', `${-currentParallaxY * 8}px`);
      document.documentElement.style.setProperty('--parallax-char-x', `${currentParallaxX * 18}px`);
      document.documentElement.style.setProperty('--parallax-char-y', `${currentParallaxY * 12}px`);

      // Ambient Theme Particles
      renderAmbientParticles();

      // Winamp Equalizer
      renderWinampEQ();
    }
    animFrameId = requestAnimationFrame(renderLoop);
  }

  // Startup Initialization
  preRenderParticleSprites();
  window.addEventListener('resize', resizeStarCanvas);
  resizeStarCanvas();
  applyActivePose(true);
  initTunerControls();
  animFrameId = requestAnimationFrame(renderLoop);

})();
