"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gold = "#c9a962";

function PersonaSection() {
  const [activeTab, setActiveTab] = useState("Retail");

  const content = {
    Retail: {
      title: "Prime Flagship Opportunities",
      stat: "98% Occupancy",
      desc: "Join the world's most prestigious brands in a high-density, luxury environment.",
      cta: "View Floor Plans",
    },
    Sponsors: {
      title: "Global Brand Exposure",
      stat: "450M+ Annual Impressions",
      desc: "Dominate the digital landscape with 360-degree brand integration across the property.",
      cta: "Partnership Deck",
    },
    Events: {
      title: "World-Class Venues",
      stat: "10k+ Capacity",
      desc: "From product launches to global concerts, our venues are tech-ready and iconic.",
      cta: "Book a Venue",
    },
  };

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-8">
          Tailor Your Experience
        </p>

        <div className="flex justify-center gap-4 mb-16">
          {Object.keys(content).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border text-sm transition-all duration-500 ${
                activeTab === tab
                  ? "bg-[#c9a962] text-black border-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.4)]"
                  : "bg-transparent text-white/60 border-white/10 hover:border-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-5xl font-medium text-white">
              {content[activeTab].title}
            </h3>
            <p className="text-4xl font-bold" style={{ color: gold }}>
              {content[activeTab].stat}
            </p>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              {content[activeTab].desc}
            </p>
            <button className="mt-8 px-8 py-3 border border-[#c9a962] text-[#c9a962] hover:bg-[#c9a962] hover:text-black transition-all duration-300">
              {content[activeTab].cta}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default PersonaSection;
