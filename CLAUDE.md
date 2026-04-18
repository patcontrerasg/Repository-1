# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Instagram carousel creator for travel content (@paty_viajera). Generates 1080×1080px destination images via Node.js canvas and displays them in a static HTML slideshow. Content is in Spanish.

## Commands

**Install dependencies:**
```bash
npm install
cd images && npm install && cd ..
```

**Generate destination images:**
```bash
node generate-images.js
```
Outputs 10 JPEG files into `images/`.

**View the carousel:**
Open `carousel.html` directly in a browser — no dev server needed.

There are no tests, no linter, and no build step beyond `generate-images.js`.

## Architecture

Two separate layers that must stay in sync manually:

- **`generate-images.js`** — reads a hardcoded `destinations` array and renders each entry to a 1080×1080 JPEG using the `canvas` npm package. The array drives filenames, gradient color stops, and text overlays.
- **`carousel.html`** — static HTML that references those JPEG filenames. Slide markup must mirror the destination array when destinations are added or removed.

### Image generation pipeline

Each image is composed by three helpers called in sequence inside `generateImage()`:

1. `drawNoise(ctx, size, opacity)` — grain texture via random small circles
2. `drawGeometry(ctx, size, color)` — diagonal lines and corner accents
3. `drawText(ctx, size, label, sublabel, accentColor)` — destination name overlay

### Destination data shape

```js
{
  file: 'XX-destination.jpg',   // written to images/
  colors: [c1, c2, c3, c4, c5], // 5-stop radial gradient
  label: 'DESTINATION NAME',
  sublabel: 'Specific regions'
}
```

### HTML/CSS conventions

- Slide variants use BEM modifier classes: `.slide--cover`, `.slide--photo`, `.slide--outro`
- Layout uses CSS custom properties for theming
- Fixed 540px slide width targets 2× export (1080px Instagram standard)
- Fonts: Cormorant Garamond (serif headings) + Jost (sans-serif body), loaded from Google Fonts

### Key constraint

`generate-images.js` and `carousel.html` are not linked at runtime. Adding or renaming a destination requires updating **both** files and re-running `node generate-images.js`.
