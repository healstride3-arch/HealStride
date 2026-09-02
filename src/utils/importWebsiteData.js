import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { blogs } from "../data/blogs";
import { doctors, staff } from "../data/team";
import { galleryItems } from "../data/galleryItems";

const services = [
  {
    id: "cervical-pain",
    title: "Cervical Pain Treatment",
    slug: "cervical-pain",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    description:
      "Specialized therapy to relieve neck stiffness, cervical nerve compression, and posture-related pain.",
    benefits: [
      "Relieves neck & upper back stiffness",
      "Reduces radiating arm pain & tingling",
      "Restores head & neck movement",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "back-pain",
    title: "Back Pain Relief",
    slug: "back-pain",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    description:
      "Comprehensive physical therapy for acute/chronic lumbar pain, disc herniation, and spine mobility.",
    benefits: [
      "Rapid spinal pain relief",
      "Core & lower back strengthening",
      "Prevents recurring back spasms",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "knee-pain",
    title: "Knee Pain Care",
    slug: "knee-pain",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    description:
      "Targeted rehabilitation for knee arthritis, ligament sprains, and joint stiffness.",
    benefits: [
      "Reduces joint swelling & pain",
      "Improves walking stability",
      "Strengthens quadriceps & hamstrings",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "cupping-therapy",
    title: "Cupping (Hijama) Therapy",
    slug: "cupping-therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    description:
      "Traditional therapeutic cupping to release deep fascial tension and boost blood flow.",
    benefits: [
      "Enhances cellular microcirculation",
      "Releases deep myofascial tension",
      "Accelerates natural healing",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "tennis-elbow",
    title: "Tennis Elbow Therapy",
    slug: "tennis-elbow",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    description:
      "Effective tendon rehab and strengthening for forearm muscle strain and elbow joint inflammation.",
    benefits: [
      "Relieves outer elbow pain",
      "Improves grip strength",
      "Speeds up tendon tissue recovery",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "plantar-fasciitis",
    title: "Plantar Fasciitis Care",
    slug: "plantar-fasciitis",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    description:
      "Targeted heel pain and foot arch treatment for comfortable, pain-free morning steps and walking.",
    benefits: [
      "Eases morning heel stabbing pain",
      "Stretches tight calf & plantar fascia",
      "Custom arch load distribution",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "frozen-shoulder",
    title: "Frozen Shoulder Rehab",
    slug: "frozen-shoulder",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    description:
      "Gentle mobilization techniques and therapeutic stretching to regain complete shoulder movement.",
    benefits: [
      "Restores overhead arm range",
      "Alleviates persistent night ache",
      "Prevents joint capsule adhesions",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "osteoarthritis",
    title: "Osteoarthritis Management",
    slug: "osteoarthritis",
    category: "joints",
    categoryLabel: "Joint & Muscle",
    description:
      "Therapeutic joint exercise programs to preserve cartilage, reduce stiffness, and boost strength.",
    benefits: [
      "Delays joint degeneration",
      "Maintains independent mobility",
      "Reduces joint friction & pain",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "sciatica",
    title: "Sciatica Pain Therapy",
    slug: "sciatica",
    category: "spine",
    categoryLabel: "Spine & Cervical",
    description:
      "Targeted sciatic nerve decompression, spinal traction, and core stabilizing exercises.",
    benefits: [
      "Relieves shooting leg & hip pain",
      "Decompresses pinched spinal nerves",
      "Restores normal posture",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "stroke-rehab",
    title: "Stroke Rehabilitation",
    slug: "stroke-rehab",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    description:
      "Neurological therapy designed to help patients regain motor control, balance, and daily independence.",
    benefits: [
      "Relearns motor patterns & balance",
      "Prevents limb spasticity & weakness",
      "Promotes independence",
    ],
    duration: "60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "sports-rehab",
    title: "Sports Rehabilitation",
    slug: "sports-rehab",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    description:
      "High-performance recovery protocols to help athletes heal fast and prevent future sports injuries.",
    benefits: [
      "Faster return to sports",
      "Agility and neuromuscular conditioning",
      "Injury prevention protocols",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "post-surgery-physio",
    title: "Post Surgery Physio",
    slug: "post-surgery-physio",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    description:
      "Guided post-operative rehabilitation for joint replacements, fracture repairs, and spine surgeries.",
    benefits: [
      "Safe progressive recovery",
      "Prevents scar tissue stiffness",
      "Restores muscular endurance",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "pain-reduction",
    title: "Pain Reduction Therapy",
    slug: "pain-reduction",
    category: "rehab",
    categoryLabel: "Rehabilitation",
    description:
      "Advanced physical modalities combined with hands-on manual techniques for swift and lasting relief.",
    benefits: [
      "Non-invasive fast pain control",
      "Improves local blood circulation",
      "Decreases muscle spasms",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "dry-needling",
    title: "Dry Needling Therapy",
    slug: "dry-needling",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    description:
      "Targeted fine filiform needle stimulation to deactivate painful trigger points and deep muscle knots.",
    benefits: [
      "Instantly releases trigger knots",
      "Restores muscle length & flexibility",
      "Reduces referred pain",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "iastm-therapy",
    title: "IASTM Therapy",
    slug: "iastm-therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    description:
      "Instrument-Assisted Soft Tissue Mobilization using ergonomic instruments for accelerated healing.",
    benefits: [
      "Breaks down fascial adhesions & scar tissue",
      "Improves cellular repair",
      "Restores muscle glide",
    ],
    duration: "30-45 mins",
    active: true,
    showOnHome: true,
  },
  {
    id: "exercise-therapy",
    title: "Exercise Therapy For Various Conditions",
    slug: "exercise-therapy",
    category: "therapies",
    categoryLabel: "Specialized Therapy",
    description:
      "Customized therapeutic strengthening, stretching, and functional movements for every patient.",
    benefits: [
      "Builds strength & functional endurance",
      "Corrects postural imbalances",
      "Prevents injury recurrence",
    ],
    duration: "45-60 mins",
    active: true,
    showOnHome: true,
  },
];

const faqs = [
  {
    id: "faq-appointment",
    question: "Do I need an appointment before visiting?",
    answer:
      "Appointments are recommended so our physiotherapists can give you dedicated one-on-one consultation time.",
    active: true,
  },
  {
    id: "faq-conditions",
    question: "Which conditions do you treat?",
    answer:
      "We treat back pain, neck pain, knee pain, frozen shoulder, sciatica, sports injuries, post-surgery rehabilitation, stroke rehab, and musculoskeletal pain.",
    active: true,
  },
  {
    id: "faq-session-time",
    question: "How long does one physiotherapy session take?",
    answer:
      "Most sessions take around 30 to 60 minutes depending on the condition, assessment, and treatment plan.",
    active: true,
  },
];

const settings = {
  address:
    "LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Ashoka Garden, Bhopal - 462023",
  hours: "Morning 9:00 AM - 12:00 PM\nEvening 5:00 PM - 9:00 PM",
  phone: "+91 88094 91380",
  whatsapp: "+91 82525 80389",
  email: "healstride3@gmail.com",
  instagram: "https://www.instagram.com/healstride.physio/",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
};

const normalizeBlog = (blog) => ({
  ...blog,
  id: undefined,
  slug: blog.slug || String(blog.id),
  coverImage: blog.coverImage || blog.image || "",
  image: blog.image || blog.coverImage || "",
  active: true,
  createdAt: serverTimestamp(),
});

const normalizeProfile = (item) => ({
  ...item,
  id: undefined,
  active: true,
  createdAt: serverTimestamp(),
});

const writeDocs = async (collectionName, items, mapper = (item) => item) => {
  await Promise.all(
    items.map((item) =>
      setDoc(
        doc(db, collectionName, String(item.id)),
        {
          ...mapper(item),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    )
  );
};

export const importWebsiteData = async () => {
  await Promise.all([
    writeDocs("services", services),
    writeDocs("blogs", blogs, normalizeBlog),
    writeDocs("doctors", doctors, normalizeProfile),
    writeDocs("staff", staff, normalizeProfile),
    writeDocs("gallery", galleryItems, normalizeProfile),
    writeDocs("faqs", faqs),
    setDoc(doc(db, "settings", "clinic"), settings, { merge: true }),
  ]);
};
