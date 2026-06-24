import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Footer from "../components/footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <div
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<Suspense>
    
        {children}
        </Suspense>
      </div>
    </div>
  );
}
