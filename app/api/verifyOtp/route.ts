import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: 'البيانات ناقصة' }, { status: 400 });
        }

        const globalAny: any = global;
        const securityRecord = globalAny.securityStore?.get(phone);
        const now = Date.now();

        if (securityRecord && securityRecord.blockUntil && now < securityRecord.blockUntil) {
            const minutesLeft = Math.ceil((securityRecord.blockUntil - now) / 60000);
            return NextResponse.json({ error: `تم حظر الرقم مؤقتاً. يرجى المحاولة بعد ${minutesLeft} دقيقة.` }, { status: 403 });
        }

        const record = globalAny.otpStore?.get(phone);

        if (!record) {
            return NextResponse.json({ error: 'لم يتم العثور على رمز تحقق، يرجى طلب رمز جديد' }, { status: 400 });
        }

        if (now > record.expires) {
            globalAny.otpStore.delete(phone);
            return NextResponse.json({ error: 'رمز التحقق منتهي الصلاحية' }, { status: 400 });
        }

        if (record.otp === otp) {
            globalAny.otpStore.delete(phone);
            if (securityRecord) {
                globalAny.securityStore.delete(phone); // Reset all counters upon success
            }
            
            // إنشاء توكن الجلسة
            const secret = process.env.JWT_SECRET || 'default_secret_fallback';
            const token = jwt.sign({ phone }, secret, { expiresIn: '7d' });
            
            const response = NextResponse.json({ success: true }, { status: 200 });
            response.cookies.set('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });
            
            return response;
        } else {
            // Failed attempt
            record.attempts = (record.attempts || 0) + 1;
            
            if (record.attempts >= 5) {
                globalAny.otpStore.delete(phone);

                if (securityRecord) {
                    securityRecord.failedCycles += 1;
                    if (securityRecord.failedCycles >= 3) {
                        securityRecord.blockUntil = now + 15 * 60 * 1000;
                    }
                    globalAny.securityStore.set(phone, securityRecord);
                }

                return NextResponse.json({ error: 'تجاوزت 5 محاولات خاطئة لهذا الرمز. يرجى طلب رمز جديد.' }, { status: 400 });
            }

            globalAny.otpStore.set(phone, record);
            const remaining = 5 - record.attempts;
            return NextResponse.json({ error: `رمز التحقق غير صحيح. لديك ${remaining} محاولات متبقية.` }, { status: 400 });
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
    }
}
