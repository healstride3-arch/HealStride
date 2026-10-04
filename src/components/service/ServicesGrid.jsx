import SectionHeader from "../common/SectionHeader";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { ALL_SERVICES } from "../../data/servicesData";
import treatment1 from "../../assets/images/treatment1.jpg";

// Specifically EXCLUDES: Female Chiropractor, Navel Displacement Treatment, Osteopathy
const isExcluded = (s) => {
  const name = (s.title || s.name || s.slug || s.id || "").toLowerCase().trim();
  return (
    name.includes("female chiro") ||
    name.includes("female-chiro") ||
    name.includes("navel displacement") ||
    name.includes("navel-displacement") ||
    name.includes("osteopathy") ||
    name === "manual therapy" ||
    name === "manual-therapy"
  );
};

const categories = [
  { id: "all", labelKey: "servicesGrid.catAll", fallback: "All 15 Treatments" },
  { id: "spine", labelKey: "servicesGrid.catSpine", fallback: "Spine & Posture" },
  { id: "therapies", labelKey: "servicesGrid.catTherapies", fallback: "Advanced Therapies" },
  { id: "rehab", labelKey: "servicesGrid.catRehab", fallback: "Rehabilitation & Care" },
];

const ServicesGrid = () => {
  const { t, i18n } = useTranslation();

  const { items: rawFirestoreServices } = useFirestoreCollection("services", {
    fallback: [],
  });

  // 15 official PainFlame services from ALL_SERVICES (canonical single source of truth)
  // Ensures brand new AI images with Indian doctors and verified clinical content are ALWAYS displayed
  const services = (() => {
    return ALL_SERVICES
      .filter((s) => !isExcluded(s))
      .map((s) => {
        const sKey = (s.slug || s.id).toLowerCase();
        const fs = (rawFirestoreServices || []).find((item) => {
          const itemKey = (item.slug || item.id || item.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return itemKey === sKey;
        });

        if (!fs) return s;

        // Only accept custom uploaded images from Firebase Storage
        const isUploadedStorageImg = fs.imageUrl && (
          fs.imageUrl.startsWith("https://firebasestorage") ||
          fs.imageUrl.startsWith("data:image")
        );

        return {
          ...s,
          active: fs.active !== undefined ? fs.active : s.active,
          imageUrl: isUploadedStorageImg ? fs.imageUrl : s.imageUrl,
          image: isUploadedStorageImg ? fs.imageUrl : s.imageUrl,
        };
      })
      .filter((s) => s.active !== false && !isExcluded(s));
  })();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-slate-50 border-b border-slate-200/80 min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <SectionHeader
          badge="Evidence-Based Care"
          title="Our Specialized Treatments & Therapies"
          subtitle="Non-surgical, clinically validated rehabilitation programs designed for rapid pain relief and long-term joint health."
        />

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sm:mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${
                    selectedCategory === cat.id
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200"
                  }
                `}
              >
                {t(cat.labelKey, { defaultValue: cat.fallback })}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments or pain area..."
              className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* No Services Found */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-6">
            <p className="text-slate-700 font-semibold text-base mb-1">No Treatments Found</p>
            <p className="text-slate-500 text-xs sm:text-sm mb-4">Try searching with a different keyword or reset filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {filteredServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {filteredServices.map((service, index) => {
              const slug = (service.slug || service.id || "").toLowerCase().trim();
              const localizedTitle = service.title;
              const localizedDesc = service.description;

              return (
                <motion.div
                  key={service.id || slug}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: (index % 6) * 0.05,
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
                    to={`/services/${slug}`}
                    className="relative overflow-hidden aspect-[4/3] w-full flex-shrink-0 bg-slate-100 block"
                  >
                    <img
                      src={service.imageUrl || service.image || treatment1}
                      alt={localizedTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.categoryLabel && (
                      <div className="absolute top-3 left-3 bg-teal-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                        {service.categoryLabel}
                      </div>
                    )}
                    {service.duration && (
                      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title */}
                      <Link to={`/services/${slug}`} className="hover:text-teal-700 transition-colors">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {localizedTitle}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[38px]">
                        {localizedDesc}
                      </p>

                      {/* Benefits */}
                      {service.benefits?.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100">
                          <ul className="text-xs text-slate-600 space-y-1.5">
                            {service.benefits.slice(0, 3).map((benefit, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Details & Book Appointment */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/services/${slug}`}
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
                        to="/booking"
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-1
                          bg-gradient-to-r
                          from-[#d71920]
                          to-[#008272]
                          hover:from-[#b91c1c]
                          hover:to-[#0f766e]
                          text-white
                          font-semibold
                          text-xs
                          sm:text-sm
                          py-2.5
                          px-3
                          rounded-xl
                          transition-opacity
                          shadow-sm
                        "
                      >
                        <span>Book</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
