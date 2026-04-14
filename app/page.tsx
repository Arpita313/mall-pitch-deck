"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import PersonaSection from "./components/PersonaSection";

const gold = "#c9a962";
const goldMuted = "rgba(201, 169, 98, 0.85)";
type PersonaId = "retailer" | "sponsor" | "eventPromoter";

/** Premium ease — matches Apple-style motion curves */
const easeLux = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: easeLux },
};

const personaOptions: { id: PersonaId; label: string }[] = [
  { id: "retailer", label: "Retailer" },
  { id: "sponsor", label: "Sponsor" },
  { id: "eventPromoter", label: "Event Promoter" },
];

const scaleStatsByPersona: Record<
  PersonaId,
  { headline: string; detail: string }[]
> = {
  retailer: [
    {
      headline: "Foot Traffic",
      detail:
        "Destination-level visits with extended dwell—built for flagship discovery and repeat trips.",
    },
    {
      headline: "Luxury Density",
      detail:
        "Curated luxury adjacency and high-visibility inline—your brand sits where intent concentrates.",
    },
  ],
  sponsor: [
    {
      headline: "Audience Reach",
      detail:
        "450M+ digital impressions annually—pair marquee moments with measurable brand lift.",
    },
    {
      headline: "Activation Canvas",
      detail:
        "Naming, on-site integrations, and owned media packages engineered for exclusivity.",
    },
  ],
  eventPromoter: [
    {
      headline: "Venue Capacity",
      detail:
        "10k+ attendees with flexible layouts—scale attendance without compromising production flow.",
    },
    {
      headline: "Tech Specs",
      detail:
        "4K broadcast-ready infrastructure, load-in lanes, and venue teams who speak show language.",
    },
  ],
};

type PersonaToggleProps = {
  persona: PersonaId;
  onPersonaChange: (id: PersonaId) => void;
};

