import drRashid from "../assets/images/Dr.MD.Rashid.png";
import drWazul from "../assets/images/Dr Wazul Quamar.jpeg";

export const doctors = [
  {
    id: "dr-md-rashid",
    slug: "dr-md-rashid",
    name: "Dr. MD Rashid (PT)",
    role: "Senior Consultant Physiotherapist | MPT (Sports)",
    designation: "Senior Consultant Physiotherapist & Sports Rehabilitation Specialist",
    degree: "MPT (Sports), BPT",
    specialization:
      "Sports Rehabilitation, Cupping Therapy, Dry Needling, Taping Therapy, Mulligan's MWM, BLS & Critical Care, Orthopedic Pain Relief",
    description:
      "Senior Consultant Physiotherapist specializing in sports injury rehabilitation, Mulligan’s Mobilization with Movement (MWM), certified cupping, dry needling, and advanced kinesiology taping modalities with 5+ years of clinical excellence.",
    education: "Master of Physiotherapy (MPT - Sports) | Bachelor of Physiotherapy (BPT)",
    experience: "5+ years",
    registration: "DEG2/71968/2025",
    image: drRashid,
    imageUrl: drRashid,
    certifications: [
      "Certified in Cupping Therapy",
      "Certified in Dry Needling Therapy",
      "Certified in Taping Therapy",
      "Certified in Mulligan’s Mobilization with Movement (MWM)",
      "Certified in Basic Life Support (BLS) & Critical Care Management",
    ],
    qualifications: [
      "Master of Physiotherapy - MPT (Sports)",
      "Bachelor of Physiotherapy - BPT",
      "Certified in Cupping Therapy",
      "Certified in Dry Needling Therapy",
      "Certified in Taping Therapy",
      "Certified in Mulligan’s Mobilization with Movement (MWM)",
      "Certified in Basic Life Support (BLS) & Critical Care Management",
    ],
  },
  {
    id: "dr-wajhul-qamar",
    slug: "dr-wajhul-qamar",
    name: "Dr. Md Wajhul Qumar (PT)",
    role: "Physiotherapist & Rehab Specialist (BPT)",
    designation: "Physiotherapist & Rehab Specialist",
    specialization:
      "Cardiopulmonary Rehab, Cupping Therapy, Dry Needling, IASTM, Manual Therapy, Taping & Neuro-Rehabilitation",
    description:
      "Certified physiotherapist specializing in Cardiopulmonary Rehabilitation, Dry Needling, Cupping, IASTM, Taping, and comprehensive musculoskeletal recovery with 7 advanced clinical certifications.",
    education: "Bachelor of Physiotherapy (BPT)",
    experience: "3+ Years of Dedicated Clinical Practice",
    registration: "Available at clinic",
    image: drWazul,
    imageUrl: drWazul,
    certifications: [
      "Certified in Cupping Therapy",
      "Certified in Dry Needling Therapy",
      "Certified in IASTM (Instrument Assisted Soft Tissue Mobilization)",
      "Certified in Cardiopulmonary Rehabilitation",
      "Certified in Neuro & Orthopedic Rehabilitation",
      "Certified in Taping Therapy",
      "Certified in Manual Therapy",
    ],
    qualifications: [
      "Bachelor of Physiotherapy (BPT)",
      "Cardiopulmonary Rehabilitation Specialist",
      "Manual Therapy & Joint Mobilization",
      "Myofascial Trigger Point & Dry Needling",
      "IASTM & Fascial Restructuring",
      "Kinesiology & Biomechanical Taping",
    ],
  },
];

export const staff = [];

export const getDoctorLocalizedName = (member, i18n) => {
  const lang = i18n?.language || "";
  const isHi = lang.startsWith("hi");
  const identifier = `${member?.name || ""} ${member?.slug || ""} ${member?.id || ""}`.toLowerCase();
  if (identifier.includes("rashid")) {
    return isHi ? "डॉ. एमडी राशिद (पीटी)" : "Dr. MD Rashid (PT)";
  }
  if (identifier.includes("wajhul") || identifier.includes("wazul") || identifier.includes("qamar") || identifier.includes("qumar")) {
    return isHi ? "डॉ. एमडी वजहुल क़मर (पीटी)" : "Dr. Md Wajhul Qumar (PT)";
  }
  return member?.name || "";
};

export const getStaffLocalizedRole = (member, i18n) => {
  const isHi = (i18n?.language || "").startsWith("hi");
  if (!isHi) return member?.role || "";
  const role = (member?.role || "").toLowerCase();
  if (role.includes("rehab") || role.includes("clinical")) {
    return "वरिष्ठ क्लीनिकल एवं रिहैब सहायक";
  }
  if (role.includes("coordinator") || role.includes("front desk")) {
    return "मरीज सेवा समन्वयक व रिसेप्शन";
  }
  if (role.includes("technician") || role.includes("equipment")) {
    return "थेरेपी उपकरण तकनीशियन";
  }
  return member?.role || "";
};

