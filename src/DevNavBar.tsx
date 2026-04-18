import { useEffect } from "react";

export type DevStep =
  | 1
  | 2
  | 3
  | "loader"
  | "value-prop"
  | "guide"
  | "feed";

const STEPS: { id: DevStep; n: number; label: string }[] = [
  { id: 1, n: 1, label: "Identity" },
  { id: 2, n: 2, label: "Search" },
  { id: 3, n: 3, label: "Brands" },
  { id: "loader", n: 4, label: "Loader" },
  { id: "value-prop", n: 5, label: "Value Prop" },
  { id: "guide", n: 6, label: "Setup" },
  { id: "feed", n: 7, label: "Feed" },
];

const NAV_HEIGHT_PX = 40;

export type DevNavBarProps = {
  current: DevStep;
  onJump: (step: DevStep) => void;
};

/**
 * Prototype-only floating nav. Lets stakeholders jump between funnel
 * stages without having to walk the whole flow each time. Publishes its
 * height as `--dev-nav-h` so step containers can shift their fixed CTAs
 * out from under it.
 */
export function DevNavBar({ current, onJump }: DevNavBarProps) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue("--dev-nav-h");
    root.style.setProperty("--dev-nav-h", `${NAV_HEIGHT_PX}px`);
    return () => {
      if (prev) root.style.setProperty("--dev-nav-h", prev);
      else root.style.removeProperty("--dev-nav-h");
    };
  }, []);

  return (
    <nav
      aria-label="Prototype dev navigation"
      className="fixed inset-x-0 bottom-0 z-[200] flex items-center justify-center px-2 py-1.5 backdrop-blur-md"
      style={{
        height: NAV_HEIGHT_PX,
        background: "rgba(20, 20, 20, 0.78)",
        boxShadow: "0 -1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex w-full max-w-[420px] items-center gap-1 overflow-x-auto">
        <span className="shrink-0 select-none pr-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
          DEV
        </span>
        {STEPS.map((s) => {
          const active = s.id === current;
          return (
            <button
              key={String(s.id)}
              type="button"
              onClick={() => onJump(s.id)}
              aria-current={active ? "step" : undefined}
              title={`Step ${s.n} · ${s.label}`}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-colors ${
                active
                  ? "bg-white text-neutral-900"
                  : "bg-white/8 text-white/80 hover:bg-white/15"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold tabular-nums ${
                  active ? "bg-neutral-900 text-white" : "bg-white/15 text-white"
                }`}
              >
                {s.n}
              </span>
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
