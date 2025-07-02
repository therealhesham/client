//@ts-ignore
//@ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import NavigationBar from '@/app/components/navigation';

export default function MyOrdersPage() {
  const router = useRouter();
  const params = useParams();
  const [orders, setOrders] = useState<{
    HomeMaid: any;
    id: string;
    workerName: string;
    status: string;
    client: any;
    office: any;
  }[]>([]);
  const [clientInfo, setClientInfo] = useState<{
    name: string;
    phone: string;
    email: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch orders
  const fetchMyOrders = async () => {
    const myOrders = await fetch(`/api/myorders/${params.id}`);
    const data = await myOrders.json();
    setOrders(data.orders);
setClientInfo(data.clientinfo)  
};

  

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const clientInfoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8" dir="rtl">
      <NavigationBar />
      <div className="max-w-5xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">طلباتي</h1>
        </motion.div>

        {/* Client Info Section */}
        <motion.div
          variants={clientInfoVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">معلومات العميل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">الاسم</p>
              <p className="text-base sm:text-lg text-gray-900">
                
                {orders.length > 0 ? clientInfo.fullname : '---'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">رقم الهاتف</p>
              <p className="text-base sm:text-lg text-gray-900">
                {orders.length > 0 ? clientInfo.phonenumber : '---'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">البريد الإلكتروني</p>
              <p className="text-base sm:text-lg text-gray-900">{clientInfo?.email || '---'}</p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 relative">
          <input
            type="text"
            placeholder="ابحث باسم العاملة، الحالة، أو الشركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 sm:p-4 pr-10 sm:pr-12 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm sm:text-base"
          />
          <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Orders Table */}
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-900">رقم الطلب</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-900">اسم العاملة</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-900">الشركة</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-900">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {orders.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <td colSpan={5} className="px-4 sm:px-6 py-4 text-gray-500 text-sm">
                        لا توجد طلبات مطابقة.
                      </td>
                    </motion.tr>
                  ) : (
                    orders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{order.id}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{order.HomeMaid.Name}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              order.bookingstatus === 'اكمال الطلب'
                                ? 'bg-green-100 text-green-800'
                                : order.bookingstatus === 'حجز جديد'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.bookingstatus === 'اكمال الطلب'
                              ? 'تم الاستلام'
                              : order.bookingstatus === 'حجز جديد'
                              ? 'في انتظار المراجعة'
                              : 'طلب مرفوض'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{order.HomeMaid.office.office}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <motion.button
                            disabled={order?.arrivals[0]?.id ? false : true}
                            onClick={() => router.push('/timeline/' + order.arrivals[0].id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                          >
                            <ArrowLeftCircle size={16} />
                            متابعة
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Mobile Card Layout */}
            <div className="sm:hidden divide-y divide-gray-200">
              <AnimatePresence>
                {orders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    لا توجد طلبات مطابقة.
                  </motion.div>
                ) : (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">رقم الطلب</span>
                        <span className="text-sm text-gray-900">{order.id}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">اسم العاملة</span>
                        <span className="text-sm text-gray-900">{order.HomeMaid.Name}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">الحالة</span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.bookingstatus === 'اكمال الطلب'
                              ? 'bg-green-100 text-green-800'
                              : order.bookingstatus === 'حجز جديد'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.bookingstatus === 'اكمال الطلب'

? 'تم الاستلام'
                            : order.bookingstatus === 'حجز جديد'
                            ? 'في انتظار المراجعة'
                            : 'طلب مرفوض'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">الشركة</span>
                        <span className="text-sm text-gray-900">{order.HomeMaid.office.office}</span>
                      </div>
                      <div className="mt-4">
                        <motion.button
                          disabled={order?.arrivals[0]?.id ? false : true}
                          onClick={() => router.push('/timeline/' + order.arrivals[0].id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <ArrowLeftCircle size={16} />
                          متابعة
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for Additional Responsiveness */}
      <style jsx>{`
        @media (max-width: 640px) {
          .min-h-screen {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .text-4xl {
            font-size: 1.5rem;
          }
          .text-2xl {
            font-size: 1.25rem;
          }
          .text-lg {
            font-size: 1rem;
          }
          .text-sm {
            font-size: 0.875rem;
          }
          .p-6 {
            padding: 1rem;
          }
          .px-6 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .py-4 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}