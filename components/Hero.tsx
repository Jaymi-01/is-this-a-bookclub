"use client";

import { motion } from "motion/react";
import { useBookStore } from "@/lib/store";
import { Countdown } from "./Countdown";
import { BookBookmark } from "@phosphor-icons/react";

export function Hero() {
  const { currentBook, currentBook2, badgeText } = useBookStore();

  return (
    <section className="min-h-screen flex flex-col items-center pt-32 pb-20 px-6 md:px-12 bg-warm-sand relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-[-100px] w-96 h-96 bg-vibrant-lilac/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[-100px] w-96 h-96 bg-forest-green/10 rounded-full blur-3xl" />

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16 w-full max-w-7xl mx-auto z-10 mb-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rich-charcoal text-parchment rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF]">
            <BookBookmark weight="fill" className="text-vibrant-lilac" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              The Monthly Spotlight
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-rich-charcoal leading-[1.1] tracking-tighter">
            Premium Nigerian <br className="hidden lg:block" />
            <span className="text-forest-green underline decoration-watermelon-pink decoration-6 md:decoration-8 underline-offset-8 italic">
              {" "}
              Literature Club
            </span>
            .
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl font-sans text-rich-charcoal/80 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
            Join Nigeria&apos;s most curated <strong>book community</strong>. We
            celebrate African writers and modern classics through thoughtful
            monthly discussions.
            <br />
            Our current read:{" "}
            <strong>{currentBook.title}</strong> by {currentBook.author} and{" "}
            <strong>{currentBook2.title}</strong> by {currentBook2.author}.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px] aspect-[3/4.5] mt-12 md:mt-0 mx-auto md:mx-0 md:ml-auto md:mr-16 lg:mr-20 flex items-center justify-center"
        >
          {/* First Book */}
          <div className="absolute inset-0 w-full h-full z-20 group/book1 transition-all duration-500 -translate-x-4 sm:-translate-x-6 -rotate-6 hover:scale-105 hover:z-30 hover:-translate-x-8 sm:hover:-translate-x-10 hover:-rotate-12">
            <div className="absolute inset-0 bg-rich-charcoal rounded-[1.5rem] md:rounded-[2.5rem] translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4" />
            <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-rich-charcoal bg-parchment">
              <img
                src={currentBook.cover}
                alt={`Monthly Book Selection 1: ${currentBook.title} by ${currentBook.author}`}
                className="w-full h-full object-cover grayscale-[20%] group-hover/book1:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Second Book */}
          <div className="absolute inset-0 w-full h-full z-10 group/book2 transition-all duration-500 translate-x-4 sm:translate-x-6 rotate-6 hover:scale-105 hover:z-30 hover:translate-x-8 sm:hover:translate-x-10 hover:rotate-12">
            <div className="absolute inset-0 bg-rich-charcoal rounded-[1.5rem] md:rounded-[2.5rem] translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4" />
            <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-rich-charcoal bg-parchment">
              <img
                src={currentBook2.cover}
                alt={`Monthly Book Selection 2: ${currentBook2.title} by ${currentBook2.author}`}
                className="w-full h-full object-cover grayscale-[20%] group-hover/book2:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Floating Sticker */}
            <motion.div
              animate={{ rotate: [-5, 5, -5], y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-2 -right-3 md:-top-4 md:-right-6 w-12 h-12 md:w-18 md:h-18 bg-watermelon-pink rounded-full border-2 md:border-4 border-rich-charcoal flex items-center justify-center text-center p-0.5 md:p-1.5 shadow-xl z-30 pointer-events-none"
            >
              <span className="font-serif font-black text-rich-charcoal text-[6px] md:text-[9px] leading-tight uppercase">
                {badgeText.split(" ").map((word, i) => (
                  <span key={i}>
                    {word}
                    <br />
                  </span>
                ))}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Meeting Timer Section - Guaranteed Visibility */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-parchment p-8 md:p-16 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] text-center z-10"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-black text-rich-charcoal mb-2 uppercase tracking-tighter">
          Next Meeting
        </h2>
        <p className="text-xs md:text-lg font-black text-rich-charcoal/30 uppercase tracking-[0.3em] mb-10">
          Countdown to the Discussion
        </p>
        <Countdown />
      </motion.div>
    </section>
  );
}
