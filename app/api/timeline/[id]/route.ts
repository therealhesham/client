// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtDecode } from 'jwt-decode';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log('Order ID:', id);

  try {
    const order = await prisma.neworder.findUnique({
      where: { id: Number(id) },
      include: {
        client: {
          select: {
            fullname: true,
            phonenumber: true,
            email: true,
          },
        },
        HomeMaid: {
          select: {
            office: { select: { Country: true } },
            id: true,
            Name: true,
            Passportnumber: true,
            Religion: true,
            Nationalitycopy: true,
            officeName: true,
          },
        },
        arrivals: {
          select: {
            DateOfApplication: true,
            travelPermit: true,
            externalOfficeStatus: true,
            medicalCheckFile: true,
            approvalPayment: true,
            EmbassySealing: true,
            visaNumber: true,
            DeliveryDate: true,
            ticketFile: true,
            foreignLaborApproval: true,
            foreignLaborApprovalDate: true,
            additionalfiles: true,
            InternalmusanedContract: true,
            externalmusanedContract: true,
            office: true,
            deparatureCityCountry: true,
            deparatureCityCountryDate: true,
            deparatureCityCountryTime: true,
            arrivalSaudiAirport: true,
            KingdomentryDate: true,
            KingdomentryTime: true,
            receiptMethod: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order or arrival data not found' },
        { status: 404 }
      );
    }

    const orderData = {
      orderId: order.id,
      bookingStatus: order.bookingstatus,
      clientInfo: {
        name: order.client?.fullname || 'N/A',
        phone: order.client?.phonenumber || 'N/A',
        email: order.client?.email || 'N/A',
      },
      homemaidInfo: {
        name: order.HomeMaid?.Name || 'N/A',
        religion: order.HomeMaid?.Religion || 'N/A',
        passportNumber: order.HomeMaid?.Passportnumber || 'N/A',
        nationality: order.HomeMaid?.office?.Country || 'N/A',
        externalOffice: order.HomeMaid?.officeName || 'N/A',
      },
      applicationInfo: {
        applicationDate: order.createdAt?.toISOString().split('T')[0] || 'N/A',
        applicationTime:
          order.createdAt?.toISOString().split('T')[1]?.split('.')[0] || 'N/A',
      },
      officeLinkInfo: {
        nationalId: order.nationalId || 'N/A',
        visaNumber: order.arrivals[0]?.visaNumber || 'N/A',
        internalMusanedContract: order.arrivals[0]?.InternalmusanedContract || 'N/A',
        musanedDate: order.arrivals[0]?.DateOfApplication
          ? (order.arrivals[0].DateOfApplication as Date)
              .toISOString()
              .split('T')[0]
          : 'N/A',
      },
      externalOfficeInfo: {
        officeName: order.HomeMaid?.officeName || 'N/A',
        country: order.arrivals[0]?.office || 'N/A',
        externalMusanedContract: order.arrivals[0]?.externalmusanedContract || 'N/A',
      },
      externalOfficeApproval: {
        approved: order.arrivals[0]?.externalOfficeStatus === 'approved',
      },
      medicalCheck: {
        passed: !!order.arrivals[0]?.medicalCheckFile,
      },
      foreignLaborApproval: {
        approved: order.arrivals[0]?.externalOfficeStatus === 'approved',
      },
      agencyPayment: {
        paid: !!order.arrivals[0]?.approvalPayment,
      },
      saudiEmbassyApproval: {
        approved: !!order.arrivals[0]?.EmbassySealing,
      },
      visaIssuance: {
        issued: !!order.arrivals[0]?.visaNumber,
      },
      travelPermit: {
        issued: !!order.arrivals[0]?.travelPermit,
      },
      destinations: {
        departureCity: order.arrivals[0]?.deparatureCityCountry || 'N/A',
        arrivalCity: order.arrivals[0]?.arrivalSaudiAirport || 'N/A',
        arrivalSaudiAirport: order.arrivals[0]?.arrivalSaudiAirport || 'N/A',
        departureDateTime: order.arrivals[0]?.deparatureCityCountryDate
          ? `${(order.arrivals[0].deparatureCityCountryDate as Date)
              .toISOString()
              .split('T')[0]} ${order.arrivals[0].deparatureCityCountryTime || ''}`
          : 'N/A',
        arrivalDateTime: order.arrivals[0]?.KingdomentryDate
          ? `${(order.arrivals[0].KingdomentryDate as Date)
              .toISOString()
              .split('T')[0]} ${order.arrivals[0].KingdomentryTime || ''}`
          : 'N/A',
      },
      receipt: {
        received: !!order.arrivals[0]?.DeliveryDate,
        method: order.arrivals[0]?.receiptMethod || null,
      },
      ticketUpload: {
        files: order.arrivals[0]?.ticketFile || null,
      },
      nationality: order.HomeMaid?.office?.Country || 'N/A',
      documentUpload: {
        files: order.arrivals[0]?.additionalfiles || null,
      },
    };

    // Handle cookies and JWT
    const tokenString = request.cookies.get('authToken')?.value;
    if (tokenString) {
      const token = jwtDecode(tokenString) as any;
      // Emit event (replace with your event system)
      console.log('Emitted ACTION event for order:', order.id, 'userId:', token.id);
    }

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const body = await request.json();
    const { field, value, section, updatedData } = body;
    console.log('Request Body:', { field, value, section, updatedData });

    const order = await prisma.neworder.findUnique({
      where: { id: Number(id) },
      include: { arrivals: true },
    });

    if (!order || !order.arrivals || order.arrivals.length === 0) {
      return NextResponse.json(
        { error: 'Order or arrival data not found' },
        { status: 404 }
      );
    }

    // Handle status updates
    if (field) {
      const validFields = [
        'externalOfficeApproval',
        'medicalCheck',
        'foreignLaborApproval',
        'agencyPayment',
        'saudiEmbassyApproval',
        'visaIssuance',
        'travelPermit',
        'receipt',
        'bookingStatus',
      ];

      if (!validFields.includes(field)) {
        return NextResponse.json(
          { error: 'Invalid field' },
          { status: 400 }
        );
      }

      const updateData: any = {};
      const arrivalUpdate: any = {};

      switch (field) {
        case 'externalOfficeApproval':
          arrivalUpdate.externalOfficeStatus = value ? 'approved' : 'pending';
          updateData.bookingstatus = value
            ? 'external_office_approved'
            : 'pending_external_office';
          break;
        case 'medicalCheck':
          arrivalUpdate.medicalCheckFile = value ? 'passed' : null;
          updateData.bookingstatus = value
            ? 'medical_check_passed'
            : 'pending_medical_check';
          break;
        case 'foreignLaborApproval':
          arrivalUpdate.foreignLaborApproval = value ? true : false;
          arrivalUpdate.foreignLaborApprovalDate = value ? new Date() : null;
          updateData.bookingstatus = value
            ? 'foreign_labor_approved'
            : 'pending_foreign_labor';
          break;
        case 'agencyPayment':
          arrivalUpdate.approvalPayment = value ? 'paid' : null;
          updateData.bookingstatus = value
            ? 'agency_paid'
            : 'pending_agency_payment';
          break;
        case 'saudiEmbassyApproval':
          arrivalUpdate.EmbassySealing = value ? new Date() : null;
          updateData.bookingstatus = value
            ? 'embassy_approved'
            : 'pending_embassy';
          break;
        case 'visaIssuance':
          arrivalUpdate.visaNumber = value
            ? `VISA-${id}-${Date.now()}`
            : null;
          updateData.bookingstatus = value
            ? 'visa_issued'
            : 'pending_visa';
          break;
        case 'travelPermit':
          arrivalUpdate.travelPermit = value ? 'issued' : null;
          updateData.bookingstatus = value
            ? 'travel_permit_issued'
            : 'pending_travel_permit';
          break;
        case 'receipt':
          arrivalUpdate.DeliveryDate = value ? new Date() : null;
          updateData.bookingstatus = value ? 'received' : 'pending_receipt';
          if (section === 'receipt' && updatedData?.method) {
            arrivalUpdate.receiptMethod = updatedData.method;
          }
          break;
        case 'bookingStatus':
          if (value === 'cancelled') {
            updateData.bookingstatus = 'cancelled';
            arrivalUpdate.externalOfficeStatus = 'cancelled';
          } else {
            return NextResponse.json(
              { error: 'Invalid bookingStatus value' },
              { status: 400 }
            );
          }
          break;
      }

      const [updatedOrder, updatedArrivals] = await prisma.$transaction([
        prisma.neworder.update({
          where: { id: Number(id) },
          data: updateData,
        }),
        prisma.arrivallist.updateMany({
          where: { OrderId: Number(id) },
          data: arrivalUpdate,
        }),
      ]);

      return NextResponse.json({
        message: 'Status updated successfully',
      });
    }

    // Handle section updates
    if (section && updatedData) {
      const updateData: any = {};
      const arrivalUpdate: any = {};

      switch (section) {
        case 'homemaidInfo':
          if (!order.HomemaidId) {
            return NextResponse.json(
              { error: 'No Homemaid associated with this order' },
              { status: 400 }
            );
          }
          const find = await prisma.neworder.findUnique({
            where: {
              id: Number(id),
              HomemaidId: Number(updatedData['id']),
            },
          });
          if (find?.HomemaidId) {
            return NextResponse.json(
              { error: 'homemaid is Booked' },
              { status: 400 }
            );
          }
          await prisma.neworder.update({
            where: { id: Number(id) },
            data: {
              HomemaidId: updatedData['id']
                ? Number(updatedData['id'])
                : order.HomemaidId,
            },
          });
          break;

        case 'officeLinkInfo':
          if (updatedData['هوية العميل']) {
            updateData.nationalId = updatedData['هوية العميل'];
          }
          if (updatedData['رقم التأشيرة']) {
            arrivalUpdate.visaNumber = updatedData['رقم التأشيرة'];
          }
          if (updatedData['رقم عقد إدارة المكاتب']) {
            arrivalUpdate.InternalmusanedContract =
              updatedData['رقم عقد إدارة المكاتب'];
          }
          if (updatedData['تاريخ مساند']) {
            arrivalUpdate.DateOfApplication = new Date(
              updatedData['تاريخ مساند']
            );
          }
          break;

        case 'externalOfficeInfo':
          if (updatedData['اسم المكتب الخارجي']) {
            await prisma.homemaid.update({
              where: { id: order.HomemaidId || 0 },
              data: { officeName: updatedData['اسم المكتب الخارجي'] },
            });
          }
          if (updatedData['دولة المكتب الخارجي']) {
            arrivalUpdate.office = updatedData['دولة المكتب الخارجي'];
          }
          if (updatedData['رقم عقد مساند التوثيق']) {
            arrivalUpdate.externalmusanedContract =
              updatedData['رقم عقد مساند التوثيق'];
          }
          break;

        case 'destinations':
          if (updatedData['ticketFile']) {
            arrivalUpdate.ticketFile = updatedData['ticketFile'];
          }
          if (updatedData['مدينة المغادرة']) {
            arrivalUpdate.deparatureCityCountry = updatedData['مدينة المغادرة'];
          }
          if (updatedData['مدينة الوصول']) {
            arrivalUpdate.arrivalSaudiAirport = updatedData['مدينة الوصول'];
          }
          if (updatedData['مطار الوصول السعودي']) {
            arrivalUpdate.arrivalSaudiAirport =
              updatedData['مطار الوصول السعودي'];
          }
          if (
            updatedData['تاريخ ووقت المغادرة_date'] ||
            updatedData['تاريخ ووقت المغادرة_time']
          ) {
            arrivalUpdate.deparatureCityCountryDate =
              updatedData['تاريخ ووقت المغادرة_date']
                ? new Date(updatedData['تاريخ ووقت المغادرة_date'])
                : null;
            arrivalUpdate.deparatureCityCountryTime =
              updatedData['تاريخ ووقت المغادرة_time'] || null;
          }
          if (
            updatedData['تاريخ ووقت الوصول_date'] ||
            updatedData['تاريخ ووقت الوصول_time']
          ) {
            arrivalUpdate.KingdomentryDate =
              updatedData['تاريخ ووقت الوصول_date']
                ? new Date(updatedData['تاريخ ووقت الوصول_date'])
                : null;
            arrivalUpdate.KingdomentryTime =
              updatedData['تاريخ ووقت الوصول_time'] || null;
          }
          break;

        case 'documentUpload':
          if (updatedData.files) {
            arrivalUpdate.additionalfiles = updatedData.files;
          }
          break;

        case 'receipt':
          if (updatedData.method) {
            arrivalUpdate.receiptMethod = updatedData.method;
          }
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid section' },
            { status: 400 }
          );
      }

      const [updatedOrder, updatedArrivals] = await prisma.$transaction([
        prisma.neworder.update({
          where: { id: Number(id) },
          data: updateData,
        }),
        prisma.arrivallist.updateMany({
          where: { OrderId: Number(id) },
          data: arrivalUpdate,
        }),
      ]);

      // Handle auth token for events
      const tokenString = request.cookies.get('authToken')?.value;
      if (tokenString) {
        const token = jwtDecode(tokenString) as any;
        console.log('Event emitted for user:', token.id);
      }

      return NextResponse.json({
        message: 'Section updated successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}