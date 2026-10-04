import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";

const defaultFaqs = [
  {
    id: "faq-1",
    question: "Do I need an appointment before visiting?",
    answer:
      "Appointments are recommended so our physiotherapists can give you dedicated one-on-one consultation time.",
  },
  {
    id: "faq-2",
    question: "Which conditions do you treat?",
    answer:
      "We treat back pain, neck pain, knee pain, frozen shoulder, sciatica, sports injuries, post-surgery rehabilitation, stroke rehab, and general musculoskeletal pain.",
  },
  {
    id: "faq-3",
    question: "How long does one physiotherapy session take?",
    answer:
      "Most sessions take around 30 to 60 minutes depending on the condition, assessment, and treatment plan.",
  },
  {
    id: "faq-4",
    question: "Can I book through WhatsApp or phone?",
    answer:
      "Yes. You can call or WhatsApp the clinic at +91 88094 91380 for appointment booking and treatment inquiries.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();
  const { items: faqs } = useFirestoreCollection("faqs", {
    constraints: [where("active", "!=", false)],
    fallback: defaultFaqs,
  });

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t("faqSection.badge", "Common Questions")}
          title={t("faqSection.title")}
          subtitle={t("faqSection.subtitle")}
        />

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(
                      isOpen
                        ? null
                        : index
                    )
                  }
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 text-teal-700 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-7">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
