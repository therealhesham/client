//@ts-nocheck
//@ts-ignore
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import localFont from 'next/font/local';
import axios from 'axios';
import {
  PersonStanding,
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  Wallet,
  User,
  Briefcase,
  Languages,
  Shirt,
  Utensils,
  Baby,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  Copy,
  Check,
  X,
  Link2,
  ExternalLink
} from 'lucide-react';
import CitySelect from 'app/components/CitySelect';
import NavigationBar from 'app/components/navigation';

// --- Helper Functions ---
function getDate(date: string) {
  if (!date) return null;
  const currentDate = new Date(date);
  return currentDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
}

function calculateAge(dateofbirth: string | null): number | null {
  if (!dateofbirth) return null;
  const birthDate = new Date(dateofbirth);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// --- Fonts ---
const myFont = localFont({
  src: '../../fonts/ReadexPro-Bold.ttf',
  weight: '700',
  variable: '--font-readex',
});

// --- Interfaces ---
interface Homemaid {
  id: number;
  Name: string | null;
  Nationalitycopy: string | null;
  age: number | null;
  Passportnumber: string | null;
  Religion: string | null;
  maritalstatus: string | null;
  dateofbirth: string | null;
  ExperienceYears: string | null;
  Experience: string | null;
  experienceType: string | null;
  ArabicLanguageLevel?: string | null;
  ArabicLanguageLeveL?: string | null;
  EnglishLanguageLevel?: string | null;
  Salary: string | null;
  LaundryLevel?: string | null;
  laundryLevel?: string | null;
  washingLevel?: string | null;
  IroningLevel?: string | null;
  ironingLevel?: string | null;
  CleaningLevel?: string | null;
  cleaningLevel?: string | null;
  CookingLevel?: string | null;
  cookingLevel?: string | null;
  SewingLevel?: string | null;
  sewingLevel?: string | null;
  BabySitterLevel?: string | null;
  childcareLevel?: string | null;
  Education: string | null;
  OldPeopleCare?: boolean | number | null;
  elderlycareLevel?: string | null;
  PassportStart: string | null;
  PassportEnd: string | null;
  phone: string | null;
  clientphonenumber: string | null;
  bookingstatus: string | null;
  officeName: string | null;
  Picture?: { url: string } | null;
  FullPicture?: { url: string } | null;
  weeklyStatusId: any[];
  NewOrder: any[];
  ages?: string | number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// --- Sub-Components ---

// بطاقة المعلومات الرئيسية
// ملاحظة: بوجود dir="rtl" في الصفحة، الـ Flex سيضع الأيقونة يمين والنص يسار تلقائياً
const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number | null }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#C49E6A]/30 transition-all duration-300">
    <div className="p-2 bg-white rounded-lg shadow-sm text-[#003749]">
      <Icon size={18} strokeWidth={2} />
    </div>
    <div className="flex flex-col text-right"> {/* تأكيد المحاذاة لليمين */}
      <span className="text-xs text-gray-400 font-medium mb-0.5">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value ?? '-'}</span>
    </div>
  </div>
);

// بطاقة المهارات
const SkillBadge = ({ icon: Icon, label, level }: { icon: any, label: string, level: string | null }) => {
  const isHigh = Boolean(
    level && (
      level.includes('ممتاز') ||
      level.includes('جيد') ||
      level === 'نعم' ||
      /expert|advanced|intermediate|good/i.test(level)
    )
  );

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isHigh ? 'bg-[#003749]/5 border border-[#003749]/10' : 'bg-gray-50 border border-gray-100'}`}>
      <Icon className={`mb-2 ${isHigh ? 'text-[#C49E6A]' : 'text-gray-400'}`} size={24} />
      <span className="text-xs font-bold text-gray-700 mb-1">{label}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isHigh ? 'bg-[#003749] text-white' : 'bg-gray-200 text-gray-500'}`}>
        {level ?? 'غير محدد'}
      </span>
    </div>
  );
};

// تنظيف رقم الجوال من أحرف Unicode المخفية (مثل النسخ من واتساب) والمسافات
const sanitizePhone = (value: string) =>
  value
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\s\-()]/g, '')
    .replace(/[^\d]/g, '');

