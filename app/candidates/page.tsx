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
import localFont from 'next/font/local';

const myFont = localFont({
    src: '../fonts/ReadexPro-Bold.ttf',
    weight: '400',
});

const myFontJanna = localFont({
    src: '../fonts/janna.woff2',
    weight: '400',
});


const sectionFonts = localFont({
    src: '../fonts/MarkaziText-VariableFont_wght.ttf',
    weight: '700',
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
  { nationality: "Philippines", flagUrl: "https://flagcdn.com/w1280/ph.png" },
  { nationality: "Indonesia", flagUrl: "https://flagcdn.com/w1280/id.png" },
  { nationality: "Ethiopia", flagUrl: "https://flagcdn.com/w1280/et.png" },
  { nationality: "Pakistan", flagUrl: "https://flagcdn.com/w1280/pk.png" },
  { nationality: "Bengladesh", flagUrl: "https://flagcdn.com/w1280/bd.png" },
  { nationality: "Kenya", flagUrl: "https://flagcdn.com/w1280/ke.png" },
  // { nationality: "Sri Lanka", flagUrl: "https://flagcdn.com/w1280/lk.png" },
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
        <div className={`${myFontJanna.className} space-y-1`}>
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
        <Link href={`/cv/${candidate.id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-4 w-full ${myFont.className} bg-[#013749] text-white py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-colors duration-200 font-[Tajawal, sans-serif]`}
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

export default function CandidatesPage() {
  const SendEmail = async (data: { name: string; phone: string; email: string; message: string }) => {
    const response = await axios.post('/api/sendEmail', data);
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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send only the phone number without +966 to the API
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col pt-20 px-20 md:flex-row gap-4 items-center justify-center mb-8"
          >
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
                className={`p-2 border-2 cursor-pointer ${
                  nationalityFilter === flag.nationality ? "border-[var(--teal)]" : "border-transparent"
                } bg-white shadow-sm`}
                aria-label={`تصفية حسب ${flag.nationality}`}
              >
                <img src={flag.flagUrl} alt={`علم ${flag.nationality}`} className="w-30 h-20 object-cover" />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center text-gray-600 text-lg">
              جارٍ التحميل...
            </motion.p>
          ) : error ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center text-red-600 text-lg">
              {error}
            </motion.p>
          ) : candidates.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center text-gray-600 text-lg">
              لا توجد نتائج مطابقة. حاول تعديل البحث أو الفلاتر.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full font-semibold ${
                page === 1 ? "bg-gray-300" : "bg-[rgb(1,55,73)] text-[var(--cream)] hover:bg-[rgb(1,45,79)] cursor-pointer"
              } transition duration-300`}
            >
              السابق
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={candidates.length < 10}
              className={`px-4 py-2 rounded-full font-semibold ${
                candidates.length < 10 ? "bg-gray-300" : "bg-[rgb(1,55,73)] text-[var(--cream)] hover:bg-[rgb(1,45,79)] cursor-pointer"
              } transition duration-300`}
            >
              التالي
            </motion.button>
          </div>
        </div>
      </section>
    
    </div>
  );
}
