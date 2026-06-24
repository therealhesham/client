//@ts-ignore
//@ts-nocheck

'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Search, 
  FileCheck, 
  Globe, 
  Stethoscope, 
  Plane, 
  PlaneLanding,
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  Stamp, 
  Wallet, 
  FileText, 
  XCircle,
  Download, // أيقونة التحميل الجديدة
  FileCode,
  Eye,
  Ticket,
  Phone,
  Mail,
  LogOut,
  ExternalLink, // أيقونة عامة للملفات
  ChevronLeft,
  Star, // أيقونة التقييم
  X // أيقونة الإغلاق
} from 'lucide-react';

import localFont from "next/font/local";
import { useParams, useRouter } from 'next/navigation';
// استيراد الناف بار من مساره الصحيح كما في كودك الأصلي
import NavigationBar from "../../../app/components/navigation";

// --- الخطوط ---
const myFontTajawal = localFont({
  src: '../../fonts/Tajawal-Medium.ttf',
  weight: '700',
});

const myFont = localFont({
  src: '../../fonts/ReadexPro-Bold.ttf',
  weight: '700',
});

// --- الثوابت والألوان ---
const COLORS = {
  primary: '#003749',   // كحلي غامق
  secondary: '#E5BC7E', // ذهبي
  bg: '#f8fafc',
  white: '#ffffff',
  text: '#003749',
  gray: '#94a3b8'
};

// --- تعريف المراحل (8 مراحل) - الافتراضي ---
const DEFAULT_STEPS = [
  { id: 1, label: 'الطلب', icon: FileCheck, statuses: ['new_order', 'new_orders', 'pending'] },
  { id: 2, label: 'المكتب الخارجي', icon: Globe, statuses: ['pending_external_office'] },
  { id: 3, label: 'الفحص الطبي', icon: Stethoscope, statuses: ['external_office_approved', 'pending_medical_check', 'medical_check_passed'] },
  { id: 4, label: 'وزارة العمل', icon: Building2, statuses: ['pending_foreign_labor', 'foreign_labor_approved'] },
  { id: 5, label: 'السفارة', icon: Stamp, statuses: ['pending_embassy', 'embassy_approved'] },
  { id: 6, label: 'التأشيرة', icon: FileText, statuses: ['pending_visa'] },
  { id: 7, label: 'تصريح السفر', icon: Plane, statuses: ['visa_issued', 'pending_travel_permit'] },
  { id: 8, label: 'حجز التذاكر', icon: Ticket, statuses: ['travel_permit_issued', 'pending_tickets'] },
  { id: 9, label: 'الوصول', icon: PlaneLanding, statuses: ['ticket_booked', 'pending_arrival', 'destinations_set'] },
  { id: 10, label: 'الاستلام', icon: CheckCircle2, statuses: ['pending_receipt', 'received', 'delivered'] }
];

// Mapping بين field names والأيقونات
const FIELD_ICON_MAP = {
  'DateOfApplication': FileCheck,
  'InternalmusanedContract': Globe,
  'externalmusanedContract': Globe,
  'foreignLaborApproval': Building2,
  'foreignLaborApprovalDate': Building2,
  'medicalCheckFile': Stethoscope,
  'medicalCheckDate': Stethoscope,
  'approvalPayment': Wallet,
  'AgencyDate': Wallet,
  'EmbassySealing': Stamp,
  'visaNumber': FileText,
  'visaIssuanceDate': FileText,
  'travelPermit': Plane,
  'travelPermitDate': Plane,
  'DeliveryDate': PackageCheck,
  'ticketFile': Plane,
  'KingdomentryDate': Plane,
};

