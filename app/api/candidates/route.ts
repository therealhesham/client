import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const Name = url.searchParams.get("Name");
  const age = url.searchParams.get("age");
  const Passportnumber = url.searchParams.get("Passportnumber");
  const id = url.searchParams.get("id");
  const Nationality = url.searchParams.get("Nationality");
  const page = url.searchParams.get("page");
  const Religion = url.searchParams.get("religion");

  const pageSize = 12;
  const pageNumber = parseInt(page as string, 10) || 1;

  const filters: any = {};

  if (id)
    filters.id = {
      equals: Number(id),
    };
  if (Name) filters.Name = { contains: Name.toLowerCase() };
  if (age) filters.age = { equals: parseInt(age, 10) };
  if (Passportnumber)
    filters.Passportnumber = {
      contains: Passportnumber.toLowerCase(),
    };
    // {Country:{contains:}}
    if (Nationality)
      filters.office = {
        Country:{contains:Nationality?.toLowerCase()},
      };
  
  if (Religion) {
    if (Religion == "Islam - الإسلام")
      filters.Religion = {
        contains: "Islam - الإسلام",
      }

    else {
      filters.Religion = {
        not: { equals: "Islam - الإسلام" }
      }

    }
    ;
  }
  try {
    const homemaids = await prisma.homemaid.findMany({orderBy:{displayOrder: "asc"},
      where: { NewOrder: { every: { HomemaidId: null } },...filters},
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ homemaids }, { status: 200 });
  } catch (error) {
    console.error("Error fetching homemaids:", error);
    return NextResponse.json(
      { error: "Failed to fetch homemaids" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}