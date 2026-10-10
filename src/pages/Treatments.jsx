import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Phone,
  Stethoscope,
  Filter,
  CheckCircle2,
  Star,
  Target,
  Zap,
  HeartPulse,
  Award,
  Layers,
  Clock,
  Compass,
} from "lucide-react";
import SEO from "../components/common/SEO";
import AnimatedCounter from "../components/common/AnimatedCounter";
import SectionHeader from "../components/common/SectionHeader";
import Specialists from "../components/home/Specialists";
import { getTreatmentImage } from "../data/treatmentsData";
import { useTreatments } from "../hooks/useTreatments";

const Treatments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Conditions");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { treatments, categories } = useTreatments();

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered treatments
  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCategory =
        selectedCategory === "All Conditions" || t.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, treatments]);

  const scrollToDirectory = () => {
    const el = document.getElementById("treatments-directory");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <SEO
        title="Physiotherapy Treatments & Non-Surgical Pain Relief in Bhopal | Heal Stride"
        description="Explore 80+ evidence-based physiotherapy treatments for back pain, cervical spondylosis, sciatica, knee injuries, sports rehab, and joint pain at Heal Stride Physiotherapy Bhopal."
        keywords="Physiotherapy Treatments Bhopal, Achilles Tendinitis Bhopal, Back Pain Treatment Bhopal, Sciatica Pain Relief Bhopal, Knee Pain Rehab, Sports Physiotherapy Bhopal, Frozen Shoulder Therapy"
      />

      {/* Full-Width Background Banner with Dark Overlay (Matches Services, Doctors, About, Blogs, Contact) */}
      <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
        {/* Full-Width Clinic Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/services-hero-bg.jpg"
            alt="Physiotherapy Treatments at Heal Stride Bhopal"
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
            {/* Pill Chip Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-lg mb-3 sm:mb-3.5 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
              <span className="uppercase tracking-wider font-bold text-xs text-teal-300">
                80+ Clinical Non-Surgical Treatments • Bhopal
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-tight">
              Evidence-Based Treatments That{" "}
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                Match Where It Hurts
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
              Specialized non-surgical care, root-cause biomechanical assessment, and personalized recovery protocols led by Dr. MD Rashid (PT) and Dr. Md Wajhul Quamar (PT).
            </p>

            {/* Action Buttons: Direct Booking to /booking + Scroll to Directory */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-6 py-3.5 min-h-[46px] rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Calendar size={16} className="shrink-0" />
                <span>Book Appointment</span>
              </Link>

              <button
                type="button"
                onClick={scrollToDirectory}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3.5 min-h-[46px] rounded-xl border border-white/20 backdrop-blur-md shadow-md transition-all cursor-pointer"
              >
                <Search size={15} />
                <span>Explore 80+ Conditions</span>
              </button>
            </div>

            {/* Trust Checkmarks */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Certified Doctors (BPT/MPT)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                <span>100% Non-Surgical Care</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>4.7 Rated on Google</span>
              </span>
            </div>

            {/* 4 Cards - Uniform 1-Line Layout with Animated Counter */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto items-stretch">
              {/* Card 1: 80+ Conditions */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-400 whitespace-nowrap">
                    <AnimatedCounter target={80} suffix="+" duration={1.2} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Treated Conditions
                </p>
              </div>

              {/* Card 2: 100% Non-Surgical */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-400 whitespace-nowrap">
                    <AnimatedCounter target={100} suffix="%" duration={1.5} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Non-Invasive Care
                </p>
              </div>

              {/* Card 3: 5000+ Relieved */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 whitespace-nowrap">
                    <AnimatedCounter target={5000} suffix="+" duration={1.7} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Patients Relieved
                </p>
              </div>

              {/* Card 4: 7 Certified Specialities */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-300 whitespace-nowrap">
                    <AnimatedCounter target={7} suffix=" Certs" duration={1.4} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Advanced Therapies
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Highlight Banner (Matches Services.jsx & About.jsx) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-9 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-lg text-center md:text-left"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 text-xl mx-auto sm:mx-0 shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Personalized Root-Cause Clinical Assessment
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Unsure which condition matches your symptoms? Consult our doctors in Bhopal for an accurate physical diagnosis.
              </p>
            </div>
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors border border-teal-200 flex-shrink-0 shadow-sm"
          >
            <span>Consult Doctor</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* Interactive Treatments Directory Section */}
      <section id="treatments-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        {/* Section Header */}
        <SectionHeader
          badge="Condition Directory"
          title="Explore Conditions &amp; Non-Surgical Protocols"
          subtitle="Select a category or search for your symptoms to view dedicated clinical guides, recovery phases, and physiotherapy treatment plans."
        />

        {/* Search & Category Filter Dropdown Bar */}
        <div className="w-full mb-6 bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box with securely positioned search icon */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search condition (e.g., Sciatica, Cervical, Knee, Achilles)..."
              className="w-full pl-10 sm:pl-11 pr-16 py-2.5 sm:py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-800 text-xs sm:text-sm placeholder-slate-400 transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200/80 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-lg transition font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full sm:w-72 inline-flex items-center justify-between gap-2.5 px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-500 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-4 h-4 text-[#008272] shrink-0" />
                <span className="truncate">{selectedCategory}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180 text-[#008272]" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-80 max-h-80 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2 scrollbar-thin">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count =
                    cat === "All Conditions"
                      ? treatments.length
                      : treatments.filter((t) => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer mb-1 last:mb-0 ${
                        isSelected
                          ? "bg-teal-50 text-[#008272] font-bold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isSelected && <Check className="w-4 h-4 text-[#008272] shrink-0" />}
                        <span className="truncate">{cat}</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? "bg-teal-100 text-[#008272]"
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
        </div>

        {/* Count summary bar */}
        <div className="mt-5 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <p>
            Showing <strong className="text-slate-900">{filteredTreatments.length}</strong> conditions
            {selectedCategory !== "All Conditions" && (
              <span> in <span className="text-[#008272] font-semibold">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> matching "<span className="text-slate-800 font-semibold">{searchQuery}</span>"</span>
            )}
          </p>

          <Link
            to="/booking"
            className="inline-flex items-center gap-1.5 font-bold text-[#008272] hover:text-[#d71920] transition-colors"
          >
            <span>Need personalized assessment? Book consultation</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid of Treatment Cards */}
        {filteredTreatments.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No treatments found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any condition matching your search. Try a different keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Conditions");
              }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {filteredTreatments.map((treatment, idx) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: (idx % 6) * 0.05,
                }}
                viewport={{ once: true }}
                className="
                  group
                  bg-white
                  rounded-2xl
                  border
                  border-slate-200
                  hover:border-teal-500
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  overflow-hidden
                  flex
                  flex-col
                  h-full
                  justify-between
                "
              >
                {/* Image & Badges */}
                <Link
                  to={`/treatments/${treatment.slug}`}
                  className="relative overflow-hidden w-full h-52 sm:h-56 flex-shrink-0 bg-slate-100 block"
                >
                  <img
                    src={getTreatmentImage(treatment)}
                    alt={treatment.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  {treatment.category && (
                    <div className="absolute top-3 left-3 bg-teal-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase shadow-sm z-10">
                      {treatment.category}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 z-10">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>Non-Surgical</span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title */}
                    <Link to={`/treatments/${treatment.slug}`} className="hover:text-teal-700 transition-colors">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {treatment.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[38px]">
                      {treatment.summary}
                    </p>

                    {/* Benefits / Highlights */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">100% Non-Surgical Pain Relief</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">Root-Cause Biomechanical Assessment</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">Personalized 1-on-1 Physiotherapy</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons: Details & Book Appointment */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      to={`/treatments/${treatment.slug}`}
                      className="
                        flex-1
                        inline-flex
                        items-center
                        justify-center
                        gap-1
                        bg-teal-50
                        hover:bg-teal-100
                        text-teal-700
                        font-semibold
                        text-xs
                        sm:text-sm
                        py-2.5
                        px-3
                        rounded-xl
                        transition-colors
                        border
                        border-teal-200
                      "
                    >
                      <span>Details</span>
                      <span>→</span>
                    </Link>

                    <Link
                      to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                      className="
                        flex-1
                        inline-flex
                        items-center
                        justify-center
                        gap-1.5
                        bg-gradient-to-r
                        from-[#d71920]
                        to-[#008272]
                        hover:from-[#b91c1c]
                        hover:to-[#0f766e]
                        active:scale-95
                        text-white
                        font-semibold
                        text-xs
                        sm:text-sm
                        py-2.5
                        px-3
                        rounded-xl
                        shadow-xs
                        transition-all
                      "
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Heal Stride Section */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choose Us"
            title="The Heal Stride Clinical Advantage"
            subtitle="Our clinical treatment philosophy focuses on root-cause biomechanics rather than temporary symptom suppression."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-red-400/40 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Root-Cause Diagnosis</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                We perform comprehensive orthopedic, neurological, and postural tests to detect true underlying dysfunctions.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-teal-400/40 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">7 Certified Therapies</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Specialized in Cupping, Dry Needling, IASTM, Manual Therapy, Taping, Cardiopulmonary &amp; Neuro Rehabilitation.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-amber-400/40 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">100% Non-Surgical</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Evidence-based protocols designed to relieve severe chronic pain safely, avoiding invasive surgeries.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-cyan-400/40 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Dedicated 1-on-1 Care</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Every session is personally monitored by qualified physiotherapists with progressive milestone tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Treatment Process */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Treatment Pathway"
            title="Our 4-Stage Recovery Methodology"
            subtitle="How we guide you from severe acute or chronic pain back to full, independent mobility and athletic performance."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#d71920] text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">Clinical Evaluation</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                In-depth physical examination, motion analysis, nerve provocation tests, and medical scan review.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#008272] text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">Pain &amp; Spasm Control</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Targeted dry needling, cupping, electrotherapy, and myofascial release to soothe nerve irritation and spasms.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#d71920] text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">Mobility &amp; Realignment</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Joint mobilization, spinal decompression, active-assisted stretching, and functional alignment training.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#008272] text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900">Strengthening &amp; Prevention</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Progressive resistance exercise, ergonomic correction, and home maintenance routine to stop recurrence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <Specialists limit={2} />
    </div>
  );
};

export default Treatments;
