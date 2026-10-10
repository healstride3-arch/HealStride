import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";
import { CalendarCheck, ChevronDown } from "lucide-react";

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

import { ALL_SERVICES } from "../../data/servicesData";

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

const categoryIconMap = {
  spine: FaBone,
  therapies: FaBolt,
  rehab: FaHandsHelping,
  electro: FaBolt,
};

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

const OurServices = () => {
  const { t, i18n } = useTranslation();
  const [showAllMobile, setShowAllMobile] = useState(false);

  const { items: rawFirestoreServices } = useFirestoreCollection("services", {
    fallback: [],
  });

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
      .filter((s) => s.active !== false && s.showOnHome !== false && !isExcluded(s));
  })();

  return (
    <section
      id="services"
      className="py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-white to-teal-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <SectionHeader
          badge={t("ourServices.badge")}
          title={t("ourServices.title")}
          subtitle={t("ourServices.subtitle")}
        />

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
            {services.slice(0, 6).map((service, index) => {
              const Icon =
                (service.icon && iconMap[service.icon]) || categoryIconMap[service.category] || FaHeartbeat;
              const slug = (service.slug || service.id || "").toLowerCase().trim();
              const camelKey = slug.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
              const isHi = (i18n?.language || "").startsWith("hi");
              const localizedTitle =
                service.fromFirestore && service.title
                  ? isHi && t(`servicesList.${camelKey}Title`) !== `servicesList.${camelKey}Title`
                    ? t(`servicesList.${camelKey}Title`)
                    : service.title
                  : t(`servicesList.${camelKey}Title`, { defaultValue: service.title });
              const localizedDesc =
                service.fromFirestore && service.description
                  ? isHi && t(`servicesList.${camelKey}Desc`) !== `servicesList.${camelKey}Desc`
                    ? t(`servicesList.${camelKey}Desc`)
                    : service.description
                  : t(`servicesList.${camelKey}Desc`, { defaultValue: service.description });

              return (
                <motion.div
                  key={service.id}
                  className={`
                    ${index >= 3 && !showAllMobile ? "hidden sm:flex" : "flex"}
                    group
                    h-full
                    flex-col
                    justify-between
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border
                    border-teal-500
                    transition-all
                    duration-200
                  `}
                >
                  {/* Image */}
                  <Link
                    to={`/services/${service.slug}`}
                    className="relative overflow-hidden aspect-[16/10] sm:aspect-[4/3] w-full flex-shrink-0 bg-slate-100 block"
                  >
                    <img
                      src={service.imageUrl || service.image}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                    {/* Icon Badge */}
                    <div
                      className="
                        absolute
                        top-3.5
                        left-3.5
                        bg-teal-600
                        text-white
                        w-9
                        h-9
                        sm:w-11
                        sm:h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-sm
                        sm:text-lg
                        shadow-md
                      "
                    >
                      <Icon />
                    </div>

                    {/* Title */}
                    <h3
                      className="
                        absolute
                        bottom-3
                        left-3.5
                        right-3.5
                        text-white
                        text-base
                        sm:text-lg
                        font-bold
                        truncate
                        group-hover:text-teal-200
                        transition-colors
                      "
                    >
                      {localizedTitle}
                    </h3>
                  </Link>

                  {/* Content Container */}
                  <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between">
                    <p
                      className="
                        text-slate-600
                        text-xs
                        sm:text-sm
                        leading-relaxed
                        line-clamp-2
                        min-h-0 sm:min-h-[38px]
                      "
                    >
                      {localizedDesc}
                    </p>

                    <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-100 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="
                          inline-flex
                          items-center
                          justify-center xs:justify-start
                          gap-1.5
                          text-teal-600
                          font-semibold
                          hover:text-teal-700
                          transition-colors
                          text-xs
                          sm:text-sm
                          group/link
                          py-1 xs:py-0
                        "
                      >
                        <span>{t("ourServices.learnMore", "Learn More")}</span>
                        <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">
                          →
                        </span>
                      </Link>

                      <Link
                        to="/booking"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          bg-gradient-to-r from-[#d71920] to-[#008272]
                          hover:from-[#b91c1c] hover:to-[#0f766e]
                          active:scale-95
                          text-white
                          px-3 xs:px-3.5
                          py-2 sm:py-2.5
                          min-h-[36px] sm:min-h-[38px]
                          rounded-xl
                          text-xs
                          font-bold
                          shadow-sm
                          hover:shadow-md
                          transition-all
                          text-center
                        "
                      >
                        <CalendarCheck size={14} className="shrink-0" />
                        <span>{t("navbar.bookAppointment", "Book Appointment")}</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Action Buttons: Mobile Show More Toggle + View All Services Link */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Mobile Only: Show More / Show Less Toggle (when more than 3 cards) */}
          {services.slice(0, 6).length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllMobile((prev) => !prev)}
              className="
                sm:hidden
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                bg-teal-50
                hover:bg-teal-100
                text-teal-700
                border
                border-teal-200
                font-bold
                text-xs
                px-5
                py-3
                rounded-xl
                transition-all
                active:scale-[0.98]
                cursor-pointer
              "
            >
              <span>
                {showAllMobile
                  ? t("ourServices.showLess", "Show Less")
                  : `${t("ourServices.showMore", "Show More Services")} (${services.slice(0, 6).length - 3})`}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  showAllMobile ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* View All Services Link */}
          <Link
            to="/services"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-gradient-to-r from-[#d71920] to-[#008272]
              hover:from-[#b91c1c] hover:to-[#0f766e]
              active:scale-[0.98]
              text-white
              px-6 sm:px-8
              py-3 sm:py-3.5
              rounded-xl
              font-bold
              text-xs sm:text-sm md:text-base
              shadow-md
              hover:shadow-lg
              transition-all
              duration-200
              group
              w-full sm:w-auto
            "
          >
            <span>{t("ourServices.viewAll")}</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
