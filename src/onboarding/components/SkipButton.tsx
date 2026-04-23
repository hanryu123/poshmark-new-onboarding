type SkipButtonProps = { onClick: () => void };

export function SkipButton({ onClick }: SkipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-muted hover:text-ink"
    >
      Skip
    </button>
  );
}
