import { motion } from "framer-motion";
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const trustCardsData = [
  {
    icon: Award,
    titleKey: "whyPatientsTrustUs.c1Title",
    descKey: "whyPatientsTrustUs.c1Desc",
  },
  {
    icon: Users,
    titleKey: "whyPatientsTrustUs.c2Title",
    descKey: "whyPatientsTrustUs.c2Desc",
  },
  {
    icon: HeartHandshake,
    titleKey: "whyPatientsTrustUs.c3Title",
    descKey: "whyPatientsTrustUs.c3Desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "whyPatientsTrustUs.c4Title",
    descKey: "whyPatientsTrustUs.c4Desc",
  },
];

const WhyPatientsTrustUs = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            {t("whyPatientsTrustUs.badge")}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-slate-900 leading-tight">
            {t("whyPatientsTrustUs.title")}
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {t("whyPatientsTrustUs.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCardsData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
              className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
                <card.icon
                  size={30}
                  className="text-blue-600"
                />
              </div>

              <h3 className="text-xl font-semibold text-slate-800">
                {t(card.titleKey)}
              </h3>

              <p className="mt-3 text-gray-600 leading-7">
                {t(card.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPatientsTrustUs;