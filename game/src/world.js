// Twin Garden's rules and state, with no drawing and no browser in it:
// which differences are found, the timer, mistakes, hints, the keyboard
// cursor, and what a click at a point means. The renderer paints this;
// the input layer feeds it points.

import {
  DIFFERENCES,
  HINTS,
  HINT_SECONDS,
  PANEL,
  PANEL_LEFT,
  PANEL_RIGHT,
  TOTAL_DIFFERENCES,
  WRONG_FADE,
} from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_WIN = 'win';

export const MARK_FOUND = 'found';
export const MARK_ALREADY = 'already';
export const MARK_WRONG = 'wrong';
export const MARK_NONE = 'none';

function panelAt(x, y) {
  if (x >= PANEL_LEFT.x && x < PANEL_LEFT.x + PANEL.width && y >= PANEL_LEFT.y && y < PANEL_LEFT.y + PANEL.height) {
    return { origin: PANEL_LEFT, local: { x: x - PANEL_LEFT.x, y: y - PANEL_LEFT.y } };
  }
  if (x >= PANEL_RIGHT.x && x < PANEL_RIGHT.x + PANEL.width && y >= PANEL_RIGHT.y && y < PANEL_RIGHT.y + PANEL.height) {
    return { origin: PANEL_RIGHT, local: { x: x - PANEL_RIGHT.x, y: y - PANEL_RIGHT.y } };
  }
  return null;
}

export function createWorld() {
  const state = {
    screen: SCREEN_TITLE,
    found: new Set(),
    mistakes: 0,
    elapsed: 0,
    hintsLeft: HINTS,
    hint: null, // { index, until } while a hint ring is showing
    wrong: [], // { x, y, until } red crosses, in canvas coordinates
    cursor: { x: PANEL_LEFT.x + PANEL.width / 2, y: PANEL_LEFT.y + PANEL.height / 2 },
    muted: false,
    winStats: null, // { seconds, mistakes, stars } once the game is won
  };

  function reset() {
    state.screen = SCREEN_PLAY;
    state.found = new Set();
    state.mistakes = 0;
    state.elapsed = 0;
    state.hintsLeft = HINTS;
    state.hint = null;
    state.wrong = [];
    state.cursor = { x: PANEL_LEFT.x + PANEL.width / 2, y: PANEL_LEFT.y + PANEL.height / 2 };
    state.winStats = null;
  }

  function toTitle() {
    state.screen = SCREEN_TITLE;
    state.found = new Set();
    state.mistakes = 0;
    state.elapsed = 0;
    state.hintsLeft = HINTS;
    state.hint = null;
    state.wrong = [];
    state.winStats = null;
  }

  function remaining() {
    return TOTAL_DIFFERENCES - state.found.size;
  }

  function stars() {
    if (state.mistakes === 0 && state.elapsed <= 240) return 3;
    if (state.mistakes <= 2) return 2;
    return 1;
  }

  function win() {
    state.screen = SCREEN_WIN;
    state.winStats = { seconds: state.elapsed, mistakes: state.mistakes, stars: stars() };
  }

  /**
   * A click (or Enter on the keyboard cursor) at canvas point (x, y).
   * Returns MARK_FOUND with the difference, MARK_ALREADY when the zone was
   * found before, MARK_WRONG for a miss, or MARK_NONE outside both pictures.
   */
  function markAt(x, y) {
    if (state.screen !== SCREEN_PLAY) return { result: MARK_NONE, diff: null };
    const panel = panelAt(x, y);
    if (panel === null) return { result: MARK_NONE, diff: null };
    const { local } = panel;
    for (let index = 0; index < DIFFERENCES.length; index += 1) {
      const diff = DIFFERENCES[index];
      const dx = local.x - diff.x;
      const dy = local.y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        if (state.found.has(index)) return { result: MARK_ALREADY, diff };
        state.found.add(index);
        if (state.found.size === TOTAL_DIFFERENCES) win();
        return { result: MARK_FOUND, diff };
      }
    }
    state.mistakes += 1;
    state.wrong.push({ x, y, until: state.elapsed + WRONG_FADE });
    return { result: MARK_WRONG, diff: null };
  }

  /** Spend one hint: ring the first still-unfound difference for a while. */
  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return null;
    for (let index = 0; index < DIFFERENCES.length; index += 1) {
      if (!state.found.has(index)) {
        state.hintsLeft -= 1;
        state.hint = { index, until: state.elapsed + HINT_SECONDS };
        return DIFFERENCES[index];
      }
    }
    return null;
  }

  /** Advance the clock; wrong-click crosses and hints fade on their own. */
  function step(dt) {
    if (state.screen === SCREEN_PLAY) state.elapsed += dt;
    if (state.hint !== null && state.elapsed >= state.hint.until) state.hint = null;
    while (state.wrong.length > 0 && state.elapsed >= state.wrong[0].until) state.wrong.shift();
  }

  return { state, reset, toTitle, remaining, markAt, useHint, step, win };
}
