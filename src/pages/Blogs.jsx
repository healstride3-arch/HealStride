import { useState, useMemo, useRef, useEffect } from "react";
import BlogCard from "../components/home/BlogCard";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, Calendar, PhoneCall, CheckCircle2, ShieldCheck, Star, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AnimatedCounter from "../components/common/AnimatedCounter";
import SEO from "../components/common/SEO";
import { blogs as staticBlogs } from "../data/blogs";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";

const Blogs = () => {
  const { t } = useTranslation();
  const { items: firestoreBlogs } = useFirestoreCollection("blogs", {
    constraints: [where("active", "!=", false)],
    fallback: staticBlogs,
  });

  const blogs = useMemo(() => {
    const hasClinicalBlogs = firestoreBlogs.some(
      (b) => b.slug === "neck-stiffness-karan-aur-exercise-se-rahat" || (b.title && b.title.includes("Neck Stiffness"))
    );
    return hasClinicalBlogs ? firestoreBlogs : staticBlogs;
  }, [firestoreBlogs]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Count blogs per category
  const getCategoryCount = (cat) => {
    if (cat === "All") return blogs.length;
    return blogs.filter((b) => b.category === cat).length;
  };

  // Distinct category list
  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.description?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Physiotherapy Blogs & Health Guides | Heal Stride Bhopal"
        description="Read evidence-based clinical articles and physiotherapy rehabilitation guides by Dr. MD Rashid (PT) at Heal Stride Bhopal. Tips for back pain, neck stiffness, sports injuries, and posture correction."
        keywords="Physiotherapy Blogs Bhopal, Neck Pain Exercises, Back Pain Relief Bhopal, Sports Injury Rehabilitation, Laser Therapy Bhopal, Cupping Therapy Bhopal"
      />

      {/* Full-Width Background Banner with Dark Overlay (Matches Doctors, Services, About, Contact) */}
      <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
        {/* Full-Width Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/service-bg.jpg"
            alt="Heal Stride Physiotherapy Blogs & Clinical Guides Bhopal"
            className="w-full h-full object-cover object-center opacity-45 brightness-90 contrast-110"
          />
        </div>

        {/* Dark Gradient Overlay for Maximum Text Clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/95" />

        {/* Subtle brand ambient glow accents */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-red-600/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Content Container - Vertically centered with ample breathing room */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-lg mb-3 sm:mb-3.5 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
              <span className="uppercase tracking-wider font-bold text-xs text-teal-300">
                {t("blogsPage.badge", "Clinical Knowledge Hub • Bhopal")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-tight">
              Physiotherapy &amp; Health{" "}
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                Articles &amp; Guides
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
              {t(
                "blogsPage.subtitle",
                "गर्दन दर्द, कमर दर्द, स्लिप डिस्क, लेज़र एवं फिजियोथेरेपी के आधुनिक उपचारों पर विशेषज्ञ फिजियोथेरेपिस्ट द्वारा प्रमाणित गाइड और घरेलू व्यायाम।"
              )}
            </p>

            {/* Search Box inside Hero */}
            <div className="mt-6 w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="सर्च करें: गर्दन दर्द, कमर दर्द, लेज़र थेरेपी, एक्सरसाइज..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/80 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 backdrop-blur-md text-sm shadow-xl transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-300 hover:text-white px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Trust Checkmarks */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Doctor Verified Articles</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                <span>100% Evidence-Based</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>4.7 Rated on Google</span>
              </span>
            </div>

            {/* 4 Counter Cards */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto items-stretch">
              {/* Card 1: 12+ Articles */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-400 whitespace-nowrap">
                    <AnimatedCounter target={12} suffix="+" duration={1.2} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Clinical Articles
                </p>
              </div>

              {/* Card 2: 100% Doctor Verified */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-400 whitespace-nowrap">
                    <AnimatedCounter target={100} suffix="%" duration={1.5} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Doctor Verified
                </p>
              </div>

              {/* Card 3: 5000+ Patients */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 whitespace-nowrap">
                    <AnimatedCounter target={5000} suffix="+" duration={1.7} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Patients Helped
                </p>
              </div>

              {/* Card 4: 4.7 Google Rating */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-400 whitespace-nowrap flex items-center justify-center gap-1">
                    <AnimatedCounter target={4} suffix=".7" duration={1.2} />
                    <Star size={18} className="fill-amber-400 text-amber-400 inline-block -mt-1" />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Google Rating
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 pb-10 sm:pb-14">
        {/* Filter Bar & Count Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-auto text-left" ref={dropdownRef}>
            <div className="flex flex-col xs:flex-row xs:items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#008272]" />
                <span>फ़िल्टर:</span>
              </span>

              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="inline-flex w-full xs:w-auto items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#008272] text-slate-800 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all xs:min-w-[240px] cursor-pointer"
              >
                <span className="truncate">
                  {selectedCategory === "All" ? "सभी लेख (All Categories)" : selectedCategory}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                    isDropdownOpen ? "rotate-180 text-[#008272]" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full xs:w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-1.5 scrollbar-thin">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-teal-50 text-[#008272] font-bold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isSelected && <Check className="w-4 h-4 text-[#008272] shrink-0" />}
                        <span className="truncate">
                          {cat === "All" ? "सभी लेख (All Categories)" : cat}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? "bg-[#008272] text-white font-bold"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Count indicator & Reset */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-medium">
            <p>
              कुल <span className="font-bold text-slate-800">{filteredBlogs.length}</span> लेख प्रदर्शित हैं
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <>
                <span>•</span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="text-[#008272] hover:underline font-bold cursor-pointer"
                >
                  फिल्टर रीसेट करें
                </button>
              </>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">कोई लेख नहीं मिला</h3>
            <p className="text-slate-500 text-sm mb-4">
              आपके द्वारा खोजे गए शब्द या चुने गए फ़िल्टर के लिए कोई लेख मौजूद नहीं है।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2 rounded-xl bg-[#008272] text-white font-medium text-sm hover:bg-[#00695c] transition-colors"
            >
              सभी 12 लेख देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blogs;
