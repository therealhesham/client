//@ts-nocheck
//@ts-ignore

'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DualCarousel from './components/carousel';
import FlagGrid from './components/flagcard';
import NavigationBar from './components/navigation';
import { FacebookIcon, HomeIcon, Instagram, Mail, Map, MapPin, Phone, TwitterIcon, X ,Users, ClipboardList, BadgeCheck } from 'lucide-react';
import { MapIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import localFont from 'next/font/local';
import TextType from './components/TextType';
import Particles from './components/Particles';
import LogoLoop from './components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const myFont = localFont({
    src: './fonts/ReadexPro-Bold.ttf',
    weight: '700',
});

const myFontJanna = localFont({
    src: './fonts/janna.woff2',
    weight: '700',
});


const sectionFonts = localFont({
    src: './fonts/MarkaziText-VariableFont_wght.ttf',
    weight: '700',
});
export default function Home() {
    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };
    const SendEmail = async (data: { name: string; phone: string; email: string; message: string }) => {
      const response = await axios.post('/api/sendEmail', data);
      console.log(response);
    };
 
    const [search, setSearch] = useState("");
    const [nationalityFilter, setNationalityFilter] = useState("");
    const [ageFilter, setAgeFilter] = useState("");
    const [religionFilter, setReligionFilter] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Send only the phone number without +966 to the API
      await SendEmail({ ...formData, phone: formData.phone });
      setFormData({ name: "", phone: "", email: "", message: "" });
      setIsModalOpen(false);
    };

    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };

    const CounterBox = ({ target, label, accentColor, icon: Icon }: { 
      target: number; 
      label: string; 
      accentColor: string; 
      icon: React.ElementType;
    }) => {
      const [count, setCount] = useState(0);
    
      useEffect(() => {
        const totalUpdates = 40;        // عدد التحديثات الكلي (ليس لكل رقم!)
        const stepTime = 150;           // 150ms بين كل تحديث (أبطأ بكثير)
        const increment = Math.ceil(target / totalUpdates); // كم نضيف في كل خطوة
      
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(current);
          }
        }, stepTime);
      
        return () => clearInterval(timer);
      }, [target]);
    
      return (
        <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#ECC383]/40 text-center min-w-48 flex flex-col items-center">
          
          {/* العدد المتحرك */}
          <div className="relative w-full h-24 mb-4 flex items-center justify-center">
            <motion.div
              key={count}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <span className="text-5xl md:text-6xl font-extrabold text-[#003749] leading-none">
              {count}+
              </span>
            </motion.div>
          </div>
    
          {/* الأيقونة + النص في سطر واحد */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon className="w-6 h-6 text-[#ECC383]" />
            <p
              className="text-base md:text-lg font-semibold text-[#003749]/90 leading-tight"
              dangerouslySetInnerHTML={{ __html: label }}
              style={{ color: 'rgb(2, 48, 63)', opacity: 0.9 }}
            />
          </div>
          
          <style jsx>{`
            p span {
              color: ${accentColor};
              font-weight: bold;
            }
          `}</style>
    
          {/* خط فاصل */}
          <div className="mt-2 w-16 h-1 bg-[#ECC383] mx-auto rounded-full"></div>
        </div>
      );
    };
    
    const techLogos = [
      { 
        node: (
          <img 
            src="/Absher.svg" 
            alt="Absher" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: "منصة أبشر", 
        href: "https://absher.sa" 
      },
      { 
        node: (
          <img 
            src="/balady.svg" 
            alt="بلدي" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: "بلدي" , 
        href: "https://www.balady.gov.sa/ar" 
      },
      { 
        node: (
          <img 
            src="/Ministry of Human Resources and Social Development.svg" 
            alt="وزارة الموارد البشرية" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: "وزارة الموارد البشرية" , 
        href: "https://www.hrsd.gov.sa" 
      },
      { 
        node: (
          <img 
            src="/Ministry-of-Commerce-01-1.svg" 
            alt="وزارة التجارة" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: "وزارة التجارة", 
        href: "https://mc.gov.sa/ar/pages/default.aspx" 
      },
      { 
        node: (
          <img 
            src="/Ministry-of-Foreign-Affairs-01.svg" 
            alt=" وزارة الخارجية" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: " وزارة الخارجية" , 
        href: "https://visa.mofa.gov.sa" 
      },
      { 
        node: (
          <img 
            src="/Musaned- 01.svg" 
            alt="مساند" 
            className="w-50 h-50 object-contain"
          />
        ), 
        title: "مساند" , 
        href: "https://beta.musaned.com.sa/ar/marketplace?page=0&params={%22office_name%22:%22%D8%B1%D9%88%D8%A7%D8%A6%D8%B3%22}&officeNameSearch=%D8%B1%D9%88%D8%A7%D8%A6%D8%B3" 
      },
    ];
    
    return (
        <div dir="rtl" className={`min-h-screen bg-gray-50 `}>
            {/* Header */}
            {/* NavigationBar خارج main ويكون دائمًا في الأعلى */}
            <div className="relative z-50">
            <NavigationBar />
            </div>
            {/* Hero Section */}
            <main className="pt-20 px-20 relative min-h-screen overflow-hidden bg-white">
  {/* الخلفية: نقاط ذهبية ديناميكية */}
  <div className="absolute inset-0 z-0">
    <Particles
      particleCount={250}
      particleSpread={12}
      speed={0.12}
      alphaParticles={true}
      particleBaseSize={100}
      sizeRandomness={0.8}
      moveParticlesOnHover={true}
      particleHoverFactor={2.5}
      disableRotation={false}
      className="w-full h-full"
    />
  </div>

  {/* المحتوى الرئيسي - في المقدمة */}
  <div className="relative z-10">
    <motion.section
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className="container mx-auto px-4 py-16"
      dir="rtl"
    >
      {/* القسم العلوي: نص + صورة */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 text-right">
        
        {/* النص - على اليمين في وضع RTL */}
        <div className="lg:w-1/2 space-y-8 order-2 lg:order-1">
          {/* العنوان الرئيسي - بتأثير كتابة */}
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-sm text-[#ECC383]">
            <TextType
              text={["روائس للاستقدام"]}
              typingSpeed={100}
              deletingSpeed={30}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              textColors={["#ECC383"]}
              startOnVisible={true}
              dir="rtl"
              className="inline"
            />
          </h2>

          {/* الفقرة - تأثير كتابة تلقائية للجمل */}
          <p className="text-lg md:text-xl text-white/95 leading-relaxed font-medium h-20 flex items-center">
            <TextType
              text={[
                "تجربة استقدام لا مثيل لها ...",
                "عاملات ماهرات تم اختيارهم بعناية ...",
                "ضمان حقيقي وموثق ...",
                "خدمة عملاء متواجدة لخدمتكم دائما ..."
              ]}
              typingSpeed={90}
              deletingSpeed={30}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-[#003749] md:text-3xl"
              textColors={["#003749", "#003749", "#003749", "#003749"]}
              startOnVisible={true}
              dir="rtl"
              className="text-base md:text-3xl" // ← حجم مناسب للجمل
            />
          </p>

          {/* خط فاصل زخرفي */}
          <div className="w-80 h-1 bg-[#ECC383] rounded-full mt-4"></div>
        </div>

        {/* الصورة - على اليسار في وضع RTL */}
        <div className="lg:w-1/2 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="/banner.png"
              alt="روائس للاستقدام - تجربة استقدام مميزة"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl object-cover border-4 border-[#ECC383]/40"
            />
          </motion.div>
        </div>
      </div>

      {/* القسم السفلي: العدادات */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="py-16 px-4 mt-16"
      >
        <h3 className="text-3xl font-bold text-[#003749] mb-12 text-center bg-gradient-to-r from-[#003749] to-[#025669] bg-clip-text text-transparent">
          إحصائياتنا
        </h3>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-8">
          <CounterBox 
            target={1000} 
            label="عدد <span>عملائنا</span> السعداء" 
            accentColor="#ECC383" 
            icon={Users} 
  
          />
          <CounterBox 
            target={1000} 
            label="عدد <span>العقود</span> المنجزة" 
            accentColor="#ECC383" 
            icon={ClipboardList} 
          />
          <CounterBox 
            target={600} 
            label="عدد <span>العاملات</span> المتميزات</span> المتاحات" 
            accentColor="#ECC383" 
            icon={BadgeCheck} 
          />
        </div>
      </motion.div>
    </motion.section>
  </div>
</main>
            <div className={`gap-6  bg-white ${myFont.className}`}>
                <FlagGrid />
            </div>

            <div className={`relative w-full bg-cover bg-center bg-white  ${sectionFonts.className}`}  >
                <div className="grid lg:grid-cols-3 md:grid-cols-2    gap-6 p-6 max-w-6xl mx-auto h-full   ">
                   
                    <motion.div         
                    variants={heroVariants}
                      whileHover={{ scale: 1.10 }}
                      whileTap={{ scale: 0.95 }}
                    className="bg-white bg-opacity-80 p-4 flex flex-col gap-2  items-center justify-center rounded-lg shadow-lg">

                        {/* <div> */}
                            <svg preserveAspectRatio="xMidYMid meet" className='h-[150px] self-center' data-bbox="236.73 202.05 2568.99 1885.93" viewBox="0 0 3000 2000" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
                                <g>
                                    <defs>
                                        <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="rotate(-44.63 1218.895 384.908)" y2="1241.89" x2="19.18" y1="822.21" x1="219.67" id="88813891-03a3-4b21-b9de-350d692e4d8b_comp-lvv1tkks">
                                            <stop stop-color="#6ac578" offset="0"></stop>
                                            <stop stop-color="#4a974d" offset=".88"></stop>
                                        </linearGradient>
                                        <linearGradient xlinkHref="#88813891-03a3-4b21-b9de-350d692e4d8b_comp-lvv1tkks" gradientTransform="scale(-1 1) rotate(-44.63 -96.095 3588.796)" y2="1099.92" x2="-156.6" y1="680.25" x1="43.89" id="34b6d798-2239-46f8-9641-800134bec2c5_comp-lvv1tkks"></linearGradient>
                                        <clipPath id="5b259977-09c9-49d8-9da6-6cc71cd8e613_comp-lvv1tkks">
                                            <path stroke-width="0" d="M2505.79 1017.01v786.87H422.56v-786.87h2083.23z"></path>
                                        </clipPath>
                                    </defs>
                                    <g>
                                        <path d="M978.72 988.15c65.19-60.1 101.35-147.06 97.8-227.67-4.06-92.24-56.83-174.45-133.94-224.25-137.43-88.77-397.77-101.24-508.36 71.3-49.08 76.56-55.61 170.14-26.17 246.75 29.44 76.61 92.18 136.66 167.72 174.7 110.01 55.41 261.59 61.85 372.95-16.59a294.72 294.72 0 0 0 30-24.24Z" fill="#f0f0f0"></path>
                                        <path d="M2154.73 1802.14c301.18-190.33 473.07-727.7 181.34-987.58-119.91-106.82-299.73-124.66-457.42-91.3-146.01 30.88-247.7 118.7-359.27 204.67-126.55 97.51-283.84 231.38-447.43 242.5-173.21 11.78-377.32 20.15-488.1 169.36-118.83 160.06-63.98 314.5 52.52 462.35h1518.36Z" fill="#f0f0f0"></path>
                                        <g clip-path="url(#5b259977-09c9-49d8-9da6-6cc71cd8e613_comp-lvv1tkks)">
                                            <path d="M787.57 1879.46s-75.76-190.39-365.01-157.52c0 0 283.96 269.55 365.01 157.52Z" fill="#358e85"></path>
                                            <path d="M497.97 1747.62c158.22 28.9 291.17 128.37 413.32 227.57 6.01 4.91 18.5 15.23 24.47 20.25l-25.1-19.46c-124.54-95.99-255.99-194.64-412.69-228.35Z" fill="#328f7b"></path>
                                            <path d="M1002.66 1877.12s-201.7-80.28-217.71-479.76c0 0 315.27 355.25 217.71 479.76Z" fill="url(#88813891-03a3-4b21-b9de-350d692e4d8b_comp-lvv1tkks)"></path>
                                            <path d="M1002.66 1877.12s-201.7-80.28-217.71-479.76c0 0 315.27 355.25 217.71 479.76Z" fill="#358e85"></path>
                                            <path d="M823.12 1497.32c55.59 198.61 173.61 371.41 295.18 535.25l24.39 32.98c-6.4-8.15-18.91-24.19-25.19-32.38-124.69-161.56-243.48-335.61-294.37-535.85Z" fill="#328f7b"></path>
                                            <path d="M906.81 1863.3s-249.19 84.99-385.05-345.59c0 0 457.34 122.76 385.05 345.59Z" fill="#52ab83"></path>
                                            <path d="M593.94 1595.93c29.69 41.94 64.82 79.99 102.96 114.35 53.39 48.18 112.45 90 174.11 126.88 35.35 21.01 72.24 39.48 110.32 55.04-9.67-3.55-19.27-7.27-28.76-11.29-66.55-27.95-128.4-66.33-186.41-109.06-65.86-49.29-126.9-106.85-172.22-175.92Z" fill="#328f7b"></path>
                                            <path d="M989.49 1936.93s37.99-298.02-290.92-425.82c0 0 68.13 418.1 290.92 425.82Z" fill="#70ce78"></path>
                                            <path d="M762.82 1590.97c54.13 54.47 101.51 116.21 141.67 181.62 40.07 65.49 74.78 135.02 100.99 207.21 7.21 20.12 14.4 42.1 20.76 62.55-7.16-20.26-14.76-41.99-22.51-61.9-11.52-30.67-25.13-60.98-39.48-90.43-16.53-34.37-35.03-68.54-54.39-101.44-22.31-37.34-46.95-74.58-73.11-109.31-22.84-30.46-48.08-60.36-73.93-88.31Z" fill="#328f7b"></path>
                                            <path d="M2082.3 1877.88s75.76-190.39 365.01-157.52c0 0-283.96 269.55-365.01 157.52Z" fill="#358e85"></path>
                                            <path d="M2371.9 1746.05c-156.72 33.72-288.14 132.35-412.69 228.35l-25.1 19.46c6.17-5.15 18.27-15.2 24.48-20.25 122.14-99.19 255.12-198.67 413.32-227.57Z" fill="#328f7b"></path>
                                            <path d="M1852.15 1899.57s201.7-80.28 217.71-479.76c0 0-315.27 355.25-217.71 479.76Z" fill="url(#34b6d798-2239-46f8-9641-800134bec2c5_comp-lvv1tkks)"></path>
                                            <path d="M1852.15 1899.57s201.7-80.28 217.71-479.76c0 0-315.27 355.25-217.71 479.76Z" fill="#358e85"></path>
                                            <path d="M2031.69 1519.76c-50.9 200.26-169.67 374.28-294.37 535.85-6.13 7.95-18.95 24.45-25.19 32.37l24.39-32.98c121.56-163.83 239.59-336.64 295.18-535.25Z" fill="#328f7b"></path>
                                            <path d="M1948.01 1885.75s249.19 84.99 385.05-345.59c0 0-457.34 122.76-385.05 345.59Z" fill="#52ab83"></path>
                                            <path d="M2260.87 1618.38c-45.32 69.07-106.35 126.63-172.22 175.92-58.02 42.73-119.86 81.11-186.41 109.06-9.48 4.01-19.09 7.74-28.76 11.29 38.08-15.56 74.96-34.03 110.32-55.04 61.66-36.88 120.72-78.7 174.11-126.88 38.13-34.36 73.26-72.41 102.96-114.35Z" fill="#328f7b"></path>
                                            <path d="M1865.32 1959.38s-37.99-298.02 290.92-425.82c0 0-68.12 418.1-290.92 425.82Z" fill="#70ce78"></path>
                                            <path d="M2091.99 1613.41c-25.86 27.96-51.08 57.84-73.93 88.31-26.16 34.73-50.81 71.97-73.11 109.31-19.36 32.9-37.86 67.06-54.39 101.44-14.36 29.45-27.96 59.75-39.48 90.43-7.74 19.9-15.39 41.72-22.51 61.9 6.4-20.53 13.55-42.41 20.76-62.55 26.21-72.19 60.92-141.73 100.99-207.21 40.16-65.41 87.53-127.15 141.67-181.62Z" fill="#328f7b"></path>
                                        </g>
                                        <path d="M980.39 468.03s-123.52-6.04-57.99 370.4c0 0 44.08 127.78-11.57 210.14h819.13V468.03H980.39Z" fill="#013749"></path>
                                        <path d="M1855.79 662.64s-41.18-77.69 20.52-107.28c0 0 43.48-14.56 74.26-5.66 0 0-60.89 64.19-48.25 74.78 12.64 10.59 62.69-76.42 62.69-76.42s88.98 11.15 113.96 30.92c0 0-88.15 44.17-73.29 51.33 14.86 7.15 108.72-34.55 108.72-34.55s77.95 32.03 62.5 80.5c-15.44 48.47-45 46.3-56.98 42.22-11.98-4.08-69.57-59.78-83.24-26.77-3.99 9.64 32 52.3 61.92 60.64 0 0-71.32 50.16-105.2 23.43-33.88-26.73-30.64-56.29-51.88-72.43-21.24-16.14-41.45-20.66-34.16-7.43 7.29 13.23 47.72 33.58 55.88 60.57 8.15 26.99 16.66 45.88-21.3 31.12-37.96-14.75-95.36-57.87-90.75-91.42l4.6-33.55Z" fill="#82b378"></path>
                                        <path d="M2136.79 668.63s-218.22-58.01-281-5.99c0 0-18 29.78-57.67 51.66l-8.32 12.9s47.19-31.64 61.39-31c0 0-3.8-82.8 285.6-27.56Z" fill="#82b378"></path>
                                        <path d="M1798.11 714.3s-55.11 24.32-72.44 86.01l8.4 2.7s29.61-61.16 62.57-80.27 1.47-8.44 1.47-8.44Z" fill="#599dad"></path>
                                        <path d="M1584.66 522.5s-121.94-63.6-68.68-156.42c0 0 43.11-57.31 90.66-73.13 0 0-21.54 136.7 4.14 139.14 25.68 2.44 13.02-154.05 13.02-154.05s124.53-64.53 174.25-61.21c0 0-74.41 135.07-48.92 131.11 25.49-3.96 109.45-140.92 109.45-140.92s128.83-27.85 151.9 48.3c23.08 76.15-9.36 115.53-28.41 120.9-19.05 5.37-142.24 7.44-138.56 23.34 3.67 15.9 87.6 39.01 133.55 23.23 0 0-47.41 127.87-114.77 123.47-67.36-4.4-89.39-45.36-131.06-47.32-41.68-1.96-71.73 10.14-50.6 20.71 21.12 10.58 91.27.95 125.7 28.5 34.43 27.55 62.15 44.33.16 58.98-61.99 14.65-174.18 9.99-197.99-37.32l-23.82-47.31Z" fill="#a8d29f"></path>
                                        <path d="M1952.03 281.07s-332.61 118.75-367.37 241.44c0 0 3.22 54.33-28.51 117.7l.71 23.99s32.75-82.61 51.61-94.38c0 0-78.31-103.31 343.55-288.75Z" fill="#82b378"></path>
                                        <path d="M1556.15 640.2s-49.45 80.19-17.07 175.05l13.22-3.98s-16.08-105.07 9.44-158.91c25.52-53.84-5.59-12.17-5.59-12.17Z" fill="#6bb7bf"></path>
                                        <path fill="#010e20" d="M1887.53 690.84v1115.3h-855.2V690.84h855.2z"></path>
                                        <path fill="#013749" d="M1901.11 690.84v1115.3h-840.82V690.84h840.82z"></path>
                                        <path d="M1901.12 690.83h-.01l-840.82.01c4.65-63.58-2.36-109.75-13.58-142.96-21.56-63.84-58.73-79.86-58.73-79.86h792.98c67.68 0 120.16 40.77 134.44 94.89.53 2.04 1.03 4.06 1.46 6.09 13.56 61.92-15.18 120.69-15.73 121.82Z" fill="#010e20"></path>
                                        <path d="M1901.12 690.83h-.01l-840.82.01c4.65-63.58-2.36-109.75-13.58-142.96 85.93 15.73 298.75 49.26 526.55 43.62 147.37-3.66 263.83-13.52 343.61-22.49 13.56 61.92-15.18 120.69-15.73 121.82Z" fill="#010e20"></path>
                                        <path fill="#e9c181" d="M1854.14 796.56v42.38h-741.09v-42.38h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1055.25v19.44h-741.09v-19.44h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1100.99v19.44h-741.09v-19.44h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1146.74v19.44h-741.09v-19.44h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1192.49v19.44h-741.09v-19.44h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1238.23v19.44h-741.09v-19.44h741.09z"></path>
                                        <path fill="#e9c181" d="M1854.14 1283.98v19.44h-741.09v-19.44h741.09z"></path>
                                        <path d="M1330.06 1549.66c0 31.58-25.6 57.18-57.18 57.18s-57.18-25.6-57.18-57.18 25.6-57.18 57.18-57.18 57.18 25.6 57.18 57.18Z" fill="#e9c181"></path>
                                        <path d="M1569.47 1604.63a2.858 2.858 0 0 1-2.82-3.34c.53-3.14 13.54-77.12 54.58-102.3 2.92-1.79 4.75-.86 5.59-.14 3.6 3.08.86 10.93-11.49 40.56-4.92 11.81-10.76 25.8-13.16 34.31 4.37-5.73 10.91-15.54 16.1-23.34 16.23-24.36 19.39-28.33 22.55-28.33 1.17 0 2.23.55 2.89 1.5 1.72 2.47.42 6.61-4.06 18.75-1.72 4.65-4.35 11.78-5.11 15.61 2.33-2.1 5.75-6.56 7.82-9.25 5.62-7.32 8.47-10.81 11.83-10.29.7.11 2.42.61 3.23 2.88.34.94.5 2 .67 3.13.44 2.93.94 6.25 4.47 8.24 7.12 4.02 27.65 3.79 84.99-20.12 1.46-.61 3.13.08 3.74 1.54.61 1.46-.08 3.13-1.54 3.74-48.42 20.18-77.86 26.67-90 19.83-5.91-3.33-6.79-8.91-7.3-12.29-1.63 1.72-3.89 4.67-5.55 6.83-6.21 8.08-10.29 12.94-14.45 12.6-1.27-.11-2.35-.76-3.03-1.84-1.99-3.13-.04-9.29 4.87-22.59.79-2.13 1.69-4.57 2.47-6.84-3.97 5.43-9.36 13.52-13.73 20.08-18.18 27.29-21.47 31.25-25.13 30.25-.56-.15-2.41-.86-2.56-3.51-.36-6.38 5.59-21.2 14.71-43.08 4.64-11.12 10.71-25.68 12.2-32.08-37.32 25.07-49.84 96.39-49.97 97.12a2.87 2.87 0 0 1-2.82 2.38Zm63.31-45.58Z" fill="#e9c181"></path>
                                        <path d="m632.55 1797.93 287.47-.34c37.41-.04 67.99-30.69 67.95-68.1l-.15-124.58c-.04-37.41-30.69-67.99-68.1-67.95l-287.47.33c-37.41.04-67.99 30.69-67.95 68.11l.14 124.58c.04 37.41 30.69 67.99 68.1 67.95Z" fill="#a58353"></path>
                                        <path d="M940.86 1569.42v-.02c-10.76-18.67-30.1-31.86-52.53-34.06h-.07c-2.2-.21-4.42-.33-6.68-.33l-57.24.08-.04-26.89c0-5.99-2.35-11.65-6.62-15.91-4.27-4.25-9.94-6.6-15.93-6.58h-14.93l-60.1.08-10.84.02c-12.41.02-22.52 10.13-22.5 22.55l.03 26.89-98.81.1c-37.55.04-68.24 30.81-68.21 68.36l.16 126.03c.04 37.55 30.8 68.24 68.35 68.19l286.96-.32c5.06 0 9.99-.57 14.73-1.65h.05a67.228 67.228 0 0 0 21.15-8.69c19.36-12.1 32.29-33.63 32.27-58.03l-.14-126.01a67.698 67.698 0 0 0-9.07-33.8Zm-233.36-61.08c0-3.76 2.49-6.96 5.91-8.03.79-.25 1.62-.39 2.5-.39l12.76-.02 47.31-.04 25.79-.03c4.64 0 8.42 3.77 8.42 8.39l.04 26.88-102.69.11-.03-26.87Z" fill="#e9c181"></path>
                                        <path fill="#1c468a" d="M2805.72 1805.91v.46a2.5 2.5 0 0 1-2.5 2.5H239.23a2.5 2.5 0 0 1-2.5-2.5v-.46a2.5 2.5 0 0 1 2.5-2.5h2563.99a2.5 2.5 0 0 1 2.5 2.5z"></path>
                                        <path d="m1579.82 523.65 68.96 42.63 7.72-12.49-68.96-42.63c-3.45-2.13-7.98-1.07-10.11 2.39a7.35 7.35 0 0 0 2.39 10.11Z" fill="#013749"></path>
                                        <path d="m2318.22 913.89-18.5 44.59.37.23-.88 1.02-.51 1.24-.37-.23-31.62 36.48s-473.81-292.71-651.8-442.98c-5.7-4.81-7-13.08-3.08-19.43s11.9-8.88 18.76-5.93c213.99 92.04 687.63 385.02 687.63 385.02Z" fill="#e9c181"></path>
                                        <path d="M1622.11 527.88c.82 2.7 2.38 5.2 4.67 7.14C1804.77 685.29 2278.58 978 2278.58 978l25-28.84-3.87 9.33.37.23-.88 1.02-.51 1.24-.37-.23-31.62 36.48s-473.81-292.71-651.8-442.98c-5.7-4.81-7-13.08-3.08-19.43 2.35-3.8 6.15-6.21 10.29-6.93Z" fill="#a58353"></path>
                                        <path d="m2761.02 1270.89-82.02-50.7 22.97-37.16 82.02 50.7c10.26 6.34 13.44 19.81 7.09 30.07-6.34 10.26-19.81 13.44-30.07 7.09Z" fill="#013749"></path>
                                        <path d="m2253.55 1001.32 372.44 230.23c27.9 17.25 64.49 8.61 81.74-19.29s8.61-64.49-19.29-81.74L2316 900.29c-4.8-2.97-11.1-1.48-14.07 3.32l-51.7 83.63c-2.97 4.8-1.48 11.1 3.32 14.07Z" fill="#e9c181"></path>
                                        <path d="M2712.74 1202.08a58.976 58.976 0 0 1-5.02 10.18c-17.25 27.9-53.84 36.53-81.74 19.29l-372.44-230.23c-4.8-2.97-6.29-9.27-3.32-14.07l6.51-10.53 381.14 235.61c24.61 15.21 55.98 10.28 74.87-10.25Z" fill="#a58353"></path>
                                        <path d="m2367.91 918.4 36.81 23.41c3.68 12.77 14.08 26.14 29.26 35.8 15.18 9.65 31.7 13.4 44.83 11.32l219.95 139.89c30.67 19.5 39.75 60.32 20.24 90.99l-21.05 33.1c-3.35 5.27-1.79 12.25 3.47 15.6 5.27 3.35 12.25 1.79 15.6-3.47l21.05-33.1c26.19-41.18 14-96-27.18-122.19l-330.84-210.42c-5.27-3.35-12.25-1.8-15.6 3.47-3.35 5.27-1.79 12.25 3.47 15.6Z" fill="#013749"></path>
                                        <path fill="#a58353" d="m2255.95 992.78.78-16.06 45.1-72.96-63.42 71.11 17.54 17.91z"></path>
                                    </g>
                                </g>
                            </svg>
                        {/* </div> */}
<h2 className='text-xl' >إجراءات قانونية</h2>
                    </motion.div>
                    <motion.div 
                    
                    whileHover={{ scale: 1.10 }}
                    whileTap={{ scale: 0.95 }}
                  className="bg-white bg-opacity-80 p-4 flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg">

                       
                    <svg preserveAspectRatio="xMidYMid meet"  className='h-[150px]' data-bbox="236.73 202.05 2568.99 1885.93"  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <clipPath id="612c8804-987d-4051-8404-01d259758f45_comp-lvv1zk8f">
                <path d="M557.94 279.69v223.08H-20.21V279.69h578.15z" stroke-width="0"></path>
            </clipPath>
            <clipPath id="f3594511-8ccc-4eca-88a6-743e9ba46813_comp-lvv1zk8f">
                <path d="M203.97 394.91c0 18.678-15.142 33.82-33.82 33.82s-33.82-15.142-33.82-33.82 15.142-33.82 33.82-33.82 33.82 15.142 33.82 33.82z" stroke-width="0"></path>
            </clipPath>
            <clipPath id="7818943c-ae56-40f9-a74c-6ff7f8c5c418_comp-lvv1zk8f">
                <path d="M168.94 239.35c0 26.272-21.298 47.57-47.57 47.57-26.272 0-47.57-21.298-47.57-47.57 0-26.272 21.298-47.57 47.57-47.57 26.272 0 47.57 21.298 47.57 47.57z" stroke-width="0"></path>
            </clipPath>
            <clipPath id="7584406e-f9fe-4473-86b7-70c400012328_comp-lvv1zk8f">
                <path d="M203.97 92.04c0 18.678-15.142 33.82-33.82 33.82s-33.82-15.142-33.82-33.82 15.142-33.82 33.82-33.82 33.82 15.142 33.82 33.82z" stroke-width="0"></path>
            </clipPath>
            <linearGradient id="ec4eb141-f9df-4918-8336-34060d5639ed_comp-lvv1zk8f" x1="-475.23" y1="254.58" x2="-531.9" y2="373.22" gradientTransform="rotate(-44.63 -31.012 -365.1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#6ac578"></stop>
                <stop offset=".88" stop-color="#4a974d"></stop>
            </linearGradient>
            <linearGradient id="ce602dd1-8f0c-4756-a179-2daa8e330952_comp-lvv1zk8f" x1="-755.37" y1="-13" x2="-812.04" y2="105.64" gradientTransform="scale(-1 1) rotate(-44.63 -96.002 -206.756)" xlinkHref="#ec4eb141-f9df-4918-8336-34060d5639ed_comp-lvv1zk8f"></linearGradient>
        </defs>
        <g style={{ isolation: 'isolate' }}>
            <path fill="#f0f0f0" d="M150.37 205.72c16.58-15.29 25.78-37.4 24.87-57.9-1.03-23.46-14.45-44.37-34.06-57.03-34.95-22.57-101.16-25.75-129.29 18.13-12.48 19.47-14.14 43.27-6.65 62.75s23.44 34.75 42.65 44.43c27.98 14.09 66.53 15.73 94.85-4.22 2.69-1.9 5.24-3.96 7.63-6.16Z"></path>
            <path fill="#f0f0f0" d="M417.15 476.97c76.6-48.41 120.31-185.07 46.12-251.16-30.49-27.17-76.23-31.7-116.33-23.22-37.13 7.85-63 30.19-91.37 52.05-32.18 24.8-72.19 58.84-113.79 61.67-44.05 3-95.96 5.12-124.13 43.07-30.22 40.71-16.27 79.98 13.36 117.59h386.15Z"></path>
            <g clip-path="url(#612c8804-987d-4051-8404-01d259758f45_comp-lvv1zk8f)">
                <path fill="#358e85" d="M81.09 524.19s-21.02-53.98-101.3-44.66c0 0 78.8 76.42 101.3 44.66Z"></path>
                <path fill="#328f7b" d="M.72 486.82c41.12 7.71 76.07 33.01 107.91 58.87 4.55 3.77 9.1 7.54 13.59 11.39L108.3 546.1C76.03 520.85 41.41 495.82.72 486.82Z"></path>
                <path fill="url(#ec4eb141-f9df-4918-8336-34060d5639ed_comp-lvv1zk8f)" d="M140.79 523.53s-55.98-22.76-60.42-136.01c0 0 87.49 100.71 60.42 136.01Z"></path>
                <path fill="#358e85" d="M140.79 523.53s-55.98-22.76-60.42-136.01c0 0 87.49 100.71 60.42 136.01Z"></path>
                <path fill="#328f7b" d="M90.96 415.85c14.39 52.21 43.78 98.76 75.16 142.32 4.48 6.28 8.99 12.53 13.53 18.77-4.68-6.13-9.33-12.28-13.95-18.46-32.03-43.17-61.59-89.95-74.74-142.63Z"></path>
                <path fill="#52ab83" d="M114.19 519.61S45.04 543.7 7.33 421.64c0 0 126.92 34.8 106.86 97.97Z"></path>
                <path fill="#328f7b" d="M27.36 443.81c16.45 23.68 38.6 42.8 62.27 59 14.28 9.69 29.25 18.39 45.24 24.99-5.4-2.01-10.69-4.31-15.9-6.79-34.68-17.41-70.38-44.37-91.61-77.2Z"></path>
                <path fill="#70ce78" d="M137.13 540.48s10.54-84.49-80.74-120.72c0 0 18.91 118.53 80.74 120.72Z"></path>
                <path fill="#328f7b" d="M74.23 442.4c34.38 35.73 58.96 80.58 73.11 127.97-2.02-5.85-4.03-11.71-6.23-17.5-15.51-40.36-37.78-78.4-66.88-110.47Z"></path>
                <path fill="#358e85" d="M440.41 523.75s21.02-53.98 101.3-44.66c0 0-78.8 76.42-101.3 44.66Z"></path>
                <path fill="#328f7b" d="M520.78 486.37c-40.69 9-75.31 34.03-107.58 59.28l-13.92 10.98c4.49-3.84 9.04-7.61 13.59-11.38 31.84-25.86 66.79-51.16 107.91-58.87Z"></path>
                <path fill="url(#ce602dd1-8f0c-4756-a179-2daa8e330952_comp-lvv1zk8f)" d="M376.54 529.89s55.98-22.76 60.42-136.01c0 0-87.49 100.71-60.42 136.01Z"></path>
                <path fill="#358e85" d="M376.54 529.89s55.98-22.76 60.42-136.01c0 0-87.49 100.71-60.42 136.01Z"></path>
                <path fill="#328f7b" d="M426.37 422.22c-13.15 52.68-42.71 99.46-74.74 142.63-4.62 6.18-9.27 12.33-13.95 18.46 4.54-6.23 9.05-12.49 13.53-18.77 31.38-43.57 60.77-90.12 75.16-142.33Z"></path>
                <path fill="#52ab83" d="M403.14 525.97S472.29 550.06 510 428c0 0-126.92 34.8-106.86 97.97Z"></path>
                <path fill="#328f7b" d="M489.97 450.18c-21.24 32.84-56.91 59.78-91.61 77.2-5.2 2.48-10.49 4.79-15.9 6.79 15.99-6.6 30.96-15.3 45.24-24.99 23.67-16.2 45.82-35.32 62.27-59Z"></path>
                <path fill="#70ce78" d="M380.2 546.85s-10.54-84.49 80.74-120.72c0 0-18.91 118.53-80.74 120.72Z"></path>
                <path fill="#328f7b" d="M443.1 448.77c-29.1 32.07-51.37 70.11-66.88 110.47-2.2 5.79-4.21 11.64-6.23 17.5 14.15-47.38 38.73-92.24 73.11-127.97Z"></path>
            </g>
            <path d="M379.99 361.59V457c0 6.384-5.176 11.56-11.56 11.56H131.56c-6.384 0-11.56-5.176-11.56-11.56v-95.41c0-6.384 5.176-11.56 11.56-11.56h236.87c6.384 0 11.56 5.176 11.56 11.56z" fill="#013749"></path>
            <path d="M363.68 408.13v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 417.05v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 425.97v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 434.9v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 443.82v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 452.74v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M203.96 434.75v22.37h-67.64v-22.37h67.64z" fill="#f0f0f0"></path>
            <path d="M321.87 361.47v15.5h-106v-15.5h106z" fill="#f0f0f0"></path>
            <path d="M300.27 381.67v7.52h-84.4v-7.52h84.4z" fill="#f0f0f0"></path>
            <path d="M300.27 393.89v7.52h-84.4v-7.52h84.4z" fill="#f0f0f0"></path>
            <path d="M201.287 382.059c7.299 17.193-.723 37.048-17.917 44.346s-37.047-.724-44.346-17.917.724-37.048 17.917-44.346 37.048.724 44.346 17.917z" fill="#f0f0f0"></path>
            <g clip-path="url(#f3594511-8ccc-4eca-88a6-743e9ba46813_comp-lvv1zk8f)">
                <path fill="#fcd8ae" d="M163.92 398.99c.35.25 1.63 6.56.81 8.43s-13.46 2.44-15.29 7.58c-1.83 5.14-1.28 8.87-1.28 8.87s27.79 17.52 47.87-3.27c0 0 1.4-15.88-7.71-15.53-9.11.35-11.21.81-11.83-.12-.62-.93-1.74-4.73-1.74-4.73l-10.84-1.23Z"></path>
                <path fill="#e8ab89" d="m174.76 400.22-10.84-1.23c.24.17.89 3.06 1.04 5.52 1.63.61 3.38.92 5.12.91 2.07-.01 4.11-.44 6.06-1.15-.62-1.42-1.39-4.04-1.39-4.04Z"></path>
                <path fill="#d85565" d="M196.04 420.6s1.4-15.88-7.71-15.53c-7.03.27-9.88.6-11.1.31-.4 3.57-2.97 9.49-2.97 9.49-1.51 0-6.78-5.3-9.67-7.25-1.62 1.71-13.38 2.43-15.14 7.37-1.83 5.14-1.28 8.87-1.28 8.87s27.79 17.52 47.87-3.27Z"></path>
                <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width=".48" stroke="#b74162" d="M174.26 414.88s1.01 1.7 1.44 3.24c.96 3.46 2.1 10.02 2.07 11.83"></path>
                <path fill="#ea8189" d="M174.26 414.88s-8.46-.59-9.62 1.92c0 0-5.03-8.51-.33-9.94 0 0 7.75 4.38 9.95 8.02Z"></path>
                <path fill="#ea8189" d="M174.26 414.88c-.83-.52 3.05-7.05 2.08-10.21-.32-1.03 4.32-1.7 7.16 7.36 0 0-4.48-2.19-9.23 2.86Z"></path>
                <path d="M174.24 418.32a.76.76 0 1 1-1.52 0 .76.76 0 0 1 1.52 0z" fill="#8e2b5a"></path>
                <path d="M175.78 425.86a.76.76 0 1 1-1.52 0 .76.76 0 0 1 1.52 0z" fill="#8e2b5a"></path>
                <path fill="#e8ab89" d="M182.07 391c-.19-1.04-.5-2.82-1.77-3.09-.73-.15-1.36.32-1.34.95-.41.44-.64 1.14-.69 1.7-.06.68.07 1.36.22 2.02.2.85.43 2.1.89 2.86.5.84 1.43.4 2.01-.18 1.11-1.11.95-2.85.69-4.26Z"></path>
                <path fill="#e5b12e" d="M178.24 379.2c.19.06 2.07 8.27 1.77 10.79l-5.61-9.62 3.84-1.17Z"></path>
                <path fill="#fcd8ae" d="M159.83 393.64c2.23 7.67 9.04 10.27 14.05 9.35 3.18-.58 6.54-4.23 6.56-8.81.01-3.52-2.19-12.94-3.21-13.8-1.94-1.65-3.88-2.76-6.43-3.33-2.87-.64-6.14 0-8.4 1.78-1.18.92-2.31 2.44-2.72 4-.35.92-.51 1.93-.54 2.96-.05.32-.08.64-.11.97-.14 1.79.08 3.63.52 5.44.06.49.16.98.29 1.45Z"></path>
                <path fill="#e8ab89" d="m160.83 396.22.16.21c-.49-1.79-.32-3.75.48-5.43.56-1.19 1.45-2.31 1.43-3.63 0-.29-.04-.6.12-.84.09-.13.23-.21.37-.28 4.04-2.2 8.64-3.18 13.21-3.69.29-.03.98-.07 1.57-.1-.36-1.09-.69-1.87-.95-2.09-1.94-1.65-3.88-2.76-6.43-3.33-2.87-.64-6.14 0-8.4 1.78-1.18.92-2.31 2.44-2.72 4-.35.92-.51 1.93-.54 2.96-.05.32-.08.64-.11.97-.14 1.79.08 3.63.52 5.44.06.49.16.98.29 1.45.14.47.29.92.46 1.35.17.43.35.84.55 1.23Z"></path>
                <path fill="#f2d33b" d="M156.52 388.4c-.79-1.32-2.74-5.32-2.4-6.3.3-.84 8.15-9.61 12.75-10.71.15-.04.32-.07.46 0 .3.14.23.6.02.85-.21.26-.52.48-.56.8.83.35 1.79.06 2.67-.18 2.27-.63 4.66-.87 7.02-.72.69.04 1.51.21 1.78.83.06.15.08.32.01.46-.09.18-.31.27-.51.33-.58.2-1.17.39-1.75.59 1.38.22 2.72.66 3.96 1.28.43.21.89.52.94.98.05.49-.41.9-.89 1.09-.48.19-1.01.25-1.45.51 1.06.35 2.33 1 2.24 2.08-6.47 1.45-12.88 3.19-19.18 5.21-.18 1.02.19 2.06.1 3.08-.07.68-.28 2.08-.47 2.74-.59 2.05.27 4.64 0 6.66-.77-.79-1.61-3.59-2.18-4.54-1.03-1.72-1.51-3.33-2.54-5.05Z"></path>
                <path fill="#f7e861" d="M179.96 375.64c-1.24-.62-2.58-1.06-3.96-1.28.58-.2 1.17-.39 1.75-.59.2-.07.42-.15.51-.33.07-.14.05-.31-.01-.46-.26-.62-1.08-.78-1.78-.83-2.36-.15-4.74.1-7.02.72-.88.24-1.83.53-2.67.18.04-.32.35-.54.56-.8.21-.26.29-.71-.02-.85-.14-.07-.31-.03-.46 0-2.68.64-6.46 3.89-9.22 6.65a86.99 86.99 0 0 1 6.12-4.1c.32-.19.78-.37 1.02-.08.21.25.05.63-.17.88-.22.24-.5.47-.53.8 2.4-.67 4.81-1.34 7.21-2 .78-.22 1.63-.43 2.39-.14-.68 1.16-2.3 1.52-2.97 2.69 1.01.1 2.03-.08 3.04-.13 2.22-.09 4.45.52 6.33 1.7.44-.2.83-.58.78-1.04-.05-.46-.51-.77-.94-.98Z"></path>
                <path fill="#fcd8ae" d="M160.96 394.35c-.3-.37-.65-.69-1.06-.95-.75-.7-1.84-.65-2.53.17-.86 1.01-.57 2.48-.1 3.6.5 1.16 1.38 2.66 2.7 2.99 1.04.26 1.93-.3 2.21-1.29.6-1.42-.09-3.3-1.22-4.52Z"></path>
                <path fill="#e8ab89" d="M159.55 395.28c-.48-.34-1.36-.6-1.51.2-.01.07.1.09.12.03.37-1.06 1.8.53 2.01.85l.18.3c-.29 0-.57.1-.8.29-.24.19-.55.56-.49.89.02.1.16.14.22.05.07-.1.09-.21.15-.33.07-.15.18-.28.31-.38.21-.17.46-.27.73-.31.2.4.35.83.54 1.24.07.16.29.05.24-.11-.31-1-.79-2.09-1.69-2.72Z"></path>
            </g>
            <path fill="#c44141" d="m353.41 376.66 9.12-9.12a4.008 4.008 0 0 0 0-5.66 4.008 4.008 0 0 0-5.66 0l-9.12 9.12-9.12-9.12a4.008 4.008 0 0 0-5.66 0 4.008 4.008 0 0 0 0 5.66l9.12 9.12-9.12 9.12a4.008 4.008 0 0 0 0 5.66 4.008 4.008 0 0 0 5.66 0l9.12-9.12 9.12 9.12a4.008 4.008 0 0 0 5.66 0 4.008 4.008 0 0 0 0-5.66l-9.12-9.12Z"></path>
            <path d="M416.51 192.34v134.18c0 8.98-7.28 16.26-16.26 16.26H67.12c-8.98 0-16.26-7.28-16.26-16.26V192.34c0-8.98 7.28-16.26 16.26-16.26h333.13c8.98 0 16.26 7.28 16.26 16.26z" fill="#e9c181"></path>
            <path d="M393.55 257.78v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M393.55 270.33v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M393.55 282.88v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M393.55 295.43v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M393.55 307.98v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M393.55 320.53v6.17H185.67v-6.17h207.88z" fill="#f0f0f0"></path>
            <path d="M168.94 295.23v31.47H73.81v-31.47h95.13z" fill="#f0f0f0"></path>
            <path d="M334.75 192.17v21.8H185.67v-21.8h149.08z" fill="#f0f0f0"></path>
            <path d="M304.36 220.58v10.57H185.67v-10.57h118.69z" fill="#f0f0f0"></path>
            <path d="M304.36 237.75v10.57H185.67v-10.57h118.69z" fill="#f0f0f0"></path>
            <path d="M168.93 239.74c0 26.267-21.293 47.56-47.56 47.56-26.267 0-47.56-21.293-47.56-47.56 0-26.267 21.293-47.56 47.56-47.56 26.267 0 47.56 21.293 47.56 47.56z" fill="#f0f0f0"></path>
            <g clip-path="url(#7818943c-ae56-40f9-a74c-6ff7f8c5c418_comp-lvv1zk8f)">
                <path fill="#3e3647" d="M137.84 214.81c4.96 8.19.68 17.15 5.23 22.07 1.28 1.38-.73 4.46-.01 6.22.49 1.2 1.32 2.26 1.94 3.41.63 1.15 1.05 2.49.64 3.72-2.78.13-5.54.74-8.08 1.79-2.36.97-4.64 2.35-7.22 2.44-3.13.11-6.11-1.72-9.23-1.43-2.7.25-5.32 2.07-7.91 1.3-1.45-.43-2.48-1.57-3.56-2.56s-2.49-1.91-3.99-1.69c-1.32.19-2.33 1.22-3.62 1.58-1.52.43-3.33-.25-4.1-1.54 1.88-.31 2.62-2.44 2.68-4.21.1-2.99-.32-5.16.65-8.01.48-1.41 2.29-3.24 2.86-4.62 1.12-2.76-.38-6.14-.07-9.08.31-2.93 1.42-6.11 4.19-7.56"></path>
                <path fill="#fcbf95" d="M130.56 242.67s-4.25 12.18-1.16 13.59c3.1 1.41 18.97-2.47 21.96 11.46 3 13.93 0 19.75 0 19.75s-55.24 3.36-62.8-5.49c-2.55-2.99 6.31-15.48 9.42-17.67 5.75-4.03 15.72-4.18 17.18-9.29 1.46-5.11 1.32-9.12 1.32-9.12l14.07-3.23Z"></path>
                <path fill="#ea9071" d="m130.56 242.67-14.07 3.23s.1 2.9-.77 6.91c2.14.27 4.36.13 6.46-.35 2.24-.51 4.37-1.37 6.42-2.41.63-3.6 1.95-7.38 1.95-7.38Z"></path>
                <path fill="#6581aa" d="M136.49 256.81c-1.29.6-2.54 1.31-3.71 2.1-3.27 2.2-6.12 4.94-9.12 7.49-2.16 1.83-4.63 3.65-7.46 3.7-4.02.08-7.28-3.5-8.62-7.3-.26-.74-.46-1.52-.58-2.31-3.09 1.03-6.46 2.05-9 3.83-3.12 2.19-11.98 14.68-9.42 17.67 7.55 8.84 62.8 5.49 62.8 5.49s3-5.82 0-19.75c-1.92-8.93-9.13-10.54-14.88-10.92Z"></path>
                <path fill="#d3f2f4" d="M140.15 257.26c-1.24-.23-2.48-.37-3.66-.45-1.29.6-2.54 1.31-3.71 2.1-3.27 2.2-6.12 4.94-9.12 7.49-2.16 1.83-4.63 3.65-7.46 3.7-4.02.08-7.28-3.5-8.62-7.3-.26-.74-.46-1.52-.58-2.31-.81.27-1.63.54-2.45.82 1.55 4.07 4.79 10.61 9.64 10.62 8.68.02 10.65-3.32 19.37-10.48 2.47-2.03 4.68-3.34 6.6-4.19Z"></path>
                <path fill="#ea9071" d="M102.51 233.68c.09-1.64.21-4.43 2.11-5.09 1.09-.38 2.15.21 2.25 1.2.72.6 1.21 1.63 1.4 2.47.23 1.02.17 2.1.06 3.14-.13 1.34-.25 3.31-.8 4.56-.61 1.38-2.11.9-3.11.12-1.92-1.48-2.02-4.19-1.9-6.41Z"></path>
                <path fill="#fcbf95" d="M137.16 233.34c-1.9 12.21-11.84 17.98-18.18 18-5 .01-12.85-6.03-13.34-13.09-.24-3.42-.28-6.93 0-10.35.17-2.11.35-4.84 1.18-7.13.31-1.16.72-2.29 1.28-3.37 1.79-3.51 5.14-5.95 8.95-7.33 4.27-1.55 9.43-1.2 13.24 1.06 1.99 1.18 4.02 3.28 4.96 5.6.72 1.34 1.16 2.86 1.42 4.43.13.48.26.97.36 1.47.57 2.71.6 5.59.28 8.44 0 .77-.05 1.53-.15 2.27Z"></path>
                <path fill="#ea9071" d="M137.61 222.62c-.11-.5-.23-.98-.37-1.47-.26-1.58-.71-3.1-1.45-4.43-.96-2.32-3.02-4.42-5.05-5.6-3.89-2.26-9.14-2.61-13.49-1.06-3.87 1.38-7.29 3.82-9.11 7.33a17.76 17.76 0 0 0-1.3 3.37c-.85 2.28-1.03 5.02-1.2 7.13v.04c.41-.47.93-.83 1.52-1.02.64-.2 1.36-.23 1.87-.67.55-.47.82-1.38 1.54-1.44.44-.04.83.28 1.26.39.63.15 1.26-.18 1.79-.54 2.22-1.5 3.94-3.73 4.83-6.25-.14 1.97-.2 4.1.87 5.76 1.14 1.76 3.3 2.57 5.38 2.89.59.09 1.2.15 1.75.4.63.29 1.13.82 1.72 1.19 1.27.8 2.86.83 4.36.91.39.02.79.05 1.12.25.23.14.4.35.56.56.59.79 1.05 1.67 1.37 2.6l2.37-2.18c.28-2.75.25-5.52-.31-8.14Z"></path>
                <path fill="#3e3647" d="M121.79 223.54c.65.94 1.62 1.89 2.82 1.8.68-.05 1.38-.43 2-.18.29.12.5.36.67.6.59.84.94 1.95 1.92 2.37 1.06.46 2.54-.04 3.31.77.41.43.43 1.06.62 1.61.32.96 1.15 1.67 1.76 2.5.82 1.13 1.24 2.51 1.16 3.87.91-2.03 2.5-3.77 3.18-5.88.39-1.19.46-2.45.53-3.69.2-3.46.39-7.02-.84-10.29-1.61-4.26-5.59-7.54-10.13-9.11-1.38-.48-2.92-.81-4.32-.38-2.67.83-5.78 3.45-5.59 6.24.22 3.35.92 6.91 2.91 9.75Z"></path>
                <path fill="#fcbf95" d="M135.56 234.65c.38-.63.86-1.19 1.44-1.66 1.02-1.22 2.69-1.36 3.92-.24 1.52 1.39 1.37 3.69.86 5.5-.53 1.87-1.59 4.35-3.55 5.12-1.54.6-3.02-.08-3.65-1.54-1.21-2.06-.51-5.08.98-7.18Z"></path>
                <path fill="#ea9071" d="M137.9 235.79c.67-.61 1.97-1.19 2.36 0 .03.1-.13.16-.18.07-.78-1.55-2.66 1.17-2.92 1.69-.08.16-.15.32-.22.49.45-.05.89.05 1.29.29.41.25.96.75.93 1.27-.01.16-.21.24-.33.12-.13-.14-.19-.31-.3-.47-.14-.21-.34-.39-.55-.53-.35-.22-.76-.33-1.18-.33-.23.66-.38 1.34-.58 2.01-.08.26-.43.13-.39-.12.28-1.6.8-3.37 2.05-4.5Z"></path>
                <path fill="#3e3647" d="M119.94 214.45a38.86 38.86 0 0 1-6.8 8.21c-.49.44-1.12.91-1.74.7-.28-.09-.51-.3-.79-.37-.59-.13-1.11.43-1.37.97-.26.55-.45 1.19-.97 1.5-.33.2-.73.23-1.09.38-.86.36-1.34 1.32-1.51 2.24-.29 1.52-.16 3.13-.22 4.87-1.31-3.8-2.28-7.85-1.86-11.85.42-4 2.15-7.96 5.23-10.55 2.23-1.87 5.2-3.66 8.11-3.74 2.91-.08 5.31.53 7.63 2.28l-4.61 5.34Z"></path>
                <path fill="#545360" d="M112.98 209.26c2.27-1.3 4.86-2.01 7.48-2.1a13.45 13.45 0 0 0-3.53-.33c-2.91.08-5.88 1.86-8.11 3.74-3.08 2.59-4.81 6.55-5.23 10.55-.19 1.81-.09 3.63.2 5.43.29-1.8.62-3.59 1.04-5.36.31-1.31.64-2.61 1.14-3.86 1.34-3.37 3.86-6.27 7.01-8.07Z"></path>
            </g>
            <path fill="#8bc53f" d="M447.5 150.5c-14.56-11.33-33.87.51-45.33 11.02-9.93 9.11-16.51 21.02-18.39 33.93a50.039 50.039 0 0 0-22.26-11.93c-4.19-1.01-6.81 2.86-6.33 6.1-.5 1.52-.16 3.22 1.58 4.56 11.98 9.29 21.19 21.05 27.33 34.91 1.83 4.13 8.36 2.77 9.37-1.23 7.35-29.05 26.53-53.93 52.75-68.44 1.67-.92 2.42-2.32 2.51-3.76.73-1.75.56-3.77-1.23-5.16Z"></path>
            <path d="M379.99 58.34v95.41c0 6.384-5.176 11.56-11.56 11.56H131.56c-6.384 0-11.56-5.176-11.56-11.56V58.34c0-6.384 5.176-11.56 11.56-11.56h236.87c6.384 0 11.56 5.176 11.56 11.56z" fill="#013749"></path>
            <path d="M363.68 104.87v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 113.79v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 122.72v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 131.64v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 140.56v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M363.68 149.49v4.38H215.87v-4.38h147.81z" fill="#f0f0f0"></path>
            <path d="M203.96 131.5v22.37h-67.64V131.5h67.64z" fill="#f0f0f0"></path>
            <path d="M321.87 58.22v15.5h-106v-15.5h106z" fill="#f0f0f0"></path>
            <path d="M300.27 78.42v7.52h-84.4v-7.52h84.4z" fill="#f0f0f0"></path>
            <path d="M300.27 90.63v7.52h-84.4v-7.52h84.4z" fill="#f0f0f0"></path>
            <path d="M203.97 92.04c0 18.678-15.142 33.82-33.82 33.82s-33.82-15.142-33.82-33.82 15.142-33.82 33.82-33.82 33.82 15.142 33.82 33.82z" fill="#f0f0f0"></path>
            <g clip-path="url(#7584406e-f9fe-4473-86b7-70c400012328_comp-lvv1zk8f)">
                <path fill="#abae8d" d="M168.01 108.74s.03.04 0 .04-.03-.04 0-.04Z"></path>
                <path fill="#f48468" d="M161.73 91.25s1 8.66 0 11.57-15.08 5.82-15.66 12.57c-.58 6.75 27.89 13.96 27.89 13.96l16.56-9.54s.29-13.08-4.85-14.15c-5.15-1.06-11.29-1.61-12.18-3.48-.81-1.71-.57-5.67-.57-5.67l-11.19-5.26Z"></path>
                <path fill="#e05527" d="M173.49 102.18c-.81-1.71-.57-5.67-.57-5.67l-11.19-5.26s.44 3.83.44 7.25c.6.7 1.22 1.37 1.91 1.97 1.94 1.7 4.4 2.95 6.98 2.94 1.06 0 2.09-.22 3.11-.53-.31-.22-.55-.45-.68-.71Z"></path>
                <path fill="#e05527" d="M182.89 87.33c-.04-1.06-.08-2.86-1.29-3.32-.7-.26-1.39.11-1.47.74-.47.37-.8 1.03-.94 1.58-.16.66-.14 1.36-.08 2.03.07.87.12 2.14.46 2.96.37.9 1.35.61 2.01.12 1.26-.93 1.37-2.68 1.32-4.11Z"></path>
                <path fill="#510820" d="M161.94 74.82c.46-2.01 1.08-4.25 2.86-5.3.67-.4 1.44-.58 2.21-.71 2.76-.47 5.64-.34 8.29.56 2.65.9 5.05 2.61 6.62 4.92.69 1.02 1.24 2.21 1.22 3.44-.02 1.49-.68 3.78-1.34 5.11-.97 1.99-2.21 5.18-2.52 7.38-1.09-.48-1.76-2.96-2.85-3.44-1.31-.58-2.62-1.16-3.88-1.85a25.091 25.091 0 0 1-8.55-7.71"></path>
                <path fill="#f48468" d="M159.43 86.7c1.08 7.92 6.64 13.89 11.7 13.48 4.65-.38 8.56-5.31 8.97-9.87.2-2.21.28-4.48.14-6.69-.08-1.37-.16-3.13-.68-4.62-.19-.75-.44-1.49-.79-2.2-1.13-2.3-3.3-3.92-5.79-4.86-2.79-1.06-6.19-.91-8.73.5-1.33.74-2.69 2.06-3.34 3.55-.49.85-.8 1.83-1 2.85-.1.31-.18.62-.26.94-.41 1.74-.47 3.6-.3 5.45-.01.5.01.99.07 1.47Z"></path>
                <path fill="#e05527" d="M179.57 79c-.19-.75-.44-1.49-.79-2.2-1.13-2.3-3.3-3.92-5.79-4.86-2.79-1.06-6.19-.91-8.73.5-1.33.74-2.69 2.06-3.34 3.55-.49.85-.8 1.83-1 2.85-.1.31-.18.62-.26.94-.39 1.65-.45 3.39-.32 5.14l.96 1.83c.89-1.2 2.18-2.02 3.38-2.91 1.2-.89 2.37-1.95 2.86-3.36 1.01.5 2.21.15 3.3-.16 2.54-.75 5.19-1.31 7.83-1.02.72.08 1.48.26 2.14.58-.07-.29-.14-.58-.23-.86Z"></path>
                <path fill="#610c1d" d="M167 75.49c.39 2.45-.51 5.07-2.33 6.77-.83.78-1.84 1.37-2.57 2.24-1.53 1.8-1.6 4.39-1.6 6.75-3.34-4.22-4.42-10.12-2.81-15.25.21-.68.48-1.36.96-1.89.83-.92 2.15-1.2 3.39-1.27 1.38-.07 2.93.15 3.78 1.24l1.17 1.42Z"></path>
                <path fill="#f48468" d="M160.82 87.58c-.24-.41-.54-.78-.9-1.09-.64-.8-1.72-.91-2.53-.21-1 .87-.94 2.36-.63 3.54.32 1.22.97 2.83 2.22 3.36.99.41 1.95 0 2.38-.94.81-1.32.4-3.28-.53-4.65Z"></path>
                <path fill="#e05527" d="M159.3 88.29c-.43-.4-1.26-.8-1.52-.03-.02.07.08.11.11.05.52-.99 1.7.79 1.86 1.14.05.1.09.21.13.32-.29-.04-.58.02-.84.17-.27.15-.63.47-.62.81 0 .11.13.16.21.08.09-.09.12-.2.2-.3.1-.13.22-.25.36-.33.23-.14.5-.2.76-.19.14.43.23.87.35 1.3.05.17.28.09.25-.07-.16-1.04-.47-2.19-1.26-2.94Z"></path>
                <path fill="#610c1d" d="M175.31 69.38c-2.65-.9-5.53-1.03-8.29-.56-.77.13-1.54.31-2.21.71-1.78 1.05-2.4 3.28-2.86 5.3l2.06 2.43c.23.33.47.65.71.97.35.29.72.56 1.13.77 2.07 1.06 4.58.6 6.76-.19 2.18-.79 4.29-1.91 6.6-2.13 1.21-.12 2.55.07 3.41.92.2.2.35.42.49.66.02-.17.03-.34.03-.49.02-1.24-.52-2.42-1.22-3.44-1.57-2.32-3.97-4.02-6.62-4.92Z"></path>
                <path fill="#842531" d="M175.31 69.38c-2.65-.9-5.53-1.03-8.29-.56-.77.13-1.54.31-2.21.71-.59.35-1.04.83-1.41 1.39.45-.21.92-.39 1.39-.51 4.34-1.09 9.06.39 12.57 3.18.89.7 1.72 1.5 2.3 2.48.11.19.2.38.29.57.99.01 1.99.26 2.69.95.2.2.35.42.49.66.02-.17.03-.34.03-.49.02-1.24-.52-2.42-1.22-3.44-1.57-2.32-3.97-4.02-6.62-4.92Z"></path>
                <path fill="#e6e7e8" d="M179.87 107.67c-.2 2.12-.14 4.26-.49 6.36-.35 2.1-1.18 4.22-2.82 5.57-1.16.96-2.62 1.46-4.06 1.86-2.67.74-5.63 1.16-8.12-.05-1.67-.81-2.93-2.26-4.11-3.7-.98-1.2-3.75-3.63-2.72-5.44.9-1.59 5.01-.97 6.62-1.13 2.72-.27 5.42-.71 8.09-1.3.79-.18 7.55-1.5 7.62-2.18Z"></path>
                <path fill="#e4b326" d="M185.66 105.66c-3.23-.67-6.85-1.13-9.32-1.85-1.03 4.03-2.37 8-5.04 11.14-4.1-3.19-8.22-6.42-11.69-10.26-4.2 2.43-13.09 5.37-13.55 10.7-.58 6.75 27.89 13.96 27.89 13.96l16.56-9.54s.29-13.08-4.85-14.15Z"></path>
                <path fill="#fcca5b" d="M171.31 114.95c-.24-.19-9.85-9.62-9.82-11.71.02-1.75-5.03-2.24-5.79 1.59 0 0-3.52 1.38-2.45 3.14 1.07 1.76 8.67 5.98 18.05 6.98Z"></path>
                <path fill="#fcca5b" d="M171.31 114.95c.27.17 3.62-10.23 2.86-12.06-.6-1.44 3.06-1.96 4.28.92 0 0 4.25.12 3.22 1.79-1.03 1.67-5.65 7.49-10.35 9.34Z"></path>
                <path stroke-width=".96" stroke="#e6e7e8" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M170.49 115.67c.46 2.7.34 5.49-.35 8.14"></path>
                <path stroke-width=".96" stroke="#e6e7e8" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M172.71 115.33c.19 3.14.3 6.28.35 9.42"></path>
            </g>
            <path fill="#c44141" d="m358.24 80.02 9.12-9.12a4.008 4.008 0 0 0 0-5.66 4.008 4.008 0 0 0-5.66 0l-9.12 9.12-9.12-9.12a4.008 4.008 0 0 0-5.66 0 4.008 4.008 0 0 0 0 5.66l9.12 9.12-9.12 9.12a4.008 4.008 0 0 0 0 5.66 4.008 4.008 0 0 0 5.66 0l9.12-9.12 9.12 9.12a4.008 4.008 0 0 0 5.66 0 4.008 4.008 0 0 0 0-5.66l-9.12-9.12Z"></path>
        </g>
    </g>
</svg>                                

<h2 className='text-xl'>إستقدام عمالة مخصصة</h2>

  </motion.div>
  <motion.div 
                    
                    whileHover={{ scale: 1.10 }}
                    whileTap={{ scale: 0.95 }}
                  className="bg-white bg-opacity-80 p-4 flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg">

                    <svg preserveAspectRatio="xMidYMid meet" className='h-[150px]' data-bbox="7.868 78.092 486.866 488.577" viewBox="0 0 500 500" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="rotate(-44.63 -31.012 -365.1)" y2="375.08" x2="-523.9" y1="276.6" x1="-476.85" id="2f0c0650-6e80-41f4-80b5-97ef745b92ec_comp-lvv1tkky">
                <stop stop-color="#8bc47c" offset="0"></stop>
                <stop stop-color="#679653" offset=".88"></stop>
            </linearGradient>
            <linearGradient xlinkHref="#2f0c0650-6e80-41f4-80b5-97ef745b92ec_comp-lvv1tkky" gradientTransform="scale(-1 1) rotate(-44.63 -96.002 -206.756)" y2="124.23" x2="-785.53" y1="25.75" x1="-738.48" id="aa6ab0c8-a845-4140-87ca-f274f239704b_comp-lvv1tkky"></linearGradient>
            <clipPath id="311e2004-70b0-4733-925d-d4913636a2c8_comp-lvv1tkky">
                <path stroke-width="0" d="M499.27 315.35V500H10.4V315.35h488.87z"></path>
            </clipPath>
        </defs>
        <g>
            <path d="M145.93 203.47c15.3-14.1 23.78-34.51 22.95-53.43-.95-21.65-13.34-40.94-31.43-52.62-32.25-20.83-93.34-23.76-119.3 16.73-11.52 17.97-13.05 39.93-6.14 57.9s21.63 32.07 39.36 41c25.82 13 61.39 14.51 87.52-3.89 2.48-1.75 4.83-3.65 7.04-5.69Z" fill="#efefef"></path>
            <path d="M416.88 499.59c70.68-44.67 111.02-170.77 42.55-231.75-28.14-25.07-70.34-29.25-107.34-21.43-34.26 7.25-58.13 27.86-84.31 48.03-29.7 22.88-66.61 54.3-105 56.91-40.65 2.76-88.55 4.73-114.54 39.74-27.89 37.56-15.01 73.8 12.32 108.5h356.31Z" fill="#efefef"></path>
            <g clip-path="url(#311e2004-70b0-4733-925d-d4913636a2c8_comp-lvv1tkky)">
                <path d="M96.05 517.74s-17.78-44.68-85.66-36.96c0 0 66.64 63.25 85.66 36.96Z" fill="#5b8c83"></path>
                <path d="M28.09 486.8c34.59 6.34 64.21 27.21 91.21 48.7 3.86 3.13 7.7 6.28 11.53 9.45-3.92-3.06-7.85-6.1-11.8-9.11-27.36-20.96-56.7-41.65-90.94-49.04Z" fill="#5a8e7b"></path>
                <path d="M146.53 517.19S99.2 498.35 95.44 404.6c0 0 73.98 83.37 51.09 112.59Z" fill="url(#2f0c0650-6e80-41f4-80b5-97ef745b92ec_comp-lvv1tkky)"></path>
                <path d="M146.53 517.19S99.2 498.35 95.44 404.6c0 0 73.98 83.37 51.09 112.59Z" fill="#5b8c83"></path>
                <path d="M104.4 428.06c12.21 43.37 37.11 81.88 63.58 117.84 3.78 5.19 7.59 10.35 11.42 15.5-3.95-5.06-7.87-10.14-11.77-15.24-26.99-35.61-52.05-74.35-63.23-118.1Z" fill="#5a8e7b"></path>
                <path d="M124.03 513.94s-58.48 19.94-90.36-81.1c0 0 107.32 28.81 90.36 81.1Z" fill="#74a883"></path>
                <path d="M50.62 451.2c19.49 27.13 48.29 48.22 77.72 63.54 4.31 2.17 8.71 4.17 13.19 5.98-4.53-1.68-8.99-3.54-13.38-5.59-29.4-14.48-59.25-36.42-77.53-63.93Z" fill="#5a8e7b"></path>
                <path d="M143.44 531.22s8.91-69.94-68.27-99.93c0 0 15.99 98.11 68.27 99.93Z" fill="#91cc7c"></path>
                <path d="M90.25 450.04c28.94 29.44 49.79 66.54 61.82 105.93-1.68-4.87-3.42-9.72-5.28-14.53-13.15-33.5-32.03-64.98-56.54-91.4Z" fill="#5a8e7b"></path>
                <path d="M399.89 517.37s17.78-44.68 85.66-36.96c0 0-66.64 63.25-85.66 36.96Z" fill="#5b8c83"></path>
                <path d="M467.85 486.43c-34.25 7.4-63.58 28.08-90.94 49.04-3.95 3.01-7.88 6.05-11.8 9.11 3.83-3.17 7.67-6.32 11.53-9.45 26.99-21.49 56.62-42.36 91.21-48.7Z" fill="#5a8e7b"></path>
                <path d="M345.88 522.46s47.33-18.84 51.09-112.59c0 0-73.98 83.37-51.09 112.59Z" fill="url(#aa6ab0c8-a845-4140-87ca-f274f239704b_comp-lvv1tkky)"></path>
                <path d="M345.88 522.46s47.33-18.84 51.09-112.59c0 0-73.98 83.37-51.09 112.59Z" fill="#5b8c83"></path>
                <path d="M388.01 433.33c-11.18 43.76-36.23 82.49-63.23 118.1-3.9 5.1-7.82 10.18-11.77 15.24 3.83-5.15 7.64-10.31 11.42-15.5 26.46-35.97 51.37-74.48 63.58-117.84Z" fill="#5a8e7b"></path>
                <path d="M368.37 519.21s58.48 19.94 90.36-81.1c0 0-107.32 28.81-90.36 81.1Z" fill="#74a883"></path>
                <path d="M441.79 456.47c-18.27 27.5-48.13 49.46-77.53 63.93-4.38 2.05-8.85 3.92-13.38 5.59 4.48-1.81 8.88-3.81 13.19-5.98 29.43-15.32 58.22-36.4 77.72-63.54Z" fill="#5a8e7b"></path>
                <path d="M348.97 536.49s-8.91-69.94 68.27-99.93c0 0-15.99 98.11-68.27 99.93Z" fill="#91cc7c"></path>
                <path d="M402.16 455.3c-24.51 26.42-43.38 57.9-56.54 91.4-1.86 4.8-3.6 9.66-5.28 14.53 12.02-39.39 32.88-76.49 61.82-105.93Z" fill="#5a8e7b"></path>
            </g>
            <path d="M402.62 263.33s18.77-17.1 16.25-25.63c-2.53-8.53 1.8-17.98-4.03-28.27-5.82-10.29-8.48-8.55-22.17-11.02-13.69-2.48-15.8-9.94-27.94-.61-11.89 9.15-9.32 14.86 5.71 16.21 9 .8 20.07-1.79 21.11 14.56 1.27 20.03 11.07 34.77 11.07 34.77Z" fill="#7fc991"></path>
            <path d="M410.44 300.28c-4.54-3.33 1.18-16.37 9.92-22.61 6.04-4.31 11.14.53 19.83-4.98 6.14-3.89 6.32-8.03 10.87-8.48 5.38-.53 6.77 5.09 14.92 7.75 7.84 2.56 10.32-1.41 15.05 1.22 8.68 4.82 12.84 25.11 6.57 30.43-3.84 3.25-10.92-8.75-20.43-6.05-4.74 1.35-5.03 4.76-9.68 5.38-6.52.86-9.04-5.43-15.56-7.33-12.6-3.68-26.42 8.41-31.49 4.69Z" fill="#7fc991"></path>
            <path d="M367.06 387.41c3.57-12.09 7.65-24.04 12.27-35.78 2.27-5.89 4.77-11.68 7.39-17.43 2.6-5.75 5.44-11.4 8.54-16.91 3.15-5.47 6.55-10.86 10.82-15.58l3.24-3.48c1.11-1.13 2.31-2.17 3.46-3.26.59-.53 1.14-1.1 1.76-1.59l1.86-1.48c1.24-.98 2.47-1.99 3.81-2.84 5.19-3.62 10.87-6.57 16.86-8.6 5.99-1.97 12.3-3.24 18.61-2.96-6.31-.12-12.55 1.31-18.45 3.42-5.91 2.11-11.5 5.1-16.58 8.77-1.31.86-2.51 1.87-3.73 2.86l-1.83 1.47c-.61.49-1.16 1.06-1.74 1.58-1.13 1.08-2.32 2.11-3.41 3.24l-3.19 3.46c-4.18 4.66-7.52 10.02-10.63 15.47-3.11 5.46-5.96 11.08-8.58 16.8-2.64 5.71-5.12 11.5-7.5 17.33-2.38 5.83-4.65 11.71-6.79 17.63-2.18 5.91-4.26 11.86-6.19 17.86Z" fill="#40635b"></path>
            <path d="M379.35 340.95c2.9-10.43 5.92-20.82 8.96-31.2l9.25-31.11c3.13-10.36 6.23-20.72 9.07-31.15 1.4-5.22 2.76-10.46 3.61-15.78.42-2.66.72-5.35.52-8.03-.13-1.33-.41-2.66-.93-3.9-.51-1.24-1.3-2.36-2.24-3.33.98.93 1.81 2.03 2.38 3.27.57 1.24.88 2.58 1.05 3.93.28 2.71.06 5.45-.29 8.13-.76 5.38-2.04 10.65-3.35 15.9-2.7 10.49-5.81 20.86-8.86 31.24l-9.48 31.04c-3.2 10.33-6.41 20.67-9.7 30.98Z" fill="#40635b"></path>
            <path d="M383.42 349.65s.85-21.19 7.75-23.93c6.9-2.74 10.88-10.45 20.63-11.94 9.76-1.48 9.98 1.16 18.67 8.87 8.69 7.71 14.67 5.25 14.8 18.02.13 12.52-4.95 13.78-13.58 4.61-5.17-5.49-9.17-14.1-20.44-6.34-13.8 9.5-27.83 10.71-27.83 10.71Z" fill="#7fc991"></path>
            <path d="M369.78 388.07a184.9 184.9 0 0 1 4.91-17.7c1.93-5.82 4.2-11.53 6.81-17.09 2.69-5.52 5.72-10.9 9.45-15.8.89-1.26 1.93-2.4 2.93-3.56.96-1.2 2.12-2.23 3.2-3.32.28-.27.55-.54.83-.8l.9-.73 1.79-1.45c1.21-.94 2.55-1.7 3.83-2.55l-1.85 1.36c-.6.47-1.27.85-1.81 1.39l-1.7 1.53-.85.76c-.27.27-.52.55-.78.83-1.03 1.12-2.14 2.16-3.06 3.38-.96 1.18-1.95 2.34-2.79 3.61-3.56 4.94-6.56 10.26-9.16 15.77-2.67 5.48-4.91 11.17-6.99 16.91l-1.51 4.32-1.42 4.36-1.38 4.37-1.32 4.4Z" fill="#40635b"></path>
            <path fill="#94c8e3" d="M271.51 93.91v27.83h-31.93V93.91h31.93z"></path>
            <path d="M276.83 109.73h-42.58V81.04c13.59-3.93 28.98-3.93 42.58 0v28.69Z" fill="#213a4a"></path>
            <path d="M236.94 82.78c1.51.41 3.03.73 4.56.97 1.53.27 3.06.48 4.6.61 3.08.29 6.17.42 9.27.38 1.54-.06 3.09-.06 4.63-.2l2.32-.16c.77-.09 1.54-.17 2.31-.24 3.09-.31 6.14-.86 9.22-1.37-1.49.44-3 .86-4.51 1.24-1.53.3-3.05.68-4.6.89-3.09.54-6.22.74-9.35.84-3.13.01-6.27-.15-9.37-.62-3.09-.48-6.18-1.14-9.07-2.34Z" fill="#94c8e3"></path>
            <path d="M236.96 87.93c.24 3.21.28 6.39.4 9.56.04 1.59.11 3.17.19 4.75.11 1.58.18 3.17.46 4.75-.66-1.48-1-3.08-1.24-4.67-.25-1.59-.36-3.2-.41-4.8-.08-3.21.06-6.42.6-9.59Z" fill="#94c8e3"></path>
            <path d="M242.69 89.01c.36 3.01.46 6.02.54 9.02l.07 4.5.04 2.25c.03.74.02 1.5.23 2.23-.72-1.37-.86-2.93-1.06-4.42-.17-1.51-.25-3.02-.29-4.52-.05-3.02.03-6.03.45-9.04Z" fill="#94c8e3"></path>
            <path d="M249.17 90.04c.26 2.69.32 5.35.44 8.01.04 1.33.1 2.65.18 3.98.1 1.32.16 2.65.4 3.98-.61-1.22-.94-2.55-1.17-3.89-.24-1.34-.35-2.68-.41-4.03-.09-2.69.04-5.39.56-8.05Z" fill="#94c8e3"></path>
            <path d="M273.35 87.93c.55 3.17.68 6.38.6 9.59-.06 1.6-.17 3.21-.41 4.8-.24 1.59-.58 3.19-1.24 4.67.28-1.58.35-3.17.46-4.75.09-1.58.15-3.17.19-4.75.11-3.18.16-6.36.4-9.56Z" fill="#94c8e3"></path>
            <path d="M267.61 89.01c.42 3.01.51 6.02.45 9.04-.04 1.51-.12 3.02-.29 4.52-.19 1.49-.34 3.06-1.06 4.42.22-.72.2-1.48.23-2.23l.04-2.25.07-4.5c.09-3 .18-6 .54-9.02Z" fill="#94c8e3"></path>
            <path d="M261.14 90.04c.52 2.66.65 5.35.56 8.05-.06 1.35-.17 2.7-.41 4.03-.23 1.33-.56 2.67-1.17 3.89.24-1.33.3-2.66.4-3.98.08-1.32.14-2.65.18-3.98.12-2.66.17-5.32.44-8.01Z" fill="#94c8e3"></path>
            <path d="M255.25 90.04c.42 2.66.52 5.33.51 7.99-.02 1.33-.06 2.67-.17 4-.11 1.33-.25 2.68-.64 3.97 0-1.34-.12-2.66-.14-3.99-.05-1.33-.05-2.66-.05-3.99.03-2.66.12-5.32.49-7.98Z" fill="#94c8e3"></path>
            <path fill="#344c82" opacity=".11" d="M386.44 406.22c0 1.397-55.87 2.53-124.79 2.53-68.92 0-124.79-1.133-124.79-2.53 0-1.397 55.87-2.53 124.79-2.53 68.92 0 124.79 1.133 124.79 2.53z"></path>
            <path fill="#f3f8fa" d="M386.23 261.3c0 70.814-57.406 128.22-128.22 128.22S129.79 332.114 129.79 261.3s57.406-128.22 128.22-128.22 128.22 57.406 128.22 128.22z"></path>
            <path fill="#ffffff" d="M334.71 206.87c0 26.725-21.665 48.39-48.39 48.39s-48.39-21.665-48.39-48.39 21.665-48.39 48.39-48.39 48.39 21.665 48.39 48.39z"></path>
            <path d="M144.4 338.96s-22.67 65.33-15.79 67.2c6.89 1.87 56.08-39.49 56.08-39.49l-40.3-27.71Z" fill="#4c649e"></path>
            <path d="M370.81 338.96s22.67 65.33 15.79 67.2c-6.89 1.87-56.08-39.49-56.08-39.49l40.3-27.71Z" fill="#213a4a"></path>
            <path d="M258.01 117.68c-79.32 0-143.62 64.3-143.62 143.62s64.3 143.62 143.62 143.62 143.62-64.3 143.62-143.62-64.3-143.62-143.62-143.62Zm0 271.84c-70.81 0-128.22-57.41-128.22-128.22s57.41-128.22 128.22-128.22 128.22 57.4 128.22 128.22-57.41 128.22-128.22 128.22Z" fill="#213a4a"></path>
            <path style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23" d="M253.02 267.34h8.51l-4.26-75.54-4.25 75.54z"></path>
            <path fill="#dfc184" d="M251.76 265.61h8.51l-4.26-75.54-4.25 75.54z"></path>
            <path style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23" d="m253.28 265.16 6.44 5.56 62.16-78.45-68.6 72.89z"></path>
            <path fill="#dfc184" d="m252.02 263.42 6.44 5.57 62.16-78.45-68.6 72.88z"></path>
            <path style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23" d="M266.65 263.33c0 5.876-4.764 10.64-10.64 10.64s-10.64-4.764-10.64-10.64 4.764-10.64 10.64-10.64 10.64 4.764 10.64 10.64z"></path>
            <path style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23" d="M266.65 267.37c0 5.876-4.764 10.64-10.64 10.64s-10.64-4.764-10.64-10.64 4.764-10.64 10.64-10.64 10.64 4.764 10.64 10.64z"></path>
            <path fill="#dfc184" d="M266.65 265.61c0 5.876-4.764 10.64-10.64 10.64s-10.64-4.764-10.64-10.64 4.764-10.64 10.64-10.64 10.64 4.764 10.64 10.64z"></path>
            <path d="M251.27 268.84c.83 2.73 3.82 4.08 6.12 3.42 3.18-.9 4.65-5.5 2.7-8.1-1.25-1.67-3.8-2.36-5.94-1.44-2.3.99-3.63 3.63-2.88 6.12Z" style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="M258.01 139.75v12.26"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m197.24 156.04 6.13 10.61"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m152.75 200.53 10.61 6.12"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="M136.47 261.3h12.25"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m152.75 322.07 10.61-6.13"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m197.24 366.56 6.13-10.61"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="M258.01 382.85v-12.26"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m318.79 366.56-6.13-10.61"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m363.28 322.07-10.62-6.13"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="M379.56 261.3h-12.25"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m363.28 200.53-10.62 6.12"></path>
            <path stroke-miterlimit="10" fill="none" stroke="#dfc184" stroke-width="6" d="m318.79 156.04-6.13 10.61"></path>
            <path d="M258.01 139.74c69.66 0 126.34 55.55 128.17 124.76.03-1.06.05-2.13.05-3.2 0-70.81-57.41-128.22-128.22-128.22s-128.22 57.4-128.22 128.22c0 1.07.02 2.13.05 3.2 1.83-69.21 58.51-124.76 128.17-124.76Z" style={{ mixBlendMode: 'multiply' }} fill="#94c8e3" opacity=".23"></path>
            <path d="M251.27 267.13c.83 2.73 3.82 4.08 6.12 3.42 3.18-.9 4.65-5.5 2.7-8.1-1.25-1.67-3.8-2.36-5.94-1.44-2.3.99-3.63 3.63-2.88 6.12Z" fill="#4c649e"></path>
            <path d="M286.32 124.31c9.51 1.59 18.74 4.63 27.61 8.43 8.87 3.81 17.29 8.66 25.18 14.24 3.91 2.84 7.65 5.91 11.24 9.14 3.55 3.28 6.96 6.71 10.1 10.38 6.29 7.33 11.66 15.43 15.99 24.03-2.41-4.17-4.83-8.33-7.66-12.22-2.71-3.97-5.75-7.69-8.91-11.31-3.21-3.57-6.58-6.99-10.13-10.21-3.59-3.18-7.32-6.21-11.21-9.01-7.78-5.61-16.15-10.41-24.91-14.35a142.76 142.76 0 0 0-13.4-5.28c-4.55-1.55-9.18-2.89-13.89-3.85Z" fill="#94c8e3"></path>
            <path d="M255.83 395.45c-9.64.16-19.27-1.16-28.68-3.29-9.42-2.14-18.58-5.38-27.34-9.44-4.36-2.08-8.59-4.43-12.71-6.95-4.08-2.58-8.06-5.34-11.81-8.38a119.087 119.087 0 0 1-20.08-20.74c3.12 3.67 6.26 7.31 9.75 10.63 3.38 3.41 7.05 6.52 10.81 9.51 3.81 2.93 7.73 5.68 11.81 8.21 4.11 2.48 8.32 4.78 12.66 6.82 8.67 4.1 17.77 7.31 27.09 9.59 4.66 1.16 9.38 2.09 14.14 2.76 4.75.7 9.55 1.18 14.36 1.27Z" fill="#94c8e3"></path>
            <path d="M131.78 201.04c-1.57.1-2.98.15-4.25.19-7.75 16.81-12.35 35.38-13.04 54.94a85.03 85.03 0 0 0 1.56 1.89s10.32-12.15 13.56-29.93c2.64-14.52 12.28-11.03 20.41-10.8 13.58.38 16.49-4.46 6.81-13.9-9.87-9.62-12.54-3.17-25.05-2.39Z" style={{ mixBlendMode: 'multiply' }} fill="#4c649e" opacity=".23"></path>
            <path d="M116.05 252.38s-14.99-17.26-11.84-24.63c3.16-7.37.28-16.27 6.57-24.86s8.48-6.75 20.99-7.53c12.51-.78 15.18-7.23 25.05 2.39 9.68 9.43 6.78 14.27-6.81 13.9-8.13-.23-17.76-3.71-20.41 10.8-3.24 17.78-13.56 29.93-13.56 29.93Z" fill="#7fc991"></path>
            <path d="M96.67 242.09c4.41-2.5.67-14.76-6.5-21.27-4.95-4.49-10.02-.7-17.22-6.54-5.08-4.13-4.81-7.85-8.83-8.72-4.76-1.04-6.59 3.84-14.16 5.36-7.29 1.47-9.08-2.34-13.59-.49-8.27 3.4-14.13 21.11-9.07 26.53 3.09 3.31 10.68-6.68 18.91-3.27 4.1 1.7 3.99 4.79 8.09 5.83 5.74 1.45 8.66-3.91 14.69-4.93 11.65-1.97 22.74 10.3 27.68 7.5Z" fill="#7fc991"></path>
            <path d="M126.31 324.58c-1.14-5.56-2.35-11.11-3.69-16.62-1.3-5.52-2.71-11.02-4.23-16.48-3.05-10.91-6.38-21.79-10.81-32.21-2.21-5.2-4.63-10.34-7.88-14.95l-2.48-3.43c-.86-1.12-1.81-2.17-2.71-3.25-.47-.53-.89-1.1-1.39-1.6l-1.48-1.51c-.98-1.01-1.95-2.05-3.03-2.95-4.16-3.81-8.83-7.08-13.9-9.59-5.05-2.52-10.48-4.43-16.13-5.02 5.68.37 11.19 2.19 16.35 4.58 5.15 2.44 9.93 5.67 14.19 9.46 1.11.9 2.1 1.93 3.11 2.94l1.51 1.52c.51.5.94 1.07 1.41 1.61.92 1.09 1.88 2.15 2.75 3.28l2.53 3.45c3.32 4.67 5.81 9.85 8.05 15.08 2.2 5.25 4.13 10.61 5.86 16.03 1.73 5.42 3.36 10.86 4.77 16.37 2.89 10.99 5.3 22.1 7.18 33.3Z" fill="#40635b"></path>
            <path d="M128.71 324.26c-1.88-9.56-3.67-19.14-5.46-28.72l-5.23-28.76c-1.63-9.61-3.33-19.21-4.63-28.87-.62-4.84-1.2-9.69-1.31-14.58-.03-2.44.06-4.91.6-7.31.3-1.19.72-2.36 1.36-3.41.64-1.05 1.51-1.94 2.48-2.67-.94.77-1.76 1.69-2.35 2.75-.6 1.05-.98 2.21-1.23 3.39-.46 2.38-.47 4.82-.37 7.24.21 4.85.88 9.68 1.59 14.49 1.46 9.62 3.14 19.22 4.86 28.81l5 28.8c1.63 9.61 3.23 19.22 4.7 28.85Z" fill="#40635b"></path>
            <path d="M115.65 289.09s1.47-19.04-4.42-22.22c-5.89-3.18-8.63-10.49-17.2-12.84-8.57-2.35-9.05-.02-17.63 5.97s-13.67 3.15-15.14 14.57c-1.43 11.19 2.98 12.85 11.66 5.55 5.2-4.37 9.69-11.65 18.95-3.53 11.34 9.94 23.77 12.51 23.77 12.51Z" fill="#7fc991"></path>
            <path d="m123.81 324.88-.73-4.07-.78-4.06-.82-4.05-.91-4.03c-1.26-5.35-2.67-10.67-4.49-15.85-1.74-5.2-3.87-10.28-6.53-15.07-.62-1.23-1.38-2.36-2.11-3.52-.69-1.19-1.57-2.24-2.38-3.35l-.61-.83-.68-.77-1.36-1.55c-.43-.54-.98-.95-1.47-1.44l-1.5-1.42c1.05.88 2.18 1.7 3.16 2.67l1.45 1.48.73.74.66.8c.85 1.09 1.78 2.13 2.52 3.31.78 1.15 1.59 2.28 2.25 3.49 2.83 4.77 4.97 9.91 6.8 15.13 1.75 5.25 3.18 10.6 4.29 16.01a164.38 164.38 0 0 1 2.5 16.36Z" fill="#40635b"></path>
            <path fill="#344c82" opacity=".11" d="M216.03 433.6c0 7.296-38.786 13.21-86.63 13.21-47.844 0-86.63-5.914-86.63-13.21 0-7.296 38.786-13.21 86.63-13.21 47.844 0 86.63 5.914 86.63 13.21z"></path>
            <path fill="#abbac2" d="M54.52 297.28 42.77 430.71h28.48L54.52 297.28z"></path>
            <path d="M56.3 322.62s4.21 113.21 11.22 117.26c7 4.05 129.7 8.64 157.25-15.84 0 0-10.45-15.9-12.98-29.73-2.53-13.83-8.37-81.92-8.37-81.92L56.31 322.63Z" fill="#ffffff"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m106.08 356.58-22.54 3.06-1.68-23.87 23.45-1.65.77 22.46z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m136.23 355.95-23.45 1.64-1.79-25.5 23.57-.02 1.67 23.88z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m164.56 352.31-22.53 3.23-1.68-23.87 23.45-1.65.76 22.29z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m109.3 391.01-23.53.44-1.68-23.88 23.45-1.64 1.76 25.08z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m138.46 387.75-23.33 3.38-1.79-25.61 23.36-2.86 1.76 25.09z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m167.83 387.43-23.57-.08-1.68-23.88 23.45-1.64 1.8 25.6z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="M111.44 421.61 88 423.25l-1.73-24.67 23.5-.84 1.67 23.87z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m192.36 328.022 1.674 23.872-23.442 1.643-1.674-23.871 23.443-1.644z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m194.59 359.828 1.673 23.872-23.442 1.643-1.674-23.871 23.443-1.644z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m198.5 415.5-23.44 1.65-.82-25.44 22.59-.08 1.67 23.87z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m140.69 419.56-24.75-.66-.37-21.57 23.45-1.64 1.67 23.87z"></path>
            <path stroke="#cccccc" stroke-width=".5" stroke-miterlimit="10" fill="none" d="m169.93 417.51-23.44 1.64-1.68-23.87 23.39-2.45 1.73 24.68z"></path>
            <path d="M201.63 287.05 54.52 297.29l1.78 25.34 147.11-10.24-1.78-25.34ZM82.02 312.3a4.202 4.202 0 0 1-4.49-3.9 4.202 4.202 0 0 1 3.9-4.49 4.202 4.202 0 0 1 4.49 3.9 4.202 4.202 0 0 1-3.9 4.49Zm25.05-1.75a4.202 4.202 0 0 1-4.49-3.9 4.202 4.202 0 0 1 3.9-4.49 4.202 4.202 0 0 1 4.49 3.9 4.202 4.202 0 0 1-3.9 4.49Zm25.05-1.76a4.202 4.202 0 0 1-4.49-3.9 4.202 4.202 0 0 1 3.9-4.49 4.202 4.202 0 0 1 4.49 3.9 4.202 4.202 0 0 1-3.9 4.49Zm25.05-1.76c-2.32.16-4.33-1.58-4.49-3.9s1.58-4.33 3.9-4.49a4.202 4.202 0 0 1 4.49 3.9 4.202 4.202 0 0 1-3.9 4.49Zm25.05-1.75a4.202 4.202 0 0 1-4.49-3.9 4.202 4.202 0 0 1 3.9-4.49 4.202 4.202 0 0 1 4.49 3.9 4.202 4.202 0 0 1-3.9 4.49Z" fill="#dfc184"></path>
            <path d="M128.36 339.43c-.47 1.17-1.09 2.21-1.75 3.21-.67 1-1.4 1.94-2.18 2.84-.78.9-1.61 1.76-2.51 2.56-.9.8-1.84 1.56-2.94 2.18.47-1.17 1.09-2.21 1.75-3.22.67-1 1.4-1.94 2.19-2.84.78-.9 1.62-1.75 2.51-2.56.9-.8 1.84-1.56 2.94-2.19Z" fill="#4d4d4d"></path>
            <path d="M129.07 349.52c-1.17-.47-2.21-1.09-3.21-1.75-1-.67-1.94-1.4-2.84-2.18-.9-.78-1.76-1.61-2.56-2.51-.8-.9-1.56-1.84-2.18-2.94 1.17.47 2.21 1.09 3.22 1.75 1 .67 1.94 1.4 2.84 2.19.9.78 1.75 1.62 2.56 2.51.8.9 1.56 1.84 2.19 2.94Z" fill="#4d4d4d"></path>
            <path d="M162.12 400.59c-.47 1.17-1.09 2.21-1.75 3.21-.67 1-1.4 1.94-2.18 2.84-.78.9-1.61 1.76-2.51 2.56-.9.8-1.84 1.56-2.94 2.18.47-1.17 1.09-2.21 1.75-3.22.67-1 1.4-1.94 2.19-2.84.78-.9 1.62-1.75 2.51-2.56.9-.8 1.84-1.56 2.94-2.19Z" fill="#4d4d4d"></path>
            <path d="M162.83 410.68c-1.17-.47-2.21-1.09-3.21-1.75-1-.67-1.94-1.4-2.84-2.18-.9-.78-1.76-1.61-2.56-2.51-.8-.9-1.56-1.84-2.18-2.94 1.17.47 2.21 1.09 3.22 1.75 1 .67 1.94 1.4 2.84 2.19.9.78 1.75 1.62 2.56 2.51.8.9 1.56 1.84 2.19 2.94Z" fill="#4d4d4d"></path>
            <path d="M101.35 373.29c-.47 1.17-1.09 2.21-1.75 3.21-.67 1-1.4 1.94-2.18 2.84-.78.9-1.61 1.76-2.51 2.56-.9.8-1.84 1.56-2.94 2.18.47-1.17 1.09-2.21 1.75-3.22.67-1 1.4-1.94 2.19-2.84.78-.9 1.62-1.75 2.51-2.56.9-.8 1.84-1.56 2.94-2.19Z" fill="#94c8e3"></path>
            <path d="M102.05 383.38c-1.17-.47-2.21-1.09-3.21-1.75-1-.67-1.94-1.4-2.84-2.18-.9-.78-1.76-1.61-2.56-2.51-.8-.9-1.56-1.84-2.18-2.94 1.17.47 2.21 1.09 3.22 1.75 1 .67 1.94 1.4 2.84 2.19.9.78 1.75 1.62 2.56 2.51.8.9 1.56 1.84 2.19 2.94Z" fill="#94c8e3"></path>
            <path d="M201.52 430.71c1.39-1.07 2.68-2.22 3.94-3.39 1.24-1.19 2.42-2.44 3.49-3.77 1.08-1.33 1.99-2.77 2.8-4.27.79-1.52 1.35-3.14 1.8-4.83-.07 1.74-.39 3.52-1.1 5.16-.7 1.64-1.62 3.18-2.73 4.56-2.25 2.74-5.03 5.04-8.21 6.54Z" fill="#cccccc"></path>
            <path d="m60.47 326.21.82 13.52.88 13.51c.63 9 1.28 18.01 2.13 26.99.78 8.99 1.76 17.96 3.02 26.89.64 4.46 1.38 8.91 2.36 13.31.22 1.1.49 2.2.78 3.29.25 1.1.6 2.17.93 3.25.15.54.36 1.06.56 1.59.21.52.37 1.07.63 1.56l.74 1.52.95 1.4c-1.51-1.71-2.31-3.89-3.12-5.99-.36-1.07-.75-2.14-1.04-3.23-.32-1.09-.63-2.17-.89-3.27-1.08-4.39-1.9-8.84-2.64-13.3-1.42-8.93-2.39-17.92-3.25-26.91-.77-9-1.43-18.01-1.9-27.03-.46-9.02-.82-18.05-.93-27.08Z" fill="#cccccc"></path>
            <path fill="#b58c40" d="m56.3 322.62 5.7-.4-1.53-23.1-5.95-1.84 1.78 25.34z"></path>
            <path d="M67.37 296.38c.79-1.71 1.84-3.3 3.09-4.74 1.27-1.42 2.77-2.73 4.65-3.5.93-.38 1.96-.62 3-.64 1.05-.01 2.09.2 3.06.57 1.94.79 3.49 2.1 4.78 3.63 1.31 1.53 2.2 3.53 2.36 5.61.16 2.08-.43 4.13-1.39 5.86-.97 1.74-2.31 3.21-3.84 4.38-1.54 1.15-3.28 2.07-5.15 2.4 1.71-.78 3.19-1.89 4.46-3.18 1.27-1.28 2.34-2.75 3.07-4.34.74-1.58 1.09-3.3.92-4.94-.15-1.66-.9-3.2-1.96-4.53-1.08-1.34-2.46-2.49-3.95-3.2a6.725 6.725 0 0 0-4.86-.22c-1.63.54-3.16 1.55-4.52 2.76-1.37 1.21-2.61 2.6-3.73 4.1Z" fill="#4d4d4d"></path>
            <path d="M92.55 294.12c.79-1.71 1.84-3.3 3.09-4.74 1.27-1.42 2.77-2.73 4.65-3.5.93-.38 1.96-.62 3-.64 1.05-.01 2.09.2 3.06.57 1.94.79 3.49 2.1 4.78 3.63 1.31 1.53 2.2 3.53 2.36 5.61.16 2.08-.43 4.13-1.39 5.86-.97 1.74-2.31 3.21-3.84 4.38-1.54 1.15-3.28 2.08-5.15 2.4 1.71-.78 3.19-1.89 4.46-3.18 1.27-1.28 2.34-2.75 3.07-4.34.74-1.58 1.09-3.3.92-4.94-.15-1.66-.9-3.2-1.96-4.53-1.08-1.34-2.46-2.49-3.95-3.2a6.725 6.725 0 0 0-4.86-.22c-1.63.54-3.16 1.55-4.52 2.76-1.37 1.21-2.61 2.6-3.73 4.1Z" fill="#4d4d4d"></path>
            <path d="M117.92 292.96c.71-1.57 1.67-3.04 2.81-4.37 1.16-1.31 2.54-2.53 4.28-3.24.86-.36 1.81-.58 2.78-.6.97-.01 1.94.18 2.84.52 1.8.73 3.23 1.93 4.43 3.35 1.22 1.41 2.04 3.27 2.18 5.19.15 1.93-.4 3.82-1.29 5.41-.9 1.6-2.14 2.95-3.56 4.02-1.42 1.05-3.03 1.89-4.75 2.17 1.56-.74 2.91-1.76 4.07-2.95 1.16-1.18 2.13-2.53 2.79-3.99.67-1.45.99-3.01.82-4.5-.13-1.5-.82-2.9-1.79-4.12-.98-1.22-2.24-2.28-3.59-2.92-1.38-.61-2.92-.7-4.41-.22-1.49.48-2.89 1.4-4.15 2.5-1.26 1.1-2.41 2.37-3.45 3.74Z" fill="#4d4d4d"></path>
            <path d="M142.78 290.76c.71-1.57 1.66-3.03 2.8-4.35 1.15-1.31 2.53-2.52 4.26-3.23.86-.36 1.8-.58 2.77-.6a7.8 7.8 0 0 1 2.83.52c1.79.72 3.22 1.92 4.41 3.34 1.21 1.41 2.03 3.25 2.17 5.17.15 1.92-.4 3.8-1.29 5.39-.9 1.59-2.13 2.94-3.54 4-1.41 1.05-3.02 1.88-4.73 2.16 1.55-.73 2.9-1.76 4.05-2.94s2.12-2.52 2.77-3.97c.66-1.44.98-2.99.82-4.48-.13-1.5-.82-2.88-1.78-4.09-.97-1.21-2.23-2.26-3.57-2.9a6.17 6.17 0 0 0-4.38-.22c-1.48.48-2.88 1.39-4.13 2.49-1.25 1.1-2.4 2.36-3.44 3.72Z" fill="#4d4d4d"></path>
            <path d="M169.11 288.74c.69-1.54 1.62-2.97 2.74-4.27 1.13-1.28 2.48-2.47 4.17-3.17a7.53 7.53 0 0 1 2.72-.59c.95-.01 1.9.18 2.78.51 1.76.71 3.16 1.89 4.33 3.27 1.19 1.38 1.99 3.19 2.13 5.08.14 1.89-.39 3.73-1.27 5.29s-2.09 2.88-3.48 3.92c-1.39 1.03-2.97 1.84-4.64 2.11 1.52-.72 2.83-1.73 3.96-2.89 1.12-1.16 2.07-2.47 2.71-3.89.65-1.41.96-2.93.8-4.38-.13-1.46-.8-2.82-1.74-4-.95-1.19-2.18-2.21-3.49-2.84a5.951 5.951 0 0 0-4.28-.21c-1.45.47-2.82 1.36-4.04 2.43-1.23 1.07-2.35 2.3-3.38 3.64Z" fill="#4d4d4d"></path>
            <path d="M119.68 375.57c-.08 2.53.6 5.08 2.05 7.1 1.41 2.01 3.64 3.54 6.06 3.62 2.4.07 4.77-1.05 6.48-2.76 1.7-1.71 2.93-4.02 2.94-6.41.09-2.38-1.16-4.7-2.93-6.33-1.76-1.64-4.23-2.66-6.59-2.19-2.36.46-4.3 2.4-5.18 4.69-.96 2.29-.93 4.96-.04 7.33-1.1-2.29-1.27-5.04-.42-7.5.84-2.43 2.82-4.63 5.48-5.27 1.31-.32 2.71-.21 3.97.23 1.26.44 2.41 1.15 3.39 2.03 1.94 1.75 3.38 4.28 3.32 7.02-.06 2.72-1.45 5.2-3.31 7.04-1.87 1.82-4.47 3.08-7.17 2.88-2.71-.2-5.03-1.95-6.42-4.11-1.38-2.2-1.95-4.85-1.65-7.37Z" fill="#fcc858"></path>
            <path d="M186.35 331.82c-2.51-.31-5.11.13-7.26 1.39-2.14 1.22-3.86 3.3-4.17 5.7-.29 2.39.6 4.85 2.15 6.71 1.55 1.85 3.73 3.29 6.11 3.52 2.36.31 4.78-.72 6.57-2.33 1.8-1.6 3.04-3.96 2.79-6.35-.24-2.39-1.99-4.5-4.19-5.59-2.19-1.17-4.85-1.38-7.3-.72 2.38-.88 5.14-.8 7.51.28 2.35 1.06 4.35 3.24 4.74 5.94.19 1.33-.04 2.72-.6 3.93-.55 1.22-1.37 2.29-2.33 3.19-1.92 1.77-4.57 2.97-7.3 2.65-2.71-.31-5.05-1.92-6.7-3.94-1.64-2.03-2.65-4.74-2.2-7.4.45-2.68 2.41-4.83 4.69-6.01 2.32-1.17 5.01-1.49 7.49-.96Z" fill="#fcc858"></path>
            <path d="M125.07 377.38c1.2.77 2.29 1.65 3.36 2.56l-.66.07c.4-.64.83-1.25 1.26-1.86.45-.6.89-1.2 1.38-1.77.48-.58.98-1.14 1.51-1.67s1.1-1.06 1.77-1.42c-.49.57-.88 1.2-1.31 1.81l-1.26 1.83c-.85 1.21-1.72 2.42-2.64 3.59l-.33.42-.34-.35c-.97-1.01-1.91-2.05-2.75-3.2Z" fill="#fcc858"></path>
            <path d="M318.5 148.22c2.62 1.4 5.18 2.9 7.69 4.47 3.61-1.33 9.54-4.2 15.71-7.98-11.57-8.34-24.43-15-38.22-19.62 5.36 8.7 11 17.66 14.83 23.13Z" style={{ mixBlendMode: 'multiply' }} fill="#4c649e" opacity=".23"></path>
        </g>
    </g>
</svg>  
<h2 className='text-xl'> خدمات المتابعة خلال فترة العقد</h2>
                  </motion.div>
                  <motion.div 
                    
                    whileHover={{ scale: 1.10 }}
                    whileTap={{ scale: 0.95 }}
                  className="bg-white bg-opacity-80 p-4 flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg">

                    <svg preserveAspectRatio="xMidYMid meet" className='h-[150px]' data-bbox="66.39 45.92 617.22 484.36" viewBox="0 0 750 500" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="rotate(-44.63 93.992 -365.094)" y2="336.98" x2="-375.36" y1="226.33" x1="-322.5" id="dcd6d23a-d1c4-42fb-a717-ea6758320e93_comp-lvv1tkko">
                <stop stop-color="#8bc47c" offset="0"></stop>
                <stop stop-color="#679653" offset=".88"></stop>
            </linearGradient>
            <linearGradient xlinkHref="#dcd6d23a-d1c4-42fb-a717-ea6758320e93_comp-lvv1tkko" gradientTransform="scale(-1 1) rotate(-44.63 -95.998 97.804)" y2="81.92" x2="-642.19" y1="-28.73" x1="-589.33" id="4d0a3012-3ac8-4225-94c7-93d2719d13e5_comp-lvv1tkko"></linearGradient>
            <clipPath id="9a80cc4c-8891-454a-9189-d729758c201b_comp-lvv1tkko">
                <path stroke-width="0" d="M658.86 247.9v207.47H109.59V247.9h549.27z"></path>
            </clipPath>
        </defs>
        <g style={{ isolation: 'isolate' }}>
            <path d="M245.29 221.9c18.66-17.2 29.01-42.09 27.99-65.16-1.16-26.4-16.27-49.93-38.33-64.18-39.33-25.4-113.84-28.98-145.5 20.41-14.05 21.91-15.91 48.69-7.49 70.62s26.38 39.11 48 50c31.49 15.86 74.87 17.7 106.74-4.75 3.03-2.13 5.89-4.46 8.59-6.94Z" fill="#f1f1f1"></path>
            <path d="M581.87 454.87c86.2-54.47 135.39-208.27 51.9-282.65-34.32-30.57-85.78-35.68-130.92-26.13-41.79 8.84-70.89 33.97-102.82 58.58-36.22 27.91-81.24 66.22-128.05 69.41-49.57 3.37-107.99 5.77-139.7 48.47-34.01 45.81-18.31 90.01 15.03 132.33h434.56Z" fill="#f1f1f1"></path>
            <g clip-path="url(#9a80cc4c-8891-454a-9189-d729758c201b_comp-lvv1tkko)">
                <path d="M205.83 475.3s-19.97-50.2-96.24-41.53c0 0 74.87 71.07 96.24 41.53Z" fill="#5b8e85"></path>
                <path d="M129.48 440.54c2.73.57 5.47 1.11 8.2 1.72 2.69.74 5.4 1.43 8.09 2.22 2.65.9 5.32 1.74 7.94 2.69 2.6 1.03 5.23 1.99 7.8 3.09 10.3 4.37 20.15 9.75 29.68 15.6 9.48 5.93 18.65 12.35 27.56 19.09l6.64 5.11 6.57 5.19c4.34 3.52 8.67 7.03 12.95 10.62l-13.26-10.24-6.66-5.08-6.71-5c-8.99-6.61-18.13-13.01-27.62-18.86-9.45-5.91-19.26-11.24-29.46-15.75-10.19-4.5-20.8-8.1-31.72-10.43Z" fill="#5a8e7b"></path>
                <path d="M262.54 474.68s-53.18-21.17-57.4-126.5c0 0 83.12 93.67 57.4 126.5Z" fill="url(#dcd6d23a-d1c4-42fb-a717-ea6758320e93_comp-lvv1tkko)"></path>
                <path d="M262.54 474.68s-53.18-21.17-57.4-126.5c0 0 83.12 93.67 57.4 126.5Z" fill="#5b8e85"></path>
                <path d="m215.21 374.54 3.14 10.35 3.57 10.2 3.93 10.07 4.3 9.91c5.96 13.11 12.76 25.83 20.21 38.16 7.38 12.37 15.4 24.36 23.67 36.16l6.26 8.82 6.35 8.75c4.24 5.83 8.52 11.63 12.83 17.42-4.43-5.69-8.84-11.39-13.22-17.12l-6.47-8.67-6.37-8.74c-8.41-11.72-16.44-23.73-23.9-36.09-7.39-12.4-14.22-25.15-20.05-38.36l-4.18-9.99-3.8-10.14-3.35-10.29-2.91-10.42Z" fill="#5a8e7b"></path>
                <path d="M237.27 471.04s-65.7 22.41-101.52-91.12c0 0 120.58 32.37 101.52 91.12Z" fill="#74aa85"></path>
                <path d="M154.78 400.54c3.16 4.41 6.49 8.7 10.04 12.8 3.58 4.07 7.27 8.04 11.17 11.8 7.78 7.54 16.07 14.55 24.79 20.99 4.33 3.26 8.78 6.35 13.28 9.37 4.53 2.98 9.12 5.87 13.77 8.65 9.32 5.53 19.03 10.41 29.09 14.51-5.1-1.85-10.11-3.98-15.03-6.28-4.91-2.33-9.72-4.87-14.44-7.56-9.42-5.43-18.51-11.42-27.26-17.88-4.35-3.27-8.62-6.64-12.74-10.19-4.15-3.52-8.15-7.21-11.99-11.05-3.86-3.84-7.5-7.88-11.01-12.03-3.44-4.21-6.69-8.57-9.67-13.11Z" fill="#5a8e7b"></path>
                <path d="M259.07 490.45s10.02-78.58-76.7-112.27c0 0 17.96 110.24 76.7 112.27Z" fill="#92ce7c"></path>
                <path d="M199.31 399.23c8.15 8.23 15.75 17.02 22.69 26.32 6.98 9.26 13.3 19.01 19.12 29.04 5.79 10.05 11.01 20.42 15.71 31.02 4.75 10.59 8.5 21.58 11.94 32.63-1.92-5.46-3.84-10.93-5.93-16.32-2.07-5.41-4.25-10.76-6.71-16-4.83-10.51-10.03-20.85-15.87-30.84-2.84-5.04-5.91-9.94-9.02-14.81-3.18-4.83-6.43-9.61-9.85-14.27-1.67-2.36-3.46-4.63-5.2-6.94-1.8-2.26-3.57-4.55-5.44-6.76-3.64-4.5-7.53-8.79-11.43-13.07Z" fill="#5a8e7b"></path>
                <path d="M547.2 474.88s19.97-50.2 96.24-41.53c0 0-74.87 71.07-96.24 41.53Z" fill="#5b8e85"></path>
                <path d="M623.56 440.12c-10.92 2.33-21.54 5.93-31.72 10.43-10.19 4.51-20 9.84-29.46 15.75-9.49 5.84-18.63 12.25-27.62 18.86l-6.71 5-6.66 5.08-13.26 10.24c4.28-3.59 8.62-7.1 12.95-10.62l6.57-5.19 6.64-5.11c8.91-6.74 18.07-13.16 27.56-19.09 9.52-5.85 19.37-11.23 29.68-15.6 2.57-1.1 5.2-2.06 7.8-3.09 2.63-.96 5.3-1.8 7.94-2.69 2.68-.79 5.39-1.48 8.09-2.22 2.73-.61 5.47-1.16 8.2-1.72Z" fill="#5a8e7b"></path>
                <path d="M486.52 480.6s53.18-21.17 57.4-126.5c0 0-83.12 93.67-57.4 126.5Z" fill="url(#4d0a3012-3ac8-4225-94c7-93d2719d13e5_comp-lvv1tkko)"></path>
                <path d="M486.52 480.6s53.18-21.17 57.4-126.5c0 0-83.12 93.67-57.4 126.5Z" fill="#5b8e85"></path>
                <path d="m533.86 380.46-2.91 10.42-3.35 10.29-3.8 10.14-4.18 9.99c-5.83 13.21-12.66 25.97-20.05 38.36-7.46 12.36-15.49 24.37-23.9 36.09l-6.37 8.74-6.47 8.67c-4.38 5.73-8.79 11.44-13.22 17.12 4.3-5.79 8.58-11.59 12.83-17.42l6.35-8.75 6.26-8.82c8.27-11.8 16.29-23.78 23.67-36.16 7.45-12.33 14.25-25.05 20.21-38.16l4.3-9.91 3.93-10.06 3.57-10.2 3.14-10.35Z" fill="#5a8e7b"></path>
                <path d="M511.8 476.96s65.7 22.41 101.52-91.12c0 0-120.58 32.37-101.52 91.12Z" fill="#74aa85"></path>
                <path d="M594.29 406.46c-2.98 4.54-6.23 8.9-9.67 13.11-3.51 4.15-7.15 8.19-11.01 12.03-3.84 3.85-7.85 7.54-11.99 11.05-4.12 3.55-8.39 6.92-12.74 10.19-8.75 6.46-17.84 12.45-27.26 17.88-4.72 2.69-9.53 5.23-14.44 7.56-4.92 2.3-9.93 4.43-15.03 6.28 10.05-4.1 19.77-8.98 29.09-14.51 4.65-2.78 9.24-5.67 13.77-8.65 4.5-3.02 8.95-6.11 13.28-9.37 8.71-6.44 17.01-13.44 24.79-20.99 3.91-3.75 7.6-7.73 11.17-11.8 3.55-4.09 6.88-8.38 10.04-12.8Z" fill="#5a8e7b"></path>
                <path d="M489.99 496.37s-10.02-78.58 76.7-112.27c0 0-17.96 110.24-76.7 112.27Z" fill="#92ce7c"></path>
                <path d="M549.76 405.15c-3.9 4.28-7.79 8.57-11.43 13.07-1.87 2.21-3.63 4.5-5.44 6.76-1.74 2.31-3.53 4.58-5.2 6.94-3.42 4.66-6.67 9.45-9.85 14.27-3.11 4.87-6.18 9.78-9.02 14.81-5.84 9.98-11.04 20.33-15.87 30.84-2.45 5.24-4.64 10.59-6.71 16-2.09 5.4-4.01 10.86-5.93 16.32 3.44-11.05 7.19-22.04 11.94-32.63 4.7-10.6 9.92-20.97 15.71-31.02 5.82-10.03 12.15-19.78 19.12-29.04 6.93-9.3 14.53-18.09 22.69-26.32Z" fill="#5a8e7b"></path>
            </g>
            <path fill="#dfc184" d="M503.21 454.08H253.59c-7.108 0-12.87-5.762-12.87-12.87V58.79c0-7.108 5.762-12.87 12.87-12.87h249.62c7.108 0 12.87 5.762 12.87 12.87v382.42c0 7.108-5.762 12.87-12.87 12.87z"></path>
            <path d="M500.17 61.69h-66.44c-3.13 0-6.11 1.39-8.12 3.79l-5.5 6.57c-2.01 2.4-4.99 3.79-8.12 3.79H345.4c-2.94 0-5.75-1.22-7.75-3.38l-6.89-7.4c-2-2.15-4.81-3.38-7.75-3.38h-66.37c-2.69 0-4.86 2.18-4.86 4.86v356.69c0 2.69 2.18 4.86 4.86 4.86h243.54c2.69 0 4.86-2.18 4.86-4.86V66.55c0-2.69-2.18-4.86-4.86-4.86Z" fill="#f1f1f1"></path>
            <path d="M572.34 241.12h-237.2c-9.44 0-17.09 7.65-17.09 17.09v89.74c0 9.44 7.65 17.09 17.09 17.09h99.7l15.98 15.93 15.98-15.93h105.55c9.44 0 17.09-7.65 17.09-17.09v-89.74c0-9.44-7.65-17.09-17.09-17.09Z" fill="#dfe4ff"></path>
            <path d="M572.34 236.12h-237.2c-9.44 0-17.09 7.65-17.09 17.09v89.74c0 9.44 7.65 17.09 17.09 17.09h99.7l15.98 15.93 15.98-15.93h105.55c9.44 0 17.09-7.65 17.09-17.09v-89.74c0-9.44-7.65-17.09-17.09-17.09Z" fill="#ffffff"></path>
            <path fill="#dfe4ff" d="M420.28 297.91v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96z"></path>
            <path fill="#dfe4ff" d="M420.28 316.87v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96z"></path>
            <path fill="#dfe4ff" d="M420.28 279.16v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96z"></path>
            <path fill="#dfe4ff" d="M420.28 260.4v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96z"></path>
            <path fill="#dfe4ff" d="M400.06 335.84v1.22a1.96 1.96 0 0 1-1.96 1.96h-59.62a1.96 1.96 0 0 1-1.96-1.96v-1.22a1.96 1.96 0 0 1 1.96-1.96h59.62a1.96 1.96 0 0 1 1.96 1.96z"></path>
            <path d="M444.19 299.66c-1.2-.48-6.57-2.1-7.12-2.37-1.52-.78-.17-5.16-3.86-7.71-2.89-2-4.49-4.74-5.53-5.42-2.53-1.64-4.03-1.11-3.82.34.21 1.46 3.4 6.44 3.4 6.44s-2.9-.15-6.44.31c-3.54.46-13.64-1.32-14.81-.78s-2.05 2.26-2.05 2.26-4.22-.53-5.35.8c-1.12 1.33-.12 3.11 2.54 3.39 0 0-.88 2.03.91 2.73 1.79.69 3 .96 3 .96s-1.53.88-.49 1.88c1.05 1.01 6.5 2.6 11.91 2.39 4.03-.16 3.56-.06 6.19.17.78.07 4.8-.21 7.45.22 4.13.68 7.51 2.2 9.96 2.63 1.52-2.73 3.19-5.43 4.11-8.25Z" fill="#eec0b1"></path>
            <path d="M519.54 280.12c-.08-1.23-.27-7.19-.27-7.19s-6 1.32-13.46 5.45c-5.44 3.01-14.55 11.04-18.53 14.96-3.98 3.92-15.32 13.2-15.32 13.2l-33.74-9.74s.37 2.05-.66 5.19c-1.18 3.62-2.72 5.48-2.72 5.48s37.58 19.83 41.99 17.59c4.41-2.23 24.75-12.11 34.62-22.19 9.87-10.08 8.1-22.75 8.1-22.75Z" fill="#213a4a"></path>
            <path d="M531.26 283.37c9.3.46 13.5 1.4 18.69-8.78 5.97-11.72-11.18-53.28-11.18-53.28l2.56-10.58c-1.59-1.01-9.03 2.01-9.03 2.01-2.77-2.09-10-1.1-13.36 1.67-10.47 8.64-9.09 24.98.44 28.57 1.03.39 7.04 10.16 3.63 20.87-5.39 16.91-3.6 22.06 8.25 19.52Z" fill="#836c4b"></path>
            <path d="M544.75 293.59c12.09 4.26 41.76 5.47 36.59-18.65-2.15-10.05-10.06-17.99-16.47-25.31-2.12-2.43-4.14-9.18-4.15-11.34-.03-7.44-.86-15.12-3.82-20.12-5.25-8.87-15.56-7.44-15.56-7.44l-11.69 7.3s-.77 12.69 1.64 28.8c1.27 8.51-2.86 41.01 13.46 46.76Z" fill="#836c4b"></path>
            <path d="M515 300.51c-1.89-9.31-2.35-14.97-3.5-24.37 2.15-1.49 12.27-4.78 14.33-6.8 5.6-5.46 4.47-19.21 4.47-19.21l14.79-7.15s.01 20.94 2.43 24.54c3.66 5.45 10.22 6.5 10.22 6.5s2.81 12.72-6.7 27.36c-6.38 9.82-22.24 15.74-31.99 18.57-1.29-6.49-2.72-12.94-4.05-19.44Z" fill="#d8a08e"></path>
            <path d="M520.05 220c-.75 3.52-2.52 7.72-3.09 14.39-.28 3.34.07 10.41.93 14.41.86 4 5.36 15.73 11.64 15.05 3.34-.36 7.47-3.2 9.39-4.58 5.36-3.83 7.4-5.36 8.76-9.23 1.36-3.87 1.4-14.31.34-21.83-1.06-7.53-5.67-10.74-11.12-12.01-5.45-1.27-16.86 3.8-16.86 3.8Z" fill="#eec0b1"></path>
            <path d="M543.02 240.33s4.26-4.27 6.92-3.48c2.65.8 2.65 4.83.46 8.04-2.19 3.21-9.83 4.73-9.83 4.73l2.46-9.29Z" fill="#eec0b1"></path>
            <path d="M538.92 220.7c-3.7.17-8.71 3.04-15.34 6.38-6.63 3.34-9.66 3.74-9.66 3.74l3.97-10.67s7.09-6.49 13.13-5.67c6.04.82 7.9 6.23 7.9 6.23Z" fill="#836c4b"></path>
            <path d="M534.59 219.75s-6.35 9.47-15.21 11.07c0 0 12.48-.39 17.72-7.15l-2.51-3.92Z" fill="#836c4b"></path>
            <path d="M546.27 235.42c2.8 1.45 3.93 3.55 6.83 4.75 1.5-7.18 1.85-15.99-10-23.94-7.71-5.17-11.85 2.71-11.85 2.71 7.04.16 5.83 11.74 15.01 16.48Z" fill="#836c4b"></path>
            <path d="M503.54 315.9c.31 1.35.72 2.64 1.15 4.02.39 1.23 1.14 3.7 1.84 7 1.78 8.33 3.3 21.99-1.84 34.56h59.55c-1.21-8.4-2.26-23.82-2.46-29.81-.17-4.81 3.43-12.91 4.5-20.27 2.43-16.66 0-34.2 0-34.2l-18.19-9.67s-4.27 5.39-14.29 5.39c-7.4 0-7.96-3.57-7.96-3.57l-15.43 7.03s-.75 10.78-3.84 19.15c-3.99 10.79-4.06 15.87-3.02 20.38Z" fill="#213a4a"></path>
            <path d="M524.24 270.42c-.14-1.44 1.28-3.87 2.08-5.39.8-1.52 1.67 0 4.94 0s13.15-1.64 14.5-2.6c1.35-.96 2.19-1.34 3 1.45s3.55 2.38 1.7 4.91c-1.85 2.53-11.16 6.07-17.65 5.6-6.49-.47-8.42-2.35-8.57-3.97Z" fill="#213a4a"></path>
            <path d="m536.36 343.31-3.88-2.7s-7.35-.47-8.22-.14c-.86.32-5.58 2.62-6.88 3.6-1.3.97-2.7 1.73-2.16 2.27s3.02.43 4.53-.43c1.51-.86 2.5-1.57 2.5-1.57s2.01-.5 2.89-.77c.95-.29 7.98.72 7.98.72l3.24-.97Z" fill="#eec0b1"></path>
            <path d="M546.54 347.08s-2.59.76-4.85 2.37c-2.27 1.62-3.55 2-4.64 1.9-1.36-.12-4.35-.46-5.1-.46s-3.25 1.27-3.79 1.8c-.54.54-2.16 2.16-3.67 2.16s-.65-1.94-.65-1.94-1.51 1.73-2.8 1.51c-1.29-.22-1.29-1.08-1.29-1.08s-1.4.97-2.27-.22c-.86-1.19 2.81-5.91 4.1-7.32 1.29-1.4 9.38-5.09 10.89-5.2 1.51-.11 5.76.21 7.81.21h3.24l3.02 6.26Z" fill="#eec0b1"></path>
            <path d="M564.78 332.95s-8.48 4.02-11.85 5.27-9.41 2.59-9.41 2.59l2.25 6.4s14.03-.09 19.98-.56c4.95-.39 6.59-1.35 6.59-1.35s2.41-4.53-.86-8.87c-1.79-2.37-6.71-3.49-6.71-3.49Z" fill="#eec0b1"></path>
            <path d="M566.28 277.2c1.34.67 6 2.85 9.17 8.28 3.86 6.61 7.65 16.83 10.79 27.85 5.79 20.33 5.36 24.47 3.57 28.64-1.79 4.17-39.34 7.5-39.34 7.5s3.26-.2-.26-6.58c-2.37-4.3-4.45-3.2-4.45-3.2l25.92-11.43s-6.59-11.17-11.47-20.39c-8.83-16.68 6.07-30.68 6.07-30.68Z" fill="#213a4a"></path>
            <path fill="#181711" d="M556.26 237.56c0 5.716-3.215 10.35-7.18 10.35s-7.18-4.634-7.18-10.35c0-5.716 3.215-10.35 7.18-10.35s7.18 4.634 7.18 10.35z"></path>
            <path d="M549.95 246.55c-1.75 3.76-4.81 7.84-11.03 9.81-2.57.81-6.11 1.11-9.63 1.11 0 0-.08 1.11-2.16 1.06-2.41-.05-2.9-.91-2.89-1.97.02-1.59 1.44-1.81 2.34-1.86 1.21-.07 2.5.38 2.58 1.25 0 0 5.05.35 8.9-.76 4.2-1.22 9-5.15 10.72-9.54l1.17.91Z" fill="#181711"></path>
            <path fill="#bac7df" d="M557.65 237.56c0 5.716-3.215 10.35-7.18 10.35s-7.18-4.634-7.18-10.35c0-5.716 3.215-10.35 7.18-10.35s7.18 4.634 7.18 10.35z"></path>
            <path d="M548.05 237.56c0 2.74 1.54 4.96 3.44 4.96s3.44-2.22 3.44-4.96-1.54-4.96-3.44-4.96-3.44 2.22-3.44 4.96Z" fill="#ffffff"></path>
            <path d="m550.7 230.04-2.49 1.33-.75-.4s.13-8.8-5.12-14.05-10.04-4.17-10.04-4.17-.1-.41.77-.67c1.08-.32 3.31-.49 5.1-.41 3.24.15 13.3 1.86 12.53 18.38Z" fill="#181711"></path>
            <path d="m551.45 230.44-3.24.93s.15-9.88-5.1-15.13-10.04-4.17-10.04-4.17 2.63-1.24 5.87-1.08c3.24.15 13.28 2.93 12.51 19.46Z" fill="#bac7df"></path>
            <path fill="#ffffff" d="M495.91 389.3v25.58a3.46 3.46 0 0 1-3.46 3.46H268.31a3.46 3.46 0 0 1-3.46-3.46V389.3a3.46 3.46 0 0 1 3.46-3.46h224.14a3.46 3.46 0 0 1 3.46 3.46z"></path>
            <path d="M398.83 105.67h-237.2c-9.44 0-17.09 7.65-17.09 17.09v89.74c0 9.44 7.65 17.09 17.09 17.09h112.84l15.98 15.93 15.98-15.93h92.41c9.44 0 17.09-7.65 17.09-17.09v-89.74c0-9.44-7.65-17.09-17.09-17.09Z" fill="#dfe4ff"></path>
            <path d="M398.83 100.67h-237.2c-9.44 0-17.09 7.65-17.09 17.09v89.74c0 9.44 7.65 17.09 17.09 17.09h112.84l15.98 15.93 15.98-15.93h92.41c9.44 0 17.09-7.65 17.09-17.09v-89.74c0-9.44-7.65-17.09-17.09-17.09Z" fill="#ffffff"></path>
            <path d="M301.86 93.47c.1-.97-.94-1.63-1.48-1.84-.54-.21-3.68 6.84-4.34 8.4-.66 1.56-3.6 6.86-3.71 8.63-.12 1.77.61 8.82.27 10.41-.19.87-.94 2.82-2.05 5.15 2.39 1.48 4.7 3.05 6.98 4.66.65-2.06 1.43-4.51 2.01-6.1 1.15-3.19 3.81-3.48 3.81-6.53 0-3.06 2.09-3.77 1.67-6.41-.22-1.36-1.95-1.92-3.48-2.78-2.39-1.34-3.74-.77-3.74-.77s1.91-5.92 2.02-7.02c.11-1.1 1.9-4.14 2.06-5.79Z" fill="#ecb9a7"></path>
            <path d="M306.24 106.86c.57 1.28 2.04 5.16 1.41 5.78-.63.62-1.62 0-1.62 0s.24 1.86-.54 2.13c-.78.27-1.78-.76-1.78-.76s-.25 1.81-1.23 1.62c-.98-.19-1.31-1.94-1.64-3.02-.33-1.08-1.83-4.81-1.83-4.81l.79-2.22c.77-.03 1.59-.05 2.26-.04 1.82.03 3.62.05 4.19 1.32Z" fill="#ecb9a7"></path>
            <path d="M297.74 115.98c.7 1.36 2.96-2.93 2.36-4.46-.6-1.53-.06-3.41.49-4.3.54-.9 1.72-2.33 2.54-3.26s.92-2.5.55-3.66c-.37-1.16-1.76.14-3.64 1.85-1.88 1.71-3.99 3.51-4.8 4.62-.81 1.12-1.06 3-1.06 3s3 5.12 3.55 6.21Z" fill="#ecb9a7"></path>
            <path d="M231.57 132.54c.72-3.24 3.61-9.54 3.61-9.54l9.29 2.64c6.57 4.39 16.09 14 26.06 23.86l21.06-28.5s3.13 4.31 9.05 3.92c0 0-2.85 11.7-10.75 28.73-5.73 12.37-11.48 21.43-15.68 22.22-5.52 1.04-12.33-4.21-19.71-8.52-7.29-4.26-14.83-7.89-20.26-18.07-5.43-10.18-4.42-8.89-2.68-16.76Z" fill="#836c4b"></path>
            <path d="M208.22 95.04s-2.61 19.86-4.03 21.12c-1.41 1.27-2.65 2.49-5.67 4.38 0 0 12.36 20.6 25.04 22.37C247.8 146.3 235.19 123 235.19 123s-7.26-4.79-9.6-7.66c-1.39-1.71-4.36-11.82-4.36-11.82l-13-8.48Z" fill="#e7b5a3"></path>
            <path d="M228.09 117.94s2.05 12.03-9.55 11.81c-13.69-.26-18.58-10.6-18.58-10.6l-8.64 5.7 16.66 25.02 30.56.53-1.13-27.95-9.32-4.5Z" fill="#836c4b"></path>
            <path d="M179.06 224.59h66.91c-.06-10.68 0-22.8.48-26.84.93-7.76-1.96-72.11-1.96-72.11l-12.79-5.83s1.79 13.91-10.85 17.51c-19.14-2.3-23.91-16.3-23.91-16.3l-16.24 11.03s-3.49 33.04-1.98 60.43c.4 7.26.43 20.26.34 32.11Z" fill="#dfc184"></path>
            <path d="M225.78 72.74c2.16 1.26 5.89 3.94 6.14 6.04.25 2.09 1.28 8.21 1.14 11.83-.14 3.62.14 12.93-.27 17.16-.41 4.23-.97 5.72-1.94 6.52-.98.8-11.85.93-14-.03-2.15-.95-11.86-5.98-11.81-15.01 0 0-3.89 2.06-7.41-5.9-.92-2.08 5.78-10.5 6.54-13.01 1.84-6.1 14.07-5 17.36-5.6 3.28-.6 4.27-2 4.27-2Z" fill="#ecb9a7"></path>
            <path d="M231.92 78.78s-1.33-2.8-3.68-1.49c-2.35 1.31-7.42 2.29-11.33 2.17-3.92-.12-7.74-1.6-7.74-1.6s.25 5.55-.73 7.1c-.98 1.55-3.3 3.46-3.37 5.27-.07 1.81.16 3.6.16 3.6s-2.54-3.04-4.47-2.35c-1.92.69-1.77 3.99.25 5.4 2.02 1.41 4.02 2.37 4.02 2.37l5.09 12.23s-9.82-13.35-12.65-18.41c-3.97-7.11-5.18-15.56-1.35-17.62 0 0-.41-9.01 8.97-11.09s26.77 2.46 28.74 6.96c1.58 3.62-1.92 7.46-1.92 7.46Z" fill="#213a4a"></path>
            <path d="M231.39 102.45c-1.41-.53-3.35-.68-6.3-.09-3.39.68-6.19 2.51-8.42 3.21-2.22.7-7.24-2.77-8.66-7.52s-2.38-9.37-2.38-9.37l-1.58 1.73s1.45 8.66 1.83 13.75c.38 5.1 3.46 10.38 9.45 13.11 5.99 2.74 14.48 1 16.06-.73 1.58-1.73 2.04-5.17 1.95-8.22-.04-1.23.02-3.42-.21-4.44-.11-.48-1.22-1.24-1.75-1.44Z" fill="#213a4a"></path>
            <path d="m227 205.23 4.48-2.98s8.48-.52 9.48-.16 6.44 2.9 7.94 3.97c1.5 1.07 3.12 1.91 2.49 2.5-.62.6-3.48.48-5.23-.48-1.74-.95-2.88-1.73-2.88-1.73s-2.32-.55-3.34-.85c-1.09-.32-9.21.79-9.21.79l-3.73-1.07Z" fill="#ecb9a7"></path>
            <path d="M215.25 209.39s2.99.83 5.6 2.62c2.61 1.79 4.09 2.21 5.35 2.09 1.57-.14 5.02-.5 5.89-.5s3.74 1.4 4.37 1.99c.62.6 2.49 2.38 4.23 2.38s.75-2.14.75-2.14 1.74 1.91 3.24 1.67 1.49-1.19 1.49-1.19 1.62 1.07 2.61-.24-3.24-6.53-4.73-8.08c-1.49-1.55-10.82-5.62-12.56-5.74-1.74-.12-6.64.23-9.01.23h-3.73l-3.48 6.91Z" fill="#ecb9a7"></path>
            <path d="M194.22 193.79s9.78 4.44 13.67 5.82c3.88 1.39 10.85 2.87 10.85 2.87l-2.6 7.07s-16.19-.1-23.05-.62c-5.71-.43-7.61-1.49-7.61-1.49s-2.78-5.01.99-9.8c2.06-2.62 7.74-3.86 7.74-3.86Z" fill="#ecb9a7"></path>
            <path d="M180.68 132.14c-1.36 1.05-6.12 4.51-8.46 11.14-2.85 8.06-4.79 20.02-5.81 32.67-1.88 23.35-2.07 21.12 0 25.72s44.31 10.35 44.31 10.35-3.77-.22.3-7.26c2.74-4.75 5.13-3.53 5.13-3.53l-29.89-12.62s4.89-13.65 8.28-24.77c6.15-20.13-13.86-31.71-13.86-31.71Z" fill="#836c4b"></path>
            <path fill="#dfe4ff" d="M315.05 163.67v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96z"></path>
            <path fill="#dfe4ff" d="M315.05 182.65v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96z"></path>
            <path fill="#dfe4ff" d="M315.05 144.92v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96z"></path>
            <path fill="#dfe4ff" d="M315.05 126.18v-1.22a1.96 1.96 0 0 1 1.96-1.96h79.84a1.96 1.96 0 0 1 1.96 1.96v1.22a1.96 1.96 0 0 1-1.96 1.96h-79.84a1.96 1.96 0 0 1-1.96-1.96z"></path>
            <path fill="#dfe4ff" d="M335.28 201.61v-1.22a1.96 1.96 0 0 1 1.96-1.96h59.62a1.96 1.96 0 0 1 1.96 1.96v1.22a1.96 1.96 0 0 1-1.96 1.96h-59.62a1.96 1.96 0 0 1-1.96-1.96z"></path>
            <path d="M362.12 183.43c-2.81 0-3.58-1.09-3.72-2-.33-2.05-.24-3.96-.15-5.8l.02-.52c.48-10.21 4.16-17.87 8.43-26.75 1.02-2.12 2.07-4.31 3.11-6.61 4.75-10.48 8.21-29.07-2.7-34.37-1.72-.84-3.89-1.3-6.1-1.3-3.66 0-6.73 1.21-8.42 3.31-1.81 2.24-1.79 5.25-1.77 8.44.02 2.69.03 5.47-1.07 7.96-2.67 6.02-6.75 6.91-8.94 6.91-3.31 0-6.58-1.96-8.76-5.25-2.89-4.37-3.26-10.19-.98-15.58 3.03-7.15 12.7-15.84 29.96-16.79.75-.04 1.51-.06 2.27-.06 15.6 0 32.85 9.17 34.1 26.15.9 12.25-7 20.05-14.64 27.58-1.92 1.89-3.91 3.85-5.69 5.83-5.35 5.94-8.58 12.17-9.6 18.51-.46 2.88-.18 4.76.09 6.57l.12.82c.07.52-.09 1.04-.46 1.46-1.27 1.46-4.95 1.48-5.1 1.48Z" fill="#db5f66"></path>
            <path d="M363.29 96.44c15.81 0 31.54 9.3 32.69 24.84 1.08 14.64-11.26 22.7-19.97 32.36-4.93 5.48-8.76 11.86-9.95 19.23-.57 3.55-.09 5.7.21 7.82.1.74-2.25 1.32-4.15 1.32-1.21 0-2.23-.23-2.32-.81-.34-2.09-.2-4.11-.11-6.03.58-12.35 6.1-21.1 11.41-32.84 4.41-9.74 9.17-30.14-3.38-36.23-1.92-.93-4.31-1.44-6.72-1.44-3.67 0-7.38 1.18-9.53 3.84-3.77 4.68-.78 11.64-3.03 16.71-1.9 4.28-4.77 6.07-7.64 6.07-6.35 0-12.69-8.8-8.43-18.86 4.18-9.86 16.85-15.27 28.73-15.93.73-.04 1.46-.06 2.19-.06m0-2.83c-.78 0-1.57.02-2.34.06-6.52.36-13.06 2.07-18.39 4.82-6.15 3.17-10.58 7.61-12.79 12.83-2.47 5.82-2.06 12.15 1.1 16.91 2.44 3.68 6.16 5.88 9.94 5.88 4.31 0 8.04-2.83 10.23-7.76 1.23-2.77 1.21-5.71 1.2-8.54-.02-3.05-.04-5.69 1.46-7.54 1.4-1.74 4.14-2.78 7.32-2.78 2 0 3.95.41 5.48 1.15 4.46 2.16 6.63 6.92 6.45 14.13-.16 6.72-2.39 13.9-4.42 18.38a278.07 278.07 0 0 1-3.1 6.58c-4.15 8.64-8.07 16.8-8.56 27.3l-.02.51c-.09 1.83-.19 3.9.16 6.1.16.96.97 3.19 5.12 3.19.74 0 4.54-.09 6.17-1.96.64-.73.92-1.65.79-2.59l-.12-.84c-.27-1.79-.52-3.47-.09-6.14.99-6.15 4.02-11.97 9.26-17.78 1.75-1.95 3.72-3.89 5.63-5.77 7.5-7.4 16.01-15.79 15.06-28.7-1.31-17.84-19.28-27.47-35.51-27.47Z" fill="#ffffff"></path>
            <path d="M361.5 208.97c-.7 0-1.42-.06-2.16-.18-1.63-.27-3.16-.85-4.56-1.73-4.02-2.77-5.63-6.6-4.83-11.4.27-1.64.93-3.24 1.95-4.74 2.29-3.32 5.33-5 9.02-5 .7 0 1.44.06 2.19.19 1.78.3 3.45 1.03 4.95 2.2 3.68 2.82 5.17 6.55 4.41 11.1-.27 1.64-.93 3.24-1.95 4.74-2.4 3.22-5.42 4.83-9.02 4.83Z" fill="#db5f66"></path>
            <path d="M360.92 187.34c.63 0 1.28.06 1.96.17 1.56.26 3 .9 4.32 1.92 3.25 2.49 4.54 5.73 3.88 9.75-.24 1.45-.82 2.84-1.72 4.18-2.09 2.81-4.71 4.21-7.85 4.21-.62 0-1.26-.06-1.93-.16-1.45-.24-2.8-.75-4.04-1.53-3.49-2.41-4.89-5.73-4.19-9.97.24-1.45.82-2.84 1.72-4.18 2.01-2.92 4.63-4.38 7.84-4.38m.01-2.85c-4.13 0-7.65 1.94-10.18 5.6-1.15 1.69-1.88 3.48-2.19 5.33-.88 5.32.98 9.73 5.37 12.76l.05.04.05.03c1.56.97 3.27 1.62 5.08 1.92.81.13 1.62.2 2.39.2 4.01 0 7.51-1.85 10.12-5.35l.04-.05.03-.05c1.14-1.67 1.87-3.46 2.18-5.31.84-5.03-.88-9.34-4.95-12.46-1.68-1.3-3.56-2.13-5.58-2.46-.82-.14-1.64-.21-2.42-.21Z" fill="#ffffff"></path>
            <path stroke="#302d32" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.13" fill="none" d="M66.39 454.87h617.22"></path>
        </g>
    </g>
</svg>                  

<h2 className='text-xl'> خدمات ما بعد الاستقدام</h2>

 </motion.div>
                    <div className="bg-white bg-opacity- flex-col p-4 flex items-center justify-center rounded-lg shadow-lg">
                    <svg preserveAspectRatio="xMidYMid meet" className='h-[150px]' data-bbox="-25.067 110.994 550.138 463.576" viewBox="0 0 500 500" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="rotate(-44.63 668.72 5914.602)" y2="1686.28" x2="4080.4" y1="1576.14" x1="4133.02" id="929779c5-cd4d-43c1-bda7-db5bd93db612_comp-lvv1tkkj">
                <stop stop-color="#8bc47c" offset="0"></stop>
                <stop stop-color="#679653" offset=".88"></stop>
            </linearGradient>
            <linearGradient xlinkHref="#929779c5-cd4d-43c1-bda7-db5bd93db612_comp-lvv1tkkj" gradientTransform="scale(-1 1) rotate(-44.63 -96.27 7778.45)" y2="2418.1" x2="4813.4" y1="2307.95" x1="4866.02" id="1de705c6-0012-41b4-80a0-27038d861767_comp-lvv1tkkj"></linearGradient>
            <clipPath id="8945d82a-e660-4974-895e-49b829f82145_comp-lvv1tkkj">
                <path stroke-width="0" d="M530.14 293.48V500H-16.63V293.48h546.77z"></path>
            </clipPath>
        </defs>
        <g style={{isolation:"isolate"}}>
            <path d="M129.34 285.9c17.11-15.78 26.6-38.6 25.67-59.75-1.07-24.21-14.92-45.79-35.15-58.86-36.07-23.3-104.4-26.57-133.43 18.71-12.88 20.09-14.59 44.66-6.87 64.76s24.19 35.87 44.02 45.85c28.87 14.54 68.66 16.23 97.89-4.35 2.78-1.96 5.4-4.09 7.87-6.36Z" fill="#f1f1f1"></path>
            <path d="M438 499.54c79.05-49.96 124.16-190.99 47.59-259.2-31.47-28.04-78.67-32.72-120.06-23.96-38.32 8.1-65.01 31.15-94.29 53.72-33.21 25.59-74.5 60.73-117.43 63.65-45.46 3.09-99.03 5.29-128.11 44.45-31.19 42.01-16.79 82.54 13.78 121.35h398.51Z" fill="#f1f1f1"></path>
            <g clip-path="url(#8945d82a-e660-4974-895e-49b829f82145_comp-lvv1tkkj)">
                <path d="M79.17 519.84s-19.88-49.97-95.8-41.34c0 0 74.53 70.75 95.8 41.34Z" fill="#5b8e85"></path>
                <path d="M3.16 485.24c38.69 7.08 71.81 30.44 102.01 54.47 4.32 3.5 8.63 7 12.89 10.57l-13.19-10.19c-30.62-23.42-63.38-46.63-101.71-54.85Z" fill="#5a8e7b"></path>
                <path d="M135.62 519.22S82.68 498.15 78.48 393.3c0 0 82.75 93.24 57.14 125.92Z" fill="url(#929779c5-cd4d-43c1-bda7-db5bd93db612_comp-lvv1tkkj)"></path>
                <path d="M135.62 519.22S82.68 498.15 78.48 393.3c0 0 82.75 93.24 57.14 125.92Z" fill="#5b8e85"></path>
                <path d="M88.5 419.54c13.66 48.51 41.51 91.57 71.11 131.8 4.23 5.8 8.48 11.58 12.77 17.34-4.41-5.66-8.8-11.34-13.16-17.05C129.03 511.8 101 468.47 88.5 419.54Z" fill="#5a8e7b"></path>
                <path d="M110.46 515.6S45.06 537.91 9.4 424.9c0 0 120.03 32.22 101.06 90.7Z" fill="#74aa85"></path>
                <path d="M28.35 445.42c23.09 32.65 64.85 62.48 101.67 77.76-5.08-1.85-10.06-3.97-14.96-6.25-32.71-16.08-66.43-40.88-86.71-71.51Z" fill="#5a8e7b"></path>
                <path d="M132.17 534.92s9.97-78.22-76.36-111.76c0 0 17.88 109.73 76.36 111.76Z" fill="#92ce7c"></path>
                <path d="M72.67 444.12c32.36 32.91 55.7 74.44 69.14 118.47-1.91-5.44-3.82-10.88-5.91-16.25-14.7-37.47-35.83-72.66-63.23-102.23Z" fill="#5a8e7b"></path>
                <path d="M418.99 519.42s19.88-49.97 95.8-41.34c0 0-74.53 70.75-95.8 41.34Z" fill="#5b8e85"></path>
                <path d="M495 484.82c-38.33 8.22-71.09 31.44-101.71 54.85l-13.19 10.19c4.26-3.57 8.58-7.07 12.89-10.57 30.2-24.03 63.32-47.39 102.01-54.47Z" fill="#5a8e7b"></path>
                <path d="M358.58 525.12s52.94-21.07 57.14-125.92c0 0-82.75 93.24-57.14 125.92Z" fill="url(#1de705c6-0012-41b4-80a0-27038d861767_comp-lvv1tkkj)"></path>
                <path d="M358.58 525.12s52.94-21.07 57.14-125.92c0 0-82.75 93.24-57.14 125.92Z" fill="#5b8e85"></path>
                <path d="M405.7 425.43c-12.5 48.94-40.52 92.26-70.72 132.09-4.36 5.71-8.75 11.39-13.16 17.05 4.28-5.76 8.54-11.54 12.77-17.34 29.59-40.23 57.45-83.3 71.11-131.8Z" fill="#5a8e7b"></path>
                <path d="M383.74 521.49s65.4 22.31 101.06-90.7c0 0-120.03 32.22-101.06 90.7Z" fill="#74aa85"></path>
                <path d="M465.85 451.31c-20.27 30.62-54 55.43-86.71 71.51-4.9 2.29-9.88 4.41-14.96 6.25 36.81-15.27 78.57-45.1 101.67-77.76Z" fill="#5a8e7b"></path>
                <path d="M362.04 540.81s-9.97-78.22 76.36-111.76c0 0-17.88 109.73-76.36 111.76Z" fill="#92ce7c"></path>
                <path d="M421.53 450.01c-27.41 29.56-48.53 64.75-63.23 102.22-2.08 5.37-3.99 10.81-5.91 16.25 13.44-44.03 36.78-85.56 69.14-118.47Z" fill="#5a8e7b"></path>
            </g>
            <path d="M194.07 116.21c.96-4.21 11.46-8.21 20.46-2.04 9 6.17 11.38 16.75 8.5 25.28-4.83 14.3 20.38 13.77 26.22 37.88 4.61 19.04.33 45.91-25.39 44.45-39.27-2.23-35.88-40.61-37.6-60.78s-23.14-42.75 7.82-44.79Z" fill="#263238"></path>
            <path d="M181.1 170.06c-.17 2.92-.51 5.59-.89 8.37-.39 2.75-.91 5.48-1.5 8.2-.61 2.72-1.25 5.44-2.11 8.12-.81 2.69-1.78 5.36-2.92 7.98l-.88 1.96c-.12.3-.36.73-.55 1.1-.2.38-.42.71-.62 1.07-.85 1.37-1.79 2.54-2.74 3.65-1.9 2.22-3.93 4.17-6 6.03-4.19 3.67-8.51 6.97-13.16 9.96l-2.67-3.45c1.88-1.82 3.8-3.7 5.65-5.58 1.87-1.87 3.68-3.79 5.42-5.73 1.75-1.93 3.41-3.91 4.85-5.89.72-.99 1.36-2 1.88-2.95.11-.23.25-.47.34-.7.1-.24.18-.4.3-.73l.67-1.76c1.74-4.73 2.97-9.75 3.98-14.83.51-2.54.87-5.12 1.26-7.69.37-2.55.66-5.22.89-7.66l8.8.55Z" fill="#ffb573"></path>
            <path d="M175.1 159.56c-3.55.9-6.04 15.52-6.04 15.52l13.59 9.24s5.59-17.33 2.86-21.24c-2.85-4.07-5.22-4.85-10.4-3.53Z" fill="#dfc184"></path>
            <path d="m148.68 221.78-9.15 1.46 5.22 5.78s5.4-1.23 6.34-4.69l-2.41-2.55Z" fill="#ffb573"></path>
            <path fill="#ffb573" d="m135.2 224.39 5.22 5.65 4.33-1.02-5.22-5.78-4.33 1.15z"></path>
            <path fill="#ffb573" d="M194.32 405.6h-8.62l-.58-19.96h8.62l.58 19.96z"></path>
            <path fill="#ffb573" d="m253.92 380.2-7.98 3.26-10.11-17.43 7.98-3.26 10.11 17.43z"></path>
            <path d="m244.44 382.26 8.32-4.95c.3-.18.67-.12.89.15l4.86 6.02c.5.62.3 1.62-.41 2.02-2.93 1.67-4.43 2.34-8.09 4.51-2.25 1.34-7.55 5.92-10.66 7.77-3.04 1.81-5.1-1.13-3.97-2.18 5.06-4.7 7.1-9.36 8.08-12.17.18-.51.52-.93.97-1.19Z" fill="#263238"></path>
            <path d="M185.4 404.61h9.68c.35 0 .64.24.69.59l1.1 7.66c.11.79-.57 1.55-1.38 1.53-3.38-.06-5-.26-9.26-.26-2.62 0-8.04.27-11.66.27s-3.81-3.58-2.3-3.9c6.75-1.45 9.41-3.46 11.69-5.37.41-.34.93-.53 1.44-.53Z" fill="#263238"></path>
            <g opacity=".2">
                <path d="m185.12 385.65.3 10.29h8.62l-.29-10.29h-8.63z"></path>
                <path d="m243.82 362.77-7.99 3.26 5.22 8.99 7.98-3.26-5.21-8.99z"></path>
            </g>
            <path d="M175.1 159.56s-4.11 1.45 4.12 52.02h35.01c-.59-14.25-.6-23.03 6.21-52.27 0 0-7.33-1.6-14.86-1.96-5.89-.28-10.72-.47-15.9 0-6.83.62-14.57 2.21-14.57 2.21Z" fill="#dfc184"></path>
            <path d="M191.51 171.33s4.55 2.81 5.74 6.97c4.94-3.62 11.65-13.69 11.92-19.71.03-.73-.59-1.33-1.32-1.34-1.43-.02-2.28.09-2.28.09l-14.05 13.99Z" fill="#836c4b"></path>
            <path d="M191.51 171.33s-4.55 2.81-5.74 6.97c-5.31-3.89-2.36-16.72.68-21 2.19-.14 3.22.04 3.22.04l1.84 13.99Z" fill="#836c4b"></path>
            <path d="M203.99 139.45c-1 5.11-2 14.49 1.58 17.9 0 0-4.73 9.07-14.05 13.99-7.09-5.67-1.84-13.99-1.84-13.99 5.7-1.36 5.56-5.59 4.56-9.57l9.76-8.33Z" fill="#ffb573"></path>
            <path d="m200.01 142.85-5.78 4.93c.24.94.42 1.89.49 2.82 2.18-.31 5.61-2.17 6.07-4.54.22-1.12-.6-2.68-.79-3.21Z" opacity=".2"></path>
            <path d="M212.56 131.23c-2.36 8.22-3.19 11.75-8.35 15.09-7.76 5.03-17.34.33-17.48-8.44-.13-7.89 3.76-20.01 12.66-21.51 8.76-1.48 15.54 6.63 13.17 14.85Z" fill="#ffb573"></path>
            <path d="M194.81 117.11c.39 2.78 15.61 11.72 18.5 7.06 2.89-4.67-1.27-8.17-7.74-9.06s-10.76 2-10.76 2Z" fill="#263238"></path>
            <path d="M204.73 118.62c-1.87 2.47 2.09 20.18 7.76 18.52 5.67-1.66 5.41-7.34 1.47-12.57-3.94-5.23-9.23-5.94-9.23-5.94Z" fill="#263238"></path>
            <path d="M179.22 211.58s-6.8 66.39-6.23 92.68c.59 27.34 10.61 89.69 10.61 89.69h11.65s-1.84-60.76-.81-87.61c1.12-29.27 10.42-94.76 10.42-94.76h-25.63Z" fill="#407bff"></path>
            <path d="M179.22 211.58s-6.8 66.39-6.23 92.68c.59 27.34 10.61 89.69 10.61 89.69h11.65s-1.84-60.76-.81-87.61c1.12-29.27 10.42-94.76 10.42-94.76h-25.63Z" fill="#213a4a"></path>
            <path fill="#263238" d="M196.25 394.36h-13.67l-1-4.36 15.31-.53-.64 4.89z"></path>
            <path d="M194.32 228.1c-8.6 17.3-1.73 48.85 1.31 60.59 1.56-17.63 4.19-39.18 6.24-55.01-1.3-8.95-3.59-13.55-7.55-5.58Z" opacity=".2"></path>
            <path d="M188.46 211.58s7.93 69.02 13.92 91.19c7.11 26.31 35.99 71.2 35.99 71.2l10.88-4.44s-18.65-51.11-24.09-64.97c-11.6-29.58-1.67-73.67-10.94-92.97h-25.76Z" fill="#407bff"></path>
            <path d="M188.46 211.58s7.93 69.02 13.92 91.19c7.11 26.31 35.99 71.2 35.99 71.2l10.88-4.44s-18.65-51.11-24.09-64.97c-11.6-29.58-1.67-73.67-10.94-92.97h-25.76Z" fill="#213a4a"></path>
            <path fill="#263238" d="m250.74 369.57-13.5 5.51-3.17-3.65 15.58-7.2 1.09 5.34z"></path>
            <path d="M90.53 128.05c-24.32 21.52-26.58 58.69-5.06 83 21.52 24.32 58.68 26.58 83 5.06s26.59-58.69 5.07-83c-21.52-24.32-58.69-26.58-83.01-5.06Zm71.77 81.1c-20.47 18.11-51.75 16.21-69.86-4.26-18.12-20.47-16.21-51.76 4.26-69.87 20.47-18.12 51.76-16.21 69.87 4.26 18.11 20.47 16.21 51.75-4.27 69.87Z" fill="#263238"></path>
            <path d="M126.74 217.36c-25-1.52-44.03-23.03-42.51-48.03 1.53-25.01 23.03-44.04 48.03-42.52 25.01 1.53 44.04 23.03 42.52 48.04-1.52 25-23.03 44.04-48.04 42.51Z" opacity=".3" fill="#407bff"></path>
            <g opacity=".5">
                <path d="M132.26 126.81c-.29-.02-.56-.03-.85-.04l-47.12 41.7c-.03.29-.04.57-.06.86a45.19 45.19 0 0 0 7.46 27.8l67.27-59.53a45.15 45.15 0 0 0-26.69-10.78Z" fill="#fafafa"></path>
                <path d="m163.31 141.85-67.93 60.12c2.27 2.59 4.83 4.92 7.64 6.94l66.25-58.63a45.364 45.364 0 0 0-5.96-8.43Z" fill="#fafafa"></path>
            </g>
            <path d="m175.77 216.56-7.74 6.85a2.844 2.844 0 0 1-4.01-.24 2.844 2.844 0 0 1 .24-4.01l7.74-6.85a2.844 2.844 0 0 1 4.01.24c1.04 1.18.93 2.97-.24 4.01Z" fill="#263238"></path>
            <path d="M172.92 215.29c5.83 5.13 11.41 10.49 16.92 15.92 5.5 5.43 10.89 10.96 16.21 16.54 5.32 5.59 10.54 11.26 15.72 16.98 4.86 6 11.48 10.43 12.47 19.85a4.755 4.755 0 0 1-5.81 5.13c-9.23-2.13-12.83-9.24-18.19-14.79a974.22 974.22 0 0 1-14.94-17.67c-4.9-5.96-9.73-11.98-14.45-18.1-4.72-6.12-9.36-12.31-13.74-18.73a3.906 3.906 0 0 1 1.02-5.43 3.918 3.918 0 0 1 4.79.29Z" fill="#263238"></path>
            <path d="M213.11 139.43c-.98 1.48-2.56 2.36-3.99 2.63-2.16.4-3.04-1.58-2.27-3.51.69-1.74 2.64-4.04 4.72-3.56 2.05.47 2.66 2.76 1.54 4.45Z" fill="#ffb573"></path>
            <path d="M241.13 385.53s-.07 0-.1-.02c-.38-.08-.67-.33-.84-.76-.13-.32-.04-.56.06-.7.63-.9 3.74-.79 4.1-.77.09 0 .15.06.18.13.03.08 0 .16-.05.22-.8.77-2.27 2.02-3.34 1.9Zm2.7-1.85c-1.25 0-2.92.14-3.25.61-.04.06-.08.15-.01.31.12.3.3.47.55.52.58.13 1.58-.41 2.71-1.44Z" fill="#407bff"></path>
            <path d="M244.02 383.68c-1.06-.12-2.96-.85-3.25-1.7-.06-.18-.11-.53.3-.84.26-.2.56-.27.88-.21 1.23.23 2.51 2.36 2.56 2.45.04.06.04.14 0 .2s-.1.1-.17.1c-.09 0-.2 0-.32-.02Zm-2.21-2.36a.622.622 0 0 0-.49.14c-.21.16-.2.29-.16.38.2.57 1.75 1.27 2.79 1.41-.46-.69-1.34-1.79-2.07-1.93h-.06Z" fill="#407bff"></path>
            <path d="M182.17 406.11c-.86 0-1.65-.13-2.09-.53-.28-.25-.4-.59-.37-.99.02-.24.14-.43.35-.54 1.06-.58 4.49 1.18 4.88 1.38.08.04.12.12.11.21-.01.09-.08.15-.16.17-.73.14-1.76.31-2.71.31Zm-1.54-1.78c-.16 0-.29.02-.38.07-.08.05-.13.11-.14.22-.03.28.05.49.23.65.52.47 1.94.55 3.85.24-1.18-.57-2.75-1.18-3.57-1.18Z" fill="#407bff"></path>
            <path d="M184.84 405.81s-.06 0-.08-.02c-1.03-.46-3.06-2.32-2.9-3.3.04-.23.2-.52.77-.58.42-.04.8.08 1.13.35 1.08.9 1.28 3.22 1.29 3.32 0 .07-.03.14-.09.18-.04.02-.08.04-.12.04Zm-2.05-3.5h-.12c-.37.04-.4.19-.41.24-.1.59 1.28 2.05 2.33 2.68-.1-.68-.39-2.07-1.1-2.66-.21-.18-.45-.27-.71-.27Z" fill="#407bff"></path>
            <path d="m193.19 218.56-8.5-3.8 2.42 8.42s5.4 1.22 7.75-1.48l-1.67-3.14Z" fill="#ffb573"></path>
            <path d="M224.51 169.69c.39 2.95.7 5.92 1.05 8.88l.9 8.89c.32 2.96.56 5.93.83 8.9l.38 4.46.09 1.11c.01.11.04.58.05.89.01.35-.02.69-.04 1.04a9.436 9.436 0 0 1-1.19 3.61c-1.16 2.01-2.61 3.29-4.01 4.38-1.41 1.08-2.84 1.94-4.28 2.71-2.89 1.5-5.78 2.68-8.71 3.66-2.93.99-5.86 1.82-8.81 2.57-2.97.69-5.9 1.35-8.95 1.82l-.97-4.26c2.75-.9 5.57-1.84 8.29-2.88 2.75-1 5.46-2.08 8.08-3.27 2.61-1.2 5.19-2.44 7.48-3.9 1.15-.72 2.23-1.48 3.13-2.27.9-.78 1.62-1.65 1.89-2.26.14-.3.17-.5.17-.62-.02-.03 0-.05-.02-.08-.02-.06 0 .04-.03-.22l-.16-1.11-.64-4.43c-.4-2.95-.83-5.91-1.2-8.86l-1.13-8.87c-.32-2.96-.7-5.92-.98-8.89l8.76-.99Z" fill="#ffb573"></path>
            <path d="M220.43 159.31c3.51 1.07 7.72 13.14 7.72 13.14l-12.27 12.64s-6.3-12.99-4.82-17.52c1.53-4.72 5.37-9.47 9.38-8.26Z" fill="#dfc184"></path>
            <path fill="#ffb573" d="m177.65 216.51 2.41 6.94 7.05-.26-2.42-8.43-7.04 1.75z"></path>
            <g>
                <path d="M296.36 191.62c2.29-16.44-9.18-29.78-25.63-29.78h120.12c16.44 0 27.92 13.33 25.63 29.78H296.36Z" fill="#263238"></path>
                <path d="M296.36 191.62c2.29-16.44-9.18-29.78-25.63-29.78h120.12c16.44 0 27.92 13.33 25.63 29.78H296.36Z" fill="#836c4b"></path>
                <path d="M270.74 161.85h120.12c-16.44 0-31.63 13.33-33.93 29.78l-27.15 194.84c-2.29 16.44-17.48 29.78-33.93 29.78h-60.57c-16.44 0-27.92-13.33-25.63-29.78l27.15-194.84c2.29-16.44 17.48-29.78 33.93-29.78Z" fill="#dfc184"></path>
                <path d="M270.23 386.46c-2.29 16.44 9.18 29.78 25.63 29.78H175.74c-16.44 0-27.92-13.33-25.63-29.78h120.12Z" fill="#263238"></path>
                <path d="M270.23 386.46c-2.29 16.44 9.18 29.78 25.63 29.78H175.74c-16.44 0-27.92-13.33-25.63-29.78h120.12Z" fill="#836c4b"></path>
                <path d="M289.49 222.46h46.53c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-46.53c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path d="M288.21 231.63h34.19c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46H288.9c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path fill="#ffffff" opacity=".4" d="M271.119 212.078c5.221 5.598 4.239 15-2.195 21.001s-15.88 6.33-21.102.731c-5.222-5.597-4.24-15 2.194-21s15.881-6.33 21.103-.732z"></path>
                <path d="M246.21 222.96c-.32 2.29-.04 4.44.72 6.32 1.66 4.13 5.65 6.95 10.69 6.95s9.82-2.81 12.63-6.95c1.28-1.88 2.16-4.03 2.48-6.32 1.02-7.33-4.09-13.27-11.42-13.27s-14.09 5.94-15.11 13.27Z" fill="#ffffff"></path>
                <path d="M249.82 228.03c1.27 3.17 4.34 5.33 8.21 5.33s7.53-2.16 9.69-5.33c-2.32-1.71-5.26-2.71-8.57-2.71s-6.53 1-9.33 2.71Z" fill="#263238" opacity=".4"></path>
                <path d="M255.39 219.7c-.35 2.5 1.4 4.53 3.9 4.53s4.82-2.03 5.17-4.53c.35-2.5-1.4-4.53-3.9-4.53s-4.82 2.03-5.17 4.53Z" fill="#263238" opacity=".4"></path>
                <path d="M283.91 262.53h15.7c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-15.7c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path d="M309.07 262.53h22.42c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-22.42c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path d="M282.63 271.71h38.44c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-38.44c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path fill="#ffffff" opacity=".4" d="M265.538 252.153c5.222 5.597 4.24 15-2.194 21s-15.881 6.33-21.103.732c-5.222-5.597-4.24-15 2.194-21.001s15.881-6.329 21.103-.731z"></path>
                <path d="M240.62 263.03c-.32 2.29-.04 4.44.72 6.32 1.66 4.13 5.65 6.95 10.69 6.95s9.82-2.81 12.63-6.95c1.28-1.88 2.16-4.03 2.48-6.32 1.02-7.33-4.09-13.27-11.42-13.27s-14.09 5.94-15.11 13.27Z" fill="#ffffff"></path>
                <path d="M244.23 268.1c1.27 3.17 4.34 5.33 8.21 5.33s7.53-2.16 9.69-5.33c-2.32-1.71-5.26-2.71-8.57-2.71s-6.52 1-9.33 2.71Z" fill="#263238" opacity=".4"></path>
                <path d="M249.81 259.77c-.35 2.5 1.4 4.53 3.9 4.53s4.82-2.03 5.17-4.53-1.4-4.53-3.9-4.53-4.82 2.03-5.17 4.53Z" fill="#263238" opacity=".4"></path>
                <path d="M278.32 302.61h27.33c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-27.33c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path d="M277.04 311.78h42.6c1.36 0 2.62-1.11 2.81-2.46.19-1.36-.77-2.46-2.12-2.46h-42.6c-1.36 0-2.62 1.11-2.81 2.46-.19 1.36.77 2.46 2.12 2.46Z" fill="#ffffff" opacity=".4"></path>
                <path d="M230.39 350.82h65.24c1.9 0 3.67-1.55 3.94-3.46.26-1.9-1.07-3.45-2.97-3.45h-65.24c-1.9 0-3.67 1.55-3.94 3.45-.26 1.9 1.07 3.46 2.97 3.46Z" opacity=".2" fill="#ffffff"></path>
                <path d="M228.6 363.68h47.94c1.9 0 3.67-1.55 3.94-3.45.26-1.9-1.07-3.45-2.97-3.45h-47.94c-1.9 0-3.67 1.55-3.94 3.45-.26 1.9 1.07 3.45 2.97 3.45Z" opacity=".2" fill="#ffffff"></path>
                <path d="M253.07 193.41h77.78c.98 0 1.9-.8 2.04-1.79.14-.98-.56-1.79-1.54-1.79h-77.78c-.98 0-1.9.8-2.04 1.79-.14.98.56 1.79 1.54 1.79Z" opacity=".2" fill="#ffffff"></path>
                <path fill="#ffffff" opacity=".4" d="M259.953 292.226c5.222 5.598 4.24 15-2.194 21.001s-15.881 6.33-21.103.732c-5.221-5.598-4.239-15 2.195-21.002s15.88-6.329 21.102-.73z"></path>
                <path d="M235.04 303.11c-.32 2.29-.04 4.44.72 6.32 1.66 4.13 5.65 6.95 10.69 6.95s9.82-2.81 12.63-6.95c1.28-1.88 2.16-4.03 2.48-6.32 1.02-7.33-4.09-13.27-11.42-13.27s-14.09 5.94-15.11 13.27Z" fill="#ffffff"></path>
                <path d="M238.65 308.18c1.27 3.17 4.34 5.33 8.21 5.33s7.53-2.16 9.69-5.33c-2.32-1.71-5.26-2.71-8.57-2.71s-6.53 1-9.33 2.71Z" fill="#263238" opacity=".4"></path>
                <path d="M244.22 299.85c-.35 2.5 1.4 4.53 3.9 4.53s4.82-2.03 5.17-4.53c.35-2.5-1.4-4.53-3.9-4.53s-4.82 2.03-5.17 4.53Z" fill="#263238" opacity=".4"></path>
            </g>
        </g>
    </g>
</svg>             
<h2 className='text-xl'> البحث و التوظيف</h2>


       </div>  <motion.div 
                    
                    whileHover={{ scale: 1.10 }}
                    whileTap={{ scale: 0.95 }}
                  className="bg-white bg-opacity-80 p-4 flex flex-col gap-2 items-center justify-center rounded-lg shadow-lg">

                    <svg preserveAspectRatio="xMidYMid meet" className='h-[150px]' data-bbox="-3.77 101.5 502.906 466.66" viewBox="0 0 500 500" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="rotate(-44.63 3468.92 -3184.817)" y2="-2899.06" x2="-1498.47" y1="-2999.75" x1="-1450.37" id="9d33cdf9-db94-4d9d-91aa-bf45793bbb98_comp-lvv1tkl2">
                <stop stop-color="#8bc47c" offset="0"></stop>
                <stop stop-color="#679653" offset=".88"></stop>
            </linearGradient>
            <linearGradient xlinkHref="#9d33cdf9-db94-4d9d-91aa-bf45793bbb98_comp-lvv1tkl2" gradientTransform="scale(-1 1) rotate(-44.63 -96.07 5501.05)" y2="1769.21" x2="3223.26" y1="1668.52" x1="3271.36" id="62b94391-7362-498c-a553-e5c8675090fb_comp-lvv1tkl2"></linearGradient>
            <clipPath id="8c603c05-a57f-4a91-99e2-fa23d851fce3_comp-lvv1tkl2">
                <path stroke-width="0" d="M503.77 311.21V500H3.95V311.21h499.82z"></path>
            </clipPath>
        </defs>
        <g style={{isolation:"isolate"}}>
            <path fill="#f5f5f5" d="M443.89 416.24c0 6.252-86.808 11.32-193.89 11.32-107.082 0-193.89-5.068-193.89-11.32 0-6.252 86.808-11.32 193.89-11.32 107.082 0 193.89 5.068 193.89 11.32z"></path>
            <path d="M137.39 304.29c15.64-14.42 24.32-35.28 23.46-54.62-.97-22.13-13.64-41.85-32.14-53.8-32.97-21.3-95.43-24.29-121.97 17.11C-5.03 231.35-6.6 253.8.46 272.18c7.06 18.38 22.12 32.79 40.24 41.91 26.39 13.29 62.76 14.84 89.48-3.98 2.54-1.79 4.94-3.74 7.2-5.82Z" fill="#efefef"></path>
            <path d="M419.54 499.58c72.26-45.67 113.5-174.59 43.51-236.94-28.77-25.63-71.91-29.91-109.75-21.91-35.03 7.41-59.43 28.48-86.2 49.1-30.36 23.4-68.1 55.51-107.35 58.18-41.56 2.83-90.53 4.83-117.11 40.63-28.51 38.4-15.35 75.46 12.6 110.93h364.29Z" fill="#efefef"></path>
            <g clip-path="url(#8c603c05-a57f-4a91-99e2-fa23d851fce3_comp-lvv1tkl2)">
                <path d="M91.52 518.13s-18.18-45.68-87.57-37.79c0 0 68.13 64.67 87.57 37.79Z" fill="#5b8c83"></path>
                <path d="M22.04 486.5c35.37 6.48 65.65 27.82 93.25 49.79 3.95 3.2 7.87 6.42 11.79 9.67-4.01-3.13-8.02-6.23-12.06-9.31-27.97-21.43-57.97-42.58-92.98-50.14Z" fill="#5a8e7b"></path>
                <path d="M143.13 517.57S94.74 498.31 90.9 402.46c0 0 75.64 85.23 52.23 115.11Z" fill="url(#9d33cdf9-db94-4d9d-91aa-bf45793bbb98_comp-lvv1tkl2)"></path>
                <path d="M143.13 517.57S94.74 498.31 90.9 402.46c0 0 75.64 85.23 52.23 115.11Z" fill="#5b8c83"></path>
                <path d="M100.05 426.45c12.48 44.34 37.95 83.71 65 120.48 3.86 5.3 7.76 10.58 11.67 15.85-4.03-5.17-8.05-10.37-12.03-15.58-27.6-36.41-53.22-76.02-64.64-120.75Z" fill="#5a8e7b"></path>
                <path d="M120.13 514.26s-59.79 20.39-92.38-82.91c0 0 109.73 29.45 92.38 82.91Z" fill="#74a883"></path>
                <path d="M45.07 450.11c19.91 27.72 49.4 49.32 79.46 64.96 4.41 2.22 8.9 4.27 13.48 6.12-4.63-1.71-9.2-3.62-13.68-5.72-30.04-14.79-60.59-37.26-79.27-65.36Z" fill="#5a8e7b"></path>
                <path d="M139.97 531.92s9.11-71.5-69.8-102.16c0 0 16.34 100.31 69.8 102.16Z" fill="#91cc7c"></path>
                <path d="M85.59 448.92c29.59 30.1 50.91 68.03 63.2 108.3-1.72-4.98-3.5-9.94-5.4-14.85-13.45-34.25-32.74-66.43-57.8-93.45Z" fill="#5a8e7b"></path>
                <path d="M402.16 517.76s18.18-45.68 87.57-37.79c0 0-68.13 64.67-87.57 37.79Z" fill="#5b8c83"></path>
                <path d="M471.64 486.12c-35.01 7.56-65 28.71-92.98 50.14-4.04 3.08-8.06 6.19-12.06 9.31 3.91-3.24 7.84-6.46 11.79-9.67 27.6-21.97 57.89-43.31 93.25-49.79Z" fill="#5a8e7b"></path>
                <path d="M346.94 522.96s48.39-19.26 52.23-115.11c0 0-75.64 85.23-52.23 115.11Z" fill="url(#62b94391-7362-498c-a553-e5c8675090fb_comp-lvv1tkl2)"></path>
                <path d="M346.94 522.96s48.39-19.26 52.23-115.11c0 0-75.64 85.23-52.23 115.11Z" fill="#5b8c83"></path>
                <path d="M390.02 431.83c-11.43 44.74-37.04 84.34-64.64 120.75-3.98 5.22-7.99 10.41-12.03 15.58 3.92-5.26 7.81-10.55 11.67-15.85 27.05-36.77 52.52-76.15 65-120.48Z" fill="#5a8e7b"></path>
                <path d="M369.94 519.64s59.79 20.39 92.38-82.91c0 0-109.73 29.45-92.38 82.91Z" fill="#74a883"></path>
                <path d="M445 455.49c-18.66 28.1-49.23 50.58-79.26 65.37-4.48 2.09-9.04 4-13.68 5.72 4.58-1.85 9.08-3.9 13.48-6.12 30.06-15.65 59.55-37.24 79.46-64.96Z" fill="#5a8e7b"></path>
                <path d="M350.1 537.31s-9.11-71.5 69.8-102.16c0 0-16.34 100.31-69.8 102.16Z" fill="#91cc7c"></path>
                <path d="M404.49 454.3c-25.06 27.02-44.35 59.2-57.8 93.45-1.9 4.91-3.68 9.87-5.4 14.85 12.29-40.27 33.62-78.2 63.2-108.3Z" fill="#5a8e7b"></path>
            </g>
            <g>
                <path d="M369.88 410.53h-1.07c-.42 0-.78-.37-.85-.87l-6.58-45.83h5l4.36 45.52c.06.62-.34 1.17-.86 1.17Z" fill="#407bff"></path>
                <path d="M369.88 410.53h-1.07c-.42 0-.78-.37-.85-.87l-6.58-45.83h5l4.36 45.52c.06.62-.34 1.17-.86 1.17Z" fill="#3f3c36"></path>
                <path d="M383.6 410.53h-1.07c-.42 0-.78-.37-.85-.87l-6.58-45.83h5l4.36 45.52c.06.62-.34 1.17-.86 1.17Z" fill="#407bff"></path>
                <path d="M383.6 410.53h-1.07c-.42 0-.78-.37-.85-.87l-6.58-45.83h5l4.36 45.52c.06.62-.34 1.17-.86 1.17Z" fill="#3f3c36"></path>
                <path d="M307.16 410.53h1.07c.42 0 .78-.37.85-.87l6.58-45.83h-5l-4.36 45.52c-.06.62.34 1.17.86 1.17Z" fill="#407bff"></path>
                <path d="M307.16 410.53h1.07c.42 0 .78-.37.85-.87l6.58-45.83h-5l-4.36 45.52c-.06.62.34 1.17.86 1.17Z" fill="#3f3c36"></path>
                <path d="M293.44 410.53h1.07c.42 0 .78-.37.85-.87l6.58-45.83h-5l-4.36 45.52c-.06.62.34 1.17.86 1.17Z" fill="#407bff"></path>
                <path d="M293.44 410.53h1.07c.42 0 .78-.37.85-.87l6.58-45.83h-5l-4.36 45.52c-.06.62.34 1.17.86 1.17Z" fill="#3f3c36"></path>
                <path d="M275.66 309.51h33.68c5.98-20.75 27.48-37.12 49.5-37.12h10.94c23.05 0 37.92 17.93 33.22 40.06-.86 4.06-2.33 7.98-4.29 11.67l-5.31 32.19c-.69 4.16-4 7.52-7.4 7.52H284.63c-3.4 0-6.72-3.37-7.4-7.52l-6.48-39.28c-.69-4.15 1.52-7.52 4.92-7.52Z" fill="#407bff"></path>
                <path d="M275.66 309.51h33.68c5.98-20.75 27.48-37.12 49.5-37.12h10.94c23.05 0 37.92 17.93 33.22 40.06-.86 4.06-2.33 7.98-4.29 11.67l-5.31 32.19c-.69 4.16-4 7.52-7.4 7.52H284.63c-3.4 0-6.72-3.37-7.4-7.52l-6.48-39.28c-.69-4.15 1.52-7.52 4.92-7.52Z" fill="#46789e"></path>
                <path d="m267.23 398.68 8.34 3.83c.3.14.44.46.32.76l-2.62 6.79c-.27.7-1.21 1.06-1.91.72-2.88-1.38-4.19-2.19-7.86-3.87-2.26-1.04-8.44-4.5-11.22-6.5-2.72-1.96-.72-4.7.64-4.1 6.09 2.69 9.97 2.93 12.83 2.25.51-.12 1.04-.07 1.49.13Z" fill="#263238"></path>
                <path d="M326.38 296.43s-53.33.66-54.15 21.68c-1.18 30.22-5.65 80.38-5.65 80.38l8.99 4.01s15.76-50.34 16.32-73.94c14.96-3.73 53.57.03 58.1-12.27 3.71-10.06 1.7-19.87 1.7-19.87h-25.32Z" fill="#407bff"></path>
                <path d="M326.38 296.43s-53.33.66-54.15 21.68c-1.18 30.22-5.65 80.38-5.65 80.38l8.99 4.01s15.76-50.34 16.32-73.94c14.96-3.73 53.57.03 58.1-12.27 3.71-10.06 1.7-19.87 1.7-19.87h-25.32Z" fill="#ddbf82"></path>
                <path d="M337.73 241.12c-.46 1.94-.93 3.69-1.47 5.51-.53 1.8-1.08 3.59-1.65 5.37-1.17 3.56-2.46 7.1-3.95 10.6-1.48 3.51-3.13 6.98-5.14 10.41-1.02 1.71-2.1 3.43-3.39 5.1-1.29 1.67-2.74 3.34-4.65 4.91l-.15.12c-.1.09-.22.17-.33.24-1.27.84-2.46 1.09-3.36 1.2-.92.1-1.66.06-2.28-.02-1.26-.15-2.19-.44-3.06-.74-1.71-.61-3.12-1.31-4.48-2.04-2.69-1.45-5.08-3.07-7.43-4.72-2.32-1.67-4.56-3.4-6.74-5.2-2.16-1.83-4.28-3.63-6.34-5.62a3.06 3.06 0 0 1-.08-4.32c.98-1.02 2.5-1.21 3.68-.55l.05.03c2.36 1.31 4.74 2.7 7.13 3.98 2.38 1.32 4.75 2.62 7.12 3.83 2.36 1.23 4.75 2.38 7.03 3.32 1.13.46 2.26.86 3.19 1.07.45.1.86.15.97.13.07 0 .02-.04-.21-.02-.22.02-.72.09-1.42.53l-.47.36c.85-.8 1.75-1.93 2.59-3.19.83-1.27 1.65-2.65 2.41-4.1 1.51-2.92 2.86-6.06 4.1-9.27 1.23-3.22 2.38-6.52 3.45-9.86 1.09-3.31 2.07-6.77 2.98-10.01l.03-.12a6.114 6.114 0 0 1 7.54-4.25c3.18.89 5.07 4.13 4.31 7.32Z" fill="#213a4a"></path>
                <path d="M316.11 403.02h10.01c.36 0 .64.25.66.61l.48 7.92c.05.82-.72 1.6-1.56 1.58-3.48-.06-5.15-.26-9.55-.26-2.71 0-8.17.28-11.9.28s-3.63-3.7-2.05-4.03c7.1-1.5 9.86-3.57 12.37-5.55.45-.36 1-.55 1.53-.55Z" fill="#263238"></path>
                <path d="M340.75 296.43s-48.37 4.09-47.18 25.09c1.3 23 22.54 81.5 22.54 81.5h9.78s-8.37-53.57-11.32-76.99c13.63 0 45.25 2.57 49.79-9.73 3.71-10.06 1.7-19.87 1.7-19.87h-25.32Z" fill="#ddbf82"></path>
                <path d="M287.68 262.4s-1.39-2.26-2.72-3.34c-1.98 1.85-3.09 7.26-3.09 7.26l2.74.25s3.14-1.02 3.08-4.17Z" fill="#ddbf82"></path>
                <path d="m277.64 257.54-3.11-1.35c-.84-.36-1.81-.05-2.28.73l-1.47 2.44c-.42.7-.32 1.6.24 2.2l4.27 4.46 7.12-.29c.82-.03 1.56-.5 1.93-1.23l.82-1.61c.52-1.01.23-2.27-.71-2.89-2.31-1.53-6.81-2.45-6.81-2.45Z" fill="#ffc3bd"></path>
                <path d="M325.92 239.07c-1.43 8.97-3.27 28.43.5 57.74l39.65-.37c-.24-20.3 2.95-39.37 6.05-58 .52-3.09-1.61-5.96-4.71-6.41-9.52-1.37-24.9-1.32-34.23-.03-3.71.51-6.67 3.37-7.26 7.07Z" fill="#213a4a"></path>
                <path d="M372.48 235.9c1.16 2.89 2.1 5.66 3.06 8.52.95 2.84 1.78 5.73 2.57 8.64.76 2.92 1.48 5.87 2.03 8.9.56 3.03 1.05 6.11 1.22 9.38.05.81.07 1.65.08 2.49l-.02 1.28c-.02.9-.16 2.28-.99 3.74-.4.71-1.02 1.44-1.66 1.94-.34.28-.66.49-.99.67-.35.2-.65.33-.96.44-1.22.45-2.17.51-2.94.51-1.51-.03-2.54-.29-3.5-.55-1.88-.54-3.38-1.21-4.85-1.91-1.45-.71-2.81-1.47-4.14-2.24-5.29-3.14-10.05-6.63-14.66-10.5a3.057 3.057 0 0 1-.38-4.3 3.057 3.057 0 0 1 3.65-.8l.07.03c5.17 2.46 10.43 4.99 15.55 7.11 1.28.53 2.55 1.02 3.79 1.43 1.22.42 2.46.79 3.42.93.45.07.87.06.82.02-.04-.01-.25-.05-.8.13-.13.05-.27.11-.46.21-.17.09-.34.21-.54.36-.36.28-.74.72-.97 1.11-.48.83-.5 1.46-.52 1.64l-.06-.9c-.06-.62-.11-1.23-.2-1.88-.68-5.13-2.13-10.59-3.73-15.96-1.61-5.36-3.44-10.85-5.32-16.06l-.02-.05c-1.14-3.18.51-6.69 3.69-7.83 3.1-1.12 6.52.44 7.75 3.47Z" fill="#213a4a"></path>
                <path d="m356.63 211.91-4.8 3.98-6.53 5.42c.19.88.34 1.78.41 2.64.31 3.15-.38 6.05-4.21 7.52-1.45.55-2.71 1.61-3.16 3.09-.52 1.68.09 3.54 5.36 3.54 7.73 0 11.76-3.44 13.28-5.13.43-.48.43-1.18.06-1.7-3.06-4.34-1.66-13.94-.41-19.36Z" fill="#ffc3bd"></path>
                <path d="M343.51 236.41s.51.56.67 1.36c.4-.68 1.45-1.36 1.45-1.36s2.29 1.02 2.77 3.25c-1.47-.09-4.16-1.55-4.16-1.55s-1.39.8-2.78.87c.06-1.73 2.05-2.57 2.05-2.57Z" fill="#ddbf82"></path>
                <path d="M345.63 236.41c2.22 2.5 2.65 5.83 2.65 5.83s12.8-3.2 12.2-11.54c-1.08-.68-3.55-1.09-3.55-1.09s-2.75 5-11.3 6.8Z" fill="#ddbf82"></path>
                <path d="M343.51 236.41c-2.22 2.5-2.82 5.83-2.82 5.83s-6.57-5.98-.17-11.47c1.13-.46 3.38-.71 3.38-.71s-4.25 3.45-.4 6.35Z" fill="#ddbf82"></path>
                <path d="M345.3 221.31c.19.88.34 1.78.41 2.64 2.44-.49 5.69-3.08 6.03-5.57.13-.94.15-1.84.09-2.49l-6.53 5.42Z" opacity=".2"></path>
                <path d="M338.3 194.69c-6.02 4.27-2.65 14.29 2.48 10.45 5.14-3.83 2.42-13.93-2.48-10.45Z" fill="#213a4a"></path>
                <path d="M358.61 203.61c-1.67 7.67-2.25 12.23-6.78 15.73-6.81 5.26-15.84.59-16.5-7.34-.6-7.14 2.23-18.48 10.3-20.65 7.95-2.14 14.65 4.6 12.99 12.27Z" fill="#ffc3bd"></path>
                <path d="M355.06 197.92c-4.25-1.17-15.21 1.62-19.1-2.53-4.17-4.45 1.92-6.61 3.71-5.07-2.27-2.6-1.42-5.38 1.79-5.13 2.35.18 3.09 2.78 3.09 2.78s-.39-4.55 3.64-4.23c3.66.28 3.67 5.22 3.67 5.22s8.74-2.47 11.66 5.87c5.5-.12 5.38 11.46-5.69 15.58-4.49-2.23-4.7-10.12-2.78-12.49Z" fill="#213a4a"></path>
                <path d="M362.35 196.5c-.53 0-1-.38-1.09-.92-.11-.6.29-1.18.89-1.29.1-.03.4-.27.64-.81.26-.57.43-1.41.12-2.08-.25-.56 0-1.22.55-1.47.56-.26 1.22 0 1.47.55.67 1.46.31 3.12-.24 4.17-.53 1.01-1.32 1.68-2.15 1.83-.07.01-.13.02-.2.02Z" fill="#213a4a"></path>
                <path d="M359.86 210.72c-1.13 1.48-2.77 2.35-4.21 2.61-2.17.38-2.83-1.61-1.87-3.55.86-1.74 3.03-4.04 5.03-3.54 1.97.49 2.33 2.8 1.04 4.49Z" fill="#ffc3bd"></path>
                <path d="m348.81 256.94-4.38-2.72c-1.31-.82-3.04-.4-3.84.92l-.52.85c-.62 1.03-.51 2.35.28 3.26l3.02 3.47s2.63 6.13 5.68 4.51l2.32-4.03-2.57-6.26Z" fill="#ffc3bd"></path>
                <path d="M353.32 264.78s-1.1-2.71-2.29-4.08c-2.2 1.88-3.98 7.89-3.98 7.89l2.69.58s3.25-.81 3.58-4.39Z" fill="#ddbf82"></path>
                <path d="M386.83 309.51h-51.92c-3.4 0-5.61 3.37-4.92 7.52l6.48 39.28c.69 4.16 4 7.52 7.4 7.52h36.53l6.43-54.32Z" fill="#407bff"></path>
                <path d="M386.83 309.51h-51.92c-3.4 0-5.61 3.37-4.92 7.52l6.48 39.28c.69 4.16 4 7.52 7.4 7.52h36.53l6.43-54.32Z" fill="#46789e"></path>
            </g>
            <path d="M147.28 413.9h1.5c.51 0 .93-.43.97-.99L158 289.02h-6.2l-5.49 123.76c-.03.61.42 1.12.97 1.12Z" fill="#407bff"></path>
            <path d="M147.28 413.9h1.5c.51 0 .93-.43.97-.99L158 289.02h-6.2l-5.49 123.76c-.03.61.42 1.12.97 1.12Z" fill="#282828"></path>
            <path d="M130.28 413.9h1.5c.51 0 .93-.43.97-.99L141 289.02h-6.2l-5.49 123.76c-.03.61.42 1.12.97 1.12Z" fill="#407bff"></path>
            <path d="M130.28 413.9h1.5c.51 0 .93-.43.97-.99L141 289.02h-6.2l-5.49 123.76c-.03.61.42 1.12.97 1.12Z" fill="#282828"></path>
            <path d="M339.93 413.9h-1.5c-.51 0-.93-.43-.97-.99l-8.25-123.89h6.2l5.49 123.76c.03.61-.42 1.12-.97 1.12Z" fill="#407bff"></path>
            <path d="M339.93 413.9h-1.5c-.51 0-.93-.43-.97-.99l-8.25-123.89h6.2l5.49 123.76c.03.61-.42 1.12-.97 1.12Z" fill="#282828"></path>
            <path d="M356.93 413.9h-1.5c-.51 0-.93-.43-.97-.99l-8.25-123.89h6.2l5.49 123.76c.03.61-.42 1.12-.97 1.12Z" fill="#407bff"></path>
            <path d="M356.93 413.9h-1.5c-.51 0-.93-.43-.97-.99l-8.25-123.89h6.2l5.49 123.76c.03.61-.42 1.12-.97 1.12Z" fill="#282828"></path>
            <path fill="#282828" d="M364.08 286.48v2.55h-241.3v-2.55h241.3z"></path>
            <g>
                <path d="m118.76 247.02-2.28 16.77c-.72 5.58-1.47 11.18-2.01 16.68-.08.69-.13 1.37-.18 2.05l-.08 1.02c0-.07 0-.34-.04-.5-.02-.16-.07-.34-.12-.48-.03-.12-.1-.26-.15-.35-.04-.08-.1-.17-.14-.23-.18-.23-.2-.2-.15-.15.04.06.18.17.34.28.34.24.81.52 1.32.77 2.12 1.04 4.75 1.92 7.34 2.73 5.25 1.59 10.75 2.97 16.19 4.31l-.61 4.78c-5.82-.21-11.53-.75-17.34-1.8-2.91-.55-5.8-1.16-8.91-2.35-.79-.31-1.59-.66-2.47-1.16-.44-.26-.89-.54-1.4-.95-.49-.41-1.03-.88-1.6-1.7-.28-.42-.55-.92-.76-1.53-.1-.31-.18-.66-.24-.99a7.82 7.82 0 0 1-.06-1.03l.02-1.11c.02-.74.03-1.48.07-2.21.24-5.84.76-11.54 1.39-17.24.61-5.7 1.34-11.35 2.23-17.03l9.62 1.42Z" fill="#7f3e3b"></path>
                <path d="m151.41 294.97-3.67 3.35c-.86.78-2.1.97-3.15.46l-4.05-1.95s-6.01-.25-6.87-3.92l1.55-2.85 9.31-1.03c.96-.11 1.92.11 2.74.61l3.84 2.34a1.88 1.88 0 0 1 .29 2.99Z" fill="#7f3e3b"></path>
                <path d="M129.45 212.56c.95 5.75 1.76 16.26-2.36 19.96 0 0 10.04 5.26 16.63 14.44 7.04-5.58 1.15-13.91 1.15-13.91-6.33-1.71-6.03-6.44-4.78-10.85l-10.63-9.64Z" fill="#7f3e3b"></path>
                <path d="M148.24 236.59s-.53-4.88-3.19-7.29c-2.24-2.03-13.97-.9-17.67-.49-.7.08-1.3.51-1.6 1.14l-2.68 5.6 25.14 1.04Z" fill="#407bff"></path>
                <path d="M148.24 236.59s-.53-4.88-3.19-7.29c-2.24-2.03-13.97-.9-17.67-.49-.7.08-1.3.51-1.6 1.14l-2.68 5.6 25.14 1.04Z" fill="#213a4a"></path>
                <path d="M115.73 234.02c-7.24 2.36-8.8 12.06-8.15 19.62l14.61 8.99s3.55-11.03 3.52-16.93c-.03-6.27-5.07-13.28-9.99-11.69Z" fill="#ddbf82"></path>
                <path d="M118.56 260.43c-.35 0-.7-.14-.96-.39-.06-.07-.12-.14-.16-.21a.92.92 0 0 1-.13-.24c-.03-.08-.06-.16-.08-.25-.02-.09-.03-.17-.03-.26 0-.36.15-.71.4-.96.51-.51 1.42-.51 1.92 0 .25.25.4.6.4.96 0 .09 0 .17-.03.26-.02.09-.04.17-.08.25-.03.09-.07.17-.12.24-.05.07-.11.14-.17.21-.25.25-.6.39-.96.39Z" fill="#ffffff"></path>
                <path d="M115.75 259.51c-.52-.2-.85-.69-.87-1.22-.39.35-.96.46-1.47.22-.5-.23-.8-.74-.79-1.26-.41.33-.99.4-1.48.13a1.35 1.35 0 0 1-.71-1.3c-.43.3-1.01.34-1.49.05-.64-.38-.84-1.22-.46-1.86.39-.64 1.23-.85 1.87-.46.45.28.68.78.65 1.27.4-.29.95-.34 1.42-.09.46.25.73.73.72 1.23.38-.31.93-.39 1.41-.17.48.22.77.69.79 1.18.37-.32.9-.44 1.4-.25.69.28 1.04 1.07.76 1.76-.21.54-.72.86-1.26.86-.17 0-.33-.03-.5-.09Z" fill="#ffffff"></path>
                <path d="M107.59 255c-.09 0-.18 0-.27-.03-.09-.02-.17-.04-.25-.08a.899.899 0 0 1-.24-.12c-.07-.05-.14-.11-.2-.17-.07-.06-.12-.13-.17-.2-.05-.08-.09-.16-.13-.24-.03-.08-.06-.17-.08-.25 0-.09-.02-.18-.02-.27s.01-.18.02-.26c.02-.09.05-.17.08-.26.03-.08.08-.16.13-.23s.1-.14.17-.21c.06-.06.13-.12.2-.17.07-.04.15-.09.24-.12.08-.03.16-.06.25-.08.44-.08.91.06 1.22.37.07.07.12.14.17.21.05.07.09.15.13.23.03.09.06.17.07.26.02.08.03.17.03.26s0 .18-.03.27c-.01.08-.04.17-.07.25-.04.08-.08.16-.13.24-.05.07-.1.14-.17.2-.25.25-.6.4-.95.4Z" fill="#ffffff"></path>
                <path d="M161.77 248.13c-.61 8.32-2.46 22.32-7.02 45.9l-39.14-1.16c1.03-14.45-.52-25.22-4.06-50.51-.65-4.62 2.67-8.84 7.31-9.31 2.51-.26 5.37-.47 8.24-.53 6.6-.12 12-.17 17.77.53 1.91.23 3.88.53 5.76.85a13.42 13.42 0 0 1 11.14 14.22Z" fill="#ddbf82"></path>
                <path d="M123.06 201.8c1.72 9.41 2.25 13.43 7.62 17.73 8.08 6.46 19.27 2.29 20.4-7.45 1.02-8.76-1.97-22.69-11.7-25.35-9.59-2.62-18.03 5.65-16.31 15.07Z" fill="#7f3e3b"></path>
                <path d="M143.8 204.44c1.59 5.17 5.37 17.68-2.98 20.46-6.53 2.18-26.99 3.92-29.35-8.07-2.44-12.39 8.62-21.22 8.62-21.22s-8.76-7.18-3.15-15c7.23-10.08 24.54-4.38 29.68 2.74 5 6.93-2.82 21.08-2.82 21.08Z" fill="#263238"></path>
                <path d="M127.96 226.62c-3.35 0-7.5-.68-10.93-2.16-4.65-2-7.36-5.09-7.84-8.94-1.64-13.07 10.52-20.25 10.64-20.32l.48.84c-.12.07-11.73 6.94-10.17 19.37.55 4.41 4.26 6.88 7.26 8.17 5.94 2.56 13.61 2.54 15.47 1.18l.57.78c-.97.71-3.01 1.09-5.5 1.09Z" fill="#263238"></path>
                <path d="M116.31 193.74c-.11 1.67-1.5 3.97 4.3 4.83 5.8.86 13.85.78 15.5-.61 1.65-1.39 3.28-4.73-.18-4.43-3.46.3-19.44-2.65-19.63.21Z" fill="#ddbf82"></path>
                <path d="M140.63 205.91c.99 1.88 2.76 3.13 4.44 3.63 2.52.74 3.82-1.51 3.15-3.91-.61-2.16-2.65-5.15-5.2-4.83-2.51.31-3.52 2.97-2.38 5.12Z" fill="#7f3e3b"></path>
                <path fill="#7f3e3b" d="m201.64 403.56 9.28-.18-4.49-23.16-9.28.17 4.49 23.17z"></path>
                <path d="M208.6 393.47c2.46 9.24 11.48 19.03 11.48 19.03l-12.88-3.27-5.63-8 .99-2.12 6.04-5.65Z" fill="#7f3e3b"></path>
                <path d="M199.45 397.77c-.04 1.03.04 2.2.19 3.24.54 3.82 2.23 13.96 2.23 13.96h.87s-.83-6.82-.71-9.33 1.74 1.93 3.7 4.45c1.96 2.52 5.49 4.81 11.2 4.98 6.68.21 9.35-.07 7.21-1.74-2.14-1.67-6.7-2.76-6.7-2.76s-5.26-1.89-9.02-7.54c-2.44-3.66-6.52-6.32-8.3-7.18-.54.09-.65 1.11-.68 1.92Z" fill="#263238"></path>
                <path fill="#7f3e3b" d="m234.51 372.09 11.84.37-13.25-19.7-8.2 7.01 9.61 12.32z"></path>
                <path d="M237.32 363.73c8.61 4.01 22.39 3.22 22.39 3.22l-11.2 8.99-9.61-.71-1.01-2.13-.56-9.36Z" fill="#7f3e3b"></path>
                <path d="M235.5 373.94c.73.73 1.64 1.47 2.49 2.07 3.14 2.19 11.63 7.8 11.63 7.8l.54-.68s-5.52-4.02-7.29-5.83c-1.77-1.82 2.49-.05 5.55.13 3.06.18 6.92-1.03 10.57-5.4 4.28-5.11 5.72-7.4 3.17-6.86s-6.16 3.38-6.16 3.38-4.63 2.84-11.11 1.93c-4.2-.59-8.67.81-10.39 1.61-.26.49.41 1.27.99 1.85Z" fill="#263238"></path>
                <path d="M141.1 293.35s63.36-9.37 69.92 6.87c11.41 28.26 27.53 60.64 27.53 60.64l-7.78 6.44s-27.63-25.57-37.46-53.97c-11.74 3.8-49.09 16.02-62.77 16.02-14.61 0-20.58-12.46-15.3-33.14a4.156 4.156 0 0 1 4.05-3.11c9.2.05 21.8.25 21.8.25Z" fill="#213a4a"></path>
                <path d="M147.17 301.6s52.01-1.57 52.44 16.86c.73 30.47 9.31 74.13 9.31 74.13l-9.49.88s-15.51-34.73-19.61-64.49c-18.53 1.2-35.6.37-49.28.37-15.33 0-16.6-16.84-1.68-36.48 9.12 0 18.3 8.73 18.3 8.73Z" fill="#213a4a"></path>
                <path d="m115.09 290.55-1.11 3.47c-.15.27.17.55.62.57l40.28 1.2c.35.01.65-.15.68-.37l.46-3.49c.03-.24-.27-.46-.65-.47l-39.63-1.18c-.29 0-.55.1-.65.27Z" fill="#ffffff"></path>
                <path d="m120.28 295.14-1.06-.03c-.21 0-.37-.12-.35-.25l.63-4.54c.02-.13.21-.24.42-.23l1.06.03c.21 0 .37.12.35.25l-.63 4.54c-.02.13-.21.24-.42.23Z" fill="#263238"></path>
                <path d="m151.89 296.09-1.06-.03c-.21 0-.37-.12-.35-.25l.63-4.54c.02-.13.21-.24.42-.23l1.06.03c.21 0 .37.12.35.25l-.63 4.54c-.02.13-.21.24-.42.23Z" fill="#263238"></path>
                <path d="m136.09 295.61-1.06-.03c-.21 0-.37-.12-.35-.25l.63-4.54c.02-.13.21-.24.42-.23l1.06.03c.21 0 .37.12.35.25l-.63 4.54c-.02.13-.21.24-.42.23Z" fill="#263238"></path>
                <path d="M184.33 251.61h25.3c.81 0 1.39.78 1.16 1.55l-9.45 32.45a1.2 1.2 0 0 1-1.16.87h-25.3c-.81 0-1.39-.78-1.16-1.55l9.45-32.45a1.2 1.2 0 0 1 1.16-.87Z" fill="#407bff"></path>
                <path fill="#e0e0e0" d="m184.79 252.8 24.59.58-9.71 30.61-24.59-.59 9.71-30.6z"></path>
                <path fill="#ffffff" d="m184.02 252.5 24.59.1-9.11 30.79-24.59-.1 9.11-30.79z"></path>
                <path d="M161.84 253.14c.05.98.14 2.19.23 3.3.1 1.13.22 2.27.37 3.4.28 2.26.66 4.49 1.12 6.68.48 2.18 1.05 4.31 1.79 6.31.37 1 .77 1.96 1.22 2.88.22.47.46.9.7 1.33l.37.61s-.07-.04-.04 0c.07.16.78.61 1.59.93.84.34 1.84.62 2.88.86 2.1.48 4.38.8 6.69 1.03 4.62.45 9.44.67 14.17.77l.48 4.79c-4.94.95-9.83 1.55-14.91 1.68-2.54.06-5.11.01-7.8-.32-1.35-.18-2.72-.42-4.19-.85-1.46-.46-3.04-.99-4.78-2.47-.43-.36-.86-.83-1.26-1.36l-.64-.9c-.4-.59-.8-1.19-1.15-1.8-.73-1.21-1.34-2.45-1.89-3.7-1.1-2.5-1.93-5.03-2.58-7.56a65.61 65.61 0 0 1-1.49-7.64c-.17-1.28-.3-2.56-.41-3.84a54.32 54.32 0 0 1-.2-3.97l9.72-.16Z" fill="#7f3e3b"></path>
                <path d="M158.55 238.39c6.3 5.93 4.78 21.38 4.78 21.38l-12.07 2.11s-7.45-11.08-4.83-15.72c2.73-4.84 8.71-10.97 12.12-7.77Z" fill="#ddbf82"></path>
                <path d="M163.33 261.13c-.35 0-.71-.15-.96-.4-.06-.06-.12-.13-.17-.21-.04-.07-.09-.15-.12-.23-.03-.08-.06-.17-.08-.26 0-.08-.02-.17-.02-.26 0-.36.14-.71.39-.96.07-.06.13-.12.21-.17.07-.05.15-.09.23-.12.09-.04.17-.06.26-.08.43-.09.9.06 1.22.37.25.25.4.6.4.96 0 .09 0 .18-.03.26-.02.09-.04.18-.08.26-.03.08-.07.16-.12.23a1.371 1.371 0 0 1-1.13.61Z" fill="#ffffff"></path>
                <path d="M152.37 261.85c-.06-.75.49-1.41 1.24-1.47.52-.05 1.01.21 1.27.64.16-.47.57-.84 1.09-.92.52-.07 1.02.16 1.31.57a1.354 1.354 0 0 1 2.37-.48c.1-.49.47-.9.98-1.04a1.36 1.36 0 0 1 .69 2.63c-.53.14-1.08-.06-1.41-.47-.11.51-.51.93-1.06 1.05-.54.1-1.08-.13-1.38-.56a1.353 1.353 0 0 1-2.46.36c-.17.49-.61.87-1.17.92h-.11c-.7 0-1.29-.53-1.36-1.23Z" fill="#ffffff"></path>
                <path d="M151.27 263.24c-.09 0-.18-.01-.27-.03-.09-.02-.17-.05-.25-.08-.09-.03-.16-.08-.24-.12-.07-.05-.14-.11-.2-.17a.87.87 0 0 1-.17-.21c-.05-.07-.09-.15-.13-.23-.03-.09-.06-.17-.07-.26-.02-.08-.03-.17-.03-.26s0-.18.03-.27c.01-.08.04-.17.07-.25.04-.08.08-.16.13-.24.05-.07.1-.14.17-.2a1.078 1.078 0 0 1 .44-.29c.08-.04.16-.06.25-.08.44-.09.91.05 1.22.37.07.06.12.13.17.2.05.08.09.16.13.24.03.08.06.17.08.25 0 .09.02.18.02.27s-.01.18-.02.26c-.02.09-.05.17-.08.26-.04.08-.08.16-.13.23s-.1.15-.17.21c-.25.25-.6.4-.95.4Z" fill="#ffffff"></path>
                <path d="m204.2 276.22-4.18-.28c-1.04-.07-2.08.21-2.94.79l-7.67 5.15-.06 3.25c2.46 2.86 7.9.3 7.9.3l5.05-.16a2.02 2.02 0 0 0 1.83-1.33l1.83-5.01c.46-1.26-.42-2.62-1.76-2.71Z" fill="#7f3e3b"></path>
                <path d="M117.59 418.41h1.13c.44 0 .82-.39.9-.92l6.96-48.44h-5.28l-4.61 48.12c-.06.66.36 1.24.9 1.24Z" fill="#407bff"></path>
                <path d="M117.59 418.41h1.13c.44 0 .82-.39.9-.92l6.96-48.44h-5.28l-4.61 48.12c-.06.66.36 1.24.9 1.24Z" fill="#3f3c36"></path>
                <path d="M103.09 418.41h1.13c.44 0 .82-.39.9-.92l6.96-48.44h-5.28l-4.61 48.12c-.06.66.36 1.24.9 1.24Z" fill="#407bff"></path>
                <path d="M103.09 418.41h1.13c.44 0 .82-.39.9-.92l6.96-48.44h-5.28l-4.61 48.12c-.06.66.36 1.24.9 1.24Z" fill="#3f3c36"></path>
                <path d="M183.89 418.41h-1.13c-.44 0-.82-.39-.9-.92l-6.96-48.44h5.28l4.61 48.12c.06.66-.36 1.24-.9 1.24Z" fill="#407bff"></path>
                <path d="M183.89 418.41h-1.13c-.44 0-.82-.39-.9-.92l-6.96-48.44h5.28l4.61 48.12c.06.66-.36 1.24-.9 1.24Z" fill="#3f3c36"></path>
                <path d="M198.39 418.41h-1.13c-.44 0-.82-.39-.9-.92l-6.96-48.44h5.28l4.61 48.12c.06.66-.36 1.24-.9 1.24Z" fill="#407bff"></path>
                <path d="M198.39 418.41h-1.13c-.44 0-.82-.39-.9-.92l-6.96-48.44h5.28l4.61 48.12c.06.66-.36 1.24-.9 1.24Z" fill="#3f3c36"></path>
                <path d="M217.18 311.63h-35.6c-6.32-21.93-29.04-39.24-52.32-39.24H117.7c-24.36 0-40.08 18.96-35.12 42.34.91 4.29 2.46 8.43 4.53 12.34l5.61 34.03c.72 4.39 4.23 7.95 7.83 7.95H207.7c3.6 0 7.1-3.56 7.83-7.95l6.85-41.52c.72-4.39-1.6-7.95-5.2-7.95Z" fill="#407bff"></path>
                <path d="M217.18 311.63h-35.6c-6.32-21.93-29.04-39.24-52.32-39.24H117.7c-24.36 0-40.08 18.96-35.12 42.34.91 4.29 2.46 8.43 4.53 12.34l5.61 34.03c.72 4.39 4.23 7.95 7.83 7.95H207.7c3.6 0 7.1-3.56 7.83-7.95l6.85-41.52c.72-4.39-1.6-7.95-5.2-7.95Z" fill="#46789e"></path>
            </g>
            <g>
                <path fill="#ddbf82" d="M212.54 152.15v1h-8.17v-1h8.17z"></path>
                <path d="M174.32 163.93h-1v-4.92c0-3.79 3.08-6.86 6.87-6.86h18.23v1h-18.23c-3.23 0-5.87 2.63-5.87 5.86v4.92Z" fill="#ddbf82"></path>
                <path fill="#213a4a" d="M274.72 159.01v35.76a3.36 3.36 0 0 1-3.36 3.36h-91.18a3.36 3.36 0 0 1-3.36-3.36v-35.76a3.36 3.36 0 0 1 3.36-3.36h91.18a3.36 3.36 0 0 1 3.36 3.36z"></path>
                <path d="M267.05 179.15H184.5c-1.25 0-2.26-1.01-2.26-2.26 0-1.25 1.01-2.26 2.26-2.26h82.55c1.25 0 2.26 1.01 2.26 2.26 0 1.25-1.01 2.26-2.26 2.26Z" fill="#ffffff"></path>
                <path d="M249.38 188.54H184.5c-1.25 0-2.26-1.01-2.26-2.26 0-1.25 1.01-2.26 2.26-2.26h64.88c1.25 0 2.26 1.01 2.26 2.26 0 1.25-1.01 2.26-2.26 2.26Z" fill="#ffffff"></path>
                <path d="M212.34 169.76H184.5c-1.25 0-2.26-1.01-2.26-2.26 0-1.25 1.01-2.26 2.26-2.26h27.84c1.25 0 2.26 1.01 2.26 2.26 0 1.25-1.01 2.26-2.26 2.26Z" fill="#ffffff"></path>
                <path d="M249.24 169.76H221.4c-1.25 0-2.26-1.01-2.26-2.26 0-1.25 1.01-2.26 2.26-2.26h27.84c1.25 0 2.26 1.01 2.26 2.26 0 1.25-1.01 2.26-2.26 2.26Z" fill="#ffffff"></path>
                <path d="M182.24 195.42v10.83c0 2.08 2.4 3.26 4.04 1.98l16.6-12.85-20.64.03Z" fill="#213a4a"></path>
                <path d="M322.81 102h-91.17c-1.86 0-3.37 1.51-3.37 3.37v35.75a3.36 3.36 0 0 0 3.36 3.36h72.02l13.05 10.1c1.65 1.28 4.04.1 4.04-1.98v-8.12h2.05c1.86 0 3.37-1.51 3.37-3.37v-35.75c0-1.86-1.51-3.37-3.37-3.37Z" fill="none" stroke="#ddbf82" stroke-miterlimit="10"></path>
                <path d="M318.25 155.62c-.65 0-1.3-.21-1.84-.63l-12.92-10h-71.85c-2.13 0-3.87-1.73-3.87-3.87v-35.75c0-2.13 1.73-3.87 3.87-3.87h91.17c2.13 0 3.87 1.73 3.87 3.87v35.75c0 2.13-1.73 3.87-3.87 3.87h-1.55v7.62c0 1.16-.65 2.19-1.68 2.7-.42.21-.88.31-1.33.31Zm-86.61-53.12c-1.58 0-2.87 1.29-2.87 2.87v35.75c0 1.58 1.29 2.87 2.87 2.87h72.2l13.19 10.21c.62.48 1.41.56 2.11.22.7-.35 1.12-1.02 1.12-1.8V144h2.55c1.58 0 2.87-1.29 2.87-2.87v-35.75c0-1.58-1.29-2.87-2.87-2.87h-91.17Z" fill="none" stroke="#ddbf82" stroke-miterlimit="10"></path>
                <path d="M275.28 125.51h43.22c1.25 0 2.26-1.01 2.26-2.26 0-1.25-1.01-2.26-2.26-2.26h-43.22c-1.25 0-2.26 1.01-2.26 2.26 0 1.25 1.01 2.26 2.26 2.26Z" fill="#ddbf82"></path>
                <path d="M245.1 125.51h21.4c1.25 0 2.26-1.01 2.26-2.26 0-1.25-1.01-2.26-2.26-2.26h-21.4c-1.25 0-2.26 1.01-2.26 2.26 0 1.25 1.01 2.26 2.26 2.26Z" fill="#ddbf82"></path>
                <path fill="#ddbf82" d="M251.35 132.64a2.26 2.26 0 0 1 2.26-2.26h64.89a2.26 2.26 0 1 1 0 4.52h-64.89a2.26 2.26 0 0 1-2.26-2.26z"></path>
                <path d="M235.95 116.12h82.55c1.25 0 2.26-1.01 2.26-2.26 0-1.25-1.01-2.26-2.26-2.26h-82.55c-1.25 0-2.26 1.01-2.26 2.26 0 1.25 1.01 2.26 2.26 2.26Z" fill="#ddbf82"></path>
            </g>
        </g>
    </g>
</svg>             
<h2 className='text-xl'> استشارة مخصصة</h2>
       </motion.div>
                </div>
            </div>






            <div 
  className={`relative w-full flex flex-col items-center justify-center bg-white ${sectionFonts.className}`}
>
  {/* العبارة */}
  <h3 className="text-2xl md:text-3xl font-bold text-[#003749] mb-4 text-center px-6">
    معتمدين من
  </h3>

  {/* شريط الشعارات */}
  <div style={{ height: '200px', position: 'relative', overflow: 'hidden', width: '100%' }}>
    <LogoLoop
      logos={techLogos}
      speed={150}
      direction="left"
      logoHeight={80}
      gap={30}
      pauseOnHover
      scaleOnHover
      fadeOut
      fadeOutColor="#ffffff"
      ariaLabel="شركاء النجاح"
    />
  </div>
</div>


      {isModalOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    dir="rtl"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
    >
      {/* رأس النموذج - بلون #003749 */}
      <div className="bg-[#003749] px-8 pt-8 pb-6 text-center text-white">
        <motion.div
          initial={{ y: -20, rotate: -180 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="inline-block mb-4"
        >
          <Mail className="h-12 w-12 text-[#ECC383]" />
        </motion.div>
        <h2 className="text-2xl font-bold">تواصل معنا</h2>
        <p className="text-[#ECC383] text-sm mt-1 opacity-90">نحن هنا لمساعدتك</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        {/* الحقول */}
        {[
          { id: 'name', label: 'الاسم', type: 'text', placeholder: 'أدخل اسمك الكامل' },
          { id: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'example@email.com' },
          { id: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '5XXXXXXXX' },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-semibold text-gray-800 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#ECC383] focus:ring-4 focus:ring-[#ECC383]/30 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              placeholder={field.placeholder}
              {...(field.id === 'phone' && {
                pattern: "[5-9][0-9]{8}",
                maxLength: 9,
                onChange: (e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input) && (input === '' || input[0] !== '0')) {
                    setFormData((prev) => ({ ...prev, phone: input }));
                  }
                },
              })}
            />
          </div>
        ))}

        {/* حقل الرسالة */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">
            الرسالة
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#ECC383] focus:ring-4 focus:ring-[#ECC383]/30 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
            placeholder="أخبرنا كيف يمكننا مساعدتك..."
          />
        </div>

        {/* الأزرار */}
        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={toggleModal}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            إلغاء
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 20px rgba(236, 195, 131, 0.5)" 
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2.5 bg-[#ECC383] hover:bg-[#d4b06b] text-[#003749] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ECC383]/50"
          >
            إرسال الرسالة
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
)}
        
        <motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="bg-[#FFFFFF] text-[rgb(2, 48, 63)] py-16"
>
  <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
    {/* الأيقونة */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex justify-center mb-6"
    >
      <HomeIcon className="h-12 w-12 text-[#ca8a04]" />
    </motion.div>

    {/* العنوان */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-3xl md:text-4xl font-bold mb-4"
    >
      هل لديك اي استفسارات؟
    </motion.h2>

    {/* النص */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="text-lg text-[#ca8a04] mb-8 max-w-xl mx-auto"
    >
      لا تتردد في التواصل معنا !!
    </motion.p>

    {/* الزر */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleModal}
      className="inline-block cursor-pointer bg-teal-800 text-[var(--cream)] px-8 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-lg"
      animate={{
        scale: [1, 1.03, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      تواصل معنا
    </motion.button>
    </div>
</motion.section>


</div>
        
    );
}