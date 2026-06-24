import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

async function getUserOffice(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
      throw new Error('Invalid or missing token');
    }
    const decoded = jwt.verify(token.value, 'sss') as { office: string };
    return decoded.office;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

async function getBlockedHomemaidIds() {
  const blockingOrders = await prisma.neworder.findMany({
    where: {
      HomemaidId: { not: null },
      NOT: { bookingstatus: { in: ['cancelled', 'rejected'] } },
    },
    select: { HomemaidId: true },
  });
  return blockingOrders
    .map((o) => o.HomemaidId)
    .filter((id): id is number => id !== null);
}

async function enrichHomemaid(homemaid: Record<string, unknown>, homemaidId: number) {
  const [weeklyStatuses, office, newOrders, sessions, maidLogs, housedWorkers] =
    await Promise.all([
      prisma.weeklystatus.findMany({ where: { homeMaid_id: homemaidId } }),
      homemaid.officeID
        ? prisma.offices.findUnique({ where: { id: homemaid.officeID as number } })
        : null,
      prisma.neworder.findMany({
        where: {
          HomemaidId: homemaidId,
          NOT: { bookingstatus: { in: ['cancelled', 'rejected'] } },
        },
        select: { id: true, ClientName: true, bookingstatus: true },
      }),
      prisma.session.findMany({ where: { idnumber: homemaidId } }),
      prisma.logs.findMany({ where: { homemaidId } }),
      prisma.housedworker.findMany({ where: { homeMaid_id: homemaidId } }),
    ]);

  const housedWorkerIds = housedWorkers.map((h) => h.id);
  const checkIns =
    housedWorkerIds.length > 0
      ? await prisma.checkin.findMany({
          where: { housedWorkerId: { in: housedWorkerIds } },
        })
      : [];

  const checkInsByWorker = new Map<number, typeof checkIns>();
  for (const checkIn of checkIns) {
    if (checkIn.housedWorkerId == null) continue;
    const list = checkInsByWorker.get(checkIn.housedWorkerId) ?? [];
    list.push(checkIn);
    checkInsByWorker.set(checkIn.housedWorkerId, list);
  }

  const inHouse = housedWorkers.map((worker) => ({
    id: worker.id,
    houseentrydate: worker.houseentrydate,
    checkIns: checkInsByWorker.get(worker.id) ?? [],
  }));

  return {
    ...homemaid,
    weeklyStatusId: weeklyStatuses,
    office,
    NewOrder: newOrders,
    Session: sessions,
    logs: maidLogs,
    inHouse,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const homemaidId = parseInt(id, 10);

    const homemaid = await prisma.homemaid.findUnique({
      where: { id: homemaidId },
      include: { Client: true },
    });

    if (!homemaid) {
      return NextResponse.json({ error: 'Homemaid not found' }, { status: 404 });
    }

    const enriched = await enrichHomemaid(homemaid, homemaidId);

    const blockedIds = await getBlockedHomemaidIds();
    const whereBase = {
      isApproved: true,
      id: { notIn: blockedIds },
    };

    const [nextCount, prevCount] = await Promise.all([
      prisma.homemaid.count({
        where: { ...whereBase, id: { gt: homemaidId } },
      }),
      prisma.homemaid.count({
        where: { ...whereBase, id: { lt: homemaidId } },
      }),
    ]);

    return NextResponse.json(
      {
        ...enriched,
        hasNext: nextCount > 0,
        hasPrev: prevCount > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching homemaid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const homemaidId = parseInt(id, 10);

    const userOffice = await getUserOffice();
    if (!userOffice) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing authentication' },
        { status: 401 }
      );
    }

    const existing = await prisma.homemaid.findUnique({
      where: { id: homemaidId },
      select: { OfficeName: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Homemaid not found' }, { status: 404 });
    }

    if (!existing.OfficeName || existing.OfficeName !== userOffice) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this homemaid' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      officeID,
      Nationalitycopy,
      Name,
      Religion,
      Passportnumber,
      clientphonenumber,
      Picture,
      ExperienceYears,
      maritalstatus,
      Experience,
      dateofbirth,
      Nationality,
      age,
      flag,
      phone,
      bookingstatus,
      ages,
      officeName,
      experienceType,
      PassportStart,
      PassportEnd,
      ArabicLanguageLeveL,
      EnglishLanguageLevel,
      Salary,
      laundryLevel,
      ironingLevel,
      cleaningLevel,
      cookingLevel,
      sewingLevel,
      childcareLevel,
      Education,
    } = body;

    const updatedHomemaid = await prisma.homemaid.update({
      where: { id: homemaidId },
      data: {
        officeID,
        Nationalitycopy,
        Name,
        Religion,
        Passportnumber,
        clientphonenumber,
        Picture,
        ExperienceYears,
        maritalstatus,
        Experience,
        dateofbirth,
        Nationality,
        age,
        flag,
        phone,
        bookingstatus,
        ages,
        OfficeName: officeName,
        experienceType,
        PassportStart,
        PassportEnd,
        ArabicLanguageLevel: ArabicLanguageLeveL,
        EnglishLanguageLevel,
        Salary,
        LaundryLevel: laundryLevel,
        IroningLevel: ironingLevel,
        CleaningLevel: cleaningLevel,
        CookingLevel: cookingLevel,
        SewingLevel: sewingLevel,
        childcareLevel,
        Education,
      },
      include: { Client: true },
    });

    const enriched = await enrichHomemaid(updatedHomemaid, homemaidId);
    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    console.error('Error updating homemaid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
