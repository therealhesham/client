// app/components/Navbar.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المرشحون", href: "/candidates" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[var(--cream)] shadow-lg fixed w-full h-[80] z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Icon */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-[var(--teal)]"
              >
                <HomeIcon className="h-8 w-8" />
              </motion.div>
              <span className="mr-2 text-xl font-bold text-gray-900">
                روائس للاستقدام
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-[var(--teal)] px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--sunflower)] text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#FFE033] transition duration-300"
              >
             تسجـيـل الدخول
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[var(--teal)] focus:outline-none"
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-[var(--cream)]"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 hover:text-[var(--teal)] px-3 py-2 rounded-md text-base font-medium transition duration-300"
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/signup" onClick={toggleMenu}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[var(--sunflower)] text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#FFE033] transition duration-300 mt-2"
            >
              اشترك الآن
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}