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
import { db } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import {
  Plus,
  Search,
  Star,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  User,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'approved' | 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    rating: 5,
    image: "/default-user.png",
    active: true,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "testimonials"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort newest first
        data.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });
        setTestimonials(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered Testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      // Status filter
      if (statusFilter === "approved" && item.status !== "approved") return false;
      if (statusFilter === "pending" && item.status === "approved") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.name || "").toLowerCase().includes(q) ||
          (item.review || "").toLowerCase().includes(q) ||
          (item.designation || "").toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [testimonials, statusFilter, searchQuery]);

  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTestimonials.slice(start, start + itemsPerPage);
  }, [filteredTestimonials, currentPage, itemsPerPage]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.review.trim()) {
      toast.error("Please fill Name and Review text");
      return;
    }

    try {
      let imageUrl = formData.image;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, "testimonials");
      }

      const payload = {
        name: formData.name,
        designation: formData.designation || "",
        review: formData.review,
        rating: Number(formData.rating) || 5,
        image:
          imageUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        active: formData.active !== undefined ? formData.active : true,
        status: "approved",
      };

      if (editingId) {
        await updateDoc(doc(db, "testimonials", editingId), payload);
        toast.success("Testimonial updated");
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...payload,
          notificationRead: true,
          createdAt: serverTimestamp(),
        });
        toast.success("Testimonial added");
      }

      setIsModalOpen(false);
      setEditingId(null);
      setSelectedImage(null);
      setFormData({
        name: "",
        designation: "",
        review: "",
        rating: 5,
        image: "/default-user.png",
        active: true,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), {
        status: "approved",
        active: true,
        notificationRead: true,
      });
      toast.success("Review approved and published!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "testimonials", id));
      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      designation: item.designation || "",
      review: item.review || "",
      rating: item.rating || 5,
      image: item.image || "/default-user.png",
      active: item.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedTestimonial(item);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Patient Reviews & Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage clinic patient testimonials, ratings, and social proofs
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              designation: "",
              review: "",
              rating: 5,
              image: "/default-user.png",
              active: true,
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews by patient name, review text, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 pl-1">
            <Filter size={12} /> Status:
          </span>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({testimonials.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("approved");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "approved"
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
          >
            Approved ({testimonials.filter((t) => t.status === "approved").length})
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("pending");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Pending ({testimonials.filter((t) => t.status !== "approved").length})
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading reviews...</div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Star size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No reviews found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No reviews matching "${searchQuery}"`
                : "Patient testimonials will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (320px - 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {paginatedTestimonials.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/default-user.png"}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">{item.designation || "Patient"}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{item.review}"
                  </p>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    {item.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 w-2/5">Review</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedTestimonials.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/default-user.png"}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                            <span className="text-[11px] text-slate-400">
                              {item.designation || "Patient"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400" />
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                        "{item.review}"
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status || "pending"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs transition"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTestimonials.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[5, 10, 20]}
            />
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 mt-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designation / Location</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Sports Enthusiast / Aligarh"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Star Rating (1 - 5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  <option value={2}>⭐⭐ (2 Stars)</option>
                  <option value={1}>⭐ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Review</label>
                <textarea
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Write the patient feedback..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
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
                  {editingId ? "Update Review" : "Save Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Review Details</h2>
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 mt-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-2xl border border-teal-100">
                <img
                  src={selectedTestimonial.image || "/default-user.png"}
                  alt={selectedTestimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-black text-base text-slate-900">{selectedTestimonial.name}</h4>
                  <p className="text-xs text-slate-500">{selectedTestimonial.designation}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {Array.from({ length: selectedTestimonial.rating || 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-800 italic">"{selectedTestimonial.review}"</p>
              </div>
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsViewOpen(false)}
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

export default AdminTestimonials;
