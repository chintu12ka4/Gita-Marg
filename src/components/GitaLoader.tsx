import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const GITA_CONTEMPLATIONS = [
  {
    text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    ref: "Bhagavad Gita 2.47"
  },
  {
    text: "The mind is restless and difficult to control, but it can be conquered through regular practice and detachment.",
    ref: "Bhagavad Gita 6.35"
  },
  {
    text: "For one who has conquered the mind, the mind is the best of friends. But for one who has failed to do so, the mind will remain the greatest enemy.",
    ref: "Bhagavad Gita 6.6"
  },
  {
    text: "Whatever action is performed by a great person, common people follow. Whatever standards they set by exemplary acts, all the world pursues.",
    ref: "Bhagavad Gita 3.21"
  },
  {
    text: "A person is said to be established in self-realization when they are free from all material desires, and their mind is satisfied in the self alone.",
    ref: "Bhagavad Gita 2.55"
  },
  {
    text: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called Yoga.",
    ref: "Bhagavad Gita 2.48"
  }
];

export default function GitaLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % GITA_CONTEMPLATIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-xl mx-auto min-h-[350px]">
      {/* Decorative Golden Chariot Wheel or Mandala Spinner */}
      <div className="relative mb-8">
        {/* Outer glowing pulsing circle */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse scale-150"></div>
        {/* Main rotating golden mandala-svg */}
        <div className="w-16 h-16 animate-spin" style={{ animationDuration: "12s" }}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6,6" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M50,5 L50,95 M5,50 L95,50 M18,18 L82,82 M18,82 L82,18" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>
      </div>

      <p className="text-amber-700 font-medium tracking-widest text-xs uppercase mb-3 font-sans">
        Consulting Timeless Wisdom
      </p>

      <span className="text-xs text-stone-400 mb-6 italic block">
        Sri Krishna is finding a matching shloka for your problem...
      </span>

      <div className="min-h-[120px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <p className="text-stone-700 italic font-serif text-lg leading-relaxed leading-extra">
              "{GITA_CONTEMPLATIONS[index].text}"
            </p>
            <p className="text-amber-600 text-xs font-mono tracking-wider font-semibold">
              — {GITA_CONTEMPLATIONS[index].ref}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative dots */}
      <div className="flex gap-1.5 mt-8 justify-center">
        {GITA_CONTEMPLATIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === i ? "w-4 bg-amber-600" : "w-1.5 bg-stone-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
