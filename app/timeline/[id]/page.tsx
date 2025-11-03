'use client';

//@ts-ignore
//@ts-nocheck

import NavigationBar from '../../../app/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheckIcon,
  GlobeIcon,
  StethoscopeIcon,
  BriefcaseIcon,
  StampIcon,
  PlaneIcon,
  PackageIcon,
  ClockIcon,
  Loader2Icon,
  UserIcon
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';

const myFont = localFont({
  src: '../../fonts/Tajawal-Medium.ttf',
  weight: '700',
});

const Timeline: React.FC = () => {
  const [timeline, setTimeline] = useState<{
    InternalmusanedContract?: string;
    externalmusanedContract?: string;
    externalOfficeApproval?: string;
    medicalCheckFile?: string;
    AgencyDate?: string;
    EmbassySealing?: string;
    KingdomentryDate?: string;
    DeliveryDate?: string;
    HomemaidName?: string;
    createdAt?: string;
    Order?: {createdAt?: string ,
      HomeMaid?: {
        Name?: string;
        Passportnumber?: string;
      };
    };
  }>();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const[orderData,setOrderData]=useState<{
    internalMusanedContract?: string;
    externalmusanedContract?: string;
    externalOfficeApproval?: string;
    medicalCheckFile?: string;
    AgencyDate?: string;
    EmbassySealing?: string;
    KingdomentryDate?: string;
    DeliveryDate?: string;
  }>({});
const [bookingstatus,setBookingStatus]=useState("")
  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const fetchData = await fetch(`/api/timeline/${params.id}`);
      if (!fetchData.ok) throw new Error('فشل جلب البيانات');
      const data = await fetchData.json();
      console.log(data)
      setBookingStatus(data?.findClient?.Order?.bookingstatus)
            setTimeline(data.findClient);
            setOrderData(data?.orderData)
    } catch (error) {
      console.error('خطأ في جلب بيانات الطلب:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTimelineData();
    }
  }, [params.id]);

  const getDaysBetween = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMs = Math.abs(d2.getTime() - d1.getTime());
    return Math.round(diffInMs / (1000 * 60 * 60 * 24));
  };
//external_office_approved
//pending_external_office



//medical_check_passed
//pending_medical_check


//foreign_labor_approved
//pending_foreign_labor


//agency_paid
//pending_agency_payment


//embassy_approved
//pending_embassy



//visa_issued
//pending_visa

//travel_permit_issued
//pending_travel_permit


