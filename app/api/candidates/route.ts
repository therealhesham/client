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

  const pageSize = 12;
  const pageNumber = parseInt(page as string, 10) || 1;

  const filters: any = {};

  if (id)
    filters.id = {
      equals: Number(id),
    };
  if (Name) filters.Name = { contains: Name.toLowerCase(), mode: "insensitive" };
  if (age) filters.age = { equals: parseInt(age, 10) };
  if (Passportnumber)
    filters.Passportnumber = {
      contains: Passportnumber.toLowerCase(),
      mode: "insensitive",
    };
  if (Nationality)
    filters.Nationalitycopy = {
      contains: Nationality.toLowerCase(),
      mode: "insensitive",
    };

  try {
    // Fetch data with the filters and pagination
    const homemaids = await prisma.homemaid.findMany({
      where: { NewOrder: { every: { HomemaidId: null } }, ...filters },
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