// دالة لتحويل CustomTimeline.stages إلى STEPS format
const convertCustomTimelineToSteps = (customTimeline, arrivals) => {
  if (!customTimeline || !customTimeline.stages) {
    return DEFAULT_STEPS;
  }

  try {
    let stages;
    if (Array.isArray(customTimeline.stages)) {
      stages = customTimeline.stages;
    } else if (typeof customTimeline.stages === 'string') {
      stages = JSON.parse(customTimeline.stages);
    } else {
      stages = customTimeline.stages;
    }
    
    if (!Array.isArray(stages) || stages.length === 0) {
      return DEFAULT_STEPS;
    }
    
    return stages
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((stage, index) => {
        const fieldValue = arrivals?.[0]?.[stage.field];
        const isCompleted = !!fieldValue;
        
        return {
          id: index + 1,
          label: stage.label || `مرحلة ${index + 1}`,
          icon: FIELD_ICON_MAP[stage.field] || FileCheck,
          field: stage.field,
          order: stage.order || index + 1,
          isCompleted: isCompleted
        };
      });
  } catch (error) {
    console.error('Error parsing custom timeline:', error);
    return DEFAULT_STEPS;
  }
};

// --- دوال المساعدة ---

// 1. ترجمة الحالة
const translateBookingStatusToArabic = (status) => {
  const translations = {
    'pending': 'قيد الانتظار',
    'external_office_approved': 'موافقة المكتب الخارجي',
    'pending_external_office': 'في انتظار المكتب الخارجي',
    'medical_check_passed': 'تم اجتياز الفحص الطبي',
    'pending_medical_check': 'في انتظار الفحص الطبي',
    'foreign_labor_approved': 'موافقة وزارة العمل الأجنبية',
    'pending_foreign_labor': 'في انتظار وزارة العمل الأجنبية',
    'agency_paid': 'تم دفع الوكالة',
    'pending_agency_payment': 'في انتظار دفع الوكالة',
    'embassy_approved': 'موافقة السفارة السعودية',
    'pending_embassy': 'في انتظار السفارة السعودية',
    'visa_issued': 'تم إصدار التأشيرة',
    'pending_visa': 'في انتظار إصدار التأشيرة',
    'travel_permit_issued': 'تم إصدار تصريح السفر',
    'pending_travel_permit': 'في انتظار تصريح السفر',
    'received': 'تم الاستلام',
    'pending_receipt': 'في انتظار الاستلام',
    'cancelled': 'ملغي',
    'rejected': 'مرفوض',
    'delivered': 'تم التسليم',
    'new_order': 'طلب جديد',
    'new_orders': 'طلبات جديدة'
  };
  return translations[status] || status;
};

const getStageInfo = (status, order = null) => {
  const info = {
    'new_order': { days: 1, message: 'مازلنا نعمل على معالجة طلبك' },
    'new_orders': { days: 1, message: 'مازلنا نعمل على معالجة طلبك' },
    'pending': { days: 1, message: 'مازلنا نعمل على معالجة طلبك' },
    'pending_external_office': { days: 1, message: 'يتم الربط مع المكتب الخارجي' },
    'external_office_approved': { days: 21, message: 'العاملة حالياً تخضع للفحص الطبي' },
    'pending_medical_check': { days: 21, message: 'العاملة حالياً تخضع للفحص الطبي' },
    'pending_foreign_labor': { days: 7, message: 'جاري الربط مع وزارة العمل الأجنبية' },
    'foreign_labor_approved': { days: 21, message: 'جاري الربط مع السفارة' },
    'pending_embassy': { days: 21, message: 'جاري الربط مع السفارة' },
    'embassy_approved': { days: 1, message: 'جاري العمل على إصدار التأشيرة' },
    'pending_visa': { days: 1, message: 'جاري العمل على إصدار التأشيرة' },
    'visa_issued': { days: 36, message: 'جاري العمل على إصدار تصريح السفر' },
    'pending_travel_permit': { days: 36, message: 'جاري العمل على إصدار تصريح السفر' },
    'travel_permit_issued': { days: 7, message: 'جاري العمل على حجز التذاكر' },
    'pending_tickets': { days: 7, message: 'جاري العمل على حجز التذاكر' },
    'ticket_booked': { days: null, message: 'في انتظار وصول العاملة' },
    'pending_arrival': { days: null, message: 'في انتظار وصول العاملة' },
    'destinations_set': { days: null, message: 'في انتظار وصول العاملة' }
  };
  
  let stageInfo = info[status] || { days: 'X', message: '' };

  if (['pending_arrival', 'ticket_booked', 'destinations_set'].includes(status) && order) {
    const dateString = order.arrivals?.[0]?.KingdomentryDate;
    if (dateString) {
      const arrivalDate = new Date(dateString);
      const today = new Date();
      today.setHours(0,0,0,0);
      const arrivalDateZero = new Date(arrivalDate);
      arrivalDateZero.setHours(0,0,0,0);
      if ((arrivalDateZero - today) < 0) {
        stageInfo = { ...stageInfo, message: 'وصلت' };
      }
    }
  }

  return stageInfo;
};

