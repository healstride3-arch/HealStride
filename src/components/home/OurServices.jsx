import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

import {
  FaHandsHelping,
  FaRunning,
  FaDumbbell,
  FaBolt,
  FaHeartbeat,
  FaProcedures,
  FaMedkit,
  FaBone,
} from "react-icons/fa";

import treatment1 from "../../assets/images/treatment1.jpg";
import treatment2 from "../../assets/images/treatment2.jpg";
import treatment3 from "../../assets/images/treatment3.jpg";
import treatment4 from "../../assets/images/treatment4.jpg";
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
import postsurgeryrehab from "../../assets/images/postsurgeryrehab.jpg";

const iconMap = {
  activity: FaHeartbeat,
  heart: FaHeartbeat,
  dumbbell: FaDumbbell,
  running: FaRunning,
  hands: FaHandsHelping,
  bolt: FaBolt,
  bone: FaBone,
  medkit: FaMedkit,
  procedures: FaProcedures,
};

const defaultHomeServices = [
  {
    id: "cervical-pain",
    title: "Cervical Pain Treatment",
    slug: "cervical-pain",
    imageUrl: neckpain,
    icon: "bone",
    description: "Specialized therapy to relieve neck stiffness, cervical nerve compression, and posture-related pain.",
  },
  {
    id: "back-pain",
    title: "Back Pain Relief",
    slug: "back-pain",
    imageUrl: backpain,
    icon: "running",
    description: "Comprehensive physical therapy for acute/chronic lumbar pain, disc herniation, and spine mobility.",
  },
  {
    id: "knee-pain",
    title: "Knee Pain Care",
    slug: "knee-pain",
    imageUrl: kneepain,
    icon: "bone",
    description: "Targeted rehabilitation for knee arthritis, ligament sprains (ACL/MCL), and joint stiffness.",
  },
  {
    id: "tennis-elbow",
    title: "Tennis Elbow Therapy",
    slug: "tennis-elbow",
    imageUrl: tenniselbow,
    icon: "bone",
    description: "Effective tendon rehab and strengthening for forearm muscle strain and elbow joint inflammation.",
  },
  {
    id: "plantar-fasciitis",
    title: "Plantar Fasciitis Care",
    slug: "plantar-fasciitis",
    imageUrl: plantarfasciitis,
    icon: "running",
    description: "Targeted heel pain and foot arch treatment for comfortable, pain-free morning steps and walking.",
  },
  {
    id: "frozen-shoulder",
    title: "Frozen Shoulder Rehab",
    slug: "frozen-shoulder",
    imageUrl: frozenshoulder,
    icon: "activity",
    description: "Gentle mobilization techniques and therapeutic stretching to regain complete shoulder movement.",
  },
  {
    id: "osteoarthritis",
    title: "Osteoarthritis Management",
    slug: "osteoarthritis",
    imageUrl: osteoarthritis,
    icon: "bone",
    description: "Therapeutic joint exercise programs to preserve cartilage, reduce stiffness, and boost strength.",
  },
  {
    id: "sciatica",
    title: "Sciatica Pain Therapy",
    slug: "sciatica",
    imageUrl: sciaticapain,
    icon: "running",
    description: "Targeted sciatic nerve decompression, spinal traction, and core stabilizing exercises.",
  },
  {
    id: "stroke-rehab",
    title: "Stroke Rehabilitation",
    slug: "stroke-rehab",
    imageUrl: strokerehab,
    icon: "heart",
    description: "Neurological therapy designed to help patients regain motor control, balance, and daily independence.",
  },
  {
    id: "sports-rehab",
    title: "Sports Rehabilitation",
    slug: "sports-rehab",
    imageUrl: treatment4,
    icon: "bolt",
    description: "High-performance recovery protocols to help athletes heal fast and prevent future sports injuries.",
  },
  {
    id: "post-surgery-physio",
    title: "Post Surgery Physio",
    slug: "post-surgery-physio",
    imageUrl: postsurgeryrehab,
    icon: "procedures",
    description: "Guided post-operative rehabilitation for joint replacements, fracture repairs, and spine surgeries.",
  },
  {
    id: "pain-reduction",
    title: "Pain Reduction Therapy",
    slug: "pain-reduction",
    imageUrl: treatment6,
    icon: "medkit",
    description: "Advanced physical modalities combined with hands-on manual techniques for swift and lasting relief.",
  },
  {
    id: "cupping-therapy",
    title: "Cupping (Hijama) Therapy",
    slug: "cupping-therapy",
    imageUrl: treatment3,
    icon: "hands",
    description: "Traditional therapeutic cupping (Hijama) to release deep fascial tension, detoxify, and boost blood flow.",
  },
  {
    id: "dry-needling",
    title: "Dry Needling Therapy",
    slug: "dry-needling",
    imageUrl: treatment2,
    icon: "activity",
    description: "Targeted fine filiform needle stimulation to deactivate painful trigger points and deep muscle knots.",
  },
  {
    id: "iastm-therapy",
    title: "IASTM Therapy",
    slug: "iastm-therapy",
    imageUrl: treatment7,
    icon: "hands",
    description: "Instrument-Assisted Soft Tissue Mobilization using ergonomic instruments for accelerated healing.",
  },
  {
    id: "exercise-therapy",
    title: "Exercise Therapy For Various Conditions",
    slug: "exercise-therapy",
    imageUrl: treatment5,
    icon: "dumbbell",
    description: "Customized therapeutic strengthening, stretching, and functional movements for every patient.",
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

const OurServices = () => {
  const { t } = useTranslation();

  const { items: services } = useFirestoreCollection("services", {
    constraints: [where("active", "!=", false)],
    fallback: defaultHomeServices.filter((s) => !isExcluded(s)),
  });

  return (
    <section
      id="services"
      className="py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-white to-teal-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="uppercase tracking-[3px] sm:tracking-[6px] text-teal-600 font-semibold text-xs sm:text-sm">
            {t("ourServices.badge")}
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mt-2 sm:mt-4 text-slate-900 leading-tight">
            {t("ourServices.title")}
          </h2>

          <div className="w-16 sm:w-24 h-1 bg-teal-600 rounded-full mx-auto mt-3 sm:mt-6 mb-3 sm:mb-6"></div>

          <p className="text-gray-600 max-w-3xl mx-auto text-xs sm:text-base lg:text-lg leading-relaxed sm:leading-8">
            {t("ourServices.subtitle")}
          </p>
        </motion.div>

        {/* No services */}
        {services.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No services available.
          </div>
        )}

        {/* Cards */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {services.slice(0, 6).map((service) => {
              const Icon =
                iconMap[service.icon] || FaHeartbeat;
              const slug = (service.slug || service.id || "").toLowerCase().trim();
              const camelKey = slug.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
              const localizedTitle = t(`servicesList.${camelKey}Title`, { defaultValue: service.title });
              const localizedDesc = t(`servicesList.${camelKey}Desc`, { defaultValue: service.description });

              return (
                <motion.div
                  key={service.id}
                  className="
                    group
                    h-full
                    flex
                    flex-col
                    justify-between
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border
                    border-teal-500
                    transition-all
                    duration-200
                  "
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48 sm:h-52 w-full flex-shrink-0 bg-slate-100">
                    <img
                      src={service.imageUrl || treatment1}
                      alt={localizedTitle}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-300
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>

                    {/* Icon Badge */}
                    <div
                      className="
                        absolute
                        top-3.5
                        left-3.5
                        bg-teal-600
                        text-white
                        w-10
                        h-10
                        sm:w-11
                        sm:h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-base
                        sm:text-lg
                      "
                    >
                      <Icon />
                    </div>

                    {/* Title */}
                    <h3
                      className="
                        absolute
                        bottom-3.5
                        left-4
                        right-4
                        text-white
                        text-base
                        sm:text-lg
                        font-bold
                        truncate
                      "
                    >
                      {localizedTitle}
                    </h3>
                  </div>

                  {/* Content Container */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <p
                      className="
                        text-slate-600
                        text-xs
                        sm:text-sm
                        leading-relaxed
                        line-clamp-2
                        min-h-[38px]
                      "
                    >
                      {localizedDesc}
                    </p>

                    <div className="mt-4 pt-2">
                      <Link
                        to="/booking"
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-teal-600
                          font-semibold
                          hover:text-teal-700
                          transition-colors
                          text-xs
                          sm:text-sm
                          group/link
                        "
                      >
                        <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">
                          {t("ourServices.learnMore")}
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Services / Show More Button */}
        {services.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8 sm:mt-10"
          >
            <Link
              to="/services"
              className="
                inline-flex
                items-center
                gap-2
                bg-teal-600
                text-white
                hover:bg-teal-700
                px-8
                py-3.5
                rounded-xl
                font-semibold
                text-sm
                sm:text-base
                shadow-sm
                hover:shadow-md
                transition-all
                duration-200
                group
              "
            >
              <span>{t("ourServices.viewAll")}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurServices;
