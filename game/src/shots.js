// The screenshot scenes behind ?shot=start|play|end. Each one sets the real
// game state directly — the play scene is a genuine mid-game position with
// four differences found and circled on both pictures, six still hiding,
// one wrong click on the record and the clock at 1:27 — so every frame is
// what a real game looks like, and the same query always gives the same frame.

import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './world.js';

/** The four differences already found in the mid-play shot, spread across the garden. */
const PLAY_FOUND = [0, 3, 5, 7]; // sunglasses, apples, duck, red tulip

export function stageShot(name, world) {
  const { state } = world;
  if (name === 'play') {
    world.reset();
    state.screen = SCREEN_PLAY;
    for (const index of PLAY_FOUND) state.found.add(index);
    state.mistakes = 1;
    state.elapsed = 87;
    state.wrong = [{ x: 900, y: 300, until: 87.9 }];
    return { best: 152 };
  }
  if (name === 'end') {
    world.reset();
    state.screen = SCREEN_WIN;
    for (let index = 0; index < 10; index += 1) state.found.add(index);
    state.mistakes = 2;
    state.elapsed = 214;
    state.winStats = { seconds: 214, mistakes: 2, stars: 2 };
    return { best: 198 };
  }
  world.toTitle();
  state.screen = SCREEN_TITLE;
  return { best: null };
}
