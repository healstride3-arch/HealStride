import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

import treatment1 from "../../assets/images/treatment1.jpg";
import treatment2 from "../../assets/images/treatment2.jpg";
import treatment3 from "../../assets/images/treatment3.jpg";
import treatment5 from "../../assets/images/treatment5.jpg";
import treatment6 from "../../assets/images/treatment6.jpg";
import treatment7 from "../../assets/images/treatment7.jpg";
import neckpain from "../../assets/images/neckpain.jpg";
import backpain from "../../assets/images/backpain.jpg";
import kneepain from "../../assets/images/kneepain.jpg";
import tenniselbow from "../../assets/images/tenniselbow.jpg";
import plantarfasciitis from "../../assets/images/plantarfasciitis.jpg";
import frozenshoulder from "../../assets/images/frozenshoulder.jpg";
import osteoarthritis from "../../assets/images/Osteoarthritis.jpg";
import sciaticapain from "../../assets/images/sciaticapain.jpg";
import strokerehab from "../../assets/images/strokerehab.jpg";
import sportsinjury from "../../assets/images/sportsinjury.jpg";
import postsurgeryrehab from "../../assets/images/postsurgeryrehab.jpg";

const defaultServices = [
  {
    id: "cervical-pain",
    title: "Cervical Pain Treatment",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    slug: "cervical-pain",
    imageUrl: neckpain,
    description: "Specialized therapy to relieve neck stiffness, cervical nerve compression, and posture-related pain.",
    benefits: ["Relieves neck & upper back stiffness", "Reduces radiating arm pain & tingling", "Restores head & neck movement"],
    duration: "45-60 mins",
  },
  {
    id: "back-pain",
    title: "Back Pain Relief",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    slug: "back-pain",
    imageUrl: backpain,
    description: "Comprehensive physical therapy for acute/chronic lumbar pain, disc herniation, and spine mobility.",
    benefits: ["Rapid spinal pain relief", "Core & lower back strengthening", "Prevents recurring back spasms"],
    duration: "45-60 mins",
  },
  {
    id: "knee-pain",
    title: "Knee Pain Care",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    slug: "knee-pain",
    imageUrl: kneepain,
    description: "Targeted rehabilitation for knee arthritis, ligament sprains (ACL/MCL), and joint stiffness.",
    benefits: ["Reduces joint swelling & pain", "Improves walking stability", "Strengthens quadriceps & hamstrings"],
    duration: "45-60 mins",
  },
  {
    id: "tennis-elbow",
    title: "Tennis Elbow Therapy",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    slug: "tennis-elbow",
    imageUrl: tenniselbow,
    description: "Effective tendon rehab and strengthening for forearm muscle strain and elbow joint inflammation.",
    benefits: ["Relieves outer elbow pain", "Improves grip strength", "Speeds up tendon tissue recovery"],
    duration: "30-45 mins",
  },
  {
    id: "plantar-fasciitis",
    title: "Plantar Fasciitis Care",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    slug: "plantar-fasciitis",
    imageUrl: plantarfasciitis,
    description: "Targeted heel pain and foot arch treatment for comfortable, pain-free morning steps and walking.",
    benefits: ["Eases morning heel stabbing pain", "Stretches tight calf & plantar fascia", "Custom arch load distribution"],
    duration: "30-45 mins",
  },
  {
    id: "frozen-shoulder",
    title: "Frozen Shoulder Rehab",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    slug: "frozen-shoulder",
    imageUrl: frozenshoulder,
    description: "Gentle mobilization techniques and therapeutic stretching to regain complete shoulder movement.",
    benefits: ["Restores overhead arm range", "Alleviates persistent night ache", "Prevents joint capsule adhesions"],
    duration: "45-60 mins",
  },
  {
    id: "osteoarthritis",
    title: "Osteoarthritis Management",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    slug: "osteoarthritis",
    imageUrl: osteoarthritis,
    description: "Therapeutic joint exercise programs to preserve cartilage, reduce stiffness, and boost strength.",
    benefits: ["Delays joint degeneration", "Maintains independent mobility", "Reduces joint friction & pain"],
    duration: "45-60 mins",
  },
  {
    id: "sciatica",
    title: "Sciatica Pain Therapy",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    slug: "sciatica",
    imageUrl: sciaticapain,
    description: "Targeted sciatic nerve decompression, spinal traction, and core stabilizing exercises.",
    benefits: ["Relieves shooting leg & hip pain", "Decompresses pinched spinal nerves", "Restores normal posture"],
    duration: "45-60 mins",
  },
  {
    id: "stroke-rehab",
    title: "Stroke Rehabilitation",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    slug: "stroke-rehab",
    imageUrl: strokerehab,
    description: "Neurological therapy designed to help patients regain motor control, balance, and daily independence.",
    benefits: ["Relearns motor patterns & balance", "Prevents limb spasticity & weakness", "Promotes independence"],
    duration: "60 mins",
  },
  {
    id: "sports-rehab",
    title: "Sports Rehabilitation",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    slug: "sports-rehab",
    imageUrl: sportsinjury,
    description: "High-performance recovery protocols to help athletes heal fast and prevent future sports injuries.",
    benefits: ["Faster return to sports", "Agility and neuromuscular conditioning", "Injury prevention protocols"],
    duration: "45-60 mins",
  },
  {
    id: "post-surgery-physio",
    title: "Post Surgery Physio",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    slug: "post-surgery-physio",
    imageUrl: postsurgeryrehab,
    description: "Guided post-operative rehabilitation for joint replacements, fracture repairs, and spine surgeries.",
    benefits: ["Safe progressive recovery", "Prevents scar tissue stiffness", "Restores muscular endurance"],
    duration: "45-60 mins",
  },
  {
    id: "pain-reduction",
    title: "Pain Reduction Therapy",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    slug: "pain-reduction",
    imageUrl: treatment6,
    description: "Advanced modalities combined with hands-on manual techniques for swift and lasting relief.",
    benefits: ["Non-invasive fast pain control", "Improves local blood circulation", "Decreases muscle spasms"],
    duration: "30-45 mins",
  },
  {
    id: "cupping-therapy",
    title: "Cupping (Hijama) Therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    slug: "cupping-therapy",
    imageUrl: treatment3,
    description: "Traditional therapeutic cupping (Hijama) to release deep fascial tension, detoxify, and boost blood flow.",
    benefits: ["Enhances cellular microcirculation", "Releases deep myofascial tension", "Accelerates natural healing"],
    duration: "30-45 mins",
  },
  {
    id: "dry-needling",
    title: "Dry Needling Therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    slug: "dry-needling",
    imageUrl: treatment2,
    description: "Targeted fine filiform needle stimulation to deactivate painful trigger points and deep muscle knots.",
    benefits: ["Instantly releases trigger knots", "Restores muscle length & flexibility", "Reduces referred pain"],
    duration: "30-45 mins",
  },
  {
    id: "iastm-therapy",
    title: "IASTM Therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    slug: "iastm-therapy",
    imageUrl: treatment7,
    description: "Instrument-Assisted Soft Tissue Mobilization using ergonomic instruments for accelerated healing.",
    benefits: ["Breaks down fascial adhesions & scar tissue", "Improves cellular repair", "Restores muscle glide"],
    duration: "30-45 mins",
  },
  {
    id: "exercise-therapy",
    title: "Exercise Therapy For Various Conditions",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    slug: "exercise-therapy",
    imageUrl: treatment5,
    description: "Customized therapeutic strengthening, stretching, and functional movements for every patient.",
    benefits: ["Builds strength & functional endurance", "Corrects postural imbalances", "Prevents injury recurrence"],
    duration: "45-60 mins",
  },
];

