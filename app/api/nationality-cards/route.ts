import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cards = await prisma.$queryRawUnsafe(`SELECT * FROM NationalityCard WHERE isActive = 1 ORDER BY sortOrder ASC`);
        return NextResponse.json(cards, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 });
    }
}
