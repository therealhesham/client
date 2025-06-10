// app/candidates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserIcon, HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Navbar from "../components/navbar";

// Types
interface Candidate {
  id: number;
  Name: string;
  age: number;
  Nationalitycopy: string;
  Passportnumber: string;
  experience?: string; // Optional, as it’s not in your API response
  skills?: string[]; // Optional, as it’s not in your API response
  image?: string; // Optional, as it’s not in your API response
  Experience?: string; // Optional, as it’s not in your API response
  Picture?: { url: string }; // Optional, to handle the Picture property

}

// Candidate Card Component
function CandidateCard({ candidate }: { candidate: Candidate }) {
  // Mock data for fields not provided by the API
  const role = candidate.Nationalitycopy === "Philippines" ? "مدبرة منزل" : "مربية أطفال";
  const experience = candidate.age > 30 ? "٥ سنوات" : "٣ سنوات";
  const skills = ["التنظيف", "التنظيم", "رعاية الأطفال"];
  const location = candidate.Nationalitycopy === "Philippines" ? "دبي، الإمارات" : "الرياض، السعودية";
  const image = "https://images.unsplash.com/photo-1595878715977-2e8f8cf71982?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  async function fetchImageDateAirtable(name: string) {
    const fetchData = await fetch("/api/getimagefromat/" + name, {
      method: "GET",
    });
    const parser = await fetchData.json();
    return parser.result;
  }

  useEffect(() => {
    fetchImageDateAirtable(candidate.Name).then((result) => {
      setImageSrc(result);
    });
  }, [candidate.Name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}

      className="bg-[var(--cream)] shadow-xl rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: { duration: 0.3 } }}
    >
      <img
        src={candidate.Picture?.url?.includes("digital") ? candidate.Picture.url : imageSrc}

        alt={candidate.Name}
        // className="w-full h-56 object-cover mt-0 flex flex-col"
        className="w-full h-56 object-contain object-center bg-gray-100 "
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900">{candidate.Name}</h3>
        <p className="text-gray-700">{role}</p>
        <p className="text-sm text-gray-500 mt-1">الخبرة: {candidate.Experience}</p>
        <p className="text-sm text-gray-500">الموقع: {location}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[var(--lavender)]/20 text-[var(--lavender)] text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </motion.span>
          ))}
        </div>
        <Link href={`/homemaid/${candidate.id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full bg-[var(--teal)] text-[var(--cream)] py-3 rounded-full font-semibold hover:bg-[#3EE4CF] transition duration-300"
            aria-label={`عرض ملف ${candidate.Name}`}
          >
            عرض الملف الشخصي
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// Main Candidates Page
export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch candidates from API
  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("Name", search);
      if (nationalityFilter) queryParams.append("Nationality", nationalityFilter);
      if (ageFilter) queryParams.append("age", ageFilter);
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

  // Fetch candidates when filters or page change
  useEffect(() => {
    fetchCandidates();
  }, [search, nationalityFilter, ageFilter, page]);

  // Unique filter options (you may need to fetch these from the API or define them)
  const nationalities = ["Philippines", "Indonesia", "India"];
  const ages = ["20", "30", "40"];

  return (
    <div className="min-h-screen bg-[var(--cream)] " dir="rtl">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-br  px-1 pt-5 from-[var(--teal)] to-[var(--coral)] text-[var(--cream)] py-16"
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
      </motion.section>

      {/* Search and Filters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
          >
            {/* Search Bar */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث بالاسم..."
                  className="w-full px-4 py-3 pr-10 rounded-full bg-[var(--cream)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] text-gray-800"
                  aria-label="ابحث عن مرشح"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 w-full md:w-1/2 justify-center">
              <select
                value={nationalityFilter}
                onChange={(e) => setNationalityFilter(e.target.value)}
                className="px-4 py-3 rounded-full bg-[var(--cream)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] text-gray-800"
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
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="px-4 py-3 rounded-full bg-[var(--cream)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] text-gray-800"
                aria-label="تصفية حسب العمر"
              >
                <option value="">جميع الأعمار</option>
                {ages.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]">
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
              className={`px-4 py-2 rounded-full font-semibold ${page === 1 ? "bg-gray-300" : "bg-[var(--teal)] text-[var(--cream)] hover:bg-[#3EE4CF]"} transition duration-300`}
            >
              السابق
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={candidates.length < 10} // Assuming pageSize is 10
              className={`px-4 py-2 rounded-full font-semibold ${candidates.length < 10 ? "bg-gray-300" : "bg-[var(--teal)] text-[var(--cream)] hover:bg-[#3EE4CF]"} transition duration-300`}
            >
              التالي
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-[var(--coral)] to-[var(--sunflower)] text-[var(--cream)] py-16"
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
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[var(--teal)] text-[var(--cream)] px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#3EE4CF] transition duration-300 shadow-lg"
              animate={{
                scale: [1, 1.03, 1],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              تواصل معنا
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}