"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBookStore } from "@/lib/store";

const getTimeUntilNextMeeting = (customDate?: string) => {
  const now = new Date();
  let nextMeeting: Date;

  if (customDate) {
    nextMeeting = new Date(customDate);
  } else {
    const year = now.getFullYear();
    const month = now.getMonth();

    const getLastSaturdayOfMonth = (y: number, m: number) => {
      const lastDayOfMonth = new Date(y, m + 1, 0);
      const dayOfWeek = lastDayOfMonth.getDay();
      const lastSaturday = new Date(lastDayOfMonth);
      lastSaturday.setDate(lastDayOfMonth.getDate() - ((dayOfWeek + 1) % 7));
      lastSaturday.setHours(14, 0, 0, 0);
      return lastSaturday;
    };

    nextMeeting = getLastSaturdayOfMonth(year, month);
    if (now > nextMeeting) {
      nextMeeting = getLastSaturdayOfMonth(year, month + 1);
    }
  }

  const difference = nextMeeting.getTime() - now.getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export function Countdown() {
  const { meetingDate } = useBookStore();
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMeeting(meetingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextMeeting(meetingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [meetingDate]);

  return (
    <div className="flex flex-row gap-2 md:gap-8 justify-center items-center mt-4">
      {Object.entries(timeLeft).map(([label, value]) => (
        <motion.div
          key={label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center min-w-[55px] md:min-w-[100px]"
        >
          <div className="w-12 h-12 md:w-24 md:h-24 bg-watermelon-pink text-rich-charcoal flex items-center justify-center text-lg md:text-4xl font-black rounded-xl md:rounded-2xl border-[3px] md:border-4 border-rich-charcoal shadow-[3px_3px_0px_#1A1A1A] md:shadow-[4px_4px_0px_#1A1A1A]">
            {value.toString().padStart(2, "0")}
          </div>
          <span className="mt-2 md:mt-3 text-[7px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-rich-charcoal/40">
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
