"use client";

import { motion } from "framer-motion";
import { useBookStore } from "@/lib/store";

export function CommunityVibe() {
  const { communityImage } = useBookStore();

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
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-parchment p-8 md:p-12 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[12px_12px_0px_#8C52FF] max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-black text-rich-charcoal leading-tight tracking-tighter">
            More than just readers. <br/>
            <span className="text-forest-green italic underline decoration-watermelon-pink decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">We're a family.</span>
          </h2>
          <p className="mt-6 text-rich-charcoal/60 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
            Captured moments from the ITABC tribe
          </p>
        </motion.div>
      </div>
    </section>
  );
}
