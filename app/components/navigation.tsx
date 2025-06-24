'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';



const myFont = localFont({
    src: '../fonts/ReadexPro-Bold.ttf',
    weight: '700',
});

const navVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

const list = [

    { link: '/home', name: 'الرئيسية' },
    { link: '/aboutus', name: 'نبذة عنا' },

    { link: '/howtostart', name: 'كيفية الاستقدام' },

    { link: '/candidates', name: 'المرشحون' },
];

export default function NavigationBar() {
    const [phone,setphone]=useState("")
    const [isSigned, setIsSigned] = useState(false)
    useEffect(() => {
        const item = localStorage.getItem("item")

        const Phone = localStorage.getItem("phone_number")
setphone(Phone)
        if (item) setIsSigned(true)
    }, [])

    return (
        <header className={`bg-white shadow-md fixed w-full  z-10 ${myFont.className}`} dir='rtl' >
            <div className="container mx-auto px-4 py-4 flex justify-around  items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Image
                        src="/banner.png"
                        alt="روائس للاستقدام"
                        width={220}
                        height={40}
                    />
                </div>
                {/* Navigation */}
                <div className="flex items-center gap-6">
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
                                style={{color:"RGB(196, 158, 106)"}}
                                    href={item.link}
                                    className="relative  hover:text-gray-600 transition-colors duration-300 group"
                                >
                                    {item.name}
                                    <span className="absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>
                                </Link>
                            </motion.div>
                        ))}
                         {isSigned ?
                            <Link
                            style={{color:"RGB(196, 158, 106)"}}
                            href={'/myorders/'+phone}
                                className="relative text-gray-700 hover:text-gray-600 transition-colors duration-300 group"

                                // className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                            >
                                تتبع الطلب 
                                <span className="absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>

                            </Link>

                            :
                            <Link
                            style={{color:"RGB(196, 158, 106)"}}
                                href={'/login'}
                                
                                className="relative text-gray-700 hover:text-gray-600 transition-colors duration-300 group"
                                
                                // className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                            >
تتبع الطلب
<span className="absolute top-11 left-0 w-0 h-[4px] bg-[rgb(1,55,73)] transition-all duration-500 group-hover:w-full"></span>

                            </Link>}
                    </nav>
                 
                </div>
            </div>
        </header>
    );
}
