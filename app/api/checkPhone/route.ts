// app/api/homemaid/newemployer/route.js
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken"
import { headers } from 'next/headers';
const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
        // console.log(await req.json())


        const {
            phone,
         

        } = await req.json();
        // Validate required fields, or handle with default/fallback values
        // const header = await headers();

        // const token = header.get("authorization")?.split(' ')[1];
        // const verify = jwt.decode(token)
        // console.log(verify.office)
        // Insert into the database
        const newHomemaid = await prisma.client.findUnique({where:{phonenumber:phone}})

        return new Response(JSON.stringify(newHomemaid), { status: 201 });
    } catch (error) {
        console.error('Error creating new homemaid:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
        });
    }
}
