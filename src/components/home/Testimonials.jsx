import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { googleReviews as defaultReviews } from "../../data/googleReviews";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { FaQuoteLeft, FaStar, FaMapMarkerAlt, FaCheckCircle, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useClinicSettings } from "../../hooks/useClinicSettings";

const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Heal+Stride+Physiotherapy+%26+Wellness+Centre+LIG+85+New+Subhash+Nagar+Near+Gurudwara-Raisen+Road+Bhopal+462023";

const Testimonials = () => {
  const { data: settings } = useClinicSettings();
  const { items: reviews } = useFirestoreCollection("testimonials", {
    constraints: [where("active", "!=", false)],
    fallback: defaultReviews,
    mapItem: (item) => ({
      ...item,
      review: item.review || item.text || "",
      treatment: item.treatment || item.designation || "",
    }),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const { t } = useTranslation();

  const categories = [
    { id: "all", labelKey: "testimonials.catAll" },
    { id: "back", labelKey: "testimonials.catBackPain" },
    { id: "shoulder", labelKey: "testimonials.catFrozenShoulder" },
    { id: "sports", labelKey: "testimonials.catSportsInjury" },
    { id: "quality", labelKey: "testimonials.catQuality" },
    { id: "hygiene", labelKey: "testimonials.catHygiene" },
  ];

  const filteredReviews =
    selectedCategory === "all"
      ? reviews
      : reviews.filter((r) => {
          const text = `${r.treatment || ""} ${r.review || ""}`.toLowerCase();
          if (selectedCategory === "back") return text.includes("back") || text.includes("sciatica") || text.includes("spine");
          if (selectedCategory === "shoulder") return text.includes("shoulder") || text.includes("frozen");
          if (selectedCategory === "sports") return text.includes("sports") || text.includes("injury") || text.includes("ligament") || text.includes("knee");
          if (selectedCategory === "quality") return text.includes("dr") || text.includes("rashid") || text.includes("physio") || text.includes("quality") || text.includes("treatment");
          if (selectedCategory === "hygiene") return text.includes("hygiene") || text.includes("staff") || text.includes("friendly") || text.includes("clean") || text.includes("behaviour");
          return true;
        });

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge={t("testimonials.liveReviewsBadge")}
          title={t("testimonials.liveReviewsTitle")}
          subtitle={t("testimonials.liveReviewsSubtitle")}
          className="mb-6 sm:mb-8"
        />

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-500 hover:text-teal-700"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Reviews Carousel Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop={filteredReviews.length > 3}
            className="!pb-14 [&_.swiper-pagination]:!bottom-0"
          >
            {filteredReviews.map((item) => {
              const reviewText = item.review || item.text || "";
              const isLong = reviewText.length > 130;

              return (
                <SwiperSlide key={item.id} className="h-auto flex mb-2">
                  <div className="w-full min-h-[225px] sm:min-h-[235px] h-full bg-white rounded-2xl border border-teal-500 p-3.5 xs:p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-sm">
                    {/* Header with Google icon & Stars */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <FcGoogle className="text-base sm:text-lg shrink-0" />
                        <span className="text-xs font-semibold text-slate-800">
                          Google Review
                        </span>
                      </div>

                      <div className="flex text-xs gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={
                              star <= Number(item.rating ?? 5)
                                ? "text-amber-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Clamped Review Text with inline read more */}
                    <div className="my-auto py-1">
                      <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed italic line-clamp-3">
                        "{reviewText}"
                      </p>
                      {isLong && (
                        <button
                          onClick={() => setSelectedReview(item)}
                          className="text-[11px] font-bold text-teal-600 hover:text-teal-800 mt-1 inline-block"
                        >
                          Read more...
                        </button>
                      )}
                    </div>

                    {/* Patient Info Footer */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 flex-shrink-0">
                      <div className="flex items-center gap-2 xs:gap-2.5 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                          {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] xs:text-[11px] text-teal-600 font-semibold flex items-center gap-1 truncate">
                            <span>Google Verified</span>
                            <FaCheckCircle className="text-[10px] text-teal-600 shrink-0" />
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] xs:text-[11px] text-slate-400 font-medium flex-shrink-0 ml-1.5 xs:ml-2">
                        {item.date || "Verified"}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>

        {/* Action Link to View Google Page */}
        <div className="flex justify-center items-center gap-3 mt-3 text-center px-2">
          <a
            href={GOOGLE_MAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 xs:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-colors text-center w-full xs:w-auto"
          >
            <FcGoogle className="text-base shrink-0" />
            <span>Read All Google Reviews on Maps</span>
            <FaExternalLinkAlt className="text-[10px] shrink-0" />
          </a>
        </div>
      </div>

      {/* Review Full Text Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-teal-500 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FcGoogle className="text-2xl" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {selectedReview.name}
                    </h3>
                    <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
                      <span>Google Verified Patient</span>
                      <FaCheckCircle className="text-[10px]" />
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <div className="flex text-sm gap-1 items-center">
                <div className="flex text-amber-400 text-sm gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= (selectedReview.rating || 5)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-xs ml-2 font-normal">
                  {selectedReview.date || "Verified Review"}
                </span>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{selectedReview.review || selectedReview.text}"
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-95 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
