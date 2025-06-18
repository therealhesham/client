//@ts-nocheck
//@ts-ignore

"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { UserIcon, HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import NavigationBar from "../components/navigation";
import axios from "axios";


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
  { nationality: "Philippines", flagUrl: "https://flagcdn.com/w1280/ph.png" },
  { nationality: "Indonesia", flagUrl: "https://flagcdn.com/w1280/id.png" },
  { nationality: "Ethiopia", flagUrl: "https://flagcdn.com/w1280/et.png" },
  { nationality: "Pakistan", flagUrl: "https://flagcdn.com/w1280/pk.png" },
  { nationality: "Bengladesh", flagUrl: "https://flagcdn.com/w1280/bd.png" },
  
  { nationality: "Kenya", flagUrl: "https://flagcdn.com/w1280/ke.png" },

  { nationality: "Sri Lanka", flagUrl: "https://flagcdn.com/w1280/lk.png" },
];

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const role = candidate.Nationalitycopy === "Philippines" ? "مدبرة منزل" : "مربية أطفال";
  const experience = candidate.ExperienceYears;
  const skills = ["التنظيف", "التنظيم", "رعاية الأطفال"];
  const location = candidate.Nationalitycopy === "Philippines" ? "دبي، الإمارات" : "الرياض، السعودية";
  const fallbackImage = "";
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchImageDateAirtable(candidate.Name).then((result) => {
      setImageSrc(result);
    });
  }, [candidate.Name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse max-w-lg mx-auto border border-gray-100 hover:border-[var(--teal)] transition-colors duration-300"
      whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.08)", transition: { duration: 0.3 } }}
      dir="rtl"
    >
      <div className="relative w-full md:w-48 h-64 md:h-auto">
        <img
          src={candidate.Picture?.url?.includes("digital") ? candidate.Picture.url : imageSrc || fallbackImage}
          alt={`صورة ${candidate.Name}`}
          className="w-full h-full object-cover object-center bg-gray-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#c39e6a] font-[Tajawal, sans-serif] leading-tight">{candidate.id}</h3>
          <p className="text-gray-600 text-base font-[Tajawal, sans-serif]">{role}</p>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <p>الخبرة: {experience}</p>
          <p>الموقع: {location}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[var(--lavender)]/10 text-[var(--lavender)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--lavender)]/20"
            >
              {skill}
            </motion.span>
          ))}
        </div>
        <Link href={`/homemaid/${candidate.id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full bg-[#013749] text-white py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-colors duration-200 font-[Tajawal, sans-serif]"
            aria-label={`عرض ملف ${candidate.Name}`}
          >
            عرض الملف الشخصي
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

async function fetchImageDateAirtable(name: string) {
  const fetchData = await fetch("/api/getimagefromat/" + name, {
    method: "GET",
  });
  const parser = await fetchData.json();
  return parser.result;
}

const religions = ["غير مسلم", "مسلم"];
// Main Candidates Page
export default function CandidatesPage() {

  const SendEmail = async ()=>{
    const response = await axios.post('/api/sendEmail', {formData});

console.log(response)


  }
  const [search, setSearch] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [religionFilter, setReligionFilter] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

// // Set isMounted to true only on the client side
// const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
// const searchParams = isMounted ? useSearchParams() : null;

  // Fetch candidates from API
  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("Name", search);
      if (nationalityFilter) queryParams.append("Nationality", nationalityFilter);
      if (ageFilter) queryParams.append("age", ageFilter);
      if (religionFilter) queryParams.append("religion", religionFilter);
      queryParams.append("page", page.toString());

      const response = await fetch(`/api/candidates?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCandidates(data.homemaids);
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

  // Sync nationalityFilter with country query param
  useEffect(() => {
    const country = searchParams.get("country");
    if (country && nationalities.includes(country)) {
      setNationalityFilter(country);
    } else {
      setNationalityFilter("");
    }
  }, [searchParams]);

  // Fetch candidates when filters or page change
  useEffect(() => {
    fetchCandidates();
  }, [search, nationalityFilter, ageFilter, page, religionFilter]);

  // أضف هذه الحالة في بداية المكون
const [isModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  phone: "",
  email: "",
  message: "",
});

// دالة لفتح وإغلاق المودال
const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

