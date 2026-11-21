[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nipin951/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nipin951/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Mushroom Cottage Clearing — Spot the Difference

An original spot-the-difference game that plays offline in a desktop browser. Two near-identical pictures of a mushroom-cottage clearing sit side by side; click a difference on either picture to ring it on both. Three levels hide 7, 10 and 12 changes — a missing chimney plume, a cat that changes colour, a duck that appears on the pond — against the clock, with a 5-second penalty per wrong click, three shimmer hints per level, and synthesised sound effects (no audio files).

- `game/` — the game itself: plain static files, no build step. Open `game/index.html` via any static server.
- `game/src/scene.js` draws the clearing, `game/src/differences.js` catalogues the changes, `game/src/game.js` holds the rules, `game/src/main.js` renders and routes clicks, `game/src/sound.js` makes the bleeps.
- `main.ts` hands the game in: it copies `game/` and `screenshots/` to the output and writes `dossier.json`.
- `screenshots/` — real renders of the game in play.

Entered in make.fun's [best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) competition.

Try make.fun yourself: referral code `354yydjr`.
