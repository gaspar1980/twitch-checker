// Creates a minimal valid 1200x630 PNG with purple/dark background + Twitch brand colors
// Pure Node.js, zero dependencies — writes raw PNG binary

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1200, H = 630;

// Colors
const BG = [14, 14, 16];           // #0e0e10
const PURPLE = [145, 71, 255];     // #9147ff
const WHITE = [239, 239, 241];     // #efeff1

function setPixel(data, x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * (W * 3 + 1)) + 1 + x * 3; // +1 for filter byte per row
  data[i] = r; data[i + 1] = g; data[i + 2] = b;
}

function fillRect(data, x0, y0, w, h, r, g, b) {
  for (let y = y0; y < y0 + h && y < H; y++)
    for (let x = x0; x < x0 + w && x < W; x++)
      setPixel(data, x, y, r, g, b);
}

function fillCircle(data, cx, cy, radius, r, g, b) {
  for (let y = cy - radius; y <= cy + radius; y++)
    for (let x = cx - radius; x <= cx + radius; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2)
        setPixel(data, x, y, r, g, b);
}

// Build raw image data (filter byte 0 + RGB per pixel, per row)
const rawSize = H * (1 + W * 3);
const raw = Buffer.alloc(rawSize, 0);

// Set filter byte = 0 (None) for each row
for (let y = 0; y < H; y++) raw[y * (W * 3 + 1)] = 0;

// Fill background
fillRect(raw, 0, 0, W, H, ...BG);

// Purple rounded rectangle (logo box) — center top area
const boxW = 140, boxH = 140, boxX = (W - boxW) / 2, boxY = 100;
const boxR = 28;
fillRect(raw, boxX + boxR, boxY, boxW - 2 * boxR, boxH, ...PURPLE);
fillRect(raw, boxX, boxY + boxR, boxW, boxH - 2 * boxR, ...PURPLE);
fillCircle(raw, boxX + boxR, boxY + boxR, boxR, ...PURPLE);
fillCircle(raw, boxX + boxW - boxR, boxY + boxR, boxR, ...PURPLE);
fillCircle(raw, boxX + boxR, boxY + boxH - boxR, boxR, ...PURPLE);
fillCircle(raw, boxX + boxW - boxR, boxY + boxH - boxR, boxR, ...PURPLE);

// Simple Twitch "eyes" inside the box (two white vertical bars)
const eyeW = 10, eyeH = 36;
const eyeY = boxY + 40;
fillRect(raw, boxX + 44, eyeY, eyeW, eyeH, ...WHITE);
fillRect(raw, boxX + 86, eyeY, eyeW, eyeH, ...WHITE);

// Purple accent line below logo
fillRect(raw, (W - 400) / 2, boxY + boxH + 30, 400, 4, ...PURPLE);

// Large purple bar at bottom — brand strip
fillRect(raw, 0, H - 60, W, 60, PURPLE[0], PURPLE[1], PURPLE[2]);

// Subtle grid pattern in background (dots)
for (let y = 20; y < H - 70; y += 40)
  for (let x = 20; x < W; x += 40)
    setPixel(raw, x, y, 20, 20, 24);

// -- Encode PNG --
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // color type RGB
ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const compressed = zlib.deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  sig,
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, '../public/og-image.png');
fs.writeFileSync(outPath, png);
console.log(`Generated ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
