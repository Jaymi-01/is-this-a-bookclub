import Link from "next/link";
import { BookOpen, House } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-sand flex flex-col items-center justify-center p-5 text-center">
      <div className="max-w-md w-full bg-parchment p-12 rounded-[2.5rem] border-4 border-rich-charcoal shadow-[16px_16px_0px_#1A1A1A]">
        <div className="flex justify-center mb-8">
          <BookOpen size={80} weight="fill" className="text-forest-green animate-bounce" />
        </div>
        <h1 className="text-6xl md:text-8xl font-serif font-black text-rich-charcoal mb-4">404</h1>
        <h2 className="text-2xl font-bold text-rich-charcoal mb-6 uppercase tracking-tight">Chapter Not Found</h2>
        <p className="text-rich-charcoal/60 font-medium mb-10 leading-relaxed">
          It seems you've wandered into a blank page. This chapter hasn't been written yet, or maybe it was lost in the library.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-forest-green text-parchment font-black text-lg rounded-2xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          <House weight="bold" /> Back to Home
        </Link>
      </div>
      <div className="mt-12 text-rich-charcoal/30 font-black uppercase tracking-[0.3em] text-sm">
        Is This A Bookclub?
      </div>
    </div>
  );
}