function PersonaToggle({ persona, onPersonaChange }: PersonaToggleProps) {
  return (
    <section
      aria-label="Audience persona"
      className="sticky top-16 z-40 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl md:top-[4.5rem]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3.5 md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
        <p
          className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-white/45 md:text-[0.65rem]"
          style={{ color: goldMuted }}
        >
          Persona view
        </p>
        <div
          className="relative flex rounded-full border border-white/[0.08] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          role="tablist"
          aria-label="Choose partner persona"
        >
          {personaOptions.map((opt) => {
            const isActive = persona === opt.id;
            return (
              <motion.button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onPersonaChange(opt.id)}
                className="relative min-h-10 flex-1 rounded-full px-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 md:min-h-11 md:px-5 md:text-[0.72rem]"
                style={{ color: isActive ? "#050505" : "rgba(255,255,255,0.55)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: easeLux }}
              >
                {isActive ? (
                  <motion.span
                    layoutId="persona-pill"
                    className="pointer-events-none absolute inset-0 rounded-full bg-[#c9a962] shadow-[0_0_24px_rgba(201,169,98,0.35)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeLux }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050505]/75 backdrop-blur-xl"
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[4.5rem] md:px-8"
        aria-label="Primary"
      >
        <a
          href="#"
          className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white md:text-xs"
        >
          American Dream
        </a>
        <ul className="flex items-center gap-8 text-sm text-white/70">
          <li>
            <a
              href="#why-american-dream"
              className="transition-colors hover:text-white"
            >
              Why American Dream
            </a>
          </li>
          <li>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}

const numberGlowClass =
  "[text-shadow:0_0_20px_rgba(201,169,98,0.55),0_0_48px_rgba(201,169,98,0.28),0_0_80px_rgba(201,169,98,0.12)]";

type StatTickerConfig = {
  end: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
};

function StatTicker({
  config,
  active,
  index,
}: {
  config: StatTickerConfig;
  active: boolean;
  index: number;
}) {
  const mv = useMotionValue(0);
  const [text, setText] = useState(() =>
    config.decimals > 0
      ? `${config.prefix}${(0).toFixed(config.decimals)}${config.suffix}`
      : `${config.prefix}0${config.suffix}`,
  );

  useMotionValueEvent(mv, "change", (latest) => {
    const n =
      config.decimals > 0
        ? latest.toFixed(config.decimals)
        : Math.round(latest).toString();
    setText(`${config.prefix}${n}${config.suffix}`);
  });

  useEffect(() => {
    if (!active) return;
    mv.set(0);
    const controls = animate(mv, config.end, {
      duration: 2.15,
      delay: 0.08 * index,
      ease: easeLux,
    });
    return () => controls.stop();
  }, [active, config.end, config.decimals, index, mv]);

  return (
    <div className="text-center md:text-left">
      <p
        className={`font-medium tracking-[-0.03em] text-[clamp(2rem,5vw,3.25rem)] leading-none tabular-nums ${numberGlowClass}`}
        style={{ color: gold }}
        aria-live="polite"
      >
        {text}
      </p>
      <p className="mt-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/45 md:text-xs">
        {config.label}
      </p>
    </div>
  );
}

const byTheNumbersStats: StatTickerConfig[] = [
  {
    end: 40,
    decimals: 0,
    prefix: "",
    suffix: "M+",
    label: "Annual Visitors",
  },
  {
    end: 3.8,
    decimals: 1,
    prefix: "$",
    suffix: "B",
    label: "Economic Impact",
  },
  {
    end: 450,
    decimals: 0,
    prefix: "",
    suffix: "+",
    label: "Global Brand Partners",
  },
  {
    end: 15,
    decimals: 0,
    prefix: "",
    suffix: " Min",
    label: "Distance from Manhattan",
  },
];

function ByTheNumbers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="by-the-numbers"
      aria-labelledby="by-the-numbers-heading"
      className="relative border-t border-white/[0.06] bg-gradient-to-b from-[#060606] via-[#050505] to-[#050505] px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp} className="mb-14 md:mb-16">
          <p
            className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.4em] md:text-xs"
            style={{ color: gold }}
          >
            Proof at scale
          </p>
          <h2
            id="by-the-numbers-heading"
            className="max-w-2xl text-3xl font-medium tracking-[-0.02em] text-white md:text-4xl"
          >
            By The Numbers
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8 lg:gap-12">
          {byTheNumbersStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.75,
                delay: 0.06 * i,
                ease: easeLux,
              }}
            >
              <StatTicker config={stat} active={inView} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroTextShadow = "0 2px 10px rgba(0,0,0,0.8)";

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 bg-[#050505]"
        aria-hidden
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          poster="/fallback-image.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-film-overlay pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLux }}
          className="max-w-4xl rounded-2xl bg-black/20 px-6 py-7 shadow-[0_14px_50px_rgba(0,0,0,0.35)] backdrop-blur-md ring-1 ring-white/10 md:px-9 md:py-9"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: easeLux }}
            className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.45em] md:text-xs"
            style={{ color: gold, textShadow: heroTextShadow }}
          >
            Luxury retail destination
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.28, ease: easeLux }}
            className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl"
            style={{ textShadow: heroTextShadow }}
          >
            Where scale meets
            <br />
            <span className="text-white/95">aspiration.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45, ease: easeLux }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
            style={{ textShadow: heroTextShadow }}
          >
            A sales narrative for partners who expect clarity, prestige, and
            measurable impact—anchored at one of North America&apos;s most
            ambitious retail environments.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58, ease: easeLux }}
          className="mt-10"
        >
          <motion.a
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#c9a962]/50 bg-[#c9a962]/15 px-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#c9a962] backdrop-blur-sm transition-colors hover:border-[#c9a962]/70 hover:bg-[#c9a962]/25"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(201, 169, 98, 0.45)",
                "0 0 32px 10px rgba(201, 169, 98, 0.35)",
                "0 0 0 0 rgba(201, 169, 98, 0.45)",
              ],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Request a Deck
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

