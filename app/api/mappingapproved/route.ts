import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getWhereBase() {
    const blockingOrders = await prisma.neworder.findMany({
        where: {
            HomemaidId: { not: null },
            NOT: { bookingstatus: { in: ["cancelled", "rejected"] } }
        },
        select: { HomemaidId: true }
    });
    const blockedIds = blockingOrders
        .map((o) => o.HomemaidId)
        .filter((id): id is number => id !== null);

    return {
        isApproved: true,
        id: { notIn: blockedIds }
    };
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const position = searchParams.get("position"); // next | previous
    const whereBase = await getWhereBase();

    let maid = null;

    if (position === "next") {
        maid = await prisma.homemaid.findFirst({
            where: {
                isApproved: true,
                id: { gt: id, notIn: whereBase.id.notIn }
            },
            orderBy: { id: "asc" }
        });
    }

    if (position === "previous") {
        maid = await prisma.homemaid.findFirst({
            where: {
                isApproved: true,
                id: { lt: id, notIn: whereBase.id.notIn }
            },
            orderBy: { id: "desc" }
        });
    }

    if (maid) {
        const nextCount = await prisma.homemaid.count({
            where: {
                isApproved: true,
                id: { gt: maid.id, notIn: whereBase.id.notIn }
            }
        });
        const prevCount = await prisma.homemaid.count({
            where: {
                isApproved: true,
                id: { lt: maid.id, notIn: whereBase.id.notIn }
            }
        });

        // @ts-ignore
        maid.hasNext = nextCount > 0;
        // @ts-ignore
        maid.hasPrev = prevCount > 0;
    }

    return NextResponse.json(maid);
}
