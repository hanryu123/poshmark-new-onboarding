import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postOnboardingComplete } from "../api/postOnboardingComplete";
import { useOnboarding } from "../OnboardingContext";

type Phase = "form" | "softPush" | "iosMock";

export function Step6_Signup() {
  const { state, patch, goNext } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("form");

  const finishSignup = async () => {
    setBusy(true);
    await postOnboardingComplete(state);
    setBusy(false);
    setPhase("softPush");
  };

  const submit = async () => {
    setErr(null);
    const em = email.trim();
    if (!em.includes("@")) {
      setErr("Enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const { ok } = await postOnboardingComplete(state);
    setBusy(false);
    if (!ok) setErr("Could not reach server. Continuing in prototype mode.");
    setPhase("softPush");
  };

  const social = async () => {
    await finishSignup();
  };

  const skipPush = () => {
    patch({ pushNotificationsOptIn: false });
    goNext();
  };

  const openIosMock = () => setPhase("iosMock");

  const iosAllow = async () => {
    let granted = false;
    try {
      if (typeof Notification !== "undefined" && Notification.requestPermission) {
        const r = await Notification.requestPermission();
        granted = r === "granted";
      }
    } catch {
      granted = false;
    }
    patch({ pushNotificationsOptIn: granted });
    goNext();
  };

  const iosDeny = () => {
    patch({ pushNotificationsOptIn: false });
    goNext();
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-neutral-100 px-4 pb-28 pt-2 dark:bg-neutral-950">
      <motion.div
        layout
        className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[1.35rem] border border-neutral-200/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="px-5 pb-6 pt-7">
          <p className="text-center font-display text-[1.15rem] font-semibold leading-snug text-ink dark:text-neutral-50">
            Recommended items are ready for you. Sign up and take a look!
          </p>

          <AnimatePresence mode="wait">
            {phase === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-6"
              >
                <motion.button
                  type="button"
                  disabled={busy}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void social()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <span aria-hidden className="text-lg normal-case">
                    
                  </span>
                  Continue with Apple
                </motion.button>
                <motion.button
                  type="button"
                  disabled={busy}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void social()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <span className="text-[13px] font-bold normal-case text-blue-600">G</span>
                  Continue with Google
                </motion.button>

                <div className="relative my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">or</span>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                </div>

                <label className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-500"
                  />
                </label>
                <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Password
                  <div className="relative mt-1.5">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-14 text-[15px] outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-muted"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                {err ? <p className="mt-3 text-[13px] text-red-600 dark:text-red-400">{err}</p> : null}

                <motion.button
                  type="button"
                  disabled={busy}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void submit()}
                  className="mt-6 w-full rounded-2xl bg-neutral-950 py-4 text-[15px] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-neutral-950"
                >
                  {busy ? "Saving…" : "Create account"}
                </motion.button>

                <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.div>
            )}

            {phase === "softPush" && (
              <motion.div
                key="soft"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <p className="text-center text-[15px] font-medium leading-relaxed text-ink dark:text-neutral-100">
                  수많은 아이템이 준비되어 있습니다.
                  <br />
                  당신과 어울리는 상품이 있으면 추천을 받겠니?
                </p>
                <p className="mt-2 text-center text-[12px] text-muted">
                  Millions of listings — we’ll ping you when something matches your taste.
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={openIosMock}
                  className="mt-8 w-full rounded-2xl bg-posh-burgundy py-4 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md"
                >
                  Yes, recommend me
                </motion.button>
                <button
                  type="button"
                  onClick={skipPush}
                  className="mt-3 w-full py-3 text-[14px] font-semibold uppercase tracking-wide text-muted"
                >
                  Not now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {phase === "iosMock" && (
          <motion.div
            key="ios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 backdrop-blur-[2px]"
            role="presentation"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-[340px] overflow-hidden rounded-[14px] bg-[#e8e8ed]/95 text-center shadow-2xl dark:bg-[#2c2c2e]"
            >
              <div className="border-b border-black/10 px-4 py-4 dark:border-white/10">
                <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  &quot;Poshmark&quot; Would Like to Send You Notifications
                </p>
                <p className="mt-2 text-[13px] leading-snug text-neutral-800 dark:text-neutral-200">
                  Alerts may include sounds and icon badges. You can change this later in Settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void iosAllow()}
                className="w-full border-b border-black/10 py-3.5 text-[17px] font-semibold uppercase tracking-wide text-blue-600 dark:border-white/10 dark:text-blue-400"
              >
                Allow
              </button>
              <button
                type="button"
                onClick={iosDeny}
                className="w-full py-3.5 text-[17px] font-semibold uppercase tracking-wide text-neutral-800 dark:text-neutral-200"
              >
                Don&apos;t Allow
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
