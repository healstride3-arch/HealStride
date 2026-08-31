import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

const MissionVision = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-teal-600 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            {t("missionVision.badge")}
          </span>

          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("missionVision.title")}
          </h2>

          <p className="mt-2.5 text-slate-600 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            {t("missionVision.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4 flex-shrink-0">
              <Target
                size={26}
                className="text-teal-600"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t("missionVision.missionTitle")}
            </h3>

            <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed flex-1">
              {t("missionVision.missionDesc")}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4 flex-shrink-0">
              <Eye
                size={26}
                className="text-teal-600"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t("missionVision.visionTitle")}
            </h3>

            <p className="mt-3 text-slate-600 text-xs sm:text-base leading-relaxed flex-1">
              {t("missionVision.visionDesc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;