// دالة للتعامل مع تغيير حقول النموذج
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// دالة لإرسال النموذج (يمكنك تخصيصها لإرسال البيانات إلى API)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  SendEmail()
  // إعادة تعيين النموذج وإغلاق المودال
  setFormData({ name: "", phone: "", email: "", message: "" });
  setIsModalOpen(false);
};
  // Handle flag click to update URL
  const handleFlagClick = (nationality: string) => {
    const country = searchParams.get("country");
    const newParams = new URLSearchParams(searchParams.toString());
    if (nationality !== country) {
      newParams.set("country", nationality);
    }
    router.push(`/candidates?country=` + nationality);
  };

  // Unique filter options
  const nationalities = ["Philippines", "Indonesia", "India", "Pakistan", "Bangladesh", "Sri Lanka"];
  const ages = ["20", "30", "40"];
  const navVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]" dir="rtl">
      <NavigationBar />
      {/* <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-br px-1 pt-5 pt-30 px-20 mx-auto py-12 from-[var(--teal)] to-[var(--coral)] text-[var(--cream)] py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <UserIcon className="h-12 w-12 text-[var(--cream)]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            اكتشف محترفينا المنزليين
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-[var(--cream)]/80 max-w-2xl mx-auto"
          >
            ابحث عن مدبرات المنازل، مقدمي الرعاية، ومربيات الأطفال الموثوقين لتلبية احتياجات منزلك
          </motion.p>
        </div>
      </motion.section> */}

      {/* Search and Filters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
          >
            {/* Filters */}
            <div className="flex flex-wrap gap-4 w-full md:w-1/2 justify-center">
              <select
                value={nationalityFilter}
                onChange={(e) => {
                  setNationalityFilter(e.target.value);
                  handleFlagClick(e.target.value);
                }}
                className="px-4 py-3 rounded-full bg-white border border-gray-300 w-33 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] text-gray-800"
                aria-label="تصفية حسب الجنسية"
              >
                <option value="">جميع الجنسيات</option>
                {nationalities.map((nationality) => (
                  <option key={nationality} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
              <select
                value={religionFilter}
                onChange={(e) => setReligionFilter(e.target.value)}
                className="px-4 py-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] text-gray-800"
                aria-label="تصفية حسب الديانة"
              >
                <option value="">جميع الديانات</option>
                <option value="Islam - الإسلام">مسلم</option>
                <option value="غير مسلم">غير مسلم</option>
              </select>
            </div>
          </motion.div>

          {/* Flags Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center gap-4 flex-wrap mt-6"
          >

            {flags.map((flag, index) => (
              <motion.button
                key={flag.nationality}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlagClick(flag.nationality)}
                className={`p-2 border-2 cursor-pointer ${nationalityFilter === flag.nationality ? "border-[var(--teal)]" : "border-transparent"
                  } bg-white shadow-sm`}
                aria-label={`تصفية حسب ${flag.nationality}`}
              >
                <img
                  src={flag.flagUrl}
                  alt={`علم ${flag.nationality}`}
                  className="w-30 h-20 object-cover"
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center text-gray-600 text-lg"
            >
              جارٍ التحميل...
            </motion.p>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center text-red-600 text-lg"
            >
              {error}
            </motion.p>
          ) : candidates.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center text-gray-600 text-lg"
            >
              لا توجد نتائج مطابقة. حاول تعديل البحث أو الفلاتر.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full font-semibold ${page === 1 ? "bg-gray-300" : "bg-[var(--teal)] text-[var(--cream)] hover:bg-[#3EE4CF]"
                } transition duration-300`}
            >
              السابق
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={candidates.length < 10}
              className={`px-4 py-2 rounded-full font-semibold ${candidates.length < 10 ? "bg-gray-300" : "bg-[var(--teal)] text-[var(--cream)] hover:bg-[#3EE4CF]"
                } transition duration-300`}
            >
              التالي
            </motion.button>
          </div>
        </div>
      </section>
{/* Modal */}
{isModalOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    dir="rtl"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-[#013749] mb-6">تواصل معنا</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            الاسم
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            placeholder="أدخل اسمك"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            placeholder="أدخل رقم هاتفك"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            placeholder="أدخل بريدك الإلكتروني"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            الرسالة
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            placeholder="أدخل رسالتك"
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium"
          >
            إلغاء
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-[#013749] text-white rounded-lg font-medium"
          >
            إرسال
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
)}
      {/* CTA Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-[#c39e6a] to-[#c39e6a] text-[var(--cream)] py-16"
      >
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <HomeIcon className="h-12 w-12 text-[var(--cream)]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            هل أنت جاهز لتوظيف المحترف المثالي؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-[var(--cream)]/80 mb-8 max-w-xl mx-auto"
          >
            تواصل معنا اليوم للعثور على أفضل مدبرات المنازل ومقدمي الرعاية
          </motion.p>
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={toggleModal}
  className="inline-block bg-teal-800 text-[var(--cream)] px-8 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-lg"
  animate={{
    scale: [1, 1.03, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  }}
>
  تواصل معنا
</motion.button>
        </div>
      </motion.section>
    </div>
  );
}