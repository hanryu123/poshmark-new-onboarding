type SizeSelectorProps = {
  sizes: string[];
  value: string | undefined;
  onChange: (size: string) => void;
};

export function SizeSelector({ sizes, value, onChange }: SizeSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
            value === s
              ? "border-posh-pink bg-posh-pink text-white"
              : "border-line bg-paper text-ink hover:border-neutral-300"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
