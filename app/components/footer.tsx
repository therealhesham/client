//@ts-ignore
//@ts-nocheck
'use client';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import DualCarousel from '../components/carousel';
import FlagGrid from '../components/flagcard';
import NavigationBar from '../components/navigation';
import localFont from 'next/font/local';
import { FacebookIcon, Instagram, Mail, Map, MapPin, Phone, TwitterIcon, X } from 'lucide-react';
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
  
  <img src='./icon.png' className='h-20 w-20 ' style={{alignSelf:"center"}}/>
          <h3 className="text-xl font-semibold text-[#003749]"> تابعنا </h3>
       
          <div className="flex justify-center space-x-4 mt-4">
  
  <Instagram/>
  <TwitterIcon/>
  
  <FacebookIcon/>
          </div>
          
        </div>
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-[#003749] ${myFontJanna.className}`}>خارطة الموقع</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">الرئيسية</a></li>
            <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">نبذة عنا</a></li>
            <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">للتواصل</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#003749]">معلومات التواصل</h3>
          <div className="text-sm flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5 text-[#003749]" />
            <p>1234 شارع العريض المدينة المنورة الدولة</p>
          </div>
          <div className="text-sm flex items-center justify-center space-x-2">
            <Mail className="w-5 h-5 text-[#003749]" />
            <p>Email: <a href="mailto:admin@rawaes.com" className="hover:text-indigo-400 transition-colors duration-200">admin@rawaes.com</a></p>
          </div>
          <div className="text-sm flex items-center justify-center space-x-2">
            <Phone className="w-5 h-5 text-[#003749]" />
            <p>Phone: <a href="tel:+1234567890" className="hover:text-indigo-400 transition-colors duration-200">(123) 456-7890</a></p>
          </div>
       
        </div>
      </footer>
    )
}