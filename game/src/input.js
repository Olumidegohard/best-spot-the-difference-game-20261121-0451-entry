// Keyboard and pointer input. Held arrow keys move the crosshair; one-shot
// presses (mark, start, pause, hint, restart, mute) are queued as bit flags
// and taken once by the loop, so a press between two frames is never lost
// and never counted twice. The mouse moves the same crosshair the keys
// steer, so both ways of playing share one cursor.

import { CURSOR_STEP, FIELD } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_RESTART = 8;
export const ACTION_MUTE = 16;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const RESTART = new Set(['KeyR']);
const MUTE = new Set(['KeyM']);

export function createInput(canvas, state) {
  let actions = 0;
  const keys = new Set();

  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
      y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
    };
  }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      keys.add(event.code);
      event.preventDefault();
      return;
    }
    if (event.repeat) return;
    if (CONFIRM.has(event.code)) actions |= ACTION_CONFIRM;
    else if (PAUSE.has(event.code)) actions |= ACTION_PAUSE;
    else if (HINT.has(event.code)) actions |= ACTION_HINT;
    else if (RESTART.has(event.code)) actions |= ACTION_RESTART;
    else if (MUTE.has(event.code)) actions |= ACTION_MUTE;
    else return;
    event.preventDefault();
  });
  window.addEventListener('keyup', (event) => {
    keys.delete(event.code);
  });
  // A key released while the tab is hidden never sends keyup: let go on blur.
  window.addEventListener('blur', () => keys.clear());

  canvas.addEventListener('pointermove', (event) => {
    const point = toLogical(event);
    state.cursor.x = Math.max(0, Math.min(FIELD.width, point.x));
    state.cursor.y = Math.max(0, Math.min(FIELD.height, point.y));
  });
  canvas.addEventListener('pointerdown', (event) => {
    const point = toLogical(event);
    state.cursor.x = Math.max(0, Math.min(FIELD.width, point.x));
    state.cursor.y = Math.max(0, Math.min(FIELD.height, point.y));
    actions |= ACTION_CONFIRM;
  });

  return {
    /** Move the crosshair by the held arrow keys (Shift = four steps). */
    moveCursor(dt) {
      const step = CURSOR_STEP * (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 4 : 1);
      // Keys are per-frame here: move a fixed step per frame at 60 fps.
      const perFrame = step * dt * 60;
      if (keys.has('ArrowLeft')) state.cursor.x -= perFrame;
      if (keys.has('ArrowRight')) state.cursor.x += perFrame;
      if (keys.has('ArrowUp')) state.cursor.y -= perFrame;
      if (keys.has('ArrowDown')) state.cursor.y += perFrame;
      state.cursor.x = Math.max(0, Math.min(FIELD.width, state.cursor.x));
      state.cursor.y = Math.max(0, Math.min(FIELD.height, state.cursor.y));
    },
    /** The one-shot presses since the last call, as ACTION_* flags. */
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
  };
}
