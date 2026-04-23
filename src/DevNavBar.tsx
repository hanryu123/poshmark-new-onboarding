import { useEffect } from "react";

const NAV_HEIGHT_PX = 40;

export type DevNavItem = { id: string | number; label: string };

export type DevNavBarProps = {
  steps: DevNavItem[];
  currentId: string | number;
  onJump: (id: string | number) => void;
};

function sameId(a: string | number, b: string | number): boolean {
  return String(a) === String(b);
}

/**
 * Prototype-only floating nav. Lets stakeholders jump between funnel
 * stages without walking the whole flow. Publishes `--dev-nav-h` so fixed
 * CTAs clear the bar.
 */
export function DevNavBar({ steps, currentId, onJump }: DevNavBarProps) {
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
        {steps.map((s, idx) => {
          const active = sameId(s.id, currentId);
          return (
            <button
              key={`${String(s.id)}-${idx}`}
              type="button"
              onClick={() => onJump(s.id)}
              aria-current={active ? "step" : undefined}
              title={s.label}
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
                {idx + 1}
              </span>
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
