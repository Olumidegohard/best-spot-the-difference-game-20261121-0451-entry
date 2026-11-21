// Twin Garden's drawing: one garden painted twice, side by side, the right
// picture ("the twin") dropping or changing exactly one thing per
// difference. Everything is canvas 2D shapes — no images, no fonts, no
// network — so the game is its own files and nothing else.

import {
  DIFFERENCES,
  FIELD,
  FONT,
  PALETTE,
  PANEL,
  PANEL_LEFT,
  PANEL_RIGHT,
  TOTAL_DIFFERENCES,
} from './config.js';
import { SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './world.js';

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function text(ctx, value, x, y, size, color, align = 'left', weight = '600') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

/** The garden, in panel-local coordinates. `twin` paints the right picture. */
function drawGarden(ctx, twin) {
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, PALETTE.skyTop);
  sky.addColorStop(1, PALETTE.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL.width, 380);

  // Sun, top left. The twin's sun has no sunglasses.
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 78, 72, 34);
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(78 + Math.cos(a) * 42, 72 + Math.sin(a) * 42);
    ctx.lineTo(78 + Math.cos(a) * 52, 72 + Math.sin(a) * 52);
    ctx.stroke();
  }
  if (!twin) {
    // Sunglasses: two dark lenses and a bridge.
    ctx.fillStyle = '#22252e';
    ellipse(ctx, 66, 70, 11, 9);
    ellipse(ctx, 90, 70, 11, 9);
    ctx.strokeStyle = '#22252e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(77, 70);
    ctx.lineTo(79, 70);
    ctx.stroke();
  }

  // Clouds.
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ellipse(ctx, 250, 58, 46, 18);
  ellipse(ctx, 272, 48, 32, 16);
  ellipse(ctx, 440, 108, 38, 15);
  ellipse(ctx, 460, 100, 26, 13);

  // The twin has no bird in the sky.
  if (!twin) {
    ctx.strokeStyle = '#33404f';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(318, 78, 11, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(342, 78, 11, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Hills, then the lawn.
  ctx.fillStyle = PALETTE.hillFar;
  ellipse(ctx, 130, 392, 230, 46);
  ctx.fillStyle = PALETTE.hillNear;
  ellipse(ctx, 470, 396, 250, 50);
  ctx.fillStyle = PALETTE.lawn;
  ctx.fillRect(0, 380, PANEL.width, 180);

  // Fence across the middle, with a cat sitting on it in the original.
  ctx.fillStyle = PALETTE.fenceDark;
  ctx.fillRect(0, 386, PANEL.width, 10);
  ctx.fillRect(0, 414, PANEL.width, 10);
  for (let x = 18; x < PANEL.width; x += 75) ctx.fillRect(x, 378, 12, 56);
  if (!twin) {
    // Cat: body, head, ears, tail, sitting on the top rail.
    ctx.fillStyle = PALETTE.cat;
    ellipse(ctx, 300, 372, 20, 13);
    circle(ctx, 316, 356, 11);
    ctx.beginPath();
    ctx.moveTo(308, 348);
    ctx.lineTo(311, 338);
    ctx.lineTo(316, 347);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(320, 347);
    ctx.lineTo(324, 338);
    ctx.lineTo(327, 348);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PALETTE.cat;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(282, 378);
    ctx.quadraticCurveTo(268, 372, 272, 358);
    ctx.stroke();
  }

  // Tree, left: trunk, canopy, and apples in the original only.
  ctx.fillStyle = PALETTE.trunk;
  ctx.fillRect(96, 250, 28, 150);
  ctx.fillStyle = PALETTE.leafDark;
  circle(ctx, 78, 205, 46);
  circle(ctx, 146, 205, 46);
  ctx.fillStyle = PALETTE.leaf;
  circle(ctx, 112, 172, 52);
  if (!twin) {
    ctx.fillStyle = PALETTE.apple;
    circle(ctx, 80, 200, 8);
    circle(ctx, 132, 186, 8);
    circle(ctx, 106, 234, 8);
  }

  // The twin has no mushroom by the tree.
  if (!twin) {
    ctx.fillStyle = '#f5f2e8';
    ctx.fillRect(144, 418, 12, 16);
    ctx.fillStyle = PALETTE.mushroomCap;
    ctx.beginPath();
    ctx.arc(150, 420, 16, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    circle(ctx, 144, 412, 3);
    circle(ctx, 156, 416, 2.5);
  }

  // House, right: wall, roof, chimney, door, two windows.
  ctx.fillStyle = PALETTE.houseWall;
  ctx.fillRect(400, 280, 160, 150);
  ctx.fillStyle = PALETTE.houseRoof;
  ctx.beginPath();
  ctx.moveTo(388, 284);
  ctx.lineTo(480, 208);
  ctx.lineTo(572, 284);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b8ab8f';
  ctx.fillRect(520, 200, 26, 52);
  // Smoke above the chimney, in the original only.
  if (!twin) {
    ctx.fillStyle = 'rgba(240,240,240,0.85)';
    circle(ctx, 532, 186, 12);
    circle(ctx, 540, 168, 15);
    circle(ctx, 526, 152, 10);
  }
  // Door.
  ctx.fillStyle = PALETTE.houseDoor;
  ctx.fillRect(460, 352, 42, 78);
  ctx.fillStyle = PALETTE.accent;
  circle(ctx, 494, 392, 4);
  // Windows: the left one is lit in the original, dark in the twin.
  ctx.fillStyle = twin ? PALETTE.windowDark : PALETTE.windowLit;
  ctx.fillRect(414, 308, 42, 42);
  ctx.fillStyle = PALETTE.windowDark;
  ctx.fillRect(518, 308, 42, 42);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(414, 308, 42, 42);
  ctx.strokeRect(518, 308, 42, 42);
  ctx.beginPath();
  ctx.moveTo(435, 308);
  ctx.lineTo(435, 350);
  ctx.moveTo(414, 329);
  ctx.lineTo(456, 329);
  ctx.moveTo(539, 308);
  ctx.lineTo(539, 350);
  ctx.moveTo(518, 329);
  ctx.lineTo(560, 329);
  ctx.stroke();
  if (!twin) {
    ctx.fillStyle = '#c96f4a';
    ctx.fillRect(414, 308, 8, 42);
    ctx.fillRect(448, 308, 8, 42);
  }

  // Path from the door to the bottom edge.
  ctx.fillStyle = PALETTE.path;
  ctx.beginPath();
  ctx.moveTo(452, 430);
  ctx.lineTo(508, 430);
  ctx.lineTo(528, 560);
  ctx.lineTo(432, 560);
  ctx.closePath();
  ctx.fill();

  // Flower bed along the bottom, left of the path.
  const flowers = [
    { x: 60, c: PALETTE.flowerPink },
    { x: 110, c: PALETTE.flowerPurple },
    { x: 160, c: PALETTE.flowerWhite },
    { x: 200, c: null }, // the difference tulip: red in the original, yellow in the twin
    { x: 250, c: PALETTE.flowerPink },
    { x: 300, c: PALETTE.flowerWhite },
    { x: 350, c: PALETTE.flowerPurple },
    { x: 395, c: PALETTE.flowerPink },
  ];
  for (const flower of flowers) {
    ctx.strokeStyle = PALETTE.stem;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(flower.x, 520);
    ctx.lineTo(flower.x, 476);
    ctx.stroke();
    ctx.fillStyle = flower.c ?? (twin ? PALETTE.flowerYellow : PALETTE.flowerRed);
    circle(ctx, flower.x, 468, 11);
    circle(ctx, flower.x - 8, 474, 8);
    circle(ctx, flower.x + 8, 474, 8);
    ctx.fillStyle = '#fff7c0';
    circle(ctx, flower.x, 470, 5);
  }

  // The twin has no butterfly by the flowers.
  if (!twin) {
    ctx.fillStyle = PALETTE.butterflyWing;
    ellipse(ctx, 338, 424, 12, 8);
    ellipse(ctx, 362, 424, 12, 8);
    ellipse(ctx, 340, 438, 10, 7);
    ellipse(ctx, 360, 438, 10, 7);
    ctx.fillStyle = '#33404f';
    ctx.fillRect(348, 420, 4, 22);
  }

  // Pond, bottom right, with a duck in the original only.
  ctx.fillStyle = PALETTE.pond;
  ellipse(ctx, 480, 505, 92, 34);
  ctx.fillStyle = PALETTE.pondDark;
  ellipse(ctx, 480, 512, 70, 22);
  if (!twin) {
    ctx.fillStyle = PALETTE.duck;
    ellipse(ctx, 470, 494, 18, 12);
    circle(ctx, 486, 484, 9);
    ctx.fillStyle = PALETTE.duckBeak;
    ctx.beginPath();
    ctx.moveTo(494, 482);
    ctx.lineTo(504, 485);
    ctx.lineTo(494, 488);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#22252e';
    circle(ctx, 488, 482, 1.8);
  }
}

function drawPanelFrame(ctx, origin, label) {
  ctx.strokeStyle = PALETTE.panelFrame;
  ctx.lineWidth = 3;
  ctx.strokeRect(origin.x - 1.5, origin.y - 1.5, PANEL.width + 3, PANEL.height + 3);
  text(ctx, label, origin.x, origin.y - 12, 14, PALETTE.panelLabel, 'left', '700');
}

function drawMarkers(ctx, state) {
  for (const index of state.found) {
    const diff = DIFFERENCES[index];
    for (const origin of [PANEL_LEFT, PANEL_RIGHT]) {
      // A ring only — the picture underneath must stay visible.
      ctx.strokeStyle = PALETTE.found;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(origin.x + diff.x, origin.y + diff.y, diff.r + 4, 0, Math.PI * 2);
      ctx.stroke();
      // A small numbered badge so the count is readable at a glance.
      ctx.fillStyle = PALETTE.found;
      circle(ctx, origin.x + diff.x + diff.r * 0.7, origin.y + diff.y - diff.r * 0.7, 11);
      text(ctx, String(index + 1), origin.x + diff.x + diff.r * 0.7, origin.y + diff.y - diff.r * 0.7 + 0.5, 13, '#0d2818', 'center', '800');
    }
  }
  // Wrong-click crosses, fading.
  for (const mark of state.wrong) {
    const alpha = Math.max(0, (mark.until - state.elapsed) / 0.9);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = PALETTE.wrong;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mark.x - 12, mark.y - 12);
    ctx.lineTo(mark.x + 12, mark.y + 12);
    ctx.moveTo(mark.x + 12, mark.y - 12);
    ctx.lineTo(mark.x - 12, mark.y + 12);
    ctx.stroke();
    ctx.restore();
  }
  // Hint ring, pulsing around one unfound difference on both pictures.
  if (state.hint !== null) {
    const diff = DIFFERENCES[state.hint.index];
    const pulse = 1 + 0.12 * Math.sin(state.elapsed * 8);
    for (const origin of [PANEL_LEFT, PANEL_RIGHT]) {
      ctx.save();
      ctx.strokeStyle = PALETTE.hint;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(origin.x + diff.x, origin.y + diff.y, (diff.r + 8) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawHeader(ctx, state) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, 64);
  text(ctx, '🌻 Twin Garden', 24, 33, 26, PALETTE.text, 'left', '800');
  text(ctx, 'Spot the difference', 250, 34, 15, PALETTE.muted, 'left', '600');
  const found = state.found.size;
  const left = TOTAL_DIFFERENCES - found;
  const counter = state.screen === SCREEN_TITLE
    ? `🔍 ${TOTAL_DIFFERENCES} differences to find`
    : `🔍 Found ${found} of ${TOTAL_DIFFERENCES}  ·  ${left} left`;
  text(ctx, counter, FIELD.width / 2, 33, 22, left === 0 ? PALETTE.found : PALETTE.accent, 'center', '800');
  text(ctx, `⏱ ${formatTime(state.elapsed)}`, FIELD.width - 210, 33, 20, PALETTE.text, 'left', '700');
  text(ctx, `✕ ${state.mistakes}`, FIELD.width - 96, 33, 20, state.mistakes > 0 ? PALETTE.wrong : PALETTE.muted, 'left', '700');
}

function drawFooter(ctx, state) {
  const hintText = state.hintsLeft > 0 ? `H hint (${state.hintsLeft} left)` : 'H hint (none left)';
  text(
    ctx,
    `Click a difference on either picture  ·  Arrow keys move the cursor, Enter marks it  ·  ${hintText}  ·  P pause  ·  R restart  ·  M sound ${state.muted ? 'off' : 'on'}`,
    FIELD.width / 2, 688, 14, PALETTE.muted, 'center', '500',
  );
}

function drawCursor(ctx, state) {
  if (state.screen !== SCREEN_PLAY) return;
  const { x, y } = state.cursor;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
  ctx.restore();
}

function drawOverlay(ctx, title, lines, footnote) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const cardW = 640;
  const cardH = 96 + lines.length * 34 + (footnote ? 52 : 0);
  const cardX = (FIELD.width - cardW) / 2;
  const cardY = (FIELD.height - cardH) / 2;
  ctx.fillStyle = PALETTE.card;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = PALETTE.cardBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  text(ctx, title, FIELD.width / 2, cardY + 48, 34, PALETTE.text, 'center', '800');
  lines.forEach((line, i) => {
    text(ctx, line.text, FIELD.width / 2, cardY + 96 + i * 34, line.size ?? 18, line.color ?? PALETTE.text, 'center', line.weight ?? '500');
  });
  if (footnote) text(ctx, footnote, FIELD.width / 2, cardY + cardH - 30, 16, PALETTE.accent, 'center', '700');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function fit() {
    const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
    canvas.width = FIELD.width * window.devicePixelRatio;
    canvas.height = FIELD.height * window.devicePixelRatio;
    canvas.style.width = `${FIELD.width * scale}px`;
    canvas.style.height = `${FIELD.height * scale}px`;
    ctx.setTransform((canvas.width / FIELD.width), 0, 0, (canvas.height / FIELD.height), 0, 0);
  }

  function draw(state, best) {
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.page;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    drawHeader(ctx, state);

    ctx.save();
    ctx.beginPath();
    ctx.rect(PANEL_LEFT.x, PANEL_LEFT.y, PANEL.width, PANEL.height);
    ctx.clip();
    ctx.translate(PANEL_LEFT.x, PANEL_LEFT.y);
    drawGarden(ctx, false);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(PANEL_RIGHT.x, PANEL_RIGHT.y, PANEL.width, PANEL.height);
    ctx.clip();
    ctx.translate(PANEL_RIGHT.x, PANEL_RIGHT.y);
    drawGarden(ctx, true);
    ctx.restore();

    drawPanelFrame(ctx, PANEL_LEFT, 'ORIGINAL');
    drawPanelFrame(ctx, PANEL_RIGHT, 'TWIN — FIND WHAT CHANGED');
    drawMarkers(ctx, state);
    drawCursor(ctx, state);
    drawFooter(ctx, state);

    if (state.screen === SCREEN_TITLE) {
      drawOverlay(ctx, '🌻 Twin Garden', [
        { text: 'Two garden pictures, side by side — ten small things differ.', size: 18 },
        { text: 'Click a difference on either picture to circle it. Find all ten!', size: 18 },
        { text: 'Arrow keys move the crosshair, Enter marks it, H asks for a hint.', size: 16, color: PALETTE.muted },
      ], 'Click or press Space to start');
    } else if (state.screen === SCREEN_PAUSED) {
      drawOverlay(ctx, 'Paused', [
        { text: `Found ${state.found.size} of ${TOTAL_DIFFERENCES} — ${TOTAL_DIFFERENCES - state.found.size} still hiding.`, size: 18 },
      ], 'Press P or click to keep playing');
    } else if (state.screen === SCREEN_WIN && state.winStats !== null) {
      const stats = state.winStats;
      const starLine = '★'.repeat(stats.stars) + '☆'.repeat(3 - stats.stars);
      const bestLine = best !== null && best !== undefined
        ? `Best time: ${formatTime(best)}`
        : 'Your first full garden!';
      drawOverlay(ctx, 'You found them all! 🎉', [
        { text: starLine, size: 30, color: PALETTE.accent, weight: '800' },
        { text: `Time ${formatTime(stats.seconds)}  ·  ${stats.mistakes} wrong click${stats.mistakes === 1 ? '' : 's'}  ·  ${bestLine}`, size: 18 },
        { text: 'Every difference is circled on both pictures — compare them and see.', size: 16, color: PALETTE.muted },
      ], 'Press R to play again');
    }
  }

  return { draw, fit };
}
