/** Categories that have their own host grid (excludes curated "For you"). */
export const CATEGORY_IDS_WITH_GRID = [
  "womens",
  "luxury",
  "streetwear",
  "beauty",
  "collectibles",
] as const;

export type CategoryWithGrid = (typeof CATEGORY_IDS_WITH_GRID)[number];

export type LiveCategoryId = "foryou" | CategoryWithGrid;

export type LiveHost = {
  id: string;
  name: string;
  specialty: string;
};

export const LIVE_CATEGORY_TABS: { id: LiveCategoryId; label: string }[] = [
  { id: "foryou", label: "For you" },
  { id: "womens", label: "Women's Fashion" },
  { id: "luxury", label: "Luxury" },
  { id: "streetwear", label: "Streetwear" },
  { id: "beauty", label: "Beauty" },
  { id: "collectibles", label: "Collectibles" },
];

/** Colored category chips — idle vs selected (used on host picker). */
export const CATEGORY_CHIP_THEME: Record<LiveCategoryId, { idle: string; active: string }> = {
  foryou: {
    idle:
      "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300/90 hover:bg-neutral-200 hover:ring-neutral-400 hover:brightness-[1.02]",
    active:
      "bg-ink text-paper ring-1 ring-neutral-800 shadow-md shadow-black/25 hover:brightness-110",
  },
  womens: {
    idle:
      "bg-pink-50 text-pink-950 ring-1 ring-pink-200/90 hover:bg-pink-100 hover:ring-pink-300 hover:brightness-[1.02]",
    active:
      "bg-posh-pink text-white ring-1 ring-posh-pink-dark shadow-md shadow-pink-600/35 hover:brightness-105",
  },
  luxury: {
    idle:
      "bg-amber-50 text-amber-950 ring-1 ring-amber-200/90 hover:bg-amber-100 hover:ring-amber-300 hover:brightness-[1.02]",
    active:
      "bg-posh-burgundy text-white ring-1 ring-posh-burgundy shadow-md shadow-amber-950/30 hover:brightness-105",
  },
  streetwear: {
    idle:
      "bg-slate-100 text-slate-900 ring-1 ring-slate-300/90 hover:bg-slate-200 hover:ring-slate-400 hover:brightness-[1.02]",
    active: "bg-neutral-900 text-white ring-1 ring-black shadow-md shadow-black/40 hover:brightness-110",
  },
  beauty: {
    idle:
      "bg-fuchsia-50 text-fuchsia-950 ring-1 ring-fuchsia-200/90 hover:bg-fuchsia-100 hover:ring-fuchsia-300 hover:brightness-[1.02]",
    active:
      "bg-fuchsia-600 text-white ring-1 ring-fuchsia-800 shadow-md shadow-fuchsia-900/30 hover:brightness-105",
  },
  collectibles: {
    idle:
      "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/90 hover:bg-emerald-100 hover:ring-emerald-300 hover:brightness-[1.02]",
    active:
      "bg-emerald-700 text-white ring-1 ring-emerald-900 shadow-md shadow-emerald-950/30 hover:brightness-105",
  },
};

