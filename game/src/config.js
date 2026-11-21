// Twin Garden — spot the difference. Every tuning number, colour and
// difference in one place. The playfield is a fixed 1280x720 logical area;
// the renderer scales it to the window, so no rule depends on screen size.

export const FIELD = { width: 1280, height: 720 };

/** One garden picture, in panel-local coordinates (600 x 560). */
export const PANEL = { width: 600, height: 560 };
export const PANEL_LEFT = { x: 24, y: 84 };
export const PANEL_RIGHT = { x: 656, y: 84 };

export const TOTAL_DIFFERENCES = 10;

/**
 * The ten differences, in panel-local coordinates. `x, y, r` is the hit
 * zone the player must click (the same zone on both pictures); `name` is
 * what the win screen and the hint call it. The right picture is the
 * "twin": it drops or changes exactly the thing each entry names.
 */
export const DIFFERENCES = [
  { id: 'sunglasses', name: 'The sun wears sunglasses', x: 78, y: 72, r: 48 },
  { id: 'bird', name: 'A bird in the sky', x: 330, y: 78, r: 32 },
  { id: 'butterfly', name: 'A butterfly by the flowers', x: 350, y: 430, r: 32 },
  { id: 'apples', name: 'Apples on the tree', x: 110, y: 210, r: 60 },
  { id: 'window', name: 'The lit window', x: 435, y: 330, r: 34 },
  { id: 'duck', name: 'A duck on the pond', x: 470, y: 492, r: 40 },
  { id: 'cat', name: 'A cat on the fence', x: 300, y: 368, r: 36 },
  { id: 'tulip', name: 'The red tulip', x: 200, y: 470, r: 30 },
  { id: 'mushroom', name: 'A mushroom by the tree', x: 150, y: 418, r: 28 },
  { id: 'smoke', name: 'Smoke from the chimney', x: 532, y: 178, r: 36 },
];

/** Wrong clicks allowed before the hint key is the only help left. */
export const HINTS = 3;

/** A wrong-click cross stays on screen this long (seconds). */
export const WRONG_FADE = 0.9;

/** A hint ring pulses around one unfound difference this long (seconds). */
export const HINT_SECONDS = 2.5;

/** Keyboard cursor step, in logical pixels (Shift moves four times as far). */
export const CURSOR_STEP = 14;

export const PALETTE = {
  page: '#20242e',
  header: '#171a21',
  panelFrame: '#3a4152',
  panelLabel: '#c8cfdd',
  text: '#f2f4f8',
  muted: '#9aa3b5',
  accent: '#ffd166',
  found: '#3ddc84',
  wrong: '#ff5d5d',
  hint: '#ffd166',
  skyTop: '#8ec9ee',
  skyBottom: '#dceffb',
  hillFar: '#8fbf7f',
  hillNear: '#6da85e',
  lawn: '#79b264',
  lawnDark: '#6aa457',
  trunk: '#7a5230',
  leaf: '#4e9a3f',
  leafDark: '#3f8434',
  apple: '#e23b3b',
  houseWall: '#f6e3c2',
  houseRoof: '#c96f4a',
  houseDoor: '#8a5a33',
  windowLit: '#ffd94d',
  windowDark: '#39506b',
  fence: '#a9805a',
  fenceDark: '#8a6a45',
  path: '#e8d5a8',
  pond: '#5fb3e6',
  pondDark: '#3f8fc4',
  flowerRed: '#e24545',
  flowerYellow: '#f2c230',
  flowerPink: '#ef7fb0',
  flowerPurple: '#9b7ede',
  flowerWhite: '#f5f2e8',
  stem: '#3f8434',
  cat: '#e8a34c',
  duck: '#f5f0dc',
  duckBeak: '#f08c1e',
  butterflyWing: '#7fb3ef',
  mushroomCap: '#d94f3d',
  overlay: 'rgba(12, 14, 20, 0.72)',
  card: '#262b38',
  cardBorder: '#454e63',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Best time is kept between visits (this browser only). */
export const BEST_KEY = 'twin-garden.best-seconds';