//received
const translateBookingStatus = (status: string) => {
  const statusTranslations: { [key: string]: string } = {
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
  
  return statusTranslations[status] || status;
};

  const events = [
    {
      id: '1',
      date: timeline?.createdAt,
      title: 'استلام الطلب',
      description: 'تم استلام طلبك بنجاح',
      icon: <FileCheckIcon className="w-6 h-6" />,
      duration: 1,
    },
    {
      id: '2',
      date: orderData?.musanedDate,
      title: 'الربط مع مساند',
      description: 'تم الربط مع منصة مساند الداخلية',
      icon: <GlobeIcon className="w-6 h-6" />,
      duration: 23,
    },
    ,{
      id: '5',
      date:orderData?.foreignLaborApproval,
      title: 'موافقة وزارة العمل',
      // description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon className="w-6 h-6" />,
      duration: 2,
    },
    
    // {
    //   id: '3',
    //   date: timeline?.externalmusanedContract,
    //   title: 'تدريب العاملة',
    //   description: 'تدريب العاملة',
    //   icon: <GlobeIcon className="w-6 h-6" />,
    //   duration: 15,
    // },
    {
      id: '4',
      date: timeline?.medicalCheckFile,
      title: 'الفحص الطبي',
      description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon className="w-6 h-6" />,
      duration: 3,
    },
    {
      id: '6',
      date: timeline?.AgencyDate,
      title: 'الربط مع الوكالة',
      description: 'تم الربط مع الوكالة',
      icon: <BriefcaseIcon className="w-6 h-6" />,
      duration: 5,
    },
    {
      id: '7',
      date: timeline?.EmbassySealing,
      title: 'التختيم في السفارة',
      description: 'تم التختيم في السفارة',
      icon: <StampIcon className="w-6 h-6" />,
      duration: 7,
    },
    {
      id: '8',
      date: timeline?.KingdomentryDate,
      title: 'حجز التذكرة',
      description: 'تم حجز تذكرة السفر',
      icon: <PlaneIcon className="w-6 h-6" />,
      duration: 0,
    },
    {
      id: '9',
      date: timeline?.DeliveryDate,
      title: 'الاستلام',
      description: 'تم تسليم العاملة',
      icon: <PackageIcon className="w-6 h-6" />,
      duration: 0,
    },
  ];

  let isActive = true;
  let inProgressSet = false;
  const eventsWithActiveState = events.map((event, index) => {
    const hasDate = !!event?.date;
    const active = isActive && hasDate;
    const inProgress = !active && isActive && !inProgressSet;

    if (!hasDate) isActive = false;
    if (inProgress) inProgressSet = true;

    // Calculate start date (previous stage's date or createdAt for first stage)
    const startDate = index > 0 ? events[index - 1]?.date : timeline?.createdAt;

    // End date is the current stage's date
    const endDate = event?.date;

    // Calculate days between start and end dates for active stages
    const daysToPrevious = startDate && endDate
      ? getDaysBetween(startDate, endDate)
      : index > 0 && events[index - 1]?.date
      ? getDaysBetween(new Date().toISOString(), events[index - 1]?.date ?? '')
      : null;

    const progressPercentage = inProgress && daysToPrevious !== null && event?.duration > 0
      ? Math.min((daysToPrevious / event?.duration) * 100, 100)
      : 0;

    return { ...event, active, inProgress, startDate, endDate, daysToPrevious, progressPercentage };
  });

  const formatDate = (date?: string) => {
    if (!date) return 'قيد الانتظار';
    const d = new Date(date);
    return isNaN(d.getTime())
      ? 'قيد الانتظار'
      : `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
  };

  return (
    <div dir="rtl" className={`min-h-screen bg-gradient-to-b from-gray-50 toGRAY-100 dark:from-gray-900 dark:to-gray-800 ${myFont.className}`}>
      <NavigationBar />
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-32 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12 tracking-tight">
          حالة الاستقدام
        </h2>

        {/* كارت بيانات العاملة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-12"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) :  timeline?.Order?.HomeMaid?.Name ? (
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div className="mr-4 gap-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  { timeline?.Order?.HomeMaid?.Name || 'غير متوفر'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  رقم جواز السفر: {timeline?.Order?.HomeMaid?.Passportnumber || 'غير متوفر'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  حالة الطلب: {translateBookingStatus(timeline?.Order?.bookingstatus || '') || 'غير متوفر'}
                </p>
              </div>


<div className='mb-4'> 


</div>

            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              لا توجد بيانات متاحة للعاملة
            </p>
          )}
        </motion.div>

        {/* باقي الـ Timeline */}
        <div className="relative flex flex-col w-full">
          <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-300 to-blue-500 dark:from-blue-700 dark:to-blue-900"></div>
          <AnimatePresence>
            {eventsWithActiveState.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 * index, ease: 'easeOut' }}
                className={`mb-12 left-6 flex items-center ${!event.active && !event.inProgress ? 'opacity-50 filter grayscale' : ''}`}
              >
                <motion.div
                  className={`flex items-center justify-center w-14 h-14 rounded-full shadow-md transition-all duration-300 ${
                    event.active
                      ? 'bg-blue-500 text-white dark:bg-blue-600'
                      : event.inProgress
                      ? 'bg-yellow-500 text-white dark:bg-yellow-600'
                      : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 scale-90'
                  } absolute left-8 transform -translate-x-1/2`}
                  animate={event.inProgress ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5 } } : {}}
                >
                  {event.active ? event.icon : event.inProgress ? <Loader2Icon className="w-6 h-6 animate-spin" /> : <ClockIcon className="w-5 h-5" />}
                </motion.div>
                <div
                  className={`w-full p-6 rounded-xl border transition-all duration-300 ${
                    event.active
                      ? 'bg-white dark:bg-gray-800 shadow-lg border-gray-100 dark:border-gray-700'
                      : event.inProgress
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 shadow-md border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                   <h3
                    className={`text-xl font-semibold mb-2 justify-center flex flex-row${
                      event.active || event.inProgress
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {event.title}
                  </h3>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      event.active || event.inProgress
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  ><div className="flex flex-col justify-around">
                  {event.startDate ? (
                    <span>تاريخ البدء: {formatDate(event.startDate)}</span>
                  ) : (
                    <span>تاريخ البدء: غير متوفر</span>
                  )}
                  {event.endDate ? (
                    <span>تاريخ الانتهاء: {formatDate(event.endDate)}</span>
                  ) : (
                    <span>تاريخ الانتهاء: قيد الانتظار</span>
                  )}
                </div>
                  </div>
                 
                  <p
                    className={`text-base font-normal ${
                      event.active || event.inProgress
                        ? 'text-gray-600 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {event.inProgress ? 'جاري العمل على هذه المرحلة' : event.description}
                  </p>
                  {event.active && event.daysToPrevious !== null && (
                    <p
                      className={`text-sm font-medium mt-2 ${
                        event.active ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      استغرقت تلك المرحلة {event.daysToPrevious} يوم
                    </p>
                  )}
                  {event.inProgress && event.duration > 0 && (
                    <div className="mt-4 relative">
                      <div className=" bg-gray-200 w-[95%] dark:bg-gray-600 rounded-full h-2.5">
                        <motion.div
                          className={`h-2.5 rounded-full relative flex items-center justify-center
                             ${
                            event.daysToPrevious !== null && event.daysToPrevious > event.duration ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${event.progressPercentage}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="absolute text-xs  w-13 justify-center flex font-medium text-white bg-gray-800 p-2 rounded-lg">
                            {event.daysToPrevious} يوم
                          </span>
                        </motion.div>
                      </div>
                      <p className="text \|sm text-gray-500 dark:text-gray-400 mt-1 text-right">
                        المدة المتوقعة: {event.duration} يوم
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Timeline;