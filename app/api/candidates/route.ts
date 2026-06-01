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
  if (Nationality) {
    const matchingOffices = await prisma.offices.findMany({
      where: { Country: { contains: Nationality.toLowerCase() } },
      select: { id: true },
    });
    filters.officeID = { in: matchingOffices.map((o) => o.id) };
  }

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
    // لا توجد علاقة (relation) بين homemaid و neworder في الـ schema،
    // لذلك نحسب يدويًا العاملات اللاتي لديهن طلب "نشط" (مرتبط وغير ملغى/مرفوض)
    // ثم نستبعدهن. الباقي = ليس لها طلب أو جميع طلباتها ملغاة/مرفوضة.
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

    const baseWhere = {
      isApproved: true,
      id: { notIn: blockedIds }
    };

    // أولًا: احسب العدد الكلي لجميع العاملات (قبل الفلترة)
    const totalCount = await prisma.homemaid.count({
      where: baseWhere,
    });

    // احسب عدد النتائج بعد الفلترة (للعرض في الرسالة)
    const filteredCount = await prisma.homemaid.count({
      where: {
        AND: [baseWhere, filters]
      },
    });
    // ثانيًا: جلب النتائج بعد الفلترة
    const homemaidsRaw = await prisma.homemaid.findMany({
      orderBy: { displayOrder: "asc" },
      where: {
        AND: [baseWhere, filters]
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // لا توجد علاقة profession في موديل homemaid، لذلك نجلب المهن يدويًا عبر professionId
    const professionIds = Array.from(new Set(
      homemaidsRaw.map((m) => m.professionId).filter((v): v is number => v != null)
    ));
    const professions = professionIds.length > 0
      ? await prisma.professions.findMany({ where: { id: { in: professionIds } } })
      : [];
    const professionMap = new Map(professions.map((p) => [p.id, p]));

    const homemaids = homemaidsRaw.map((maid) => ({
      ...maid,
      profession: maid.professionId ? professionMap.get(maid.professionId) ?? null : null,
    }));

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