import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  GraduationCap,
  BriefcaseMedical,
  BadgeCheck,
  ArrowLeft,
  CalendarCheck,
  Phone,
  Share2,
  Star,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Activity,
  HeartPulse,
  Sparkles,
  Zap,
  Check,
  Stethoscope,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";
import SEO from "../components/common/SEO";

const CERTIFICATION_METADATA = {
  cupping: {
    title: "Certified in Cupping Therapy",
    badge: "Myofascial Decompression",
    desc: "Expertise in therapeutic dry and dynamic cupping to increase microvascular blood flow, break stubborn fascial adhesions, and accelerate muscle recovery.",
    icon: Sparkles,
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200/80",
    badgeColor: "bg-amber-100 text-amber-800",
    iconColor: "text-amber-600",
  },
  needling: {
    title: "Certified in Dry Needling Therapy",
    badge: "Neuromuscular Trigger Points",
    desc: "Targeted intramuscular insertion of fine micro-filaments into myofascial trigger points for profound pain release, knot relaxation, and neuropathy relief.",
    icon: Zap,
    gradient: "from-rose-500/10 to-red-500/10",
    border: "border-rose-200/80",
    badgeColor: "bg-rose-100 text-rose-800",
    iconColor: "text-rose-600",
  },
  taping: {
    title: "Certified in Taping Therapy",
    badge: "Kinesiology & Biomechanics",
    desc: "Functional kinesiology and rigid taping protocols for joint stability, edema reduction, proprioceptive feedback, and sports injury prevention.",
    icon: Activity,
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-200/80",
    badgeColor: "bg-blue-100 text-blue-800",
    iconColor: "text-blue-600",
  },
  mwm: {
    title: "Certified in Mulligan’s Mobilization with Movement (MWM)",
    badge: "International Manual Therapy",
    desc: "Specialized joint gliding combined with active physiological movement, achieving instant pain-free range of motion without invasive measures.",
    icon: HeartPulse,
    gradient: "from-teal-500/10 to-emerald-500/10",
    border: "border-teal-200/80",
    badgeColor: "bg-teal-100 text-teal-800",
    iconColor: "text-teal-600",
  },
  bls: {
    title: "Certified in Basic Life Support (BLS) & Critical Care Management",
    badge: "Clinical Safety & Life Support",
    desc: "Accredited in CPR, acute airway management, cardiopulmonary stabilization, and hospital-grade clinical critical care emergency protocols.",
    icon: ShieldCheck,
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-200/80",
    badgeColor: "bg-purple-100 text-purple-800",
    iconColor: "text-purple-600",
  },
};

const getCertificationMeta = (certName) => {
  const lower = (certName || "").toLowerCase();
  if (lower.includes("cup")) return CERTIFICATION_METADATA.cupping;
  if (lower.includes("needl")) return CERTIFICATION_METADATA.needling;
  if (lower.includes("tap")) return CERTIFICATION_METADATA.taping;
  if (lower.includes("mulligan") || lower.includes("mwm")) return CERTIFICATION_METADATA.mwm;
  if (lower.includes("bls") || lower.includes("life support") || lower.includes("critical")) return CERTIFICATION_METADATA.bls;
  return {
    title: certName,
    badge: "Clinical Certification",
    desc: "Advanced clinical competency certified under evidence-based physiotherapy training protocols.",
    icon: Award,
    gradient: "from-teal-500/10 to-cyan-500/10",
    border: "border-teal-200/80",
    badgeColor: "bg-teal-100 text-teal-800",
    iconColor: "text-teal-600",
  };
};

const DR_RASHID_REVIEWS = [
  {
    name: "Ramesh Kumar Sharma",
    condition: "Severe Lower Back Pain",
    comment:
      "I will highly recommend Dr Rashid for physiotherapy. He is a very polite, supportive and knowledgeable physiotherapist. Excellent services... He nicely taught me exercises and posture correction and within one month my back pain has completely gone!",
    rating: 5,
    date: "Verified Google Review",
  },
  {
    name: "Mohammad Irfan",
    condition: "Spinal Disc Pain (2 Years)",
    comment:
      "I was suffering from back pain since 2 years. When I came to HealStride and continued physio sessions with Dr. Rashid, in few days I felt relief and now complete pain went away. Highly skilled in dry needling and cupping!",
    rating: 5,
    date: "Verified Google Review",
  },
  {
    name: "Pooja Verma",
    condition: "Knee Osteoarthritis & Stiffness",
    comment:
      "Dr. Rashid sir is the best physiotherapist in Bhopal. Very attentive, knowledgeable, and caring. The mobilization exercises helped me walk pain-free again.",
    rating: 5,
    date: "Verified Google Review",
  },
];

