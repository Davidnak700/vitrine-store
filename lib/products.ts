import type { Category } from "@/lib/categories";

/**
 * The whole catalogue: 36 products, six per category.
 *
 * Only facts that cannot be worked out live here. There is no `isNew` and no
 * `isSale` flag — a product is on sale when `oldPrice` is set, and "new" is
 * simply the most recently added, read off `addedAt`. Nothing in this file
 * depends on today's date, so the server and the browser always agree.
 *
 * Within a category every product carries the same set of spec labels, in the
 * same order, so the comparison table lines up row by row.
 *
 * Product imagery: photographs and generated frames where we have them,
 * otherwise the shared placeholder. Both kinds carry an `imageCredit`; the
 * generated SVG illustrations (kept as a fallback, see docs/image-spec.md)
 * carry none.
 */

/**
 * Where a picture came from. Two kinds, because the two have nothing in
 * common: a photograph is owed to a person under a licence, and a generated
 * frame is owed to a model at a seed.
 *
 * Tagged rather than inferred from which fields are present, so adding a
 * third kind later cannot silently match one of these.
 *
 * The prompt is deliberately absent. It lives in DESCRIPTIONS in
 * scripts/generate-images.ts, and copying it here would be two sources of
 * truth for one string — the same fault as the basket badge that counted
 * stored lines while the drawer counted matched ones. Model, seed and that
 * script reproduce any frame exactly.
 */
export type ImageCredit =
  | {
      kind: "photograph";
      photographer: string;
      source: "Unsplash" | "Pexels";
      url: string;
    }
  | {
      kind: "generated";
      /** Hub id of the model, e.g. 'Tongyi-MAI/Z-Image-Turbo'. */
      model: string;
      seed: number;
    };

export type Spec = {
  label: string;
  value: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  /** Presence means the product is on sale. */
  oldPrice?: number;
  /** ISO date, e.g. '2026-07-25'. New arrivals derive from this. */
  addedAt: string;
  bestseller: boolean;
  image: string;
  imageCredit: ImageCredit | null;
  shortDescription: string;
  description: string;
  specs: Spec[];
  inStock: boolean;
};

/** Stands in for every photograph that has not been collected yet. */
export const PLACEHOLDER_IMAGE = "/img/placeholder.svg";

