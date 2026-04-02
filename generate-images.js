const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZE = 1080;

const destinations = [
  {
    file: '01-japon.jpg',
    colors: ['#1a1025', '#3d1a5c', '#8b4f8a', '#e8a0b4', '#f4d4dc'],
    label: 'JAPÓN',
    sublabel: 'Kioto & Osaka',
  },
  {
    file: '02-marruecos.jpg',
    colors: ['#2a1a0a', '#7a3a10', '#c46020', '#e8902a', '#f5c87a'],
    label: 'MARRUECOS',
    sublabel: 'Marrakech & el Sáhara',
  },
  {
    file: '03-islandia.jpg',
    colors: ['#050c1a', '#0a1f3d', '#0d3d4a', '#1a6b5a', '#2ea88c'],
    label: 'ISLANDIA',
    sublabel: 'Reikiavik & las Auroras',
  },
  {
    file: '04-colombia.jpg',
    colors: ['#1a0a2a', '#3a1060', '#8b1a5a', '#d43a6a', '#f5906a'],
    label: 'COLOMBIA',
    sublabel: 'Cartagena & Medellín',
  },
  {
    file: '05-vietnam.jpg',
    colors: ['#1a1005', '#3d2a05', '#7a5010', '#c49020', '#f5d060'],
    label: 'VIETNAM',
    sublabel: 'Hội An & Ha Long',
  },
  {
    file: '06-grecia.jpg',
    colors: ['#051525', '#0a2d50', '#0f5080', '#1a7ab5', '#6ab8e8'],
    label: 'GRECIA',
    sublabel: 'Santorini & Rodas',
  },
  {
    file: '07-peru.jpg',
    colors: ['#0a1505', '#1a3010', '#2a5a20', '#4a8a30', '#8ab850'],
    label: 'PERÚ',
    sublabel: 'Cusco & Machu Picchu',
  },
  {
    file: '08-azores.jpg',
    colors: ['#051020', '#0a2540', '#0d4a6a', '#1a7a80', '#40b8a0'],
    label: 'PORTUGAL',
    sublabel: 'Azores & Lisboa',
  },
  {
    file: '09-zanzibar.jpg',
    colors: ['#051a15', '#0a3a30', '#0f6a70', '#20a0b0', '#7ad8e0'],
    label: 'TANZANÍA',
    sublabel: 'Zanzíbar & el Serengueti',
  },
  {
    file: '10-oaxaca.jpg',
    colors: ['#200a05', '#501510', '#902a18', '#c05020', '#e89060'],
    label: 'MÉXICO',
    sublabel: 'Oaxaca & la Costa',
  },
];

function drawNoise(ctx, size, opacity) {
  for (let i = 0; i < 18000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.2;
    const a = Math.random() * opacity;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }
}

function drawGeometry(ctx, size, color) {
  // Subtle diagonal lines
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let i = -size; i < size * 2; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  ctx.restore();

  // Corner accent lines
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const m = 60;
  const len = 90;
  // top-left
  ctx.beginPath(); ctx.moveTo(m, m); ctx.lineTo(m + len, m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(m, m); ctx.lineTo(m, m + len); ctx.stroke();
  // bottom-right
  ctx.beginPath(); ctx.moveTo(size - m, size - m); ctx.lineTo(size - m - len, size - m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size - m, size - m); ctx.lineTo(size - m, size - m - len); ctx.stroke();
  ctx.restore();
}

function drawText(ctx, size, label, sublabel, accentColor) {
  // Large faded number overlay
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(label.charAt(0), size - 40, size - 30);
  ctx.restore();

  // Thin top line
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, size - 185);
  ctx.lineTo(size * 0.5, size - 185);
  ctx.stroke();
  ctx.restore();

  // Main label
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  ctx.font = `300 ${Math.round(size * 0.088)}px 'sans-serif'`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '0.25em';
  ctx.fillText(label, 60, size - 120);
  ctx.restore();

  // Sub label
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = accentColor;
  ctx.font = `300 ${Math.round(size * 0.038)}px 'sans-serif'`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(sublabel, 60, size - 74);
  ctx.restore();

  // Handle
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#ffffff';
  ctx.font = `200 ${Math.round(size * 0.026)}px 'sans-serif'`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('@paty_viajera', 62, size - 44);
  ctx.restore();
}

function generateImage(dest, outDir) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // Multi-stop radial gradient background
  const cx = SIZE * 0.35;
  const cy = SIZE * 0.4;
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.9);
  const stops = dest.colors;
  stops.forEach((c, i) => grd.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Secondary light glow
  const grd2 = ctx.createRadialGradient(SIZE * 0.75, SIZE * 0.25, 0, SIZE * 0.75, SIZE * 0.25, SIZE * 0.55);
  grd2.addColorStop(0, `${stops[3]}55`);
  grd2.addColorStop(1, 'transparent');
  ctx.fillStyle = grd2;
  ctx.fillRect(0, 0, SIZE, SIZE);

  drawNoise(ctx, SIZE, 0.12);
  drawGeometry(ctx, SIZE, stops[3]);
  drawText(ctx, SIZE, dest.label, dest.sublabel, stops[3]);

  const outPath = path.join(outDir, dest.file);
  const buf = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  fs.writeFileSync(outPath, buf);
  console.log(`✓ ${dest.file}`);
}

const outDir = path.join(__dirname, 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

destinations.forEach(d => generateImage(d, outDir));
console.log('All images generated.');
