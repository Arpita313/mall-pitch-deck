"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const gold = "#c9a962";
const goldMuted = "rgba(201, 169, 98, 0.85)";

/** Premium ease — matches Apple-style motion curves */
const easeLux = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: easeLux },
};

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

function VideoHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-[#050505]"
    >
      {/* Full-screen video placeholder — replace with <source> when asset is ready */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#080808]" />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 20%, rgba(201, 169, 98, 0.12) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 80% 60%, rgba(201, 169, 98, 0.06) 0%, transparent 50%), linear-gradient(180deg, #0c0c0c 0%, #050505 45%, #030303 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-sm border border-white/[0.08] bg-black/30 px-5 py-3 backdrop-blur-sm">
            <p
              className="text-center text-[0.65rem] font-medium uppercase tracking-[0.4em] text-white/40"
              style={{ color: goldMuted }}
            >
              Hero video placeholder
            </p>
          </div>
        </div>
        {/* Replace placeholder layer with:
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
              <source src="/hero.mp4" type="video/mp4" />
            </video>
        */}
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: easeLux }}
          className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.45em] md:text-xs"
          style={{ color: gold }}
        >
          Luxury retail destination
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.28, ease: easeLux }}
          className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl"
        >
          Where scale meets
          <br />
          <span className="text-white/95">aspiration.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.45, ease: easeLux }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
        >
          A sales narrative for partners who expect clarity, prestige, and
          measurable impact—anchored at one of North America&apos;s most
          ambitious retail environments.
        </motion.p>
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

function WhySection() {
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
              <p className="text-[0.95rem] leading-relaxed text-white/55">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>
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
  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white antialiased">
      <Nav />
      <main>
        <VideoHero />
        <WhySection />
        <Footer />
      </main>
    </div>
  );
}
