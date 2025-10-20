//@ts-nocheck
//@ts-ignore

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { usePathname, useRouter } from 'next/navigation';
const myFont = localFont({
    src: '../fonts/Tajawal-Bold.ttf',
    weight: '500',
});

const navVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

const mobileNavVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const list = [
    { link: '/', name: 'الرئيسية' },
    { link: '/aboutus', name: 'نبذة عنا' },
    { link: '/howtostart', name: 'كيفية الاستقدام' },
    { link: '/candidates', name: 'المرشحون' },
];

export default function NavigationBar() {
    const [phone, setPhone] = useState("");
    const [isSigned, setIsSigned] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

const pathname = usePathname()
    useEffect(() => {
        const item = localStorage.getItem("item");
        const Phone = localStorage.getItem("phone_number");
        setPhone(Phone);
        if (item) setIsSigned(true);
        // alert(pathname)
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`bg-white shadow-md fixed w-full z-10 ${myFont.className}`} dir='rtl'>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Image
                        src="/banner.png"
                        alt="روائس للاستقدام"
                        width={220}
                        height={40}
                        className="w-[180px] sm:w-[220px]"
                    />
                </div>

                {/* Burger Menu Button for Mobile */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className="w-6 h-0.5 bg-[rgb(1,55,73)]"></span>
                    <span className="w-6 h-0.5 bg-[rgb(1,55,73)]"></span>
                    <span className="w-6 h-0.5 bg-[rgb(1,55,73)]"></span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                <nav className="flex space-x-6 space-x-reverse gap-30">
                {list.map((item, index) => (
                            <motion.div
                                key={item.name}
                                custom={index}

                                initial="hidden"
                                animate="visible"
                                variants={navVariants}
                            >
                                <Link
                                    // style={{ color: "RGB(196, 158, 106)" }}
                                    href={item.link}
                                    
                                    className={`relative hover:text-gray-600 ${pathname ==item.link?"text-[rgb(1,55,73)] ":"text-[#ecc383]"} transition-colors duration-300 group`}
                                >
                                    {item.name}
                                    <span className={`absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full`}></span>
                                </Link>
                            </motion.div>
                        ))}
                      {isSigned ? (
                            <Link
                                style={{ color: "RGB(196, 158, 106)" }}
                                href={'/myorders/' + phone}
                                className="relative hover:text-gray-600 transition-colors duration-300 group"
                            >
                                تتبع الطلب
                                <span className="absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                            </Link>
                        ) : (
                            <Link
                                style={{ color: "RGB(196, 158, 106)" }}
                                href={'/login'}
                                className="relative hover:text-gray-600 transition-colors duration-300 group"
                            >
                                تتبع الطلب
                                <span className="absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                            </Link>
                        )} 
                    </nav>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <motion.div
                className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-20 ${isMenuOpen ? 'block' : 'hidden'}`}
                initial="hidden"
                animate={isMenuOpen ? "visible" : "hidden"}
                variants={mobileNavVariants}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="text-lg font-bold">القائمة</span>
                    <button onClick={toggleMenu} className="text-[rgb(1,55,73)]" aria-label="Close menu">
                        ✕
                    </button>
                </div>
                <nav className="flex flex-col p-4 gap-4">
                    {list.map((item, index) => (
                        <Link
                            key={item.name}
                            style={{ color: "RGB(196, 158, 106)" }}
                            href={item.link}
                            className="relative py-2 hover:text-gray-600 transition-colors duration-300 group"
                            onClick={toggleMenu}
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                        </Link>
                    ))}
                    {isSigned ? (
                        <Link
                            style={{ color: "RGB(196, 158, 106)" }}
                            href={'/myorders/' + phone}
                            className="relative py-2 hover:text-gray-600 transition-colors duration-300 group"
                            onClick={toggleMenu}
                        >
                            تتبع الطلب
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                        </Link>
                    ) : (
                        <Link
                            style={{ color: "RGB(196, 158, 106)" }}
                            href={'/login'}
                            className="relative py-2 hover:text-gray-600 transition-colors duration-300 group"
                            onClick={toggleMenu}
                        >
                            تتبع الطلب
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                        </Link>
                    )}
                </nav>
            </motion.div>

            {/* Overlay for Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-70 z-10"
                    onClick={toggleMenu}
                ></div>
            )}
        </header>
    );
}