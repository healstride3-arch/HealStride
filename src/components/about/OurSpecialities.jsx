import { motion } from "framer-motion";
import {
  Activity,
  Bone,
  Dumbbell,
  Brain,
  HeartPulse,
  ShieldPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const specialitiesData = [
  {
    icon: Bone,
    titleKey: "ourSpecialities.s1Title",
    descKey: "ourSpecialities.s1Desc",
  },
  {
    icon: Dumbbell,
    titleKey: "ourSpecialities.s2Title",
    descKey: "ourSpecialities.s2Desc",
  },
  {
    icon: Activity,
    titleKey: "ourSpecialities.s3Title",
    descKey: "ourSpecialities.s3Desc",
  },
  {
    icon: HeartPulse,
    titleKey: "ourSpecialities.s4Title",
    descKey: "ourSpecialities.s4Desc",
  },
  {
    icon: Brain,
    titleKey: "ourSpecialities.s5Title",
    descKey: "ourSpecialities.s5Desc",
  },
  {
    icon: ShieldPlus,
    titleKey: "ourSpecialities.s6Title",
    descKey: "ourSpecialities.s6Desc",
  },
];

const OurSpecialities = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            {t("ourSpecialities.badge")}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            {t("ourSpecialities.title")}
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
            {t("ourSpecialities.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialitiesData.map((item, index) => (
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
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                <item.icon
                  size={30}
                  className="text-blue-600"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {t(item.titleKey)}
              </h3>

              <p className="text-gray-600 leading-7">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSpecialities;