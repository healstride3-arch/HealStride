import { motion } from "framer-motion";
import {
  FaBone,
  FaWalking,
  FaHeartbeat,
  FaRunning,
  FaHandsHelping,
  FaMedkit,
  FaProcedures,
  FaUserMd,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ConditionSlider from "./ConditionSlider";

const conditionsData = [
  { key: "cervicalPain", icon: FaBone },
  { key: "backPain", icon: FaWalking },
  { key: "kneePain", icon: FaBone },
  { key: "tennisElbow", icon: FaBone },
  { key: "plantarFasciitis", icon: FaWalking },
  { key: "frozenShoulder", icon: FaHeartbeat },
  { key: "osteoarthritis", icon: FaBone },
  { key: "sciatica", icon: FaRunning },
  { key: "strokeRehab", icon: FaHeartbeat },
  { key: "sportsRehab", icon: FaRunning },
];

const Conditions = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-teal-600 uppercase tracking-wider text-center font-semibold text-xs sm:text-sm"
        >
          {t("conditions.badge")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-2 text-slate-900 leading-tight"
        >
          {t("conditions.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-slate-600 text-center mt-2.5 sm:mt-3 max-w-2xl mx-auto leading-relaxed text-xs sm:text-base"
        >
          {t("conditions.subtitle")}
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 mt-6 sm:mt-12 items-start">
          {/* LEFT SIDE - CONDITIONS */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 mobile:grid-cols-2 gap-3 sm:gap-3.5"
          >
            {conditionsData.map((item, index) => {
              const Icon = item.icon;
              const translatedCondition = t(
                `conditionsList.${item.key}`
              );

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.03,
                  }}
                  whileHover={{ y: -3 }}
                  className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 flex flex-col justify-start"
                >
                  {/* Icon Container (36-40px) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-sm sm:text-base group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200 flex-shrink-0 mb-2 sm:mb-2.5">
                    <Icon />
                  </div>

                  {/* Title (15-16px) */}
                  <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 leading-snug">
                    {translatedCondition}
                  </h3>

                  {/* Description (12-13px) */}
                  <p className="mt-1 text-[12px] sm:text-[13px] text-slate-500 leading-normal line-clamp-2">
                    {t("conditions.treatmentFor", {
                      condition: translatedCondition,
                    })}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* RIGHT SIDE - IMAGE SLIDER */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <ConditionSlider />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Conditions;
