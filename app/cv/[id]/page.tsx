'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavigationBar from '@/app/components/navigation';
import { PencilIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import localFont from 'next/font/local';
import axios from 'axios';
import { PersonStanding } from 'lucide-react';

const myFont = localFont({
    src: '../../fonts/ReadexPro-Bold.ttf',
    weight: '700',
});

const myFontJanna = localFont({
    src: '../../fonts/janna.woff2',
    weight: '900',
});


const sectionFonts = localFont({
    src: '../../fonts/MarkaziText-VariableFont_wght.ttf',
    weight: '700',
});

// Homemaid interface for TypeScript
interface Homemaid {
  id: number;
  Name: string | null;
  Nationalitycopy: string | null;
  age: number | null;
  Passportnumber: string | null;
  Religion: string | null;
  maritalstatus: string | null;
  dateofbirth: string | null;
  ExperienceYears: string | null;
  Experience: string | null;
  experienceType: string | null;
  ArabicLanguageLeveL: string | null;
  EnglishLanguageLevel: string | null;
  Salary: string | null;
  LaundryLeveL: string | null;
  IroningLevel: string | null;
  CleaningLeveL: string | null;
  CookingLeveL: string | null;
  SewingLeveL: string | null;
  BabySitterLevel: string | null;
  Education: string | null;
  OldPeopleCare: boolean | null;
  PassportStart: string | null;
  PassportEnd: string | null;
  phone: string | null;
  clientphonenumber: string | null;
  bookingstatus: string | null;
  officeName: string | null;
  Picture?: { url: string } | null;
  FullPicture?: { url: string } | null;
  weeklyStatusId: { id: number; status: string; date: string }[];
  NewOrder: { id: number; ClientName: string; bookingstatus: string }[];
  Session: { id: number; reason: string; date: string }[];
  Housed: { id: number; isHoused: boolean }[];
  inHouse: { id: number; houseentrydate: string; checkIns: { id: number; breakfastOption: string }[] }[];
  logs: { id: number; Status: string; createdAt: string }[];
}

// Reusable component for profile card sections
const ProfileCard = ({ title, value }: { title: string; value: string | number | null }) => (
  <div className="flex flex-col p-4 ">
    <p 
       style={{color:"RGB(196, 158, 106)"}}
    className={` text-lg  text-right ${myFontJanna.className}`}>{title}</p>
    <h1
    
    className="text-md font-semibold text-right text-nowrap text-[rgb(1,55,73)] ">{value ?? 'غير متوفر'}</h1>
  </div>
);

// Reusable component for skill levels
const SkillCard = ({ title, level }: { title: string; level: string | null }) => (
  <div className="flex flex-col p-2">

    <p 
       style={{color:"RGB(196, 158, 106)"}}

    className={` text-lg text-right  ${myFontJanna.className}`}>{title}</p>
    <h1 className="text-md  text-right font-semibold text-nowrap text-[rgb(1,55,73)] ">{level ?? 'غير متوفر'}</h1>
  </div>
);

export default function Profile() {



  const params = useParams();
  const router = useRouter();
  const [homemaid, setHomemaid] = useState<Homemaid | null>(null);
  const [image, setImage] = useState<string>('');
    const [homemaidsList, setHomemaidsList] = useState<Homemaid[]>([]); // قائمة العاملات
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    residence: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isButton, setButton] = useState(true)
  const handlePreviousHomemaid = () => {
    // alert("params")
    const no = parseInt(params.id, 10) - 1

    router.push("/cv/" + no.toString())
    // params.id = 1 + parseInt(params.id)
  };

  const handleNextHomemaid = () => {
    // alert("params")
    const no = parseInt(params.id, 10) + 1

    router.push("/cv/" + no.toString())
    // params.id = 1 + parseInt(params.id)

  };

  // Fetch homemaid data
  useEffect(() => {
    const fetchHomemaid = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/homemaid/${params.id}`);
        if (response.redirected) {
          router.push(response.url);
          return;
        }
        if (!response.ok) {
          throw new Error('فشل في تحميل البيانات');
        }
        const data: Homemaid = await response.json();
        setHomemaid(data);
        setIsButtonDisabled(data.NewOrder.length > 0);
      } catch (err) {
        setError('فشل في تحميل تفاصيل السيرة الذاتية');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHomemaid();
    }
  }, [params.id, router]);
const [fullImage,setFullImage]=useState("")
  // Full body picture - صورة كامل الجسم
  // Fetch image from Airtable
  useEffect(() => {
    const fetchImage = async (name: string) => {
      try {
        const response = await fetch(`/api/fetchbothimage/${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error('فشل في جلب الصورة');
        }
        const data = await response.json();
        setImage(data.result[0].fields.Picture[0].url || '/fallback-image.jpg');
       setFullImage(data.result[0].fields["Full body picture - صورة كامل الجسم "][0].url );
      } catch (err) {
        console.error('Error fetching image:', err);
        setImage('/fallback-image.jpg');
      }
    };

    if (homemaid?.Name) {
      fetchImage(homemaid.Name);
    }
  }, [homemaid?.Name]);









  const handleBookClick = () => {
    setIsModalOpen(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ clientName: '', phoneNumber: '', residence: '' });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const verifyPhone = ()=>{ // verify phone number by sending otp 

}

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bookhomemaid', {
        homemaidId: homemaid?.id,
        fullName: formData.clientName,
        phone_number: formData.phoneNumber,
        residence: formData.residence,
      });

      if (response.status === 201) {
        setFormSuccess('تم إرسال طلب الحجز بنجاح!');
        setTimeout(() => {
          handleModalClose();
        }, 2000);
      }
    } catch (err) {
      setFormError('فشل في إرسال طلب الحجز. حاول مرة أخرى.');
    }
  };










  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!homemaid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <p>لم يتم العثور على بيانات السيرة الذاتية</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 ">
      <NavigationBar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto  pt-30 py-8   "
      ><h3  className={`grid gap-6 md:grid-cols-2  lg:grid-cols-2`}><span></span><span className={`text-2xl ${myFont.className} text-center text-[rgb(1,55,73)] `}>السيرة الذاتية للعاملة</span></h3>
        <div className="grid gap-6 md:grid-cols-2  lg:grid-cols-2">
          {/* Left Column: Profile Details */}
          <div className="space-y-6 ">
            <div className='flex flex-row-reverse justify-between'>
            <h3 className={`text-2xl  ${myFont.className} text-right text-[rgb(1,55,73)] `}>معلومات العاملة</h3>
            <div className='flex flex-row-reverse justify-between gap-20'>

              <button onClick={handleNextHomemaid}
      className={`        ${myFontJanna.className}          p-2 w-30 mr-3 rounded-lg transition cursor-pointer bg-[#C49E6A] text-white
      `}
      >التالي</button>
              <button  
              onClick={handlePreviousHomemaid}
              className={`
        ${myFontJanna.className} 
        p-2 w-30  rounded-lg transition cursor-pointer
      bg-[#C49E6A] text-white 
      `}>السابق</button>

            </div>
            </div>
            <div>
            {/* Personal Info Card */}
            <div className="bg-white  rounded-2xl shadow-md p-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <ProfileCard title="اسم العاملة" value={homemaid.Name} />
              <ProfileCard title="رقم السيرة الذاتية" value={homemaid.id} />
              <ProfileCard title="الجنسية" value={homemaid.Nationalitycopy} />
              <ProfileCard title="العمر" value={homemaid.age} />
            </div>
            </div>
            
            {/* Additional Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <ProfileCard title="الراتب" value={homemaid.Salary} />
              <ProfileCard title="الديانة" value={homemaid.Religion} />
              <ProfileCard title="الحالة الإجتماعية" value={homemaid.maritalstatus} />
              <ProfileCard title="تاريخ الميلاد" value={homemaid.dateofbirth} />
            </div>
            <h3 className={`text-2xl  ${myFont.className} text-right text-[rgb(1,55,73)] `}>عن العاملة</h3>

            {/* Skills and Experience Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillCard title="سنوات الخبرة" level={homemaid.ExperienceYears} />
                <SkillCard title="أماكن الخبرة" level={homemaid.Experience} />
                <SkillCard title="اللغة العربية" level={homemaid.ArabicLanguageLeveL} />
                <SkillCard title="اللغة الإنجليزية" level={homemaid.EnglishLanguageLevel} />
                <SkillCard title="العناية بالأطفال" level={homemaid.BabySitterLevel} />
                <SkillCard title="رعاية كبار السن" level={homemaid.OldPeopleCare ? 'نعم' : 'لا'} />
                <SkillCard title="الغسيل" level={homemaid.LaundryLeveL} />
                <SkillCard title="الكوي" level={homemaid.IroningLevel} />
                <SkillCard title="الطبخ" level={homemaid.CookingLeveL} />
                <SkillCard title="التنظيف" level={homemaid.CleaningLeveL} />
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center items-center flex-col gap-6">
            <img
              className="rounded-xl object-fill  w-100 h-[273px]"
              src={image}
              alt={`صورة ${homemaid.Name || 'العاملة'}`}
              width={386}
              height={273}
              // priority
              onError={() => setImage('/fallback-image.jpg')}
            />



<img
              className="rounded-xl object-fill  w-100 h-[50 3px]"
              src={fullImage}
              alt={`صورة ${homemaid.Name || 'العاملة'}`}
              width={286}
              height={273}
              // priority
              onError={() => setImage('/fallback-image.jpg')}
            />
    {isButtonDisabled?
   <div className='w-[448px] h-[50px] flex flex-col items-center bg-white rounded-t-2xl group'><span className={` mt-3 align-center text-[rgb(1,55,73)] text-lg ${sectionFonts.className}`}>سيرة ذاتية محجوزة</span></div> 
  :  <div 
      
      
      className='w-[448px] h-[50px] flex flex-col justify-center bg-white rounded-t-2xl group'>
  <svg
    fill='#C49E6A'
    data-bbox="39.5 20 121 160.001"
    viewBox="0 0 200 200"
    height="60"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    data-type="shape"
    className="mt-1 group-hover:fill-[rgb(1,55,73)] self-center cursor-pointer" /* Custom Tailwind class or use CSS */
  >
    <g>
      <path
        d="M100.001 96.006c20.935 0 37.907-17.014 37.907-38.003S120.936 20 100.001 20c-20.937 0-37.909 17.014-37.909 38.003s16.972 38.003 37.909 38.003zm0-61.103c12.726 0 23.042 10.342 23.042 23.1s-10.316 23.1-23.042 23.1c-12.724 0-23.041-10.342-23.041-23.1s10.317-23.1 23.041-23.1zm60.396 137.099c-6.022-34.368-23.991-61.997-60.396-61.997-36.404 0-54.375 27.629-60.398 61.997-.732 4.175 2.525 7.999 6.753 7.999 3.333 0 6.194-2.416 6.723-5.716 4.467-27.847 17.427-50.281 46.922-50.281 29.494 0 42.453 22.434 46.919 50.281.529 3.3 3.39 5.716 6.723 5.716 4.229-.001 7.485-3.825 6.754-7.999z"
        clip-rule="evenodd"
        fill-rule="evenodd"
      ></path>
    </g>
  </svg>
  <h1 className='self-center text-[#C49E6A]'>حجز العاملة</h1>
</div>
  }
          </div>
       
        </div>

        <div className="flex">
  {isButton ? (
    <button
      disabled={isButtonDisabled}
      onClick={handleBookClick}
      className={`
        ${myFontJanna.className} 
        p-2 w-50 rounded-lg transition 
        ${isButtonDisabled ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#C49E6A] hover:bg-yellow-600 text-white'}
      `}
    >
      حجز العاملة
    </button>
  ) : ""}
</div>

      </motion.div>
      {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold text-green-700 mb-4">حجز العاملة</h2>
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                        الاسم
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full  h-8  rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                   placeholder="5XXXXXXXX"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="residence" className="block text-sm font-medium text-gray-700">
                        محل الإقامة
                      </label>
                      <input
                        type="text"
                        id="residence"
                        name="residence"
                        value={formData.residence}
                        onChange={handleInputChange}
                        className="mt-1 block w-full  rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        required
                      />
                    </div>
                    {formError && (
                      <p className="text-red-500 text-sm mb-4">{formError}</p>
                    )}
                    {formSuccess && (
                      <p className="text-green-500 text-sm mb-4">{formSuccess}</p>
                    )}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        إرسال
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
    </div>
  );
}