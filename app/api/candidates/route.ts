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

  if (age) {
    const ageNum = parseInt(age, 10);
    const today = new Date();

    if (ageNum === 20) {
      // العمر 20 - 29
      const minBirthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
      const maxBirthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      filters.dateofbirth = { gte: minBirthDate, lte: maxBirthDate };
    }
    else if (ageNum === 30) {
      // العمر 30 - 39
      const minBirthDate = new Date(today.getFullYear() - 40, today.getMonth(), today.getDate());
      const maxBirthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
      filters.dateofbirth = { gte: minBirthDate, lte: maxBirthDate };
    }
    else if (ageNum === 40) {
      // العمر 40 فما فوق
      const maxBirthDate = new Date(today.getFullYear() - 40, today.getMonth(), today.getDate());
      filters.dateofbirth = { lte: maxBirthDate };
    }
    else {
      // قيمة غير صحيحة
      return NextResponse.json({ homemaids: [] }, { status: 200 });
    }
  }

  if (Passportnumber)
    filters.Passportnumber = {
      contains: Passportnumber.toLowerCase(),
    };
  // {Country:{contains:}}
  if (Nationality)
    filters.office = {
      Country: { contains: Nationality?.toLowerCase() },
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
    // أولًا: احسب العدد الكلي لجميع العاملات (قبل الفلترة)
    // تظهر فقط إذا كانت جميع طلباتها ملغاة أو ليس لها طلبات
    // لا تظهر إذا كان لديها طلب نشط أو مرفوض
    const totalCount = await prisma.homemaid.count({
      where: {
        isApproved: true,
        NewOrder: {
          every: {
            OR: [
              { HomemaidId: null },
              { bookingstatus: { in: ["cancelled", "rejected"] } }
            ]
          }
        }
      },
    });

    // احسب عدد النتائج بعد الفلترة (للعرض في الرسالة)
    const filteredCount = await prisma.homemaid.count({
      where: {
        isApproved: true,
        NewOrder: {
          every: {
            OR: [
              { HomemaidId: null },
              { bookingstatus: { in: ["cancelled", "rejected"] } }
            ]
          }
        },
        ...filters
      },
    });
    // ثانيًا: جلب النتائج بعد الفلترة
    const homemaids = await prisma.homemaid.findMany({
      orderBy: { displayOrder: "asc" }, include: { profession: true },
      where: {
        isApproved: true,
        NewOrder: {
          every: {
            OR: [
              { HomemaidId: null },
              { bookingstatus: { in: ["cancelled", "rejected"] } }
            ]
          }
        },
        ...filters
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // ثالثًا: أعد إرسال البيانات + العدد الكلي
    return NextResponse.json(
      {
        homemaids,
        totalCount,
        filteredCount
      },
      { status: 200 }
    );
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