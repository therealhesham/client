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

        // Prepare credentials for MSEGAT
        const apiKey = process.env.MSEGAT_API_KEY || process.env.SMS_PASS;
        const userName = process.env.MSEGAT_USERNAME || process.env.SMS_USER;
        const userSender = process.env.MSEGAT_SENDER_NAME || process.env.SMS_SENDER;

        if (!apiKey || !userName || !userSender) {
            return new Response(JSON.stringify({ error: 'بيانات الاعتماد لخدمة الرسائل غير مكتملة' }), { status: 500 });
        }

        // Clean phone number (MSEGAT requires international format without zeros)
        let cleanPhone = phone.trim().replace(/[\s\-\+\(\)]/g, '');
        if (cleanPhone.startsWith('00966')) {
            cleanPhone = cleanPhone.substring(2);
        } else if (cleanPhone.startsWith('05')) {
            cleanPhone = '966' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('5')) {
            cleanPhone = '966' + cleanPhone;
        } else if (!cleanPhone.startsWith('966')) {
            cleanPhone = '966' + cleanPhone;
        // Send OTP via MSEGAT
        const msegatRes = await fetch('https://www.msegat.com/gw/sendOTPCode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                lang: 'Ar',
                userName: userName,
                userSender: userSender,
                number: cleanPhone
            })
        });

        const msegatData = await msegatRes.json();

        // MSEGAT returns code: "1" on success
        if (msegatData.code === "1" || String(msegatData.code) === "1") {
            // Save MSEGAT id in global store (5 mins expiry) with attempts counter
            globalAny.otpStore.set(phone, { id: msegatData.id, expires: Date.now() + 5 * 60 * 1000, attempts: 0 });
            return new Response(JSON.stringify({ success: true, message: 'تم إرسال رمز التحقق بنجاح' }), { status: 200 });
        } else {
            console.error('MSEGAT Send Error:', msegatData);
            return new Response(JSON.stringify({ error: 'فشل إرسال رمز التحقق من مزود الخدمة' }), { status: 500 });
        }

    } catch (error) {
        console.error('Error sending OTP:', error);
        return new Response(JSON.stringify({ error: 'خطأ في الخادم' }), { status: 500 });
    }
}
