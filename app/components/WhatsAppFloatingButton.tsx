"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const isCvPage = pathname?.startsWith('/cv/');
  const [currentPeriod, setCurrentPeriod] = useState<"morning" | "evening">("morning");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    const determineCurrentPeriod = () => {
      const hour = new Date().getHours();
      return (hour >= 9 && hour < 14) ? "morning" : "evening";
    };

    setCurrentPeriod(determineCurrentPeriod());
    const interval = setInterval(() => {
      setCurrentPeriod(determineCurrentPeriod());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const phoneNumber = currentPeriod === "morning" ? "966555230531" : "966555770723";
  const baseMessage = currentPeriod === "morning" ? "مرحباً، احتاج للمساعدة" : "مساء الخير، احتاج للمساعدة";
  const isMorning = currentPeriod === "morning";

  // الرابط القياسي للواتساب
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(baseMessage)}`;

  return (
    <div className={`fixed ${isCvPage ? 'bottom-24 lg:bottom-6' : 'bottom-6'} right-6 z-50`}>
      <a 
        href={whatsappUrl}
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'click_floating_whatsapp', {
              period: currentPeriod,
              phone_number: phoneNumber,
              page_path: pathname,
            });
          }
        }}
        target={isMobile ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="relative block outline-none border-none cursor-pointer"
        aria-label="تواصل عبر واتساب"
      >
        {/* الأيقونة الأساسية */}
        <div className={`bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 ${isMorning ? 'animate-pulse' : ''}`}>
          <img 
            src="/whatsapp-svgrepo-com.svg" 
            alt="واتساب" 
            className="w-8 h-8 object-contain pointer-events-none"
          />
        </div>
        
        {/* مؤشر الفترة */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white pointer-events-none">
          <div className={`w-full h-full rounded-full ${isMorning ? 'bg-yellow-400' : 'bg-purple-500'}`} />
        </div>
        
        {/* النص يظهر فقط في أجهزة الكمبيوتر التي تدعم الماوس hover لمنع حظر اللمس في الجوال */}
        <div className="hidden md:block absolute bottom-full mb-2 right-0 transform translate-x-[-10%] bg-black text-white text-xs rounded py-1 px-2 opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none select-none">
          لديك استفسار ؟ نسعد بخدمتك
        </div>
      </a>
    </div>
  );
}