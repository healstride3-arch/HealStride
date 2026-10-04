import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Activity,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { ALL_SERVICES, getServiceBySlug } from "../data/servicesData";
import SEO from "../components/common/SEO";
import SectionHeader from "../components/common/SectionHeader";
import defaultImg from "../assets/images/treatment1.jpg";

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  // Normalize slug and look up service (defaulting to physiotherapy if on /services/physiotherapy)
  const service = getServiceBySlug(slug || "physiotherapy");

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenFaq(0);
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4 text-2xl">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">
            The treatment you are looking for may have been updated or moved. Please explore our complete catalog of specialized therapies.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-md transition"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Related services (exclude current)
  const relatedServices = ALL_SERVICES.filter(
    (s) => s.slug !== service.slug && (s.category === service.category || true)
  ).slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <SEO
        title={`${service.title} in Bhopal | HealStride Physiotherapy`}
        description={service.description}
        keywords={`${service.title}, ${service.title} Bhopal, Physiotherapy Bhopal, Pain Relief Bhopal`}
      />


      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200/80 min-h-[calc(100vh-76px)] flex flex-col justify-between pt-8 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-12 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-50/70 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-5"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                  {service.categoryLabel || "Specialized Care"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  BPT Certified Doctors
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {service.title}
              </h1>

              <p className="text-teal-700 font-semibold text-base sm:text-lg">
                {service.tagline}
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                {service.description}
              </p>

              {/* Badges Pill Row */}
              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Session: <strong>{service.duration}</strong></span>
                </div>
                {service.sessions && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Plan: <strong>{service.sessions}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>100% Non-Invasive</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+918809491380"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-300 transition-all inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>+91 88094 91380</span>
                </a>
              </div>
            </motion.div>

            {/* Right Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 bg-white group">
                <img
                  src={service.imageUrl || defaultImg}
                  alt={service.title}
                  className="w-full h-80 sm:h-96 lg:h-[460px] xl:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 text-left shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                        Available at HealStride Bhopal
                      </p>
                      <p className="text-slate-900 text-sm font-bold">
                        Personalized 1-on-1 Consultation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Highlights Strip (Anchors the full viewport fold) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Non-Surgical</p>
                <p className="text-[11px] text-slate-500">Natural pain relief care</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Expert BPT Doctors</p>
                <p className="text-[11px] text-slate-500">Certified clinical specialists</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Advanced Modalities</p>
                <p className="text-[11px] text-slate-500">Clinical-grade equipment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Personalized Plans</p>
                <p className="text-[11px] text-slate-500">Tailored 1-on-1 recovery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Section 1: Overview & Mechanism */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm text-center">
          <div className="w-full text-center">
            <SectionHeader
              badge="Clinical Overview"
              title={`Understanding ${service.title}`}
              className="mb-3 sm:mb-4"
            />
            <div className="space-y-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed text-center w-full">
              {Array.isArray(service.overview) ? (
                service.overview.map((para, i) => (
                  <p key={i} className="w-full">
                    {para}
                  </p>
                ))
              ) : (
                <p className="w-full">{service.overview || service.description}</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Clinical Benefits */}
        {((service.detailedBenefits && service.detailedBenefits.length > 0) || (service.benefits && service.benefits.length > 0)) && (
          <section>
            <SectionHeader
              badge="Proven Advantages"
              title={`How ${service.title} Helps & Heals`}
              subtitle="Designed to deliver rapid, lasting pain relief while addressing underlying structural imbalances."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(service.detailedBenefits || service.benefits.map((b) => ({ title: b, desc: "" }))).map((benefit, index) => {
                const bTitle = typeof benefit === "string" ? benefit : benefit.title;
                const bDesc = typeof benefit === "object" ? benefit.desc : "";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {bTitle}
                      </h3>
                      {bDesc && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                          {bDesc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 3: Conditions Treated */}
        {((service.detailedConditions && service.detailedConditions.length > 0) || (service.conditionsTreated && service.conditionsTreated.length > 0)) && (
          <section className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="w-full">
              <SectionHeader
                badge="Target Indications"
                title="Conditions Effectively Treated"
                subtitle="Our evidence-based clinical protocols are recommended for patients suffering from:"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {(service.detailedConditions || service.conditionsTreated.map((c) => ({ title: c, desc: "" }))).map((condition, idx) => {
                  const cTitle = typeof condition === "string" ? condition : condition.title;
                  const cDesc = typeof condition === "object" ? condition.desc : "";
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left hover:border-teal-400 transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                      <div>
                        <span className="text-sm font-semibold text-slate-900 block leading-snug">
                          {cTitle}
                        </span>
                        {cDesc && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {cDesc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Treatment Procedure (Step by Step) */}
        {service.procedure && service.procedure.length > 0 && (
          <section>
            <SectionHeader
              badge="What To Expect"
              title="Your Treatment Procedure"
              subtitle="A structured, 4-step clinical pathway ensuring safe and comfortable care at every step."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.procedure.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl font-black text-teal-600/30 block mb-2">
                      {step.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Advanced Equipment & Tools */}
        {service.toolsUsed && service.toolsUsed.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm text-center">
            <div className="w-full text-center">
              <SectionHeader
                badge="Technology & Modalities"
                title="Specialized Tools & Equipment Used"
                className="mb-6"
              />
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {service.toolsUsed.map((tool, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:border-teal-400 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 6: Frequently Asked Questions (FAQ) */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm">
            <div className="w-full">
              <SectionHeader
                badge="Got Questions?"
                title="Frequently Asked Questions"
                subtitle={`Everything you need to know about ${service.title} at HealStride.`}
              />

              <div className="space-y-3">
                {service.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-teal-700 transition"
                      >
                        <span className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-teal-600" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: Related Treatments */}
        {relatedServices.length > 0 && (
          <section>
            <SectionHeader
              badge="Complementary Care"
              title="Other Services You May Need"
              subtitle="Explore specialized physical therapy and rehabilitation programs available at HealStride."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/services/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={rel.imageUrl || defaultImg}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-teal-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase shadow-sm">
                      {rel.categoryLabel}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                        {rel.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1.5 line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
                      <span>Learn More</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 8: Final Booking Banner */}
        <section className="bg-gradient-to-r from-teal-50 via-white to-teal-50 rounded-3xl p-8 sm:p-12 text-center text-slate-900 relative overflow-hidden shadow-sm border border-teal-200">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider border border-teal-300">
              Start Your Recovery Today
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-slate-900">
              Ready to Experience Relief from {service.title}?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
              Consult our university-certified physiotherapists at HealStride Bhopal. We create a personalized recovery program tailored specifically to your body and lifestyle.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span>Book Appointment</span>
              </Link>
              <a
                href="https://wa.me/918809491380"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md inline-flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceDetail;
