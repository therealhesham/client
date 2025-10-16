import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NodeNextResponse } from 'next/dist/server/base-http/node';
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken"

import { cookies, headers } from 'next/headers';
const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        //   const cookieStore = await cookies()
        //   const tokenGetter = cookieStore.get("token")
        // console.log(request.query)
        const { id } = await params;
        const findClient = await prisma.neworder.findMany({ where: { client: {phonenumber: id as string}}, include: { arrivals: {select:{id:true}}, HomeMaid: { include: { office: true } }, client: true } })
const clientinfo = await prisma.client.findUnique({ where: { phonenumber: id as string } })
console.log(clientinfo?.fullname)
return NextResponse.json({
    orders: findClient,
    clientinfo: clientinfo
  }, { status: 201 });
  
    } catch (error) {
        console.log(error)
        // return NextResponse.redirect(new URL("/login", request.url));

    }
}