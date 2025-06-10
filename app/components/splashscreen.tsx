"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon } from "@heroicons/react/24/outline";

interface SplashScreenProps {
  onComplete: () => void; // Callback to hide splash screen
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2500); // Auto-dismiss after 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--teal)] to-[var(--coral)] z-50"
      role="dialog"
      aria-label="شاشة الترحيب"
    >
      <div className="relative text-center">
        {/* Textured Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-pixels.png')] opacity-15"></div>

        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <HomeIcon className="h-16 w-16 text-[var(--cream)] mx-auto" />
        </motion.div>

        {/* Animated Title */}
        <motion.h1
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold text-[var(--cream)] mb-4"
        >
          مرحبًا بكم
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-[var(--cream)]/80 max-w-md mx-auto"
        >
      منصة روائس للاستقدام
        </motion.p>

        {/* Animated Loading Dots */}
        <motion.div
          className="mt-6 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-3 w-3 rounded-full bg-[var(--sunflower)]"
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                },
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}