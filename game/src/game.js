// Game state for Mushroom Cottage Clearing: levels, the found set, the
// clock, hints and scoring. Pure logic — main.js renders from it and
// forwards clicks to it.

import { DIFFERENCES, LEVELS } from "./differences.js";

export class Game {
  constructor() {
    this.levelIndex = 0;
    this.score = 0;
    this.state = "title"; // title | playing | won | lost | finished
    this.found = new Set();
    this.misses = 0;
    this.timeLeft = 0;
    this.hintsLeft = 3;
    this.hintId = null;
    this.lastFoundAt = 0;
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get remaining() {
    return this.level.ids.length - this.found.size;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.misses = 0;
    this.timeLeft = this.level.seconds;
    this.hintsLeft = 3;
    this.hintId = null;
    this.state = "playing";
  }

  startGame() {
    this.score = 0;
    this.startLevel(0);
  }

  // A click at panel coordinates. Returns "found", "already", "miss" or
  // null when the game is not in play.
  click(x, y) {
    if (this.state !== "playing") return null;
    for (const id of this.level.ids) {
      const spot = DIFFERENCES[id];
      const near = Math.hypot(x - spot.x, y - spot.y) <= spot.r;
      if (!near) continue;
      if (this.found.has(id)) return "already";
      this.found.add(id);
      this.hintId = null;
      this.score += 100 + Math.round(this.timeLeft / 6);
      if (this.remaining === 0) this.state = "won";
      return "found";
    }
    this.misses += 1;
    this.timeLeft = Math.max(0, this.timeLeft - 5);
    this.score = Math.max(0, this.score - 15);
    return "miss";
  }

  // Spend a hint: pick a random unfound difference for main.js to shimmer.
  useHint(now) {
    if (this.state !== "playing" || this.hintsLeft <= 0) return null;
    const open = this.level.ids.filter((id) => !this.found.has(id));
    if (!open.length) return null;
    this.hintsLeft -= 1;
    this.hintId = open[Math.floor(Math.random() * open.length)];
    this.hintUntil = now + 2600;
    return this.hintId;
  }

  tick(seconds) {
    if (this.state !== "playing") return;
    this.timeLeft = Math.max(0, this.timeLeft - seconds);
    if (this.timeLeft <= 0) this.state = "lost";
  }

  nextLevel() {
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.state = "finished";
      return;
    }
    this.startLevel(this.levelIndex + 1);
  }
}
