//@ts-ignore
//@ts-nocheck
'use client';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import DualCarousel from '../components/carousel';
import FlagGrid from '../components/flagcard';
import NavigationBar from '../components/navigation';
import localFont from 'next/font/local';
import { FacebookIcon, Instagram, Mail, Map, MapPin, Phone, TwitterIcon, X } from 'lucide-react';
import { FaTiktok } from "react-icons/fa";
import { MapIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';


const myFont = localFont({
    src: '../fonts/ReadexPro-Bold.ttf',
    weight: '700',
});

const myFontJanna = localFont({
    src: '../fonts/janna.woff2',
    weight: '700',
});


const sectionFonts = localFont({
    src: '../fonts/MarkaziText-VariableFont_wght.ttf',
    weight: '700',
});

export default function Footer(){





    return(
        
        <footer className={`${myFontJanna.className} grid  sm:grid-cols-1   gap-8 p-10 bg-gradient-to-r from-[#ecc383] to-[#8d6c49] text-[#003749] text-center lg:grid-cols-3 md:grid-cols-1`}>
        <div className="space flex flex-col">
  
  <img src='./icon.png' className='h-30 w-30 ' style={{alignSelf:"center"}}/>
          <h3 className="text-3xl font-semibold text-[#003749]"> تابعنا </h3>
       
          <div className="flex justify-center space-x-4 mt-4">
        {/* رابط إنستغرام */}
        <a href="https://www.instagram.com/rawaes_rec" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 active:scale-95">
          <Instagram />
        </a>

        {/* رابط تويتر */}
        <a href="https://x.com/RawaesRce" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110 active:scale-95">
          <TwitterIcon />
        </a>

        {/* رابط تيك توك */}
        <a href="https://www.tiktok.com/@rawaesrce" target="_blank" rel="noopener noreferrer"  className="transition-transform hover:scale-110 active:scale-95"
>
  <FaTiktok className="w-6 h-6 " />
</a>
      </div>
          
        </div>
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-[#003749] ${myFontJanna.className}`}>روابط سريعة</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="/" className="hover:text-indigo-400 text-md transition-colors duration-200">الرئيسية</a></li>
            <li><a href="/aboutus" className="hover:text-indigo-400 text-md transition-colors duration-200">نبذة عنا</a></li>
            {/* <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">للتواصل</a></li> */}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#003749]">معلومات التواصل</h3>
          <div className="text-sm flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5 text-[#003749]" />
            <p>طريق الملك عبدالله، العريض، المدينة المنورة 42314</p>
          </div>
          <div className="text-sm flex items-center justify-center space-x-2">
            <Mail className="w-5 h-5 text-[#003749]" />
            <p>Email: <a href="mailto:rec2@rawaes.com" className="hover:text-indigo-400 transition-colors duration-200">rec2@rawaes.com</a></p>
          </div>
          <div className="text-sm flex items-center justify-center space-x-2">
            <Phone className="w-5 h-5 text-[#003749]" />
            <p>Phone: <a href="tel:+966555770723" className="hover:text-indigo-400 transition-colors duration-200">+966555770723</a></p>
          </div>
       
        </div>
      </footer>
    )
}