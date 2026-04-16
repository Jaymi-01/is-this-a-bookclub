"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import { useBookStore } from "@/lib/store";
import { Star, Quotes, CalendarBlank } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";

export function Archive() {
  const { pastBooks } = useBookStore();

  return (
    <section className="py-24 md:py-32 bg-rich-charcoal relative overflow-hidden px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center md:grid md:grid-cols-2 md:text-left md:items-center gap-12 lg:gap-24">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-10 w-full flex flex-col items-center md:items-start"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-watermelon-pink text-rich-charcoal font-black text-[10px] md:text-xs uppercase rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#1A1A1A]">
            Collection
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-serif font-black text-parchment leading-[1] tracking-tighter">
            The Interactive <br className="hidden md:block" />
            <span className="text-vibrant-lilac italic">Archive.</span>
          </h2>
          <p className="text-parchment/50 text-lg md:text-xl leading-relaxed max-w-md font-sans font-medium">
            Every story we've conquered, every debate we've had. Swipe through the history of our shared experience.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <div className="p-4 md:p-6 bg-white/5 border-2 border-white/10 rounded-[1.5rem] backdrop-blur-md min-w-[100px] md:min-w-[160px] text-center">
              <span className="block text-3xl md:text-5xl font-serif font-black text-watermelon-pink mb-1">{pastBooks.length}</span>
              <span className="text-[10px] font-black uppercase text-parchment/30 tracking-[0.2em]">Books Read</span>
            </div>
            <div className="p-4 md:p-6 bg-white/5 border-2 border-white/10 rounded-[1.5rem] backdrop-blur-md min-w-[100px] md:min-w-[160px] text-center">
              <span className="block text-3xl md:text-5xl font-serif font-black text-vibrant-lilac mb-1">4.8</span>
              <span className="text-[10px] font-black uppercase text-parchment/30 tracking-[0.2em]">Avg Rating</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-[450px] md:max-w-none h-[450px] md:h-[600px] flex items-center justify-center relative">
          <div className="relative w-full flex items-center justify-center">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Navigation]}
              className="w-[280px] sm:w-[320px] md:w-[400px] h-[480px] md:h-[550px]"
            >
            {pastBooks.map((book) => (
              <SwiperSlide key={book.id} className="rounded-[2.5rem] overflow-hidden">
                <div className="w-full h-full bg-parchment border-[6px] border-rich-charcoal flex flex-col group">
                  <div className="relative h-[65%] overflow-hidden border-b-[6px] border-rich-charcoal">
                    <img
                      src={book.cover}
                      alt={`Past Book Selection: ${book.title} by ${book.author}`}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-6 right-6 bg-watermelon-pink text-rich-charcoal w-14 h-14 rounded-full border-4 border-rich-charcoal flex flex-col items-center justify-center font-black shadow-lg">
                      <Star weight="fill" size={16} />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between bg-parchment relative">
                    <Quotes weight="fill" className="absolute top-4 right-6 text-rich-charcoal/5" size={80} />
                    
                    <div>
                      <div className="flex items-center gap-2 text-vibrant-lilac text-xs font-black uppercase tracking-widest mb-3">
                        <CalendarBlank weight="bold" /> {book.dateRead}
                      </div>
                      <h3 className="text-2xl font-serif font-black text-rich-charcoal line-clamp-2 leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-rich-charcoal/60 text-sm italic font-sans mt-1">
                        by {book.author}
                      </p>
                    </div>

                    <p className="text-rich-charcoal/80 text-sm line-clamp-3 mt-4 leading-relaxed font-sans border-t-2 border-dashed border-rich-charcoal/10 pt-4">
                      {book.summary}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 text-[20rem] font-serif font-black text-white/[0.02] pointer-events-none select-none leading-none">
        READ
      </div>
    </section>
  );
}
