import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Check,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";

import SectionHeader from "../common/SectionHeader";
import { ALL_TREATMENTS, getTreatmentImage } from "../../data/treatmentsData";
import "swiper/css";

// 14 Most Requested Conditions at Heal Stride Bhopal
const POPULAR_SLUGS = [
  "back-pain",
  "cervical-pain",
  "knee-pain",
  "sciatica",
  "frozen-shoulder",
  "slip-disc",
  "acl-tear",
  "tennis-golfers-elbow",
  "achilles-tendinitis",
  "osteoarthritis",
  "sports-injury",
  "stroke",
  "ankle-pain",
  "cervical-spondylosis-treatment",
];

const CATEGORY_OPTIONS = [
  { label: "Top Conditions (Popular)", value: "all" },
  { label: "Spine & Back Care", value: "Spine & Back Care" },
  { label: "Lower Limb & Joint Care", value: "Lower Limb & Joint Care" },
  { label: "Upper Limb & Shoulder Care", value: "Upper Limb & Shoulder Care" },
  { label: "Sports & Performance Care", value: "Sports & Performance Care" },
  { label: "Neurological & Rehabilitation", value: "Neurological & Rehabilitation" },
];

const TreatmentSlider = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const swiperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active treatments list based on tab
  const displayedTreatments = useMemo(() => {
    if (activeTab === "all") {
      const popularItems = POPULAR_SLUGS.map((slug) =>
        ALL_TREATMENTS.find((item) => item.slug === slug)
      ).filter(Boolean);
      return popularItems.length > 0 ? popularItems : ALL_TREATMENTS.slice(0, 14);
    }
    return ALL_TREATMENTS.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const selectedOption = CATEGORY_OPTIONS.find((opt) => opt.value === activeTab);

  return (
    <section className="bg-slate-50 py-10 sm:py-14 lg:py-16 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <SectionHeader
            badge={t("treatmentSlider.badge", "EVIDENCE-BASED CARE")}
            title={t("treatmentSlider.title", "Clinical Treatments We Offer")}
            subtitle={t(
              "treatmentSlider.subtitle",
              "Targeted, 100% non-surgical recovery protocols for spine, joint, muscle, and sports injuries in Bhopal."
            )}
            align="center"
            className="!mb-0"
          />
        </div>

        {/* Controls Bar: Category Dropdown on Left, Explore Button & Prev/Next on Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6">
          
          {/* Category Dropdown (Chip replaced by Dropdown) */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-72 bg-white border border-slate-200 hover:border-teal-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-700 shadow-xs flex items-center justify-between gap-2 transition-all cursor-pointer"
              aria-label="Filter treatments by category"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter size={15} className="text-teal-600 shrink-0" />
                <span className="truncate">
                  {selectedOption ? selectedOption.label : "Select Category"}
                </span>
              </div>
              <ChevronDown
                size={15}
                className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180 text-teal-600" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1.5 w-full sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden"
                >
                  {CATEGORY_OPTIONS.map((opt) => {
                    const isSelected = activeTab === opt.value;
                    const count =
                      opt.value === "all"
                        ? POPULAR_SLUGS.length
                        : ALL_TREATMENTS.filter((t) => t.category === opt.value).length;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setActiveTab(opt.value);
                          setIsDropdownOpen(false);
                          if (swiperRef.current) {
                            swiperRef.current.slideTo(0);
                          }
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer mb-1 last:mb-0 ${
                          isSelected
                            ? "bg-teal-50 text-[#008272] font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isSelected && <Check className="w-4 h-4 text-[#008272] shrink-0" />}
                          <span className="truncate">{opt.label}</span>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Controls: Explore All Button (Placed at top) & Navigation Arrows */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs hover:shadow transition-all shrink-0"
            >
              <span>{t("treatmentSlider.viewAll", "Explore All 80+ Treatments")}</span>
              <ArrowRight size={14} />
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-500 hover:bg-teal-50 shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-500 hover:bg-teal-50 shadow-xs flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="w-full max-w-full">
          <Swiper
            key={activeTab}
            modules={[Autoplay]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={18}
            loop={displayedTreatments.length > 3}
            speed={650}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.1,
                spaceBetween: 14,
              },
              520: {
                slidesPerView: 1.5,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 18,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 3.2,
                spaceBetween: 22,
              },
            }}
            className="pb-4"
          >
            {displayedTreatments.map((treatment, idx) => (
              <SwiperSlide key={treatment.id || treatment.slug || idx} className="!h-auto flex flex-col py-1">
                <div
                  className="
                    group
                    h-full
                    w-full
                    flex
                    flex-col
                    justify-between
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
                  "
                >
                  {/* Image & Badges */}
                  <Link
                    to={`/treatments/${treatment.slug}`}
                    className="relative overflow-hidden w-full h-48 sm:h-52 flex-shrink-0 bg-slate-100 block"
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

                  {/* Content Container */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Treatment Title */}
                      <Link
                        to={`/treatments/${treatment.slug}`}
                        className="hover:text-teal-700 transition-colors block"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1">
                          {treatment.name}
                        </h3>
                      </Link>

                      {/* Summary */}
                      <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[38px]">
                        {treatment.summary}
                      </p>

                      {/* Benefits Checkmarks */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 font-medium">100% Non-Surgical Pain Relief</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 font-medium">Root-Cause Biomechanical Assessment</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 font-medium">Personalized 1-on-1 Physiotherapy</span>
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
                        <span>{t("treatmentSlider.learnMore", "Details →")}</span>
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
                        <Calendar size={13} className="shrink-0" />
                        <span>{t("treatmentSlider.bookNow", "Book Now")}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default TreatmentSlider;