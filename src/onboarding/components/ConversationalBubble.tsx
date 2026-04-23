import { motion } from "framer-motion";

type ConversationalBubbleProps = {
  children: React.ReactNode;
  subtle?: string;
};

export function ConversationalBubble({ children, subtle }: ConversationalBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-line bg-neutral-50 px-4 py-3.5 shadow-sm"
    >
      <p className="font-display text-[1.15rem] font-semibold leading-snug text-ink">{children}</p>
      {subtle ? <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{subtle}</p> : null}
    </motion.div>
  );
}
