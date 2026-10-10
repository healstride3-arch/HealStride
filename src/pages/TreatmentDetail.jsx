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
  Star,
  Check,
  MapPin,
} from "lucide-react";
import { getTreatmentImage } from "../data/treatmentsData";
import SEO from "../components/common/SEO";
import SectionHeader from "../components/common/SectionHeader";
import drRashidImg from "../assets/images/Dr.MD.Rashid.png";
import drWazulImg from "../assets/images/Dr Wazul Quamar.jpeg";
import { useClinicSettings } from "../hooks/useClinicSettings";
import {
  findTreatmentBySlug,
  getRelatedTreatmentItems,
  useTreatments,
} from "../hooks/useTreatments";

const TreatmentDetail = () => {
  const { data: settings } = useClinicSettings();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const { treatments } = useTreatments();

  const treatment = findTreatmentBySlug(treatments, slug);

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

  const relatedTreatments = getRelatedTreatmentItems(
    treatments,
    treatment.slug,
    treatment.category,
    3
  );

  // Helper to sanitize any html entity encoding or external city/brand references
  const cleanClinicalText = (text) => {
    if (!text) return "";
    return text
      .replace(/&amp;/g, "&")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&nbsp;/g, " ")
      .replace(/Delhi NCR/gi, "Bhopal")
      .replace(/Delhi/gi, "Bhopal")
      .replace(/Paschim Vihar/gi, "Raisen Road")
      .replace(/Sector-38|Sector 38/gi, "New Subhash Nagar")
      .replace(/painflame/gi, "Heal Stride")
      .replace(/Bhopal,\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*&\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*&amp;\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*and\s*Bhopal/gi, "Bhopal")
      .replace(/⭐?\s*Trusted\s*by\s*[0-9.,]+\s*(Lakh\+?|k\+?)\s*Patients?/gi, "")
      .replace(/3\.5\s*Lakh\+?/gi, "")
      .replace(/350\+\s*Reviews?/gi, "43+ Reviews")
      .trim();
  };

  // Helper to sanitize internal links & references in raw article HTML
  const cleanHtmlContent = (html) => {
    if (!html) return "";
    return html
      .replace(/https?:\/\/[^"'\s]*\/services\/[a-z0-9-]+/gi, "/services")
      .replace(/https?:\/\/[^"'\s]*\/clinic\/[a-z0-9-]+/gi, "/contact")
      .replace(/https?:\/\/[^"'\s]*\/treatments\/[a-z0-9-]+/gi, (match) => {
        const parts = match.split("/treatments/");
        return `/treatments/${parts[1] || ""}`;
      })
      .replace(/https?:\/\/www\.Heal Stride Physiotherapy\.com[^\s"']*/gi, "/booking")
      .replace(/Delhi NCR/gi, "Bhopal")
      .replace(/Delhi/gi, "Bhopal")
      .replace(/Paschim Vihar/gi, "Raisen Road")
      .replace(/Sector-38|Sector 38/gi, "New Subhash Nagar")
      .replace(/painflame/gi, "Heal Stride")
      .replace(/Bhopal,\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*&\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*&amp;\s*Bhopal/gi, "Bhopal")
      .replace(/Bhopal\s*and\s*Bhopal/gi, "Bhopal")
      .replace(/⭐?\s*Trusted\s*by\s*[0-9.,]+\s*(Lakh\+?|k\+?)\s*Patients?/gi, "")
      .replace(/3\.5\s*Lakh\+?/gi, "")
      .replace(/350\+\s*Reviews?/gi, "43+ Reviews");
  };

  const displaySubtitle = cleanClinicalText(treatment.subtitle || treatment.summary);

  // Reusable Consultation Card Component
  const renderConsultationCard = () => (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col space-y-4">
      {/* Top Badge & Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold uppercase tracking-wider border border-teal-200/70">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Heal Stride Bhopal Clinic
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Doctors Available Today
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          Consultation &amp; Recovery Plan
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Personalized physical evaluation with senior certified physiotherapists in Bhopal.
        </p>
      </div>

      {/* Senior Doctors Showcase */}
      <div className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-3">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Consulting Specialists at Heal Stride
        </p>

        <div className="flex items-center gap-3">
          <img
            src={drRashidImg}
            alt="Dr. MD Rashid"
            className="w-11 h-11 rounded-full object-cover border-2 border-teal-600 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              Dr. MD Rashid (PT)
            </h4>
            <p className="text-[11px] text-teal-700 font-medium">
              MPT • Senior Consultant &amp; Sports Rehab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2.5 border-t border-slate-200/60">
          <img
            src={drWazulImg}
            alt="Dr. Md Wajhul Quamar (PT)"
            className="w-11 h-11 rounded-full object-cover border-2 border-teal-600 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
              Dr. Md Wajhul Quamar (PT)
            </h4>
            <p className="text-[11px] text-teal-700 font-medium">
              BPT • Spine &amp; Neuro Rehabilitation
            </p>
          </div>
        </div>
      </div>

      {/* Key Benefits Checklist */}
      <div className="space-y-2 text-xs sm:text-sm text-slate-700">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>Detailed postural &amp; biomechanical root-cause analysis</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>Targeted therapy with Dry Needling, Cupping &amp; IASTM</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>Non-surgical recovery plan customized to your lifestyle</span>
        </div>
      </div>

      {/* Clinic Location & Hours */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="line-clamp-1">{settings.address || "LIG 85 New Subhash Nagar Near Gurudwara-Raisen Road  Bhopal 462023"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>9:00 AM – 9:00 PM</span>
        </div>
      </div>

      {/* Direct Card CTA */}
      <Link
        to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
        className="w-full text-center bg-gradient-to-r from-[#008272] to-[#0f766e] hover:from-[#0d9488] hover:to-[#115e59] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Consultation for {treatment.name}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <SEO
        title={`${treatment.title} in Bhopal | Heal Stride Physiotherapy`}
        description={displaySubtitle}
        canonical={`https://www.healstride-physiotherapy.in/treatments/${treatment.slug}`}
        keywords={`${treatment.name}, ${treatment.name} treatment Bhopal, ${treatment.name} physiotherapy, pain relief Bhopal`}
      />

      <div className="relative">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-50/60 blur-3xl rounded-full pointer-events-none" />

        {/* Cohesive 2-Column Responsive Layout with Sticky Consultation Card */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Content Column (Hero + Clinical Overview + Article + Pathway + Modalities + FAQs) */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10">
              
              {/* Hero Header Block (Fills Page 1 Fold Cleanly) */}
              <div className="space-y-4 sm:space-y-5 lg:min-h-[calc(100vh-7.5rem)] lg:flex lg:flex-col lg:justify-center">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                      {treatment.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      BPT &amp; MPT Certified Doctors
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {treatment.rating || "4.7"} Google Rating ({treatment.reviewsCount || "43+"} Reviews)
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 leading-[1.18]">
                    {treatment.title}
                  </h1>

                  <p className="text-teal-700 font-bold text-sm sm:text-base">
                    Evidence-Based Non-Surgical Rehabilitation &amp; Root-Cause Care
                  </p>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {displaySubtitle}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                    className="bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white px-6 sm:px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="tel:+918809491380"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-300 transition-all inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>+91 88094 91380</span>
                  </a>

                  <a
                    href={`https://wa.me/918252580389?text=${encodeURIComponent(
                      `Hello Heal Stride Clinic Bhopal, I would like to consult about ${treatment.name} treatment.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Trust Highlights - Positioned directly below Booking & Call buttons */}
                <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">100% Non-Surgical</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Natural pain relief care</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Expert BPT/MPT Doctors</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Dr. MD Rashid &amp; Dr. Md Wajhul Quamar (PT)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Advanced Modalities</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Cupping, Dry Needling, IASTM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Personalized Plans</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Tailored 1-on-1 recovery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile View: Consultation Card displayed directly below hero block */}
              <div className="lg:hidden">
                {renderConsultationCard()}
              </div>

              {/* Detailed Evidence-Based Clinical Article */}
              {treatment.contentHtml && (
                <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm">
                  <div className="mb-6 pb-4 border-b border-slate-100 text-center max-w-3xl mx-auto">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Evidence-Based Clinical Protocol
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center">
                      Comprehensive Treatment &amp; Rehabilitation Guide
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 text-center">
                      Formulated by Senior Physiotherapists at Heal Stride Physiotherapy &amp; Wellness Centre.
                    </p>
                  </div>

                  <div className="my-6 p-4 sm:p-5 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mx-auto sm:mx-0">
                        <Stethoscope className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-teal-950">
                          Individualized 1-on-1 Doctor Evaluation
                        </h4>
                        <p className="text-xs sm:text-sm text-teal-800/90 mt-0.5 leading-relaxed">
                          Our specialists assess joint range of motion, muscle imbalances, and nerve mobility before starting your rehabilitation.
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/booking?treatment=${encodeURIComponent(treatment.name)}`}
                      className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d71920] to-[#008272] text-white text-xs font-bold hover:shadow-md transition whitespace-nowrap"
                    >
                      Book Assessment
                    </Link>
                  </div>

                  <div
                    className="treatment-article-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlContent(treatment.contentHtml) }}
                  />
                </section>
              )}

              {/* Section 3: Treatment Procedure (Step by Step) */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <SectionHeader
                  badge="What To Expect"
                  title="Our 4-Stage Clinical Pathway"
                  subtitle="A structured, evidence-based recovery process ensuring safe, comfortable, and lasting relief."
                  className="mb-6"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-2xl font-black text-teal-600/40 block mb-1">01</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        Clinical Examination &amp; Testing
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Orthopedic joint tests, range of motion analysis, posture screening, and medical history evaluation.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-2xl font-black text-teal-600/40 block mb-1">02</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        Targeted Pain &amp; Spasm Control
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dry needling, cupping therapy, IFT / TENS, and manual trigger point release to calm acute flare-ups.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-2xl font-black text-teal-600/40 block mb-1">03</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        Joint Mobilization &amp; Alignment
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Gentle passive stretching, spinal decompression, and realignment to restore biomechanical symmetry.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-2xl font-black text-teal-600/40 block mb-1">04</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        Strengthening &amp; Prevention
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Personalized resistance exercises, core stabilization, and ergonomic habits to stop pain from returning.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Specialized Tools & Modalities */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
                <div className="w-full text-center">
                  <SectionHeader
                    badge="Technology &amp; Modalities"
                    title="Specialized Clinical Modalities Used"
                    subtitle="We combine advanced therapeutic equipment and hands-on clinical skills for faster recovery."
                    className="mb-6"
                  />
                  <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 w-full">
                    {[
                      "Dry Needling Therapy",
                      "Clinical Cupping (Hijama)",
                      "Therapeutic Ultrasound Unit",
                      "Digital TENS / IFT Machine",
                      "IASTM Soft Tissue Tools",
                      "Spinal Decompression Table",
                      "Joint Mobilization Wedges",
                      "TheraBands & Resistance Loops",
                      "Cryotherapy & Heat Modalities",
                      "Biomechanics Screening",
                    ].map((tool, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:border-teal-400 hover:bg-teal-50/50 transition-all shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Consultation & Recovery Plan Card (Desktop - Fixed on scroll, scrolls at end) */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 z-20">
              {renderConsultationCard()}
            </div>

          </div>

          {/* Full Width Bottom Sections (Sticky card releases before reaching here) */}
          <div className="mt-12 sm:mt-16 space-y-12 sm:space-y-16">
            {/* Section: Consulting Specialists Detailed Profiles */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm">
          <SectionHeader
            badge="Expert Medical Team"
            title="Lead Specialists for Your Treatment"
            subtitle="Your treatment is directly overseen by university-qualified, highly credentialed physiotherapists in Bhopal."
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
            {/* Doctor 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 hover:border-teal-400 transition-colors shadow-xs">
              <img
                src={drRashidImg}
                alt="Dr. MD Rashid (PT)"
                className="w-24 h-24 rounded-2xl object-cover object-top border-2 border-teal-200 shrink-0 shadow-sm"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-bold text-slate-900">
                    Dr. MD Rashid (PT)
                  </h4>
                  <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                    Clinical Director
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-teal-700 font-semibold mt-1">
                  MPT (Sports) • Founder &amp; Senior Consultant
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Specialized in sports injuries, dry needling, cupping therapy, spinal decompression, and advanced joint mobilization protocols.
                </p>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 hover:border-teal-400 transition-colors shadow-xs">
              <img
                src={drWazulImg}
                alt="Dr. Md Wajhul Quamar (PT)"
                className="w-24 h-24 rounded-2xl object-cover object-top border-2 border-teal-200 shrink-0 shadow-sm"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-bold text-slate-900">
                    Dr. Md Wajhul Quamar (PT)
                  </h4>
                  <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                    Senior Specialist
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-teal-700 font-semibold mt-1">
                  BPT • 7 Certified Clinical Specialities
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Certified in cupping therapy, dry needling, IASTM, cardiopulmonary rehabilitation, tapping therapy, manual therapy, and neuro-musculoskeletal care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Specialized Tools & Modalities - Matching ServiceDetail.jsx */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-full text-center">
            <SectionHeader
              badge="Technology &amp; Modalities"
              title="Specialized Clinical Modalities Used"
              subtitle="We combine advanced therapeutic equipment and hands-on clinical skills for faster recovery."
              className="mb-6"
            />
            <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4 w-full">
              {[
                "Dry Needling Therapy",
                "Clinical Cupping (Hijama)",
                "Therapeutic Ultrasound Unit",
                "Digital TENS / IFT Machine",
                "IASTM Soft Tissue Tools",
                "Spinal Decompression Table",
                "Joint Mobilization Wedges",
                "TheraBands & Resistance Loops",
                "Cryotherapy & Heat Modalities",
                "Biomechanics Screening",
              ].map((tool, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-200 text-slate-800 px-4.5 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:border-teal-400 hover:bg-teal-50/50 transition-all shadow-xs"
                >
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Frequently Asked Questions (FAQ) - Matching ServiceDetail.jsx */}
        {treatment.faqs && treatment.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm">
            <div className="w-full">
              <SectionHeader
                badge="Got Questions?"
                title="Frequently Asked Questions"
                subtitle={`Everything you need to know about ${treatment.name} at Heal Stride.`}
              />

              <div className="space-y-3.5 w-full">
                {treatment.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-teal-700 transition cursor-pointer"
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

        {/* Section 7: Related Treatments - Rendered with ServicesGrid card styling */}
        {relatedTreatments.length > 0 && (
          <section>
            <SectionHeader
              badge="Complementary Treatments"
              title="Other Conditions You May Explore"
              subtitle="Browse related non-surgical treatment programs available at Heal Stride Physiotherapy Bhopal."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {relatedTreatments.map((rel, idx) => (
                <div
                  key={rel.slug}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    hover:border-teal-500
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                    overflow-hidden
                    flex
                    flex-col
                    h-full
                    justify-between
                  "
                >
                  <Link
                    to={`/treatments/${rel.slug}`}
                    className="relative overflow-hidden w-full h-52 sm:h-56 flex-shrink-0 bg-slate-100 block"
                  >
                    <img
                      src={getTreatmentImage(rel)}
                      alt={rel.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-teal-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase shadow-sm z-10">
                      {rel.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 z-10">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>Non-Surgical</span>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link to={`/treatments/${rel.slug}`} className="hover:text-teal-700 transition-colors">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {rel.name}
                        </h3>
                      </Link>

                      <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[38px]">
                        {rel.summary}
                      </p>

                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">100% Non-Surgical Protocol</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">Personalized 1-on-1 Evaluation</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/treatments/${rel.slug}`}
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-1
                          bg-teal-50
                          hover:bg-teal-100
                          text-teal-700
                          font-semibold
                          text-xs
                          sm:text-sm
                          py-2.5
                          px-3
                          rounded-xl
                          transition-colors
                          border
                          border-teal-200
                        "
                      >
                        <span>Details</span>
                        <span>→</span>
                      </Link>

                      <Link
                        to={`/booking?treatment=${encodeURIComponent(rel.name)}`}
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          bg-gradient-to-r
                          from-[#d71920]
                          to-[#008272]
                          hover:from-[#b91c1c]
                          hover:to-[#0f766e]
                          active:scale-95
                          text-white
                          font-semibold
                          text-xs
                          sm:text-sm
                          py-2.5
                          px-3
                          rounded-xl
                          shadow-xs
                          transition-all
                        "
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        </div>
      </div>
    </div>
  </div>
  );
};

export default TreatmentDetail;
