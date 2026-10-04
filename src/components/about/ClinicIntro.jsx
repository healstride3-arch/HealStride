import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import drRashidImage from "../../assets/images/Dr.MD.Rashid.png";
import SectionHeader from "../common/SectionHeader";

const featureKeys = [
  "clinicIntro.f1",
  "clinicIntro.f2",
  "clinicIntro.f3",
  "clinicIntro.f4",
];

const ClinicIntro = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full flex justify-center lg:justify-start"
          >
            <img
              src={drRashidImage}
              alt="Dr. MD Rashid - Lead Physiotherapist"
              className="w-[90%] sm:w-[85%] lg:w-[82%] h-[260px] sm:h-[340px] lg:h-[420px] object-cover rounded-2xl shadow-sm border border-slate-100"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <SectionHeader
              badge={t("clinicIntro.badge")}
              title={t("clinicIntro.title")}
              subtitle={t("clinicIntro.desc")}
              align="left"
              animate={false}
              className="mb-4 sm:mb-6"
            />

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
              {featureKeys.map((key, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-100"
                >
                  <CheckCircle
                    size={20}
                    className="text-emerald-600 flex-shrink-0"
                  />

                  <span className="text-slate-800 font-medium text-xs sm:text-sm">
                    {t(key)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClinicIntro;