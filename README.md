# 🎈 Pinkie Pie & Mane 6 Y2K Party Live Wallpaper (v3.0 Production)

A full-featured, zero-dependency, GPU-accelerated interactive live wallpaper created for **Lively Wallpaper** and modern desktop environments. Features procedural Web Audio sound synthesis, real-time audio visualization, a Windows 95/98 hardware task manager, daily productivity widgets, 3D cursor parallax gaze tracking, and dynamic theme switching across the entire Mane 6 roster.

---

## 🚀 Quick Start & Installation

### Option 1: Drag & Drop `.lively` Package (Recommended)
1. Download or build `PROJECT_MLP.lively`.
2. Open **Lively Wallpaper**.
3. Drag and drop `PROJECT_MLP.lively` directly onto the Lively Wallpaper library window.
4. Select the wallpaper and click **OK**.

### Option 2: Folder / Web Mode in Lively
1. Open **Lively Wallpaper**.
2. Click **Add Wallpaper** (`+` button).
3. Click **Browse** and select `index.html` inside `C:\Users\nhatwi\Documents\PROJECTS\PROJECT_MLP\`.
4. Click **OK** to set it as your desktop background.

### Option 3: Direct Browser Preview
Double-click `index.html` or open it with any Chromium, Edge, or Firefox browser. All features—including procedural audio, offline star caching, widgets, hardware simulation, and spectrum analysis—work out of the box with zero external dependencies.

---

## 🌟 Key Features

### 1. Mane 6 Center-Stage Roster & Dynamic Themes
Switch the active center-stage pony at any time between all 6 characters:
- **Pinkie Pie:** Soft bubblegum pink palette, joyful bounciness, party effects.
- **Twilight Sparkle:** Royal lavender theme, magic aura rings, and arcane sparkles.
- **Rainbow Dash:** Sky-blue theme, sonic rainboom streak, and screen shockwave.
- **Fluttershy:** Pastel cream-yellow theme, fluttering butterfly flock, and soft nature chimes.
- **Rarity:** Alabaster and royal sapphire theme, falling diamond crystal shower.
- **Applejack:** Warm honey-orange theme, bouncing golden apple harvest.

When a character is selected, `:root` dynamic CSS variables instantly update background tints, ribbon gradient check patterns, star glows, drop shadows, and vector eyelid colors without canvas CORS taint.

### 2. GPU Performance & Offscreen Star Cache
- **Pre-rendered Sprite Cache:** Glowing star shapes with gaussian blurs (`shadowBlur`) are pre-rendered onto an offscreen canvas at startup and rendered via fast GPU `drawImage()` calls.
- **Background Pause Detection:** Automatically hooks into `document.visibilitychange` and Lively's native `window.livelyWallpaperPlaybackChanged(data)` API. When windows cover the desktop, the wallpaper is minimized, or playback pauses, `requestAnimationFrame`, intervals, and Web Audio completely suspend to preserve 0% idle CPU/GPU usage.

### 3. Real-Time Audio Visualizer (`livelyAudioListener`)
- Listens to Lively's native 128-band frequency array.
- Bass frequencies dynamically drive the character's rhythmic bounce, scale pulse, and ribbon glow.
- Includes a compact, toggleable Windows 95 / Winamp-style equalizer in the lower-left corner (`WinMLP Visualizer.exe`) featuring retro multi-segment LED peak meters (green -> yellow -> red).
- Features a built-in simulation mode (`SIM TEST`) for standalone browser testing.

### 4. Live Hardware Monitor (`Ponyville_TaskMgr.exe`)
- Implements `window.livelySystemInformation(data)` to monitor real-time CPU usage, RAM utilization, and GPU 3D load.
- Styled as an authentic draggable Windows 95/98 Task Manager with a green phosphor oscilloscope CPU history graph.
- Draggable title bar, closeable, and toggleable from the bottom control bar.

### 5. Daily Y2K Productivity Widgets (Container Queries)
Built with modern CSS Container Queries (`container-type: inline-size` and `@container`) and persistent via `localStorage`:
- **Clock & Calendar (`Pony_Time.exe`):** Digital LED time with blinking seconds, current date, full monthly calendar highlighting today's date, and daily pony wisdom quotes.
- **To-Do List (`Equestria_Notes.exe`):** Add tasks, check off completed quests with strikethrough styling, delete items, and track total progress. Automatically persists between reboots and desktop sessions.

### 6. Cursor Gaze Tracking & 3D Parallax
Calculates cursor distance from the viewport center to apply silky-smooth physics-interpolated (lerp) `translate3d` parallax:
- Background stars drift in subtle counter-perspective.
- Argyle wavy ribbon shifts at mid-depth.
- Center character tilts and tracks cursor direction.
- Vector face rig shifts dynamically so the pony's gaze follows your cursor across the screen.

### 7. Elements of Harmony Combo & Party Cannon Reset
- **Elements of Harmony Combo:** Slap all 6 distinct Mane 6 Cutie Marks onto the stage within a single round to trigger a fullscreen 6-color rainbow beam ascension combo with golden rune seals and polyphonic Web Audio chords.
- **Party Cannon Reset:** Clicking the reset button blasts all placed stickers off the stage as physics projectiles with randomized upward velocities, gravity, and angular spin before exploding in a confetti celebration burst.

### 8. Party Mode vs Chill Mode
Toggle between two desktop experiences with the bottom control bar button:
- **Party Mode:** Full energetic popup cascades, sound effects, and sticker chaos.
- **Chill Mode:** Suppresses disruptive multi-window popup cascades while keeping gentle idle breathing, starfall, and music synchronization active for focused work sessions.

---

## 🎛️ Lively Properties Customization Guide

Configure the wallpaper directly through Lively Wallpaper's settings interface (powered by `LivelyProperties.json`):

| Property Name | Type | Range / Options | Description |
| :--- | :--- | :--- | :--- |
| `characterSelect` | Dropdown | Pinkie, Twilight, Rainbow, Fluttershy, Rarity, Applejack | Sets the active center-stage character and dynamic theme. |
| `popupThreshold` | Slider | 3 to 20 (Default: 7) | Number of slapped stickers required to trigger retro popup cascades. |
| `ribbonSpeed` | Slider | 10% to 300% (Default: 100%) | Controls the scrolling speed of the wavy argyle ribbon. |
| `starDensity` | Slider | 10 to 120 (Default: 42) | Sets the number of floating stars rendered on the GPU canvas. |
| `muteAudio` | Checkbox | true / false | Mutes or unmutes all procedural Web Audio SFX. |

---

## ⌨️ Controls & Keyboard Shortcuts

| Control | Action |
| :--- | :--- |
| **Left Click / Tap on Pony** | Slap next Y2K icon or Cutie Mark sticker and trigger squish reaction. |
| **Mouse Move** | Drive 3D parallax depth and vector eyelid gaze tracking. |
| **Mane 6 Dock (Bottom Right)** | Instantly switch between Pinkie, Twilight, Rainbow, Fluttershy, Rarity, and Applejack. |
| **Party / Chill Button** | Toggle between popup cascade chaos and calm focus mode. |
| **Task Manager Button** | Open / minimize `Ponyville_TaskMgr.exe` hardware monitor. |
| **Widgets Button** | Open / minimize `Pony_Time.exe` clock and `Equestria_Notes.exe` to-do list. |
| **Visualizer Button** | Toggle the retro Winamp equalizer. |
| **Guest Summon Button** | Summon a surprise Mane 6 cameo window and signature screen effect. |
| **Sound Button** | Toggle procedural sound effects on / off. |
| **Reset Button** | Fire Pinkie's Party Cannon to blast stickers away with parabolic physics. |
| **Esc Key** | Close topmost open retro window or productivity widget. |

---

## 📦 Building the `.lively` Package

To re-package the project after making modifications, run the included PowerShell packaging script from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-lively.ps1
```

The script automatically validates all required files (`index.html`, `style.css`, `app.js`, `LivelyInfo.json`, `LivelyProperties.json`, `assets/`), formats zip entry paths using standard forward slashes, and outputs `PROJECT_MLP.lively` ready for deployment.

---

## 📜 License
MIT License. Created with ❤️ for My Little Pony and live wallpaper enthusiasts.
