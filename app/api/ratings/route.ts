import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idOrder, isRated, reason, stars } = body;
        
        if (!idOrder) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const newRating = await prisma.rating.create({
            data: {
                idOrder: Number(idOrder),
                isRated: isRated !== undefined ? Boolean(isRated) : false,
                reason: reason || null,
                stars: stars ? Number(stars) : null,
            },
        });

        return NextResponse.json(newRating, { status: 201 });
    } catch (error) {
        console.error('Error in ratings API:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
