import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // الجوال قد يُخزَّن بصفر بادئ (مثل 0555544961) بينما يصل الرقم هنا
        // بدون صفر (555544961)، لذلك نجرّب الصيغتين عند المطابقة
        const rawId = id as string;
        const phoneCandidates = Array.from(new Set([
            rawId,
            rawId.startsWith('0') ? rawId.slice(1) : `0${rawId}`
        ]));

        // جلب بيانات العميل أولًا للحصول على معرّفه (clientID)
        const clientinfo = await prisma.client.findFirst({
            where: { phonenumber: { in: phoneCandidates } }
        });

        // مطابقة الطلبات برقم الجوال أو بمعرّف العميل
        const orderFilters: any[] = [
            { clientphonenumber: { in: phoneCandidates } },
            { PhoneNumber: { in: phoneCandidates } }
        ];
        if (clientinfo?.id) {
            orderFilters.push({ clientID: clientinfo.id });
        }

        const findClient = await prisma.neworder.findMany({
            where: { OR: orderFilters },
            include: {
                arrivals: true,
                visa: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // جلب الطلبات المرفوضة والملغاة من جداولها الخاصة المرتبطة بمعرّف العميل
        let rejected: any[] = [];
        let cancelled: any[] = [];
        if (clientinfo?.id) {
            [rejected, cancelled] = await Promise.all([
                prisma.rejectedOrders.findMany({
                    where: { clientId: clientinfo.id },
                    include: { neworder: { include: { arrivals: true, visa: true } } }
                }),
                prisma.cancelledOrders.findMany({
                    where: { clientId: clientinfo.id },
                    include: { neworder: { include: { arrivals: true, visa: true } } }
                })
            ]);
        }

        // تجميع كل معرّفات العاملات المطلوبة (من الطلبات النشطة والمرفوضة والملغاة)
        const homemaidIds = Array.from(new Set([
            ...findClient.map((o) => o.HomemaidId),
            ...rejected.map((r) => r.HomeMaidId),
            ...rejected.map((r) => r.neworder?.HomemaidId),
            ...cancelled.map((c) => c.HomeMaidId),
            ...cancelled.map((c) => c.neworder?.HomemaidId)
        ].filter((v): v is number => v != null)));

        const homemaids = homemaidIds.length > 0
            ? await prisma.homemaid.findMany({ where: { id: { in: homemaidIds } } })
            : [];

        // لا توجد علاقة office في موديل homemaid، لذلك نجلب المكاتب يدويًا عبر officeID
        const officeIds = Array.from(new Set(
            homemaids.map((m) => m.officeID).filter((v): v is number => v != null)
        ));
        const offices = officeIds.length > 0
            ? await prisma.offices.findMany({ where: { id: { in: officeIds } } })
            : [];
        const officeMap = new Map(offices.map((o) => [o.id, o]));

        // ربط كل عاملة بمكتبها
        const homemaidMap = new Map(
            homemaids.map((m) => [
                m.id,
                { ...m, office: m.officeID ? officeMap.get(m.officeID) ?? null : null }
            ])
        );

        // جلب الـ CustomTimeline المرتبط بمكتب العاملة عبر officeId (إن وُجد ونشط)
        const getTimeline = async (homeMaid: any) => {
            if (homeMaid?.officeID) {
                const timeline = await prisma.customTimeline.findUnique({
                    where: { officeId: homeMaid.officeID }
                });
                if (timeline && timeline.isActive) return timeline;
            }
            return null;
        };

        const ordersWithTimeline = await Promise.all(
            findClient.map(async (order) => {
                const homeMaid = order.HomemaidId ? homemaidMap.get(order.HomemaidId) ?? null : null;
                const customTimeline = await getTimeline(homeMaid);
                return {
                    ...order,
                    HomeMaid: homeMaid,
                    client: { visa: order.visa ? [order.visa] : [] },
                    customTimeline
                };
            })
        );

        // دمج الطلبات في خريطة حسب معرّف الطلب لمنع التكرار
        const ordersMap = new Map<string | number, any>();
        for (const order of ordersWithTimeline) {
            ordersMap.set(order.id, order);
        }

        // بناء كائن الطلب من سجل مرفوض/ملغى بنفس الشكل المتوقع في الواجهة
        const buildHistoryOrder = (record: any, status: 'rejected' | 'cancelled') => {
            const baseOrder = record.neworder || {};
            const key = record.neworder?.id ?? `${status}-${record.id}`;
            const existing = ordersMap.get(key);
            const maidId = record.HomeMaidId ?? baseOrder.HomemaidId ?? null;
            const homeMaid = (maidId ? homemaidMap.get(maidId) ?? null : null) ?? existing?.HomeMaid ?? null;

            return {
                ...baseOrder,
                ...(existing || {}),
                id: key,
                bookingstatus: status,
                HomeMaid: homeMaid,
                arrivals: record.neworder?.arrivals ?? existing?.arrivals ?? [],
                client: {
                    visa: record.neworder?.visa ? [record.neworder.visa] : (existing?.client?.visa ?? [])
                },
                customTimeline: null,
                ReasonOfRejection: status === 'rejected' ? record.ReasonOfRejection : (baseOrder.ReasonOfRejection ?? null),
                ReasonOfCancellation: status === 'cancelled' ? record.ReasonOfCancellation : (baseOrder.ReasonOfCancellation ?? null),
                createdAt: baseOrder.createdAt ?? record.createdAt,
                statusDate: (status === 'rejected' ? record.RejectionDate : record.CancellationDate) ?? record.updatedAt
            };
        };

        for (const record of rejected) {
            const order = buildHistoryOrder(record, 'rejected');
            ordersMap.set(order.id, order);
        }
        for (const record of cancelled) {
            const order = buildHistoryOrder(record, 'cancelled');
            ordersMap.set(order.id, order);
        }

        // ترتيب تنازلي حسب تاريخ الإنشاء
        const allOrders = Array.from(ordersMap.values()).sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json({
            orders: allOrders,
            clientinfo: clientinfo
        }, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 });
    }
}
