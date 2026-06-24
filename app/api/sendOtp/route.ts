import { PrismaClient } from '@prisma/client';
import { sendSMS } from '../../../lib/sms';

const prisma = new PrismaClient();
const globalAny: any = global;

if (!globalAny.otpStore) {
    globalAny.otpStore = new Map();
}

if (!globalAny.securityStore) {
    globalAny.securityStore = new Map();
}

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return new Response(JSON.stringify({ error: 'رقم الجوال مطلوب' }), { status: 400 });
        }

        const securityRecord = globalAny.securityStore.get(phone) || {
            requestCount: 0,
            lastRequestTime: 0,
            failedCycles: 0,
            blockUntil: null
        };

        const now = Date.now();

        if (securityRecord.blockUntil && now < securityRecord.blockUntil) {
            const minutesLeft = Math.ceil((securityRecord.blockUntil - now) / 60000);
            return new Response(JSON.stringify({ error: `تم حظر الرقم مؤقتاً. يرجى المحاولة بعد ${minutesLeft} دقيقة.` }), { status: 403 });
        }

        // Reset block status if time passed
        if (securityRecord.blockUntil && now >= securityRecord.blockUntil) {
            securityRecord.blockUntil = null;
            securityRecord.requestCount = 0;
            securityRecord.failedCycles = 0;
        }

        // Check limits: 3 requests max or 3 failed cycles
        if (securityRecord.requestCount >= 3 || securityRecord.failedCycles >= 3) {
            securityRecord.blockUntil = now + 15 * 60 * 1000; // block for 15 mins
            securityRecord.requestCount = 0; // reset for next time after block
            securityRecord.failedCycles = 0;
            globalAny.securityStore.set(phone, securityRecord);
            return new Response(JSON.stringify({ error: `تجاوزت الحد الأقصى للمحاولات. تم حظر الرقم لمدة 15 دقيقة.` }), { status: 403 });
        }

        // Rate limit: 1 minute between SMS requests
        if (securityRecord.lastRequestTime > 0 && now - securityRecord.lastRequestTime < 60000) {
            return new Response(JSON.stringify({ error: 'يرجى الانتظار دقيقة قبل طلب رمز جديد' }), { status: 429 });
        }

        const possiblePhones = [phone];
        if (phone.startsWith('0')) {
            possiblePhones.push(phone.substring(1));
        } else {
            possiblePhones.push('0' + phone);
        }

        const client = await prisma.client.findFirst({
            where: {
                phonenumber: { in: possiblePhones }
            }
        });

        if (!client) {
            return new Response(JSON.stringify({ error: 'لم يتم العثور على طلبات مرتبطة برقم الجوال هذا' }), { status: 404 });
        }

        // Update security record
        securityRecord.requestCount += 1;
        securityRecord.lastRequestTime = now;
        globalAny.securityStore.set(phone, securityRecord);

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Save in global store (5 mins expiry) with attempts counter
        globalAny.otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000, attempts: 0 });

        // Send SMS
        const message = `رمز التحقق الخاص بك لتتبع الطلب هو: ${otp}`;
        const smsResult = await sendSMS(phone, message);

        if (!smsResult.success) {
            return new Response(JSON.stringify({ error: 'فشل إرسال رمز التحقق، يرجى المحاولة لاحقاً' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: 'تم إرسال رمز التحقق بنجاح' }), { status: 200 });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return new Response(JSON.stringify({ error: 'خطأ في الخادم' }), { status: 500 });
    }
}
