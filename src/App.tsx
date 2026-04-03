import { useMemo, useState } from "react";
import { BrandStep } from "./BrandStep";

const DEPARTMENTS = [
  "Men's apparel",
  "Women's apparel",
  "Men's shoes",
  "Women's shoes",
  "Luxury",
  "Beauty",
  "Kids",
  "Home",
];

const AGE_OPTIONS = [
  "10-19",
  "20-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45-54",
  "55-64",
  "65+",
  "Over 60's",
];

type Screen = 1 | 2 | 3;

export default function App() {
  const [screen, setScreen] = useState<Screen>(1);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [deptSearch, setDeptSearch] = useState("");

  const filteredDepts = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return DEPARTMENTS;
    return DEPARTMENTS.filter((d) => d.toLowerCase().includes(q));
  }, [deptSearch]);

  const canContinue1 = Boolean(gender && age);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[420px] flex-col bg-paper px-5 pb-8 pt-3 text-ink">
      {screen === 1 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 1">
          <Header
            step={1}
            onBack={undefined}
            backDisabled
            onSkip={() => {
              if (
                window.confirm(
                  "Skip identity questions? You can add these later in your profile."
                )
              )
                setScreen(2);
            }}
          />

          <h1 className="mt-6 font-display text-[1.65rem] font-bold leading-tight tracking-tight text-ink md:text-[1.85rem]">
            Let&apos;s personalize your feed.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Tell us a bit about you — we&apos;ll tailor what you see first.
          </p>

          <p className="mb-3 mt-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Gender
          </p>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Gender">
            {[
              ["man", "Man"],
              ["woman", "Woman"],
              ["other", "Other"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={gender === value}
                onClick={() => setGender(value)}
                className={`rounded-xl border py-3.5 text-center text-sm font-medium transition-colors ${
                  gender === value
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-neutral-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Age range
          </p>
          <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Age range">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={age === opt}
                onClick={() => setAge(opt)}
                className={`rounded-xl border py-3 text-center text-xs font-medium transition-colors ${
                  age === opt
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-neutral-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex-1" />
          <button
            type="button"
            disabled={!canContinue1}
            onClick={() => setScreen(2)}
            className="mt-10 w-full rounded-lg bg-ink py-4 text-[15px] font-semibold text-paper transition-opacity disabled:opacity-30"
          >
            Continue
          </button>
        </section>
      )}

      {screen === 2 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 2">
          <Header
            step={2}
            onBack={() => setScreen(1)}
            onSkip={() => {
              if (window.confirm("Skip this step? You can still pick brands next."))
                setScreen(3);
            }}
          />

          <h1 className="mt-6 font-display text-[1.65rem] font-bold leading-snug tracking-tight text-ink md:text-[1.85rem]">
            What brings you to Poshmark?
          </h1>

          <div className="relative mt-8">
            <svg
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>
            <input
              type="search"
              placeholder="Looking for a specific item?"
              autoComplete="off"
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-2.5 pl-8 pr-2 text-[15px] text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-0"
            />
          </div>

          <p className="mb-3 mt-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Departments
          </p>
          <ul className="divide-y divide-line border-t border-line" role="list">
            {filteredDepts.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setDepartment(name)}
                  className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-ink transition-colors hover:bg-neutral-50"
                >
                  <span>{name}</span>
                  <span className="text-neutral-300" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setScreen(3)}
            className="mt-10 w-full rounded-lg bg-ink py-4 text-[15px] font-semibold text-paper"
          >
            Continue
          </button>
        </section>
      )}

      {screen === 3 && (
        <section className="flex min-h-0 flex-1 flex-col" aria-label="Step 3">
          <Header
            step={3}
            onBack={() => setScreen(2)}
            onSkip={() => {
              if (window.confirm("Skip brand picks? You can add these later in settings.")) {
                window.alert("Skipped — onboarding finished.");
              }
            }}
          />

          <BrandStep
            min={3}
            max={10}
            onFinish={(brands) =>
              window.alert(
                "Done — " +
                  JSON.stringify({ gender, age, department, brands }, null, 2)
              )
            }
          />
        </section>
      )}
    </div>
  );
}

function Header(props: {
  step: 1 | 2 | 3;
  onBack?: () => void;
  backDisabled?: boolean;
  onSkip: () => void;
}) {
  const { step, onBack, backDisabled, onSkip } = props;
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          disabled={backDisabled}
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] py-2 text-left text-2xl leading-none text-ink disabled:opacity-25"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] font-semibold uppercase tracking-wide text-muted"
        >
          Skip
        </button>
      </div>
      <div
        className="flex h-1 gap-1.5"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Step ${step} of 3`}
      >
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-full flex-1 rounded-sm ${i <= step ? "bg-ink" : "bg-line"}`}
          />
        ))}
      </div>
    </header>
  );
}
