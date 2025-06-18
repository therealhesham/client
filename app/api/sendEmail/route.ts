import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function sendMail(email: string, message: string,name:String) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.rawaes.com',
      port: 465,
      secure: true,
      auth: {
        user: 'hrdoc@rawaes.com',
        pass: 'a-f09JRnpZOk',
      },
      debug: true,
      logger: true,
    });

    // Verify SMTP connection
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP verification failed:', error);
          reject(error);
        } else {
          console.log('SMTP server is ready to send emails');
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: 'hrdoc@rawaes.com', // Must match the authenticated user
      to: `heshammoha231992@gmail.com,${email},hrdoc@rawaes.com`,
      subject: 'نموذج طلب تواصل من عميل',
      text: `Message from ${email}: ${message}`, // Include sender's email in the body
    };

    console.log('Sending email to:', mailOptions.to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Propagate the error to the caller
  }
}

export async function POST(req: Request) {
  try {
    const { message, name, email ,formData} = await req.json();
    console.log('Received message:', message);

    // Send the email
    await sendMail(formData.email, formData.message,formData.name);

    // Optionally, save to database (uncomment if needed)
    /*
    const notification = await prisma.notifications.create({
      data: {
        message,
        title: `رسالة من موقع العميل ${email}`,
        isRead: false,
      },
    });
    */

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}