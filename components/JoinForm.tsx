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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.whatsapp.replace(/\s/g, ""))) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number (e.g., +234...).";
    }

    if (!formData.favoriteGenre) {
      newErrors.favoriteGenre = "Please select your favorite genre.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Honeypot check: Bots will fill this out, humans won't.
    if (honeypot) {
      console.log("Bot detected!");
      return;
    }

    // 2. Custom Validation
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // 3. Simple Rate Limit: Wait 30 seconds between submissions from the same session.
    const now = Date.now();
    if (now - lastSubmitted < 30000) {
      toast.error("Please wait a moment before sending another request.");
      return;
    }

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
      setLastSubmitted(now);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-warm-sand flex flex-col items-center justify-center min-h-screen px-5 md:px-12 overflow-hidden">
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
          {/* Honeypot field (hidden from humans) */}
          <div className="hidden">
            <label htmlFor="website">Don't fill this out if you're human</label>
            <input 
              id="website"
              type="text" 
              autoComplete="off"
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <User weight="bold" className="text-vibrant-lilac" /> Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-4 bg-white border-4 ${errors.name ? 'border-watermelon-pink' : 'border-rich-charcoal'} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="text-watermelon-pink text-xs font-bold">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <Envelope weight="bold" className="text-watermelon-pink" /> Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-4 bg-white border-4 ${errors.email ? 'border-watermelon-pink' : 'border-rich-charcoal'} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="jane@itabc.club"
            />
            {errors.email && <p className="text-watermelon-pink text-xs font-bold">{errors.email}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="whatsapp" className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <WhatsappLogo weight="bold" className="text-green-600" /> WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className={`w-full p-4 bg-white border-4 ${errors.whatsapp ? 'border-watermelon-pink' : 'border-rich-charcoal'} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="+234..."
            />
            <p className="text-[10px] font-bold text-rich-charcoal/40 uppercase tracking-wider">Please provide a reachable WhatsApp number.</p>
            {errors.whatsapp && <p className="text-watermelon-pink text-xs font-bold">{errors.whatsapp}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="genre" className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2">
              <BookOpen weight="bold" className="text-forest-green" /> Genre
            </label>
            <div className="relative">
              <select
                id="genre"
                value={formData.favoriteGenre}
                onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value })}
                className={`w-full p-4 bg-white border-4 ${errors.favoriteGenre ? 'border-watermelon-pink' : 'border-rich-charcoal'} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all appearance-none font-bold`}
              >
                <option value="">Select genre...</option>
                <option value="fiction">Literary Fiction</option>
                <option value="mystery">Mystery/Thriller</option>
                <option value="sci-fi">Sci-Fi/Fantasy</option>
                <option value="non-fiction">Non-Fiction</option>
              </select>
            </div>
            {errors.favoriteGenre && <p className="text-watermelon-pink text-xs font-bold">{errors.favoriteGenre}</p>}
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
