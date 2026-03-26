"use client";

import { motion } from "framer-motion";
import { useBookStore } from "@/lib/store";
import { Countdown } from "./Countdown";
import { BookBookmark } from "@phosphor-icons/react";

export function Hero() {
  const { currentBook, badgeText } = useBookStore();

  return (
    <section className="min-h-screen flex flex-col items-center pt-32 pb-20 px-4 md:px-12 bg-warm-sand relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-[-100px] w-96 h-96 bg-vibrant-lilac/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[-100px] w-96 h-96 bg-forest-green/10 rounded-full blur-3xl" />

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16 w-full max-w-7xl z-10 mb-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rich-charcoal text-parchment rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF]">
            <BookBookmark weight="fill" className="text-vibrant-lilac" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">The Monthly Spotlight</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-black text-rich-charcoal leading-[1.1] tracking-tighter">
            Reading is
            <span className="text-forest-green underline decoration-watermelon-pink decoration-6 md:decoration-8 underline-offset-8 italic"> Better</span> Together.
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl font-sans text-rich-charcoal/80 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
            Join a collective of curious minds as we explore <strong>{currentBook.title}</strong> by {currentBook.author}.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]"
        >
          <div className="absolute inset-0 bg-rich-charcoal rounded-[2.5rem] translate-x-3 translate-y-3 md:translate-x-6 md:translate-y-6" />
          <div className="relative aspect-[3/4.5] overflow-hidden rounded-[2.5rem] border-4 border-rich-charcoal bg-parchment flex flex-col">
            <img
              src={currentBook.cover}
              alt={currentBook.title}
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-parchment p-5 md:p-6 border-t-4 border-rich-charcoal">
              <h3 className="text-sm md:text-xl font-black uppercase tracking-tighter text-rich-charcoal mb-1">Current Pick</h3>
              <p className="text-xs md:text-sm font-bold text-rich-charcoal/60 truncate">{currentBook.title}</p>
            </div>
          </div>

          {/* Floating Sticker - Adjusted to not fly off screen */}
          <motion.div
            animate={{ rotate: [-5, 5, -5], y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-4 -right-4 md:-top-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-watermelon-pink rounded-full border-4 border-rich-charcoal flex items-center justify-center text-center p-2 md:p-4 shadow-xl z-20"
          >
            <span className="font-serif font-black text-rich-charcoal text-[10px] md:text-sm leading-tight uppercase">
              {badgeText.split(' ').map((word, i) => (
                <span key={i}>{word}<br /></span>
              ))}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Meeting Timer Section - Guaranteed Visibility */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-parchment p-8 md:p-16 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] text-center z-10"
      >
        <h2 className="text-3xl md:text-5xl font-serif font-black text-rich-charcoal mb-2 uppercase tracking-tighter">Next Meeting</h2>
        <p className="text-xs md:text-lg font-black text-rich-charcoal/30 uppercase tracking-[0.3em] mb-10">Countdown to the Discussion</p>
        <Countdown />
      </motion.div>
    </section>
  );
}
