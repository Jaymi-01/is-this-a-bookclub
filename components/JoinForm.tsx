"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Envelope,
  BookOpen,
  PaperPlaneRight,
  WhatsappLogo,
  CircleNotch,
  CalendarBlank,
  CaretDown,
} from "@phosphor-icons/react";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const GENRES = [
  { value: "fiction", label: "Literary Fiction" },
  { value: "mystery", label: "Mystery/Thriller" },
  { value: "sci-fi", label: "Sci-Fi/Fantasy" },
  { value: "non-fiction", label: "Non-Fiction" },
];

const GENRE_LABELS: Record<string, string> = {
  fiction: "Literary Fiction",
  mystery: "Mystery/Thriller",
  "sci-fi": "Sci-Fi/Fantasy",
  "non-fiction": "Non-Fiction",
};

export function JoinForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    favoriteGenre: "",
    age: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    } else if (formData.name.length > 50) {
      newErrors.name =
        "Keep it sweet! Please keep your full name under 50 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Whoops! That doesn't look like a valid email address.";
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.whatsapp.replace(/\s/g, ""))) {
      newErrors.whatsapp =
        "Please enter a valid WhatsApp number (e.g., +234...).";
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age) {
      newErrors.age = "Please enter your age.";
    } else if (isNaN(ageNum) || ageNum < 15 || ageNum > 30) {
      newErrors.age = "Please enter a valid age (15-30).";
    }

    if (!formData.favoriteGenre) {
      newErrors.favoriteGenre = "Please select your favorite genre.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    // 1. Honeypot check: Bots will fill this out, humans won't.
    if (honeypot) {
      console.log("Bot detected!");
      return;
    }

    // 2. Custom Validation
    if (!validate()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors in the form.",
      });
      return;
    }

    // 3. Simple Rate Limit: Wait 30 seconds between submissions from the same session.
    const now = Date.now();
    if (now - lastSubmitted < 30000) {
      setSubmitStatus({
        type: "error",
        message: "Please wait a moment before sending another request.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Send email notification via our secure backend Resend API route
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
      }

      setSubmitStatus({
        type: "success",
        message: "Welcome to the club! We'll be in touch soon. 📚",
      });
      setFormData({ name: "", email: "", whatsapp: "", favoriteGenre: "", age: "" });
      setLastSubmitted(now);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-warm-sand flex flex-col items-center justify-center min-h-screen px-6 md:px-12 overflow-hidden">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-rich-charcoal tracking-tighter">
            Join The <br className="md:hidden" /> Club.
          </h2>
          <p className="text-rich-charcoal/50 mt-4 text-lg md:text-xl font-medium max-w-md mx-auto">
            Become part of a community that reads between the lines.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Honeypot field (hidden from humans) */}
          <div className="hidden">
            <label htmlFor="website">
              Don&apos;t fill this out if you&apos;re human
            </label>
            <input
              id="website"
              type="text"
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label
              htmlFor="name"
              className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2"
            >
              <User weight="bold" className="text-vibrant-lilac" /> Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, name: val });
                if (val.length > 50) {
                  setErrors((prev) => ({
                    ...prev,
                    name: "Keep it sweet! Please keep your full name under 50 characters.",
                  }));
                } else if (
                  errors.name ===
                    "Keep it sweet! Please keep your full name under 50 characters." ||
                  (val.trim().length >= 2 && errors.name)
                ) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              className={`w-full p-4 bg-white border-4 ${errors.name ? "border-watermelon-pink" : "border-rich-charcoal"} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className="text-watermelon-pink text-xs font-bold">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label
              htmlFor="email"
              className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2"
            >
              <Envelope weight="bold" className="text-watermelon-pink" /> Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, email: val });
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (errors.email && emailRegex.test(val)) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              onBlur={(e) => {
                const val = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (val.trim() && !emailRegex.test(val)) {
                  setErrors((prev) => ({
                    ...prev,
                    email:
                      "Whoops! That doesn't look like a valid email address.",
                  }));
                }
              }}
              className={`w-full p-4 bg-white border-4 ${errors.email ? "border-watermelon-pink" : "border-rich-charcoal"} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="jane@itabc.club"
            />
            {errors.email && (
              <p className="text-watermelon-pink text-xs font-bold">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label
              htmlFor="whatsapp"
              className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2"
            >
              <WhatsappLogo weight="bold" className="text-green-600" /> WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, whatsapp: val });
                if (errors.whatsapp)
                  setErrors((prev) => ({ ...prev, whatsapp: "" }));
              }}
              onBlur={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val && (val.length < 7 || val.length > 15)) {
                  setErrors((prev) => ({
                    ...prev,
                    whatsapp: "Please enter a valid phone number.",
                  }));
                }
              }}
              className={`w-full p-4 bg-white border-4 ${errors.whatsapp ? "border-watermelon-pink" : "border-rich-charcoal"} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="e.g. 080 1234 5678"
            />
            {errors.whatsapp && (
              <p className="text-watermelon-pink text-xs font-bold">
                {errors.whatsapp}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label
              htmlFor="age"
              className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2"
            >
              <CalendarBlank weight="bold" className="text-vibrant-lilac" /> Age
            </label>
             <input
              id="age"
              type="number"
              min="15"
              max="30"
              value={formData.age}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, age: val });
                if (errors.age) {
                  setErrors((prev) => ({ ...prev, age: "" }));
                }
              }}
              onBlur={(e) => {
                const val = e.target.value;
                if (val.trim()) {
                  const ageNum = parseInt(val, 10);
                  if (isNaN(ageNum) || ageNum < 15 || ageNum > 30) {
                    setErrors((prev) => ({
                      ...prev,
                      age: "Please enter a valid age (15-30).",
                    }));
                  }
                }
              }}
              className={`w-full p-4 bg-white border-4 ${errors.age ? "border-watermelon-pink" : "border-rich-charcoal"} rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold`}
              placeholder="e.g. 25"
            />
            {errors.age && (
              <p className="text-watermelon-pink text-xs font-bold">
                {errors.age}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label
              htmlFor="genre"
              className="text-xs font-black uppercase tracking-[0.2em] text-rich-charcoal flex items-center gap-2"
            >
              <BookOpen weight="bold" className="text-forest-green" /> Genre
            </label>
            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 bg-white border-4 ${
                  errors.favoriteGenre
                    ? "border-watermelon-pink"
                    : "border-rich-charcoal"
                } rounded-2xl focus:ring-4 focus:ring-vibrant-lilac outline-none transition-all font-bold flex items-center justify-between text-left text-rich-charcoal cursor-pointer`}
              >
                <span
                  className={
                    formData.favoriteGenre
                      ? "text-rich-charcoal"
                      : "text-rich-charcoal/30"
                  }
                >
                  {formData.favoriteGenre
                    ? GENRE_LABELS[formData.favoriteGenre]
                    : "Select genre..."}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <CaretDown weight="bold" size={16} />
                </motion.div>
              </button>

              {/* Backdrop listener to close drop-down on click outside */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
              )}

              {/* Options List */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white border-4 border-rich-charcoal rounded-2xl p-2 shadow-[4px_4px_0px_#1A1A1A] z-50 max-h-60 overflow-y-auto flex flex-col gap-1"
                  >
                    {GENRES.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, favoriteGenre: g.value });
                          setIsOpen(false);
                          if (errors.favoriteGenre) {
                            setErrors((prev) => ({
                              ...prev,
                              favoriteGenre: "",
                            }));
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                          formData.favoriteGenre === g.value
                            ? "bg-vibrant-lilac text-white"
                            : "text-rich-charcoal hover:bg-rich-charcoal/5"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.favoriteGenre && (
              <p className="text-watermelon-pink text-xs font-bold">
                {errors.favoriteGenre}
              </p>
            )}
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
                Sending...{" "}
                <CircleNotch className="animate-spin" size={24} weight="bold" />
              </span>
            ) : (
              <span className="flex items-center gap-3">
                Request to Join <PaperPlaneRight weight="bold" />
              </span>
            )}
          </motion.button>

          {submitStatus.type && (
            <p
              className={`md:col-span-2 text-center font-black text-lg mt-2 ${
                submitStatus.type === "success"
                  ? "text-forest-green"
                  : "text-watermelon-pink"
              }`}
            >
              {submitStatus.message}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
