//@ts-nocheck
//@ts-ignore

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import {
    Phone,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    Clock,
    CheckCircle2,
    FileText,
    Plane,
    Home
} from 'lucide-react';
import NavigationBar from '../components/navigation';

const bodyFont = localFont({
    src: '/fonts/Almarai-Regular.ttf',
    weight: '500',
});

const displayFont = localFont({
    src: '../fonts/Tajawal-Bold.ttf',
    weight: '700',
});

const sanitizePhone = (value: string) =>
    value
        .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\s\-()]/g, '')
        .replace(/[^\d]/g, '');

const isValidSaudiPhone = (phone: string) => {
    const cleaned = sanitizePhone(phone);
    return /^(05\d{8}|5\d{8})$/.test(cleaned);
};

const normalizePhoneForLogin = (phone: string) => {
    const cleaned = sanitizePhone(phone);
    if (/^5\d{8}$/.test(cleaned)) return cleaned;
    if (/^05\d{8}$/.test(cleaned)) return cleaned.slice(1);
    return cleaned;
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

const highlights = [
    { icon: Clock, text: 'متابعة لحظية لمسار طلبك' },
    { icon: Sparkles, text: 'تجربة سلسة وواضحة' },
];

export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);

    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedPhone = localStorage.getItem('phone_number');
        if (storedPhone) {
            router.replace('/myorders/' + storedPhone);
        }
    }, [router]);
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setPhoneError('');

        const phoneOk = isValidSaudiPhone(phone);
        if (!phoneOk) {
            setPhoneError('يرجى إدخال رقم جوال صحيح');
            return;
        }

        setLoading(true);
        const actualPhoneNumber = normalizePhoneForLogin(phone);

        try {
            const res = await fetch('/api/sendOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: actualPhoneNumber })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(2);
            } else {
                setError(data.error || 'حدث خطأ غير متوقع');
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent, directOtp?: string) => {
        if (e) e.preventDefault();
        setError('');

        const otpToUse = directOtp || otp;
        if (!otpToUse || otpToUse.length < 4) {
            setError('الرجاء إدخال رمز التحقق بشكل صحيح');
            return;
        }

        setLoading(true);
        const actualPhoneNumber = normalizePhoneForLogin(phone);

        try {
            const res = await fetch('/api/verifyOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: actualPhoneNumber, otp: otpToUse })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('phone_number', actualPhoneNumber);
                localStorage.setItem('item', 'true');
                router.replace('/myorders/' + actualPhoneNumber);
            } else {
                setError(data.error || 'رمز التحقق غير صحيح');
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        'w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-[#003749] text-sm placeholder:text-gray-400 outline-none transition-all duration-200 shadow-sm focus:border-[#C49E6A] focus:ring-2 focus:ring-[#C49E6A]/20 focus:bg-white text-center tracking-widest font-bold';
    const inputError = 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-200/40';
    const labelClass = 'block text-sm font-bold text-[#C49E6A] mb-2';

    return (
        <div className={`min-h-screen bg-[#fafbfc] relative ${bodyFont.className}`} dir="rtl">
            {/* Mobile Decorative Background */}
            <div className="fixed lg:hidden bottom-0 left-0 w-full h-[45vh] pointer-events-none z-0">
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-[#002f3f] to-[#003749]"
                    style={{ clipPath: 'polygon(0 90%, 100% 35%, 100% 100%, 0 100%)' }}
                />
            </div>

            <NavigationBar />

            <div className="flex flex-col lg:flex-row min-h-screen pt-20">
                {/* Brand panel — desktop (يمين في RTL) */}
                <motion.aside
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative shrink-0"
                >
                    {/* طبقات الخلفية فقط — بدون قص المحتوى */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#001820] via-[#002530] to-[#001520]" />
                        <div
                            className="absolute inset-0 opacity-[0.35]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, rgba(236,195,131,0.18) 1px, transparent 0)',
                                backgroundSize: '28px 28px',
                            }}
                        />
                        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#ECC383]/10 blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#ECC383]/5 blur-3xl" />
                    </div>

                    <div className={`relative flex flex-col gap-10 p-12 xl:p-16 pb-14 w-full min-h-[calc(100vh-5rem)] ${displayFont.className}`}>
                        <div>
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ECC383]/15 to-transparent text-[#ECC383] text-base font-bold mb-8 border border-[#ECC383]/20 shadow-sm">
                                <Sparkles size={18} />
                                <span>روائس للاستقدام تتيح لك</span>
                            </div>

                            <h1 className="text-5xl xl:text-[3.5rem] font-bold text-white leading-[1.3] mb-6">
                                تتبع طلبك
                                <span className="block text-[#ECC383] mt-2">خطوة بخطوة</span>
                            </h1>
                            <p className="text-white/60 text-lg leading-relaxed max-w-md">
                                بوابة العملاء لتتبع الطلبات — أدخل بياناتك واطّلع على كل مرحلة من رحلة الاستقدام.
                            </p>
                        </div>

                        <ul className="space-y-5">
                            {highlights.map(({ icon: Icon, text }, i) => (
                                <motion.li
                                    key={text}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeUp}
                                    className="flex items-center gap-4 text-white/75"
                                >
                                    <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Icon size={17} className="text-[#ECC383]" strokeWidth={1.75} />
                                    </span>
                                    <span className="text-sm">{text}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="h-px w-24 bg-gradient-to-l from-[#ECC383]/60 to-transparent mt-auto" />
                    </div>
                </motion.aside>

                {/* Form panel */}
                <div className="flex-1 flex flex-col justify-start lg:justify-center items-center px-5 sm:px-8 pt-10 pb-20 lg:py-12 min-h-[calc(100vh-5rem)] relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-[420px]"
                    >
                        {/* Mobile Header & Tracking Illustration */}
                        <div className="lg:hidden flex flex-col items-center mb-8 w-full">
                            <div className="text-center mb-10 mt-4">
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ECC383]/20 to-transparent text-[#C49E6A] text-sm font-bold mb-4 border border-[#ECC383]/20">
                                    <Sparkles size={15} />
                                    <span>روائس للاستقدام تتيح لك</span>
                                </div>
                                <h1 className={`text-[2rem] leading-tight font-bold text-[#003749] ${displayFont.className}`}>
                                    تتبع طلبك <span className="text-[#C49E6A]">خطوة بخطوة</span>
                                </h1>
                            </div>

                            <div className="w-full max-w-[280px] mb-2">
                                <div className="relative flex items-center justify-between" dir="rtl">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-md border border-[#003749]/10 flex items-center justify-center z-10 text-[#003749] relative">
                                        <FileText size={18} strokeWidth={2} />
                                    </div>

                                    <div className="flex-1 h-px border-t-2 border-dashed border-[#C49E6A]/50 relative mx-2">
                                        <Plane
                                            className="absolute top-1/2 left-1/2 text-[#C49E6A]"
                                            style={{ transform: 'translate(-50%, -50%) rotate(-135deg)' }}
                                            size={16}
                                            strokeWidth={2.5}
                                        />
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-[#C49E6A] shadow-md shadow-[#C49E6A]/20 flex items-center justify-center z-10 text-white relative">
                                        <Home size={18} strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400" dir="rtl">
                                    <span className="text-center w-10">الطلب</span>
                                    <span className="text-center w-10 text-[#C49E6A]">الوصول</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block mb-10">
                            <h2 className={`text-3xl font-bold text-[#003749] mb-6 ${displayFont.className}`}>
                                تتبع طلبك <span className="text-[#C49E6A]">خطوة بخطوة</span>
                            </h2>

                            {/* Tracking Illustration Desktop */}
                            <div className="w-full max-w-[260px] mb-8">
                                <div className="relative flex items-center justify-between" dir="rtl">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-md border border-[#003749]/10 flex items-center justify-center z-10 text-[#003749] relative">
                                        <FileText size={20} strokeWidth={2} />
                                    </div>

                                    <div className="flex-1 h-px border-t-2 border-dashed border-[#C49E6A]/50 relative mx-3">
                                        <Plane
                                            className="absolute top-1/2 left-1/2 text-[#C49E6A]"
                                            style={{ transform: 'translate(-50%, -50%) rotate(-135deg)' }}
                                            size={18}
                                            strokeWidth={2.5}
                                        />
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-[#C49E6A] shadow-lg shadow-[#C49E6A]/20 flex items-center justify-center z-10 text-white relative">
                                        <Home size={20} strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3 text-[11px] font-bold text-gray-400" dir="rtl">
                                    <span className="text-center w-12">الطلب</span>
                                    <span className="text-center w-12 text-[#C49E6A]">الوصول</span>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed">
                                أدخل رقم الجوال المرتبط بحجزك ليتم إرسال رمز التحقق إليك
                            </p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                {/* Phone */}
                                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                                    <label htmlFor="phone" className={labelClass}>
                                        رقم جوال الحجز
                                    </label>
                                    <div
                                        className={`flex rounded-xl overflow-hidden bg-white border shadow-sm transition-all duration-200 focus-within:border-[#C49E6A] focus-within:ring-2 focus-within:ring-[#C49E6A]/20 ${phoneError ? 'border-red-400 ring-2 ring-red-200/40' : 'border-gray-200'}`}
                                        dir="ltr"
                                    >
                                        <span className="flex items-center gap-1.5 px-3.5 py-3.5 bg-gray-50 border-r border-gray-200 text-gray-500 text-sm font-semibold shrink-0 select-none">
                                            <Phone size={15} className="text-[#C49E6A]" strokeWidth={1.75} />
                                            +966
                                        </span>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(sanitizePhone(e.target.value).slice(0, 10));
                                                if (phoneError) setPhoneError('');
                                                if (error) setError('');
                                            }}
                                            placeholder="05xxxxxxxx"
                                            autoComplete="tel"
                                            className="flex-1 px-4 py-3.5 bg-transparent border-0 outline-none text-[#003749] text-sm placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    {phoneError && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
                                            <AlertCircle size={13} /> {phoneError}
                                        </p>
                                    )}
                                </motion.div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-start gap-2.5 py-3 text-red-500/90 text-sm border-r-2 border-red-300 pr-3">
                                                <AlertCircle size={16} className="shrink-0 mt-0.5" strokeWidth={1.75} />
                                                <span>{error}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full overflow-hidden rounded-2xl py-4 font-bold text-[#003749] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#C49E6A]/20 hover:shadow-xl hover:shadow-[#C49E6A]/30 active:scale-[0.99]"
                                        style={{
                                            background: 'linear-gradient(135deg, #ECC383 0%, #d4a96a 100%)',
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2.5">
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>جاري الإرسال</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>إرسال رمز التحقق</span>
                                                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                                    <label htmlFor="otp" className={labelClass}>
                                        رمز التحقق (OTP)
                                    </label>
                                    <div className="relative">
                                        <CheckCircle2
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C49E6A] pointer-events-none"
                                            strokeWidth={1.75}
                                        />
                                        <input
                                            type="text"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                setOtp(val);
                                                if (error) setError('');
                                                if (val.length === 4) {
                                                    handleVerifyOtp(undefined, val);
                                                }
                                            }}
                                            placeholder="XXXX"
                                            className={`${inputBase} ${error ? inputError : ''}`}
                                            required
                                            maxLength={4}
                                            dir="ltr"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5 text-center">أدخل الرمز المكون من 4 أرقام</p>
                                </motion.div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-start gap-2.5 py-3 text-red-500/90 text-sm border-r-2 border-red-300 pr-3">
                                                <AlertCircle size={16} className="shrink-0 mt-0.5" strokeWidth={1.75} />
                                                <span>{error}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full overflow-hidden rounded-2xl py-4 font-bold text-[#003749] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#C49E6A]/20 hover:shadow-xl hover:shadow-[#C49E6A]/30 active:scale-[0.99]"
                                        style={{
                                            background: 'linear-gradient(135deg, #ECC383 0%, #d4a96a 100%)',
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2.5">
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>جاري التحقق</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>دخول ومتابعة الطلبات</span>
                                                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </motion.div>

                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep(1);
                                            setOtp('');
                                            setError('');
                                        }}
                                        className="text-sm text-[#003749]/60 hover:text-[#C49E6A] font-medium transition-colors"
                                    >
                                        تغيير رقم الجوال؟
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 1 && (
                            <motion.div
                                custom={3}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                className="flex justify-center mt-10"
                            >
                                <div className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-xs text-[#003749] font-medium">
                                    ليس لديك طلب بعد؟{' '}
                                    <Link
                                        href="/candidates"
                                        className="text-[#C49E6A] font-bold hover:text-[#003749] transition-colors underline-offset-4 hover:underline"
                                    >
                                        استكشف المرشحات
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
