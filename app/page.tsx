// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeIcon, HeartIcon, UserIcon, SparklesIcon } from "@heroicons/react/24/outline";
import SplashScreen from "./components/splashscreen";
import Navbar from "./components/navbar";

// Types
// interface Candidate {
//   id: number;
//   name: string;
//   role: string;
//   experience: string;
//   skills: string[];
//   location: string;
//   image: string;
// }

// Fake Data (Translated to Arabic)


function Hero() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("البحث عن:", search);
  };

  return (
    <section dir="rtl" className="relative bg-gradient-to-br from-teal-500 to-yellow-500 text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-grid.png')] opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative inline-block gloss-effect">
            <HomeIcon className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-bold mb-6 tracking-tight font-['Tajawal']"
        >
          ابحث عن افضل العاملات لدينا
        </motion.h1>
        {/* Rest of the Hero component remains unchanged */}
      </div>
    </section>
  );
}

// CTA Component
function CTA() {
  return (
    <section dir="rtl" className="bg-gradient-to-br from-teal-500 to-yellow-500 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative inline-block gloss-effect">
            <HomeIcon className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif font-bold mb-6 font-['Tajawal']"
        >
          جلب الراحة إلى منزلك
        </motion.h2>
        {/* Rest of the CTA component remains unchanged */}
      </div>
    </section>
  );
}
// Candidate Card Component
interface Candidate {
  id: number;
  Name: string;
  Nationalitycopy: string;
  Experience: string;
  location: string;
  skills: string[];
  image?: string;
  Picture?: {
    url: string;
  };
}

interface CandidateCardProps {
  candidate: Candidate;
}

function CandidateCard({ candidate }: CandidateCardProps) {
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
      dir="rtl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-100 shadow-xl rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <img
        src={candidate.Picture?.url?.includes("digital") ? candidate.Picture.url : imageSrc}
        alt={candidate.Name}
        className="w-full h-56 object-cover"
      />
      <div className="p-6 text-right">
        <h3 className="text-2xl font-semibold text-gray-900 font-['Tajawal']">
          {candidate.Name}
        </h3>
        <p className="text-gray-700 font-['Tajawal']">{candidate?.Nationalitycopy}</p>
        <p className="text-sm text-gray-500 font-['Tajawal'] mt-1">
          الخبرة: {candidate?.Experience}
        </p>
        <p className="text-sm text-gray-500 font-['Tajawal']">
          الموقع: {candidate?.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          {/* {candidate.skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-['Tajawal']"
            >
              {skill}
            </motion.span>
          ))} */}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full bg-teal-500 text-white py-3 rounded-full font-['Tajawal'] font-semibold hover:bg-teal-600 transition duration-300"
        >
          عرض الملف الشخصي
        </motion.button>
      </div>
    </motion.div>
  );
}

// Features Component
function Features() {
  const features = [
    {
      title: "محترفون موثوقون",
      description: "يتم فحص محترفي التدبير لدينا بعناية لضمان الموثوقية والرعاية.",
      icon: <HeartIcon className="h-10 w-10 text-teal-500" />,
    },
    {
      title: "مطابقة مخصصة",
      description: "اعثر على الشخص المناسب لمنزلك مع أدوات البحث المخصصة لدينا.",
      icon: <UserIcon className="h-10 w-10 text-teal-500" />,
    },
    {
      title: "خدمة استثنائية",
      description: "استمتع براحة البال مع دعم مخصص وعالي الجودة.",
      icon: <SparklesIcon className="h-10 w-10 text-teal-500" />,
    },
  ];

  return (
    <section dir="rtl" className="py-20 px-4 md:px-8 bg-teal-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-16 font-['Tajawal']"
        >
          لماذا تختار محترفي التدبير لدينا؟
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="bg-gray-100 p-8 rounded-2xl shadow-lg text-center"
              whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-['Tajawal']">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-['Tajawal']">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [candidates, setCandidates] = useState([])
  const homeData = async () => {


    const bestSix = await fetch("/api/bestsix")
    const data = await bestSix.json()
    setCandidates(data.data)
  }
  useEffect(() => { homeData() }, [])

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 font-['Tajawal']">
      <Navbar />
      {/* Hero Section */}
      <Hero />

      {/* Featured Candidates */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 font-['Tajawal']"
          >
            ابحث عن افضل العاملات لدينا
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate?.id} candidate={candidate} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}