const DoctorProfile = () => {
  const { doctorName } = useParams();
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Real-time Firestore sync with fallback
  const { items: rawDoctors, loading } = useFirestoreCollection("doctors", {
    fallback: defaultDoctors,
  });
  const doctors = rawDoctors.filter((d) => d.active !== false);

  // Settings for clinic phone / whatsapp
  const { data: clinicSettings } = useFirestoreDoc("settings", "clinic", {
    phone: "+91 88094 91380",
    whatsapp: "+91 82525 80389",
    hours: "Morning 9:00 AM - 12:00 PM\nEvening 5:00 PM - 9:00 PM",
  });

  const slugify = (str) =>
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const cleanDocName = (doctorName || "").toLowerCase().trim();
  const isRequestedWajhul =
    cleanDocName.includes("wajhul") ||
    cleanDocName.includes("wazul");

  const rawDoctor =
    doctors.find(
      (item) =>
        item.slug === doctorName ||
        item.id === doctorName ||
        slugify(item.name) === cleanDocName ||
        (cleanDocName.includes("rashid") && (item.id === "dr-md-rashid" || item.slug === "dr-md-rashid")) ||
        (isRequestedWajhul && (item.id === "dr-wajhul-qamar" || item.slug === "dr-wajhul-qamar"))
    ) ||
    defaultDoctors.find(
      (item) =>
        item.slug === doctorName ||
        item.id === doctorName ||
        slugify(item.name) === cleanDocName ||
        (cleanDocName.includes("rashid") && item.id === "dr-md-rashid") ||
        (isRequestedWajhul && item.id === "dr-wajhul-qamar")
    );

  const fallbackMatch = defaultDoctors.find(
    (item) =>
      item.slug === doctorName ||
      item.id === doctorName ||
      slugify(item.name) === cleanDocName ||
      (cleanDocName.includes("rashid") && item.id === "dr-md-rashid") ||
      (isRequestedWajhul && item.id === "dr-wajhul-qamar")
  );

  // Intelligent merge: live Firestore data takes top priority, default fields act as safety fallback
  const doctor = rawDoctor
    ? {
        ...fallbackMatch,
        ...rawDoctor,
        name: rawDoctor.name || fallbackMatch?.name || "",
        role: rawDoctor.role || fallbackMatch?.role || "",
        education: rawDoctor.education || fallbackMatch?.education || "",
        registration: rawDoctor.registration || fallbackMatch?.registration || "",
        experience: rawDoctor.experience || fallbackMatch?.experience || "",
        specialization: rawDoctor.specialization || fallbackMatch?.specialization || "",
        description: rawDoctor.description || fallbackMatch?.description || "",
        certifications:
          rawDoctor.certifications &&
          (Array.isArray(rawDoctor.certifications)
            ? rawDoctor.certifications.length > 0
            : String(rawDoctor.certifications).trim())
            ? Array.isArray(rawDoctor.certifications)
              ? rawDoctor.certifications
              : String(rawDoctor.certifications).split("\n").map((c) => c.trim()).filter(Boolean)
            : fallbackMatch?.certifications || [],
      }
    : null;

  if (!doctor && !loading) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <Stethoscope size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {t("doctorProfile.notFound", "Doctor Not Found")}
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md">
          The requested specialist profile could not be located. Browse all available doctors at HealStride.
        </p>
        <Link
          to="/doctors"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
        >
          <ArrowLeft size={16} />
          {t("doctorProfile.back", "Back to Doctors")}
        </Link>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const doctorLocalizedName = getDoctorLocalizedName(doctor, i18n);
  const isDrRashid =
    doctor.id === "dr-md-rashid" ||
    doctor.slug === "dr-md-rashid" ||
    doctor.name?.toLowerCase().includes("rashid");

  const isDrWajhul =
    doctor.id === "dr-wajhul-qamar" ||
    doctor.slug === "dr-wajhul-qamar" ||
    doctor.name?.toLowerCase().includes("wajhul") ||
    doctor.name?.toLowerCase().includes("wazul");

  const doctorPhoto =
    rawDoctor?.image ||
    rawDoctor?.imageUrl ||
    rawDoctor?.photoUrl ||
    fallbackMatch?.image ||
    fallbackMatch?.imageUrl ||
    doctor?.image ||
    doctor?.imageUrl ||
    "/default-user.png";

  const phoneRaw = (clinicSettings?.phone || "8809491380").replace(/[^0-9]/g, "");
  const whatsappRaw = (clinicSettings?.whatsapp || "8252580389").replace(/[^0-9]/g, "");

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${doctorLocalizedName} - ${doctor.role || "Consultant Physiotherapist"}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Consult with ${doctorLocalizedName} at HealStride Physiotherapy Bhopal`,
          url,
        });
      } catch (err) {
        // User dismissed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("doctorProfile.profileCopied", "Doctor profile link copied to clipboard!"));
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const certificationsList =
    doctor.certifications && doctor.certifications.length > 0
      ? doctor.certifications
      : isDrRashid
      ? [
          "Certified in Cupping Therapy",
          "Certified in Dry Needling Therapy",
          "Certified in Taping Therapy",
          "Certified in Mulligan’s Mobilization with Movement (MWM)",
          "Certified in Basic Life Support (BLS) & Critical Care Management",
        ]
      : [];

  const specializationsList = (doctor.specialization || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 sm:pb-16 overflow-x-hidden">
      <SEO
        title={`${doctorLocalizedName} (${doctor.role || "Physiotherapist"})`}
        description={`Consult ${doctorLocalizedName} at Heal Stride Physiotherapy & Wellness Centre Bhopal. Specializing in ${doctor.specialization || "sports injuries, pain relief and musculoskeletal rehabilitation"}. Book consultation.`}
        keywords={`${doctorLocalizedName}, Best Physiotherapist in Bhopal, ${doctor.role}, sports injury rehab Bhopal, cupping therapy Bhopal, dry needling Bhopal`}
      />
      {/* Main Container with responsive page padding */}
      <div className="max-w-7xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-10">
        {/* Hero Card */}
        <div className="relative rounded-2xl xs:rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-3.5 xs:p-5 sm:p-8 lg:p-10 shadow-xl overflow-hidden mb-5 sm:mb-8 border border-teal-800/40">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            {/* Image Column */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group max-w-full">
                <div className="absolute -inset-1 rounded-2xl xs:rounded-3xl bg-gradient-to-r from-teal-400 to-cyan-400 opacity-75 blur-sm group-hover:opacity-100 transition duration-300" />
                <div className="relative w-44 h-52 xs:w-56 xs:h-64 sm:w-64 sm:h-72 lg:w-72 lg:h-80 rounded-xl xs:rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-2xl">
                  <img
                    src={doctorPhoto}
                    alt={doctorLocalizedName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Available for Consultation Badge */}
                <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 right-2 xs:right-3 bg-slate-950/85 backdrop-blur-md border border-white/10 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg xs:rounded-xl flex items-center justify-center gap-1.5 xs:gap-2 shadow-lg">
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[10px] xs:text-[11px] font-semibold tracking-wide truncate">
                    Available for Consultation
                  </span>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-8 flex flex-col text-center lg:text-left mt-2 lg:mt-0">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 xs:gap-2 mb-2 xs:mb-3">
                <span className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] xs:text-xs font-semibold">
                  <BadgeCheck size={12} className="text-teal-300 shrink-0" />
                  <span>
                    {isDrRashid
                      ? t("doctorProfile.verifiedDoctor", "Verified Senior Specialist")
                      : "Verified Clinical Specialist"}
                  </span>
                </span>

                {doctor.registration &&
                  doctor.registration !== "Available at clinic" &&
                  doctor.registration.trim() !== "" && (
                    <span className="inline-flex items-center gap-1 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[10px] xs:text-xs font-medium">
                      <span>Reg:</span>
                      <strong className="text-teal-300">{doctor.registration}</strong>
                    </span>
                  )}

                <span className="inline-flex items-center gap-1 px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] xs:text-xs font-semibold">
                  <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span>{isDrRashid ? "5.0 (43+ Reviews)" : "5.0 (Recommended)"}</span>
                </span>
              </div>

              {/* Doctor Name */}
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight break-words">
                {doctorLocalizedName}
              </h1>

              {/* Role & Degree */}
              <p className="text-teal-300 text-xs xs:text-sm sm:text-base lg:text-lg font-semibold mt-1">
                {doctor.role ||
                  fallbackMatch?.role ||
                  (isDrRashid
                    ? "Senior Consultant Physiotherapist | MPT (Sports)"
                    : "Physiotherapist & Rehab Specialist (BPT)")}
              </p>

              {/* Bio / Description */}
              <p className="mt-2 xs:mt-3 text-slate-300 text-[11px] xs:text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                {doctor.description ||
                  fallbackMatch?.description ||
                  (isDrRashid
                    ? "Senior Consultant Physiotherapist specializing in sports injury rehabilitation, Mulligan’s Mobilization with Movement (MWM), certified cupping, dry needling, and advanced kinesiology taping modalities."
                    : "Physiotherapist focused on movement recovery, patient education, exercise therapy, and musculoskeletal rehabilitation.")}
              </p>

              {/* Quick Summary Highlights Strip */}
              <div
                className={`grid ${
                  isDrRashid
                    ? "grid-cols-2 sm:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3"
                } gap-1.5 xs:gap-2.5 mt-3.5 xs:mt-5 pt-3 xs:pt-4 border-t border-white/10`}
              >
                <div className="bg-white/5 border border-white/10 rounded-lg xs:rounded-xl p-1.5 xs:p-2.5 text-center">
                  <p className="text-[9px] xs:text-[11px] sm:text-xs text-slate-400 font-medium">Qualification</p>
                  <p
                    className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-teal-300 mt-0.5 truncate"
                    title={doctor.education || fallbackMatch?.education || (isDrRashid ? "MPT (Sports)" : "BPT")}
                  >
                    {doctor.education || fallbackMatch?.education || (isDrRashid ? "MPT (Sports)" : "BPT")}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg xs:rounded-xl p-1.5 xs:p-2.5 text-center">
                  <p className="text-[9px] xs:text-[11px] sm:text-xs text-slate-400 font-medium">Specialization</p>
                  <p
                    className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-white mt-0.5 truncate"
                    title={
                      (doctor.specialization ? doctor.specialization.split(",")[0] : null) ||
                      fallbackMatch?.specialization?.split(",")?.[0] ||
                      (isDrRashid ? "Sports Rehab" : "Movement Rehab")
                    }
                  >
                    {(doctor.specialization ? doctor.specialization.split(",")[0] : null) ||
                      fallbackMatch?.specialization?.split(",")?.[0] ||
                      (isDrRashid ? "Sports Rehab" : "Movement Rehab")}
                  </p>
                </div>

                {isDrRashid ? (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-lg xs:rounded-xl p-1.5 xs:p-2.5 text-center">
                      <p className="text-[9px] xs:text-[11px] sm:text-xs text-slate-400 font-medium">Patients Treated</p>
                      <p className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-white mt-0.5">
                        2,500+
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg xs:rounded-xl p-1.5 xs:p-2.5 text-center">
                      <p className="text-[9px] xs:text-[11px] sm:text-xs text-slate-400 font-medium">Certifications</p>
                      <p className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-teal-300 mt-0.5">
                        5 Certified
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg xs:rounded-xl p-1.5 xs:p-2.5 text-center col-span-2 sm:col-span-1">
                    <p className="text-[9px] xs:text-[11px] sm:text-xs text-slate-400 font-medium">Clinical Practice</p>
                    <p className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-teal-300 mt-0.5 truncate">
                      Musculoskeletal Rehab
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons Row - Full Width on Mobile (320-425px) and Inline on sm+ */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2 xs:gap-3 mt-4 xs:mt-6">
                <Link
                  to={`/booking?doctor=${encodeURIComponent(doctor.name || doctorLocalizedName)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 xs:gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-3.5 xs:px-5 py-2.5 xs:py-3 rounded-xl font-bold text-xs xs:text-sm shadow-lg hover:shadow-teal-500/25 transition duration-200 text-center"
                >
                  <CalendarCheck size={16} />
                  <span>{t("doctorProfile.bookAppointment", "Book In-Clinic Appointment")}</span>
                </Link>

                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent(
                    `Hello ${doctorLocalizedName}, I would like to inquire about a physiotherapy appointment at HealStride.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 xs:gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 xs:px-5 py-2.5 xs:py-3 rounded-xl font-bold text-xs xs:text-sm shadow-md transition duration-200 text-center"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 xs:w-5 xs:h-5 object-contain shrink-0" />
                  <span>{t("doctorProfile.whatsappConsult", "Direct WhatsApp Consultation")}</span>
                </a>

                <a
                  href={`tel:${phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 xs:gap-2 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-white px-3.5 xs:px-5 py-2.5 xs:py-3 rounded-xl font-bold text-xs xs:text-sm backdrop-blur-md shadow-md hover:shadow-lg transition duration-200 text-center"
                >
                  <img src="/call.png" alt="Call" className="w-4 h-4 xs:w-5 xs:h-5 object-contain shrink-0 drop-shadow-sm" />
                  <span>Call Doctor</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 8 cols details + 4 cols booking sidebar */}
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* 1. Official Certifications & Accreditations (Key Request) */}
            {certificationsList.length > 0 && (
              <div className="bg-white rounded-2xl xs:rounded-3xl p-3.5 xs:p-5 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-2.5 xs:gap-3 mb-2">
                  <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl xs:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                    <Award size={20} className="xs:w-[22px] xs:h-[22px]" />
                  </div>
                  <div>
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      {t("doctorProfile.certificationsTitle", "Certified Professional Accreditations")}
                    </h2>
                    <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500">
                      {t(
                        "doctorProfile.certificationsSubtitle",
                        "Evidence-based advanced therapy certifications"
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 xs:gap-4 mt-4 xs:mt-6">
                  {certificationsList.map((cert, index) => {
                    const meta = getCertificationMeta(cert);
                    const CertIcon = meta.icon;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                        className={`rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 border ${meta.border} bg-gradient-to-r ${meta.gradient} flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 transition hover:shadow-md`}
                      >
                        <div
                          className={`w-10 h-10 xs:w-12 xs:h-12 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-slate-100 ${meta.iconColor}`}
                        >
                          <CertIcon size={20} className="xs:w-6 xs:h-6" />
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 xs:gap-2">
                            <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900">
                              {meta.title}
                            </h3>
                            <span
                              className={`text-[10px] xs:text-[11px] font-semibold px-2 xs:px-2.5 py-0.5 rounded-full ${meta.badgeColor}`}
                            >
                              {meta.badge}
                            </span>
                          </div>
                          <p className="text-[11px] xs:text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {meta.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Academic Qualifications & Medical Credentials */}
            <div className="bg-white rounded-2xl xs:rounded-3xl p-3.5 xs:p-5 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2.5 xs:gap-3 mb-4 xs:mb-6">
                <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl xs:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                  <GraduationCap size={20} className="xs:w-[22px] xs:h-[22px]" />
                </div>
                <div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {t("doctorProfile.education", "Academic Credentials & Qualifications")}
                  </h2>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500">
                    Verified degrees & professional licensing
                  </p>
                </div>
              </div>

              {isDrRashid ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  {/* Degree 1: MPT Sports or Doctor Education */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-teal-100 bg-teal-50/40">
                    <div className="flex items-center gap-2 text-teal-700 font-bold text-xs xs:text-sm">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{doctor.education ? doctor.education.split("|")[0].trim() : "Master of Physiotherapy - MPT (Sports)"}</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      Specialized higher master&apos;s degree in sports kinesiology, athletic injury rehabilitation, and biomechanical movement recovery.
                    </p>
                  </div>

                  {/* Degree 2: BPT or Second Degree */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
                      <span>{doctor.education && doctor.education.includes("|") ? doctor.education.split("|")[1].trim() : "Bachelor of Physiotherapy - BPT"}</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      Comprehensive clinical foundation in orthopedic rehabilitation, neurology, cardio-respiratory physiotherapy, and electro-physical agents.
                    </p>
                  </div>

                  {/* Medical Council Registration */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <BadgeCheck size={16} className="text-teal-600 shrink-0" />
                      <span>Medical Council Registration</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 font-semibold text-teal-700">
                      {doctor.registration ? (doctor.registration.startsWith("Reg") ? doctor.registration : `Reg. ${doctor.registration}`) : "Reg. DEG2/71968/2025"}
                    </p>
                    <p className="text-[11px] xs:text-xs text-slate-500 mt-1 leading-relaxed">
                      Authorized and registered practitioner with state physical therapy councils.
                    </p>
                  </div>

                  {/* Clinical Experience */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <BriefcaseMedical size={16} className="text-teal-600 shrink-0" />
                      <span>Clinical Experience</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 font-semibold text-teal-700">
                      {doctor.experience ? (doctor.experience.toLowerCase().includes("year") ? doctor.experience : `${doctor.experience} Clinical Practice`) : "5+ Years of Dedicated Clinical Practice"}
                    </p>
                    <p className="text-[11px] xs:text-xs text-slate-500 mt-1 leading-relaxed">
                      Over 2,500+ successful musculoskeletal and sports pain rehabilitation cases treated.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  {/* Doctor Degree */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-teal-100 bg-teal-50/40">
                    <div className="flex items-center gap-2 text-teal-700 font-bold text-xs xs:text-sm">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{doctor.education || "Bachelor of Physiotherapy (BPT)"}</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      Clinical degree in physical therapy, musculoskeletal rehabilitation, and exercise-based therapeutic recovery.
                    </p>
                  </div>

                  {/* Medical Council Registration / Practice */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <BadgeCheck size={16} className="text-teal-600 shrink-0" />
                      <span>{doctor.registration ? "Council Registration" : "Movement Recovery Specialist"}</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      {doctor.registration || "Focused expertise in functional movement restoration, postural re-education, and mobility training."}
                    </p>
                  </div>

                  {/* Clinical Experience */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <BriefcaseMedical size={16} className="text-teal-600 shrink-0" />
                      <span>Clinical Experience</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      {doctor.experience || "Musculoskeletal and orthopedic rehabilitation clinical practice."}
                    </p>
                  </div>

                  {/* Exercise Therapy & Patient Care */}
                  <div className="p-3 xs:p-4 rounded-xl xs:rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs xs:text-sm">
                      <HeartPulse size={16} className="text-teal-600 shrink-0" />
                      <span>Exercise Therapy & Patient Care</span>
                    </div>
                    <p className="text-[11px] xs:text-xs text-slate-600 mt-1 leading-relaxed">
                      Individualized therapeutic exercise prescription and patient education for long-term health.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Specializations & Clinical Modalities */}
            <div className="bg-white rounded-2xl xs:rounded-3xl p-3.5 xs:p-5 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2.5 xs:gap-3 mb-3 xs:mb-4">
                <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl xs:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                  <Activity size={20} className="xs:w-[22px] xs:h-[22px]" />
                </div>
                <div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {t("doctorProfile.specialization", "Clinical Specializations")}
                  </h2>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500">
                    Focused therapeutic domains & modern modalities
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 xs:gap-2.5 mt-3 xs:mt-4">
                {specializationsList.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3.5 py-1.5 xs:py-2 rounded-lg xs:rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] xs:text-xs sm:text-sm font-semibold shadow-2xs hover:bg-teal-100/70 transition"
                  >
                    <Check size={13} className="text-teal-600 stroke-[3] shrink-0" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Conditions Treated & Recovery Focus */}
            <div className="bg-white rounded-2xl xs:rounded-3xl p-3.5 xs:p-5 sm:p-8 shadow-sm border border-slate-200/80">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-1.5 xs:mb-2">
                {t("doctorProfile.conditionsTreated", "Conditions Treated & Rehabilitation Scope")}
              </h2>
              <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500 mb-4 xs:mb-6">
                Specialized targeted protocols for rapid symptom relief and long-term functional recovery
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 text-xs sm:text-sm">
                {(isDrRashid
                  ? [
                      "Sports Injuries (Ligament Sprains, Meniscus, Muscle Strains)",
                      "Slip Disc, Sciatica & Radiating Nerve Pain",
                      "Chronic Lower Back Pain & Lumbar Spondylosis",
                      "Cervical Spondylosis, Stiff Neck & Tension Headaches",
                      "Knee Osteoarthritis & Post-Op Joint Mobility",
                      "Frozen Shoulder & Rotator Cuff Tendonitis",
                      "Tennis Elbow, Golfer's Elbow & Wrist Tendonitis",
                      "Post-Fracture Stiffness & Neurological Rehabilitation",
                    ]
                  : [
                      "Musculoskeletal Pain Relief & Postural Correction",
                      "Back Pain & Lumbar Spine Mobility Care",
                      "Neck Stiffness & Shoulder Mobility Therapy",
                      "Knee Joint Stiffness & Therapeutic Exercises",
                      "Muscle Weakness & Reconditioning Programs",
                      "Post-Injury Functional Movement Training",
                      "Joint Flexibility & Mobility Restoration",
                      "Everyday Ergonomic & Activity Rehabilitation",
                    ]
                ).map((condition, idx) => (
                  <div
                    key={idx}
                    className="flex items-start xs:items-center gap-2 p-2.5 xs:p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition"
                  >
                    <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-teal-500 shrink-0 mt-1 xs:mt-0" />
                    <span className="text-[11px] xs:text-xs sm:text-sm text-slate-700 font-medium">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Patient Testimonials for Dr. Rashid */}
            {isDrRashid && (
              <div className="bg-white rounded-2xl xs:rounded-3xl p-3.5 xs:p-5 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2.5 xs:gap-4 mb-4 xs:mb-6">
                  <div>
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      Patient Feedback & Recovery Stories
                    </h2>
                    <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500">
                      Real feedback from patients treated by Dr. MD Rashid
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 xs:px-3 py-1 rounded-xl text-amber-800 text-[11px] xs:text-xs font-bold">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>5.0 Rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xs:gap-4">
                  {DR_RASHID_REVIEWS.map((rev, i) => (
                    <div
                      key={i}
                      className="p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                          {[...Array(5)].map((_, starI) => (
                            <Star key={starI} size={11} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[11px] xs:text-xs text-slate-700 italic leading-relaxed">
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>

                      <div className="mt-3 xs:mt-4 pt-2.5 xs:pt-3 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-900">{rev.name}</p>
                        <p className="text-[10px] xs:text-[11px] text-teal-700 font-semibold">{rev.condition}</p>
                        <p className="text-[9px] xs:text-[10px] text-slate-400 mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Appointment Booking & Consultation Card */}
          <div className="lg:col-span-4 space-y-4 xs:space-y-6 lg:sticky lg:top-20">
            {/* Consultation Card */}
            <div className="bg-white rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-7 shadow-lg border border-teal-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full pointer-events-none -z-0" />

              <div className="relative z-10">
                <span className="inline-block px-2.5 xs:px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] xs:text-xs font-semibold uppercase tracking-wider mb-2.5 xs:mb-3">
                  In-Clinic Consultation
                </span>

                <h3 className="text-lg xs:text-xl font-bold text-slate-900 leading-tight">
                  Schedule Your Session
                </h3>
                <p className="text-[11px] xs:text-xs text-slate-500 mt-1">
                  Book direct consultation with {doctorLocalizedName}
                </p>

                {/* Consultation Details */}
                <div className="mt-4 xs:mt-5 space-y-2.5 xs:space-y-3">
                  <div className="flex items-start gap-2.5 p-2.5 xs:p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock size={16} className="text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Consultation Timings</h4>
                      <p className="text-[11px] xs:text-xs text-slate-600 mt-0.5">
                        Morning: 09:00 AM - 12:00 PM<br />
                        Evening: 05:00 PM - 09:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 xs:p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin size={16} className="text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Clinic Location</h4>
                      <p className="text-[11px] xs:text-xs text-slate-600 mt-0.5">
                        LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Bhopal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 xs:p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Zero Wait Priority</h4>
                      <p className="text-[11px] xs:text-xs text-slate-600 mt-0.5">
                        Confirmed appointment slots with dedicated doctor evaluation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Action */}
                <Link
                  to={`/booking?doctor=${encodeURIComponent(doctor.name || doctorLocalizedName)}`}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white py-3 xs:py-3.5 rounded-xl font-bold text-xs xs:text-sm shadow-md hover:shadow-lg transition duration-200 text-center"
                >
                  <CalendarCheck size={16} />
                  <span>{t("doctorProfile.bookAppointment", "Book Appointment Now")}</span>
                </Link>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent(
                    `Hello ${doctorLocalizedName}, I would like to book a physiotherapy session with you at HealStride.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 py-2.5 xs:py-3 rounded-xl font-bold text-xs transition duration-200 text-center"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Phone */}
                <a
                  href={`tel:${phoneRaw}`}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 xs:py-3 rounded-xl font-semibold text-xs transition duration-200 text-center"
                >
                  <img src="/call.png" alt="Call" className="w-3.5 h-3.5 object-contain shrink-0" />
                  <span>Call: +91 88094 91380</span>
                </a>
              </div>
            </div>

            {/* Quick Share Card */}
            <div className="bg-white rounded-xl xs:rounded-2xl p-3.5 xs:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-800">Recommend this Doctor</p>
                <p className="text-[10px] xs:text-[11px] text-slate-500">Share profile with family or friends</p>
              </div>
              <button
                onClick={handleShare}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 xs:px-3 py-1.5 xs:py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition"
              >
                <Share2 size={13} />
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
