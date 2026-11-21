# Twin Garden — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Olumidegohard/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Olumidegohard/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two garden pictures, side by side — ten small things differ. Click a
difference on either picture to circle it on both, and find all ten before
the clock runs your patience out.

## Play it

Serve `game/` with any static server and open `index.html` in a desktop
browser (Chrome works; no network request, no build step):

```sh
node serve.ts   # serves game/ on http://localhost:8080
```

or simply:

```sh
python3 -m http.server 8080 --directory game
```

## How it plays

- **Mouse:** click a difference on either picture. A green ring circles it
  on both pictures, with its number; a wrong click leaves a red cross and
  counts as a mistake.
- **Keyboard:** arrow keys move the crosshair (hold Shift to move faster),
  Enter or Space marks the spot under it. `H` spends one of three hints and
  rings an unfound difference, `P` pauses, `R` restarts, `M` mutes.
- **The game:** ten differences — the sun's sunglasses, a bird, a butterfly,
  apples on the tree, a lit window, a duck on the pond, a cat on the fence,
  a red tulip, a mushroom, and chimney smoke. The header counts what is
  found and what is left, and the timer runs up; finding all ten shows your
  time, mistakes and stars (three stars for a clean run under four minutes),
  and saves your best time in the browser.
- **Sound:** small WebAudio chimes for a find, a buzz for a miss, and a
  little arpeggio for the win — synthesised in code, no audio files.

## Screenshots

`?shot=start`, `?shot=play` and `?shot=end` stage the title, a mid-play
position (four found, six left, 1:27 on the clock) and the win screen, for
repeatable screenshots of the same scenes the game itself draws.

## Files

- `game/index.html` + `game/src/*.js` — the whole game: canvas 2D art drawn
  in code, no images or fonts, nothing loaded over the network.
- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored make.fun
  library (`vendor/makefun-game.ts`, the kit's copy, unchanged).
- `screenshots/` — three real renders of the game's own code.

## Licence

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
