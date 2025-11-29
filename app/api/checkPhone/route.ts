import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, phone } = await req.json();

        if (!email || !phone) {
            return new Response(JSON.stringify({ error: 'البيانات ناقصة' }), { status: 400 });
        }

        // البحث عن العميل الذي يطابق الايميل ورقم الجوال معاً
        // ملاحظة: تأكد أن phone المرسل يطابق الصيغة المخزنة في الداتا بيس
        const client = await prisma.client.findFirst({
            where: {
                email: email,
                phonenumber: phone 
            }
        });

        if (client) {
            return new Response(JSON.stringify({ exists: true, clientId: client.id }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ exists: false }), { status: 404 });
        }

    } catch (error) {
        console.error('Error checking client:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}