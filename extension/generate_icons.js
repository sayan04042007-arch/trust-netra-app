const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(size, pixelFn) {
  const width = size;
  const height = size;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, size);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Procedural Cyber Eye Drawing for TrustNetra AI
function drawNetraIcon(x, y, size) {
  // Normalize coordinates to -1.0 .. +1.0
  const nx = (x + 0.5) / size * 2 - 1;
  const ny = (y + 0.5) / size * 2 - 1;
  const distCenter = Math.sqrt(nx * nx + ny * ny);

  // Background rounded squircle / shield
  const cornerRadius = 0.88;
  const inSquircle = Math.pow(Math.abs(nx), 3.2) + Math.pow(Math.abs(ny), 3.2) <= cornerRadius;

  if (!inSquircle) {
    return [0, 0, 0, 0]; // Transparent outside icon bounds
  }

  // Base background: Deep sleek dark cyber gradient
  let bgR = 11 + Math.floor((ny + 1) * 8);
  let bgG = 16 + Math.floor((ny + 1) * 12);
  let bgB = 28 + Math.floor((ny + 1) * 20);

  // Border glow (outer edge of squircle)
  const squircleDist = Math.pow(Math.abs(nx), 3.2) + Math.pow(Math.abs(ny), 3.2);
  if (squircleDist > 0.72) {
    const borderBlend = (squircleDist - 0.72) / (cornerRadius - 0.72);
    bgR = Math.floor(bgR * (1 - borderBlend) + 0 * borderBlend);
    bgG = Math.floor(bgG * (1 - borderBlend) + 210 * borderBlend);
    bgB = Math.floor(bgB * (1 - borderBlend) + 255 * borderBlend);
  }

  // Eye shape formula:
  // Top eyelid: ny > -(1 - nx^2) * 0.55
  // Bottom eyelid: ny < (1 - nx^2) * 0.55
  const eyeWidth = 0.82;
  if (Math.abs(nx) <= eyeWidth) {
    const scaledX = nx / eyeWidth;
    const eyeArc = (1 - scaledX * scaledX) * 0.48;
    const inEye = ny >= -eyeArc && ny <= eyeArc;

    if (inEye) {
      // Distance from center of eye
      const eyeR = Math.sqrt(nx * nx + (ny * 1.3) * (ny * 1.3));

      // Sclera / Inner eye background: slightly deep cyan
      let er = 10, eg = 35, eb = 65;

      // Iris (radius ~ 0.32)
      if (eyeR <= 0.34) {
        // Glowing cyan-to-blue gradient
        const irisGrad = eyeR / 0.34;
        er = Math.floor(0 * (1 - irisGrad) + 0 * irisGrad);
        eg = Math.floor(240 * (1 - irisGrad) + 120 * irisGrad);
        eb = Math.floor(255 * (1 - irisGrad) + 240 * irisGrad);

        // Pupil (radius ~ 0.14)
        if (eyeR <= 0.15) {
          er = 5; eg = 8; eb = 15; // Dark pupil

          // Highlight reflection glint
          const glintDist = Math.sqrt(Math.pow(nx + 0.05, 2) + Math.pow(ny + 0.05, 2));
          if (glintDist <= 0.06) {
            er = 255; eg = 255; eb = 255; // Crisp white catchlight
          }
        }
      }

      // Eyelid border line (top/bottom stroke)
      const edgeDist = Math.min(Math.abs(ny - eyeArc), Math.abs(ny + eyeArc));
      if (edgeDist < 0.08) {
        er = 0; eg = 240; eb = 255;
      }

      return [er, eg, eb, 255];
    }
  }

  return [bgR, bgG, bgB, 255];
}

const dir = __dirname;
[16, 48, 128].forEach(size => {
  const pngBuf = createPng(size, drawNetraIcon);
  const outPath = path.join(dir, `icon${size}.png`);
  fs.writeFileSync(outPath, pngBuf);
  console.log(`Generated: icon${size}.png (${size}x${size}, ${pngBuf.length} bytes)`);
});
