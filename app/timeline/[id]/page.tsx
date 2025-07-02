'use client';

//@ts-ignore
//@ts-nocheck

import NavigationBar from '@/app/components/navigation';
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
  Loader2Icon
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';

const myFont = localFont({
  src: '/fonts/ReadexPro-Bold.ttf',
  weight: '700',
});

const Timeline: React.FC = () => {
  const [timeline, setTimeline] = useState<{
    Order: { createdAt?: string };
    InternalmusanedContract?: string;
    externalmusanedContract?: string;
    externalOfficeApproval?: string;
    medicalCheckFile?: string;
    AgencyDate?: string;
    EmbassySealing?: string;
    KingdomentryDate?: string;
    DeliveryDate?: string;
  }>();
  const params = useParams();

  const fetchTimelineData = async () => {
    try {
      const fetchData = await fetch(`/api/timeline/${params.id}`);
      if (!fetchData.ok) throw new Error('فشل جلب البيانات');
      const data = await fetchData.json();
      setTimeline(data);
    } catch (error) {
      console.error('خطأ في جلب بيانات الطلب:', error);
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

  const events = [
    {
      id: '1',
      date: timeline?.Order?.createdAt,
      title: 'استلام الطلب',
      description: 'تم استلام طلبك بنجاح',
      icon: <FileCheckIcon className="w-6 h-6" />,
      duration: 1,
    },
    {
      id: '2',
      date: timeline?.InternalmusanedContract,
      title: 'الربط مع مساند',
      description: 'تم الربط مع منصة مساند الداخلية',
      icon: <GlobeIcon className="w-6 h-6" />,
      duration: 23,
    },
    {
      id: '3',
      date: timeline?.externalmusanedContract,
      title: 'تدريب العاملة',
      description: 'تدريب العاملة',
      icon: <GlobeIcon className="w-6 h-6" />,
      duration: 15
      ,
    },
    {
      id: '4',
      date: timeline?.medicalCheckFile,
      title: 'الفحص الطبي',
      description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon className="w-6 h-6" />,
      duration: 3,
    },
    {
      id: '5',
      date: timeline?.medicalCheckFile,
      title: 'موافقة وزارة العمل',
      description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon className="w-6 h-6" />,
      duration: 2,
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
    const hasDate = !!event.date;
    const active = isActive && hasDate;
    const inProgress = !active && isActive && !inProgressSet;

    if (!hasDate) isActive = false;
    if (inProgress) inProgressSet = true;

    const daysToPrevious = index > 0 && events[index - 1].date
      ? (
        event.date
          ? getDaysBetween(event.date ?? '', events[index - 1].date ?? '')
          : getDaysBetween(new Date().toISOString(), events[index - 1].date ?? '')
      )
      : null;

    const progressPercentage = inProgress && daysToPrevious !== null && event.duration > 0
      ? Math.min((daysToPrevious / event.duration) * 100, 100)
      : 0;

    return { ...event, active, inProgress, daysToPrevious, progressPercentage };
  });

  const formatDate = (date?: string) => {
    if (!date) return 'قيد الانتظار';
    const d = new Date(date);
    return isNaN(d.getTime())
      ? 'قيد الانتظار'
      : `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
  };

  return (
    <div dir="rtl" className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${myFont.className}`}>
      <NavigationBar />
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-32 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12 tracking-tight">
          حالة الاستقدام
        </h2>
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
                  <div
                    className={`text-sm font-medium mb-1 ${
                      event.active || event.inProgress
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {event.inProgress ? 'قيد التنفيذ' : formatDate(event.date)}
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      event.active || event.inProgress
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {event.title}
                  </h3>
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
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <motion.div
                          className="bg-yellow-500 h-2.5 rounded-full relative flex items-center justify-center"
                          initial={{ width: 0 }}
                          animate={{ width: `${event.progressPercentage}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          
                          <span className="absolute text-xs  w-25 font-medium text-white bg-gray-800 p-2 rounded-lg">
                            {event.daysToPrevious} يوم مضت 
                          </span>
                        </motion.div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
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