const getArrivalText = (dateString, timeString) => {
  if (!dateString) return 'سوف تصل العاملة قريباً';
  const arrivalDate = new Date(dateString);
  const today = new Date();
  today.setHours(0,0,0,0);
  const arrivalDateZero = new Date(arrivalDate);
  arrivalDateZero.setHours(0,0,0,0);
  const diffTime = arrivalDateZero - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const formattedDate = arrivalDate.toISOString().split('T')[0];
  const timeDisplay = timeString ? ` الساعة ${timeString}` : '';
  
  if (diffDays === 0) return `سوف تصل العاملة اليوم${timeDisplay} (${formattedDate})`;
  if (diffDays === 1) return `سوف تصل العاملة غداً${timeDisplay} (${formattedDate})`;
  if (diffDays < 0) return `وصلت العاملة بتاريخ ${formattedDate}${timeDisplay}`;
  
  return `سوف تصل العاملة بتاريخ ${formattedDate}${timeDisplay} (بعد ${diffDays} أيام)`;
};

// 2. تحديد المرحلة الحالية
const getCurrentStepIndex = (status, steps, arrivals) => {
  if (['cancelled', 'rejected'].includes(status)) return -1;

  // إذا كان هناك CustomTimeline، نستخدم field values من arrivals
  if (steps && steps.length > 0 && steps[0]?.field) {
    // البحث عن آخر مرحلة مكتملة
    let lastCompletedIndex = -1;
    for (let i = steps.length - 1; i >= 0; i--) {
      const fieldValue = arrivals?.[0]?.[steps[i].field];
      if (fieldValue) {
        lastCompletedIndex = i;
        break;
      }
    }
    
    // إذا كانت هناك مرحلة مكتملة، المرحلة التالية هي الحالية
    if (lastCompletedIndex >= 0) {
      // إذا كانت آخر مرحلة مكتملة هي الأخيرة، نبقى عليها
      if (lastCompletedIndex === steps.length - 1) {
        return steps[lastCompletedIndex].id;
      }
      // وإلا، المرحلة التالية هي الحالية
      return steps[lastCompletedIndex + 1].id;
    }
    // إذا لم تكن هناك مرحلة مكتملة، نبدأ من الأولى
    return 1;
  }

  // استخدام الطريقة الافتراضية مع statuses
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].statuses && steps[i].statuses.includes(status)) return steps[i].id;
  }
  return 1; // الافتراضي
};

// 3. ألوان البادج (Pill) للحالة
const getStatusBadgeStyle = (status) => {
  // أخضر للإنجاز النهائي
  if (['delivered', 'received'].includes(status)) 
    return 'bg-green-100 text-green-800 border-green-200';
  
  // أحمر للرفض
  if (['cancelled', 'rejected'].includes(status)) 
    return 'bg-red-100 text-red-800 border-red-200';
  
  // أزرق للجديد
  if (['new_order', 'new_orders', 'pending'].includes(status)) 
    return 'bg-blue-100 text-blue-800 border-blue-200';
  
  // ذهبي/برتقالي لباقي المراحل الجارية
  return `bg-[#E5BC7E]/20 text-[#8d6c49] border-[#E5BC7E]/30`; 
};

