import React from 'react';
import localFont from "next/font/local";

const sectionFonts = localFont({
  src: "../fonts/MarkaziText-VariableFont_wght.ttf",
  weight: "700",
});

interface TimelineSectionProps {
  onButtonClick?: () => void;     // للخطوة 1
  onTrackClick?: () => void;      // للخطوة 5
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ onButtonClick, onTrackClick }) => {
  const steps = [
    {
      title: "تصفح السير الذاتية لعاملاتنا ",
      description: "اختار الي تناسبك , ولو ما لقيت طلبك تواصل معنا و ابشر",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "احجز العاملة الي اخترتها",
      description: "احجز العاملة الي اخترتها , الحق حالك قبل لا تروح عليك ",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "رح نتواصل معاك",
      description: "بنتواصل معاك ونأكد طلبك",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-2 2H9a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "رح ننشئ لك العقد",
      description: "ونرسل لك رابط السداد عن طريق مساند",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "تستريح وتتبع عاملتك  ",
      description: "ترتاح وتتبع طلبك وعاملتك خطوة بخطوة عن طريق التتبع ",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "توصل العاملة وتستلمها ",
      description: " ونبقى معاك ان احتجتنا طول السنتين مو بس ثلاث شهور",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#013749]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-white w-full" dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className={`${sectionFonts.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#013749] mb-3`}>
          خطوات بسيطة لتجربة استقدام مميزة
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-4">
          اتبع هذه الخطوات البسيطة للحصول على أفضل تجربة استقدام عبر منصة مساند
        </p>
      </div>

      {/* الشبكة للشاشات الكبيرة */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#ECC383] text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="text-[#013749] flex-shrink-0">
              {step.icon}
            </div>
            <div className="flex-1">
              <h3 className={`${sectionFonts.className} text-lg font-bold text-[#013749] mb-2`}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
              {/* الزر في الخطوة 1 */}
              {index === 0 && onButtonClick && (
                <button
                  className="bg-[#ECC383] text-white cursor-pointer text-lg p-2 mt-4 rounded-lg font-bold w-full"
                  onClick={onButtonClick}
                >
                  تصفح السير الذاتية
                </button>
              )}
              {/* الزر في خطوة التتبع (الخطوة 5) */}
              {index === 4 && onTrackClick && (
                <button
                  className="bg-[#ECC383] text-white cursor-pointer text-lg p-2 mt-4 rounded-lg font-bold w-full"
                  onClick={onTrackClick}
                >
                  تتبع طلبك الآن
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* الجوال */}
      <div className="md:hidden mt-12 space-y-6 px-4">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 relative">
              <div className="absolute top-6 right-5 w-10 h-10 bg-[#ECC383] text-white rounded-full flex items-center justify-center text-lg font-bold">
                {index + 1}
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-8 bg-[#ECC383]"></div>
              )}

              <div className="flex items-center mb-3 pt-2 pr-16">
                <div className="text-[#013749] ml-3">
                  {step.icon}
                </div>
                <h3 className={`${sectionFonts.className} text-lg font-bold text-[#013749]`}>
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pr-16">
                {step.description}
              </p>
              {index === 0 && onButtonClick && (
                <button
                  className="bg-[#ECC383] text-white cursor-pointer text-lg p-2 mt-4 rounded-lg font-bold w-full"
                  onClick={onButtonClick}
                >
                  تصفح السير الذاتية
                </button>
              )}
              {index === 4 && onTrackClick && (
                <button
                  className="bg-[#ECC383] text-white cursor-pointer text-lg p-2 mt-4 rounded-lg font-bold w-full"
                  onClick={onTrackClick}
                >
                  تتبع طلبك الآن
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;