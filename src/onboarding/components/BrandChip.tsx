type BrandChipProps = {
  name: string;
  onRemove: () => void;
};

export function BrandChip({ name, onRemove }: BrandChipProps) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-posh-pink px-3 py-1.5 text-[12px] font-semibold text-white">
      {name}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-full px-0.5 text-white/90 hover:text-white"
        aria-label={`Remove ${name}`}
      >
        ×
      </button>
    </span>
  );
}
