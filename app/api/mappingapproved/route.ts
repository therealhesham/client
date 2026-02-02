import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const position = searchParams.get("position"); // next | previous
    const whereBase = {
        isApproved: true,
        NewOrder: {
            every: {
                OR: [
                    { HomemaidId: null },
                    { bookingstatus: { in: ["cancelled", "rejected"] } }
                ]
            }
        }
    };

    let maid = null;

    if (position === "next") {
        maid = await prisma.homemaid.findFirst({
            where: {
                ...whereBase,
                id: { gt: id }
            },
            orderBy: { id: "asc" }
        });
    }

    if (position === "previous") {
        maid = await prisma.homemaid.findFirst({
            where: {
                ...whereBase,
                id: { lt: id }
            },
            orderBy: { id: "desc" }
        });
    }

    if (maid) {
        const nextCount = await prisma.homemaid.count({
            where: {
                ...whereBase,
                id: { gt: maid.id }
            }
        });
        const prevCount = await prisma.homemaid.count({
            where: {
                ...whereBase,
                id: { lt: maid.id }
            }
        });

        // @ts-ignore
        maid.hasNext = nextCount > 0;
        // @ts-ignore
        maid.hasPrev = prevCount > 0;
    }

    return NextResponse.json(maid);
}
