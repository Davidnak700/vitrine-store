/**
 * Generates product imagery with Z-Image-Turbo, through the Gradio Space.
 *
 *   npm run images:generate -- smart-home        one category
 *   npm run images:generate -- halden-dial       one product, to redo it
 *   npm run images:generate -- smart-home --force  redo a whole category
 *
 * Writes public/img/<category>/<slug>.jpg directly. The Space is asked for a
 * 4:3 frame, so unlike the photographs these need no crop and never go through
 * prepare-images.ts. assets/photos/ stays what it says it is — untouched
 * photograph originals — and generated frames are not photographs.
 *
 * Why the Space and not the Inference API: image generation on the Inference
 * API bills against a $0.10 monthly credit allowance, which one pass over the
 * catalogue very nearly exhausts. The Space runs on ZeroGPU, which is free and
 * metered in GPU-seconds per day instead. See docs/image-spec.md.
 *
 * Rerunnable on purpose. A product whose file already exists is skipped unless
 * you name it, or pass --force, so redoing one bad image costs one generation
 * rather than a whole category.
 */

import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@gradio/client";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

import { products, PLACEHOLDER_IMAGE } from "../lib/products.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(root, "public", "img");

const SPACE = "mcp-tools/Z-Image-Turbo";
/** 1152x864. The Space takes a label, not a pair of numbers. */
const RESOLUTION = "1152x864 ( 4:3 )";
const STEPS = 8;
/** Fixed so a rerun of an unchanged product reproduces its image. */
const SEED = 20260726;
/** ZeroGPU is a shared queue. One at a time, with a pause, keeps us polite. */
const PAUSE_MS = 1500;

/**
 * The prompt is one template for every product; only the description varies.
 * Everything else — the lighting, the backdrop, the exclusions — is held
 * constant so the thirty-six frames can sit in one grid without one of them
 * looking like it came from somewhere else.
 */
function buildPrompt(description: string): string {
  return (
    `Product photograph of ${description}. ` +
    `Studio lighting, seamless very light grey background, product centred, ` +
    `fully visible with generous margin, subtle soft shadow beneath. ` +
    `No logos, no text, no branding. No hands, no people, no props. ` +
    `Photorealistic commercial product shot.`
  );
}

/**
 * Per-product descriptions, kept here rather than derived from the catalogue
 * so individual ones can be tuned without touching lib/products.ts.
 *
 * Written from each product's name, brand character and specs. Two habits
 * throughout, both aimed at the failure mode these models have with small
 * repeating geometry: say how many of a thing there are, and prefer plain
 * surfaces over grilles, ports and legends wherever the product allows it.
 */
const DESCRIPTIONS: Record<string, string> = {
  // ------------------------------------------------------------- smart home
  "brisk-glow-a1":
    "a single frosted white smart light bulb with a matte white base, standing upright, no packaging",
  // Third attempt. Naming what it must not be kept the word "socket" in the
  // prompt and produced socket holes regardless; describe only what is there.
  "brisk-socket-mini":
    "a small matte white power adapter block with two flat rectangular metal prongs standing proud of its smooth front face and pointing towards the viewer, one round button on the white body beside them, three-quarter view",
  // Third attempt. "No lens, no camera" removed every feature and left an
  // unidentifiable blank, so give it the one part a motion detector has.
  "ferrite-sense":
    "a small white motion detector, a rounded wedge body with a pale ridged semicircular plastic dome across its angled upper face and one tiny amber indicator light below it, standing on its flat base",
  "halden-dial":
    "a round wall thermostat with a brushed metal outer ring and a plain white centre dial, seen face on, no numbers or markings",
  "orla-chime":
    "a slim matte black video doorbell, a tall rounded rectangle with a single round camera lens above one round button, front view",
  "cairn-hub-one":
    "a small matte white smart home hub, a plain rounded cube with no visible ports, one soft indicator light on the front",

  // ----------------------------------------------------------------- others
  // Filled in as each category comes up. Anything missing is reported rather
  // than guessed, so a typo in a slug cannot quietly produce a wrong picture.
};

type Target = { slug: string; category: string; file: string };

/** Where the Space serves files it has written, for results that carry a path. */
const SPACE_ORIGIN = `https://${SPACE.replace("/", "-").toLowerCase()}.hf.space`;

type Imageish = { url?: string; path?: string; image?: { url?: string; path?: string } };

/**
 * Pull the image URL out of whatever shape came back.
 *
 * The Space's own /info advertises a single image plus a seed string, while
 * the tool description for the same Space advertises a gallery. Rather than
 * bet on one, accept both, and accept a bare path by resolving it against the
 * Space origin. Guessing wrong here fails after the GPU time is already spent.
 */
function imageUrl(data: unknown[]): string | undefined {
  const pick = (v: Imageish | undefined): string | undefined => {
    if (!v) return undefined;
    const url = v.url ?? v.image?.url;
    if (url) return url;
    const p = v.path ?? v.image?.path;
    return p ? `${SPACE_ORIGIN}/gradio_api/file=${p}` : undefined;
  };
  for (const entry of data) {
    const found = Array.isArray(entry)
      ? pick(entry[0] as Imageish)
      : pick(entry as Imageish);
    if (found) return found;
  }
  return undefined;
}

