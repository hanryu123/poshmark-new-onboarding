import type { Department, SelectedListing } from "./types/onboarding.types";

const MOCK_POOL: SelectedListing[] = [
  {
    id: "m1",
    title: "Floral Midi Dress",
    brand: "Reformation",
    price: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    size: "M",
    department: "Women's Apparel",
  },
  {
    id: "m2",
    title: "Quilted Shoulder Bag",
    brand: "Coach",
    price: 92,
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    size: "OS",
    department: "Luxury",
  },
  {
    id: "m3",
    title: "Cropped Denim Jacket",
    brand: "Levi's",
    price: 34,
    imageUrl:
      "https://images.unsplash.com/photo-1523381210430-271e8be1f52b?auto=format&fit=crop&w=400&q=80",
    size: "L",
    department: "Men's Apparel",
  },
  {
    id: "m4",
    title: "Classic White Sneakers",
    brand: "Veja",
    price: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    size: "9",
    department: "Women's Shoes",
  },
  {
    id: "m5",
    title: "Knit Cardigan",
    brand: "Madewell",
    price: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80",
    size: "S",
    department: "Women's Apparel",
  },
  {
    id: "m6",
    title: "Pleated Mini Skirt",
    brand: "& Other Stories",
    price: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
    size: "4",
    department: "Women's Apparel",
  },
  {
    id: "m7",
    title: "Running Shorts",
    brand: "Nike",
    price: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=400&q=80",
    size: "M",
    department: "Men's Apparel",
  },
  {
    id: "m8",
    title: "Serum Duo",
    brand: "The Ordinary",
    price: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
    size: "OS",
    department: "Beauty",
  },
  {
    id: "m9",
    title: "Linen Midi — Beach Wedding Guest",
    brand: "Reformation",
    price: 78,
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
    size: "S",
    department: "Women's Apparel",
  },
  {
    id: "m10",
    title: "Straw Clutch & Sandals Set",
    brand: "Anthropologie",
    price: 44,
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
    size: "8",
    department: "Women's Shoes",
  },
  {
    id: "m11",
    title: "Tailored Blazer — Office",
    brand: "J.Crew",
    price: 56,
    imageUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=400&q=80",
    size: "6",
    department: "Women's Apparel",
  },
  {
    id: "m12",
    title: "Silk Slip Dress — Date Night",
    brand: "Reformation",
    price: 62,
    imageUrl:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80",
    size: "M",
    department: "Women's Apparel",
  },
];

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

function scoreListing(needles: string[], l: SelectedListing): number {
  const hay = `${l.title} ${l.brand} ${l.department}`.toLowerCase();
  let score = 0;
  for (const n of needles) {
    if (!n) continue;
    if (hay.includes(n)) score += 3;
    for (const w of tokens(l.title)) {
      if (w.startsWith(n) || n.startsWith(w)) score += 1;
    }
  }
  return score;
}

export function mockSearchListings(q: string): SelectedListing[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return MOCK_POOL.slice(0, 4);
  const needles = tokens(needle);
  const direct = MOCK_POOL.filter(
    (l) =>
      l.title.toLowerCase().includes(needle) ||
      l.brand.toLowerCase().includes(needle) ||
      l.department.toLowerCase().includes(needle)
  );
  if (direct.length > 0) return direct.slice(0, 8);

  const scored = [...MOCK_POOL]
    .map((l) => ({ l, s: scoreListing(needles, l) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (scored.length > 0) return scored.slice(0, 8).map((x) => x.l);

  const occasionHints: [RegExp, string[]][] = [
    [/beach|swim|resort|vacation/i, ["linen", "straw", "midi", "sand", "summer"]],
    [/wedding|bridal|gala/i, ["lace", "heel", "midi", "dress", "clutch"]],
    [/office|work|meeting|9\s*to\s*5/i, ["blazer", "tailor", "levi", "shirt", "pencil"]],
    [/date|night\s*out|dinner/i, ["silk", "slip", "heel", "dress", "midi"]],
    [/gym|run|yoga|train/i, ["nike", "short", "run", "lulu", "athleta"]],
  ];
  for (const [re, keys] of occasionHints) {
    if (re.test(needle)) {
      const hits = MOCK_POOL.filter((l) =>
        keys.some((k) => l.title.toLowerCase().includes(k) || l.brand.toLowerCase().includes(k))
      );
      if (hits.length) return hits.slice(0, 8);
    }
  }

  return MOCK_POOL.slice(0, 6);
}

/** Similar picks when a department is selected — discovery-led. */
export function similarListingsForDepartment(d: Department, limit = 6): SelectedListing[] {
  const direct = MOCK_POOL.filter((l) => l.department === d);
  const related = MOCK_POOL.filter((l) => l.department !== d);
  const merged = [...direct, ...related];
  const seen = new Set<string>();
  const out: SelectedListing[] = [];
  for (const l of merged) {
    if (seen.has(l.id)) continue;
    seen.add(l.id);
    out.push(l);
    if (out.length >= limit) break;
  }
  return out;
}

export function mockFeedPreviewThumbs(): { id: string; imageUrl: string }[] {
  return MOCK_POOL.concat(MOCK_POOL).slice(0, 16).map((l, i) => ({
    id: `${l.id}-p-${i}`,
    imageUrl: l.imageUrl,
  }));
}
