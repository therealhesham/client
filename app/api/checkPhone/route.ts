import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return new Response(JSON.stringify({ error: 'رقم الجوال مطلوب' }), { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { phonenumber: phone },
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