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

        // جلب CustomTimeline لكل طلب بناءً على بلد المكتب
        const ordersWithTimeline = await Promise.all(
            findClient.map(async (order) => {
                let customTimeline = null;
                
                // التحقق من وجود مكتب وبلد للمكتب
                if (order.HomeMaid?.office?.Country) {
                    const officeCountry = order.HomeMaid.office.Country;
                    
                    // البحث عن CustomTimeline المطابق لبلد المكتب
                    const timeline = await prisma.customTimeline.findUnique({
                        where: { 
                            country: officeCountry
                        }
                    });
                    
                    // التحقق من أن Timeline نشط
                    if (timeline && timeline.isActive) {
                        customTimeline = timeline;
                    }
                }
                
                return {
                    ...order,
                    customTimeline: customTimeline
                };
            })
        );

        return NextResponse.json({
            orders: ordersWithTimeline,
            clientinfo: clientinfo
        }, { status: 200 });
        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 });
    }
}