export const products: Product[] = [
  // ---------------------------------------------------------------- laptops
  // Spec labels: Screen · Processor · Memory · Storage · Battery · Weight
  {
    slug: "halden-slate-14",
    name: "Halden Slate 14",
    brand: "Halden",
    category: "laptops",
    price: 1099,
    oldPrice: 1249,
    addedAt: "2026-02-11",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Light enough to forget you packed it, quick enough for a full working day.",
    description:
      "The Slate is the one we hand to people who say they just want a laptop that works. It is thin, it stays silent, and the battery genuinely lasts a working day rather than a marketing day. If you write, browse and sit in meetings, you will never find its limit.",
    specs: [
      { label: "Screen", value: "14 inch, 2560 × 1600" },
      { label: "Processor", value: "10 cores" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "512 GB" },
      { label: "Battery", value: "Up to 18 hours" },
      { label: "Weight", value: "1.24 kg" },
    ],
    inStock: true,
  },
  {
    slug: "nordvale-drift-13",
    name: "Nordvale Drift 13",
    brand: "Nordvale",
    category: "laptops",
    price: 899,
    addedAt: "2026-05-02",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Our smallest laptop, and the one that travels best.",
    description:
      "A little over a kilogram, so it disappears into a bag you were already carrying. The Drift is built for people who work in short bursts in different places rather than at one desk. It is not the fastest machine here, and it does not need to be.",
    specs: [
      { label: "Screen", value: "13.3 inch, 1920 × 1200" },
      { label: "Processor", value: "8 cores" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "Up to 16 hours" },
      { label: "Weight", value: "1.06 kg" },
    ],
    inStock: true,
  },
  {
    slug: "kestrel-forge-16",
    name: "Kestrel Forge 16",
    brand: "Kestrel",
    category: "laptops",
    price: 1899,
    addedAt: "2025-11-14",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "For editing, rendering and anything that makes other laptops struggle.",
    description:
      "The Forge is heavy, and that is the point: there is room inside for cooling, so it keeps running at full speed instead of slowing down after ten minutes. Buy it if you edit video or work with large files. If you mostly use a browser, buy something lighter.",
    specs: [
      { label: "Screen", value: "16 inch, 3072 × 1920" },
      { label: "Processor", value: "14 cores" },
      { label: "Memory", value: "32 GB" },
      { label: "Storage", value: "1 TB" },
      { label: "Battery", value: "Up to 11 hours" },
      { label: "Weight", value: "2.10 kg" },
    ],
    inStock: true,
  },
  {
    slug: "cairn-field-15",
    name: "Cairn Field 15",
    brand: "Cairn",
    category: "laptops",
    price: 1249,
    oldPrice: 1449,
    addedAt: "2025-09-30",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Built to survive being carried badly.",
    description:
      "A reinforced case, a spill-resistant keyboard and hinges rated for years of opening and closing. The Field is chunkier than the rest of the shelf because everything inside it is braced. It suits anyone whose laptop lives in a rucksack rather than a sleeve.",
    specs: [
      { label: "Screen", value: "15.6 inch, 1920 × 1080" },
      { label: "Processor", value: "8 cores" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "512 GB" },
      { label: "Battery", value: "Up to 14 hours" },
      { label: "Weight", value: "1.90 kg" },
    ],
    inStock: true,
  },
  {
    slug: "tolvan-loom-14",
    name: "Tolvan Loom 14",
    brand: "Tolvan",
    category: "laptops",
    price: 549,
    addedAt: "2026-06-20",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The sensible first laptop, without the usual compromises.",
    description:
      "Cheap laptops usually cut the screen or the keyboard. The Loom cuts neither, and saves money on the case and the processor instead. It handles coursework, email and a dozen browser tabs without complaint, and it is the machine we recommend to students.",
    specs: [
      { label: "Screen", value: "14 inch, 1920 × 1080" },
      { label: "Processor", value: "6 cores" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "Up to 12 hours" },
      { label: "Weight", value: "1.50 kg" },
    ],
    inStock: true,
  },
  {
    slug: "vellum-arc-13",
    name: "Vellum Arc 13",
    brand: "Vellum",
    category: "laptops",
    price: 1149,
    addedAt: "2026-07-08",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Folds flat into a tablet when you would rather draw than type.",
    description:
      "The hinge turns all the way back, so the Arc works as a laptop, a tablet or a small easel propped on a table. The screen takes pen input. It is a genuinely useful shape for sketching and marking up documents, and an ordinary good laptop the rest of the time.",
    specs: [
      { label: "Screen", value: "13.3 inch touch, 2880 × 1800" },
      { label: "Processor", value: "8 cores" },
      { label: "Memory", value: "16 GB" },
      { label: "Storage", value: "512 GB" },
      { label: "Battery", value: "Up to 15 hours" },
      { label: "Weight", value: "1.30 kg" },
    ],
    inStock: true,
  },

  // ----------------------------------------------------------------- phones
  // Spec labels: Screen · Chip · Memory · Storage · Battery · Rear cameras
  {
    slug: "orla-pulse-7",
    name: "Orla Pulse 7",
    brand: "Orla",
    category: "phones",
    price: 799,
    oldPrice: 899,
    addedAt: "2026-03-05",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The all-rounder most people should buy and then stop thinking about.",
    description:
      "Good camera, good screen, and a battery that reaches bedtime with something left. The Pulse does not lead on any single measure, which is exactly why it is our most popular phone. Nothing about it will annoy you in two years.",
    specs: [
      { label: "Screen", value: "6.4 inch, 120 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "4700 mAh" },
      { label: "Rear cameras", value: "Wide and ultra-wide" },
    ],
    inStock: true,
  },
  {
    slug: "halden-ridge-5",
    name: "Halden Ridge 5",
    brand: "Halden",
    category: "phones",
    price: 649,
    addedAt: "2026-01-19",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "A big battery in a phone that is otherwise unremarkable, on purpose.",
    description:
      "The Ridge exists for people who resent charging their phone. Two days of ordinary use is normal, three if you are careful. Everything else about it is competent rather than exciting, and it costs less because of that.",
    specs: [
      { label: "Screen", value: "6.5 inch, 90 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "6 GB" },
      { label: "Storage", value: "128 GB" },
      { label: "Battery", value: "6000 mAh" },
      { label: "Rear cameras", value: "Wide and macro" },
    ],
    inStock: true,
  },
  {
    slug: "kestrel-vega-x",
    name: "Kestrel Vega X",
    brand: "Kestrel",
    category: "phones",
    price: 1099,
    addedAt: "2025-10-22",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The best camera we sell, in the phone we sell the most of to photographers.",
    description:
      "Three lenses that actually behave like three lenses, rather than one good one and two apologies. Low light is where the difference shows. It is expensive, and if you do not photograph much, the Pulse will make you just as happy for less.",
    specs: [
      { label: "Screen", value: "6.7 inch, 120 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "12 GB" },
      { label: "Storage", value: "512 GB" },
      { label: "Battery", value: "5000 mAh" },
      { label: "Rear cameras", value: "Wide, ultra-wide and telephoto" },
    ],
    inStock: true,
  },
  {
    slug: "tolvan-note-4",
    name: "Tolvan Note 4",
    brand: "Tolvan",
    category: "phones",
    price: 329,
    addedAt: "2026-06-30",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Everything a phone needs and nothing it does not, at a third of the price.",
    description:
      "Calls, messages, maps, photos and a full day of battery. The screen is a step down from the phones above and the camera struggles at night, and those are the only two places you will notice the price. A good first phone or a good spare.",
    specs: [
      { label: "Screen", value: "6.1 inch, 60 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "4 GB" },
      { label: "Storage", value: "128 GB" },
      { label: "Battery", value: "5000 mAh" },
      { label: "Rear cameras", value: "Wide" },
    ],
    inStock: true,
  },
  {
    slug: "brisk-ember-3",
    name: "Brisk Ember 3",
    brand: "Brisk",
    category: "phones",
    price: 449,
    oldPrice: 529,
    addedAt: "2025-12-03",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Small enough to use one-handed, which almost nothing is any more.",
    description:
      "Phones grew and never stopped. The Ember is deliberately narrow, so your thumb reaches the far corner of the screen. The trade is a smaller battery, and you will charge it every night. Plenty of people take that deal happily.",
    specs: [
      { label: "Screen", value: "5.9 inch, 90 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "3900 mAh" },
      { label: "Rear cameras", value: "Wide and ultra-wide" },
    ],
    inStock: false,
  },
  {
    slug: "sable-quill-2",
    name: "Sable Quill 2",
    brand: "Sable",
    category: "phones",
    price: 899,
    addedAt: "2026-07-14",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The thinnest phone on the shelf, without a hollow feel.",
    description:
      "Thin phones usually give up battery or creak when you hold them. The Quill does neither, because the frame is a single piece of metal rather than a shell around a chassis. It is a nice object, and it costs a little more for that reason.",
    specs: [
      { label: "Screen", value: "6.3 inch, 120 Hz" },
      { label: "Chip", value: "8 cores" },
      { label: "Memory", value: "8 GB" },
      { label: "Storage", value: "256 GB" },
      { label: "Battery", value: "4200 mAh" },
      { label: "Rear cameras", value: "Wide and telephoto" },
    ],
    inStock: true,
  },

  // ------------------------------------------------------------------ audio
  // Spec labels: Type · Connection · Battery life · Charging · Controls · Weight
  {
    slug: "halden-field-one",
    name: "Halden Field One",
    brand: "Halden",
    category: "audio",
    price: 249,
    addedAt: "2026-04-16",
    bestseller: true,
    image: "/img/audio/halden-field-one.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Paul Seling",
      source: "Pexels",
      url: "https://www.pexels.com/photo/black-corded-headphones-12266869/",
    },
    shortDescription: "Comfortable for a whole working day, which matters more than it sounds.",
    description:
      "Most headphones are judged on the first ten minutes. The Field One is built for hour six: light clamp, breathable pads, and no hot spot on the top of your head. The sound is even and unexaggerated, so voices and music both come out right.",
    specs: [
      { label: "Type", value: "Over-ear, closed back" },
      { label: "Connection", value: "Bluetooth or 3.5 mm cable" },
      { label: "Battery life", value: "45 hours" },
      { label: "Charging", value: "USB-C, 3 hours to full" },
      { label: "Controls", value: "Physical buttons" },
      { label: "Weight", value: "255 g" },
    ],
    inStock: true,
  },
  {
    slug: "nordvale-hush-pro",
    name: "Nordvale Hush Pro",
    brand: "Nordvale",
    category: "audio",
    price: 379,
    oldPrice: 429,
    addedAt: "2025-11-28",
    bestseller: true,
    image: "/img/audio/nordvale-hush-pro.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Kedibone Isaac Makhumisane",
      source: "Unsplash",
      url: "https://unsplash.com/photos/a-pair-of-headphones-sitting-on-top-of-a-table-BprwjNPX2Vk",
    },
    shortDescription: "Turns a train carriage into a quiet room.",
    description:
      "The noise cancelling is the reason to buy these, and it is genuinely a class above the rest of the shelf on steady sounds: engines, air conditioning, road noise. Voices still get through, which is deliberate. If you fly or commute often, this is the pair.",
    specs: [
      { label: "Type", value: "Over-ear, noise cancelling" },
      { label: "Connection", value: "Bluetooth or 3.5 mm cable" },
      { label: "Battery life", value: "32 hours with cancelling on" },
      { label: "Charging", value: "USB-C, 2 hours to full" },
      { label: "Controls", value: "Touch panel" },
      { label: "Weight", value: "290 g" },
    ],
    inStock: true,
  },
  {
    slug: "kestrel-bud-2",
    name: "Kestrel Bud 2",
    brand: "Kestrel",
    category: "audio",
    price: 129,
    addedAt: "2026-06-11",
    bestseller: false,
    image: "/img/audio/kestrel-bud-2.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "TheRegisti",
      source: "Unsplash",
      url: "https://unsplash.com/photos/black-and-blue-bluetooth-earbuds-qt9_OfTaaeY",
    },
    shortDescription: "Small, sealed earbuds that stay put when you run.",
    description:
      "Four sizes of tip in the box, because the fit is the whole product with earbuds. Get it right and they seal, stay in and sound full. The case gives you three extra charges, so a week of commuting between wall sockets is normal.",
    specs: [
      { label: "Type", value: "In-ear, sealed" },
      { label: "Connection", value: "Bluetooth" },
      { label: "Battery life", value: "8 hours, 32 with the case" },
      { label: "Charging", value: "USB-C or wireless pad" },
      { label: "Controls", value: "Touch, one tap per side" },
      { label: "Weight", value: "5 g per bud" },
    ],
    inStock: true,
  },
  {
    slug: "orla-loop",
    name: "Orla Loop",
    brand: "Orla",
    category: "audio",
    price: 159,
    addedAt: "2026-07-02",
    bestseller: false,
    image: "/img/audio/orla-loop.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "wu yi",
      source: "Unsplash",
      url: "https://unsplash.com/photos/black-and-silver-bluetooth-earphones-Kmz5Is6-PgQ",
    },
    shortDescription: "Hooks over the ear and stays there. Nothing to charge, ever.",
    description:
      "A wire is not a compromise here, it is the point: no battery, no pairing, no flat pair of earphones at the worst moment. The hooks sit over the top of your ear rather than wedging into the canal, so you can wear them for hours and still hear a car coming. Bass is lighter than a sealed bud, and that is the trade you are making.",
    specs: [
      { label: "Type", value: "Over-ear clips, wired" },
      { label: "Connection", value: "3.5 mm cable, 1.2 m" },
      { label: "Battery life", value: "Not applicable, wired" },
      { label: "Charging", value: "Not applicable" },
      { label: "Controls", value: "In-line remote on the cable" },
      { label: "Weight", value: "22 g the pair" },
    ],
    inStock: true,
  },
  {
    slug: "cairn-tumble",
    name: "Cairn Tumble",
    brand: "Cairn",
    category: "audio",
    price: 99,
    oldPrice: 129,
    addedAt: "2026-02-24",
    bestseller: false,
    image: "/img/audio/cairn-tumble.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Caleb Oquendo",
      source: "Pexels",
      url: "https://www.pexels.com/photo/speaker-in-white-background-7772558/",
    },
    shortDescription: "A speaker you can leave outside and stop worrying about.",
    description:
      "Sealed against rain and dust, and it survives being knocked off a table, which is how most portable speakers die. It is loud enough for a kitchen or a small garden and honest about not being loud enough for a party.",
    specs: [
      { label: "Type", value: "Portable speaker" },
      { label: "Connection", value: "Bluetooth" },
      { label: "Battery life", value: "18 hours" },
      { label: "Charging", value: "USB-C, 3 hours to full" },
      { label: "Controls", value: "Physical buttons" },
      { label: "Weight", value: "560 g" },
    ],
    inStock: true,
  },
  {
    slug: "vellum-shelf",
    name: "Vellum Shelf",
    brand: "Vellum",
    category: "audio",
    price: 299,
    addedAt: "2025-09-12",
    bestseller: false,
    image: "/img/audio/vellum-shelf.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Rosen Genov",
      source: "Pexels",
      url: "https://www.pexels.com/photo/a-presonus-speaker-system-4295360/",
    },
    shortDescription: "A proper pair of speakers for a desk, not a single box pretending.",
    description:
      "Two speakers a metre apart give you a stereo image that no single unit can fake — instruments sit in different places instead of piling into the middle. They plug into the mains and stay where you put them. For a desk or a small sitting room, this is the upgrade that people actually hear.",
    specs: [
      { label: "Type", value: "Powered desk speakers, pair" },
      { label: "Connection", value: "Bluetooth, USB-C or 3.5 mm" },
      { label: "Battery life", value: "Mains powered" },
      { label: "Charging", value: "Not applicable" },
      { label: "Controls", value: "Volume dial on the right unit" },
      { label: "Weight", value: "2.4 kg the pair" },
    ],
    inStock: true,
  },

  // -------------------------------------------------------------------- tvs
  // Spec labels: Screen size · Resolution · Panel · Refresh rate · HDMI ports · Sound
  {
    slug: "nordvale-vista-43",
    name: "Nordvale Vista 43",
    brand: "Nordvale",
    category: "tvs",
    price: 429,
    addedAt: "2026-01-08",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The right size for a bedroom or a small sitting room.",
    description:
      "Forty-three inches is as large as most rooms want, whatever the shop floor suggests. The Vista is bright enough for a room with windows and its menus are quick, which is rarer than it should be at this price.",
    specs: [
      { label: "Screen size", value: "43 inch" },
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "LED" },
      { label: "Refresh rate", value: "60 Hz" },
      { label: "HDMI ports", value: "3" },
      { label: "Sound", value: "2 × 10 W" },
    ],
    inStock: true,
  },
  {
    slug: "halden-pane-50",
    name: "Halden Pane 50",
    brand: "Halden",
    category: "tvs",
    price: 599,
    oldPrice: 699,
    addedAt: "2026-03-19",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Our most-bought television, and the easiest one to recommend.",
    description:
      "Fifty inches, a bright panel and a picture that needs no adjusting out of the box. The Pane is the television we suggest when someone has not thought about televisions in eight years and does not want to start now.",
    specs: [
      { label: "Screen size", value: "50 inch" },
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "LED with local dimming" },
      { label: "Refresh rate", value: "120 Hz" },
      { label: "HDMI ports", value: "4" },
      { label: "Sound", value: "2 × 12 W" },
    ],
    inStock: true,
  },
  {
    slug: "kestrel-lumen-55",
    name: "Kestrel Lumen 55",
    brand: "Kestrel",
    category: "tvs",
    price: 899,
    addedAt: "2025-10-05",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Deep blacks that survive a dark room, which cheaper sets cannot manage.",
    description:
      "In a lit room, most televisions look similar. Turn the lights off and the difference appears: the Lumen holds true black instead of a grey glow, so night scenes stay readable. Worth the money if you watch films properly, wasted if the television is background noise.",
    specs: [
      { label: "Screen size", value: "55 inch" },
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "OLED" },
      { label: "Refresh rate", value: "120 Hz" },
      { label: "HDMI ports", value: "4" },
      { label: "Sound", value: "2 × 15 W" },
    ],
    inStock: true,
  },
  {
    slug: "cairn-broad-65",
    name: "Cairn Broad 65",
    brand: "Cairn",
    category: "tvs",
    price: 1199,
    oldPrice: 1399,
    addedAt: "2026-05-21",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Large, bright, and happy in a room full of daylight.",
    description:
      "Sixty-five inches needs about three metres of viewing distance to be comfortable — measure before you buy. Given that room, the Broad is excellent: very bright, so sunshine on the screen does not wash the picture out, and even across the whole panel.",
    specs: [
      { label: "Screen size", value: "65 inch" },
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "LED with local dimming" },
      { label: "Refresh rate", value: "120 Hz" },
      { label: "HDMI ports", value: "4" },
      { label: "Sound", value: "2 × 15 W" },
    ],
    inStock: true,
  },
  {
    slug: "tolvan-frame-32",
    name: "Tolvan Frame 32",
    brand: "Tolvan",
    category: "tvs",
    price: 249,
    addedAt: "2026-07-11",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "A small second television for a kitchen or a spare room.",
    description:
      "Thirty-two inches, light enough for one person to mount, and cheap enough that putting one in a kitchen is not extravagant. The picture is fine at close range. Do not buy it as a main television.",
    specs: [
      { label: "Screen size", value: "32 inch" },
      { label: "Resolution", value: "1920 × 1080" },
      { label: "Panel", value: "LED" },
      { label: "Refresh rate", value: "60 Hz" },
      { label: "HDMI ports", value: "2" },
      { label: "Sound", value: "2 × 8 W" },
    ],
    inStock: true,
  },
  {
    slug: "sable-reel-75",
    name: "Sable Reel 75",
    brand: "Sable",
    category: "tvs",
    price: 1799,
    addedAt: "2026-06-25",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The biggest set we stock. Measure your wall first.",
    description:
      "Seventy-five inches is a piece of furniture, not an appliance, and it wants four metres of distance and two people to lift it. If your room can take it, the effect is genuinely different from a smaller screen. If it cannot, the Broad will make you happier.",
    specs: [
      { label: "Screen size", value: "75 inch" },
      { label: "Resolution", value: "3840 × 2160" },
      { label: "Panel", value: "LED with local dimming" },
      { label: "Refresh rate", value: "120 Hz" },
      { label: "HDMI ports", value: "4" },
      { label: "Sound", value: "2 × 20 W" },
    ],
    inStock: false,
  },

  // ------------------------------------------------------------- smart-home
  // Spec labels: Connection · Power · Setup · Works with · Size · Warranty
  {
    slug: "brisk-glow-a1",
    name: "Brisk Glow A1",
    brand: "Brisk",
    category: "smart-home",
    price: 19,
    addedAt: "2026-04-02",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The cheapest way to find out whether you like smart lighting.",
    description:
      "Screws into an ordinary fitting and joins your wi-fi in about a minute, with no hub to buy first. Dim it, change its colour, or set it to come on at dusk. If you are curious about smart lighting, start with one of these rather than a whole kit.",
    specs: [
      { label: "Connection", value: "Wi-fi, 2.4 GHz" },
      { label: "Power", value: "9 W, equivalent to 60 W" },
      { label: "Setup", value: "App, no hub required" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "E27 fitting" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
  {
    slug: "brisk-socket-mini",
    name: "Brisk Socket Mini",
    brand: "Brisk",
    category: "smart-home",
    price: 24,
    oldPrice: 32,
    addedAt: "2026-02-14",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Makes any ordinary appliance switchable from your phone.",
    description:
      "A lamp, a fan, a Christmas tree — anything with a plug becomes something you can schedule. It is small enough not to block the second socket, which most of these are not. It also reports how much power the thing plugged into it is drawing.",
    specs: [
      { label: "Connection", value: "Wi-fi, 2.4 GHz" },
      { label: "Power", value: "13 A maximum" },
      { label: "Setup", value: "App, no hub required" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "52 × 52 × 38 mm" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
  {
    slug: "ferrite-sense",
    name: "Ferrite Sense",
    brand: "Ferrite",
    category: "smart-home",
    price: 39,
    addedAt: "2025-12-16",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "Notices movement and tells the rest of your setup about it.",
    description:
      "Stick it in a hallway and your lights come on when you walk through, and go off when you do not. It runs for about two years on the battery it ships with. On its own it does nothing; it is useful once you have a bulb or a plug for it to trigger.",
    specs: [
      { label: "Connection", value: "Thread" },
      { label: "Power", value: "Battery, about 2 years" },
      { label: "Setup", value: "App, hub required" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "40 × 40 × 20 mm" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
  {
    slug: "halden-dial",
    name: "Halden Dial",
    brand: "Halden",
    category: "smart-home",
    price: 179,
    oldPrice: 209,
    addedAt: "2026-05-08",
    bestseller: true,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "A heating control you can actually work out how to use.",
    description:
      "One dial, one screen, and a schedule you set by turning it rather than by reading a manual. It learns roughly when you are in and stops heating an empty house. Fitting takes about twenty minutes if your boiler is a normal one.",
    specs: [
      { label: "Connection", value: "Wi-fi, 2.4 GHz" },
      { label: "Power", value: "Wired to the boiler" },
      { label: "Setup", value: "App, no hub required" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "84 mm across" },
      { label: "Warranty", value: "3 years" },
    ],
    inStock: true,
  },
  {
    slug: "orla-chime",
    name: "Orla Chime",
    brand: "Orla",
    category: "smart-home",
    price: 129,
    addedAt: "2026-07-16",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "See who is at the door before you decide to open it.",
    description:
      "A camera and a speaker in a doorbell, so you can answer from the kitchen or from another country. Footage is kept on the doorbell itself rather than on someone else's computer, which means no monthly fee and nothing to cancel later.",
    specs: [
      { label: "Connection", value: "Wi-fi, 2.4 and 5 GHz" },
      { label: "Power", value: "Battery or existing doorbell wiring" },
      { label: "Setup", value: "App, no hub required" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "128 × 46 × 28 mm" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
  {
    slug: "cairn-hub-one",
    name: "Cairn Hub One",
    brand: "Cairn",
    category: "smart-home",
    price: 89,
    addedAt: "2026-06-05",
    bestseller: false,
    image: PLACEHOLDER_IMAGE,
    imageCredit: null,
    shortDescription: "The box that lets the battery-powered gadgets talk to your wi-fi.",
    description:
      "Sensors and buttons that run for years on a coin cell cannot use wi-fi — it drains them. They use a low-power radio instead, and this is the translator. Buy one if you are adding sensors; skip it if you only want bulbs and plugs.",
    specs: [
      { label: "Connection", value: "Ethernet, Thread and Bluetooth" },
      { label: "Power", value: "USB-C, mains adapter included" },
      { label: "Setup", value: "App" },
      { label: "Works with", value: "Matter" },
      { label: "Size", value: "98 × 98 × 26 mm" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },

  // ------------------------------------------------------------ accessories
  // Spec labels: Type · Connection · Material · Size · Compatibility · Warranty
  {
    slug: "ferrite-cord-2m",
    name: "Ferrite Cord 2m",
    brand: "Ferrite",
    category: "accessories",
    price: 15,
    addedAt: "2026-03-28",
    bestseller: false,
    image: "/img/accessories/ferrite-cord-2m.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "ready made",
      source: "Pexels",
      url: "https://www.pexels.com/photo/close-up-photo-of-cord-3921633/",
    },
    shortDescription: "A charging cable that outlasts the thing you bought it for.",
    description:
      "Braided sleeve, moulded strain relief at both ends, and a two-metre length that reaches the sofa. Cables fail where they bend, so that is where this one is reinforced. It carries full charging speed and video, so it also drives a monitor.",
    specs: [
      { label: "Type", value: "Charging and data cable" },
      { label: "Connection", value: "USB-C to USB-C" },
      { label: "Material", value: "Braided nylon" },
      { label: "Size", value: "2 m" },
      { label: "Compatibility", value: "Any USB-C device" },
      { label: "Warranty", value: "5 years" },
    ],
    inStock: true,
  },
  {
    slug: "ferrite-brick-65",
    name: "Ferrite Brick 65",
    brand: "Ferrite",
    category: "accessories",
    price: 45,
    oldPrice: 55,
    addedAt: "2026-01-30",
    bestseller: true,
    image: "/img/accessories/ferrite-brick-65.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "I'm Zion",
      source: "Pexels",
      url: "https://www.pexels.com/photo/gallium-nitride-chargers-over-blue-surface-4865059/",
    },
    shortDescription: "One charger for the laptop, the phone and the headphones.",
    description:
      "Two sockets, enough power for a laptop, and pins that fold flat so it does not tear the lining of your bag. Plug two things in and it divides the power sensibly between them. This is the one to buy if you are tired of carrying three chargers.",
    specs: [
      { label: "Type", value: "Mains charger" },
      { label: "Connection", value: "2 × USB-C" },
      { label: "Material", value: "Matte polycarbonate" },
      { label: "Size", value: "65 W, 58 × 58 × 30 mm" },
      { label: "Compatibility", value: "Any USB-C device" },
      { label: "Warranty", value: "3 years" },
    ],
    inStock: true,
  },
  {
    slug: "vellum-rise",
    name: "Vellum Rise",
    brand: "Vellum",
    category: "accessories",
    price: 59,
    addedAt: "2025-11-06",
    bestseller: false,
    image: "/img/accessories/vellum-rise.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Workperch",
      source: "Unsplash",
      url: "https://unsplash.com/photos/black-and-silver-laptop-computer-on-brown-wooden-table-iTUZ7VcJI8M",
    },
    shortDescription: "Lifts the screen to eye level, which your neck will notice within a week.",
    description:
      "A laptop on a desk puts the screen too low, and you lean forward all day to compensate. This raises it by about fifteen centimetres. You will need a separate keyboard once the laptop is up there — that is how it is supposed to work.",
    specs: [
      { label: "Type", value: "Laptop stand" },
      { label: "Connection", value: "None" },
      { label: "Material", value: "Anodised aluminium" },
      { label: "Size", value: "Fits 11 to 16 inch laptops" },
      { label: "Compatibility", value: "Any laptop up to 3 kg" },
      { label: "Warranty", value: "5 years" },
    ],
    inStock: true,
  },
  {
    slug: "kestrel-glide",
    name: "Kestrel Glide",
    brand: "Kestrel",
    category: "accessories",
    price: 69,
    oldPrice: 85,
    addedAt: "2026-04-24",
    bestseller: false,
    image: "/img/accessories/kestrel-glide.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Andrey Matveev",
      source: "Pexels",
      url: "https://www.pexels.com/photo/sleek-white-wireless-mouse-on-vibrant-yellow-32995421/",
    },
    shortDescription: "Quiet, accurate, and shaped for a hand rather than a photograph.",
    description:
      "The buttons are pressure-damped, so a whole afternoon of clicking does not annoy the room. It connects to three machines at once and switches between them with a button underneath. Battery life is measured in months, not days.",
    specs: [
      { label: "Type", value: "Wireless mouse" },
      { label: "Connection", value: "Bluetooth or USB-C receiver" },
      { label: "Material", value: "Soft-touch plastic" },
      { label: "Size", value: "115 × 62 × 40 mm" },
      { label: "Compatibility", value: "Windows, macOS, Linux" },
      { label: "Warranty", value: "3 years" },
    ],
    inStock: true,
  },
  {
    slug: "halden-press",
    name: "Halden Press",
    brand: "Halden",
    category: "accessories",
    price: 119,
    addedAt: "2026-06-18",
    bestseller: true,
    image: "/img/accessories/halden-press.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Clay Banks",
      source: "Unsplash",
      url: "https://unsplash.com/photos/silver-and-white-computer-keyboard-PXaQXThG1FY",
    },
    shortDescription: "A keyboard that is pleasant to type on and quiet enough for an office.",
    description:
      "Low-profile keys with a short, definite press, and no rattle. It is a compact layout, so the number pad is gone and your mouse hand sits closer in. Pairs with three devices, and runs for a couple of months between charges.",
    specs: [
      { label: "Type", value: "Wireless keyboard" },
      { label: "Connection", value: "Bluetooth or USB-C receiver" },
      { label: "Material", value: "Aluminium top plate" },
      { label: "Size", value: "Compact, 305 × 125 mm" },
      { label: "Compatibility", value: "Windows, macOS, Linux" },
      { label: "Warranty", value: "3 years" },
    ],
    inStock: true,
  },
  {
    slug: "sable-carry-14",
    name: "Sable Carry 14",
    brand: "Sable",
    category: "accessories",
    price: 49,
    addedAt: "2026-07-20",
    bestseller: false,
    image: "/img/accessories/sable-carry-14.jpg",
    imageCredit: {
      kind: "photograph",
      photographer: "Lee Campbell",
      source: "Pexels",
      url: "https://www.pexels.com/photo/closed-grey-leather-case-89723/",
    },
    shortDescription: "A sleeve thick enough to matter when the bag goes down hard.",
    description:
      "Most sleeves are a thin layer of felt that stops scratches and nothing else. This one has a padded core, so a laptop inside it survives a bag being dropped. There is a flat pocket on the back for a charger and a cable.",
    specs: [
      { label: "Type", value: "Laptop sleeve" },
      { label: "Connection", value: "None" },
      { label: "Material", value: "Wool felt with padded core" },
      { label: "Size", value: "Fits up to 14 inch" },
      { label: "Compatibility", value: "Any laptop up to 14 inch" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
];

// ---------------------------------------------------------------- selectors

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

export function isOnSale(product: Product): boolean {
  return product.oldPrice !== undefined;
}

/** Newest first. Deliberately not "added in the last N days" — that would
 *  depend on today's date and make the output differ between server and
 *  browser. Newest N is stable forever. */
function byNewestFirst(a: Product, b: Product): number {
  return b.addedAt.localeCompare(a.addedAt);
}

/** Biggest saving first. */
function byDeepestDiscount(a: Product, b: Product): number {
  return b.oldPrice! - b.price - (a.oldPrice! - a.price);
}

/**
 * The three home page rows must not share a product. Rather than encode that
 * in the data, each selector takes the slugs already used, so the home page
 * composes them in order and disjointness is guaranteed however the data
 * changes later.
 */
type SelectorOptions = {
  limit?: number;
  exclude?: ReadonlySet<string>;
};

function select(
  pool: Product[],
  { limit, exclude }: SelectorOptions = {},
): Product[] {
  const kept = exclude
    ? pool.filter((product) => !exclude.has(product.slug))
    : pool;
  return limit === undefined ? kept : kept.slice(0, limit);
}

export function getBestsellers(options?: SelectorOptions): Product[] {
  return select(
    products.filter((product) => product.bestseller).sort(byNewestFirst),
    options,
  );
}

export function getDeals(options?: SelectorOptions): Product[] {
  return select(products.filter(isOnSale).sort(byDeepestDiscount), options);
}

export function getNewArrivals(options?: SelectorOptions): Product[] {
  return select([...products].sort(byNewestFirst), options);
}

export function getDealsByCategory(category: Category): Product[] {
  return getProductsByCategory(category).filter(isOnSale);
}

/**
 * Search by name and brand.
 *
 * Every word typed has to appear somewhere in the name or the brand, so
 * "halden headphones" finds nothing while "halden field" finds the Field One.
 * Deliberately not a fuzzy match: with 36 products a near-miss is more
 * confusing than an honest empty result.
 */
export function searchProducts(query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return products
    .filter((product) => {
      const haystack = `${product.name} ${product.brand}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
