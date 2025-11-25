"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // تأكد أن لديك هذه الأيقونة أو استخدم حرف 'v'

// قائمة المدن (نفس البيانات السابقة)
const saudiCitiesMap: { [key: string]: string } = {
  'Riyadh': 'الرياض',
  'Al-Kharj': 'الخرج',
  'Ad Diriyah': 'الدرعية',
  'Al Majma\'ah': 'المجمعة',
  'Al Zulfi': 'الزلفي',
  'Ad Dawadimi': 'الدوادمي',
  'Wadi Ad Dawasir': 'وادي الدواسر',
  'Afif': 'عفيف',
  'Al Quway\'iyah': 'القويعية',
  'Shaqra': 'شقراء',
  'Hotat Bani Tamim': 'حوطة بني تميم',
  'Makkah': 'مكة المكرمة',
  'Jeddah': 'جدة',
  'Taif': 'الطائف',
  'Rabigh': 'رابغ',
  'Al Qunfudhah': 'القنفذة',
  'Al Lith': 'الليث',
  'Khulais': 'خليص',
  'Ranyah': 'رنية',
  'Turabah': 'تربة',
  'Madinah': 'المدينة المنورة',
  'Yanbu': 'ينبع',
  'Al Ula': 'العلا',
  'Badr': 'بدر',
  'Al Hinakiyah': 'الحناكية',
  'Mahd Al Dhahab': 'مهد الذهب',
  'Dammam': 'الدمام',
  'Al Khobar': 'الخبر',
  'Dhahran': 'الظهران',
  'Al Ahsa': 'الأحساء',
  'Al Hufuf': 'الهفوف',
  'Al Mubarraz': 'المبرز',
  'Jubail': 'الجبيل',
  'Hafr Al Batin': 'حفر الباطن',
  'Al Khafji': 'الخفجي',
  'Ras Tanura': 'رأس تنورة',
  'Qatif': 'القطيف',
  'Abqaiq': 'بقيق',
  'Nairiyah': 'النعيرية',
  'Qaryat Al Ulya': 'قرية العليا',
  'Al Qassim': 'القصيم',
  'Buraydah': 'بريدة',
  'Unaizah': 'عنيزة',
  'Ar Rass': 'الرس',
  'Al Bukayriyah': 'البكيرية',
  'Al Badaye': 'البدائع',
  'Al Mithnab': 'المذنب',
  'Riyad Al Khabra': 'رياض الخبراء',
  'Abha': 'أبها',
  'Khamis Mushait': 'خميس مشيط',
  'Bisha': 'بيشة',
  'Mahayil': 'محايل عسير',
  'Al Namas': 'النماص',
  'Tanomah': 'تنومة',
  'Ahad Rafidah': 'أحد رفيدة',
  'Sarat Abidah': 'سراة عبيدة',
  'Balqarn': 'بلقرن',
  'Tabuk': 'تبوك',
  'Duba': 'ضباء',
  'Al Wajh': 'الوجه',
  'Umluj': 'أملج',
  'Tayma': 'تيماء',
  'Haqi': 'حقل',
  'Hail': 'حائل',
  'Baqa': 'بقعاء',
  'Al Ghazalah': 'الغزالة',
  'Arar': 'عرعر',
  'Rafha': 'رفحاء',
  'Turaif': 'طريف',
  'Jazan': 'جازان',
  'Sabya': 'صبيا',
  'Abu Arish': 'أبو عريش',
  'Samtah': 'صامطة',
  'Baish': 'بيش',
  'Ad Darb': 'الدرب',
  'Al Aridah': 'العارضة',
  'Fifa': 'فيفاء',
  'Najran': 'نجران',
  'Sharurah': 'شرورة',
  'Hubuna': 'حبونا',
  'Al Baha': 'الباحة',
  'Baljurashi': 'بلجرشي',
  'Al Mandq': 'المندق',
  'Al Makhwah': 'المخواة',
  'Qilwah': 'قلوة',
  'Sakaka': 'سكاكا',
  'Dumat Al Jandal': 'دومة الجندل',
  'Al Qurayyat': 'القريات',
  'Tabarjal': 'طبرجل'
};

const citiesArray = Object.entries(saudiCitiesMap).map(([key, value]) => ({
  id: key,
  name: value,
}));

interface CitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function CitySelect({ value, onChange, label = "اختر المدينة" }: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && saudiCitiesMap[value]) {
      setSearchTerm(saudiCitiesMap[value]);
    } else {
        setSearchTerm("");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (value && saudiCitiesMap[value]) {
            setSearchTerm(saudiCitiesMap[value]);
        } else if (!value) {
            setSearchTerm("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value]);

  const filteredCities = citiesArray.filter((city) =>
    city.name.includes(searchTerm)
  );

  const handleSelect = (cityId: string, cityName: string) => {
    onChange(cityId);
    setSearchTerm(cityName);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          // هنا تم تطبيق نفس كلاسات الحقول الأخرى
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-200 outline-none placeholder-gray-400 text-right focus:bg-white focus:border-[#ECC383] focus:ring-4 focus:ring-[#ECC383]/20"
          placeholder="ابحث عن المدينة..."
          value={searchTerm}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
        />
        {/* أيقونة السهم */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
           <ChevronDown size={20} />
        </div>
      </div>

      {isOpen && (
        <ul className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-80 overflow-auto text-right">
          {/* التعديلات التي تمت هنا:
             1. z-[100]: لضمان ظهور القائمة فوق المودال وأي عنصر آخر.
             2. max-h-80: زدنا الارتفاع ليظهر عدد أكبر من المدن (كان 60 سابقاً).
             3. shadow-2xl: ظل أقوى لتمييز القائمة عن الخلفية.
          */}
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <li
                key={city.id}
                className={`p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-none ${
                  value === city.id 
                    ? "bg-[#ECC383]/10 text-[#003749] font-bold" 
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleSelect(city.id, city.name)}
              >
                {city.name}
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-400 text-center text-sm">لا توجد نتائج</li>
          )}
        </ul>
      )}
    </div>
  );
}