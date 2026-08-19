'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import localFont from 'next/font/local';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const myFont = localFont({
  src: '../fonts/ReadexPro-Bold.ttf',
  weight: '700',
});

interface Candidate {
  id: number;
  Name: string;
  age: number;
  Nationalitycopy: string;
  Experience?: string;
  Picture?: { url: string };
}

const flags = [
  { nationality: "Philippines", displayName: "الفلبين", flagUrl: "https://flagcdn.com/w1280/ph.png" },
  { nationality: "Burundi", displayName: "بوروندي", flagUrl: "https://flagcdn.com/w1280/bi.png" },
  { nationality: "Ethiopia", displayName: "إثيوبيا", flagUrl: "https://flagcdn.com/w1280/et.png" },
  { nationality: "Uganda", displayName: "أوغندا", flagUrl: "https://flagcdn.com/w1280/ug.png" },
  { nationality: "Pakistan", displayName: "باكستان", flagUrl: "https://flagcdn.com/w1280/pk.png" },
  { nationality: "Bangladesh", displayName: "بنغلاديش", flagUrl: "https://flagcdn.com/w1280/bd.png" },
  { nationality: "Kenya", displayName: "كينيا", flagUrl: "https://flagcdn.com/w1280/ke.png" },
];

const getFlagUrl = (nationality: string) => {
  if (!nationality) return null;
  const match = flags.find(f => f.nationality.toLowerCase() === nationality.toLowerCase() || f.displayName === nationality);
  return match ? match.flagUrl : null;
};

const getAge = (age: any) => {
  if (!age) return '?';
  const num = Number(age);
  if (num > 1900 && num < 2100) {
    return new Date().getFullYear() - num;
  }
  return num;
};

export default function FeaturedCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Fetch candidates and take the first 10
        const response = await axios.get('/api/candidates');
        if (response.data && response.data.homemaids) {
          setCandidates(response.data.homemaids.slice(0, 10));
        } else if (Array.isArray(response.data)) {
          setCandidates(response.data.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ECC383]"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return null; // Don't show the section if no candidates are available
  }

  return (
    <section className={`py-4 px-4 md:px-8 bg-transparent ${myFont.className}`} dir="rtl">
      <div className="container mx-auto max-w-7xl">
        <div className="relative pl-24 md:pl-32 overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-12 px-2 !overflow-visible"
          >
            {candidates.map((candidate) => (
              <SwiperSlide key={candidate.id} className="pt-4 pb-8">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-[#ECC383]/50 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Section */}
                  <div className="relative h-80 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={candidate.Picture?.url || 'https://via.placeholder.com/400x500?text=No+Image'}
                      alt={candidate.Name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="p-3 bg-white flex justify-between items-center border-t border-gray-50 flex-grow">
                    <div className="flex flex-col">
                      <h3 className="text-[15px] font-bold text-[#003749] truncate max-w-[200px]">
                        {candidate.Name || 'عاملة منزلية'}
                      </h3>
                      <div className="flex items-center text-[11px] font-semibold text-gray-500 mt-1 gap-1.5">
                        {getFlagUrl(candidate.Nationalitycopy) && (
                          <img src={getFlagUrl(candidate.Nationalitycopy)!} alt={candidate.Nationalitycopy} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                        )}
                        <span>{candidate.Nationalitycopy || 'غير محدد'}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#ECC383] bg-[#ECC383]/10 px-1.5 py-0.5 rounded">{getAge(candidate.age)} سنة</span>
                      </div>
                    </div>

                    <Link 
                      href={`/cv/${candidate.id}`}
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#f8f9fa] hover:bg-[#ECC383] text-[#003749] rounded-full transition-colors duration-300 group/btn shadow-sm"
                    >
                      <svg className="w-5 h-5 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* View All Overlay (Fixed on the left) */}
          <Link 
            href="/candidates" 
            className="absolute top-4 bottom-12 left-0 w-24 md:w-32 z-10 flex flex-col items-center justify-center text-[#003749] hover:text-[#ECC383] transition-colors gap-3 pl-2 group/viewall cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent backdrop-blur-[3px] transition-all duration-300 group-hover/viewall:from-white group-hover/viewall:via-white/90"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-3 transform group-hover/viewall:scale-110 group-hover/viewall:-translate-x-2 transition-all duration-300">
              <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="font-bold text-base md:text-lg whitespace-nowrap">عرض الكل</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
