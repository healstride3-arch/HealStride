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
  BadgeCheck,
  Star,
  MapPin,
} from "lucide-react";
import {
  ALL_TREATMENTS,
  getTreatmentBySlug,
  getRelatedTreatments,
  getTreatmentImage,
} from "../data/treatmentsData";
import SEO from "../components/common/SEO";
import drRashidImg from "../assets/images/Dr.MD.Rashid.png";
import drWazulImg from "../assets/images/Dr Wazul Quamar.jpeg";

const TreatmentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const treatment = getTreatmentBySlug(slug);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenFaq(0);
  }, [slug]);

  if (!treatment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4 text-2xl">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Treatment Not Found
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            The treatment you are looking for may have been updated or moved. Please explore our complete catalog of 80+ specialized treatments.
          </p>
          <Link
            to="/treatments"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-md transition"
          >
            <span>View All Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const relatedTreatments = getRelatedTreatments(
    treatment.slug,
    treatment.category,
    4
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <SEO
        title={`${treatment.title} in Bhopal | Heal Stride Physiotherapy`}
        description={treatment.subtitle || treatment.summary}
        keywords={`${treatment.name}, ${treatment.name} treatment Bhopal, ${treatment.name} physiotherapy, pain relief Bhopal`}
      />

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200/80 pt-6 pb-10 sm:pt-10 sm:pb-14 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-50/70 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-5">
            <Link to="/" className="hover:text-teal-700 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/treatments" className="hover:text-teal-700 transition">
              Treatments
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {treatment.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8 space-y-4"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                  {treatment.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Non-Surgical Care
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.7 (Google Verified)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {treatment.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
                {treatment.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <Calendar size={16} />
                  <span>Book Consultation</span>
                </Link>

                <a
                  href="tel:8809491380"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-sm transition"
                >
                  <Phone size={15} />
                  <span>Call +91 88094 91380</span>
                </a>

                <a
                  href={`https://wa.me/918252580389?text=${encodeURIComponent(
                    `Hello Heal Stride Clinic, I would like to consult about ${treatment.name} treatment.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-sm transition"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Doctor</span>
                </a>
              </div>
            </motion.div>

            {/* Right Card / Clinical Highlights with Visual Image */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl overflow-hidden shadow-xl border border-teal-800/40">
                {/* Condition Visual Photo Header */}
                <div className="relative w-full h-44 overflow-hidden bg-slate-800">
                  <img
                    src={getTreatmentImage(treatment)}
                    alt={`${treatment.name} clinical therapy`}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="bg-teal-500/90 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {treatment.category}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-xs bg-slate-900/70 px-2 py-0.5 rounded-full border border-white/20">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      4.7 / 5.0
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        Clinical Protocol
                      </h3>
                      <p className="text-[11px] text-teal-300">
                        Heal Stride Bhopal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1 text-xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>Comprehensive root-cause postural &amp; physical assessment</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>Targeted manual joint mobilization &amp; soft tissue release</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>Advanced modalities: Cupping, Dry Needling &amp; IASTM</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>Customized home exercises to prevent re-injury</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span>Consulting Physiotherapists:</span>
                    <strong className="text-teal-300 font-semibold">2 Certified Doctors</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Wide Featured Clinical Photo Banner */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 group">
              <img
                src={getTreatmentImage(treatment)}
                alt={`${treatment.name} physical therapy in Bhopal`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-teal-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
                  {treatment.category} • Non-Surgical Protocol
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                  Clinical Assessment &amp; Rehabilitation: {treatment.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl line-clamp-2">
                  Evidence-based rehabilitation targeting the root biomechanical dysfunctions without relying on surgery.
                </p>
              </div>
            </div>

            {/* Individualized Care Callout Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-teal-950">
                    Individualized 1-on-1 Doctor Evaluation
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-800/90 mt-0.5 leading-relaxed">
                    Our clinical specialists assess joint range of motion, muscle imbalances, and nerve mobility before starting your rehabilitation.
                  </p>
                </div>
              </div>
              <Link
                to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d71920] to-[#008272] text-white text-xs font-bold hover:shadow-md transition whitespace-nowrap"
              >
                Book Assessment
              </Link>
            </div>

            {/* Rich Content Card with Generous Spacing */}
            {treatment.contentHtml ? (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
                <div
                  className="prose prose-slate max-w-none
                    prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                    prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 sm:prose-h2:mt-14 prose-h2:mb-4 prose-h2:pt-6 prose-h2:border-t prose-h2:border-slate-100 prose-h2:text-slate-900
                    prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mt-10 sm:prose-h3:mt-12 prose-h3:mb-4 prose-h3:pt-6 sm:prose-h3:pt-8 prose-h3:border-t prose-h3:border-slate-100 prose-h3:first:mt-0 prose-h3:first:pt-0 prose-h3:first:border-0 prose-h3:text-teal-950
                    prose-p:text-slate-700 prose-p:leading-relaxed sm:prose-p:leading-8 prose-p:text-sm sm:prose-p:text-base prose-p:mb-5
                    prose-ul:my-5 prose-ul:space-y-3 prose-ul:pl-4
                    prose-li:text-slate-700 prose-li:text-sm sm:prose-li:text-base prose-li:leading-relaxed
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-a:text-[#008272] prose-a:font-semibold hover:prose-a:text-[#d71920] prose-a:underline prose-a:underline-offset-4
                  "
                  dangerouslySetInnerHTML={{ __html: treatment.contentHtml }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                  About {treatment.name} Treatment
                </h2>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                  {treatment.subtitle}
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  At Heal Stride Physiotherapy &amp; Wellness Centre, we provide comprehensive evidence-based treatment for {treatment.name}. Our clinic combines manual therapy, electrotherapy, dry needling, cupping therapy, and progressive loading exercises to restore function without surgery.
                </p>
              </div>
            )}

            {/* Doctors Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Lead Physiotherapists for {treatment.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Doctor 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <img
                    src={drRashidImg}
                    alt="Dr. MD Rashid (PT)"
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-teal-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Dr. MD Rashid (PT)
                    </h4>
                    <p className="text-xs text-teal-700 font-semibold">
                      MPT (Sports) • Founder
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Certified Cupping, Dry Needling & MWM
                    </p>
                  </div>
                </div>

                {/* Doctor 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                  <img
                    src={drWazulImg}
                    alt="Dr. Md Wajhul Qumar (PT)"
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-teal-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Dr. Md Wajhul Qumar (PT)
                    </h4>
                    <p className="text-xs text-teal-700 font-semibold">
                      BPT • Rehab Specialist
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      7 Advanced Certifications (IASTM, Cardiopulmonary)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            {treatment.faqs && treatment.faqs.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Frequently Asked Questions ({treatment.name})
                  </h3>
                </div>

                <div className="space-y-3">
                  {treatment.faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                          className="w-full p-4 sm:p-5 text-left bg-white hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                        >
                          <span className="text-sm font-bold text-slate-900 leading-snug">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-teal-600 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50"
                            >
                              <p>{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Treatments */}
            {relatedTreatments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Related Conditions &amp; Treatments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTreatments.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/treatments/${rel.slug}`}
                      className="rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/40 hover:shadow-md transition-all group flex overflow-hidden"
                    >
                      <div className="w-24 sm:w-28 h-auto shrink-0 bg-slate-100 overflow-hidden">
                        <img
                          src={getTreatmentImage(rel)}
                          alt={rel.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                            {rel.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#008272] transition-colors mt-1.5 leading-snug line-clamp-1">
                            {rel.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {rel.summary}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#008272] group-hover:translate-x-0.5 transition-transform">
                          <span>View Protocol</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Consultation Booking Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-3">
                  <Sparkles size={13} />
                  <span>Personalized Care</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Consult for {treatment.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Get evaluated by senior physiotherapists with specialized certifications in pain relief.
                </p>

                <div className="mt-5 space-y-2.5">
                  <Link
                    to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Calendar size={15} />
                    <span>Book Clinic Appointment</span>
                  </Link>

                  <a
                    href="tel:8809491380"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition"
                  >
                    <Phone size={14} />
                    <span>Call: +91 88094 91380</span>
                  </a>

                  <a
                    href={`https://wa.me/918252580389?text=${encodeURIComponent(
                      `Hello, I would like to book a consultation for ${treatment.name} at Heal Stride Clinic.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>

                {/* Clinic Timing & Info */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-teal-600 shrink-0" />
                    <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-teal-600 shrink-0" />
                    <span>Raisen Road & Subhash Nagar, Bhopal</span>
                  </div>
                </div>
              </div>

              {/* Verified Trust Badge Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck size={16} />
                  <span>Why Heal Stride?</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 mt-3">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>Zero surgery, 100% natural evidence-based recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>Certified in Cupping, Dry Needling & IASTM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>Modern electrotherapy & spinal traction modalities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TreatmentDetail;
