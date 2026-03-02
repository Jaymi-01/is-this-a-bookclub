"use client";

import { Hero } from "@/components/Hero";
import { Archive } from "@/components/Archive";
import { JoinForm } from "@/components/JoinForm";
import { CommunityVibe } from "@/components/CommunityVibe";
import { Books, Star, ChatsCircle, Gear } from "@phosphor-icons/react";
import Link from "next/link";
import { useBookStore } from "@/lib/store";
import { useEffect } from "react";

export default function Home() {
  const { booksFinished, activeMembers, init } = useBookStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <main className="min-h-screen">
      {/* Navigation - Minimal and Styled */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="bg-rich-charcoal p-2 rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF] pointer-events-auto flex items-center gap-3">
          <img src="/logo.png" alt="Bookclub Logo" className="h-10 w-auto" />
          <span className="font-serif font-bold text-lg text-parchment tracking-tighter pr-2">ITABC.</span>
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <Link href="/admin" className="bg-rich-charcoal text-parchment p-3 rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#2A734D] hover:translate-y-1 hover:shadow-none transition-all">
            <Gear size={24} weight="bold" />
          </Link>
        </div>
      </nav>

      {/* Main Sections */}
      <Hero />
      
      {/* Stats / Value Prop Section */}
      <section className="bg-rich-charcoal py-32 px-6 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-watermelon-pink shadow-[8px_8px_0px_#F06595] transform hover:-translate-y-2 transition-transform">
            <Star size={56} weight="fill" className="mx-auto text-watermelon-pink mb-6" />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">4.8</h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">Avg. Rating</p>
          </div>
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-vibrant-lilac shadow-[8px_8px_0px_#8C52FF] transform hover:-translate-y-2 transition-transform">
            <Books size={56} weight="fill" className="mx-auto text-vibrant-lilac mb-6" />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">{booksFinished}</h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">Books Finished</p>
          </div>
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-forest-green shadow-[8px_8px_0px_#2A734D] transform hover:-translate-y-2 transition-transform">
            <ChatsCircle size={56} weight="fill" className="mx-auto text-forest-green mb-6" />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">{activeMembers}</h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">Active Members</p>
          </div>
        </div>
      </section>

      <Archive />
      <CommunityVibe />
      <JoinForm />

      {/* Footer */}
      <footer className="bg-rich-charcoal text-parchment py-12 px-6 border-t-4 border-vibrant-lilac">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-serif font-bold">Is This A Bookclub?</h2>
            <p className="text-parchment/40 mt-2 font-sans">© 2026 Reading with style and coffee.</p>
          </div>
          <div className="flex gap-8 font-black uppercase tracking-widest text-xs">
            <a href="https://www.instagram.com/isthisabookclubhq" target="_blank" rel="noopener noreferrer" className="hover:text-vibrant-lilac transition-colors">Instagram</a>
            <a href="tel:+2348126956275" className="hover:text-forest-green transition-colors">Call Us</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
