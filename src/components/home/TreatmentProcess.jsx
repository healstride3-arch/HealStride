import SectionHeader from "../common/SectionHeader";
import { FaClipboardCheck, FaSearch, FaHandsHelping, FaHeartbeat } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const stepsData = [
  {
    number: "01",
    titleKey: "treatmentProcess.step1Title",
    descKey: "treatmentProcess.step1Desc",
    icon: FaClipboardCheck,
  },
  {
    number: "02",
    titleKey: "treatmentProcess.step2Title",
    descKey: "treatmentProcess.step2Desc",
    icon: FaSearch,
  },
  {
    number: "03",
    titleKey: "treatmentProcess.step3Title",
    descKey: "treatmentProcess.step3Desc",
    icon: FaHandsHelping,
  },
  {
    number: "04",
    titleKey: "treatmentProcess.step4Title",
    descKey: "treatmentProcess.step4Desc",
    icon: FaHeartbeat,
  },
];

const TreatmentProcess = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          badge={t("treatmentProcess.badge")}
          title={t("treatmentProcess.title")}
          subtitle={t("treatmentProcess.subtitle")}
        />

        <div className="grid md:grid-cols-4 gap-10 mt-20">
          {stepsData.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative group bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-3 transition duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl mx-auto">
                  <Icon />
                </div>

                <h3 className="mt-6 text-center text-2xl font-bold text-slate-900">
                  {t(step.titleKey)}
                </h3>

                <p className="text-center mt-4 text-gray-600 leading-7">
                  {t(step.descKey)}
                </p>

                <div className="mt-8 text-center text-5xl font-bold text-teal-100 group-hover:text-teal-200 transition">
                  {step.number}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TreatmentProcess;