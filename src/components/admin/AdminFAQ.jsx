import { useEffect, useState, useMemo } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Plus,
  Search,
  CircleHelp,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";
import { db } from "../../firebase/firebase";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [faqPage, setFaqPage] = useState(1);
  const [faqPerPage, setFaqPerPage] = useState(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewFaq, setViewFaq] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    active: true,
  });

  useEffect(() => {
    const unsubscribeFaqs = onSnapshot(
      collection(db, "faqs"),
      (faqSnapshot) => {
        const data = faqSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setFaqs(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeFaqs();
    };
  }, []);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (f) =>
        (f.question || "").toLowerCase().includes(q) ||
        (f.answer || "").toLowerCase().includes(q)
    );
  }, [faqs, searchQuery]);

  const paginatedFaqs = useMemo(() => {
    const start = (faqPage - 1) * faqPerPage;
    return filteredFaqs.slice(start, start + faqPerPage);
  }, [filteredFaqs, faqPage, faqPerPage]);

  const handleSave = async () => {
    if (!formData.question.trim()) {
      toast.error("Question is required");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "faqs", editingId), {
          question: formData.question,
          answer: formData.answer,
          active: formData.active,
          updatedAt: serverTimestamp(),
        });
        toast.success("FAQ updated successfully");
      } else {
        await addDoc(collection(db, "faqs"), {
          question: formData.question,
          answer: formData.answer,
          active: formData.active,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("New FAQ published successfully");
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ question: "", answer: "", active: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save FAQ");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteDoc(doc(db, "faqs", id));
      toast.success("FAQ deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete FAQ");
    }
  };

  const toggleActiveStatus = async (faq) => {
    try {
      await updateDoc(doc(db, "faqs", faq.id), {
        active: !faq.active,
      });
      toast.success(`FAQ ${!faq.active ? "activated" : "hidden"}`);
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ question: "", answer: "", active: true });
    setIsModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question || "",
      answer: faq.answer || "",
      active: faq.active ?? true,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <CircleHelp size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              FAQ Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, edit, and organize frequently asked questions for your patients.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFaqPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>
      </div>

      {/* FAQs List Area */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile Cards (320px - 768px) */}
        <div className="divide-y divide-slate-100 md:hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading FAQs...</div>
          ) : paginatedFaqs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No FAQs found.</div>
          ) : (
            paginatedFaqs.map((faq) => (
              <div key={faq.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      faq.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {faq.active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {faq.answer}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleActiveStatus(faq)}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Toggle {faq.active ? "Hide" : "Show"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewFaq(faq)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(faq)}
                      className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (768px+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-1/3">Question</th>
                <th className="py-3.5 px-4">Answer Preview</th>
                <th className="py-3.5 px-4 text-center w-28">Status</th>
                <th className="py-3.5 px-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading FAQs...
                  </td>
                </tr>
              ) : paginatedFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No FAQs found. Add your first clinic FAQ above.
                  </td>
                </tr>
              ) : (
                paginatedFaqs.map((faq, index) => (
                  <tr key={faq.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {(faqPage - 1) * faqPerPage + index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">
                      {faq.answer}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActiveStatus(faq)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          faq.active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>{faq.active ? "Published" : "Hidden"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewFaq(faq)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(faq)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={faqPage}
          totalItems={filteredFaqs.length}
          itemsPerPage={faqPerPage}
          onPageChange={setFaqPage}
          onItemsPerPageChange={setFaqPerPage}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {editingId ? "Edit FAQ" : "Create New FAQ"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question *</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Do I need a doctor's referral for physiotherapy?"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer *</label>
                <textarea
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide clear explanation for patients..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faqActiveCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="faqActiveCheck" className="font-bold text-slate-700 cursor-pointer">
                  Publish to website immediately (Active)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {editingId ? "Update FAQ" : "Save & Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewFaq && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">FAQ Detail</h2>
              <button
                type="button"
                onClick={() => setViewFaq(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 mt-4 text-xs sm:text-sm">
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                <span className="text-[10px] font-bold text-teal-700 uppercase block mb-1">
                  Question
                </span>
                <p className="font-bold text-slate-900 text-sm">{viewFaq.question}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Answer
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewFaq.answer || "No answer provided"}
                </p>
              </div>
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setViewFaq(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
