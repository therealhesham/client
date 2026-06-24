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
  const maritalStatus = url.searchParams.get("maritalStatus");
  const minAge = url.searchParams.get("minAge");
  const maxAge = url.searchParams.get("maxAge");
  const educationLevel = url.searchParams.get("educationLevel");
  const experienceLevel = url.searchParams.get("experienceLevel");
  const arabicLanguage = url.searchParams.get("arabicLanguage");
  const englishLanguage = url.searchParams.get("englishLanguage");
  const salary = url.searchParams.get("salary");
  const heightRange = url.searchParams.get("heightRange");
  const weightRange = url.searchParams.get("weightRange");
  const skill_مهارة_الغسيل = url.searchParams.get("skill_مهارة الغسيل");
  const skill_مهارة_الطبخ = url.searchParams.get("skill_مهارة الطبخ");
  const skill_مهارة_الكوي = url.searchParams.get("skill_مهارة الكوي");
  const skill_مهارة_التنظيف = url.searchParams.get("skill_مهارة التنظيف");
  const skill_مهارة_العناية_بالاطفال = url.searchParams.get("skill_مهارة العناية بالاطفال");
  const skill_مهارة_رعاية_كبار_السن = url.searchParams.get("skill_مهارة رعاية كبار السن");

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
    filters.Nationalitycopy = { contains: Nationality };
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

  if (maritalStatus) filters.maritalstatus = { contains: maritalStatus };
  
  if (minAge || maxAge) {
    const today = new Date();
    const dateFilter: any = {};
    if (minAge) {
      const minAgeNum = parseInt(minAge, 10);
      const maxDate = new Date(today.getFullYear() - minAgeNum, today.getMonth(), today.getDate());
      dateFilter.lte = maxDate;
    }
    if (maxAge) {
      const maxAgeNum = parseInt(maxAge, 10);
      const minDate = new Date(today.getFullYear() - maxAgeNum, today.getMonth(), today.getDate());
      dateFilter.gte = minDate;
    }
    filters.dateofbirth = { ...filters.dateofbirth, ...dateFilter };
  }

  if (educationLevel) filters.Education = { contains: educationLevel };

  if (experienceLevel) {
    if (experienceLevel === "novice") filters.Experience = { contains: "بدون خبرة" };
    else if (experienceLevel === "intermediate") filters.Experience = { contains: "متوسطة" };
    else if (experienceLevel === "experienced") filters.Experience = { contains: "جيدة" };
    else if (experienceLevel === "expert") filters.Experience = { contains: "ممتازة" };
  }

  const langMapping: Record<string, string> = {
    "لا تجيد": "لا تجيد",
    "مبتدئ": "مبتدأ",
    "جيد": "جيد",
    "جيد جدًا": "جيد جداً",
    "ممتاز": "ممتاز"
  };

  if (arabicLanguage && langMapping[arabicLanguage]) {
    filters.ArabicLanguageLevel = { contains: langMapping[arabicLanguage] };
  }

  if (englishLanguage && langMapping[englishLanguage]) {
    filters.EnglishLanguageLevel = { contains: langMapping[englishLanguage] };
  }

  if (salary) filters.Salary = { contains: salary };

  if (heightRange) {
    if (heightRange === "170+") filters.height = { gte: 170 };
    else {
      const [min, max] = heightRange.split("-").map(Number);
      filters.height = { gte: min, lte: max };
    }
  }

  if (weightRange) {
    if (weightRange === "70+") filters.weight = { gte: 70 };
    else {
      const [min, max] = weightRange.split("-").map(Number);
      filters.weight = { gte: min, lte: max };
    }
  }

  const skillMapping: Record<string, string> = {
    "مبتدئ": "مبتدأ",
    "جيد": "جيد",
    "جيد جدًا": "جيد جداً",
    "ممتاز": "ممتاز"
  };

  if (skill_مهارة_الغسيل && skillMapping[skill_مهارة_الغسيل]) filters.LaundryLevel = { contains: skillMapping[skill_مهارة_الغسيل] };
  if (skill_مهارة_الطبخ && skillMapping[skill_مهارة_الطبخ]) filters.CookingLevel = { contains: skillMapping[skill_مهارة_الطبخ] };
  if (skill_مهارة_الكوي && skillMapping[skill_مهارة_الكوي]) filters.IroningLevel = { contains: skillMapping[skill_مهارة_الكوي] };
  if (skill_مهارة_التنظيف && skillMapping[skill_مهارة_التنظيف]) filters.CleaningLevel = { contains: skillMapping[skill_مهارة_التنظيف] };
  if (skill_مهارة_العناية_بالاطفال && skillMapping[skill_مهارة_العناية_بالاطفال]) filters.BabySitterLevel = { contains: skillMapping[skill_مهارة_العناية_بالاطفال] };
  if (skill_مهارة_رعاية_كبار_السن && skillMapping[skill_مهارة_رعاية_كبار_السن]) filters.elderlycareLevel = { contains: skillMapping[skill_مهارة_رعاية_كبار_السن] };
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