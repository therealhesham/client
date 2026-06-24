import { PrismaClient } from '@prisma/client';
import { createHrDocTransporter, getSmtpFromAddress } from '../../lib/smtp';

const prisma = new PrismaClient();

function normalizePhone(phone: string) {
    const trimmed = phone.trim();
    if (trimmed.startsWith('0')) return trimmed;
    if (trimmed.startsWith('5')) return `0${trimmed}`;
    return trimmed;
}

export async function POST(req: Request) {
    try {
        const {
            phone_number,
            fullName,
            homemaidId,
            residence,
            email,
        } = await req.json();

        if (!phone_number || !fullName || !homemaidId || !email) {
            return new Response(JSON.stringify({ error: 'البيانات ناقصة' }), { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(email).trim())) {
            return new Response(JSON.stringify({ error: 'البريد الإلكتروني غير صحيح' }), { status: 400 });
        }

        const normalizedPhone = normalizePhone(String(phone_number));
        const normalizedEmail = String(email).trim().toLowerCase();

        const existingEmailClient = await prisma.client.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingEmailClient && existingEmailClient.phonenumber !== normalizedPhone) {
            return new Response(
                JSON.stringify({ error: 'البريد الإلكتروني مستخدم لعميل آخر' }),
                { status: 409 }
            );
        }

        const client = await prisma.client.upsert({
            where: { phonenumber: normalizedPhone },
            update: {
                fullname: fullName,
                city: residence,
                email: normalizedEmail,
            },
            create: {
                phonenumber: normalizedPhone,
                fullname: fullName,
                city: residence,
                email: normalizedEmail,
            },
        });

        const newHomemaid = await prisma.neworder.create({
            data: {
                typeOfContract: 'recruitment',
                bookingstatus: 'new_order',
                HomemaidId: Number(homemaidId),
                clientID: client.id,
                clientphonenumber: normalizedPhone,
                ClientName: fullName,
            },
        });

        try {
            await prisma.notifications.create({
                data: {
                    id: crypto.randomUUID(),
                    title: ' تم حجز عاملة جديدة من الموقع الالكتروني',
                    message: `تم حجز عاملة بواسطة ${fullName}`,
                },
            });

            const staff = await prisma.user.findMany({
                where: {
                    AND: [
                        { email: { not: null } },
                        { email: { not: '' } },
                    ],
                },
                select: { email: true },
            });
            const toList = staff
                .map((u: { email: string | null }) => u.email)
                .filter((e: string | null): e is string => Boolean(e));
            if (toList.length > 0) {
                const transporter = createHrDocTransporter();
                const subject = 'تم حجز عاملة جديدة من الموقع الإلكتروني';
                const text = `تم حجز عاملة جديدة.\nالعميل: ${fullName}\nالجوال: ${normalizedPhone}\nالبريد: ${normalizedEmail}\nالمدينة: ${residence ?? ''}`;
                await transporter.sendMail({
                    from: getSmtpFromAddress(),
                    to: toList.join(','),
                    subject,
                    text,
                });
            }
        } catch (error) {
            console.log(error);
        }

        return new Response(JSON.stringify(newHomemaid), { status: 201 });
    } catch (error) {
        console.error('Error creating new homemaid:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
        });
    }
}
