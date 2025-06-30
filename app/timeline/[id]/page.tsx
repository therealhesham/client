'use client';

//@ts-ignore
//@ts-nocheck

import NavigationBar from '@/app/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheckIcon,
  GlobeIcon,
  BuildingIcon,
  StethoscopeIcon,
  BriefcaseIcon,
  StampIcon,
  PlaneIcon,
  PackageIcon,
  ClockIcon
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';

const myFont = localFont({
  src: '/fonts/ReadexPro-Bold.ttf',
  weight: '700',
});

const Counter: React.FC<{ days: number }> = ({ days }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev < days) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 2000 / (days || 1)); // تجنب القسمة على صفر

    return () => clearInterval(timer);
  }, [days]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
    >
      <motion.span
        key={days}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {count} يوم
      </motion.span>
    </motion.div>
  );
};

const Timeline: React.FC = () => {
  const [timeline, setTimeline] = useState<{
    Order:{ createdAt?: string };
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

  const getDaysBetween = (date1: string, date2: any) => {
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
      description: 'تم استيلام طلبك بنجاح',
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
      duration: 15,
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
  const eventsWithActiveState = events.map((event, index) => {
    const hasDate = !!event.date;
    const active = isActive && hasDate;
    if (!hasDate) isActive = false;

    const daysToPrevious = index > 0
      ? (
        event.date && events[index - 1].date
          ? getDaysBetween(event.date, events[index - 1].date)
          : events[index - 1].duration
      ) 
      : null;

    return { ...event, active, daysToPrevious };
  });

  const formatDate = (date?: string) => {
    if (!date) return 'في انتظار الإكمال';
    const d = new Date(date);
    return isNaN(d.getTime())
      ? 'في انتظار الإكمال'
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
              <div key={event.id}>
                {event.daysToPrevious !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6 text-center"
                  >
                    <Counter days={event.daysToPrevious} />
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 * index, ease: 'easeOut' }}
                  className={`mb-12 left-6 flex items-center ${!event.active ? 'opacity-50 filter grayscale' : ''}`}
                >
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full shadow-md transition-all duration-300 ${
                      event.active
                        ? 'bg-blue-500 text-white dark:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                    } absolute left-8 transform -translate-x-1/2`}
                  >
                    {event.active ? event.icon : <ClockIcon className="w-6 h-6" />}
                  </div>
                  <div className={`w-full p-6 rounded-xl shadow-lg text-right border transition-all duration-300 hover:shadow-xl ${
                    event.active
                      ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className={`text-sm font-medium mb-1 ${
                      event.active ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {formatDate(event.date)}
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      event.active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {event.title}
                    </h3>
                    <p className={`text-base font-normal ${
                      event.active ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Timeline;