import { motion } from "framer-motion";
import type { SelectedListing } from "../types/onboarding.types";

type ListingCardProps = {
  listing: SelectedListing;
  checked: boolean;
  onToggle: () => void;
  stagger?: number;
};

export function ListingCard({ listing, checked, onToggle, stagger = 0 }: ListingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stagger, duration: 0.25, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border bg-paper transition-colors ${
        checked ? "border-posh-pink ring-1 ring-posh-pink/30" : "border-line"
      }`}
    >
      <button type="button" onClick={onToggle} className="block w-full text-left">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={listing.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/95 shadow"
            aria-hidden
          >
            <motion.span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                checked
                  ? "border-posh-pink bg-posh-pink text-white"
                  : "border-neutral-300 bg-white text-transparent"
              }`}
              initial={false}
              animate={{ scale: checked ? 1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className={checked ? "opacity-100" : "opacity-0"}>✓</span>
            </motion.span>
          </span>
        </div>
        <div className="px-2.5 py-2">
          <p className="truncate text-[11px] font-medium text-muted">{listing.brand}</p>
          <p className="truncate text-[13px] font-medium text-ink">{listing.title}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-[14px] font-semibold tabular-nums text-ink">
              ${listing.price}
            </span>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-ink">
              {listing.size}
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
