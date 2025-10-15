"use client";

import { useEffect, useState } from "react";

export default function WhatsAppFloatingButton() {
  const [currentPeriod, setCurrentPeriod] = useState<"morning" | "evening">("morning");
  
  // تحديد الفترة الحالية
  const determineCurrentPeriod = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // الفترة الصباحية: 9 صباحاً - 2 ظهراً
    if (hour >= 9 && hour < 14) {
      return "morning";
    } 
    // الفترة المسائية: 2 ظهراً - 10 مساءً
    else {
      return "evening";
    }
  };

  // دالة لحساب الرابط بناءً على الفترة الحالية
  const getWhatsAppLink = (period: "morning" | "evening") => {
    const baseMessage = period === "morning" 
    ? "مرحباً، احتاج للمساعدة" 
    : "مساء الخير، احتاج للمساعدة";
      
    const phoneNumber = period === "morning" 
      ? "966500000000" 
      : "966555555555";
      
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
  };

  // تحديث الفترة الحالية
  const updatePeriod = () => {
    const newPeriod = determineCurrentPeriod();
    setCurrentPeriod(newPeriod);
  };

  useEffect(() => {
    // تحديث فوري
    updatePeriod();
    
    // تحديث كل دقيقة
    const interval = setInterval(updatePeriod, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // توليد الرابط الحالي
  const currentLink = getWhatsAppLink(currentPeriod);
  const isMorning = currentPeriod === "morning";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a 
        href={currentLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        {/* الأيقونة الأساسية */}
        <div className={`bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${isMorning ? 'animate-pulse' : ''}`}>
          <img 
            src="/whatsapp-svgrepo-com.svg" 
            alt="واتساب" 
            className="w-8 h-8 object-contain"
          />
        </div>
        
        {/* مؤشر الفترة */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white">
          <div className={`w-full h-full rounded-full ${isMorning ? 'bg-yellow-400' : 'bg-purple-500'}`} />
        </div>
        
      {/* النص عند المرور */}
<div className="absolute bottom-full mb-2 right-0 transform translate-x-[-10%] bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
  لديك استفسار ؟ نسعد بخدمتك
</div>
      </a>
    </div>
  );
}