// The difference catalogue for Mushroom Cottage Clearing.
// Each difference knows where it sits on a panel (x, y in panel coordinates,
// r = click tolerance) and how the changed panel differs from the plain one.
// scene.js reads these ids when it draws the right-hand panel.

export const DIFFERENCES = {
  smoke:        { x: 330, y: 118, r: 30, label: "chimney smoke" },
  sunMoon:      { x: 70,  y: 60,  r: 30, label: "sun or crescent moon" },
  cloudExtra:   { x: 440, y: 70,  r: 30, label: "extra cloud" },
  bird:         { x: 205, y: 152, r: 18, label: "bird on the roof" },
  roofSpot:     { x: 238, y: 160, r: 20, label: "missing roof spot" },
  butterfly:    { x: 392, y: 148, r: 20, label: "butterfly" },
  fruit:        { x: 62,  y: 168, r: 32, label: "fruit in the tree" },
  flowerBox:    { x: 213, y: 264, r: 20, label: "window flower box" },
  wreath:       { x: 260, y: 250, r: 17, label: "door wreath" },
  lanternGlow:  { x: 150, y: 236, r: 20, label: "lit lantern" },
  fencePicket: { x: 398, y: 300, r: 17, label: "missing fence picket" },
  duck:         { x: 90,  y: 338, r: 24, label: "duck on the pond" },
  catColour:    { x: 302, y: 320, r: 25, label: "the cat's colour" },
  mushroomGone: { x: 452, y: 348, r: 19, label: "missing mushroom" },
  pathStone:    { x: 262, y: 350, r: 15, label: "missing path stone" },
};

// Levels raise the count and favour the quieter differences.
export const LEVELS = [
  { name: "Level 1 · First Look",  seconds: 180, ids: ["smoke", "duck", "catColour", "butterfly", "wreath", "mushroomGone", "lanternGlow"] },
  { name: "Level 2 · Closer Look", seconds: 240, ids: ["smoke", "duck", "catColour", "butterfly", "wreath", "mushroomGone", "lanternGlow", "flowerBox", "fencePicket", "bird"] },
  { name: "Level 3 · Eagle Eyes",  seconds: 300, ids: ["sunMoon", "cloudExtra", "bird", "roofSpot", "butterfly", "fruit", "flowerBox", "wreath", "lanternGlow", "fencePicket", "catColour", "pathStone"] },
];
