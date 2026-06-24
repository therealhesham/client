//@ts-nocheck
//@ts-ignore
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import NavigationBar from "../components/navigation";
import axios from "axios";
import localFont from "next/font/local";
import TextType from '../components/TextType';
import { GlobeAltIcon, StarIcon, UserIcon } from '@heroicons/react/24/outline';
import { FaPeace, FaStarAndCrescent } from "react-icons/fa";
const myFont = localFont({
  src: "../fonts/ReadexPro-Bold.ttf",
  weight: "400",
});
// FaStarAndCrescent
const myFontJanna = localFont({
  src: "../fonts/janna.woff2",
  weight: "400",
});
const sectionFonts = localFont({
  src: "../fonts/MarkaziText-VariableFont_wght.ttf",
  weight: "700",
});

const saudiRiyalFont = localFont({
  src: "../fonts/saudi-riyal.ttf", // أو .ttf حسب نوع الملف
  variable: "--font-saudi-riyal",
});

interface Candidate {
  id: number;
  Name: string;
  age: number;
  Nationalitycopy: string;
  Passportnumber: string;
  experience?: string;
  skills?: string[];
  image?: string;
  Experience?: string;
  Picture?: { url: string };
}

const flags = [
  { nationality: "Philippines", displayName: "الفلبين", flagUrl: "https://flagcdn.com/w1280/ph.png" },
  { nationality: "Burundi", displayName: "بوروندي", flagUrl: "https://flagcdn.com/w1280/bi.png" },
  { nationality: "Ethiopia", displayName: "إثيوبيا", flagUrl: "https://flagcdn.com/w1280/et.png" },
  { nationality: "Uganda", displayName: "أوغندا", flagUrl: "https://flagcdn.com/w1280/ug.png" },
  { nationality: "Pakistan", displayName: "باكستان", flagUrl: "https://flagcdn.com/w1280/pk.png" },
  { nationality: "Bangladesh", displayName: "بنغلاديش", flagUrl: "https://flagcdn.com/w1280/bd.png" },
  { nationality: "Kenya", displayName: "كينيا", flagUrl: "https://flagcdn.com/w1280/ke.png" },
];

// Images are now only from Digital Ocean



