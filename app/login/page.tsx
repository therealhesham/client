'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';
import NavigationBar from '../components/navigation';
const myFont = localFont({
    src: '/fonts/Almarai-Regular.ttf',
    weight: '500',
});

export default function LoginPage() {
    const [phone, setPhone] = useState('+966');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempted with:', { phone });
        localStorage.setItem('item', 'code');
        router.push('/myorders/42');
    };

    return (
        <div>
            <NavigationBar />
            <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${myFont.className}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-center  mb-6"
                    >
                        <svg
                            className="w-48 h-48 mb-4"
                            preserveAspectRatio="xMidYMid meet"
                            data-bbox="3.999 3.999 192.002 192.004"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            data-type="ugc"
                            role="presentation"
                            aria-hidden="true"
                            aria-label=""
                        >
                            <g>
                                <defs>
                                    <linearGradient gradientUnits="userSpaceOnUse" y2="100" x2="196" y1="100" x1="4" id="23da6e02-e8bd-4f40-bb46-20f89387c16c_comp-lzbbhro9">
                                        <stop stop-color="#8d6c49" offset="0"></stop>
                                        <stop stop-color="#ebc181" offset="1"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M100.05 196C49.09 196.38 4.2 155.01 4 100.08 3.82 49.46 44.32 4.24 99.93 4c53.09-.23 96.32 43.14 96.07 96.34-.26 53.78-43.91 95.86-95.95 95.66m-12.02-83.81c7.2 1.51 14.46 2.13 21.67.39 18.42-4.43 30.8-15.76 35.51-34.06 4.62-17.95-.49-33.73-13.92-46.6-2.12-2.03-4.72-3.57-7.1-5.34.04-3.83.14-7.66.11-11.49-.02-3.73-.07-3.75-3.72-4.56-12.07-2.65-24.19-3.17-36.38-.9-24.86 4.62-44.78 17.12-59.35 37.78-13.94 19.76-18.9 41.82-15.72 65.74 1.63 12.29 5.71 23.72 12.19 34.28.27.55.48 1.15.82 1.65 21.67 31.96 51.82 46.29 90.12 42.06 21.58-2.39 39.89-12.34 54.82-28.21 4.48-4.76 8.69-9.78 11.54-15.76 1.53-1.8 2.57-3.91 3.6-6.01 8.03-16.49 11.12-33.79 8.92-52.08-1.22-10.15-4.11-19.75-8.43-28.96-.32-.69-.38-1.74-1.65-1.82-1.16 4.65-2.21 9.3-3.49 13.89-5.06 18.17-12.5 35.3-22.45 51.33-5.4-2.38-10.76-4.82-16.66-5.84-4.11-.71-7.97-.17-11.28 2.21-6.7 4.83-14.13 7.29-22.28 8.01-9.42.84-18.39-.55-26.82-4.95 1.29-1.31 2.63-2.58 3.87-3.94 2.06-2.25 4.65-4.03 6.1-6.83Z" fill="url(#23da6e02-e8bd-4f40-bb46-20f89387c16c_comp-lzbbhro9)"></path>
                                <path d="M78.07 122.95c8.44 4.39 17.4 5.79 26.83 4.95 8.15-.73 15.58-3.18 22.28-8.01 3.31-2.39 7.17-2.92 11.28-2.21 5.9 1.02 11.26 3.46 16.66 5.83 9.83 5.9 17.68 13.77 23.5 23.66-2.85 5.98-7.06 11-11.54 15.76-14.92 15.87-33.23 25.82-54.82 28.21-38.3 4.23-68.44-10.1-90.12-42.06-.34-.5-.55-1.1-.82-1.65.34-.51.7-1.01 1-1.54C31.4 130.26 45 121.07 62.6 117.51c3.35-.68 6.3-.17 9.08 1.82 1.99 1.42 4.01 2.85 6.38 3.63Z" fill="#ffffff"></path>
                                <path d="M124.2 26.58c2.38 1.77 4.97 3.31 7.1 5.34 13.43 12.87 18.54 28.65 13.92 46.6-4.71 18.3-17.09 29.63-35.51 34.06-7.21 1.74-14.47 1.12-21.67-.39-1.06-.33-2.13-.64-3.18-1-17.04-5.88-31.37-21.46-31.64-43.57-.21-16.55 6.81-29.96 20.51-39.39 10.15-6.99 21.48-9.63 33.8-7.54 5.92 1.01 11.3 3.42 16.67 5.89" fill="#ffffff"></path>
                                <path d="M124.2 26.58c-5.38-2.47-10.76-4.89-16.67-5.89-12.32-2.09-23.65.55-33.8 7.54-13.7 9.43-20.72 22.84-20.51 39.39.27 22.11 14.6 37.69 31.64 43.57 1.05.36 2.12.67 3.18 1-1.44 2.8-4.04 4.57-6.1 6.83-1.24 1.36-2.57 2.63-3.87 3.94-2.37-.79-4.39-2.21-6.38-3.63-2.78-1.99-5.73-2.49-9.08-1.82-17.59 3.57-31.19 12.75-40.28 28.38-.31.53-.67 1.03-1 1.54-6.48-10.57-10.56-22-12.19-34.28-3.18-23.92 1.78-45.98 15.72-65.74C39.43 26.75 59.35 14.25 84.21 9.63c12.19-2.27 24.31-1.75 36.38.9 3.65.8 3.7.83 3.72 4.56.02 3.83-.07 7.66-.11 11.49" fill="#003749"></path>
                                <path d="M178.61 147.17c-5.82-9.89-13.67-17.76-23.5-23.66 9.95-16.03 17.39-33.16 22.45-51.33 1.28-4.59 2.33-9.24 3.49-13.89 1.26.08 1.33 1.14 1.65 1.82 4.31 9.21 7.2 18.81 8.43 28.96 2.21 18.28-.89 35.59-8.92 52.08-1.02 2.1-2.06 4.21-3.6 6.01Z" fill="#003749"></path>
                            </g>
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800">تتبع الطلب</h1>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-lg font-medium text-gray-700 text-center">
                                ادخل رقم جوال الحجز
                            </label>
                            <div className="flex justify-center mt-2">
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={phone.slice(4)}
                                    onChange={(e) => setPhone('+966' + e.target.value)}
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none"
                                    placeholder="5XXXXXXXX"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#E5BC7E] text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-300 text-center"
                        >
                            الدخول
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}