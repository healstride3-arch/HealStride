import { motion } from "framer-motion";
import {
  ClipboardList,
  Stethoscope,
  HeartPulse,
  Smile,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            {t("treatmentProcess.badge")}
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-slate-800">
            {t("treatmentProcess.title")}
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {t("treatmentProcess.subtitle")}
          </p>
        </div>

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
              <div className="bg-white rounded-3xl shadow-lg p-6 text-center h-full hover:-translate-y-2 transition-all duration-300">

                {/* Number */}
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-5">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                  <step.icon
                    size={30}
                    className="text-blue-600"
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
                    className="text-blue-500"
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