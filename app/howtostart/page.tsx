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
    weight: '700',
});

export default function HOWTOSTART() {
const router = useRouter()
    return (
    <div>
<NavigationBar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-24">
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
      <main className="w-full max-w-4xl mx-auto p-4">
     
      <div className="flex flex-row bg-white p-3 rounded-2xl max-h-[180px]">
        <div className="flex flex-col ">
        <h3 className={`${sectionFonts.className}  text-3xl`} style={{color:"rgb(1, 55, 73)", direction: 'ltr', textAlign: 'right' }}>أفضل تجربة استقدام</h3>
<div >

    <h3 className={`${sectionFonts.className} m-[9px] text-xl`} style={{color:"rgb(1, 55, 73)", direction: 'ltr', textAlign: 'right' }}>

    مساند هي إحدى المبادرات التابعة لوزارة الموارد البشرية والتنمية الاجتماعية، إنها منصة إلكترونية شاملة لتجربة استقدام العمالة المنزلية بطريقة متكاملة تهدف إلى تسهيل إجراءات استقدام العمالة المنزلية وزيادة مستوى الحفاظ على حقوق جميع الأطراف من خلال تعريف أصحاب العمل والعمالة المنزلية بحقوقهم وواجباتهم
    </h3>
</div>

      </div>
        {/* <div className="min-h-30"> */}
        <svg preserveAspectRatio="xMidYMid meet"   width={420}  data-bbox="23.22 7.83 465.56 475.29" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" data-type="ugc" role="presentation" aria-hidden="true" aria-label="">
    <g>
        <defs>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="480" y="-232.04" x="-154.96" id="fd90f6ba-34d5-4967-8400-2a977c4f8c20_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="433.99" y="-232.04" x="-154.99" id="10511da2-93da-47af-b37e-69e9e32957dc_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="433.99" y="-232.04" x="-154.99" id="eb32f6f0-3267-4ce4-b810-282860743bf1_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="438.53" width="480.02" y="-237.49" x="-154.98" id="10e725a1-746b-46e6-8f61-9d3e7acf4a93_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="480" y="-232.04" x="-154.96" id="c754beab-185b-49b2-96d8-f9d03460e30c_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="443.05" width="420.54" y="-242.02" x="-160.38" id="e54471ab-d663-4560-a4d2-cc46c0cbaac3_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="441.79" width="420.57" y="-237.49" x="-160.41" id="f768fc8e-c3a9-491d-99b2-2493c9ebf40c_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="433.99" y="-232.04" x="-154.99" id="b8020932-4a15-4e41-b453-ed1d5f4a0240_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="452.03" width="433.99" y="-232.04" x="-154.99" id="17e58a0a-e474-44fc-80f2-fbf5568ccc35_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="438.53" width="433.85" y="-237.49" x="-154.99" id="83a0c186-721d-465a-bdc8-5a514b4577fe_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="438.53" width="433.85" y="-237.49" x="-154.99" id="baec6369-03a0-4880-a4d1-106d0b88e8ea_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="457.42" width="433.99" y="-237.49" x="-154.99" id="aa4919f1-3132-4c72-81fe-1891c7af7740_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="457.42" width="433.99" y="-237.49" x="-154.99" id="5dba708f-3a06-49ef-ba4f-e09f4a401a14_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="343.8" width="517.28" y="-290.27" x="-154.03" id="5c527d3d-2a36-4703-a31a-3c597093cc2c_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="308.32" width="436.26" y="-290.27" x="-154.03" id="d771c4ed-1f10-4c0b-9a06-a6adf6c08654_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="365.19" width="493.64" y="-274.26" x="-130.74" id="92f8bc45-aca0-42e0-ac11-048c67d3cf44_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="349.08" width="480.06" y="-276.66" x="-136.24" id="a7ac662b-0531-4a00-8b2d-25cf1df86220_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="457.43" width="480.07" y="-237.49" x="-155.04" id="3b3d8336-1a11-4962-b4e4-e803d762e045_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="355.23" width="523.6" y="-290.26" x="-160.72" id="14a1d04b-e012-4359-a565-5cee3e945833_comp-lw4qtv43"></mask>
            <mask maskUnits="userSpaceOnUse" height="367.59" width="499.13" y="-276.66" x="-136.24" id="c901dd47-46bb-462d-a7f8-8ed236562b59_comp-lw4qtv43"></mask>
        </defs>
        <g mask="url(#fd90f6ba-34d5-4967-8400-2a977c4f8c20_comp-lw4qtv43)">
            <path d="M278.91 219.99h46.13v-.05H278.9v.05Z" fill="none"></path>
        </g>
        <g mask="url(#10511da2-93da-47af-b37e-69e9e32957dc_comp-lw4qtv43)">
            <path d="M278.78 219.99h.22v-.05h-.22v.05Z" fill="none"></path>
        </g>
        <g mask="url(#eb32f6f0-3267-4ce4-b810-282860743bf1_comp-lw4qtv43)">
            <path d="M278.78 219.99h.22v-.05h-.22v.05Z" fill="none"></path>
        </g>
        <g mask="url(#10e725a1-746b-46e6-8f61-9d3e7acf4a93_comp-lw4qtv43)">
            <path d="M278.83 201.04h46.21l-46.21-.01Z" fill="none"></path>
        </g>
        <g mask="url(#c754beab-185b-49b2-96d8-f9d03460e30c_comp-lw4qtv43)">
            <path d="M278.91 219.99h46.13v-.05H278.9v.05Z" fill="none"></path>
        </g>
        <path d="M260.57 201.39h.06v-16l-.06 16Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#e54471ab-d663-4560-a4d2-cc46c0cbaac3_comp-lw4qtv43)">
            <path d="m260.16 185.32-.07 15.71h.07v-15.71Z" fill="none"></path>
        </g>
        <path d="M260.57 201.39v3.11l.15.09.02-3.2h-.16Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#f768fc8e-c3a9-491d-99b2-2493c9ebf40c_comp-lw4qtv43)">
            <path d="m260.14 204.3.02-3.27H260v3.18l.15.09Z" fill="none"></path>
        </g>
        <g mask="url(#b8020932-4a15-4e41-b453-ed1d5f4a0240_comp-lw4qtv43)">
            <path d="M278.78 219.99h.22v-.05h-.22v.05Z" fill="none"></path>
        </g>
        <g mask="url(#17e58a0a-e474-44fc-80f2-fbf5568ccc35_comp-lw4qtv43)">
            <path d="M278.78 219.99h.22v-.05h-.22v.05Z" fill="none"></path>
        </g>
        <g mask="url(#83a0c186-721d-465a-bdc8-5a514b4577fe_comp-lw4qtv43)">
            <path d="M278.78 201.04h.08l-.08-.01Z" fill="none"></path>
        </g>
        <g mask="url(#baec6369-03a0-4880-a4d1-106d0b88e8ea_comp-lw4qtv43)">
            <path d="M278.78 201.04h.08l-.08-.01Z" fill="none"></path>
        </g>
        <path d="M278.16 201.39v19.2h.2l-.13-19.2h-.08Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#aa4919f1-3132-4c72-81fe-1891c7af7740_comp-lw4qtv43)">
            <path d="M278.78 219.94h.22l-.13-18.9h-.08v18.9Z" fill="none"></path>
        </g>
        <g mask="url(#5dba708f-3a06-49ef-ba4f-e09f4a401a14_comp-lw4qtv43)">
            <path d="M278.78 219.94h.22l-.13-18.9h-.08v18.9Z" fill="none"></path>
        </g>
        <path d="m234.97 18.35.03.03 3.14-2.47.02-.09-3.2 2.52Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#5c527d3d-2a36-4703-a31a-3c597093cc2c_comp-lw4qtv43)">
            <path d="m343.81 45.04 19.07 8.35v.15l.36-.22L282.17 18l-.07.03 61.7 27.01Z" fill="none"></path>
        </g>
        <path d="m281.36 17.48.12-.05-.12.05Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#d771c4ed-1f10-4c0b-9a06-a6adf6c08654_comp-lw4qtv43)">
            <path d="m282.11 18.05.12-.05-.12.05Z" fill="none"></path>
        </g>
        <path d="m238.35 16.58-.02.05-3.36 1.48 23.44 10.24 85.23 37.07 19.3-11.5v-.15l-19.18-8.4-62.04-27.17.08-.03-23.54-10.31h-.04l-.09-.03-19.78 8.74Z" fill-rule="evenodd" fill="#b3b2b3"></path>
        <g mask="url(#92f8bc45-aca0-42e0-ac11-048c67d3cf44_comp-lw4qtv43)">
            <path d="M362.89 73.52v17.41h.01V73.51h-.01Z" fill="none"></path>
        </g>
        <g mask="url(#a7ac662b-0531-4a00-8b2d-25cf1df86220_comp-lw4qtv43)">
            <path d="M343.81 65.18v7.23-7.23Z" fill="none"></path>
        </g>
        <path d="m343.75 65.16-84.77-36.54h-.01l84.9 36.75v25.64h19.08V53.82l-19.2 11.33Z" fill="#59aac7" fill-rule="evenodd"></path>
        <g mask="url(#3b3d8336-1a11-4962-b4e4-e803d762e045_comp-lw4qtv43)">
            <path d="M325.04 201.03h-46.41l.07 18.9h46.34v-18.91Z" fill="none"></path>
        </g>
        <g mask="url(#14a1d04b-e012-4359-a565-5cee3e945833_comp-lw4qtv43)">
            <path d="m343.81 45.04-61.7-27.01-23.19 10.09 84.77 36.85 19.19-11.43v-.16l-19.07-8.35Z" fill="none"></path>
        </g>
        <g mask="url(#c901dd47-46bb-462d-a7f8-8ed236562b59_comp-lw4qtv43)">
            <path d="m347.17 66.65-3.36-1.47v25.74h19.07V73.51l-15.71-6.87Z" fill="none"></path>
        </g>
        <path fill="#59aac7" fill-rule="evenodd" d="m245.8 33.31 13.16-5.71-23.35-10.17-77.43 33.98.07 20.41 87.55-38.51z"></path>
        <path d="M326.15 140.56v-1.49l-.04-.04-.02-.02h-46.86l-18.33 18.8h-.69l-.06 27.44v15.74h-.05v.04h-83.01v18.75h83.27v.65H177V201.7h-.07L177 89.64h.05V64.1h-.03v-.29l-4.99 2.47-13.59 5.9V73l-.24.12.09 128.61 18.55 18.85h83.74l-.08-.07v-.73h.09v.15l.09.07 19.11 14.98v-15.05h44.8v.65h.02l19.17-19.08v-43.78l-17.6-17.17Zm-47.42 17.64h-.09v-.02h.09v.02Zm45.82 42.83h-44.8v-42.79l9.6.01v-.05h-10.62v-.02l45.81-.06v42.92Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path fill="#59aac7" fill-rule="evenodd" d="m33.22 253.7-10 3.11H484.5l4.28-3.11H33.22z"></path>
        <path d="M165.91 322.87h-12.18v62.87H90.28v-6.82c-.05-9.63.21-19.29-.23-28.9-.03-.59-.08-1.15-.13-1.72-.03-.3-.04-.62-.07-.92-.01-.12-.04-.24-.05-.37-.39-3.31-1.17-6.36-2.34-9.09-3.33-7.79-9.75-12.99-18.83-14.19-10.93-1.45-22.2-.3-33.5-.3v10.2c7.65 0 14.94-.16 22.24.04 5.95.17 10.92 1.47 14.33 4.06 1.87 1.41 3.27 3.21 4.11 5.42.01.03.03.06.04.09.08.22.14.46.21.69.07.24.16.46.22.71l.03.13c.11.44.2.9.26 1.37 1.81 12.98 1.68 26.23 2.41 40.02H23.22v10.69h142.7v-73.96Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M470.79 324.79c-15.01-4.64-30.44-1.69-46.3-2.33v63.1h-61.14V322.7h-12.42v62.91h-27.05v-57.54h-12.49v57.46h-27.58v-57.42h-12v57.81c-10.02 0-46.09.04-55.51-.01-11.23-.05-13.9-2.74-13.91-14.08-.03-26.44 0-52.87 0-79.32v-6.05h-12.37v5c0 25.86-.08 51.72.02 77.58.09 22.33 5.97 28.15 28.16 28.15h270.3c0-17.29.79-34.04-.29-50.66-.66-10.36-7.03-18.53-17.42-21.74Zm6.14 60.86h-39.96v-51.62c7.8 0 15.7-.72 23.4.18 9.96 1.16 15.91 7.75 16.43 17.88.56 10.93.12 21.92.12 33.57Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M154.61 312.15H165c.76 0 .87-.11.87-.87v-11.15c0-.76-.11-.87-.87-.87h-10.39c-.77 0-.87.11-.87.87v11.16c0 .76.1.87.87.87Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M153.35 475.96c-5.58 0-10.73.03-15.88 0-14.1-.09-18.84-4.75-18.94-18.84-.08-12.08-.01-24.15-.01-36.24v-3.84h-7.86c0 15.45-.58 30.65.18 45.78.64 12.62 7.75 19.19 20.39 19.91 9.87.56 19.78.13 29.67.11.17 0 .33-.29.44-.38v-65.37h-7.99v58.87Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M82.62 416.83c-2.46-.17-3.65.7-4.5 3.04-5.95 16.27-12.02 32.48-18.06 48.72-.64 1.74-1.36 3.44-2.3 5.81l-21.35-57.32H23.59v65.65h7.6v-56.3c.71.7 1.23 1.57 1.52 2.53 6.38 17.08 12.79 34.15 19.09 51.27.74 1.99 1.61 3.12 3.89 2.75 1.02-.17 2.07-.17 3.09 0 2.89.48 4.16-.82 5.12-3.49 6.03-16.6 12.22-33.14 18.39-49.69.43-1.16 1.01-2.26 1.52-3.38l.65.18v56.1h7.8v-65.82c-3.47 0-6.57.16-9.65-.05Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path fill="#59aac7" fill-rule="evenodd" d="M378.62 474.28V454.7h39.43v-9.02h-39.37v-19.95h39.35v-8.32h-47.79v65.71h51.71v-8.84h-43.33z"></path>
        <path d="M465.92 417.73c-10.81-1.01-21.77-.21-32.89-.21v65.33c9.79 0 19.35.42 28.86-.1 14.17-.79 22.39-7.73 25.21-20.7 1.74-7.89 1.77-16.07.09-23.97-2.5-11.84-9.47-19.23-21.27-20.34Zm12.87 42.7c-1.36 9.94-8.06 14.74-20.11 15.41-5.83.32-11.7.05-17.84.05v-52.22c8.37.45 16.67.29 24.75 1.51 7.9 1.19 12.45 7.03 13.28 14.73.73 6.77.83 13.78-.09 20.51Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M346.37 470.59c-1.33-.95-2.03-1.98-2.71-3.02-10.49-16.06-20.96-32.13-31.5-48.15-.68-1.03-1.85-2.27-2.92-2.42-2.57-.36-5.24-.11-8.06-.11v65.88h7.44v-54.93c1.28 1.85 2.01 2.85 2.68 3.88 10.59 16.26 21.18 32.52 31.82 48.76.63.97 1.63 2.24 2.57 2.35 2.68.32 5.42.11 8.15.11v-65.88h-7.47v53.54Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M205.65 445.93c-3.91-.09-7.83.07-11.72-.23-5.69-.43-8.78-4.33-8.83-10.7-.06-6.27 3.07-10.28 8.78-10.71 4.24-.32 8.5-.19 12.75-.21 4.91-.03 9.83 0 14.89 0v-6.9c-9.91 0-19.67-.41-29.38.11-9.24.49-14.04 5.23-15.11 14.39-1.44 12.24 3.39 20.82 17.39 21.36 3.79.14 7.59 0 11.38.16 6.46.27 9.9 3.76 10.22 10.15.42 8.32-3.34 12.43-11.77 12.57-7.47.13-14.95.03-22.42.03h-3.6v6.77c10.47 0 20.82.55 31.08-.17 9.01-.63 13.67-5.5 14.78-14.1 1.55-12.12-2.42-22.14-18.43-22.52Z" fill="#59aac7" fill-rule="evenodd"></path>
        <path d="M268.19 424.44q-3.06-7.89-11.65-7.51c-.23 0-.44.09-.91.18l-25.56 65.85c2.07 0 3.68-.17 5.24.04 2.66.35 3.79-.77 4.55-3.28 1.19-3.94 3.01-7.69 4.23-11.61.66-2.11 1.76-2.54 3.74-2.51 8.38.09 16.77.11 25.16-.02 2.14-.04 3.05.78 3.7 2.66 1.44 4.23 2.99 8.42 4.65 12.57.35.87 1.33 1.96 2.13 2.05 2.3.27 4.67.1 7.32.1-.57-1.59-.93-2.67-1.34-3.72-7.08-18.27-14.16-36.53-21.25-54.79Zm-20.52 33.86 12.24-33.12h.8v.01l12.22 33.11h-25.26Z" fill="#59aac7" fill-rule="evenodd"></path>
    </g>
</svg>
{/* </div> */}
</div>
        <div className="flex justify-center my-8 ">
          <div className="">
            {/* <Image src="/person-image.png" alt="Person" width={300} height={400} className="rounded-lg" /> */}
            <div className=" inset-0 flex items-center justify-center">
            <YouTube videoId={'I3L7Ft6W0-s'} opts={opts} />
            </div>
            <div className="text-center mt-4">
              {/* <a href="https://www.youtube.com/watch?v=I3L7Ft6W0-s" className="text-blue-600 underline">YouTube</a> */}
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9">
          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>تحديد نوع الاستقدام</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>انتقل إلى مساند واختر نوع الاستقدام وفقًا لتفضيلاتك، سواء كان استقدام عامل بمواصفات محددة أو استقدام عامل محدد بالاسم</p>
          </div>


          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>اختر مزود الخدمة</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>عرض مساند جميع المكاتب التي تقدم خدمات الاستقدام مع إمكانية التصنيف والترتيب حسب الرغبة</p>
          </div>




          
          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>الاتصال بالمكتب</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>يتم التواصل مع المكتب لاختيار السيرة الذاتية المناسبة من أجل تقديم عروض طلبات الاستقدام التي تشمل الراتب المستحق للعامل وفقًا لاختيارك</p>
          </div>



             
          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>تحديد نوع المكتب</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>تحديد نوع المكتب</p>
          </div>



          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>
            إجراء الدفع</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>
            الدفع بأمان عبر مساند بعد إنشاء العقد، يمكنك اختيار أحد طرق الدفع المتاحة: فيزا، ماستركارد، أو من خلال بطاقة بنكية مدى</p>
          </div>



          <div className={`${sectionFonts.className} bg-white p-4 rounded-xl shadow`}>
            <h3  style={{color:"rgb(1, 55, 73)"  ,textAlign:"right"}} className={`${sectionFonts.className}  text-xl`}>
            
تتبع طلبك</h3>
            <p style={{textAlign:"right",color:"rgb(1, 55, 73"}} className={`${sectionFonts.className}  mt-2 text-l`}>

تتبع حالة الطلبات إلكترونيًا من تسليم الطلب حتى وصول العامل        
</p>
 </div>

        </div>
  

      </main>
      <div className="bg-[url('/flagshowtostart.avif')]  bg-cover  bg-center flex flec-col justify-center  shadow-2xl  w-full  mt-3 p-10">
      <div className=" bg-white opacity-90 max-w-4xl self-center rounded-lg p-2">
<div  ><p style={{color:"rgb(1, 55, 73)"}}  className={`${myFontJanna.className}  text-2xl text-center`}>
    
سير ذاتية متعددة</p></div>
<div >
    <p style={{color:"rgb(1, 55, 73"}} className={`${myFontJanna.className}  text-xl text-center`}>
مجموعة مختلفة من السير الذاتية حسب المواصفات التي ترغب بها
</p>
</div>
<div className="flex justify-center ">
<button className="bg-gradient-to-r from-[#ecc383] to-[#8d6c49] text-[#003749] cursor-pointer text-lg p-1  mt-9 rounded-lg self-center"
onClick={()=>router.push("/candidates")}
>

    تصفح السير الذاتية
</button>


</div>
<div>



</div>
</div>
</div>
    </div>
    <footer className={`${myFontJanna.className} grid grid-cols-3 gap-8 p-10 bg-gradient-to-r from-[#ecc383] to-[#8d6c49] text-[#003749] text-center lg:grid-cols-3 md:grid-cols-1`}>
      <div className="space flex flex-col">

<img src='./icon.png' className='h-17 w-20 ' style={{alignSelf:"center"}}/>
        <h3 className="text-xl font-semibold text-[#003749]"> تابعنا </h3>
     
        <div className="flex justify-center space-x-4 mt-4">

<Instagram/>
<TwitterIcon/>

<FacebookIcon/>
        </div>
        
      </div>
      <div className="space-y-4">
        <h3 className={`text-xl font-semibold text-[#003749] ${myFontJanna.className}`}>خارطة الموقع</h3>
        <ul className="space-y-2 text-lg">
          <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">الرئيسية</a></li>
          <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">نبذة عنا</a></li>
          <li><a href="#" className="hover:text-indigo-400 text-md transition-colors duration-200">للتواصل</a></li>
        </ul>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#003749]">معلومات التواصل</h3>
        <div className="text-sm flex items-center justify-center space-x-2">
          <MapPin className="w-5 h-5 text-[#003749]" />
          <p>1234 شارع المثال، المدينة، الدولة</p>
        </div>
        <div className="text-sm flex items-center justify-center space-x-2">
          <Mail className="w-5 h-5 text-[#003749]" />
          <p>Email: <a href="mailto:admin@rawaes.com" className="hover:text-indigo-400 transition-colors duration-200">admin@rawaes.com</a></p>
        </div>
        <div className="text-sm flex items-center justify-center space-x-2">
          <Phone className="w-5 h-5 text-[#003749]" />
          <p>Phone: <a href="tel:+1234567890" className="hover:text-indigo-400 transition-colors duration-200">(123) 456-7890</a></p>
        </div>
     
      </div>
    </footer>
    </div>
  );
}