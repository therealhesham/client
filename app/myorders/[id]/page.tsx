//@ts-ignore
//@ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileCheck, 
  Globe, 
  Stethoscope, 
  Plane, 
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
  ExternalLink // أيقونة عامة للملفات
} from 'lucide-react';

import localFont from "next/font/local";
import { useParams } from 'next/navigation';
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

// --- تعريف المراحل (9 مراحل) - الافتراضي ---
const DEFAULT_STEPS = [
  { id: 1, label: 'الطلب', icon: FileCheck, statuses: ['new_order', 'new_orders', 'pending'] },
  { id: 2, label: 'المكتب الخارجي', icon: Globe, statuses: ['pending_external_office', 'external_office_approved'] },
  { id: 3, label: 'وزارة العمل', icon: Building2, statuses: ['pending_foreign_labor', 'foreign_labor_approved'] },
  { id: 4, label: 'الفحص الطبي', icon: Stethoscope, statuses: ['pending_medical_check', 'medical_check_passed'] },
  { id: 5, label: 'الوكالة', icon: Wallet, statuses: ['pending_agency_payment', 'agency_paid'] },
  { id: 6, label: 'السفارة', icon: Stamp, statuses: ['pending_embassy', 'embassy_approved'] },
  { id: 7, label: 'التأشيرة', icon: FileText, statuses: ['pending_visa', 'visa_issued'] },
  { id: 8, label: 'تصريح السفر', icon: Plane, statuses: ['pending_travel_permit', 'travel_permit_issued'] },
  { id: 9, label: 'الاستلام', icon: CheckCircle2, statuses: ['pending_receipt', 'received', 'delivered'] }
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
    return (
      <div className="w-full py-6 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center justify-center gap-2 text-red-600">
        <XCircle size={32} />
        <span className="font-bold">هذا الطلب ملغي أو مرفوض</span>
      </div>
    );
  }

  // حساب نسبة التقدم للشريط الملون
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full mt-4">
      {/* Scrollable Container */}
      <div className="overflow-x-auto pb-4 pt-2 hide-scrollbar" dir="rtl">
        <div className="flex items-center justify-between min-w-[850px] px-4 relative">
          
          {/* الخط الخلفي (رمادي فاتح) */}
          <div className="absolute top-[22px] left-0 w-full h-[3px] bg-gray-200 rounded-full -z-10"></div>
          
          {/* الخط الملون المتقدم (تدرج ذهبي) */}
          <div 
            className="absolute top-[22px] right-0 h-[3px] bg-gradient-to-l from-[#E5BC7E] to-[#cf9f59] rounded-full -z-10 transition-all duration-1000 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center relative group min-w-[80px]">
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
                  <p className={`text-[11px] font-bold transition-colors duration-300 whitespace-nowrap ${
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
  const visaUrl = clientVisas.length > 0 ? clientVisas[0].visaFile : null;

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
                <p className="text-[10px] text-gray-400">ملف {doc.type === 'ticket' ? 'PDF/Image' : 'وثيقة'}</p>
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

// --- الصفحة الرئيسية ---
export default function MyOrdersPage() {
  const params = useParams();
  const [orders, setOrders] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // جلب البيانات الفعلي من الـ API
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const myOrders = await fetch(`/api/myorders/${params.id}`);
      const data = await myOrders.json();
      setOrders(data.orders || []);
      setClientInfo(data.clientinfo);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 ${myFontTajawal.className}`} dir="rtl">
      <NavigationBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
                  <span className="flex items-center gap-1.5"><span className="text-[#E5BC7E]">📱</span> {clientInfo.phonenumber}</span>
                  {clientInfo.email && <span className="flex items-center gap-1.5"><span className="text-[#E5BC7E]">📧</span> {clientInfo.email}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end">
               <div className="bg-[#f8fcfd] border border-[#e1eef3] px-6 py-3 rounded-xl text-center min-w-[120px]">
                  <span className="block text-2xl font-bold mb-1" style={{ color: COLORS.primary }}>{orders.length}</span>
                  <span className="text-xs text-gray-500 font-medium">عدد الطلبات</span>
               </div>
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
                    
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusBadgeStyle(order.bookingstatus)}`}>
                      <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                      {translateBookingStatusToArabic(order.bookingstatus)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 md:p-8">
                    {/* Worker Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 mb-8">
                      {/* اسم العاملة */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">اسم العاملة</h4>
                        <p className="text-base font-bold text-gray-800 line-clamp-1">{order?.HomeMaid?.Name || '---'}</p>
                      </div>
                      {/* المكتب الخارجي
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">المكتب الخارجي</h4>
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-gray-400" />
                          <p className="text-sm font-medium text-gray-700 line-clamp-1">{order?.HomeMaid?.office?.office || '---'}</p>
                        </div>
                      </div> */}
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
                        status={order.bookingstatus} 
                        order={order}
                        customTimeline={order.customTimeline}
                      />
                    </div>

                    {/* Documents Section (New) */}
                    <OrderDocuments order={order} />
                    
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
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