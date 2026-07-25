/**
 * Generates the product illustrations in public/img/<category>/<slug>.svg
 *
 *   node scripts/product-art.mjs
 *
 * All product imagery in this project is drawn here. There are no third-party
 * image assets, so there is nothing to licence and no trademark to avoid.
 *
 * The two colours below mirror --ink and --accent in app/globals.css. They are
 * baked into the generated files because an SVG loaded through <img> is a
 * separate document and cannot read the page's CSS variables. This generator is
 * the single place they are written down — change them here and re-run.
 *
 * House rules for every drawing:
 *   - flat vector: no gradients, no shadows, no outline strokes around shapes
 *   - the body is INK, with exactly one ACCENT detail
 *   - transparent background
 *   - 4:3 viewBox (400 × 300), product centred, roughly 15% margin
 *   - comparable optical weight, so any four sit level in a row
 *
 * Silhouettes inside a category must differ on purpose — a repeated drawing
 * with one edited detail is the failure mode of this approach.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INK = "#1D2026";
const ACCENT = "#5B5BD6";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** A grid of holes, for speaker grilles. Emitted inside a mask, so black = hole. */
function dotGrid(x, y, cols, rows, step, r) {
  const dots = [];
  for (let c = 0; c < cols; c++) {
    for (let v = 0; v < rows; v++) {
      dots.push(
        `<circle cx="${x + c * step}" cy="${y + v * step}" r="${r}" fill="#000"/>`,
      );
    }
  }
  return dots.join("\n        ");
}

/** slug → { category, label, body } */
const drawings = {
  // ------------------------------------------------------------------ audio
  // Six deliberately different silhouettes:
  //   arch + two discs · side profile · low cluster · twin rings ·
  //   single slotted block · offset pair
  "halden-field-one": {
    category: "audio",
    label: "Over-ear headphones, front view",
    body: `
    <path d="M126 158 A74 74 0 0 1 274 158" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round"/>
    <ellipse cx="126" cy="182" rx="33" ry="41" fill="${INK}"/>
    <ellipse cx="274" cy="182" rx="33" ry="41" fill="${INK}"/>
    <rect x="288" y="170" width="10" height="24" rx="5" fill="${ACCENT}"/>`,
  },

  "nordvale-hush-pro": {
    category: "audio",
    label: "Noise-cancelling headphones, side profile",
    body: `
    <g transform="translate(-4,11)">
      <path d="M214 92 C192 55 132 64 128 138" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round"/>
      <rect x="113" y="128" width="30" height="64" rx="15" fill="${INK}"/>
      <circle cx="234" cy="156" r="62" fill="${INK}"/>
      <circle cx="234" cy="198" r="9" fill="${ACCENT}"/>
    </g>`,
  },

  "kestrel-bud-2": {
    category: "audio",
    label: "Wireless earbuds beside an open charging case",
    body: `
    <g transform="translate(-14,-20)">
      <rect x="198" y="106" width="118" height="50" rx="24" fill="${INK}" transform="rotate(-10 257 156)"/>
      <rect x="194" y="166" width="126" height="72" rx="34" fill="${INK}"/>
      <circle cx="257" cy="210" r="8" fill="${ACCENT}"/>
      <g transform="rotate(22 126 184)">
        <circle cx="126" cy="184" r="17" fill="${INK}"/>
        <rect x="124" y="177" width="46" height="14" rx="7" fill="${INK}"/>
      </g>
      <g transform="rotate(22 146 222)">
        <circle cx="146" cy="222" r="17" fill="${INK}"/>
        <rect x="144" y="215" width="46" height="14" rx="7" fill="${INK}"/>
      </g>
    </g>`,
  },

  "orla-loop": {
    category: "audio",
    label: "Open-ear clip earbuds, a mirrored pair",
    // Mirrored, not repeated: hooks face outward so the pair reads as two
    // objects rather than as a pair of letters.
    //
    // Drawn light on purpose — about 6% ink against 10–13% for the rest of the
    // category. An earbud is a small object and should look like one. A heavier
    // version was tried and rejected: thickening the hook merged it into the
    // driver, so the pair stopped reading as earbuds at all.
    body: `
    <g transform="translate(152,132) rotate(-20)">
      <circle cx="0" cy="0" r="41" fill="none" stroke="${INK}" stroke-width="14" stroke-dasharray="198 60" transform="rotate(104)"/>
      <ellipse cx="4" cy="43" rx="19" ry="16" fill="${INK}"/>
    </g>
    <g transform="translate(250,162) rotate(20) scale(-1,1)">
      <circle cx="0" cy="0" r="41" fill="none" stroke="${INK}" stroke-width="14" stroke-dasharray="198 60" transform="rotate(104)"/>
      <ellipse cx="4" cy="43" rx="19" ry="16" fill="${INK}"/>
      <circle cx="4" cy="43" r="7" fill="${ACCENT}"/>
    </g>`,
  },

  "cairn-tumble": {
    category: "audio",
    label: "Portable speaker with a perforated grille",
    // Dot grid rather than slots: horizontal slots in a rounded rectangle
    // read as a document icon.
    body: `
    <defs>
      <mask id="tumble-grille">
        <rect x="138" y="82" width="124" height="150" rx="30" fill="#fff"/>
        ${dotGrid(158, 106, 6, 7, 15, 5)}
      </mask>
    </defs>
    <g transform="translate(0,-7)">
      <rect x="138" y="82" width="124" height="150" rx="30" fill="${INK}" mask="url(#tumble-grille)"/>
      <circle cx="200" cy="208" r="9" fill="${ACCENT}"/>
    </g>`,
  },

  "vellum-shelf": {
    category: "audio",
    label: "A pair of desk speakers, one set back",
    body: `
    <defs>
      <mask id="shelf-rear">
        <rect x="126" y="96" width="70" height="140" rx="11" fill="#fff"/>
        <circle cx="161" cy="128" r="13" fill="#000"/>
        <circle cx="161" cy="182" r="27" fill="#000"/>
      </mask>
      <mask id="shelf-front">
        <rect x="214" y="110" width="76" height="136" rx="11" fill="#fff"/>
        <circle cx="252" cy="144" r="14" fill="#000"/>
        <circle cx="252" cy="198" r="29" fill="#000"/>
      </mask>
    </defs>
    <g transform="translate(-8,-21)">
      <rect x="126" y="96" width="70" height="140" rx="11" fill="${INK}" mask="url(#shelf-rear)"/>
      <rect x="214" y="110" width="76" height="136" rx="11" fill="${INK}" mask="url(#shelf-front)"/>
      <circle cx="252" cy="230" r="9" fill="${ACCENT}"/>
    </g>`,
  },
};

function render(label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" role="img" aria-label="${label}">
  <!-- Generated by scripts/product-art.mjs — edit there, not here. -->${body}
</svg>
`;
}

let written = 0;
for (const [slug, { category, label, body }] of Object.entries(drawings)) {
  const dir = path.join(root, "public", "img", category);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${slug}.svg`);
  await writeFile(file, render(label, body), "utf8");
  console.log(`wrote public/img/${category}/${slug}.svg`);
  written++;
}
console.log(`\n${written} illustration(s) generated.`);
