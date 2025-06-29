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
  PackageIcon
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
      icon: <FileCheckIcon />,
      duration: 1,
    },
    {
      id: '2',
      date: timeline?.InternalmusanedContract,
      title: 'الربط مع مساند',
      description: 'تم الربط مع منصة مساند الداخلية',
      icon: <GlobeIcon />,
      duration: 23,
    },
    {
      id: '3',
      date: timeline?.externalmusanedContract,
      title: 'تدريب العاملة',
      description: 'تدريب العاملة',
      icon: <GlobeIcon />,
      duration: 15,
    },
    {
      id: '4',
      date: timeline?.medicalCheckFile,
      title: 'الفحص الطبي',
      description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon />,
      duration: 3,
    },
    {
      id: '5',
      date: timeline?.medicalCheckFile,
      title: 'موافقة وزارة العمل',
      description: 'تم إجراء الفحص الطبي',
      icon: <StethoscopeIcon />,
      duration: 2,
    },
    {
      id: '6',
      date: timeline?.AgencyDate,
      title: 'الربط مع الوكالة',
      description: 'تم الربط مع الوكالة',
      icon: <BriefcaseIcon />,
      duration: 5,
    },
    {
      id: '7',
      date: timeline?.EmbassySealing,
      title: 'التختيم في السفارة',
      description: 'تم التختيم في السفارة',
      icon: <StampIcon />,
      duration: 7,
    },
    {
      id: '8',
      date: timeline?.KingdomentryDate,
      title: 'حجز التذكرة',
      description: 'تم حجز تذكرة السفر',
      icon: <PlaneIcon />,
      duration: 0,
    },
    {
      id: '9',
      date: timeline?.DeliveryDate,
      title: 'الاستلام',
      description: 'تم تسليم العاملة',
      icon: <PackageIcon />,
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
    if (!date) return 'غير متاح';
    const d = new Date(date);
    return isNaN(d.getTime())
      ? 'غير متاح'
      : `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
  };

  return (
    <div dir="rtl" className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${myFont.className}`}>
      <NavigationBar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-32 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
          تابع الطلب
        </h2>
        <div className="relative flex flex-col w-full">
          <div className="absolute left-6 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
          <AnimatePresence>
            {eventsWithActiveState.map((event, index) => (
              <div key={event.id}>
                {event.daysToPrevious !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-4 text-center"
                  >
                    <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                      {event.daysToPrevious} يوم
                    </div>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className={` mb-10 left-5 flex items-center  ${!event.active ? 'opacity-50' : ''}`}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      event.active
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    } absolute left-6 transform -translate-x-1/2`}
                  >
                    {event.icon}
                  </div>
                  <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-right">
                    <div className="text-sm font-normal text-gray-400 dark:text-gray-500">
                      {formatDate(event.date)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
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