/** Sixteen mock hosts per category (2×8 grid) — ids are stable for follow state. */
export const HOSTS_BY_CATEGORY: Record<CategoryWithGrid, LiveHost[]> = {
  womens: [
    { id: "womens-1", name: "Sarah J.", specialty: "VINTAGE CURATOR" },
    { id: "womens-2", name: "Mina K.", specialty: "WORKWEAR EDITS" },
    { id: "womens-3", name: "Priya N.", specialty: "DENIM & BASICS" },
    { id: "womens-4", name: "Hannah T.", specialty: "EVENING & OCCASION" },
    { id: "womens-5", name: "Olivia R.", specialty: "COATS & OUTERWEAR" },
    { id: "womens-6", name: "Chloe B.", specialty: "ACTIVE & LOUNGE" },
    { id: "womens-7", name: "Amira F.", specialty: "MODEST EDITS" },
    { id: "womens-8", name: "Grace H.", specialty: "PETITE PICKS" },
    { id: "womens-9", name: "Nina L.", specialty: "TALL & LONG LINE" },
    { id: "womens-10", name: "Vera S.", specialty: "MATERNITY STYLE" },
    { id: "womens-11", name: "Tessa M.", specialty: "RESORT & TRAVEL" },
    { id: "womens-12", name: "Riley C.", specialty: "STREET CHIC" },
    { id: "womens-13", name: "Yuki W.", specialty: "MINIMAL CAPSULE" },
    { id: "womens-14", name: "Dana P.", specialty: "PLUS CURATED" },
    { id: "womens-15", name: "Eve G.", specialty: "ACCESSORY STACKS" },
    { id: "womens-16", name: "Quinn A.", specialty: "SUSTAINABLE EDITS" },
  ],
  luxury: [
    { id: "luxury-1", name: "David L.", specialty: "LUXURY RESALE" },
    { id: "luxury-2", name: "Claire V.", specialty: "DESIGNER BAGS" },
    { id: "luxury-3", name: "James R.", specialty: "WATCHES & ACCESSORIES" },
    { id: "luxury-4", name: "Elena M.", specialty: "EUROPEAN HOUSES" },
    { id: "luxury-5", name: "Victor H.", specialty: "MEN'S LUXE" },
    { id: "luxury-6", name: "Isabel K.", specialty: "FINE JEWELRY" },
    { id: "luxury-7", name: "Marc T.", specialty: "RUNWAY ARCHIVE" },
    { id: "luxury-8", name: "Lena O.", specialty: "SHOES & HEELS" },
    { id: "luxury-9", name: "Adrian S.", specialty: "STREET-LUXE MIX" },
    { id: "luxury-10", name: "Monica D.", specialty: "STATEMENT PIECES" },
    { id: "luxury-11", name: "Felix N.", specialty: "AUTHENTICATION FOCUS" },
    { id: "luxury-12", name: "Camille J.", specialty: "EVENING COUTURE" },
    { id: "luxury-13", name: "Owen B.", specialty: "LEATHER GOODS" },
    { id: "luxury-14", name: "Sienna P.", specialty: "SILK & CASHMERE" },
    { id: "luxury-15", name: "Rowan E.", specialty: "LIMITED DROPS" },
    { id: "luxury-16", name: "Naomi Y.", specialty: "CONCIERGE PICKS" },
  ],
  streetwear: [
    { id: "streetwear-1", name: "Team Apex", specialty: "STREETWEAR DROPS" },
    { id: "streetwear-2", name: "Kai P.", specialty: "SNEAKER HEAT" },
    { id: "streetwear-3", name: "Noah S.", specialty: "ARCHIVE PIECES" },
    { id: "streetwear-4", name: "Zoe & Max", specialty: "COLLABS & CAPSULES" },
    { id: "streetwear-5", name: "Jalen R.", specialty: "HOOPS & GRAPHICS" },
    { id: "streetwear-6", name: "Milo T.", specialty: "TECHWEAR" },
    { id: "streetwear-7", name: "Remy L.", specialty: "SKATE ROOTS" },
    { id: "streetwear-8", name: "Ash V.", specialty: "VINTAGE STREET" },
    { id: "streetwear-9", name: "Dev K.", specialty: "JAPAN IMPORTS" },
    { id: "streetwear-10", name: "Sky M.", specialty: "WOMEN'S STREET" },
    { id: "streetwear-11", name: "Ty C.", specialty: "HEADWEAR & CAPS" },
    { id: "streetwear-12", name: "Lex W.", specialty: "HOODIES & FLEECE" },
    { id: "streetwear-13", name: "Casey F.", specialty: "OUTERWEAR HEAT" },
    { id: "streetwear-14", name: "Izzy G.", specialty: "DENIM & WORK PANTS" },
    { id: "streetwear-15", name: "Bo N.", specialty: "LAYERING SYSTEMS" },
    { id: "streetwear-16", name: "Juno A.", specialty: "RARE COLORWAYS" },
  ],
  beauty: [
    { id: "beauty-1", name: "Emma R.", specialty: "BEAUTY ESSENTIALS" },
    { id: "beauty-2", name: "Sofia L.", specialty: "SKINCARE ROUTINES" },
    { id: "beauty-3", name: "Ari D.", specialty: "GLAM & COLOR" },
    { id: "beauty-4", name: "Jules B.", specialty: "CLEAN BEAUTY" },
    { id: "beauty-5", name: "Maya T.", specialty: "K-BEAUTY EDITS" },
    { id: "beauty-6", name: "Harper N.", specialty: "FRAGRANCE STORIES" },
    { id: "beauty-7", name: "Luna K.", specialty: "HAIR CARE LAB" },
    { id: "beauty-8", name: "Zara M.", specialty: "NAILS & ART" },
    { id: "beauty-9", name: "Ivy C.", specialty: "BODY & SPF" },
    { id: "beauty-10", name: "Nora S.", specialty: "MATURE SKIN" },
    { id: "beauty-11", name: "Theo P.", specialty: "GROOMING & BEARD" },
    { id: "beauty-12", name: "Rae H.", specialty: "TOOLS & DEVICES" },
    { id: "beauty-13", name: "Cleo J.", specialty: "MINI & TRAVEL" },
    { id: "beauty-14", name: "Drew W.", specialty: "SENSITIVE SKIN" },
    { id: "beauty-15", name: "Faye O.", specialty: "LUXE MAKEUP" },
    { id: "beauty-16", name: "Gia E.", specialty: "TUTORIAL LIVE" },
  ],
  collectibles: [
    { id: "collectibles-1", name: "Marcus W.", specialty: "CARDS & MEMORABILIA" },
    { id: "collectibles-2", name: "Rina O.", specialty: "VINYL & MEDIA" },
    { id: "collectibles-3", name: "Ben F.", specialty: "TOYS & FIGURES" },
    { id: "collectibles-4", name: "Ivy C.", specialty: "LIMITED RUNS" },
    { id: "collectibles-5", name: "Leo G.", specialty: "SPORTS GRADED" },
    { id: "collectibles-6", name: "Tara M.", specialty: "COMICS & ART" },
    { id: "collectibles-7", name: "Sam R.", specialty: "GAMING & TCG" },
    { id: "collectibles-8", name: "Wes L.", specialty: "VINTAGE TOYS" },
    { id: "collectibles-9", name: "Nia P.", specialty: "ANIME & MANGA" },
    { id: "collectibles-10", name: "Omar S.", specialty: "COINS & CURRENCY" },
    { id: "collectibles-11", name: "Jade T.", specialty: "DESIGNER TOYS" },
    { id: "collectibles-12", name: "Finn K.", specialty: "POSTERS & PRINTS" },
    { id: "collectibles-13", name: "Uma D.", specialty: "AUTOGRAPHED" },
    { id: "collectibles-14", name: "Reid B.", specialty: "MODEL KITS" },
    { id: "collectibles-15", name: "Piper H.", specialty: "CONVENTION PICKS" },
    { id: "collectibles-16", name: "Ezra N.", specialty: "SEALED VAULT" },
  ],
};

/** Curated "For you" rail — canonical host ids so follow state matches category tabs. */
export const FORYOU_HOST_IDS: readonly string[] = [
  "womens-1",
  "luxury-1",
  "streetwear-1",
  "beauty-1",
  "collectibles-1",
  "womens-5",
  "luxury-5",
  "streetwear-5",
  "beauty-5",
  "collectibles-5",
  "womens-9",
  "luxury-9",
  "streetwear-9",
  "beauty-9",
  "collectibles-9",
  "womens-13",
];

export function getHostById(id: string): LiveHost | undefined {
  for (const cat of CATEGORY_IDS_WITH_GRID) {
    const found = HOSTS_BY_CATEGORY[cat].find((h) => h.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getHostsForCategory(cat: LiveCategoryId): LiveHost[] {
  if (cat === "foryou") {
    return FORYOU_HOST_IDS.map((hid) => getHostById(hid)).filter((h): h is LiveHost => Boolean(h));
  }
  return HOSTS_BY_CATEGORY[cat];
}
