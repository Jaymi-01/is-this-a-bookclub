"use client";

import { motion } from "framer-motion";
import { useBookStore } from "@/lib/store";

export function CommunityVibe() {
  const { communityImage, signatures } = useBookStore();

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${communityImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-rich-charcoal/40 backdrop-blur-[2px]" />
        {/* SEO Alt Text for Background Image */}
        <img src={communityImage} alt="Members of Is This A Bookclub enjoying a reading session together" className="sr-only" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-parchment p-8 md:p-12 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[12px_12px_0px_#8C52FF] max-w-2xl overflow-hidden"
        >
          {/* SIGNATURE WALL EFFECT */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 select-none">
            {signatures.map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  transform: `rotate(${Math.random() * 40 - 20}deg)`,
                  fontSize: `${Math.random() * 15 + 10}px`,
                  filter: `blur(${Math.random() * 1.5}px)`,
                }}
                className="font-serif font-black text-rich-charcoal whitespace-nowrap"
              >
                {name}
              </motion.span>
            ))}
          </div>

          {/* Main Text */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-rich-charcoal leading-tight tracking-tighter">
              More than just readers. <br/>
              <span className="text-forest-green italic underline decoration-watermelon-pink decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">We're a family.</span>
            </h2>
            <p className="mt-6 text-rich-charcoal/60 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              Captured moments from the ITABC tribe
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
