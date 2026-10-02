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
    name: "Dr. Wajhul Qamar (PT)",
    role: "Physiotherapist & Rehab Specialist (BPT)",
    designation: "Physiotherapist & Rehab Specialist",
    specialization:
      "Movement Recovery, Musculoskeletal Rehabilitation, Exercise Therapy, Pain Management",
    description:
      "Physiotherapist focused on movement recovery, patient education, exercise therapy, and musculoskeletal rehabilitation.",
    education: "Bachelor of Physiotherapy (BPT)",
    experience: "Clinical rehabilitation experience",
    registration: "Available at clinic",
    image: drWazul,
    imageUrl: drWazul,
    qualifications: [
      "Bachelor of Physiotherapy (BPT)",
      "Movement Recovery Specialist",
      "Musculoskeletal Rehabilitation",
      "Exercise Therapy & Patient Care",
    ],
  },
];

export const staff = [
  {
    id: "staff-1",
    slug: "rehab-assistant",
    name: "Mohit Verma",
    role: "Senior Clinical & Rehab Assistant",
    department: "Clinical Support",
    experience: "3+ Years Experience",
    bio: "Assists the physiotherapists in setting up modalities, guiding patient rehabilitation exercises, and ensuring optimal patient comfort.",
    certifications: "Basic Life Support (BLS) & Patient Care Trained",
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600",
    order: 1,
    active: true,
  },
  {
    id: "staff-2",
    slug: "care-coordinator",
    name: "Sunita Sharma",
    role: "Patient Care Coordinator & Front Desk",
    department: "Patient Relations & Reception",
    experience: "4+ Years Experience",
    bio: "Coordinates patient appointments, maintains clinic hygiene standards, and manages smooth patient onboarding and queries.",
    certifications: "Healthcare Administration & Patient Relations",
    imageUrl: "https://images.unsplash.com/photo-1594824813637-2856417730e6?auto=format&fit=crop&q=80&w=600",
    order: 2,
    active: true,
  },
  {
    id: "staff-3",
    slug: "therapy-technician",
    name: "Aakash Mehra",
    role: "Therapy & Equipment Technician",
    department: "Modality & Equipment Care",
    experience: "3+ Years Experience",
    bio: "Manages calibration and hygiene of physiotherapy equipment including traction units, cupping sets, and electrotherapy machines.",
    certifications: "Electrotherapy Equipment & Modality Certified",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    order: 3,
    active: true,
  },
];

export const getDoctorLocalizedName = (member, i18n) => {
  const lang = i18n?.language || "";
  const isHi = lang.startsWith("hi");
  const identifier = `${member?.name || ""} ${member?.slug || ""} ${member?.id || ""}`.toLowerCase();
  if (identifier.includes("rashid")) {
    return isHi ? "डॉ. एमडी राशिद (पीटी)" : "Dr. MD Rashid (PT)";
  }
  if (identifier.includes("wajhul") || identifier.includes("wazul") || identifier.includes("qamar")) {
    return isHi ? "डॉ. वजहुल कमर (पीटी)" : "Dr. Wajhul Qamar (PT)";
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

