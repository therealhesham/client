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
  ChevronLeft
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
  ArabicLanguageLeveL: string | null;
  EnglishLanguageLevel: string | null;
  Salary: string | null;
  laundryLevel: string | null;
  ironingLevel: string | null;
  cleaningLevel: string | null;
  cookingLevel: string | null;
  sewingLevel: string | null;
  childcareLevel: string | null;
  Education: string | null;
  OldPeopleCare: boolean | null;
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
  const isHigh = level?.includes('ممتاز') || level?.includes('جيد') || level === 'نعم';
  
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

export default function Profile() {
  const params = useParams();
  const router = useRouter();
  const [homemaid, setHomemaid] = useState<Homemaid | null>(null);
  // Images are now only from Digital Ocean - using homemaid.Picture and homemaid.FullPicture directly
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  
  // Form States
  const [formData, setFormData] = useState({ clientName: '', phoneNumber: '', residence: '' });
  const [fieldErrors, setFieldErrors] = useState({ clientName: '', phoneNumber: '', residence: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Navigation Handlers
  const handlePreviousHomemaid = () => router.push("/cv/" + (parseInt(params.id as string, 10) - 1).toString());
  const handleNextHomemaid = () => router.push("/cv/" + (parseInt(params.id as string, 10) + 1).toString());

  useEffect(() => {
    const fetchHomemaid = async () => {
      try {
        setLoading(true);
        // Images are now only from Digital Ocean
        const response = await fetch(`/api/homemaid/${params.id}`);
        if (response.redirected) {
          router.push(response.url);
          return;
        }
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

  const handleBookClick = () => {
    if (isButtonDisabled) return;
    setIsModalOpen(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ clientName: '', phoneNumber: '', residence: '' });
    setFieldErrors({ clientName: '', phoneNumber: '', residence: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const saudiPhoneRegex = /^05[0-9]{7,8}$/;
    if (!saudiPhoneRegex.test(formData.phoneNumber)) {
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
        phone_number: formData.phoneNumber,
        residence: formData.residence,
      });

      if (response.status === 201) {
        setFormSuccess('تم ارسال طلب الحجز بنجاح وسيتم التواصل معك قريبا');
        setTimeout(() => handleModalClose(), 2000);
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

          {/* أزرار التنقل (الآن تظهر على اليسار) */}
          <div className="flex gap-3 order-1 md:order-2">
             <button onClick={handlePreviousHomemaid} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-[#003749] hover:bg-[#C49E6A] hover:text-white transition-all duration-300 text-sm font-bold">
                <ChevronRight size={16} /> السابق
             </button>
             <button onClick={handleNextHomemaid} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-[#003749] hover:bg-[#C49E6A] hover:text-white transition-all duration-300 text-sm font-bold">
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
                   <SkillBadge icon={Languages} label="العربية" level={homemaid.ArabicLanguageLeveL} />
                   <SkillBadge icon={Languages} label="الإنجليزية" level={homemaid.EnglishLanguageLevel} />
                 </div>
               </div>

               <div>
                 <h3 className="text-sm font-bold text-gray-400 mb-3 text-right">المهارات العملية</h3>
                 <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                   <SkillBadge icon={Utensils} label="الطبخ" level={homemaid.cookingLevel} />
                   <SkillBadge icon={Sparkles} label="التنظيف" level={homemaid.cleaningLevel} />
                   <SkillBadge icon={Shirt} label="الغسيل" level={homemaid.washingLevel} />
                   <SkillBadge icon={Shirt} label="الكوي" level={homemaid.ironingLevel} />
                   <SkillBadge icon={Baby} label="الأطفال" level={homemaid.childcareLevel} />
                   <SkillBadge icon={User} label="كبار السن" level={homemaid.elderlycareLevel} />
                 </div>
               </div>
            </div>
          </div>

          {/* العمود الأيمن (الصور والأكشن) */}
          <div className="lg:col-span-4 flex flex-col gap-6 order-1">
            
            {/* Image Gallery */}
            <div className="bg-white p-2 rounded-[2rem] shadow-lg shadow-gray-100/50 overflow-hidden relative group">
               <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-gray-100">
                 
                 {homemaid.Picture ? (
                   <img 
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
               
               {homemaid.FullPicture && (
                 <div className="mt-2 relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                    <img 
                        src={homemaid?.FullPicture?.url ? homemaid?.FullPicture?.url : homemaid?.FullPicture} 
                        alt="Full Body" 
                        className="w-full h-full object-contain p-2"
                    />
                 </div>
               )}
            </div>

            {/* Desktop Sticky Action Box */}
            <div className="hidden lg:block sticky top-28 bg-[#003749] rounded-3xl p-6 text-white shadow-xl shadow-[#003749]/20 overflow-hidden relative text-right">
               <div className="absolute top-0 left-0 w-32 h-32 bg-[#C49E6A]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
               
               <h3 className="text-xl font-bold mb-2 relative z-10">هل تناسبك هذه العاملة؟</h3>
               <p className="text-[#C49E6A] text-sm mb-6 relative z-10 opacity-90">قم بحجزها الآن قبل فوات الأوان، الإجراءات سهلة وسريعة.</p>
               
               <button
                 onClick={handleBookClick}
                 disabled={isButtonDisabled}
                 className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-1
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
            </div>
          </div>

        </div>
      </motion.div>
{/* Mobile Sticky Bottom Bar */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-40 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)] backdrop-blur-lg bg-white/90">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          <div className="flex flex-col text-right pr-18">
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

          <button
             onClick={handleBookClick}
             disabled={isButtonDisabled}
             className={`flex-1 py-3 px-6 rounded-xl font-bold text-md shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95
               ${isButtonDisabled 
                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                 : 'bg-[#003749] text-[#ECC383]'}`}
          >
            {isButtonDisabled ? 'محجوزة' : 'حجز العاملة الآن'}
          </button>
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
                 {formSuccess && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2"><CheckCircle2 size={16} /> {formSuccess}</div>}

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
    </div>
  );
}