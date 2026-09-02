import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { googleReviews as defaultReviews } from "../../data/googleReviews";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { FaQuoteLeft, FaStar, FaMapMarkerAlt, FaCheckCircle, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const GOOGLE_MAPS_REVIEW_URL =
  "https://www.google.com/maps/search/?api=1&query=Heal+Stride+Physiotherapy+%26+Wellness+Centre+LIG+85+Raisen+Rd+near+gurudwara+New+Subhash+Nagar+Bhopal";

const Testimonials = () => {
  const { items: reviews } = useFirestoreCollection("testimonials", {
    constraints: [where("active", "!=", false)],
    fallback: defaultReviews,
    mapItem: (item) => ({
      ...item,
      review: item.review || item.text || "",
      treatment: item.treatment || item.designation || "",
    }),
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReview, setSelectedReview] = useState(null);
  const { t } = useTranslation();

  const categories = [
    "All",
    "Back Pain Treatment",
    "Frozen Shoulder",
    "Sports Injury & Rehab",
    "Quality Physiotherapy",
    "Hygiene & Staff",
  ];

  const filteredReviews =
    selectedCategory === "All"
      ? reviews
      : reviews.filter((r) => {
          const text = `${r.treatment || ""} ${r.review || ""}`.toLowerCase();
          if (selectedCategory === "Back Pain Treatment") return text.includes("back") || text.includes("sciatica") || text.includes("spine");
          if (selectedCategory === "Frozen Shoulder") return text.includes("shoulder") || text.includes("frozen");
          if (selectedCategory === "Sports Injury & Rehab") return text.includes("sports") || text.includes("injury") || text.includes("ligament") || text.includes("knee");
          if (selectedCategory === "Quality Physiotherapy") return text.includes("dr") || text.includes("rashid") || text.includes("physio") || text.includes("quality") || text.includes("treatment");
          if (selectedCategory === "Hygiene & Staff") return text.includes("hygiene") || text.includes("staff") || text.includes("friendly") || text.includes("clean") || text.includes("behaviour");
          return true;
        });

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Google Reviews & Ratings</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Real Patients, Real Google Feedback
          </h2>

          <p className="text-slate-600 mt-2.5 text-xs sm:text-base leading-relaxed">
            Verified patient reviews from Google for HealStride Physiotherapy & Wellness Centre in Bhopal.
          </p>

          {/* Google Business Live Summary Card */}
          <div className="mt-6 bg-white rounded-2xl border border-teal-500/40 p-4 sm:p-5 shadow-sm max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left Rating Info */}
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                  <FcGoogle />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">4.7</span>
                    <div className="flex text-amber-400 text-sm gap-0.5">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Based on 43+ Google Reviews • Open & Active
                  </p>
                </div>
              </div>

              {/* Right CTA */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={GOOGLE_MAPS_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <FcGoogle className="bg-white rounded-full p-0.5 text-base" />
                  <span>Review on Google</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
            </div>

            {/* Address Banner */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-xs text-slate-600 text-center sm:text-left">
              <FaMapMarkerAlt className="text-teal-600 flex-shrink-0" />
              <span>LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Ashoka Garden, Bhopal (462023)</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-500 hover:text-teal-700"
              }`}
            >
              {cat}
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
                  <div className="w-full h-[225px] sm:h-[235px] bg-white rounded-2xl border border-teal-500 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-sm">
                    {/* Header with Google icon & Stars */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <FcGoogle className="text-lg" />
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
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                          {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
                            <span>Google Verified</span>
                            <FaCheckCircle className="text-[10px] text-teal-600" />
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium flex-shrink-0 ml-2">
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
        <div className="flex justify-center items-center gap-3 mt-3 text-center">
          <a
            href={GOOGLE_MAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-colors"
          >
            <FcGoogle className="text-base" />
            <span>Read All Google Reviews on Maps</span>
            <FaExternalLinkAlt className="text-[10px]" />
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
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
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
