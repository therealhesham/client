import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const DEFAULT_STATS = {
  showSection: true,
  sectionTitle: "إحصائياتنا",
  items: [
    {
      id: 1,
      number: 1000,
      prefix: "+",
      label: "عدد عملائنا السعداء",
      highlightWord: "عملائنا",
      icon: "users"
    },
    {
      id: 2,
      number: 1000,
      prefix: "+",
      label: "عدد العقود المنجزة",
      highlightWord: "العقود",
      icon: "contracts"
    },
    {
      id: 3,
      number: 600,
      prefix: "+",
      label: "عدد العاملات المتميزات المتاحات",
      highlightWord: "العاملات",
      icon: "badge"
    }
  ]
};

export async function GET() {
  try {
    const rows: any = await prisma.$queryRawUnsafe(
      `SELECT settingKey, settingValue FROM website_settings WHERE settingKey IN ('hero_banner_image', 'hero_banner_show_border', 'website_stats')`
    );

    let bannerUrl = '/banner.png';
    let showBorder = true;
    let websiteStats = DEFAULT_STATS;

    if (Array.isArray(rows)) {
      rows.forEach((r: any) => {
        if (r.settingKey === 'hero_banner_image' && r.settingValue) {
          bannerUrl = r.settingValue;
        }
        if (r.settingKey === 'hero_banner_show_border') {
          showBorder = r.settingValue === 'true' || r.settingValue === '1';
        }
        if (r.settingKey === 'website_stats' && r.settingValue) {
          try {
            websiteStats = JSON.parse(r.settingValue);
          } catch (pErr) {
            console.error('Error parsing website_stats JSON:', pErr);
          }
        }
      });
    }

    return NextResponse.json({ heroBannerUrl: bannerUrl, showBorder, stats: websiteStats }, { status: 200 });
  } catch (error) {
    console.error('API Error in website-settings:', error);
    return NextResponse.json({ heroBannerUrl: '/banner.png', showBorder: true, stats: DEFAULT_STATS }, { status: 200 });
  }
}
