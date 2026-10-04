import { FaHeart, FaAward, FaShieldAlt, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionHeader from "../common/SectionHeader";

const valuesData = [
  {
    icon: <FaHeart />,
    titleKey: "coreValues.v1Title",
    descKey: "coreValues.v1Desc",
  },
  {
    icon: <FaAward />,
    titleKey: "coreValues.v2Title",
    descKey: "coreValues.v2Desc",
  },
  {
    icon: <FaShieldAlt />,
    titleKey: "coreValues.v3Title",
    descKey: "coreValues.v3Desc",
  },
  {
    icon: <FaUserMd />,
    titleKey: "coreValues.v4Title",
    descKey: "coreValues.v4Desc",
  },
];

const CoreValues = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge={t("coreValues.badge")}
          title={t("coreValues.title")}
          subtitle={t("coreValues.subtitle")}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {valuesData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="bg-gray-50 p-6 md:p-8 rounded-3xl shadow-md text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl text-teal-600 mb-4 md:mb-5 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-900">
                {t(item.titleKey)}
              </h3>

              <p className="text-gray-600 text-sm md:text-base leading-7">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;