function parseArgs(argv: string[]) {
  const args = argv.filter((a) => !a.startsWith("--"));
  const force = argv.includes("--force");
  return { selectors: args, force };
}

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** Products still on the placeholder, narrowed by category or slug. */
function resolveTargets(selectors: string[]): Target[] {
  const pending = products.filter((p) => p.image === PLACEHOLDER_IMAGE);
  const chosen = selectors.length
    ? pending.filter((p) => selectors.includes(p.category) || selectors.includes(p.slug))
    : pending;

  const unknown = selectors.filter(
    (s) => !products.some((p) => p.category === s || p.slug === s),
  );
  if (unknown.length) {
    console.error(`Not a category or slug: ${unknown.join(", ")}`);
    process.exit(1);
  }

  return chosen.map((p) => ({
    slug: p.slug,
    category: p.category,
    file: path.join(OUTPUT, p.category, `${p.slug}.jpg`),
  }));
}

/** HF_TOKEN out of .env.local, without pulling in a dotenv dependency. */
async function readToken(): Promise<string> {
  const file = path.join(root, ".env.local");
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    console.error(`No .env.local. Copy .env.local.example to .env.local and paste your token.`);
    process.exit(1);
  }
  const line = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .find((l) => l.startsWith("HF_TOKEN="));
  const token = line?.slice("HF_TOKEN=".length).trim().replace(/^["']|["']$/g, "");
  if (!token) {
    console.error(`HF_TOKEN is empty in .env.local. Paste your token after the "=".`);
    process.exit(1);
  }
  if (!token.startsWith("hf_")) {
    console.error(
      `HF_TOKEN does not look like a Hugging Face token — they all start with "hf_".\n` +
        `Create one at https://huggingface.co/settings/tokens (a read token is enough).`,
    );
    process.exit(1);
  }
  return token;
}

/**
 * Refuse to start unless the token actually authenticates.
 *
 * Worth a round trip before any GPU work: an unusable token does not fail
 * loudly, it silently drops us onto the anonymous ZeroGPU pool — 2 minutes a
 * day against 5 — and we only find out when the quota dies mid-category with
 * images already written. Ask the Hub who we are first.
 */
async function verify(token: string): Promise<string> {
  const res = await fetch("https://huggingface.co/api/whoami-v2", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.error(
      `The token in .env.local was rejected by Hugging Face (HTTP ${res.status}).\n` +
        `Without a working token this runs anonymously on 2 minutes of daily GPU\n` +
        `quota instead of 5, so it would stall part-way. Replace the token and rerun.`,
    );
    process.exit(1);
  }
  const me = (await res.json()) as { name?: string };
  return me.name ?? "unknown";
}

const { selectors, force } = parseArgs(process.argv.slice(2));
const targets = resolveTargets(selectors);

if (targets.length === 0) {
  console.log("Nothing to generate. Every selected product already has an image.");
  process.exit(0);
}

const missing = targets.filter((t) => !DESCRIPTIONS[t.slug]);
if (missing.length) {
  console.error(`No description written for: ${missing.map((m) => m.slug).join(", ")}`);
  console.error(`Add them to DESCRIPTIONS in this file first.`);
  process.exit(1);
}

const token = await readToken();
const who = await verify(token);
const client = await Client.connect(SPACE, { token: token as `hf_${string}` });

console.log(`\n${SPACE} — ${RESOLUTION}, ${STEPS} steps, seed ${SEED}`);
console.log(`authenticated as ${who}\n`);

let generated = 0;
let skipped = 0;
const started = Date.now();

for (const target of targets) {
  // A product named outright is always redone; that is how you fix one image.
  const named = selectors.includes(target.slug);
  if (!force && !named && (await exists(target.file))) {
    console.log(`  ${target.slug.padEnd(20)}skipped, file exists`);
    skipped++;
    continue;
  }

  const prompt = buildPrompt(DESCRIPTIONS[target.slug]);
  const at = Date.now();

  const result = await client.predict("/generate", {
    prompt,
    seed: SEED,
    random_seed: false,
    resolution: RESOLUTION,
    steps: STEPS,
    shift: 3,
  });

  const url = imageUrl(result.data as unknown[]);
  if (!url) {
    throw new Error(
      `No image URL back for ${target.slug}: ${JSON.stringify(result.data).slice(0, 300)}`,
    );
  }

  const downloaded = Buffer.from(await (await fetch(url)).arrayBuffer());

  // The Space serves WebP. Writing those bytes under a .jpg name would be a
  // lie the rest of the toolchain believes — check-data.ts keys off the
  // extension — so transcode rather than rename.
  const meta = await sharp(downloaded).metadata();
  const bytes = await sharp(downloaded)
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await mkdir(path.dirname(target.file), { recursive: true });
  await writeFile(target.file, bytes);

  const secs = ((Date.now() - at) / 1000).toFixed(1);
  console.log(
    `  ${target.slug.padEnd(20)}${meta.width}x${meta.height} ${String(meta.format).padEnd(4)}` +
      ` → jpeg ${String(Math.round(bytes.length / 1024)).padStart(4)} KB   ${secs}s`,
  );
  generated++;

  await new Promise((r) => setTimeout(r, PAUSE_MS));
}

const total = ((Date.now() - started) / 1000).toFixed(0);
console.log(
  `\n${generated} generated, ${skipped} skipped, ${total}s wall clock.` +
    `\nZeroGPU meters GPU seconds, not wall clock, so the quota cost is lower than that.\n`,
);
