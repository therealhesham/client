//@ts-ignore
//@ts-nocheck

'use client';

import NavigationBar from '@/app/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon } from 'lucide-react';
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
    EmbassySealing?: string;
  }>({});
  const params = useParams();

  const fetchTimelineData = async () => {
    const fetchData = await fetch(`/api/timeline/${params.id}`);
    const data = await fetchData.json();
    console.log(data);
    setTimeline(data);
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const stages = [
    "الربط مع مساند",

    "الربط مع مساند الخارجي",
    "الربط مع المكتب الخارجي",

    "الفحص الطبي",
    "الربط مع الوكالة",
    "التختيم في السفارة",
    ,
    "حجز التذكرة",
    "الاستلام",

    // "المتابعة",
  ];
  // Define the timeline events in order
  const events = [
    {
      id: 1,
      date: timeline?.Order?.createdAt,
      title: 'استلام الطلب',
      description: '',
      icon: <MessageCircleIcon />,
    },
    {
      id: 2,
      date: timeline?.InternalmusanedContract,
      title: 'الربط مع مساند',
      description: '',
      icon: <MessageCircleIcon />,
    },
    {
      id: 3,
      date: timeline?.externalmusanedContract,
      title: 'الربط مع مساند الخارجي',
      description: '',
      icon: <MessageCircleIcon />,
    },
    {
      id: 4,
      date: timeline?.externalOfficeApproval,
      title: 'الربط مع المكتب الخارجي',
      description: '',
      icon: <MessageCircleIcon />,
    },
    {
      id: 10,
      date: timeline?.medicalCheckFile,
     title:"الفحص الطبي",
      description: '',
      icon: <MessageCircleIcon />,
    },,
    {
      id: 10,
      date: timeline?.AgencyDate,
     title:"الربط مع الوكالة",
      description: '',
      icon: <MessageCircleIcon />,
    },
    {
      id: 5,
      date: timeline?.EmbassySealing,
      title: 'التختيم في السفارة',
      description: '',
      icon: <MessageCircleIcon />,
    },
    
    {
      id: 90,
      date: timeline?.KingdomentryDate,
      title: 'حجز التذكرة',
      description: '',
      icon: <MessageCircleIcon />,
    },
  
  
    {
      id: 91,
      date: timeline?.DeliveryDate,
      title: 'الاستلام',
      description: '',
      icon: <MessageCircleIcon />,
    },
  
  ];

  // Determine which events are active
  let isActive = true; // Tracks if events should remain active
  const eventsWithActiveState = events.map((event) => {
    const hasDate = !!event.date; // Check if the event has a valid date
    const active = isActive && hasDate; // Event is active if all previous are active and it has a date
    if (!hasDate) isActive = false; // Once a date is missing, all subsequent events are inactive
    return { ...event, active };
  });


  return (
    <div dir="rtl" className={`min-h-screen bg-gray-50 ${myFont.className}`}>

      <NavigationBar />
      <div className="max-w-3xl pt-30 px-20 mx-auto py-12  sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          تتبع الطلب
        </h2>
        <div className="relative flex flex-col">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
          <AnimatePresence>
            {eventsWithActiveState.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * event.id }}
                className={`relative mb-10 ${!event.active ? 'opacity-50' : ''}`}
              >
                {/* Icon and Dot */}
                <div
                  className={`absolute flex items-center justify-center w-12 h-12 rounded-full ${event.active
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    } left-0 -translate-x-1/2`}
                >
                  {event.icon}
                </div>
                {/* Content */}
                <div className="ml-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <div className="text-sm font-normal text-gray-400 dark:text-gray-500">
                    {event.date
                      ? `${new Date(event.date).getDate()} / ${new Date(event.date).getMonth() + 1
                      } / ${new Date(event.date).getFullYear()}`
                      : 'غير متاح'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {event.description}
                  </p>
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