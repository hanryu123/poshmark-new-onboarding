import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CATEGORY_CHIP_THEME,
  HOSTS_BY_CATEGORY,
  LIVE_CATEGORY_TABS,
  type LiveCategoryId,
  type LiveHost,
  getHostById,
  getHostsForCategory,
} from "./mockHosts";
import { MyFeed } from "../MyFeed";
import { DevNavBar, type DevNavItem } from "../DevNavBar";

const VIDEO_DURATION_MS = 15_000;

/** Gap after each tutorial step before showing the next (ms). */
const LIVE_TUTORIAL_STEP_GAP_MS = 1000;

export type LiveOnboardingScreen = "feed" | 1 | 2 | 3 | 4 | 5 | 6;

const LIVE_DEV_STEPS: DevNavItem[] = [
  { id: "feed", label: "Feed" },
  { id: 1, label: "Video" },
  { id: 2, label: "Host intro" },
  { id: 3, label: "Hosts" },
  { id: 4, label: "Push sheet" },
  { id: 5, label: "OS dialog" },
  { id: 6, label: "Live" },
];

const LIVE_TUTORIAL_COPY = [
  "Timer hits zero — item sells to the highest bidder",
  "Tap to bid. Use Custom Bid to offer less",
  "Free to enter. Just tap — you could win",
] as const;

function hostHandleFromName(name: string): string {
  const slug = name.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase() || "host";
  return `@${slug}`;
}

type UrlBootstrap = {
  screen: LiveOnboardingScreen;
};

function bootstrapFromUrl(): UrlBootstrap {
  if (typeof window === "undefined") {
    return { screen: "feed" };
  }
  const step = new URLSearchParams(window.location.search).get("step");
  if (step === "feed" || step === "0") {
    return { screen: "feed" };
  }
  const n = step ? Number(step) : NaN;
  if (n >= 1 && n <= 6 && Number.isInteger(n)) {
    return { screen: n as LiveOnboardingScreen };
  }
  return { screen: "feed" };
}

