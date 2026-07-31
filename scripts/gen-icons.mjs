/**
 * 生成 PWA 图标（苔绿叶片）。零依赖：手写最小 PNG 编码器。
 * 用法：node scripts/gen-icons.mjs
 * 产出：public/icons/icon-192.png、icon-512.png、maskable-512.png、public/apple-touch-icon.png
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = w * 4 + 1;
  const raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y += 1) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const PAPER = [0xfd, 0xfb, 0xf7];
const MOSS = [0x6b, 0x8e, 0x6b];
const DARK = [0x55, 0x75, 0x5a];

function draw(size, maskable) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const corner = size * 0.22;
  const half = size / 2;
  const scale = maskable ? 0.62 : 0.84;
  const veinW = Math.max(1.2, size * 0.012);
  const stemW = Math.max(1.6, size * 0.016);

  const put = (i, c) => {
    buf[i] = c[0];
    buf[i + 1] = c[1];
    buf[i + 2] = c[2];
    buf[i + 3] = 255;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      let inBg = true;
      if (!maskable) {
        const dx = Math.max(Math.abs(x - cx) - (half - corner), 0);
        const dy = Math.max(Math.abs(y - cy) - (half - corner), 0);
        inBg = Math.hypot(dx, dy) <= corner;
      }
      if (!inBg) {
        buf[i + 3] = 0;
        continue;
      }
      put(i, MOSS);

      const px = x - cx;
      const py = y - cy;
      const u = (px * Math.SQRT1_2 + py * Math.SQRT1_2) / (size * scale);
      const v = (-px * Math.SQRT1_2 + py * Math.SQRT1_2) / (size * scale);
      const leaf = (u / 0.4) ** 2 + (v / 0.17) ** 2;
      const vpx = Math.abs(v) * size * scale;

      if (leaf <= 1) {
        put(i, PAPER);
        if (vpx < veinW) put(i, MOSS);
      }
      if (u > -0.62 && u < -0.36 && vpx < stemW) put(i, DARK);
    }
  }
  return encodePNG(size, size, buf);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(resolve(root, 'public/icons'), { recursive: true });
writeFileSync(resolve(root, 'public/icons/icon-192.png'), draw(192, false));
writeFileSync(resolve(root, 'public/icons/icon-512.png'), draw(512, false));
writeFileSync(resolve(root, 'public/icons/maskable-512.png'), draw(512, true));
writeFileSync(resolve(root, 'public/apple-touch-icon.png'), draw(180, true));
console.log('PWA icons generated.');
