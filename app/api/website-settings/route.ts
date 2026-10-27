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
      `SELECT settingKey, settingValue FROM website_settings WHERE settingKey IN ('hero_banner_image', 'hero_banner_show_border', 'website_stats', 'hero_banner_images', 'hero_banner_auto_slide', 'hero_banner_interval', 'hero_banner_intervals')`
    );

    let bannerUrl = '/banner.png';
    let showBorder = true;
    let websiteStats = DEFAULT_STATS;
    let customBanners: string[] = [];
    let autoSlide = true;
    let slideInterval = 4000;
    let slideIntervals: number[] = [];

    if (Array.isArray(rows)) {
      for (const r of rows) {
        if (r.settingKey === 'hero_banner_image' && r.settingValue) {
          bannerUrl = r.settingValue;
        }
        if (r.settingKey === 'hero_banner_show_border') {
          showBorder = r.settingValue === 'true' || r.settingValue === '1';
        }
        if (r.settingKey === 'hero_banner_auto_slide') {
          autoSlide = r.settingValue === 'true' || r.settingValue === '1';
        }
        if (r.settingKey === 'hero_banner_intervals' && r.settingValue) {
          try {
            const parsed = JSON.parse(r.settingValue);
            if (Array.isArray(parsed)) {
              slideIntervals = parsed.map(Number).filter((n: any) => !isNaN(n) && n >= 500);
            }
          } catch (e) {
            console.error('Error parsing hero_banner_intervals in client API:', e);
          }
        }
        if (r.settingKey === 'hero_banner_interval' && r.settingValue) {
          const parsed = parseInt(r.settingValue, 10);
          if (!isNaN(parsed) && parsed >= 500) slideInterval = parsed;
        }
        if (r.settingKey === 'hero_banner_images' && r.settingValue) {
          try {
            const parsed = JSON.parse(r.settingValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              customBanners = parsed;
            }
          } catch (e) {
            console.error('Error parsing hero_banner_images:', e);
          }
        }
        if (r.settingKey === 'website_stats' && r.settingValue) {
          try {
            websiteStats = JSON.parse(r.settingValue);
          } catch (pErr) {
            console.error('Error parsing website_stats JSON:', pErr);
          }
        }
      }
    }

    let allBanners: string[] = [];
    if (customBanners.length > 0) {
      allBanners = customBanners;
    } else {
      try {
        const historyRows: any = await prisma.$queryRawUnsafe(
          `SELECT imageUrl FROM website_banner_history ORDER BY id DESC`
        );
        const historyUrls = Array.isArray(historyRows) ? historyRows.map((h: any) => h.imageUrl).filter(Boolean) : [];
        allBanners = Array.from(new Set([bannerUrl, ...historyUrls, '/banner.png'].filter(Boolean)));
      } catch (hErr) {
        allBanners = [bannerUrl];
      }
    }

    return NextResponse.json({ 
      heroBannerUrl: bannerUrl, 
      heroBannerUrls: allBanners,
      showBorder, 
      autoSlide,
      slideInterval,
      slideIntervals,
      stats: websiteStats 
    }, { status: 200 });
  } catch (error) {
    console.error('API Error in website-settings:', error);
    return NextResponse.json({ 
      heroBannerUrl: '/banner.png', 
      heroBannerUrls: ['/banner.png'],
      showBorder: true, 
      autoSlide: true,
      slideInterval: 4000,
      stats: DEFAULT_STATS 
    }, { status: 200 });
  }
}