const cards = [
  {
    title: "Scale",
    body: "Iconic footprint and curated density—designed for flagship moments, seasonal spectacles, and sustained foot traffic at a level few venues can match.",
  },
  {
    title: "Demographics",
    body: "A high-intent, diverse audience spanning the metro corridor and beyond—shoppers who treat the mall as a destination, not a convenience stop.",
  },
  {
    title: "Reach",
    body: "Integrated experiences, entertainment, and retail create repeat visits and extended dwell—amplifying brand visibility across channels and seasons.",
  },
] as const;

type WhySectionProps = {
  persona: PersonaId;
};

function WhySection({ persona }: WhySectionProps) {
  const scaleStats = scaleStatsByPersona[persona];

  return (
    <section
      id="why-american-dream"
      className="relative border-t border-white/[0.06] bg-[#050505] px-6 py-28 md:px-8 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp} className="mb-16 md:mb-20">
          <p
            className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.4em] md:text-xs"
            style={{ color: gold }}
          >
            Why American Dream
          </p>
          <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.02em] text-white md:text-4xl lg:text-5xl">
            Built for brands that lead categories.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.85,
                delay: i * 0.1,
                ease: easeLux,
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-colors duration-500 hover:border-[#c9a962]/25 hover:bg-white/[0.035]"
            >
              <div
                className="mb-6 h-px w-10 transition-all duration-500 group-hover:w-14"
                style={{ backgroundColor: gold }}
              />
              <h3 className="mb-4 text-xl font-medium tracking-tight text-white">
                {card.title}
              </h3>
              {card.title === "Scale" ? (
                <div className="min-h-[11rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={persona}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: easeLux }}
                      className="space-y-6"
                    >
                      {scaleStats.map((stat, j) => (
                        <motion.div
                          key={stat.headline}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.08 * j,
                            ease: easeLux,
                          }}
                        >
                          <p
                            className="mb-1.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/90 md:text-xs"
                            style={{ color: goldMuted }}
                          >
                            {stat.headline}
                          </p>
                          <p className="text-[0.95rem] leading-relaxed text-white/55">
                            {stat.detail}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-[0.95rem] leading-relaxed text-white/55">
                  {card.body}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const interestAreas = [
  { value: "", label: "Select interest area" },
  { value: "leasing", label: "Leasing" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "events", label: "Events" },
] as const;

function ConciergeInquiry() {
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company.trim() || !interest) return;
    setIsSubmitting(true);
    setSubmitted(false);
    await new Promise((r) => setTimeout(r, 1600));
    setIsSubmitting(false);
    setSubmitted(true);
    setCompany("");
    setInterest("");
  }

  return (
    <section
      id="concierge-inquiry"
      aria-labelledby="concierge-heading"
      className="relative border-t border-white/[0.06] bg-gradient-to-b from-[#060606] via-[#050505] to-[#040404] px-6 py-20 md:px-8 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,169,98,0.08),transparent_55%)]" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <motion.div {...fadeUp} className="mb-12 max-w-2xl md:mb-14">
          <p
            className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.4em] md:text-xs"
            style={{ color: gold }}
          >
            Concierge Inquiry
          </p>
          <h2
            id="concierge-heading"
            className="text-3xl font-medium tracking-[-0.02em] text-white md:text-4xl"
          >
            Secure Your Position on the Global Stage
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: easeLux }}
          className="max-w-md"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10"
          >
            <div className="space-y-2">
              <label
                htmlFor="concierge-company"
                className="block text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/50"
              >
                Company
              </label>
              <input
                id="concierge-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your organization"
                className="w-full rounded-xl border border-white/[0.1] bg-[#050505]/80 px-4 py-3.5 text-[0.95rem] text-white placeholder:text-white/30 outline-none transition-[border-color,box-shadow] focus:border-[#c9a962]/45 focus:shadow-[0_0_0_1px_rgba(201,169,98,0.2),0_0_24px_rgba(201,169,98,0.12)]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="concierge-interest"
                className="block text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/50"
              >
                Interest Area
              </label>
              <div className="relative">
                <select
                  id="concierge-interest"
                  name="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.1] bg-[#050505]/80 px-4 py-3.5 pr-11 text-[0.95rem] text-white outline-none transition-[border-color,box-shadow] focus:border-[#c9a962]/45 focus:shadow-[0_0_0_1px_rgba(201,169,98,0.2),0_0_24px_rgba(201,169,98,0.12)]"
                >
                  {interestAreas.map((opt) => (
                    <option
                      key={opt.value || "placeholder"}
                      value={opt.value}
                      disabled={opt.value === ""}
                      className="bg-[#0a0a0a] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35"
                  aria-hidden
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="pt-1">
              <motion.button
                type="submit"
                disabled={isSubmitting || !company.trim() || !interest}
                className="relative w-full overflow-hidden rounded-full border border-[#c9a962]/55 bg-gradient-to-b from-[#d4b56e] via-[#c9a962] to-[#a88b4a] px-8 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] shadow-[0_0_28px_rgba(201,169,98,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
                whileTap={isSubmitting ? undefined : { scale: 0.985 }}
                animate={
                  isSubmitting
                    ? {
                        boxShadow: [
                          "0 0 20px rgba(201, 169, 98, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                          "0 0 40px rgba(201, 169, 98, 0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
                          "0 0 20px rgba(201, 169, 98, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                        ],
                      }
                    : {
                        boxShadow: [
                          "0 0 24px rgba(201, 169, 98, 0.5), 0 0 48px rgba(201, 169, 98, 0.22), inset 0 1px 0 rgba(255,255,255,0.35)",
                          "0 0 36px rgba(201, 169, 98, 0.65), 0 0 72px rgba(201, 169, 98, 0.28), inset 0 1px 0 rgba(255,255,255,0.4)",
                          "0 0 24px rgba(201, 169, 98, 0.5), 0 0 48px rgba(201, 169, 98, 0.22), inset 0 1px 0 rgba(255,255,255,0.35)",
                        ],
                      }
                }
                transition={
                  isSubmitting
                    ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                }
              >
                {!isSubmitting ? (
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-120%" }}
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 0.6,
                    }}
                    aria-hidden
                  />
                ) : (
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    aria-hidden
                  />
                )}
                <span className="relative z-10 flex min-h-[1.25rem] items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        className="font-semibold tracking-[0.18em]"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Sending
                      </motion.span>
                      <span
                        className="inline-flex items-center gap-1.5"
                        aria-hidden
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]/90"
                            animate={{
                              scale: [1, 1.35, 1],
                              opacity: [0.35, 1, 0.35],
                            }}
                            transition={{
                              duration: 0.9,
                              repeat: Infinity,
                              ease: easeLux,
                              delay: i * 0.14,
                            }}
                          />
                        ))}
                      </span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </span>
              </motion.button>
            </div>

            <AnimatePresence>
              {submitted ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, ease: easeLux }}
                  className="text-center text-sm text-white/55"
                  role="status"
                >
                  Thank you — our team will be in touch shortly.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/[0.06] bg-[#030303] px-6 py-16 md:px-8"
    >
      <motion.div
        {...fadeUp}
        className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center"
      >
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white">
            American Dream
          </p>
          <p className="mt-2 text-sm text-white/45">
            Partnership inquiries — add your contact details here.
          </p>
        </div>
        <p className="text-xs text-white/35">
          © {new Date().getFullYear()} American Dream. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}

export default function Home() {
  const [persona, setPersona] = useState<PersonaId>("retailer");

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white antialiased">
      <Nav />
      <main>
        <PersonaToggle persona={persona} onPersonaChange={setPersona} />
        <VideoHero />
        <ByTheNumbers />
        <PersonaSection />
        <WhySection persona={persona} />
        <ConciergeInquiry />
        <Footer />
      </main>
    </div>
  );
}
