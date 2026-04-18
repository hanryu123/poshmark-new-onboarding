import { motion } from "framer-motion";

export type MyFeedProps = {
  brands: string[];
};

const FEED_ITEMS: { title: string; brand: string; price: string; old?: string; tone: string }[] = [
  { title: "Floral Midi Dress", brand: "Reformation", price: "$48", old: "$198", tone: "#F8BBD0" },
  { title: "Quilted Shoulder Bag", brand: "Coach", price: "$92", old: "$295", tone: "#E1BEE7" },
  { title: "Cropped Denim Jacket", brand: "Levi's", price: "$34", old: "$98", tone: "#BBDEFB" },
  { title: "Classic White Sneakers", brand: "Veja", price: "$58", old: "$150", tone: "#C8E6C9" },
  { title: "Knit Cardigan", brand: "Madewell", price: "$28", old: "$88", tone: "#FFE0B2" },
  { title: "Pleated Mini Skirt", brand: "& Other Stories", price: "$22", old: "$79", tone: "#FFCCBC" },
];

export function MyFeed({ brands }: MyFeedProps) {
  return (
    <motion.section
      key="my-feed"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col"
      aria-label="My feed"
    >
      <header className="flex items-center justify-between pt-1">
        <span className="font-display text-[22px] font-semibold tracking-tight text-ink">
          My Feed
        </span>
        <div className="flex items-center gap-3 text-ink">
          <IconBtn label="Search">🔍</IconBtn>
          <IconBtn label="Bag">🛍️</IconBtn>
        </div>
      </header>

      <p className="mt-1 text-[13px] text-muted">
        Curated for you{brands.length ? ` · ${brands.slice(0, 3).join(" · ")}` : ""}
      </p>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(brands.length ? brands : ["For You", "New", "Trending", "Under $30"]).map((b) => (
          <span
            key={b}
            className="whitespace-nowrap rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink"
          >
            {b}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-6">
        {FEED_ITEMS.map((it, i) => (
          <motion.article
            key={it.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-line bg-paper"
          >
            <div
              className="aspect-[3/4] w-full"
              style={{
                background: `linear-gradient(135deg, ${it.tone} 0%, #ffffff 100%)`,
              }}
            />
            <div className="px-2.5 py-2">
              <p className="truncate text-[12px] text-muted">{it.brand}</p>
              <p className="truncate text-[13px] font-medium text-ink">{it.title}</p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[14px] font-semibold text-ink tabular-nums">
                  {it.price}
                </span>
                {it.old ? (
                  <span className="text-[11px] text-muted line-through tabular-nums">
                    {it.old}
                  </span>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-[14px]"
    >
      {children}
    </button>
  );
}
