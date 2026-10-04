import { motion } from "framer-motion";
import {
  ClipboardList,
  Stethoscope,
  HeartPulse,
  Smile,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeader from "../common/SectionHeader";

const stepsData = [
  {
    icon: ClipboardList,
    titleKey: "treatmentProcess.step1Title",
    descKey: "treatmentProcess.step1Desc",
  },
  {
    icon: Stethoscope,
    titleKey: "treatmentProcess.step2Title",
    descKey: "treatmentProcess.step2Desc",
  },
  {
    icon: HeartPulse,
    titleKey: "treatmentProcess.step3Title",
    descKey: "treatmentProcess.step3Desc",
  },
  {
    icon: Smile,
    titleKey: "treatmentProcess.step4Title",
    descKey: "treatmentProcess.step4Desc",
  },
];

const TreatmentProcess = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-teal-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge={t("treatmentProcess.badge")}
          title={t("treatmentProcess.title")}
          subtitle={t("treatmentProcess.subtitle")}
        />

        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {stepsData.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-lg p-6 text-center h-full hover:-translate-y-2 transition-all duration-300 border border-slate-100">

                {/* Number */}
                <div className={`w-12 h-12 mx-auto rounded-full ${index % 2 === 0 ? "bg-[#d71920]" : "bg-[#008272]"} text-white flex items-center justify-center font-bold text-lg mb-5 shadow-sm`}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto rounded-2xl ${index % 2 === 0 ? "bg-red-50" : "bg-teal-50"} flex items-center justify-center mb-5`}>
                  <step.icon
                    size={30}
                    className={index % 2 === 0 ? "text-[#d71920]" : "text-[#008272]"}
                  />
                </div>

                <h3 className="text-xl font-semibold text-slate-800">
                  {t(step.titleKey)}
                </h3>

                <p className="mt-3 text-gray-600">
                  {t(step.descKey)}
                </p>
              </div>

              {/* Connector */}
              {index !== stepsData.length - 1 && (
                <div className="hidden md:flex absolute top-24 -right-8 z-10">
                  <ArrowRight
                    size={32}
                    className="text-teal-400"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentProcess;