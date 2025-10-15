import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function generateRandomBirthDate(): Date {
  const start = new Date(1985, 0, 1);
  const end = new Date(2005, 11, 31);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(randomTime);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// دالة للتحقق من صحة نص التاريخ
function isValidDateString(dateStr: string | null): boolean {
  if (!dateStr) return false;
  
  // نمط التاريخ الصالح (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) return false;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // التحقق من أن القيم صالحة
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // التحقق من أن التاريخ موجود فعلاً (مثل 31 فبراير غير صالح)
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export async function GET(request: NextRequest) {
  try {
    // استعلام خام لجلب البيانات كنصوص لتجنب مشاكل التحويل
    const sql = Prisma.sql`
      SELECT 
        id,
        CAST(dateofbirth AS CHAR) as dateofbirth
      FROM homemaid
    `;
    
    const rawRecords = await prisma.$queryRaw<Array<{ id: number; dateofbirth: string | null }>>(sql);
    
    // تصفية السجلات التالفة
    const damagedRecords = rawRecords.filter(record => 
      !isValidDateString(record.dateofbirth)
    );

    if (damagedRecords.length === 0) {
      return NextResponse.json(
        { message: "لا توجد سجلات تالفة" },
        { status: 200 }
      );
    }

    console.log(`وجدت ${damagedRecords.length} سجل يحتاج إصلاح`);

    let fixedCount = 0;

    for (const record of damagedRecords) {
      try {
        if (!record?.id) {
          console.warn("سجل بدون ID تم تجاهله");
          continue;
        }

        const newDate = generateRandomBirthDate();
        
        // تحويل التاريخ إلى نص بتنسيق YYYY-MM-DD
        const formattedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
        
        // تحديث السجل باستخدام استعلام خام
        await prisma.$executeRaw`
          UPDATE homemaid 
          SET dateofbirth = ${formattedDate}
          WHERE id = ${record.id}
        `;

        console.log(`تم تحديث السجل ${record.id} إلى ${formattedDate}`);
        fixedCount++;
      } catch (updateError) {
        console.error(`فشل تحديث السجل ${record.id}:`, updateError);
      }
    }

    return NextResponse.json({
      message: `تم إصلاح ${fixedCount} من أصل ${damagedRecords.length} سجل بنجاح`,
    });
  } catch (error) {
    console.error("Error fixing dateofbirth:", error);
    return NextResponse.json(
      { error: "فشل في إصلاح التواريخ" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}