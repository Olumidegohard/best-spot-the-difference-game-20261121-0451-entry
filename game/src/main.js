// Boot and the one loop: input is read every frame, the world advances in
// real time while playing, and the renderer paints what is there. The game
// moves between four screens: title, play, paused and win.
//
// ?shot=start|play|end stages that scene instead of running the loop,
// paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY } from './config.js';
import { createWorld, MARK_FOUND, MARK_WRONG, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createRenderer } from './render.js';
import { createSound } from './sound.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const sound = createSound();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || null;
  } catch {
    return null;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best time then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  renderer.fit();
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, world.state);
  let best = readBest();
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen
  // changes and each difference found.
  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    sound.unlock();
    world.reset();
    announce('Playing. Find 10 differences.');
  }

  function markAtCursor() {
    const { x, y } = world.state.cursor;
    const outcome = world.markAt(x, y);
    if (outcome.result === MARK_FOUND) {
      sound.found();
      const left = world.remaining();
      announce(`Found: ${outcome.diff.name}. ${left} left.`);
      if (world.state.screen === SCREEN_WIN) {
        sound.win();
        const seconds = Math.floor(world.state.elapsed);
        if (best === null || seconds < best) {
          best = seconds;
          saveBest(best);
        }
        announce(`You found them all in ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds, with ${world.state.mistakes} wrong clicks.`);
      }
    } else if (outcome.result === MARK_WRONG) {
      sound.wrong();
      announce(`Not a difference. ${world.remaining()} left.`);
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    const { screen } = world.state;
    if (actions & ACTION_MUTE) {
      world.state.muted = sound.toggleMuted();
      announce(world.state.muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_RESTART && (screen === SCREEN_WIN || screen === SCREEN_PLAY || screen === SCREEN_PAUSED)) {
      startGame();
      return;
    }
    if (screen === SCREEN_TITLE) {
      if (actions & ACTION_CONFIRM) startGame();
      return;
    }
    if (screen === SCREEN_WIN) {
      if (actions & ACTION_CONFIRM) startGame();
      return;
    }
    if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      world.state.screen = SCREEN_PAUSED;
      announce('Paused.');
    } else if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && screen === SCREEN_PAUSED) {
      world.state.screen = SCREEN_PLAY;
      announce('Playing.');
    }
    if (actions & ACTION_CONFIRM && screen === SCREEN_PLAY) markAtCursor();
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      const hinted = world.useHint();
      if (hinted !== null) {
        sound.hint();
        announce(`Hint: look for ${hinted.name}.`);
      } else {
        announce('No hints left.');
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    handleActions();
    input.moveCursor(dt);
    world.step(dt);
    renderer.draw(world.state, best);
  }

  window.addEventListener('resize', () => renderer.fit());
  renderer.fit();

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.state.screen === SCREEN_PLAY) {
      world.state.screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Twin Garden. Two garden pictures, ten differences. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
