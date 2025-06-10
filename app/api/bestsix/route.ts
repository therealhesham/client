//@ts-ignore
//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

const prisma = new PrismaClient();

export async function GET(Request, Response) {
    const data = await prisma.homemaid.findMany({ where: { Religion: { contains: "Islam - الإسلام" }, CookingLeveL: { contains: "ممتاز" }, CleaningLeveL: { contains: "متاز" }, dateofbirth: { contains: "20" } }, take: 8 })
    return NextResponse.json({ data })
}