'use client';
import localFont from 'next/font/local';
import { motion } from 'framer-motion';
import DualCarousel from '../components/carousel';
import FlagGrid from '../components/flagcard';
import NavigationBar from '../components/navigation';



const myFont = localFont({
    src: '../fonts/ReadexPro-Bold.ttf',
    weight: '700',
});

export default function Home() {
    // Animation variants for hero section
    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    return (
        <div dir="rtl" className={`min-h-screen bg-gray-50 ${myFont.className}`}>
            {/* Header */}
            <NavigationBar />
            {/* Hero Section */}
            <main className="pt-20 px-20">
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                    className="container mx-auto px-4 py-16 text-center"
                >
                    <DualCarousel />
                </motion.section>
            </main>
            <div className='gap-9 bg-white'>
                <FlagGrid />
            </div>
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>جميع الحقوق محفوظة © 2025 روائس للاستقدام</p>
                    <p className="mt-2">
                        <a href="mailto:admin@rawaes.com" className="hover:underline">
                            admin@rawaes.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}