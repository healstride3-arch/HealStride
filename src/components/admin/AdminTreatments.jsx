import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Edit,
  Eye,
  EyeOff,
  ImagePlus,
  Save,
  Search,
  X,
} from "lucide-react";

import { db } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import {
  ALL_TREATMENTS,
  getTreatmentImage,
} from "../../data/treatmentsData";
import Pagination from "./Pagination";

const emptyForm = {
  name: "",
  title: "",
  slug: "",
  category: "",
  subtitle: "",
  summary: "",
  imageUrl: "",
  contentText: "",
  faqsText: "",
  active: true,
};

const parseFaqs = (value) =>
  String(value || "")
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const question = lines
        .find((line) => /^q(uestion)?:/i.test(line))
        ?.replace(/^q(uestion)?:/i, "")
        .trim();
      const answer = lines
        .find((line) => /^a(nswer)?:/i.test(line))
        ?.replace(/^a(nswer)?:/i, "")
        .trim();

      return question && answer ? { question, answer } : null;
    })
    .filter(Boolean);

const formatFaqs = (faqs = []) =>
  (faqs || [])
    .map((faq) => `Q: ${faq.question || ""}\nA: ${faq.answer || ""}`)
    .join("\n\n");

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const htmlToEditableText = (html = "") => {
  const normalized = String(html || "")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/ul>|<\/ol>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (typeof document === "undefined") {
    return normalized;
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = normalized;
  return textarea.value.replace(/[ \t]+\n/g, "\n").trim();
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const editableTextToHtml = (value = "") =>
  String(value || "")
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split(/\r?\n/)
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter(Boolean)
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("");

const normalizeKey = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mergeWebsiteTreatments = (firestoreTreatments) => {
  const firestoreMap = new Map(
    firestoreTreatments.map((treatment) => [
      normalizeKey(treatment.slug || treatment.id || treatment.name),
      treatment,
    ])
  );

  return ALL_TREATMENTS.map((websiteTreatment) => {
    const key = normalizeKey(
      websiteTreatment.slug || websiteTreatment.id || websiteTreatment.name
    );
    const firestoreTreatment = firestoreMap.get(key);

    return {
      ...websiteTreatment,
      imageUrl: getTreatmentImage(websiteTreatment),
      ...(firestoreTreatment || {}),
      id: firestoreTreatment?.id || websiteTreatment.id || websiteTreatment.slug,
    };
  }).sort((a, b) =>
    String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""))
  );
};

const AdminTreatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "treatments"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

        setTreatments(mergeWebsiteTreatments(data));
        setFetching(false);
      },
      (error) => {
        console.error("Failed to load treatments:", error);
        alert("Failed to load treatments.");
        setFetching(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(treatments.map((item) => item.category).filter(Boolean))
      ),
    [treatments]
  );

  const filteredTreatments = useMemo(() => {
    const queryText = searchQuery.toLowerCase().trim();

    return treatments.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const haystack = `${item.name || ""} ${item.title || ""} ${item.slug || ""}`
        .toLowerCase();
      const matchesSearch = !queryText || haystack.includes(queryText);

      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery, treatments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery, itemsPerPage]);

  const paginatedTreatments = filteredTreatments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startEdit = (treatment) => {
    setEditingId(treatment.id);
    setForm({
      name: treatment.name || "",
      title: treatment.title || "",
      slug: treatment.slug || "",
      category: treatment.category || "",
      subtitle: treatment.subtitle || "",
      summary: treatment.summary || "",
      imageUrl: treatment.imageUrl || treatment.image || "",
      contentText: htmlToEditableText(treatment.contentHtml || ""),
      faqsText: formatFaqs(treatment.faqs),
      active: treatment.active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);

    const fileInput = document.getElementById("treatmentImage");
    if (fileInput) fileInput.value = "";
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadedUrl = await uploadImage(file, "treatments");
      setForm((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));
    } catch (error) {
      console.error("Treatment image upload failed:", error);
      alert("Failed to upload treatment image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingId) {
      alert("Select a treatment to edit.");
      return;
    }

    if (!form.name.trim() || !form.title.trim() || !form.summary.trim()) {
      alert("Please fill name, title and summary.");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "treatments", editingId), {
        name: form.name.trim(),
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        subtitle: form.subtitle.trim(),
        summary: form.summary.trim(),
        imageUrl: form.imageUrl.trim(),
        contentHtml: editableTextToHtml(form.contentText),
        faqs: parseFaqs(form.faqsText),
        active: form.active,
        updatedAt: Timestamp.now(),
      });

      alert("Treatment detail page updated successfully.");
      resetForm();
    } catch (error) {
      console.error("Failed to update treatment:", error);
      alert("Failed to update treatment.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (treatment) => {
    try {
      await updateDoc(doc(db, "treatments", treatment.id), {
        active: treatment.active === false,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Failed to update treatment status:", error);
      alert("Failed to update treatment status.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Treatment Detail Pages
        </h1>
        <p className="text-slate-500 mt-1">
          Edit public treatment pages, article content, FAQs, images and visibility.
        </p>
      </motion.div>

      {editingId && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white p-5 md:p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Edit Treatment Page
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-500 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Display Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Page Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subtitle
              </label>
              <textarea
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Summary
              </label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Article Content
              </label>
              <textarea
                name="contentText"
                value={form.contentText}
                onChange={handleChange}
                rows="14"
                placeholder="Write readable article text here. Use blank lines for paragraphs and lines starting with - for bullet lists."
                className="w-full rounded-xl border px-4 py-3 text-sm leading-7 outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Tags are hidden here. On save, this text is converted for the public detail page.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                FAQs
              </label>
              <textarea
                name="faqsText"
                value={form.faqsText}
                onChange={handleChange}
                rows="8"
                placeholder={"Q: First question?\nA: First answer.\n\nQ: Second question?\nA: Second answer."}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload Treatment Image
              </label>
              <input
                id="treatmentImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Or paste image URL"
                className="mt-3 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Treatment preview"
                className="h-48 w-full rounded-xl border object-cover"
              />
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
            <label className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-5 w-5 accent-teal-600"
              />
              Show this treatment publicly
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Update Treatment"}
            </button>
          </div>
        </motion.form>
      )}

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_260px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search treatment by name or slug..."
            className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {fetching ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow">
          Loading treatments...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedTreatments.map((treatment) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={treatment.imageUrl || treatment.image}
                    alt={treatment.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold uppercase text-white">
                    {treatment.category}
                  </span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white ${
                    treatment.active === false ? "bg-red-500" : "bg-green-500"
                  }`}>
                    {treatment.active === false ? "Hidden" : "Active"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 line-clamp-1">
                    {treatment.name || treatment.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {treatment.summary || treatment.subtitle}
                  </p>
                  {treatment.contentHtml && (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      Detail: {stripHtml(treatment.contentHtml)}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => startEdit(treatment)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={15} />
                      Edit Detail
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleActive(treatment)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900"
                    >
                      {treatment.active === false ? <Eye size={15} /> : <EyeOff size={15} />}
                      {treatment.active === false ? "Show" : "Hide"}
                    </button>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <ImagePlus size={14} />
                      {treatment.slug}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTreatments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[6, 9, 12, 24]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTreatments;
