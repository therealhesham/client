"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import DualCarousel from '../components/carousel';
import FlagGrid from '../components/flagcard';
import NavigationBar from '../components/navigation';
import localFont from 'next/font/local';
import { FacebookIcon, Instagram, Mail, Map, MapPin, Phone, TwitterIcon, X } from 'lucide-react';
import { MapIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import styles from './YouTubeEmbed.module.css';
import { useRouter } from "next/navigation";
const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

const myFontJanna = localFont({
    src: '../fonts/janna.woff2',
    weight: '700',
});

const sectionFonts = localFont({
    src: '../fonts/MarkaziText-VariableFont_wght.ttf',
    weight: '600',
});

export default function HOWTOSTART() {
const router = useRouter()
    return (
    <div>
<NavigationBar/>
    <div className="flex flex-col items-center  min-h-screen bg-gray-100 pt-24">
      {/* Header */}
      {/* <header className="w-full bg-blue-800 text-white text-center py-4">
        <div className="flex justify-center items-center space-x-2">
          <span>أمن التصميم</span>
          <Image src="/house-icon.png" alt="House Icon" width={24} height={24} />
          <span>MUSANED</span>
       </div>
        <p className="text-sm mt-2">نص إعلاني هنا يمكن أن يحتوي على تفاصيل إضافية عن الخدمة</p>
      </header> */}

      {/* Main Content */}
      <main className="w-full max-w-4xl mt-3 p-4">
     
      <div className="flex flex-row p-3 rounded-2xl max-h-[180px]">
      <img src='./icon.png' className='h-30 w-35 ' style={{alignSelf:"center"}}/>

        <div className="flex flex-col min-w-[810px] w-4xl">
        <h3 className={`${sectionFonts.className}  text-3xl`} style={{color:"rgb(1, 55, 73)", direction: 'rtl', textAlign: 'right' }}>
        نبذة عنا</h3>
<div >

    <h3 className={`${sectionFonts.className} m-[9px]  text-2xl`} style={{color:"rgb(1, 55, 73)", direction: 'rtl', textAlign: 'right' }}>

    روائس للاستقدام هو قطاع يخدم جميع مناطق المملكة العربية السعودية في استقدام العمالة المنزلية من جنسيات مختلفة. يتميز القطاع بخبرته الطويلة في هذا المجال وبفريق عمل محترف يسعى دائمًا لتلبية احتياجات العملاء بطريقة فعالة وسريعة. يوفر القطاع خدمات استقدام موثقة وموثوقة، مع الالتزام بأعلى معايير الجودة والشفافية في العملية
    
    
    
    <span>.</span>
</h3>
</div>

      </div>
        {/* <div className="min-h-30"> */}
        
{/* </div> */}
</div>
 
      </main>
      <div className="bg-[url('/MAP.avif')]  bg-cover  bg-center flex flex-col justify-center items-center gap-2  shadow-2xl  w-full  mt-3 p-10">
      <div className=" flex  flex-col lg:flex-row gap-3">
      <div className=" bg-white opacity-90 min-w-lg max-w-lg  self-center rounded-xl p-2">
<div  >
    <p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-3xl  text-right mr-2`}>
    
قيمنا</p>
<div
  style={{ color: "rgb(1, 55, 73)" }}
  className={`${myFontJanna.className} max-w-lg text-xl text-center`}
>
  <ol start={1}  dir='rtl' className="list-decimal   text-right mr-9 space-y-2">
    <li>الاحترافية: التزام بأعلى معايير الأخلاقيات المهنية والجودة في كل جوانب الخدمة المقدمة.</li>
    <li>الشفافية: تقديم معلومات دقيقة وشفافة للعملاء حول الخدمات المقدمة والرسوم المتوقعة والإجراءات المطلوبة.</li>
    <li>الاحترام والرعاية: معاملة كل عميل وموظف بكرامة واحترام، وتوفير بيئة عمل آمنة ومحترمة للموظفين.</li>
    <li>الاستجابة والتواصل: الرد السريع على استفسارات العملاء وتقديم الدعم اللازم خلال جميع مراحل عملية الاستقدام، بالإضافة إلى توفير قنوات فعالة للتواصل.</li>
    <li>الجودة والكفاءة: توفير خدمات ذات جودة عالية وضمان تنفيذ الإجراءات بكفاءة لضمان راحة ورضا العملاء.</li>
    <li>المسؤولية الاجتماعية: الالتزام بالقوانين والتشريعات المحلية والدولية، والمساهمة في تحسين شروط العمل للعمال المهاجرين.</li>
    <li>الاستدامة: التفكير بشكل استدامة في عمليات الاستقدام والحفاظ على الموارد الطبيعية والبيئة.</li>
    <li>التطوير المستمر: السعي لتحسين الأداء وتطوير الخدمات بشكل دائم من خلال تقييمات دورية وتدريب موظفين على أحدث الممارسات والتقنيات.</li>
    <li>هذه القيم تساعد في بناء سمعة قوية وثقة مع العملاء والمجتمع المحلي.</li>
  </ol>
</div>

</div>

</div>  

{/* right */}
<div className="  max-w-4xl self-center flex flex-col gap-6">
<div  className="bg-white opacity-90 min-w-md max-w-md rounded-xl p-2">
    <p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-3xl  text-right mr-2`}>
    مبادئنا

    
</p>
<p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-xl text-center`}>

في وكالة التوظيف لدينا ، نؤمن بتزويد عملائنا بأفضل ما يمكن. تشمل مبادئنا الشفافية والصدق والاحتراف. نحن نسعى جاهدين لمطابقة المرشحين المناسبين مع أصحاب العمل المناسبين ، مما يضمن شراكة ناجحة وطويلة الأمد. اتصل بنا اليوم لمعرفة المزيد حول كيف يمكننا العثور على الكمال لعملك.

</p>
</div>
<div  className="bg-white opacity-90  min-w-md max-w-md   rounded-xl p-2">
    <p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-3xl  text-right mr-2`}>
    
    رؤيتنا</p>
<p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className} max-w-lg  text-xl text-center`}>

نسعى لتكون الشركة الرائدة في مجال الاستقدام، من خلال تقديم خدمات عالية الجودة وموثوقة تلبي احتياجات العملاء وتسهم في تحقيق أحلامهم وطموحاتهم، بما يعزز الاستقرار الاجتماعي والاقتصادي على المستوى الدولي، ويعكس القيم الأخلاقية والاحترافية والاستدامة في كل جانب من جوانب أعمالنا.
</p>
</div>
</div>

</div>
<div  className="bg-white  rounded-2xl  opacity-90  p-9">
    <p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-3xl  text-right mr-2`}>
    
    رسالتنا</p>
<p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className} max-w-lg  text-xl text-center`}>


حن نسعى لتوفير خدمات استقدام موثوقة وذات جودة عالية لعملائنا، نعتبر راحتهم ورضاهم هدفنا الأسمى. من خلال الاحترافية والشفافية، نسعى لتحقيق أحلامهم وتلبية احتياجاتهم بكل دقة ومهنية. نحن نؤمن بأهمية الاحترام والرعاية تجاه كل فرد يعمل معنا أو يستخدم خدماتنا. نتطلع إلى بناء شراكات طويلة الأمد مع عملائنا وتحقيق نجاحات مشتركة.
</p>
</div>

</div>
    </div>
    
    </div>
  );
}