const isValidSaudiPhone = (phone: string) => {
  const cleaned = sanitizePhone(phone);
  return /^(05\d{8}|5\d{8})$/.test(cleaned);
};

const normalizePhoneForSubmit = (phone: string) => {
  const cleaned = sanitizePhone(phone);
  if (/^5\d{8}$/.test(cleaned)) return `0${cleaned}`;
  return cleaned;
};

export default function Profile() {
  const params = useParams();
  const router = useRouter();
  const [homemaid, setHomemaid] = useState<Homemaid | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'portrait' | 'full'>('portrait');
  // Images are now only from Digital Ocean - using homemaid.Picture and homemaid.FullPicture directly

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareSource, setShareSource] = useState<'image_button' | 'desktop_box' | 'mobile_bar'>('image_button');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // Share Handlers
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/cv/${homemaid?.id || params.id}`;
    }
    return '';
  };

  const getShareText = () => {
    const url = getShareUrl();
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const name = homemaid?.Name ? `السيرة الذاتية للعاملة: ${homemaid.Name}` : 'السيرة الذاتية للعاملة';
    const nationality = homemaid?.Nationalitycopy ? `الجنسية: ${homemaid.Nationalitycopy}` : '';
    const age = homemaid?.dateofbirth && calculateAge(homemaid.dateofbirth) ? `العمر: ${calculateAge(homemaid.dateofbirth)} سنة` : '';
    const salary = homemaid?.Salary ? `الراتب: ${homemaid.Salary.toString().replace(/[^0-9]/g, '')} ريال` : '';
    const ref = homemaid?.id ? `الرقم المرجعي: CV-${homemaid.id}` : (params?.id ? `الرقم المرجعي: CV-${params.id}` : '');

    const lines = [
      name,
      nationality,
      age,
      salary,
      ref,
      `رابط السيرة الذاتية:`,
      `\u200E${cleanUrl}`
    ].filter(Boolean);
    return lines.join('\n');
  };

  const sourceLabels: Record<string, string> = {
    image_button: 'زر الصورة السريع',
    desktop_box: 'صندوق الحجز الثابت (كمبيوتر)',
    mobile_bar: 'الشريط السفلي (جوال)',
  };

  const methodLabels: Record<string, string> = {
    whatsapp: 'واتساب',
    telegram: 'تيليجرام',
    native_share: 'قائمة مشاركة الهاتف',
    copy_link: 'نسخ الرابط',
  };

  // Google Analytics Share Tracking Helper
  const trackShareEvent = (method: 'whatsapp' | 'telegram' | 'native_share' | 'copy_link') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // 1. Standard GA4 'share' event
      (window as any).gtag('event', 'share', {
        method: method,
        content_type: 'cv',
        item_id: homemaid?.id ? String(homemaid.id) : String(params?.id),
        maid_id: homemaid?.id,
        maid_name: homemaid?.Name,
        maid_nationality: homemaid?.Nationalitycopy,
        share_source: shareSource,
        share_source_label: sourceLabels[shareSource] || shareSource,
      });

      // 2. Custom event for dedicated report views
      (window as any).gtag('event', 'share_cv_click', {
        share_method: method,
        share_method_label: methodLabels[method] || method,
        share_source: shareSource,
        share_source_label: sourceLabels[shareSource] || shareSource,
        maid_id: homemaid?.id,
        maid_name: homemaid?.Name,
        maid_nationality: homemaid?.Nationalitycopy,
        url: getShareUrl(),
      });
    }
  };

  const handleOpenShareModal = (source: 'image_button' | 'desktop_box' | 'mobile_bar') => {
    setShareSource(source);
    setIsShareModalOpen(true);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'open_share_modal', {
        share_source: source,
        share_source_label: sourceLabels[source] || source,
        maid_id: homemaid?.id,
        maid_name: homemaid?.Name,
      });
    }
  };

  const handleCopyLink = async () => {
    trackShareEvent('copy_link');
    const url = getShareUrl();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleNativeShare = async () => {
    trackShareEvent('native_share');
    const text = getShareText();
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: homemaid?.Name ? `السيرة الذاتية - ${homemaid.Name}` : 'السيرة الذاتية للعاملة',
          text: text,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(getShareText());
    if (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      return `whatsapp://send?text=${text}`;
    }
    return `https://web.whatsapp.com/send?text=${text}`;
  };

  const getTelegramUrl = () => {
    const text = encodeURIComponent(getShareText());
    return `https://t.me/share/url?text=${text}`;
  };

  // Form States
  const [formData, setFormData] = useState({ clientName: '', phoneNumber: '', residence: '' });
  const [fieldErrors, setFieldErrors] = useState({ clientName: '', phoneNumber: '', residence: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [position, setPosition] = useState("")
  // Navigation Handlers
  const [id, setid] = useState("");
  const handlePreviousHomemaid = async (id) => {
    setid(id);
    console.log(id)
    // params.id = id;
    // alert(position)g
    setPosition("previous");
    setActiveImageTab('portrait');
    const fetchhomemaid = await fetch("/api/mappingapproved?id=" + id + "&position=previous");

    const data = await fetchhomemaid.json();
    // console.log(data)
    setHomemaid(data);
    window.history.pushState({}, '', '/cv/' + data.id);
    // id = data.id;
    // console.log(data)
    setIsButtonDisabled(data.NewOrder && data.NewOrder.length > 0);


  };
  const handleNextHomemaid = async (id) => {
    setid(id);
    console.log(id)
    // params.id = id;
    // alert(position)g
    setPosition("next");
    setActiveImageTab('portrait');
    const fetchhomemaid = await fetch("/api/mappingapproved?id=" + id + "&position=next");

    const data = await fetchhomemaid.json();
    // console.log(data)
    setHomemaid(data);
    window.history.pushState({}, '', '/cv/' + data.id);
    // id = data.id;
    // console.log(data)
    setIsButtonDisabled(data.NewOrder && data.NewOrder.length > 0);


  };



  useEffect(() => {
    const fetchHomemaid = async () => {
      try {
        setLoading(true);
        // Images are now only from Digital Ocean
        const response = await fetch(`/api/homemaid/${params.id}`);
        // if (response.redirected) {
        //   router.push(response.url);
        //   return;
        // }
        if (!response.ok) throw new Error('فشل في تحميل البيانات');
        const data: Homemaid = await response.json();
        setHomemaid(data);
        setIsButtonDisabled(data.NewOrder && data.NewOrder.length > 0);
      } catch (err) {
        setError('فشل في تحميل تفاصيل السيرة الذاتية');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchHomemaid();
  }, [params.id, router]);

  // Images are now only from Digital Ocean - no need for Airtable fetch
  // useEffect(() => {

  //   console.log(params.id)
  //   (async function Fetcher() {

  //   })();

  // }, [position, id])
  const handleBookClick = () => {
    if (isButtonDisabled) return;
    setIsModalOpen(true);
    setFormError(null);
    setIsSuccessModalOpen(false);

    // تتبع حدث الضغط على زر الحجز
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_book_maid', {
        maid_id: homemaid?.id,
        maid_name: homemaid?.Name,
        maid_nationality: homemaid?.Nationalitycopy,
        maid_price: homemaid?.Salary,
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ clientName: '', phoneNumber: '', residence: '' });
    setFieldErrors({ clientName: '', phoneNumber: '', residence: '' });
    setFormError(null);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setIsButtonDisabled(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === 'phoneNumber' ? sanitizePhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({ clientName: '', phoneNumber: '', residence: '' });
    setFormError(null);

    let hasError = false;
    const newErrors = { clientName: '', phoneNumber: '', residence: '' };

    if (formData.clientName.trim().length < 3) {
      newErrors.clientName = 'الاسم يجب أن يكون ثلاثي الحروف على الأقل';
      hasError = true;
    }
    if (!isValidSaudiPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'يرجى إدخال رقم جوال صحيح (مثال: 05xxxxxxxx)';
      hasError = true;
    }
    if (!formData.residence) {
      newErrors.residence = 'يرجى اختيار المدينة';
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/bookhomemaid', {
        homemaidId: homemaid?.id,
        fullName: formData.clientName,
        phone_number: normalizePhoneForSubmit(formData.phoneNumber),
        residence: formData.residence,
      });

      if (response.status === 201) {
        handleModalClose();
        setIsSuccessModalOpen(true);

        // تتبع حدث إرسال الطلب بنجاح
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'submit_booking_request', {
            maid_id: homemaid?.id,
            maid_name: homemaid?.Name,
            maid_nationality: homemaid?.Nationalitycopy,
            client_residence: formData.residence,
          });
        }
      }
    } catch (err) {
      setFormError('فشل في إرسال طلب الحجز. حاول مرة أخرى.');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#C49E6A] border-opacity-75"></div>
      <p className="mt-4 text-[#003749] font-medium animate-pulse">جاري تحميل السيرة الذاتية...</p>
    </div>
  );

  if (error || !homemaid) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] gap-4">
      <div className="p-6 bg-red-50 rounded-full"><Briefcase className="text-red-400 h-12 w-12" /></div>
      <p className="text-gray-600 font-bold text-lg">{error || 'لم يتم العثور على البيانات'}</p>
      <button onClick={() => router.back()} className="text-[#C49E6A] underline">العودة للصفحة السابقة</button>
    </div>
  );

  return (
    // تم إضافة dir="rtl" هنا ليطبق على الصفحة كاملة
    <div className={`min-h-screen bg-[#F5F7F9] pb-24 md:pb-10 ${myFont.className}`} dir="rtl">
      <NavigationBar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 pt-24 md:pt-32 max-w-6xl"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

          {/* العنوان والنص التعريفي (الآن يظهر على اليمين بسبب RTL) */}
          <div className="text-center md:text-right order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#003749] mb-1">السيرة الذاتية</h1>
            <p className="text-[#C49E6A] text-sm font-medium opacity-80">استعرض تفاصيل العاملة والمهارات</p>
          </div>

          {/* أزرار التنقل في الشاشات الكبيرة */}
          <div className="hidden md:flex gap-3 order-1 md:order-2">
            <button
              onClick={() => handlePreviousHomemaid(homemaid?.id)}
              disabled={!homemaid?.hasPrev}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-bold transition-all duration-300
                ${!homemaid?.hasPrev
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#003749] cursor-pointer hover:bg-[#C49E6A] hover:text-white'}`}
            >
              <ChevronRight size={16} /> السابق
            </button>
            <button
              onClick={() => handleNextHomemaid(homemaid?.id)}
              disabled={!homemaid?.hasNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-bold transition-all duration-300
                ${!homemaid?.hasNext
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-[#003749] cursor-pointer hover:bg-[#C49E6A] hover:text-white'}`}
            >
              التالي <ChevronLeft size={16} />
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* العمود الأيسر (المحتوى النصي) */}
          <div className="lg:col-span-8 flex flex-col gap-6 order-2">

            {/* Card 1: Basic Info */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-[#003749]/5 rounded-xl text-[#003749]">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#003749]">البيانات الأساسية</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem icon={User} label="الاسم" value={homemaid.Name} />
                <InfoItem icon={MapPin} label="الجنسية" value={homemaid.Nationalitycopy} />
                <InfoItem icon={Star} label="العمر" value={calculateAge(homemaid.dateofbirth)} />
                <InfoItem icon={Star} label="الديانة" value={homemaid.Religion} />
                <InfoItem icon={User} label="الحالة الاجتماعية" value={homemaid.maritalstatus} />
                <InfoItem icon={Calendar} label="تاريخ الميلاد" value={getDate(homemaid.dateofbirth || '')} />
                <InfoItem
                  icon={Wallet}
                  label="الراتب"
                  // هذا الكود يحذف أي نص قديم ويبقي الأرقام فقط ثم يضيف كلمة ريال
                  value={homemaid.Salary ? `${homemaid.Salary.toString().replace(/[^0-9]/g, '')} ريال` : 'غير محدد'}
                />
                <InfoItem icon={Briefcase} label="الرقم المرجعي" value={`CV-${homemaid.id}`} />
              </div>
            </div>

            {/* Card 2: Skills & Experience */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-[#C49E6A]/10 rounded-xl text-[#C49E6A]">
                  <Star size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#003749]">المهارات والخبرات</h2>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-400 mb-3 text-right">الخبرة واللغة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <SkillBadge icon={Briefcase} label="سنوات الخبرة" level={homemaid.ExperienceYears} />
                  <SkillBadge icon={MapPin} label="أماكن الخبرة" level={homemaid.Experience} />
                  <SkillBadge icon={Languages} label="العربية" level={homemaid.ArabicLanguageLevel || homemaid.ArabicLanguageLeveL} />
                  <SkillBadge icon={Languages} label="الإنجليزية" level={homemaid.EnglishLanguageLevel} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 text-right">المهارات العملية</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <SkillBadge icon={Utensils} label="الطبخ" level={homemaid.CookingLevel || homemaid.cookingLevel} />
                  <SkillBadge icon={Sparkles} label="التنظيف" level={homemaid.CleaningLevel || homemaid.cleaningLevel} />
                  <SkillBadge icon={Shirt} label="الغسيل" level={homemaid.LaundryLevel || homemaid.washingLevel || homemaid.laundryLevel} />
                  <SkillBadge icon={Shirt} label="الكوي" level={homemaid.IroningLevel || homemaid.ironingLevel} />
                  <SkillBadge icon={Baby} label="الأطفال" level={homemaid.BabySitterLevel || homemaid.childcareLevel} />
                  <SkillBadge icon={User} label="كبار السن" level={homemaid.elderlycareLevel || (homemaid.OldPeopleCare === 1 || homemaid.OldPeopleCare === true ? 'نعم' : null)} />
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن (الصور والأكشن) */}
          <div className="lg:col-span-4 flex flex-col gap-6 order-1">

            {/* Image Gallery */}
            <div className="bg-white p-3 rounded-[2rem] shadow-lg shadow-gray-100/50 overflow-hidden relative group">
              {/* Image Toggle Tabs (الصورة الشخصية / الزي الكامل) */}
              {homemaid.FullPicture && (
                <div className="flex bg-gray-100/90 p-1 rounded-2xl mb-3 gap-1 border border-gray-200/60">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('portrait')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeImageTab === 'portrait'
                        ? 'bg-[#003749] text-[#ECC383] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    <User size={15} />
                    <span>الصورة الشخصية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('full')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeImageTab === 'full'
                        ? 'bg-[#003749] text-[#ECC383] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    <Sparkles size={15} />
                    <span>الزي الكامل</span>
                  </button>
                </div>
              )}

              <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-gray-100">
                {/* Quick Share Button on Image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenShareModal('image_button');
                  }}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#003749] shadow-md hover:bg-[#003749] hover:text-white transition-all duration-300 z-10 cursor-pointer"
                  title="مشاركة الملف الشخصي"
                >
                  <Share2 size={18} />
                </button>

                {activeImageTab === 'full' && homemaid.FullPicture ? (
                  <img
                    key="full-pic"
                    src={homemaid?.FullPicture?.url ? homemaid?.FullPicture?.url : homemaid?.FullPicture}
                    alt={`${homemaid.Name || 'Worker'} - الزي الكامل`}
                    className="w-full h-full object-contain p-2 transition-all duration-500"
                  />
                ) : homemaid.Picture ? (
                  <img
                    key="portrait-pic"
                    src={homemaid?.Picture?.url ? homemaid?.Picture?.url : homemaid?.Picture}
                    alt={homemaid.Name || 'Worker'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex flex-col items-center justify-center gap-2">
                    <User size={40} className="text-gray-300" />
                    <span className="text-gray-400 text-xs font-medium">جاري تحميل الصورة...</span>
                  </div>
                )}

                {!loading && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm
                      ${isButtonDisabled ? 'bg-gray-900/60 text-white' : 'bg-green-500/80 text-white'}`}>
                    {isButtonDisabled ? 'محجوزة' : 'متاحة للتعاقد'}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sticky Action Box */}
            <div className="hidden lg:block sticky top-28 bg-[#003749] rounded-3xl p-6 text-white shadow-xl shadow-[#003749]/20 overflow-hidden relative text-right">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#C49E6A]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>

              <h3 className="text-xl font-bold mb-2 relative z-10">هل تناسبك هذه العاملة؟</h3>
              <p className="text-[#C49E6A] text-sm mb-6 relative z-10 opacity-90">قم بحجزها الآن قبل فوات الأوان، الإجراءات سهلة وسريعة.</p>

              <button
                onClick={handleBookClick}
                disabled={isButtonDisabled}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
                   ${isButtonDisabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C49E6A] text-[#003749] hover:shadow-[#C49E6A]/40'}`}
              >
                {isButtonDisabled ? 'غير متاحة حالياً' : (
                  <>
                    <Sparkles size={20} />
                    حجز العاملة
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenShareModal('desktop_box')}
                className="w-full mt-3 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-all duration-300 cursor-pointer"
              >
                <Share2 size={16} className="text-[#ECC383]" />
                مشاركة السيرة الذاتية
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Buttons (السابق / التالي أسفل السيفي) */}
        <div className="flex md:hidden items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100 pb-20">
          <button
            onClick={() => handlePreviousHomemaid(homemaid?.id)}
            disabled={!homemaid?.hasPrev}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-sm text-sm font-bold transition-all duration-300 active:scale-95 cursor-pointer
              ${!homemaid?.hasPrev
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white text-[#003749] border border-gray-200 hover:bg-[#C49E6A] hover:text-white hover:border-[#C49E6A]'}`}
          >
            <ChevronRight size={18} />
            <span>السابق</span>
          </button>

          <button
            onClick={() => handleNextHomemaid(homemaid?.id)}
            disabled={!homemaid?.hasNext}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-sm text-sm font-bold transition-all duration-300 active:scale-95 cursor-pointer
              ${!homemaid?.hasNext
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white text-[#003749] border border-gray-200 hover:bg-[#C49E6A] hover:text-white hover:border-[#C49E6A]'}`}
          >
            <span>التالي</span>
            <ChevronLeft size={18} />
          </button>
        </div>
      </motion.div>
      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-40 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)] backdrop-blur-lg bg-white/90">
        <div className="container mx-auto flex items-center justify-between gap-3">

          <div className="flex flex-col text-right">
            <span className="text-xs text-gray-400">الراتب الشهري</span>

            <div className="flex items-center justify-start gap-1">
              {/* نستخرج الرقم فقط لضمان عدم تكرار كلمة ريال */}
              <span className="text-lg font-bold text-[#003749]">
                {homemaid.Salary ? homemaid.Salary.toString().replace(/[^0-9]/g, '') : 'غير محدد'}
              </span>

              {/* نضيف كلمة ريال مرة واحدة فقط هنا */}
              {homemaid.Salary && <span className="text-sm font-bold text-[#003749]">ريال</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => handleOpenShareModal('mobile_bar')}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-[#003749] rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
              title="مشاركة"
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={handleBookClick}
              disabled={isButtonDisabled}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-md shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer
                 ${isButtonDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#003749] text-[#ECC383]'}`}
            >
              {isButtonDisabled ? 'محجوزة' : 'حجز العاملة الآن'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#003749]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            // dir="rtl" هو أصلاً موروث من الحاوية الرئيسية، لكن للتأكيد
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              // التعديل 1: أزلنا overflow-hidden وجعلناها relative
              className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full relative"
            >
              {/* Modal Header */}
              {/* التعديل 2: أضفنا rounded-t-[2rem] يدوياً للرأس لأننا أزلنا القص من الأب */}
              <div className="bg-[#003749] p-8 text-center relative overflow-hidden rounded-t-[2rem]">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ECC383]/20 mb-4 backdrop-blur-sm border border-[#ECC383]/30">
                  <PersonStanding className="text-[#ECC383] w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">تأكيد الحجز</h2>
                <p className="text-[#ECC383]/80 text-sm">أكمل بياناتك وسيتم التواصل معك فوراً</p>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="الاسم الثلاثي"
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition-colors
                       ${fieldErrors.clientName ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#ECC383] focus:bg-white'}`}
                  />
                  {fieldErrors.clientName && <p className="text-red-500 text-xs mt-1">{fieldErrors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className={`w-full pl-14 pr-4 py-3 rounded-xl bg-gray-50 border outline-none transition-colors text-left placeholder:text-right
                         ${fieldErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#ECC383] focus:bg-white'}`}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm border-r border-gray-300 pr-3 h-5 flex items-center">SA</span>
                  </div>
                  {fieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>}
                </div>

                <div>
                  <CitySelect
                    label="محل الإقامة"
                    value={formData.residence}
                    onChange={(val) => {
                      setFormData(prev => ({ ...prev, residence: val }));
                      setFieldErrors(prev => ({ ...prev, residence: '' }));
                    }}
                  />
                  {fieldErrors.residence && <p className="text-red-500 text-xs mt-1">{fieldErrors.residence}</p>}
                </div>

                {formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium">{formError}</div>}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-[#ECC383] text-[#003749] py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#dcb374] transition-all active:scale-[0.98]">
                    إرسال الطلب
                  </button>
                  <button type="button" onClick={handleModalClose} className="px-6 py-3.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#003749]/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-5 border border-green-100">
                <CheckCircle2 className="text-green-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-[#003749] mb-2">تم استلام طلبك بنجاح</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                شكراً لك، تم تسجيل طلب الحجز وسيتواصل معك فريقنا في أقرب وقت.
              </p>
              <button
                type="button"
                onClick={handleSuccessModalClose}
                className="w-full bg-[#ECC383] text-[#003749] py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#dcb374] transition-all active:scale-[0.98] cursor-pointer"
              >
                حسناً
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-[#003749]/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full relative z-10 overflow-hidden text-right"
            >
              {/* Header */}
              <div className="bg-[#003749] p-6 text-white relative">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="absolute top-5 left-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="إغلاق"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#C49E6A]/20 border border-[#C49E6A]/30 text-[#ECC383]">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">مشاركة الملف الشخصي</h2>
                    <p className="text-[#ECC383]/80 text-xs mt-0.5">شارك السيرة الذاتية للعاملة بكل سهولة</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Candidate Summary Mini-Card */}
                <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {homemaid?.Picture ? (
                      <img
                        src={homemaid?.Picture?.url ? homemaid?.Picture?.url : homemaid?.Picture}
                        alt={homemaid.Name || 'Worker'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#003749]/10 text-[#003749]">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{homemaid?.Name || 'العاملة'}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {homemaid?.Nationalitycopy ? `${homemaid.Nationalitycopy} • ` : ''}
                      CV-{homemaid?.id}
                    </p>
                    {homemaid?.Salary && (
                      <span className="inline-block mt-1 text-[11px] font-bold text-[#003749] bg-[#ECC383]/30 px-2 py-0.5 rounded-full">
                        الراتب: {homemaid.Salary.toString().replace(/[^0-9]/g, '')} ريال
                      </span>
                    )}
                  </div>
                </div>

                {/* Social & Sharing Options */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-gray-400 block text-right">خيارات المشاركة المباشرة</span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppUrl()}
                      onClick={() => trackShareEvent('whatsapp')}
                      target={isMobile ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-sm hover:bg-[#20ba5a] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>تطبيق واتساب</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={getTelegramUrl()}
                      onClick={() => trackShareEvent('telegram')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#229ED9] text-white font-bold text-sm shadow-sm hover:bg-[#1e8cc0] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
                      </svg>
                      <span>تيليجرام</span>
                    </a>
                  </div>

                  {/* زر قائمة المشاركة المحلية (تطبيقات الهاتف) */}
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#003749] text-white hover:bg-[#002b3a] font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <Share2 size={18} className="text-[#ECC383]" />
                    <span>قائمة المشاركة المحلية </span>
                  </button>
                </div>

                {/* Copy Link Section */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 block text-right">أو نسخ رابط السيرة الذاتية فقط</span>
                  <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl()}
                      dir="ltr"
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-600 outline-none select-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer
                        ${copied
                          ? 'bg-green-600 text-white'
                          : 'bg-[#003749] text-[#ECC383] hover:bg-[#002b3a]'}`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-xs text-center font-medium animate-fade-in">
                      تم نسخ الرابط إلى الحافظة بنجاح
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}