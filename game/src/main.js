// Bootstrap and rendering: owns the two canvases, the HUD and the overlays,
// draws both panels every frame, and routes clicks into the Game state.

import { Game } from "./game.js";
import { DIFFERENCES } from "./differences.js";
import { PANEL_W, PANEL_H, drawScene, drawFoundMarker, drawHintRing } from "./scene.js";
import { playFind, playMiss, playWin } from "./sound.js";

const game = new Game();
const leftCanvas = document.getElementById("panel-left");
const rightCanvas = document.getElementById("panel-right");
const leftCtx = leftCanvas.getContext("2d");
const rightCtx = rightCanvas.getContext("2d");

const el = {
  level: document.getElementById("hud-level"),
  remain: document.getElementById("hud-remain"),
  time: document.getElementById("hud-time"),
  timeBar: document.getElementById("time-bar"),
  score: document.getElementById("hud-score"),
  hints: document.getElementById("hud-hints"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlay-title"),
  overlayText: document.getElementById("overlay-text"),
  overlayButton: document.getElementById("overlay-button"),
};

let popAt = new Map(); // difference id -> timestamp of the find, for the marker pop
let shakeUntil = 0;

function changedSet() {
  return new Set(game.level.ids);
}

function render(now) {
  const changed = changedSet();
  drawScene(leftCtx, new Set());
  drawScene(rightCtx, changed);
  for (const id of game.found) {
    const spot = DIFFERENCES[id];
    const pop = Math.max(0, 1 - (now - (popAt.get(id) || 0)) / 260);
    drawFoundMarker(leftCtx, spot.x, spot.y, spot.r, pop);
    drawFoundMarker(rightCtx, spot.x, spot.y, spot.r, pop);
  }
  if (game.hintId && now < (game.hintUntil || 0)) {
    const spot = DIFFERENCES[game.hintId];
    drawHintRing(leftCtx, spot.x, spot.y, now / 180);
    drawHintRing(rightCtx, spot.x, spot.y, now / 180);
  }
  const wrap = document.getElementById("panels");
  wrap.style.transform = now < shakeUntil ? `translateX(${Math.sin(now / 24) * 5}px)` : "";
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.ceil(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

function renderHud() {
  el.level.textContent = game.level.name;
  el.remain.textContent = game.state === "title" ? "–" : String(game.remaining);
  el.time.textContent = fmtTime(game.timeLeft);
  el.timeBar.style.width = `${(game.timeLeft / game.level.seconds) * 100}%`;
  el.timeBar.style.background = game.timeLeft < 30 ? "#e2483d" : "#57a773";
  el.score.textContent = String(game.score);
  el.hints.textContent = `💡 Hint (${game.hintsLeft})`;
}

function showOverlay(title, text, button) {
  el.overlayTitle.textContent = title;
  el.overlayText.textContent = text;
  el.overlayButton.textContent = button;
  el.overlay.classList.remove("hidden");
}

function hideOverlay() {
  el.overlay.classList.add("hidden");
}

function syncOverlay() {
  if (game.state === "title") {
    showOverlay("Mushroom Cottage Clearing", "Two pictures, one cottage — and a few quiet changes. Click a difference on either picture to ring it. Wrong clicks cost 5 seconds.", "Start spotting");
  } else if (game.state === "won") {
    const last = game.levelIndex + 1 >= 3;
    showOverlay(last ? "Every level cleared!" : "Level cleared!", last ? `Final score ${game.score}. The clearing is exactly as it should be.` : `Score ${game.score}. The next picture hides even quieter changes.`, last ? "Play again" : "Next level");
  } else if (game.state === "lost") {
    showOverlay("Out of time", `${game.found.size} of ${game.level.ids.length} differences found. The rest are still hiding in the clearing.`, "Try again");
  } else if (game.state === "finished") {
    showOverlay("Every level cleared!", `Final score ${game.score}.`, "Play again");
  } else {
    hideOverlay();
  }
}

el.overlayButton.addEventListener("click", () => {
  if (game.state === "title" || game.state === "finished") game.startGame();
  else if (game.state === "won") game.nextLevel();
  else if (game.state === "lost") game.startLevel(game.levelIndex);
  hideOverlay();
  renderHud();
});

document.getElementById("btn-hint").addEventListener("click", () => {
  game.useHint(performance.now());
  renderHud();
});
document.getElementById("btn-restart").addEventListener("click", () => {
  game.startGame();
  hideOverlay();
  renderHud();
});

function onPanelClick(canvas, ev) {
  const rect = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
  const before = game.found.size;
  const result = game.click(x, y);
  if (result === "found") {
    const id = game.level.ids.find((i) => !popAt.has(i) && game.found.has(i) && Math.hypot(x - DIFFERENCES[i].x, y - DIFFERENCES[i].y) <= DIFFERENCES[i].r);
    if (id) popAt.set(id, performance.now());
    playFind();
    if (game.state === "won") playWin();
  } else if (result === "miss") {
    shakeUntil = performance.now() + 240;
    playMiss();
  }
  if (game.found.size !== before || result) {
    syncOverlay();
    renderHud();
  }
}
leftCanvas.addEventListener("click", (ev) => onPanelClick(leftCanvas, ev));
rightCanvas.addEventListener("click", (ev) => onPanelClick(rightCanvas, ev));

// Screenshot staging: ?shot=1..4 sets up the exact states the screenshots show.
function stageShot(n) {
  const setups = {
    1: { level: 0, found: ["smoke", "duck", "butterfly"], time: 154 },
    2: { level: 1, found: ["wreath", "catColour", "lanternGlow", "fencePicket"], time: 187 },
    3: { level: 2, found: ["sunMoon", "fruit", "wreath", "lanternGlow", "catColour"], time: 96, hint: "roofSpot" },
    4: { level: 0, found: ["smoke", "duck", "catColour", "butterfly", "wreath", "mushroomGone", "lanternGlow"], time: 121, state: "won" },
  };
  const s = setups[n];
  if (!s) return;
  game.startLevel(s.level);
  for (const id of s.found) {
    game.found.add(id);
    popAt.set(id, 0);
  }
  game.timeLeft = s.time;
  game.score = s.found.length * 118;
  if (s.hint) {
    game.hintId = s.hint;
    game.hintUntil = Number.MAX_SAFE_INTEGER;
  }
  if (s.state) game.state = s.state;
  syncOverlay();
  renderHud();
}

const shot = new URLSearchParams(location.search).get("shot");
if (shot) stageShot(Number(shot));
else {
  syncOverlay();
  renderHud();
}

let last = performance.now();
function frame(now) {
  const dt = (now - last) / 1000;
  last = now;
  if (game.state === "playing" && !shot) {
    game.tick(dt);
    if (game.state === "lost") syncOverlay();
    renderHud();
  }
  render(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
