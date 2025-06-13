'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/navbar';
import { useParams } from 'next/navigation';
import NavigationBar from '@/app/components/navigation';

export default function MyOrdersPage() {
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

    // جلب بيانات الطلبات
    const fetchMyOrders = async () => {
        const myOrders = await fetch(`/api/myorders/${params.id}`);
        const data = await myOrders.json();
        console.log(data);
        setOrders(data);
    };

    // جلب بيانات العميل
    const fetchClientInfo = async () => {
        const response = await fetch(`/api/client/${params.id}`);
        const data = await response.json();
        setClientInfo(data);
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    // أنواع التحريك للجدول
    const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    // أنواع التحريك لقسم معلومات العميل
    const clientInfoVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8" dir="rtl">
            <NavigationBar />
            <div className="max-w-5xl mx-auto">
                {/* العنوان */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900">طلباتي</h1>
                </motion.div>

                {/* قسم معلومات العميل */}
                <motion.div
                    variants={clientInfoVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8 bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">معلومات العميل</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">الاسم</p>
                            <p className="text-lg text-gray-900">{orders.length > 0 ? orders[0].client?.fullname : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">رقم الهاتف</p>
                            <p className="text-lg text-gray-900">{orders.length > 0 ? orders[0].client?.phonenumber : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">البريد الإلكتروني</p>
                            {/* <p className="text-lg text-gray-900">{clientInfo.email}</p> */}
                        </div>
                    </div>
                </motion.div>

                {/* شريط البحث */}
                <div className="mb-8 relative">
                    <input
                        type="text"
                        placeholder="ابحث باسم العاملة، الحالة، أو الشركة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 pr-12 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* جدول الطلبات */}
                <motion.div
                    variants={tableVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">رقم الطلب</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">اسم العاملة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الشركة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراء</th>
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
                                        <td colSpan={5} className="px-6 py-4 text-gray-500">
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
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.HomeMaid.Name}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.bookingstatus === 'اكمال الطلب'
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

                                            <td className="px-6 py-4 text-sm text-gray-900">{order.HomeMaid.office.office}</td>
                                            <td className="px-6 py-4">
                                                <Link href="/">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                                    >
                                                        <ArrowLeftCircle size={16} />
                                                        متابعة
                                                    </motion.button>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
}