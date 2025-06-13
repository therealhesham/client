'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';

// Sample order data
const orders = [
    {
        id: 'ORD001',
        workerName: 'سارة أحمد',
        status: 'تم التوصيل',
        company: 'ورشة الإبداع',
        timelineUrl: '/orders/ORD001/timeline',
    },
    {
        id: 'ORD002',
        workerName: 'نورا محمد',
        status: 'قيد المعالجة',
        company: 'يدويات النوف',
        timelineUrl: '/orders/ORD002/timeline',
    },
    {
        id: 'ORD003',
        workerName: 'ليلى خالد',
        status: 'ملغى',
        company: 'فنون يدوية',
        timelineUrl: '/orders/ORD003/timeline',
    },
];

export default function MyOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter orders based on search query
    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Animation variants for table
    const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900">طلباتي</h1>
                    <p className="mt-2 text-gray-600">تابع وإدارة مشترياتك اليدوية</p>
                </motion.div>

                {/* Search Bar */}
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

                {/* Orders Table */}
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
                                {filteredOrders.length === 0 ? (
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
                                    filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.workerName}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.status === 'تم التوصيل'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'قيد المعالجة'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.company}</td>
                                            <td className="px-6 py-4">
                                                <Link href={order.timelineUrl}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                                    >
                                                        <ArrowLeftCircle size={16} />
                                                        عرض التايم لاين
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