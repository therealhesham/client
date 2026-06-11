import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST ?? 'mail.rawaes.com';
const SMTP_USER = process.env.SMTP_USER ?? 'wasl@rawaes.com';
const SMTP_PASS = process.env.SMTP_PASS ?? 'M)czeC4JHXd~H42Q';

export function createHrDocTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export function getSmtpFromAddress(): string {
  return SMTP_USER;
}