const isExcluded = (s) => {
  const name = (s.title || s.name || s.slug || s.id || "").toLowerCase().trim();
  return (
    name === "manual therapy" ||
    name === "manual-therapy" ||
    name === "physiotherapy" ||
    name === "physiotherapy services" ||
    name === "physiotherapy-services" ||
    name.includes("manual therapy")
  );
};

const categories = [
  { id: "all", labelKey: "servicesGrid.catAll" },
  { id: "spine", labelKey: "servicesGrid.catSpine" },
  { id: "joints", labelKey: "servicesGrid.catJoints" },
  { id: "therapies", labelKey: "servicesGrid.catTherapies" },
  { id: "rehab", labelKey: "servicesGrid.catRehab" },
];

const ServicesGrid = () => {
  const { t } = useTranslation();

  const { items: services } = useFirestoreCollection("services", {
    constraints: [where("active", "!=", false)],
    fallback: defaultServices.filter((s) => !isExcluded(s)),
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-slate-50 border-b border-slate-200/80 min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            {t("servicesGrid.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("servicesGrid.title")}
          </h2>
          <p className="text-slate-600 mt-2.5 text-xs sm:text-base leading-relaxed">
            {t("servicesGrid.subtitle")}
          </p>
        </motion.div>

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
                {t(cat.labelKey)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("servicesGrid.searchPlaceholder")}
              className="w-full px-4 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* No Services Found */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-6">
            <p className="text-slate-700 font-semibold text-base mb-1">{t("servicesGrid.noServices")}</p>
            <p className="text-slate-500 text-xs sm:text-sm mb-4">{t("servicesGrid.noServicesDesc")}</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition cursor-pointer"
            >
              {t("servicesGrid.resetFilters")}
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {filteredServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {filteredServices.map((service, index) => {
              const slug = (service.slug || service.id || "").toLowerCase().trim();
              const camelKey = slug.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
              const localizedTitle = t(`servicesList.${camelKey}Title`, { defaultValue: service.title });
              const localizedDesc = t(`servicesList.${camelKey}Desc`, { defaultValue: service.description });

              return (
              <motion.div
                key={service.id}
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
                  border-teal-500
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
                <div className="relative overflow-hidden h-48 sm:h-52 w-full flex-shrink-0 bg-slate-100">
                  <img
                    src={service.imageUrl || treatment1}
                    alt={localizedTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {service.categoryLabel && (
                    <div className="absolute top-3 left-3 bg-teal-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase">
                      {service.categoryLabel}
                    </div>
                  )}
                  {service.duration && (
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                      ⏱ {service.duration}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {localizedTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[38px]">
                      {localizedDesc}
                    </p>

                    {/* Benefits */}
                    {service.benefits?.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          {service.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold flex-shrink-0">✓</span>
                              <span className="line-clamp-1">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Appointment Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to="/booking"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-1.5
                        w-full
                        bg-teal-600
                        hover:bg-teal-700
                        text-white
                        font-semibold
                        text-xs
                        sm:text-sm
                        py-2.5
                        px-4
                        rounded-xl
                        transition-colors
                      "
                    >
                      <span>{t("servicesGrid.bookAppointment")}</span>
                      <span>→</span>
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
