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
  MessageCircleQuestion,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Upload,
} from "lucide-react";
import { db } from "../../firebase/firebase";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'faqs' | 'submissions'
  const [activeTab, setActiveTab] = useState("faqs");

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [faqPage, setFaqPage] = useState(1);
  const [faqPerPage, setFaqPerPage] = useState(10);
  const [subPage, setSubPage] = useState(1);
  const [subPerPage, setSubPerPage] = useState(10);

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

    const unsubscribeSubmissions = onSnapshot(
      collection(db, "faqSubmissions"),
      (submissionSnapshot) => {
        const data = submissionSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setSubmittedQuestions(data);
      },
      (error) => console.error(error)
    );

    return () => {
      unsubscribeFaqs();
      unsubscribeSubmissions();
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

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submittedQuestions;
    const q = searchQuery.toLowerCase();
    return submittedQuestions.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.question || "").toLowerCase().includes(q)
    );
  }, [submittedQuestions, searchQuery]);

  const paginatedSubmissions = useMemo(() => {
    const start = (subPage - 1) * subPerPage;
    return filteredSubmissions.slice(start, start + subPerPage);
  }, [filteredSubmissions, subPage, subPerPage]);

  // Publish patient question
  const handlePublishQuestion = async (questionData) => {
    try {
      await addDoc(collection(db, "faqs"), {
        question: questionData.question,
        answer: "Our clinical specialists are happy to assist. Please contact our front desk for customized care plans.",
        active: true,
        notificationRead: true,
        createdAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "faqSubmissions", questionData.id));
      toast.success("Question published to FAQ list!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm("Delete this patient inquiry?")) return;
    try {
      await deleteDoc(doc(db, "faqSubmissions", id));
      toast.success("Inquiry deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

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
        });
        toast.success("FAQ updated successfully");
      } else {
        await addDoc(collection(db, "faqs"), {
          ...formData,
          notificationRead: true,
          createdAt: serverTimestamp(),
        });
        toast.success("FAQ created successfully");
      }

      setFormData({ question: "", answer: "", active: true });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save FAQ");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteDoc(doc(db, "faqs", id));
      toast.success("FAQ deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete FAQ");
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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            FAQ & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage clinic frequently asked questions and online patient queries
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "faqs"
                ? "bg-teal-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CircleHelp size={15} />
            <span>Published FAQs ({faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <MessageCircleQuestion size={15} />
            <span>Patient Inquiries ({submittedQuestions.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === "faqs"
                ? "Search published questions or answers..."
                : "Search patient inquiries by name, email, or question..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFaqPage(1);
              setSubPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {activeTab === "faqs" ? (
          <>
            {/* Mobile Cards (320px - 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {paginatedFaqs.length === 0 ? (
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
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {faq.active ? "Active" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {faq.answer || "No answer provided"}
                    </p>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setViewFaq(faq)}
                        className="p-2 rounded-lg bg-teal-50 text-teal-700"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(faq)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                    <th className="py-3.5 px-4 w-1/2">Question</th>
                    <th className="py-3.5 px-4 w-1/3">Answer Preview</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedFaqs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No FAQs found.
                      </td>
                    </tr>
                  ) : (
                    paginatedFaqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{faq.question}</td>
                        <td className="py-3.5 px-4 text-slate-600 line-clamp-1 truncate max-w-xs">
                          {faq.answer || "No answer provided"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              faq.active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {faq.active ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewFaq(faq)}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(faq)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
          </>
        ) : (
          <>
            {/* Submissions Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {paginatedSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No patient inquiries submitted yet.
                </div>
              ) : (
                paginatedSubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{sub.name || "Anonymous"}</h4>
                      <span className="text-[11px] text-slate-400">{sub.email}</span>
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      "{sub.question}"
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handlePublishQuestion(sub)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                      >
                        Publish to FAQ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Submissions Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                    <th className="py-3.5 px-4">Visitor Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 w-1/2">Inquiry / Question</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No patient inquiries submitted yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {sub.name || "Anonymous"}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{sub.email || "N/A"}</td>
                        <td className="py-3.5 px-4 text-slate-800">{sub.question}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handlePublishQuestion(sub)}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                            >
                              Publish to FAQ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
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
              currentPage={subPage}
              totalItems={filteredSubmissions.length}
              itemsPerPage={subPerPage}
              onPageChange={setSubPage}
              onItemsPerPageChange={setSubPerPage}
              pageSizeOptions={[5, 10, 20]}
            />
          </>
        )}
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Do you accept health insurance or cashless claims?"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer</label>
                <textarea
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide comprehensive medical explanation..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="faqActiveCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="faqActiveCheck" className="font-bold text-slate-700 cursor-pointer">
                  Publish to website immediately (Active)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs"
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
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
