import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "روائس للاستقدام | Rawaes Recruitment",
    template: "%s | روائس للاستقدام | Rawaes Recruitment",
  },
  description: "شركة روائس للاستقدام - خيارك الأول لاستقدام أفضل الكفاءات والعمالة المنزلية المتميزة بالمملكة العربية السعودية | Rawaes Recruitment Agency",
  keywords: [
    "روائس للاستقدام",
    "Rawaes Recruitment",
    "استقدام عمالة منزلية",
    "مكتب استقدام",
    "عاملات منزلية",
    "سائق خاص",
    "استقدام السعودية",
    "استقدام",
    "recruitment saudi arabia"
  ],
  openGraph: {
    title: "روائس للاستقدام | Rawaes Recruitment",
    description: "شركة روائس للاستقدام - استقدام العمالة المنزلية المتميزة بالمملكة العربية السعودية | Rawaes Recruitment Agency",
    siteName: "روائس للاستقدام | Rawaes Recruitment",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "روائس للاستقدام | Rawaes Recruitment",
    description: "شركة روائس للاستقدام - استقدام العمالة المنزلية المتميزة بالمملكة العربية السعودية",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Analytics */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-RJNZTDM263" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = function gtag(){window.dataLayer.push(arguments);}
              window.gtag('js', new Date());
              window.gtag('config', 'G-RJNZTDM263');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* زر واتساب عائم */}
        <WhatsAppFloatingButton />
        {children}
        <Footer />
      </body>
    </html>
  );
}