// --- المكونات الفرعية ---

// مكون شريط التقدم (Stepper)
const OrderStepper = ({ status, order, customTimeline }) => {
  // تحويل CustomTimeline إلى STEPS
  const steps = convertCustomTimelineToSteps(customTimeline, order?.arrivals);
  const currentStep = getCurrentStepIndex(status, steps, order?.arrivals);
  const isCancelled = currentStep === -1;

  if (isCancelled) {
    const isRejected = status === 'rejected';
    const reason = isRejected ? order?.ReasonOfRejection : order?.ReasonOfCancellation;
    return (
      <div className="w-full py-6 px-4 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center justify-center gap-2 text-red-600 text-center">
        <XCircle size={32} />
        <span className="font-bold">{isRejected ? 'تم رفض هذا الطلب' : 'تم إلغاء هذا الطلب'}</span>
        {reason && (
          <span className="text-sm text-red-500 font-medium">
            السبب: {reason}
          </span>
        )}
      </div>
    );
  }

  // حساب نسبة التقدم للشريط الملون
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full mt-4">
      <div className="py-4 px-2" dir="rtl">
        <div className="flex flex-wrap items-center justify-center gap-y-8">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative group w-[70px] md:w-20">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCompleted || isCurrent ? COLORS.primary : '#f8fafc', 
                      borderColor: isCurrent ? COLORS.secondary : (isCompleted ? COLORS.primary : '#cbd5e1'),
                    }}
                    className={`w-11 h-11 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300 shadow-sm relative
                      ${isCurrent ? 'ring-4 ring-[#E5BC7E]/20' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon 
                        className={`w-5 h-5 ${isCurrent ? 'text-[#E5BC7E]' : 'text-gray-400'}`} 
                      />
                    )}
                    
                    {/* تأثير نبض للمرحلة الحالية */}
                    {isCurrent && (
                       <span className="absolute w-full h-full rounded-full bg-[#E5BC7E] opacity-20 animate-ping"></span>
                    )}
                  </motion.div>
                  
                  <div className="mt-3 text-center">
                    <p className={`text-[10px] md:text-[11px] font-bold transition-colors duration-300 whitespace-nowrap ${
                      isCurrent ? 'text-[#003749] text-sm' : isCompleted ? 'text-[#003749]/80' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <motion.div 
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 bg-[#E5BC7E] rounded-full mx-auto mt-1"
                      />
                    )}
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center px-1 mb-8">
                    <ChevronLeft className={`w-4 h-4 md:w-5 md:h-5 ${isCompleted ? 'text-[#E5BC7E]' : 'text-gray-300'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OrderDocuments = ({ order }) => {
  // 1. استخراج ملف التذكرة
  const arrival = order.arrivals?.[0] || {};
  const ticketUrl = arrival.ticketFile;

  // 2. استخراج ملف الفيزا
  const clientVisas = order.client?.visa || [];
  const visaUrl = arrival.VisaFile || (clientVisas.length > 0 ? clientVisas[0].visaFile : null);

  // قائمة الملفات
  const documents = [
    { 
      label: 'صورة التأشيرة', 
      url: visaUrl, 
      type: 'visa',
      fileName: 'visa-document'
    },
    { 
      label: 'تذكرة السفر', 
      url: ticketUrl, 
      type: 'ticket',
      fileName: 'ticket-document'
    }
  ].filter(doc => doc.url && doc.url.trim() !== '');

  if (documents.length === 0) return null;

  // دالة مساعدة للتعامل مع التحميل
  const handleDownload = async (e, url, fileName) => {
    e.preventDefault();
    try {
      // محاولة تحميل الملف كـ Blob لتجاوز فتح المتصفح له
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName; // اسم الملف عند التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // في حال فشل الـ Fetch (بسبب CORS مثلاً)، نلجأ للطريقة التقليدية
      console.error("Download failed, opening in new tab", error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
         <h4 className="text-sm font-bold" style={{ color: '#003749' }}>وثائق السفر والتأشيرة</h4>
         <span className="text-xs text-gray-400">يمكنك المعاينة أو التحميل</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* الجزء الأيمن: الأيقونة والاسم */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                {doc.type === 'ticket' ? (
                  <Plane className="w-5 h-5 text-blue-600" />
                ) : (
                  <FileText className="w-5 h-5" style={{ color: '#E5BC7E' }} />
                )}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold truncate" style={{ color: '#003749' }}>
                  {doc.label}
                </p>
              </div>
            </div>
            
            {/* الجزء الأيسر: أزرار التحكم */}
            <div className="flex items-center gap-2 shrink-0 mr-2">
              {/* زر المعاينة */}
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
                title="معاينة الملف"
              >
                <Eye size={16} />
              </a>

              {/* زر التحميل */}
              <button 
                onClick={(e) => handleDownload(e, doc.url, doc.fileName)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-[#E5BC7E] hover:text-white transition-colors border border-gray-100"
                title="تحميل الملف"
              >
                <Download size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- نافذة التقييم (Popup) ---
const RatingModal = ({ order, isOpen, onClose, onRatingSubmitted }) => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleMapPrompt, setShowGoogleMapPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStars(0);
      setHover(0);
      setReason("");
      setError("");
      setShowGoogleMapPrompt(false);
    }
  }, [order, isOpen]);

  const handleSubmit = async () => {
    if (stars === 0) {
      setError("الرجاء اختيار عدد النجوم");
      return;
    }
    setError("");
    setIsSubmitting(true);

    // فتح نافذة بشكل متزامن مع نقرة الزر لتجاوز مانع النوافذ المنبثقة (Popup Blocker)
    let newWindow = null;
    if (stars >= 4) {
      newWindow = window.open('about:blank', '_blank');
    }

    try {
      const payload = {
        idOrder: order.id,
        stars,
        reason,
        isRated: true
      };
      
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        onRatingSubmitted(order.id, { stars, reason, isRated: true });
        
        if (stars >= 4) {
          setShowGoogleMapPrompt(true);
          // توجيه النافذة المفتوحة مسبقاً إلى رابط جوجل ماب
          if (newWindow) {
            newWindow.location.href = 'https://g.page/r/CZhaUwKTL2mUEAE/review';
          } else {
            window.open('https://g.page/r/CZhaUwKTL2mUEAE/review', '_blank');
          }
        } else {
          onClose();
        }
      } else {
        if (newWindow) newWindow.close();
        setError("حدث خطأ أثناء إرسال التقييم");
      }
    } catch (err) {
      if (newWindow) newWindow.close();
      setError("حدث خطأ في الاتصال");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative border border-gray-100 flex flex-col items-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="إغلاق"
            >
              <X size={20} />
            </button>

            {showGoogleMapPrompt ? (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center text-center py-4"
               >
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4" style={{ color: '#003749' }}>شكراً على تقييمك الرائع!</h3>
                 <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                   نرجو مشاركة تجربتك وتقييمك على صفحتنا في جوجل ماب لدعمنا. 
                   <br/>سيتم فتح صفحة التقييم تلقائياً...
                 </p>
                 <a 
                   href="https://g.page/r/CZhaUwKTL2mUEAE/review" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full max-w-xs px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-3"
                   onClick={onClose}
                 >
                   <Globe size={20} />
                   انتقال إلى جوجل ماب
                 </a>
                 <button 
                   onClick={onClose}
                   className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium"
                 >
                   إغلاق
                 </button>
               </motion.div>
            ) : (
              <>
                <div className="w-16 h-16 bg-[#E5BC7E]/20 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-[#E5BC7E] fill-[#E5BC7E]" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#003749' }}>كيف كانت تجربتك؟</h3>
                <p className="text-gray-500 text-sm mb-6">نود أن نسمع رأيك حول طلبك رقم #{order.id}</p>

                <div className="flex flex-col items-center w-full mb-5">
                  <div className="flex gap-2 mb-2" dir="rtl">
                    {[...Array(5)].map((_, index) => {
                      const currentStar = index + 1;
                      return (
                        <button
                          key={index}
                          type="button"
                          className="transition-transform hover:scale-110 focus:outline-none"
                          onClick={() => setStars(currentStar)}
                          onMouseEnter={() => setHover(currentStar)}
                          onMouseLeave={() => setHover(stars)}
                        >
                          <Star 
                            className={`w-10 h-10 transition-colors duration-200 ${
                              currentStar <= (hover || stars) 
                                ? "text-[#E5BC7E] fill-[#E5BC7E]" 
                                : "text-gray-200 fill-transparent"
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between w-full max-w-[260px] text-xs font-bold text-gray-400 px-1" dir="rtl">
                    <span>سيء جداً</span>
                    <span>ممتاز</span>
                  </div>
                </div>

                <textarea
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E5BC7E]/50 focus:border-[#E5BC7E] mb-4 text-sm resize-none bg-gray-50 hover:bg-white transition-all"
                  rows="3"
                  placeholder="أخبرنا عن تفاصيل تجربتك (اختياري)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                
                {error && <p className="text-red-500 text-xs mb-4 font-medium">{error}</p>}
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || stars === 0}
                  className={`w-full px-6 py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                    isSubmitting || stars === 0 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-[#003749] text-white hover:bg-[#002a38] shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال التقييم"
                  )}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- مكون التقييم (المضمن في البطاقة) ---
const OrderRating = ({ order, onOpenRating }) => {
  const ratingData = order.Rating;
  const isRated = order.isRated === true || !!ratingData;

  if (isRated) {
    const displayStars = ratingData?.stars || order.stars || 5;
    return (
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
        <h4 className="text-sm font-bold mb-3" style={{ color: '#003749' }}>تقييمك للطلب</h4>
        <div className="flex justify-center gap-1 mb-3" dir="rtl">
          {[...Array(5)].map((_, index) => {
            const currentStar = index + 1;
            return (
              <Star 
                key={index} 
                className={`w-6 h-6 ${currentStar <= displayStars ? "text-[#E5BC7E] fill-[#E5BC7E]" : "text-gray-200 fill-gray-200"}`} 
              />
            );
          })}
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>شكراً لتقييمك!</span>
        </div>
        {(ratingData?.reason || order.reason) && (
          <p className="text-gray-500 text-sm mt-3 bg-gray-50 p-3 rounded-lg w-full max-w-md text-center break-words">
            "{ratingData?.reason || order.reason}"
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
      <button 
        onClick={() => onOpenRating(order)}
        className="px-6 py-2.5 rounded-xl border-2 border-[#003749] text-[#003749] font-bold hover:bg-[#003749] hover:text-white transition-all flex items-center gap-2"
      >
        <Star size={18} />
        تقييم الطلب
      </button>
    </div>
  );
};

// --- الصفحة الرئيسية ---
export default function MyOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingPopupOrder, setRatingPopupOrder] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('phone_number');
    localStorage.removeItem('email');
    localStorage.removeItem('item');
    // Call the logout API to clear the cookie as well
    fetch('/api/logout', { method: 'POST' }).finally(() => {
        router.replace('/login');
    });
  };

  const handleRatingSubmitted = (orderId, ratingData) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            isRated: ratingData.isRated,
            Rating: ratingData
          };
        }
        return order;
      })
    );
  };

  // جلب البيانات الفعلي من الـ API
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const myOrders = await fetch(`/api/myorders/${params.id}`);
      
      // التوجيه لصفحة الدخول إذا لم تكن الجلسة صالحة (الرد 401 Unauthorized)
      if (myOrders.status === 401) {
          window.location.href = '/login';
          return;
      }
      
      const data = await myOrders.json();
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);
      setClientInfo(data.clientinfo);

      // البحث عن أول طلب غير مقيم لإظهار نافذة التقييم
      const unratedOrder = fetchedOrders.find(o => !(o.isRated === true || !!o.Rating));
      if (unratedOrder) {
        // نستخدم sessionStorage حتى لا تظهر النافذة كلما قام العميل بتحديث الصفحة في نفس الجلسة
        const hasSeenPopup = sessionStorage.getItem(`has_seen_rating_${unratedOrder.id}`);
        if (!hasSeenPopup) {
          setTimeout(() => {
            setRatingPopupOrder(unratedOrder);
            sessionStorage.setItem(`has_seen_rating_${unratedOrder.id}`, 'true');
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // الاحتفال عند وصول العاملة (الاستلام)
  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        const status = order.clientBookingStatus || order.bookingstatus;
        if (status === 'received' || status === 'delivered') {
          const key = `confetti_shown_order_${order.id}`;
          if (!localStorage.getItem(key)) {
            // تشغيل الأنيميشن
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#003749', '#E5BC7E', '#ffffff'],
              zIndex: 9999
            });
            localStorage.setItem(key, 'true');
          }
        }
      });
    }
  }, [orders]);

  return (
    <div className={`min-h-screen bg-gray-50 ${myFontTajawal.className}`} dir="rtl">
      <NavigationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 lg:pt-36 pb-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: COLORS.primary }}>
            طلباتي
          </h1>
          <p className="mt-2 text-gray-500">متابعة دقيقة لرحلة استقدام عمالتك</p>
        </motion.div>

        {/* Client Info Card */}
        {clientInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md" style={{ backgroundColor: COLORS.primary }}>
                {clientInfo.fullname ? clientInfo.fullname.charAt(0) : <User />}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.primary }}>
                  مرحباً، {clientInfo.fullname}
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500">
                  {/* تم تصحيح phonenumber هنا */}
                  <span className="flex items-center gap-1.5"><Phone size={16} className="text-[#E5BC7E]" /> {clientInfo.phonenumber}</span>
                  {clientInfo.email && <span className="flex items-center gap-1.5"><Mail size={16} className="text-[#E5BC7E]" /> {clientInfo.email}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end items-center">
               <div className="bg-[#f8fcfd] border border-[#e1eef3] px-6 py-3 rounded-xl text-center min-w-[120px]">
                  <span className="block text-2xl font-bold mb-1" style={{ color: COLORS.primary }}>{orders.length}</span>
                  <span className="text-xs text-gray-500 font-medium">عدد الطلبات</span>
               </div>
               <button
                 type="button"
                 onClick={handleLogout}
                 className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium cursor-pointer"
               >
                 <LogOut size={18} />
                 خروج
               </button>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-8 relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="البحث برقم الطلب، اسم العاملة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pr-12 pl-4 rounded-xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': COLORS.secondary }}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Orders List (Cards View) */}
        <div className="space-y-6">
          <AnimatePresence>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Clock className="w-10 h-10 animate-spin mb-4" style={{ color: COLORS.secondary }} />
                <p className="text-gray-400">جاري تحميل البيانات...</p>
              </div>
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
              >
                <PackageCheck className="w-24 h-24 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-700">لا توجد طلبات</h3>
                <p className="text-gray-500 mt-2">لم يتم العثور على أي طلبات مسجلة.</p>
              </motion.div>
            ) : (
              orders.filter(o => 
                 o.HomeMaid?.Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 o.id.toString().includes(searchQuery)
              ).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: COLORS.secondary }}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">رقم الطلب</p>
                        <p className="text-lg font-bold" style={{ color: COLORS.primary }}>#{order.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusBadgeStyle(order.clientBookingStatus || order.bookingstatus)}`}>
                          <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                          {getStageInfo(order.clientBookingStatus || order.bookingstatus, order).message || translateBookingStatusToArabic(order.clientBookingStatus || order.bookingstatus)}
                        </span>
                      </div>
                      {['cancelled', 'rejected'].includes(order.clientBookingStatus || order.bookingstatus) ? (
                        <div className="px-4 py-1.5 rounded-full text-xs font-bold border border-red-200 bg-red-50 text-red-600 flex items-center gap-2 max-w-[200px] sm:max-w-xs md:max-w-md">
                          <XCircle size={14} className="shrink-0" />
                          <span className="truncate">السبب: {((order.clientBookingStatus || order.bookingstatus) === 'rejected' ? order.ReasonOfRejection : order.ReasonOfCancellation) || 'غير محدد'}</span>
                        </div>
                      ) : ['pending_arrival', 'ticket_booked', 'destinations_set'].includes(order.clientBookingStatus || order.bookingstatus) ? (
                        <div className="px-4 py-1.5 rounded-full text-xs font-bold border border-blue-200 bg-blue-50 text-blue-600 flex items-center gap-2">
                          <PlaneLanding size={14} />
                          <span>{getArrivalText(order.arrivals?.[0]?.KingdomentryDate, order.arrivals?.[0]?.KingdomentryTime)}</span>
                        </div>
                      ) : ['received', 'delivered'].includes(order.clientBookingStatus || order.bookingstatus) ? (
                        <div className="px-4 py-1.5 rounded-full text-xs font-bold border border-green-200 bg-green-50 text-green-600 flex items-center gap-2">
                          <CheckCircle2 size={14} />
                          <span>نتمنى أن خدمتنا أعجبتك، نحن معك دائماً</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-2">
                          <Clock size={14} />
                          <span>تستغرق هذه المرحلة {getStageInfo(order.clientBookingStatus || order.bookingstatus, order).days} {getStageInfo(order.clientBookingStatus || order.bookingstatus, order).days == 1 ? 'يوم' : 'أيام'} عادة</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  {!['cancelled', 'rejected'].includes(order.clientBookingStatus || order.bookingstatus) && (
                    <div className="p-6 md:p-8">
                      {/* Worker Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8">
                        {/* اسم العاملة */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">اسم العاملة</h4>
                          <p className="text-base font-bold text-gray-800 line-clamp-1">{order?.HomeMaid?.Name || '---'}</p>
                        </div>
                        {/* الجنسية */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">الجنسية</h4>
                          <p className="text-sm font-medium text-gray-700">{order?.HomeMaid?.Nationalitycopy || '---'}</p>
                        </div>
                      </div>

                      {/* Progress Bar Section */}
                      <div className="mt-8 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-sm font-bold" style={{ color: COLORS.primary }}>مسار الطلب</h4>
                           <span className="text-xs text-gray-400">آخر تحديث تلقائي</span>
                        </div>
                        <OrderStepper 
                          status={order.clientBookingStatus || order.bookingstatus} 
                          order={order}
                          customTimeline={order.customTimeline}
                        />
                      </div>

                      {/* Documents Section (New) */}
                      <OrderDocuments order={order} />

                      {/* Rating Section */}
                      <OrderRating order={order} onOpenRating={setRatingPopupOrder} />
                      
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Rating Modal */}
      <RatingModal 
        order={ratingPopupOrder}
        isOpen={!!ratingPopupOrder}
        onClose={() => setRatingPopupOrder(null)}
        onRatingSubmitted={handleRatingSubmitted}
      />

      {/* Styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}