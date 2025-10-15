//@ts-ignore
//@ts-nocheck

'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
// import Navbar from '@/app/components/navbar';
import NavigationBar from '../../components/navigation';


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

const CVDetailsPage = () => {
  const params = useParams();
  const [homemaid, setHomemaid] = useState<Homemaid | null>(null);
  const [homemaidsList, setHomemaidsList] = useState<Homemaid[]>([]); // قائمة العاملات
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    residence: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [isButton, setButton] = useState(true)
  useEffect(() => {
    const fetchHomemaid = async () => {
      try {
        const response = await fetch(`/api/homemaid/${params.id}`);
        if (response.redirected) {
          router.push(response.url);
          return;
        }
        const jsonify = await response.json();
        if (jsonify.NewOrder.length > 0) setButton(false)
        setHomemaid(jsonify);
        setLoading(false);
      } catch (err) {
        setError('فشل في تحميل تفاصيل السيرة الذاتية');
        setLoading(false);
      }
    };

    const fetchHomemaidsList = async () => {
      try {
        const response = await fetch('/api/homemaid'); // افتراض أن لديك API يجلب قائمة العاملات
        const data = await response.json();
        setHomemaidsList(data);
      } catch (err) {
        console.error('فشل في جلب قائمة العاملات');
      }
    };

    fetchHomemaid();
    fetchHomemaidsList();
  }, [params.id]);

  useEffect(() => {
    fetchImageDateAirtable(homemaid?.Name || "");
  }, [homemaid]);

  async function fetchImageDateAirtable(name: string) {
    const fetchData = await fetch("/api/getimagefromprisma/" + name, {
      method: "get",
    });
    const parser = await fetchData.json();
    setImage(parser.result);
  }

  const handleEditClick = () => {
    alert('سيتم تنفيذ وظيفة التعديل قريباً!');
  };

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

  const handlePreviousHomemaid = () => {
    // alert("params")
    const no = parseInt(params.id, 10) - 1

    router.push("/homemaid/" + no.toString())
    // params.id = 1 + parseInt(params.id)
  };

  const handleNextHomemaid = () => {
    // alert("params")
    const no = parseInt(params.id, 10) + 1

    router.push("/homemaid/" + no.toString())
    // params.id = 1 + parseInt(params.id)

  };

  // التحقق من إمكانية التنقل
  const currentIndex = homemaidsList.findIndex((h) => h.id === homemaid?.id);
  const isFirstHomemaid = currentIndex === 0;
  const isLastHomemaid = currentIndex === homemaidsList.length - 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !homemaid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error || 'العاملة غير موجودة'}</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 font-['Tajawal']">
      <NavigationBar />
      <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="flex flex-row">
          <div className="container mx-auto p-6 flex-1">
            <motion.div
              className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Section */}
              <div className="bg-[#003749] text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {image ? (
                      <Image
                        src={image?.includes("airtable") ? image : homemaid.Picture?.url || ""}
                        alt="الصورة الشخصية"
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">لا توجد صورة</span>
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold">{homemaid.Name || 'غير متوفر'}</h1>
                      <p className="text-lg">{homemaid.Nationalitycopy || 'غير متوفر'}</p>
                      <p className="text-sm">العمر: {homemaid.age || 'غير متوفر'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {isButton ?
                      <button
                        onClick={handleBookClick}
                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        حجز العاملة
                      </button> : ""}
                  </div>
                </div>
              </div>
              {/* bg-gray-300 cursor-not-allowed' */}
              {/*  */}
              {/* Navigation Arrows */}
              <div className="flex justify-between px-8 py-4">
                <button
                  onClick={handlePreviousHomemaid}
                  // disabled={isFirstHomemaid}
                  className={`p-2 rounded-full ${isFirstHomemaid
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                    } transition`}
                >
                  <ArrowRightIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextHomemaid}
                  // disabled={isLastHomemaid}
                  className={`p-2 rounded-full ${isLastHomemaid
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                    } transition`}
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-8">
                {/* Personal Information */}
                <motion.section
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    معلومات شخصية
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>رقم جواز السفر:</strong>{' '}
                        {homemaid.Passportnumber || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>الديانة:</strong> {homemaid.Religion || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>الحالة الاجتماعية:</strong>{' '}
                        {homemaid.maritalstatus || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>تاريخ الميلاد:</strong>{' '}
                        {homemaid.dateofbirth || 'غير متوفر'}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>رقم الهاتف:</strong> {homemaid.phone || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>المكتب:</strong> {homemaid.officeName || 'غير متوفر'}
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Skills */}
                <motion.section
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-green-700 mb-4">المهارات</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>مستوى اللغة العربية:</strong>{' '}
                        {homemaid.ArabicLanguageLeveL || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى اللغة الإنجليزية:</strong>{' '}
                        {homemaid.EnglishLanguageLevel || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى الغسيل:</strong>{' '}
                        {homemaid.LaundryLeveL || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى الكي:</strong>{' '}
                        {homemaid.IroningLevel || 'غير متوفر'}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>مستوى التنظيف:</strong>{' '}
                        {homemaid.CleaningLeveL || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى الطبخ:</strong>{' '}
                        {homemaid.CookingLeveL || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى رعاية الأطفال:</strong>{' '}
                        {homemaid.BabySitterLevel || 'غير متوفر'}
                      </p>
                      <p>
                        <strong>مستوى الخياطة:</strong> {homemaid.SewingLeveL || 'غير متوفر'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4">
                    <strong>رعاية كبار السن:</strong>{' '}
                    {homemaid.OldPeopleCare ? 'نعم' : 'لا'}
                  </p>
                </motion.section>

                {/* Experience */}
                <motion.section
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    الخبرة
                  </h2>
                  <p>
                    <strong>سنوات الخبرة:</strong>{' '}
                    {homemaid.ExperienceYears || 'غير متوفر'}
                  </p>
                  <p>
                    <strong>نوع الخبرة:</strong>{' '}
                    {homemaid.experienceType || 'غير متوفر'}
                  </p>
                  <p>
                    <strong>التفاصيل:</strong> {homemaid.Experience || 'غير متوفر'}
                  </p>
                  <p>
                    <strong>التعليم:</strong> {homemaid.Education || 'غير متوفر'}
                  </p>
                </motion.section>
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
        </div>
      </div>
    </div>
  );
};

export default CVDetailsPage;