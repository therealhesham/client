import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const findClient = await prisma.neworder.findMany({
            where: { 
                client: { phonenumber: id as string } 
            },
            include: { 
                // 1. جلب جدول الوصول عشان ناخد منه ticketFile
                arrivals: true, 
                
                HomeMaid: { 
                    include: { office: true } 
                }, 
                
                // 2. تعديل جلب العميل ليشمل جدول الفيزا المرتبط به
                client: {
                    include: {
                        visa: true // <-- ضروري جداً عشان نوصل لـ visaFile
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const clientinfo = await prisma.client.findUnique({ 
            where: { phonenumber: id as string } 
        });

        return NextResponse.json({
            orders: findClient,
            clientinfo: clientinfo
        }, { status: 200 });
        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 });
    }
}