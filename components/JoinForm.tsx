"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Envelope, BookOpen, PaperPlaneRight, WhatsappLogo, CircleNotch } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function JoinForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    favoriteGenre: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      toast.success("Welcome to the club! We'll be in touch soon.", {
        icon: "📚",
        style: {
          borderRadius: "10px",
          background: "#1A1A1A",
          color: "#FDFBF7",
          border: "2px solid #EBD48F",
        },
      });
      setFormData({ name: "", email: "", whatsapp: "", favoriteGenre: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-warm-sand flex flex-col items-center justify-center min-h-screen px-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl bg-parchment p-8 md:p-16 rounded-[2rem] md:rounded-[2.5rem] border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] md:shadow-[16px_16px_0px_#1A1A1A] mx-auto"
      >
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-forest-green text-parchment font-black text-[10px] uppercase rounded-lg mb-4">
            New Members
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-black text-rich-charcoal tracking-tighter">
            Join The <br className="md:hidden" /> Club.
          </h2>
          <p className="text-rich-charcoal/50 mt-4 text-lg md:text-xl font-medium max-w-md mx-auto">
            Become part of a community that reads between the lines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <User weight="bold" className="text-vibrant-lilac" /> Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-white border-4 border-rich-charcoal rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold"
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <Envelope weight="bold" className="text-watermelon-pink" /> Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 bg-white border-4 border-rich-charcoal rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold"
              placeholder="jane@itabc.club"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <WhatsappLogo weight="bold" className="text-green-600" /> WhatsApp
            </label>
            <input
              type="tel"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full p-4 bg-white border-4 border-rich-charcoal rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold"
              placeholder="+234..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <BookOpen weight="bold" className="text-forest-green" /> Genre
            </label>
            <div className="relative">
              <select
                value={formData.favoriteGenre}
                onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value })}
                className="w-full p-4 bg-white border-4 border-rich-charcoal rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all appearance-none font-bold"
              >
                <option value="">Select genre...</option>
                <option value="fiction">Literary Fiction</option>
                <option value="mystery">Mystery/Thriller</option>
                <option value="sci-fi">Sci-Fi/Fantasy</option>
                <option value="non-fiction">Non-Fiction</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="md:col-span-2 py-6 bg-forest-green text-parchment font-black text-2xl rounded-2xl border-4 border-rich-charcoal shadow-[8px_8px_0px_#1A1A1A] hover:shadow-[12px_12px_0px_#1A1A1A] transition-all flex items-center justify-center gap-4 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                Sending... <CircleNotch className="animate-spin" size={24} weight="bold" />
              </span>
            ) : (
              <span className="flex items-center gap-3">
                Request to Join <PaperPlaneRight weight="bold" />
              </span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
