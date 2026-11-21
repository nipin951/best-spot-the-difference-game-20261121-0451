// Draws the Mushroom Cottage Clearing scene onto a 520x390 canvas.
// drawScene(ctx, changed) paints the whole picture; `changed` is the set of
// difference ids (see differences.js) whose altered version should appear.
// The left panel is drawn with an empty set, the right panel with the
// level's set, so the two pictures differ exactly at those places.

export const PANEL_W = 520;
export const PANEL_H = 390;

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = "#ffffff";
  ellipse(ctx, x, y, 30 * s, 15 * s);
  ellipse(ctx, x + 22 * s, y + 3 * s, 22 * s, 12 * s);
  ellipse(ctx, x - 24 * s, y + 4 * s, 20 * s, 11 * s);
}

function pine(ctx, x, base, h, colour) {
  ctx.fillStyle = "#6b4a2f";
  ctx.fillRect(x - 4, base - 14, 8, 14);
  ctx.fillStyle = colour;
  for (let i = 0; i < 3; i++) {
    const w = 30 - i * 7, y = base - 12 - i * (h / 3.4);
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y - h / 2.6);
    ctx.closePath();
    ctx.fill();
  }
}

function mushroom(ctx, x, y, s, capColour) {
  ctx.fillStyle = "#f3e6cf";
  ctx.fillRect(x - 4 * s, y - 14 * s, 8 * s, 14 * s);
  ctx.fillStyle = capColour;
  ctx.beginPath();
  ctx.ellipse(x, y - 13 * s, 15 * s, 10 * s, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ellipse(ctx, x - 6 * s, y - 17 * s, 2.4 * s, 1.8 * s);
  ellipse(ctx, x + 5 * s, y - 15 * s, 1.8 * s, 1.4 * s);
}

export function drawScene(ctx, changed) {
  const has = (id) => changed.has(id);

  // sky and light
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, "#8ec9e8");
  sky.addColorStop(1, "#dff2e4");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  if (has("sunMoon")) {
    // crescent moon instead of the sun
    ctx.fillStyle = "#f6ead0";
    ctx.beginPath();
    ctx.arc(70, 60, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a8d4ec";
    ctx.beginPath();
    ctx.arc(84, 52, 21, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#ffd94d";
    ctx.beginPath();
    ctx.arc(70, 60, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,190,40,0.7)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(70 + Math.cos(a) * 33, 60 + Math.sin(a) * 33);
      ctx.lineTo(70 + Math.cos(a) * 43, 60 + Math.sin(a) * 43);
      ctx.stroke();
    }
  }

  cloud(ctx, 165, 52, 1);
  cloud(ctx, 330, 40, 0.8);
  if (has("cloudExtra")) cloud(ctx, 440, 74, 0.9);

  // hills and meadow
  ctx.fillStyle = "#9ccb7d";
  ctx.beginPath();
  ctx.moveTo(0, 218);
  ctx.quadraticCurveTo(150, 178, 320, 208);
  ctx.quadraticCurveTo(430, 224, 520, 204);
  ctx.lineTo(520, 390);
  ctx.lineTo(0, 390);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7fb45e";
  ctx.beginPath();
  ctx.moveTo(0, 262);
  ctx.quadraticCurveTo(200, 236, 520, 258);
  ctx.lineTo(520, 390);
  ctx.lineTo(0, 390);
  ctx.closePath();
  ctx.fill();

  pine(ctx, 34, 268, 118, "#3f7a44");
  pine(ctx, 478, 272, 138, "#35703c");
  pine(ctx, 428, 262, 84, "#478549");

  // fruit tree
  ctx.fillStyle = "#6b4a2f";
  ctx.fillRect(56, 196, 11, 52);
  ctx.fillStyle = "#4c8a4f";
  ellipse(ctx, 62, 168, 40, 34);
  ellipse(ctx, 38, 182, 26, 22);
  ellipse(ctx, 88, 182, 26, 22);
  if (!has("fruit")) {
    ctx.fillStyle = "#e2483d";
    for (const [fx, fy] of [[48, 156], [74, 148], [88, 172], [40, 178], [64, 182], [82, 190]]) {
      ctx.beginPath();
      ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // cottage body
  ctx.fillStyle = "#f7ecd7";
  ctx.fillRect(182, 196, 156, 106);
  ctx.strokeStyle = "#c9b18c";
  ctx.lineWidth = 2;
  ctx.strokeRect(182, 196, 156, 106);
  // mushroom-cap roof
  ctx.fillStyle = "#d8544a";
  ctx.beginPath();
  ctx.ellipse(260, 198, 102, 52, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#f7ecd7";
  ellipse(ctx, 216, 176, 13, 8);
  if (!has("roofSpot")) ellipse(ctx, 238, 158, 10, 6.5);
  ellipse(ctx, 292, 170, 12, 7.5);
  ellipse(ctx, 318, 186, 8, 5);
  // chimney and smoke
  ctx.fillStyle = "#a9805d";
  ctx.fillRect(316, 128, 22, 34);
  if (!has("smoke")) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ellipse(ctx, 330, 112, 10, 7);
    ellipse(ctx, 338, 96, 13, 9);
    ellipse(ctx, 330, 78, 9, 6);
  }
  if (has("bird")) {
    ctx.fillStyle = "#37506b";
    ellipse(ctx, 205, 152, 8, 5.5);
    ctx.beginPath();
    ctx.arc(212, 147, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2a541";
    ctx.beginPath();
    ctx.moveTo(216, 147);
    ctx.lineTo(221, 149);
    ctx.lineTo(216, 150);
    ctx.closePath();
    ctx.fill();
  }

  // door with an arched top
  ctx.fillStyle = "#8a5a33";
  ctx.beginPath();
  ctx.moveTo(242, 302);
  ctx.lineTo(242, 252);
  ctx.arc(260, 252, 18, Math.PI, 0);
  ctx.lineTo(278, 302);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f7c948";
  ctx.beginPath();
  ctx.arc(271, 278, 3.4, 0, Math.PI * 2);
  ctx.fill();
  if (has("wreath")) {
    ctx.strokeStyle = "#3e7d3a";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(260, 250, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#e2483d";
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(260 + Math.cos(a) * 10, 250 + Math.sin(a) * 10, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // windows
  for (const wx of [196, 292]) {
    ctx.fillStyle = "#bfe3f2";
    ctx.fillRect(wx, 224, 32, 32);
    ctx.strokeStyle = "#8a5a33";
    ctx.lineWidth = 3;
    ctx.strokeRect(wx, 224, 32, 32);
    ctx.beginPath();
    ctx.moveTo(wx + 16, 224);
    ctx.lineTo(wx + 16, 256);
    ctx.stroke();
  }
  if (has("flowerBox")) {
    ctx.fillStyle = "#8a5a33";
    ctx.fillRect(193, 258, 38, 9);
    ctx.fillStyle = "#e2483d";
    for (const fx of [200, 210, 220, 228]) {
      ctx.beginPath();
      ctx.arc(fx, 256, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f2a541";
    ctx.beginPath();
    ctx.arc(215, 253, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // path and its stones
  ctx.fillStyle = "#e6d3a8";
  ctx.beginPath();
  ctx.moveTo(244, 302);
  ctx.lineTo(276, 302);
  ctx.lineTo(302, 390);
  ctx.lineTo(218, 390);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c9b18c";
  const stones = [[262, 322, 13], [252, 350, 15], [274, 372, 16]];
  for (const [sx, sy, sr] of stones) {
    if (has("pathStone") && sx === 252) continue;
    ellipse(ctx, sx, sy, sr, sr * 0.42);
  }

  // fences left and right of the path
  ctx.fillStyle = "#b08954";
  for (const fx of [46, 78, 110, 142]) ctx.fillRect(fx, 288, 9, 34);
  ctx.fillRect(38, 296, 122, 6);
  for (const fx of [366, 430, 462]) ctx.fillRect(fx, 288, 9, 34);
  if (!has("fencePicket")) ctx.fillRect(398, 288, 9, 34);
  ctx.fillRect(358, 296, 122, 6);

  // lantern post
  ctx.fillStyle = "#5d4630";
  ctx.fillRect(146, 196, 6, 74);
  ctx.fillRect(146, 196, 26, 5);
  ctx.fillStyle = "#33404f";
  ctx.fillRect(163, 201, 15, 19);
  if (has("lanternGlow")) {
    const glow = ctx.createRadialGradient(170, 211, 2, 170, 211, 30);
    glow.addColorStop(0, "rgba(255,214,110,0.95)");
    glow.addColorStop(1, "rgba(255,214,110,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(138, 179, 64, 64);
    ctx.fillStyle = "#ffd66e";
    ctx.fillRect(167, 205, 7, 11);
  }

  // pond and duck
  ellipse(ctx, 92, 348, 64, 21, "#7cc4de");
  ellipse(ctx, 92, 344, 52, 15, "#a5dcef");
  if (has("duck")) {
    ctx.fillStyle = "#ffffff";
    ellipse(ctx, 90, 338, 13, 8);
    ctx.beginPath();
    ctx.arc(100, 331, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2a541";
    ctx.beginPath();
    ctx.moveTo(106, 331);
    ctx.lineTo(113, 333);
    ctx.lineTo(106, 335);
    ctx.closePath();
    ctx.fill();
  }

  // the cat on the path's edge
  const cat = has("catColour") ? "#8d99ae" : "#ef8f3c";
  ctx.fillStyle = cat;
  ellipse(ctx, 302, 330, 16, 12);            // body
  ctx.beginPath();
  ctx.arc(302, 312, 10, 0, Math.PI * 2);     // head
  ctx.fill();
  ctx.beginPath();                            // ears
  ctx.moveTo(294, 306);
  ctx.lineTo(296, 296);
  ctx.lineTo(301, 304);
  ctx.closePath();
  ctx.moveTo(310, 306);
  ctx.lineTo(308, 296);
  ctx.lineTo(303, 304);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = cat;                      // tail
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(316, 336);
  ctx.quadraticCurveTo(330, 330, 328, 316);
  ctx.stroke();
  ctx.fillStyle = "#33404f";                  // eyes
  ctx.beginPath();
  ctx.arc(298, 311, 1.6, 0, Math.PI * 2);
  ctx.arc(306, 311, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // foreground mushrooms and flowers
  mushroom(ctx, 420, 344, 1.25, "#d8544a");
  if (!has("mushroomGone")) mushroom(ctx, 452, 356, 0.95, "#e8833a");
  mushroom(ctx, 396, 360, 0.8, "#b565d8");
  ctx.fillStyle = "#e86a92";
  for (const [fx, fy] of [[52, 330], [180, 356], [486, 322], [356, 366], [128, 318]]) {
    ctx.beginPath();
    ctx.arc(fx, fy, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // butterfly
  if (has("butterfly")) {
    ctx.fillStyle = "#b565d8";
    ellipse(ctx, 386, 144, 7, 10);
    ellipse(ctx, 398, 144, 7, 10);
    ctx.fillStyle = "#5b3a8c";
    ctx.fillRect(390, 136, 3.4, 16);
  }
}

// A satisfying ring marker drawn over a found difference, on both panels.
export function drawFoundMarker(ctx, x, y, r, pop) {
  const rr = r * (1 + 0.18 * Math.max(0, pop));
  ctx.strokeStyle = "#ff4757";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, rr + 3.4, 0, Math.PI * 2);
  ctx.stroke();
}

// A soft pulsing ring used by the hint button.
export function drawHintRing(ctx, x, y, phase) {
  const rr = 16 + 6 * Math.sin(phase);
  ctx.strokeStyle = "rgba(255, 214, 64, 0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.stroke();
}
