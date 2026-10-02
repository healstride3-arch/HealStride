import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { sendQuestionNotification } from "../../services/bookingNotificationService";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

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
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { items: faqs } = useFirestoreCollection("faqs", {
    constraints: [where("active", "!=", false)],
    fallback: defaultFaqs,
  });

  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    question: "",
  });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const questionPayload = {
        ...questionForm,
        status: "new",
        read: false,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "faqSubmissions"), {
        ...questionPayload,
        createdAt: serverTimestamp(),
      });

      await sendQuestionNotification(questionPayload);

      alert(t("faqSection.successMsg"));

      setQuestionForm({
        name: "",
        email: "",
        question: "",
      });
    } catch (error) {
      console.error("FAQ Submit Error:", error.code, error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800">
            {t("faqSection.title")}
          </h2>

          <p className="mt-4 text-gray-600">
            {t("faqSection.subtitle")}
          </p>
        </motion.div>

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

        {/* Ask Question Form */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-12 bg-white rounded-3xl shadow-md p-6 md:p-8"
        >
          <h3 className="text-2xl font-bold text-slate-800">
            {t("faqSection.askTitle")}
          </h3>

          <p className="text-slate-600 mt-2 mb-6">
            {t("faqSection.askSubtitle")}
          </p>

          <form
            onSubmit={handleQuestionSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="faq-name" className="sr-only">Your Name</label>
              <input
                id="faq-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder={t("faqSection.namePlaceholder")}
                required
                value={questionForm.name}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="faq-email" className="sr-only">Your Email</label>
              <input
                id="faq-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={t("faqSection.emailPlaceholder")}
                required
                value={questionForm.email}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="faq-question" className="sr-only">Your Question</label>
              <textarea
                id="faq-question"
                name="question"
                autoComplete="off"
                rows="5"
                placeholder={t("faqSection.questionPlaceholder")}
                required
                value={questionForm.question}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    question: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              {loading
                ? t("faqSection.submitting")
                : t("faqSection.submitBtn")}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
