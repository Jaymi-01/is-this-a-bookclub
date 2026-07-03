"use client";

import { Hero } from "@/components/Hero";
import { Archive } from "@/components/Archive";
import { JoinForm } from "@/components/JoinForm";
import { CommunityVibe } from "@/components/CommunityVibe";
import {
  Books,
  Star,
  Users,
  Gear,
  InstagramLogo,
  Phone,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useBookStore } from "@/lib/store";
import { useEffect } from "react";
import { SnowEffect } from "@/components/SnowEffect";

export default function Home() {
  const { booksFinished, activeMembers, activeTheme, festiveGreeting, init } =
    useBookStore();

  useEffect(() => {
    init();
  }, [init]);

  const showBanner = activeTheme !== "default" && festiveGreeting;

  return (
    <main className={`min-h-screen overflow-x-hidden theme-${activeTheme}`}>
      <SnowEffect activeTheme={activeTheme} />

      {showBanner && (
        <div className="fixed top-0 left-0 right-0 bg-watermelon-pink text-parchment text-center py-2 px-4 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] border-b-4 border-rich-charcoal z-[99] flex items-center justify-center gap-2">
          <span>
            {activeTheme === "christmas"
              ? "🎄"
              : activeTheme === "eid"
                ? "🌙"
                : activeTheme === "valentine"
                  ? "💖"
                  : "🎆"}
          </span>
          <span>{festiveGreeting}</span>
          <span>
            {activeTheme === "christmas"
              ? "🎁"
              : activeTheme === "eid"
                ? "⭐"
                : activeTheme === "valentine"
                  ? "💘"
                  : "🥂"}
          </span>
        </div>
      )}

      {/* Navigation - Minimal and Styled */}
      <nav
        className={`fixed ${showBanner ? "top-10" : "top-0"} left-0 right-0 z-50 px-6 md:px-12 py-4 md:py-6 pointer-events-none transition-all`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="relative bg-rich-charcoal p-2 rounded-xl border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF] pointer-events-auto flex items-center gap-2 md:gap-3">
            <img
              src="/logo.png"
              alt="Bookclub Logo"
              className="h-8 md:h-10 w-8 md:w-10 rounded-full object-cover"
            />
            {activeTheme === "christmas" && (
              <img
                src="/hat.png"
                alt="Santa Hat"
                className="absolute -top-[14px] -left-[12px] w-[36px] h-[36px] md:-top-[18px] md:-left-[14px] md:w-[44px] md:h-[44px] transform -rotate-[35deg] drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)] pointer-events-none"
              />
            )}
            {activeTheme === "eid" && (
              <svg
                className="absolute -top-[16px] -left-[16px] w-[38px] h-[38px] md:-top-[20px] md:-left-[20px] md:w-[48px] md:h-[48px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C14.0537 21 15.943 20.313 17.4589 19.16C12.7538 18.82 9.00002 14.8523 9.00002 10.005C9.00002 7.05435 10.4578 4.44368 12.697 2.825C12.4682 2.935 12.235 3.06 12 3Z"
                  fill="#D4AF37"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 4L18.8 5.6L20.6 5.9L19.3 7.1L19.6 8.9L18 8L16.4 8.9L16.7 7.1L15.4 5.9L17.2 5.6L18 4Z"
                  fill="#D4AF37"
                  stroke="#1A1A1A"
                  strokeWidth="1"
                />
              </svg>
            )}
            {activeTheme === "valentine" && (
              <svg
                className="absolute -top-[14px] -left-[12px] w-[34px] h-[34px] md:-top-[18px] md:-left-[16px] md:w-[44px] md:h-[44px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none transform -rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                  fill="#C2185B"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {activeTheme === "newyear" && (
              <svg
                className="absolute -top-[16px] -left-[16px] w-[38px] h-[38px] md:-top-[22px] md:-left-[22px] md:w-[48px] md:h-[48px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none transform -rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 20L10 14L8 12L2 18L4 20Z"
                  fill="#D4AF37"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11L14 8M13 13L17 11M11 15L15 15"
                  stroke="#FF4081"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="17" cy="6" r="1.5" fill="#8C52FF" />
                <circle cx="20" cy="10" r="1" fill="#FF4081" />
              </svg>
            )}
            <span className="font-serif font-black text-base md:text-lg text-parchment tracking-tighter pr-1 md:pr-2">
              ITABC.
            </span>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <Hero />

      {/* Stats / Value Prop Section */}
      <section className="bg-rich-charcoal py-32 px-6 md:px-12 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-watermelon-pink shadow-[8px_8px_0px_#F06595] transform hover:-translate-y-2 transition-transform">
            <Star
              size={56}
              weight="fill"
              className="mx-auto text-watermelon-pink mb-6"
            />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">
              4.8
            </h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">
              Avg. Rating
            </p>
          </div>
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-vibrant-lilac shadow-[8px_8px_0px_#8C52FF] transform hover:-translate-y-2 transition-transform">
            <Books
              size={56}
              weight="fill"
              className="mx-auto text-vibrant-lilac mb-6"
            />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">
              {booksFinished}
            </h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">
              Books Finished
            </p>
          </div>
          <div className="text-center p-10 bg-parchment rounded-[2rem] border-4 border-forest-green shadow-[8px_8px_0px_#2A734D] transform hover:-translate-y-2 transition-transform">
            <Users
              size={56}
              weight="fill"
              className="mx-auto text-forest-green mb-6"
            />
            <h4 className="text-5xl font-serif font-black text-rich-charcoal tracking-tighter">
              {activeMembers}
            </h4>
            <p className="text-rich-charcoal/40 uppercase font-black text-xs tracking-[0.3em] mt-3">
              Active Members
            </p>
          </div>
        </div>
      </section>

      <Archive />
      <CommunityVibe />
      <JoinForm />

      {/* Footer */}
      <footer className="bg-rich-charcoal text-parchment py-16 px-6 md:px-12 border-t-4 border-vibrant-lilac text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Is This A Bookclub?
            </h2>
            <p className="text-parchment/40 mt-3 font-sans max-w-sm mx-auto">
              © {new Date().getFullYear()} Is This A Bookclub. All rights
              reserved.
            </p>
          </div>
          <div className="flex gap-6 items-center justify-center">
            <a
              href="https://www.instagram.com/isthisabookclubhq"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-parchment text-rich-charcoal p-3 rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#8C52FF] hover:translate-y-1 hover:shadow-none transition-all"
            >
              <InstagramLogo size={24} weight="bold" />
            </a>
            <a
              href="tel:+2348126956275"
              className="bg-parchment text-rich-charcoal p-3 rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#2A734D] hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Phone size={24} weight="bold" />
            </a>
            <Link
              href="/admin"
              className="bg-parchment text-rich-charcoal p-3 rounded-full border-2 border-rich-charcoal shadow-[4px_4px_0px_#F06595] hover:translate-y-1 hover:shadow-none transition-all"
              title="Admin Login"
            >
              <Gear size={24} weight="bold" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
