import {
  FaUserMd,
  FaHeartbeat,
  FaHome,
  FaStethoscope,
  FaShieldAlt,
  FaRegSmile,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const featuresData = [
  {
    icon: <FaUserMd />,
    titleKey: "whyChooseUs.f1Title",
    descKey: "whyChooseUs.f1Desc",
  },
  {
    icon: <FaHeartbeat />,
    titleKey: "whyChooseUs.f2Title",
    descKey: "whyChooseUs.f2Desc",
  },
  {
    icon: <FaHome />,
    titleKey: "whyChooseUs.f3Title",
    descKey: "whyChooseUs.f3Desc",
  },
  {
    icon: <FaStethoscope />,
    titleKey: "whyChooseUs.f4Title",
    descKey: "whyChooseUs.f4Desc",
  },
  {
    icon: <FaShieldAlt />,
    titleKey: "whyChooseUs.f5Title",
    descKey: "whyChooseUs.f5Desc",
  },
  {
    icon: <FaRegSmile />,
    titleKey: "whyChooseUs.f6Title",
    descKey: "whyChooseUs.f6Desc",
  },
];

const WhyChooseUs = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="uppercase tracking-wider text-teal-600 font-semibold text-xs sm:text-sm">
            {t("whyChooseUs.badge")}
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-slate-900 leading-tight">
            {t("whyChooseUs.title")}
          </h2>

          <div className="w-12 h-1 bg-teal-600 rounded-full mx-auto my-3"></div>

          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            {t("whyChooseUs.subtitle")}
          </p>
        </div>

        {/* Feature Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {featuresData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="
                group
                flex
                flex-col
                bg-white
                rounded-2xl
                p-5
                border
                border-slate-100
                shadow-sm
                hover:shadow-md
                hover:border-teal-200/80
                transition-all
                duration-250
              "
            >
              {/* Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-250 flex-shrink-0">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 leading-snug">
                {t(item.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;