import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ALL_SERVICES } from "../data/servicesData";
import { blogs } from "../data/blogs";
import { doctors, staff } from "../data/team";
import { galleryItems } from "../data/galleryItems";

const services = ALL_SERVICES;

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