function CandidateCard({ candidate, nationalityFilter }: { candidate: Candidate; nationalityFilter: string }) {
  const role = candidate.Nationalitycopy === "Philippines" ? "مدبرة منزل" : "مربية أطفال";
  const experience = candidate.Experience;
  const location = candidate.Nationalitycopy;
  const fallbackImage = "";

  // خريطة الحقول إلى الأسماء العربية
  const skillMap: Record<string, string> = {
    LaundryLeveL: "مهارة الغسيل",
    IroningLevel: "الكوي",
    CleaningLeveL: "التنظيف",
    CookingLeveL: "مهارة الطبخ",
    SewingLeveL: "الخياطة",
    BabySitterLevel: "رعاية الأطفال",
  };

  // استخراج المهارات التي قيمتها "Expert - ممتاز"
  const skills: string[] = Object.keys(skillMap)
    .map(key => {
      const value = (candidate as any)[key];
      return value === "Expert - ممتاز" ? skillMap[key] : null;
    })
    .filter(Boolean) as string[];

  // Images are now only from Digital Ocean - no need for Airtable fetch

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:border-[#ECC383] transition-all duration-300 flex flex-col h-[660px] max-w-md mx-auto"
      whileHover={{ scale: 1.02, boxShadow: "0 20px 30px rgba(0,0,0,0.1)" }}
      dir="rtl"
    >
      {/* القسم العلوي: الصورة */}
      <div className="relative w-full h-86 bg-gray-100">
        <img
          src={candidate?.Picture?.url ? candidate?.Picture?.url : candidate?.Picture}
          alt={`صورة ${candidate.Name}`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          onError={() => { }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* القسم السفلي: البيانات */}
      <div className="flex-1 p-5 flex flex-col justify-between text-right space-y-3">
        {/* رقم العاملة */

        }
        <div>
          <span className="text-xs font-semibold text-[#c39e6a] bg-[#c39e6a]/10 px-2 py-1 rounded-full">
            #{candidate.id}
          </span>
        </div>

        {/* الاسم الكامل */}
        <h3 className="text-lg font-bold text-[#013749] leading-tight">{candidate.Name}</h3>

        {/* الوظيفة + الجنسية */}
        <div className="space-y-1">
          <p className={`${myFontJanna.className} text-sm text-[#ECC383] font-medium`}>{candidate?.profession?.name}</p>
          <p className="text-sm text-gray-600">من {location}</p>
        </div>

        {/* الخبرة */}
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">الخبرة:</span> {experience}
          </p>
        </div>

        {/* المهارات (بحد أقصى 3، وإذا زادت تعرض "وأكثر") */}
        <div className="flex flex-wrap gap-1 mt-2">
          {skills.length === 0 ? (
            <span className="text-xs text-gray-500">العاملة جاهزة ل اكتساب خبرة معكم</span>
          ) : (
            skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-[#ECC383] text-[#003749] text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))
          )}
          {skills.length > 3 && (
            <span className="text-xs text-gray-500 pr-1">و{skills.length - 3} أكثر</span>
          )}
        </div>

        {/* زر عرض الملف الشخصي */}
        <div className="mt-4">
          <Link href={`/cv/${candidate.id}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full ${myFont.className} cursor-pointer bg-[#013749] text-white py-2.5 rounded-lg font-medium text-sm transition-colors duration-200`}
            >
              عرض الملف الشخصي
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const religions = ["غير مسلم", "مسلم"];

export default function CandidatesPage() {
  const SendEmail = async (data: { name: string; phone: string; email: string; message: string }) => {
    const response = await axios.post("/api/sendEmail", data);
    console.log(response);
  };

  const [search, setSearch] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [religionFilter, setReligionFilter] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"nationality" | "religion" | "age">("nationality");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [advancedNationality, setAdvancedNationality] = useState<string>("");
  const [advancedReligion, setAdvancedReligion] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [arabicLanguage, setArabicLanguage] = useState<string>("");
  const [englishLanguage, setEnglishLanguage] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [skillRatings, setSkillRatings] = useState<Record<string, string>>({});
  const [selectedHeightRange, setSelectedHeightRange] = useState<string>("");
  const [selectedWeightRange, setSelectedWeightRange] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState<"morning" | "evening">("morning");
  const hasFilters = nationalityFilter || religionFilter || ageFilter;

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("Name", search);
      if (nationalityFilter) queryParams.append("Nationality", nationalityFilter);
      if (advancedNationality && advancedNationality !== "جميع الجنسيات") queryParams.append("Nationality", advancedNationality);
      if (ageFilter) queryParams.append("age", ageFilter);
      if (minAge) queryParams.append("minAge", minAge);
      if (maxAge) queryParams.append("maxAge", maxAge);
      if (religionFilter) queryParams.append("religion", religionFilter);
      if (advancedReligion) queryParams.append("religion", advancedReligion);
      if (maritalStatus && maritalStatus !== "جميع الحالات") queryParams.append("maritalStatus", maritalStatus);
      if (educationLevel && educationLevel !== "جميع المستويات" && educationLevel !== "أي تعليم") queryParams.append("educationLevel", educationLevel);
      if (experienceLevel) queryParams.append("experienceLevel", experienceLevel);
      if (arabicLanguage && arabicLanguage !== "الكل") queryParams.append("arabicLanguage", arabicLanguage);
      if (englishLanguage && englishLanguage !== "الكل") queryParams.append("englishLanguage", englishLanguage);
      if (salary) queryParams.append("salary", salary);
      if (selectedHeightRange) queryParams.append("heightRange", selectedHeightRange);
      if (selectedWeightRange) queryParams.append("weightRange", selectedWeightRange);
      Object.entries(skillRatings).forEach(([skill, level]) => {
        queryParams.append(`skill_${skill}`, level);
      });
      queryParams.append("page", page.toString());

      const response = await fetch(`/api/candidates?${queryParams.toString()}`);
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setCandidates(data.homemaids);
        setTotalCount(data.totalCount);
        setFilteredCount(data.filteredCount); // مثلاً: 47 ← العدد الحقيقي بعد الفلتر

      } else {
        setError(data.error || "Failed to fetch candidates");
        setCandidates([]);
      }
    } catch (err) {
      setError("An error occurred while fetching candidates");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };
  // تحديد الفترة الزمنية الحالية (صباحية أو مسائية)
  const determineCurrentPeriod = () => {
    const now = new Date();
    const hour = now.getHours();

    // الفترة الصباحية: 8 صباحاً - 2 ظهراً
    if (hour >= 9 && hour < 14) {
      return "morning";
    }
    // الفترة المسائية: 2 ظهراً - 10 مساءً
    else {
      return "evening";
    }
  };

  // دالة لتحديث الفترة الزمنية
  const updatePeriod = () => {
    setCurrentPeriod(determineCurrentPeriod());
  };

  useEffect(() => {
    const country = searchParams.get("country");
    if (country && nationalities.includes(country)) {
      setNationalityFilter(country);
    } else {
      setNationalityFilter("");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCandidates();
  }, [search, nationalityFilter, ageFilter, page, religionFilter]);

  useEffect(() => {
    // التحديث الفوري
    updatePeriod();

    // التحديث الدوري كل دقيقة
    const interval = setInterval(updatePeriod, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await SendEmail({ ...formData, phone: formData.phone });
    setFormData({ name: "", phone: "", email: "", message: "" });
    setIsModalOpen(false);
  };

  const handleFlagClick = (nationality: string) => {
    const country = searchParams.get("country");
    const newParams = new URLSearchParams(searchParams.toString());
    if (nationality !== country) {
      newParams.set("country", nationality);
    }
    router.push(`/candidates?country=` + nationality);
  };

  const religions = [
    { display: "مسلم", value: "Islam - الإسلام" },
    { display: "غير مسلم", value: "Non-Muslim" }, // أي شيء غير "Islam - الإسلام"
  ];

  const nationalities = ["Philippines", "India", "Pakistan", "Bangladesh", "Uganda", "Burundi", "Ethiopia", "Kenya"];
  const ages = ["20", "30", "40"];
  const navVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };
  const getWhatsAppMessage = () => {
    let message = "مرحباً، لقد كنت أحاول العثور على عاملة";

    if (nationalityFilter) {
      const nationality = flags.find(f => f.nationality === nationalityFilter)?.displayName || nationalityFilter;
      message += ` من جنسية ${nationality}`;
    }

    if (religionFilter) {
      if (nationalityFilter) message += "،";
      const religion = religionFilter === "Islam - الإسلام" ? "مسلمة" : "غير مسلمة";
      message += ` ${religion}`;
    }

    if (ageFilter) {
      if (nationalityFilter || religionFilter) message += ",";
      let ageText = "";
      if (ageFilter === "20") ageText = "عمرها بين 20 و29 سنة";
      else if (ageFilter === "30") ageText = "عمرها بين 30 و39 سنة";
      else if (ageFilter === "40") ageText = "عمرها 40 سنة فأكثر";

      message += ` ${ageText}`;
    }

    message += " ولم أجد ما أبحث عنه. هل يمكنكم توفيرها لي؟";

    return message;
  };

  const generateWhatsAppLink = () => {
    const message = getWhatsAppMessage();
    const phoneNumber = currentPeriod === "morning"
      ? "966555230531"
      : "966555770723"; // استبدل هذا الرقم برقم الواتساب المسائي الفعلي

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };



  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <NavigationBar />
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">

      </section>

      {/* قسم النص والتبويبات */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        {/* عنوان البحث - الآن على اليمين */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-right max-w-4xl mx-auto mb-8"
        >
          <h2
            className={`${sectionFonts.className} text-6xl md:text-6xl font-bold text-[#013749]`}
          >
            يمكنك البحث بعدة طرق
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            <TextType
              text={[
                "عن طريق الجنسية 🌍 ",
                "عن طريق الديانة 🕋",
                "عن طريق العمر 👤",
                "او يمكنك استخدام البحث المتقدم لخيارات اكثر تحديدا "
              ]}
              typingSpeed={90}
              deletingSpeed={30}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-[#003749] md:text-3xl"
              textColors={["#003749", "#003749", "#003749", "#003749"]}
              startOnVisible={true}
              dir="rtl"
              className="text-base md:text-3xl" // ← حجم مناسب للجمل
            />
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex border-b-2 border-[#ECC383]/30 bg-white rounded-t-lg shadow-sm">
            {[
              { key: "nationality", label: "حسب الجنسية", icon: <GlobeAltIcon className="w-6 h-6 text-[#003749]" /> },
              {
                key: "religion", label: "حسب الديانة", icon:
                  <FaStarAndCrescent style={{ opacity: 0.5 }} className="w-6 h-6 text-[#003749]" />
              },
              { key: "age", label: "حسب العمر", icon: <UserIcon className="w-6 h-6 text-[#003749]" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-3 px-4 text-sm md:text-base font-medium transition-all duration-300 relative ${activeTab === tab.key
                  ? "text-[#ECC383] font-bold"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
                aria-selected={activeTab === tab.key}
              >
                {/* {tab.icon} */}
                {tab.label}
                <span>{tab.icon}</span>

                {/* Indicator أسفل الزر النشط */}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#ECC383] rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>


          {/* محتوى الـ Tab */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm mt-4 border border-gray-100"

          >

            {/* محتوى التبويبات كما هو */}
            {activeTab === "nationality" && (
              <div className="flex flex-wrap justify-center gap-4">
                {flags.map((flag, index) => (
                  <motion.button
                    key={flag.nationality}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const isSelected = nationalityFilter === flag.nationality;
                      setNationalityFilter(isSelected ? "" : flag.nationality);

                      // تحديث الرابط
                      const newParams = new URLSearchParams(searchParams.toString());
                      if (isSelected) {
                        newParams.delete("country");
                      } else {
                        newParams.set("country", flag.nationality);
                      }
                      router.push(`/candidates?${newParams.toString()}`);
                    }}
                    className={`p-2 border-2 rounded-lg ${nationalityFilter === flag.nationality
                      ? "border-[#ECC383] shadow-md"
                      : "border-transparent hover:border-gray-300"
                      } transition-all duration-300`}
                    aria-label={`اختر ${flag.nationality}`}
                  >
                    <img
                      src={flag.flagUrl.trim()}
                      alt={`علم ${flag.nationality}`}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                    <p className="text-xs mt-1 text-gray-700 font-medium">{flag.displayName}</p>
                  </motion.button>
                ))}
              </div>
            )}

            {activeTab === "religion" && (
              <div className="flex flex-wrap justify-center gap-6">
                {religions.map((religion) => (
                  <motion.button
                    key={religion.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const isSelected = religionFilter === religion.value;
                      setReligionFilter(isSelected ? "" : religion.value);
                    }}
                    className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-sm ${religionFilter === religion.value ||
                      (religion.value === "Non-Muslim" && religionFilter && !religionFilter.includes("Islam"))
                      ? "bg-[#ECC383] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {religion.display}
                  </motion.button>
                ))}
              </div>
            )}

            {activeTab === "age" && (
              <div className="flex flex-wrap justify-center gap-4">
                {ages.map((age) => (
                  <motion.button
                    key={age}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const isSelected = ageFilter === age;
                      setAgeFilter(isSelected ? "" : age);
                    }}
                    className={`w-20 h-20 rounded-full text-xl font-bold transition-all duration-300 shadow-md flex flex-col items-center justify-center ${ageFilter === age
                      ? "bg-[#ECC383] text-white"
                      : "bg-white text-gray-700 hover:shadow-lg"
                      } border-2 border-gray-200`}
                  >
                    <span>{age}+</span>
                    <span className="text-xs opacity-80">
                      {age === "20" ? "سنوات" : age === "30" ? "سنة" : "سنة"}
                    </span>
                  </motion.button>
                ))}
              </div>

            )}

            {/* نص + زر: النص على اليمين، الزر على اليسار */}
            {/* نص + زر: النص على اليمين، الزر على اليسار */}
            {(nationalityFilter || religionFilter || ageFilter) && (
              <div className="flex justify-between items-center mt-6 text-sm md:text-base px-2">

                {/* النص */}
                <div className="text-right text-gray-700 leading-relaxed max-w-lg">
                  <p className="font-medium">
                    <span>أنت تبحث عن عاملة</span>{" "}
                    {nationalityFilter && (
                      <span className="text-[#ECC383]">
                        من جنسية {flags.find(f => f.nationality === nationalityFilter)?.displayName || nationalityFilter}
                      </span>
                    )}
                    {religionFilter && (
                      <>
                        {nationalityFilter && "، "}
                        <span className="text-[#ECC383]">
                          {religionFilter === "Islam - الإسلام" ? "مسلمة" : "غير مسلمة"}
                        </span>
                      </>
                    )}
                    {ageFilter && (
                      <>
                        {(nationalityFilter || religionFilter) && "، "}
                        <span className="text-[#ECC383]">
                          {ageFilter === "20" && "عمرها بين 20 و29 سنة"}
                          {ageFilter === "30" && "عمرها بين 30 و39 سنة"}
                          {ageFilter === "40" && "عمرها 40 سنة فأكثر"}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* الزر المُحدّث */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNationalityFilter("");
                    setReligionFilter("");
                    setAgeFilter("");
                    router.push("/candidates");
                  }}
                  className="bg-[#ECC383] hover:bg-[#d4b16f] text-white cursor-pointer text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#ECC383]/50 min-w-24"
                >
                  إعادة تعيين
                </motion.button>
              </div>
            )}
            <div className="border-t border-black -200 mt-6"></div>
            <div className="text-right mt-4">
              <button
                onClick={() => setIsAdvancedModalOpen(true)}
                className="text-[#ECC383] hover:underline font-medium text-sm md:text-base inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 focus:outline-none cursor-pointer"
              >
                استخدم البحث المتقدم
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>


            {/* Modal البحث المتقدم */}
            {/* Modal البحث المتقدم */}
            {isAdvancedModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={() => setIsAdvancedModalOpen(false)}
              >
                <div
                  className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  dir="rtl"
                >
                  {/* رأس النموذج */}
                  <div className="border-b border-gray-200 p-6">
                    {/* العنوان */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[#013749] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        البحث المتقدم
                      </h3>
                      <button
                        onClick={() => setIsAdvancedModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>

                    {/* تنبيه واضح */}
                    <div className="bg-[#ECC383]/20 border border-[#ECC383] rounded-xl p-4 shadow-inner cursor-pointer">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ECC383] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm md:text-base text-[#013749] leading-relaxed font-medium">
                          يمكنك تحديد الاختيارات التي تهمك فقط وترك البقية دون تغيير .
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* محتوى النموذج */}
                  <div className="p-6 space-y-8">
                    {/* القسم 1: المعلومات الأساسية */}
                    <div className="space-y-5">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <span className="bg-[#ECC383] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">1</span>
                        المعلومات الأساسية
                      </h4>

                      {/* الجنسية */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.055m-12.93 7.465a3 3 0 114.242 4.242 3 3 0 01-4.242-4.242z" />
                          </svg>
                          اختر الجنسية المفضلة
                        </label>
                        <select value={advancedNationality} onChange={(e) => setAdvancedNationality(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition">
                          <option>جميع الجنسيات</option>
                          <option>الفلبين</option>
                          <option>إثيوبيا</option>
                          <option>باكستان</option>
                          <option>بنغلاديش</option>
                          <option>كينيا</option>
                          <option>أوغندا</option>
                          <option>بوروندي</option>
                        </select>
                      </div>

                      {/* الديانة */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          ديانة العاملة
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="religion" className="text-[#ECC383]" checked={advancedReligion === "Islam - الإسلام"} onChange={() => setAdvancedReligion("Islam - الإسلام")} />
                            <span className="text-gray-700">مسلمة</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="religion" className="text-[#ECC383]" checked={advancedReligion === "Non-Muslim"} onChange={() => setAdvancedReligion("Non-Muslim")} />
                            <span className="text-gray-700">غير مسلمة</span>
                          </label>
                        </div>
                      </div>

                      {/* الحالة الاجتماعية */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          الحالة الاجتماعية
                        </label>
                        <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition">
                          <option>جميع الحالات</option>
                          <option>عازبة</option>
                          <option>متزوجة</option>
                          <option>مطلقة</option>
                        </select>
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="border-t border-gray-100"></div>

                    {/* القسم 2: العمر والجسم */}
                    <div className="space-y-5">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <span className="bg-[#ECC383] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">2</span>
                        العمر والجسم
                      </h4>

                      {/* العمر */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          نطاق العمر
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="number" placeholder="من" value={minAge} onChange={(e) => setMinAge(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none" />
                          <input type="number" placeholder="إلى" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none" />
                        </div>
                      </div>

                      {/* الوزن والطول */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          الوزن والطول
                        </label>

                        <div className="space-y-4">
                          {/* الطول - اختيار من النطاقات */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">الطول</label>
                            <select
                              value={selectedHeightRange}
                              onChange={(e) => setSelectedHeightRange(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none bg-white"
                            >
                              <option value="">أي طول</option>
                              <option value="140-149">140 – 149 سم</option>
                              <option value="150-159">150 – 159 سم</option>
                              <option value="160-169">160 – 169 سم</option>
                              <option value="170+">170+ سم</option>
                            </select>
                          </div>

                          {/* الوزن - اختيار من النطاقات */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">الوزن</label>
                            <select
                              value={selectedWeightRange}
                              onChange={(e) => setSelectedWeightRange(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none bg-white"
                            >
                              <option value="">أي وزن</option>
                              <option value="40-49">40 – 49 كجم</option>
                              <option value="50-59">50 – 59 كجم</option>
                              <option value="60-69">60 – 69 كجم</option>
                              <option value="70+">70+ كجم</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="border-t border-gray-100"></div>

                    {/* القسم 3: التعليم والخبرة */}
                    <div className="space-y-5">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <span className="bg-[#ECC383] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
                        التعليم والخبرة
                      </h4>

                      {/* التعليم */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          المستوى التعليمي
                        </label>
                        <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition">
                          <option>جميع المستويات</option>
                          <option>ابتدائي</option>
                          <option>متوسط</option>
                          <option>ثانوي</option>
                          <option>جامعي</option>
                        </select>
                      </div>

                      {/* مستوى الخبرة */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          مستوى الخبرة
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: "novice", label: "بدون خبرة" },
                            { value: "intermediate", label: "متوسطة" },
                            { value: "experienced", label: "جيدة" },
                            { value: "expert", label: "ممتازة" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setExperienceLevel(experienceLevel === option.value ? null : option.value)}
                              className={`px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 min-w-[120px] ${experienceLevel === option.value
                                ? "bg-[#ECC383] text-white shadow-md transform scale-105"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-[#ECC383] hover:shadow-sm"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {experienceLevel && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#ECC383] bg-[#ECC383]/[0.1] p-3 rounded-xl mt-3 leading-relaxed"
                          >
                            {experienceLevel === "novice" && "العاملة مدربة ولكن لم يسبق لها العمل."}
                            {experienceLevel === "intermediate" && "العاملة لديها 1-2 سنة خبرة."}
                            {experienceLevel === "experienced" && "العاملة لديها 3-4 سنة خبرة."}
                            {experienceLevel === "expert" && "العاملة لديها 5 سنوات خبرة فأكثر."}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="border-t border-gray-100"></div>

                    {/* القسم 4: اللغة والراتب */}
                    <div className="space-y-5">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <span className="bg-[#ECC383] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">4</span>
                        اللغة والراتب
                      </h4>

                      {/* اللغة العربية */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          اللغة العربية
                        </label>
                        <select value={arabicLanguage} onChange={(e) => setArabicLanguage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition">
                          <option>الكل</option>
                          <option>لا تجيد</option>
                          <option>مبتدئ</option>
                          <option>جيد</option>
                          <option>جيد جدًا</option>
                          <option>ممتاز</option>
                        </select>
                      </div>

                      {/* اللغة الإنجليزية */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          اللغة الإنجليزية
                        </label>
                        <select value={englishLanguage} onChange={(e) => setEnglishLanguage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition">
                          <option>الكل</option>
                          <option>لا تجيد</option>
                          <option>مبتدئ</option>
                          <option>جيد</option>
                          <option>جيد جدًا</option>
                          <option>ممتاز</option>
                        </select>
                      </div>

                      {/* الراتب */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          الراتب الشهري (ريال)
                        </label>
                        <select
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#ECC383] focus:border-[#ECC383] outline-none transition"
                        >
                          <option value="">بدون تحديد</option>
                          <option value="900">900 ﷼</option>
                          <option value="1000">1000 ﷼</option>
                          <option value="1100">1100 ﷼</option>
                          <option value="1200">1200 ﷼</option>
                          <option value="1300">1300 ﷼</option>
                          <option value="1400">1400 ﷼</option>
                          <option value="1500">1500 ﷼</option>
                        </select>
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="border-t border-gray-100"></div>

                    {/* القسم 5: المهارات */}
                    <div>
                      <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ECC383]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.07-7.07 5 5 0 01-7.07 7.07z" />
                        </svg>
                        تقييم المهارات
                      </h4>
                      {[
                        "مهارة الغسيل",
                        "مهارة الطبخ",
                        "مهارة الكوي",
                        "مهارة التنظيف",
                        "مهارة العناية بالاطفال",
                        "مهارة رعاية كبار السن",
                      ].map((skill) => (
                        <div key={skill} className="mb-5 last:mb-0">
                          <label className="block text-sm font-medium text-gray-700 mb-2">{skill}</label>
                          <div className="grid grid-cols-4 gap-2">
                            {["مبتدئ", "جيد", "جيد جدًا", "ممتاز"].map((level) => {
                              const isActive = skillRatings[skill] === level;
                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    setSkillRatings((prev) => {
                                      const newRatings = { ...prev };
                                      if (newRatings[skill] === level) {
                                        delete newRatings[skill];
                                      } else {
                                        newRatings[skill] = level;
                                      }
                                      return newRatings;
                                    });
                                  }}
                                  className={`py-3 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                    ? "bg-[#ECC383] text-white shadow-md transform scale-105"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                  {level}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="border-t border-gray-200 p-5 flex justify-end gap-3">
                    <button
                      onClick={() => setIsAdvancedModalOpen(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        fetchCandidates();
                        setIsAdvancedModalOpen(false);
                      }}
                      className="px-6 py-3 bg-[#ECC383] text-white rounded-xl font-medium hover:bg-[#012f3f] transition-shadow shadow-md hover:shadow-lg"
                    >
                      بحث
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </section>


      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* الإطار الخارجي - ذهبي خفيف */}
          <div className="bg-white rounded-3xl border border-[#ECC383]/40 shadow-xl overflow-hidden">

            {/* الهيدير: العنوان والرسالة */}
            <div className="p-10 text-center relative">
              {/* العنوان الرئيسي */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4 tracking-wide"
              >
                السير الذاتية للعاملات
              </motion.h2>

              {/* الرسالة الديناميكية */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
              >
                {loading ? (
                  "جاري تحميل المرشحات..."
                ) : error ? (
                  <span className="text-red-600">{error}</span>
                ) : candidates.length === 0 ? (
                  hasFilters ? (
                    <>لا توجد عاملات مطابقة لمعاييرك.</>
                  ) : (
                    <>حاليًا لا توجد عاملات متاحة.</>
                  )
                ) : hasFilters ? (
                  <>
                    وجدنا <span className="font-bold text-[#ECC383]">{filteredCount}</span> عاملة بناءً على اختيارك.
                  </>
                ) : (
                  <>
                    لدينا <span className="font-bold text-[#ECC383]">{totalCount}</span> عاملة يمكنك الاختيار من بينهم.
                  </>
                )}
              </motion.p>

              {/* زخرفة صغيرة */}
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-0.5 bg-[#ECC383] rounded-full"></div>
                <div className="w-3 h-3 bg-[#ECC383] rounded-full mt-[-4px] mx-1"></div>
                <div className="w-12 h-0.5 bg-[#ECC383] rounded-full"></div>
              </div>
            </div>

            {/* الخط الفاصل الزاهي */}
            <div className="border-t border-[#ECC383]/20"></div>

            {/* المحتوى: الشبكة */}
            <div className="p-8">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#ECC383]/30 border-t-[#ECC383] rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : error ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-red-600 text-lg py-12"
                >
                  {error}
                </motion.p>
              )
                : candidates.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-gray-50 rounded-2xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      {hasFilters ? "لا يوجد سير ذاتية مطابقة لمواصفاتك ولكن يسعدنا تواصلك معنا لتوفر طلبك بالتحديد" : "سنضيف عاملات جديدات قريبًا."}
                    </p>

                    {/* زر واتساب - يظهر فقط عندما يكون هناك فلتر مطبق */}
                    {hasFilters && (
                      <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block bg-[#25D366] text-white font-medium py-3 px-6 rounded-none hover:bg-[#128C7E] transition-colors duration-200 shadow-md hover:shadow-lg min-w-[240px] text-center"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <img
                            src="/whatsapp-svgrepo-com.svg"
                            alt="واتساب"
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-xs font-bold text-white mx-1">|</span>
                          <span className="text-sm md:text-base font-medium">تواصل معنا على الواتس اب</span>
                        </div>
                      </a>
                    )}
                  </motion.div>
                ) : (
                  <>
                    {/* الشبكة */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {candidates.map((candidate) => (
                        <motion.div
                          key={candidate.id}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ y: -6, transition: { duration: 0.2 } }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CandidateCard candidate={candidate} nationalityFilter={nationalityFilter} />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* أزرار التنقل */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-8 py-3 rounded-full font-medium text-sm tracking-wide ${page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#013749] text-white hover:bg-[#012f3f]"
                          } transition-all duration-200 shadow-sm`}
                      >
                        → السابق
                      </motion.button>

                      <div className="text-sm text-gray-500 font-medium px-5 py-2 bg-white border border-gray-200 rounded-full min-w-24 text-center">
                        الصفحة {page}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={candidates.length < 10}
                        className={`px-8 py-3 rounded-full font-medium text-sm tracking-wide ${candidates.length < 10
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#013749] text-white hover:bg-[#012f3f]"
                          } transition-all duration-200 shadow-sm`}
                      >
                        التالي  ←
                      </motion.button>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>

  );

}