export function LiveOnboardingFlow() {
  const initialRef = useRef<UrlBootstrap | null>(null);
  if (initialRef.current === null) {
    initialRef.current = bootstrapFromUrl();
  }
  const initial = initialRef.current;

  const [screen, setScreen] = useState<LiveOnboardingScreen>(initial.screen);
  const [activeCategory, setActiveCategory] = useState<LiveCategoryId>("foryou");
  const [followed, setFollowed] = useState<Set<string>>(() => new Set());
  const [followOrder, setFollowOrder] = useState<string[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);
  /** 0–2 = show that tutorial; 3 = finished. */
  const [liveTutorialIndex, setLiveTutorialIndex] = useState(0);
  /** Hide current bubble during the 1s gap before the next step. */
  const [liveTutorialBetweenSteps, setLiveTutorialBetweenSteps] = useState(false);
  const liveTutorialTimeoutRef = useRef<number | null>(null);
  const liveTutorialIndexRef = useRef(0);

  const toggleFollow = useCallback((hostId: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(hostId)) {
        next.delete(hostId);
        setFollowOrder((o) => o.filter((id) => id !== hostId));
      } else {
        next.add(hostId);
        setFollowOrder((o) => (o.includes(hostId) ? o : [...o, hostId]));
      }
      return next;
    });
  }, []);

  const canContinueFromHosts = followed.size >= 1;

  const primaryHost: LiveHost = useMemo(() => {
    const firstId = followOrder[0];
    if (firstId) {
      const h = getHostById(firstId);
      if (h) return h;
    }
    return getHostsForCategory("foryou")[0] ?? HOSTS_BY_CATEGORY.womens[0];
  }, [followOrder]);

  useEffect(() => {
    if (screen !== 1) return;
    setVideoProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / VIDEO_DURATION_MS);
      setVideoProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setScreen(2);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [screen]);

  useEffect(() => {
    liveTutorialIndexRef.current = liveTutorialIndex;
  }, [liveTutorialIndex]);

  useEffect(() => {
    if (screen !== 6) return;
    liveTutorialIndexRef.current = 0;
    setLiveTutorialIndex(0);
    setLiveTutorialBetweenSteps(false);
    if (liveTutorialTimeoutRef.current) {
      window.clearTimeout(liveTutorialTimeoutRef.current);
      liveTutorialTimeoutRef.current = null;
    }
  }, [screen]);

  useEffect(() => {
    return () => {
      if (liveTutorialTimeoutRef.current) {
        window.clearTimeout(liveTutorialTimeoutRef.current);
        liveTutorialTimeoutRef.current = null;
      }
    };
  }, []);

  const advanceLiveTutorial = useCallback(() => {
    if (liveTutorialBetweenSteps) return;
    const idx = liveTutorialIndexRef.current;
    if (idx >= LIVE_TUTORIAL_COPY.length) return;
    setLiveTutorialBetweenSteps(true);
    if (liveTutorialTimeoutRef.current) window.clearTimeout(liveTutorialTimeoutRef.current);
    liveTutorialTimeoutRef.current = window.setTimeout(() => {
      const next = Math.min(idx + 1, LIVE_TUTORIAL_COPY.length);
      liveTutorialIndexRef.current = next;
      setLiveTutorialIndex(next);
      setLiveTutorialBetweenSteps(false);
      liveTutorialTimeoutRef.current = null;
    }, LIVE_TUTORIAL_STEP_GAP_MS);
  }, [liveTutorialBetweenSteps]);

  const goToScreen = (s: LiveOnboardingScreen) => {
    setScreen(s);
  };

  return (
    <div
      className="relative mx-auto flex min-h-[100dvh] w-full max-w-[420px] flex-col overflow-x-hidden bg-paper text-ink"
      style={{ paddingBottom: "var(--dev-nav-h, 0px)" }}
    >
      <AnimatePresence>
        {screen === "feed" && (
          <motion.section
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex min-h-0 flex-col bg-paper text-ink"
            aria-label="My feed"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 pt-3">
              <MyFeed brands={[]} liveEntry={{ onPress: () => goToScreen(1) }} />
            </div>
          </motion.section>
        )}

        {screen === 1 && (
          <motion.section
            key="s1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col bg-neutral-950 text-white"
            aria-label="Posh Live intro"
          >
            <div className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20">
              <button
                type="button"
                onClick={() => goToScreen(2)}
                className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm"
              >
                Skip
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <p className="text-center text-2xl font-semibold leading-snug tracking-tight">
                🎥 Posh Live
              </p>
              <p className="mt-4 text-center text-sm text-white/55">
                Placeholder—no video in this prototype
              </p>
            </div>
            <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
                  style={{ width: `${videoProgress * 100}%` }}
                />
              </div>
            </div>
          </motion.section>
        )}

        {screen === 2 && (
          <motion.section
            key="s2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col bg-neutral-950 px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-white"
            aria-label="Host matching intro"
          >
            <div className="flex flex-1 flex-col justify-center px-1">
              <h1 className="text-center font-display text-[1.85rem] font-bold leading-tight tracking-tight md:text-[2.05rem]">
                Want to meet
                <br />
                more hosts?
              </h1>
              <p className="mx-auto mt-5 max-w-[20rem] text-center text-[15px] leading-relaxed text-white/65">
                Follow sellers you like and get notified when they go live.
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToScreen(3)}
              className="w-full rounded-xl bg-white py-4 text-[15px] font-semibold text-neutral-950"
            >
              Browse hosts
            </button>
          </motion.section>
        )}

        {(screen === 3 || screen === 4) && (
          <motion.section
            key="hosts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden={screen === 4}
            className={`absolute inset-0 z-10 flex min-h-0 flex-col bg-paper transition-[filter] duration-200 ${
              screen === 4 ? "pointer-events-none brightness-[0.88]" : ""
            }`}
            aria-label="Hosts by category"
          >
            <div className="shrink-0 px-5 pt-[max(1rem,env(safe-area-inset-top))]">
              <div
                role="tablist"
                aria-label="Host categories"
                className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {LIVE_CATEGORY_TABS.map((tab) => {
                  const active = tab.id === activeCategory;
                  const chip = CATEGORY_CHIP_THEME[tab.id];
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`inline-flex min-h-[48px] shrink-0 cursor-pointer select-none items-center justify-center rounded-full px-5 py-3 text-[13px] font-semibold leading-tight tracking-tight shadow-sm transition-all duration-150 ease-out hover:shadow-md active:scale-[0.97] active:shadow-sm ${
                        active ? chip.active : chip.idle
                      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <h2 className="mt-5 text-[15px] font-bold text-ink">Popular hosts in this category</h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-80 pt-2">
              <div className="grid grid-cols-2 gap-4">
                {getHostsForCategory(activeCategory).map((host) => (
                  <HostCard
                    key={host.id}
                    host={host}
                    following={followed.has(host.id)}
                    onToggleFollow={() => toggleFollow(host.id)}
                  />
                ))}
              </div>
            </div>
            <div className="fixed bottom-[var(--dev-nav-h,0px)] left-1/2 z-20 w-full max-w-[420px] -translate-x-1/2 border-t border-line bg-paper px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <p className="mb-3 text-center text-[12px] text-muted">
                Follow at least one host to continue
              </p>
              <button
                type="button"
                disabled={!canContinueFromHosts || screen === 4}
                onClick={() => goToScreen(4)}
                className="w-full rounded-lg bg-ink py-4 text-[15px] font-semibold text-paper transition-opacity disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                Continue
              </button>
            </div>
          </motion.section>
        )}

        {screen === 4 && (
          <motion.div
            key="s4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="push-sheet-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col justify-end bg-black/40"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="rounded-t-3xl bg-paper px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8 shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                🔔
              </div>
              <p
                id="push-sheet-title"
                className="text-center text-[17px] font-semibold leading-snug text-ink"
              >
                We’ll let you know when a host you follow
                <br />
                goes live.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => goToScreen(5)}
                  className="w-full rounded-xl bg-ink py-4 text-[15px] font-semibold text-paper"
                >
                  Turn on notifications
                </button>
                <button
                  type="button"
                  onClick={() => goToScreen(6)}
                  className="w-full rounded-xl border border-line bg-transparent py-4 text-[15px] font-semibold text-ink"
                >
                  No thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 5 && (
          <motion.div
            key="s5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-push-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/35 px-8"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-[280px] overflow-hidden rounded-[14px] bg-[#f2f2f7] text-center shadow-2xl"
            >
              <div className="px-4 pb-3 pt-4">
                <p id="ios-push-title" className="text-[13px] leading-snug text-black">
                  &quot;Posh Live&quot; Would Like to Send You Notifications
                </p>
              </div>
              <div className="flex border-t border-[#c6c6c8]">
                <button
                  type="button"
                  onClick={() => goToScreen(6)}
                  className="flex-1 border-r border-[#c6c6c8] py-3 text-[17px] text-[#007aff]"
                >
                  Don&apos;t Allow
                </button>
                <button
                  type="button"
                  onClick={() => goToScreen(6)}
                  className="flex-1 py-3 text-[17px] font-semibold text-[#007aff]"
                >
                  Allow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 6 && (
          <motion.section
            key="s6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col overflow-visible bg-neutral-950 text-white"
            aria-label="Live show"
          >
            <div className="relative flex min-h-0 flex-1 flex-col overflow-visible">
              {/* Simulated full-bleed live video */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black"
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 70% 60%, rgba(233,30,99,0.08), transparent 40%)",
                }}
                aria-hidden
              />

              {/* Top host row */}
              <header className="relative z-10 flex items-center justify-between px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
                <span className="text-[15px] font-semibold tracking-tight">
                  {hostHandleFromName(primaryHost.name)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    Live
                  </span>
                  <span className="text-xs tabular-nums text-white/55">12.4k</span>
                </div>
              </header>

              {/* Giveaway banner */}
              <div className="relative z-10 mx-3 mt-3 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                    🎁
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">
                      Giveaway
                    </p>
                    <p className="truncate text-[15px] font-bold leading-tight">Bagfather Bucks</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-white/55">
                      Enter for a chance to win closet credit.
                    </p>
                  </div>
                </div>
                <div className="relative mt-3 flex justify-center">
                  <button
                    type="button"
                    className="w-full max-w-[220px] rounded-xl bg-[#007aff] py-2.5 text-[14px] font-semibold text-white shadow-md active:scale-[0.99]"
                  >
                    Enter Giveaway
                  </button>
                </div>
              </div>

              {/* Left chat rail */}
              <div className="pointer-events-none absolute bottom-36 left-0 z-10 w-[58%] max-w-[240px] space-y-1.5 px-3 text-[11px] leading-snug text-white/90 drop-shadow-md">
                <p>
                  <span className="font-semibold text-posh-pink">citygirlthrifts</span>
                  <span className="text-white/70">: I&apos;m open, love quiet luxury…</span>
                </p>
                <p>
                  <span className="font-semibold text-posh-pink">closet_fan</span>
                  <span className="text-white/70">: That clutch 😍</span>
                </p>
                <p>
                  <span className="font-semibold text-posh-pink">user_928</span>
                  <span className="text-white/70">: joined the show</span>
                </p>
              </div>

              {/* Right reaction rail */}
              <div className="absolute bottom-40 right-2 z-10 flex flex-col items-center gap-4 rounded-full bg-black/35 px-2 py-3 backdrop-blur-sm">
                <span className="text-xl" aria-hidden>
                  ❤️
                </span>
                <span className="text-lg text-white/90" aria-hidden>
                  ↗
                </span>
                <span className="text-lg text-white/90" aria-hidden>
                  🔊
                </span>
                <div className="relative flex flex-col items-center">
                  <span className="text-lg" aria-hidden>
                    🛍️
                  </span>
                  <span className="absolute -bottom-3 text-[9px] font-bold tabular-nums text-white/80">
                    69
                  </span>
                </div>
              </div>

              <div className="min-h-0 flex-1" aria-hidden />

              {/* Bottom product dock + bid row */}
              <div className="relative z-10 mt-auto px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <div className="rounded-t-2xl border border-white/10 border-b-0 bg-black/75 px-4 py-3 backdrop-blur-md">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                        Current item
                      </p>
                      <p className="truncate text-[15px] font-bold leading-tight">LV MONOGRAM CLUTCH</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-amber-300">
                      <span className="text-base" aria-hidden>
                        ⏱
                      </span>
                      <span className="text-[15px] font-semibold tabular-nums">00:28</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-stretch gap-2 rounded-b-2xl border border-t-0 border-white/10 bg-black/80 px-3 py-3 backdrop-blur-md">
                  <button
                    type="button"
                    className="flex shrink-0 items-center px-2 text-[13px] font-semibold text-[#007aff]"
                  >
                    Custom Bid
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="w-full rounded-xl bg-[#007aff] py-3.5 text-[15px] font-bold text-white shadow-md active:scale-[0.99]"
                    >
                      Bid $450 &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>

              {/* Tutorial: semi-transparent layer + bubble (avoids clipping) */}
              {liveTutorialIndex < LIVE_TUTORIAL_COPY.length && (
                <div
                  className="pointer-events-auto absolute inset-0 z-[80] flex flex-col bg-black/60 backdrop-blur-[1px]"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Live tutorial"
                >
                  <div className="flex min-h-0 flex-1 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]">
                    {!liveTutorialBetweenSteps && liveTutorialIndex === 0 && (
                      <div className="mt-auto flex w-full justify-end pb-[8.25rem]">
                        <div className="w-full max-w-[min(19rem,calc(100%-0.5rem))]">
                          <LiveTutorialCard
                            text={LIVE_TUTORIAL_COPY[0]}
                            onNext={advanceLiveTutorial}
                          />
                        </div>
                      </div>
                    )}
                    {!liveTutorialBetweenSteps && liveTutorialIndex === 1 && (
                      <div className="mt-auto w-full pb-[5.5rem]">
                        <div className="mx-auto w-full max-w-[min(19rem,calc(100%-0.5rem))]">
                          <LiveTutorialCard
                            text={LIVE_TUTORIAL_COPY[1]}
                            onNext={advanceLiveTutorial}
                          />
                        </div>
                      </div>
                    )}
                    {!liveTutorialBetweenSteps && liveTutorialIndex === 2 && (
                      <div className="w-full pt-[min(30svh,10.5rem)]">
                        <div className="mx-auto w-full max-w-[min(19rem,calc(100%-0.5rem))]">
                          <LiveTutorialCard
                            text={LIVE_TUTORIAL_COPY[2]}
                            onNext={advanceLiveTutorial}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <DevNavBar
        steps={LIVE_DEV_STEPS}
        currentId={screen}
        onJump={(s) => goToScreen(s as LiveOnboardingScreen)}
      />
    </div>
  );
}

function HostCard(props: {
  host: LiveHost;
  following: boolean;
  onToggleFollow: () => void;
}) {
  const { host, following, onToggleFollow } = props;
  return (
    <article className="flex flex-col items-center rounded-2xl border border-line bg-paper p-4">
      <div
        className="h-[88px] w-[88px] shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 ring-1 ring-black/5"
        aria-hidden
      />
      <p className="mt-3 w-full truncate text-center text-[14px] font-bold text-ink">{host.name}</p>
      <p className="mt-1 w-full truncate text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
        {host.specialty}
      </p>
      <button
        type="button"
        onClick={onToggleFollow}
        className={`mt-3 w-full rounded-lg py-2.5 text-[12px] font-semibold transition-colors ${
          following
            ? "border border-line bg-paper text-ink"
            : "bg-ink text-paper"
        }`}
      >
        {following ? "Following ✓" : "Follow"}
      </button>
    </article>
  );
}

function LiveTutorialCard(props: { text: string; onNext: () => void }) {
  const { text, onNext } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-2xl bg-white px-4 py-3.5 text-[13px] font-medium leading-snug text-neutral-900 shadow-bubble">
        <p className="break-words">{text}</p>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="min-h-[44px] min-w-[44px] px-2 text-[15px] font-semibold text-[#007aff]"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
