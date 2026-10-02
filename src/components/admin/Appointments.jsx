import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Pencil,
  Trash2,
  Eye,
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { db } from "../../firebase/firebase";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'confirmed' | 'completed'

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  /* ---------------- Firebase Real Time Fetch ---------------- */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "appointments"),
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          status: docSnap.data().status || "pending",
        }));

        // Sort newest first
        data.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });

        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ---------------- View Appointment ---------------- */
  const handleView = (appointment) => {
    setViewAppointment(appointment);
    setIsViewOpen(true);
  };

  /* ---------------- Delete Appointment ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "appointments", id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete appointment");
    }
  };

  /* ---------------- Edit Appointment ---------------- */
  const handleEdit = (appointment) => {
    setEditingAppointment({ ...appointment });
    setIsEditOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      await updateDoc(doc(db, "appointments", editingAppointment.id), {
        name: editingAppointment.name,
        phone: editingAppointment.phone,
        doctor: editingAppointment.doctor || "Any Available Specialist",
        condition: editingAppointment.condition || "",
        date: editingAppointment.date || "",
        time: editingAppointment.time || "",
        status: editingAppointment.status || "pending",
        message: editingAppointment.message || "",
      });

      toast.success("Appointment updated successfully");
      setIsEditOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
    }
  };

  // Quick Status change directly from view
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status: newStatus,
        notificationRead: true,
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  /* ---------------- Filter & Search ---------------- */
  const filteredAppointments = useMemo(() => {
    const search = query.toLowerCase().trim();

    return appointments.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Search query
      if (search) {
        const matchesSearch =
          item.name?.toLowerCase().includes(search) ||
          item.phone?.toLowerCase().includes(search) ||
          item.doctor?.toLowerCase().includes(search) ||
          item.condition?.toLowerCase().includes(search) ||
          item.date?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [appointments, query, statusFilter]);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, itemsPerPage]);

  // Paginated items
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  // Summary counts
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Page Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Patient Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time clinic bookings, scheduling, and patient records
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Total: </span>
            <strong className="text-slate-900">{appointments.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <span className="text-amber-700 font-medium">Pending: </span>
            <strong className="text-amber-900 font-black">{pendingCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="text-emerald-700 font-medium">Confirmed: </span>
            <strong className="text-emerald-900 font-black">{confirmedCount}</strong>
          </div>
        </div>
      </div>

      {/* Modern Search & Status Filter Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, phone, doctor, condition, or date..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 pl-1">
            <Filter size={12} /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({appointments.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("confirmed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "confirmed"
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
          >
            Confirmed ({confirmedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Main Table & Mobile Cards Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No appointments found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {query
                ? `No records matching "${query}"`
                : "No patient appointments recorded under this category yet."}
            </p>
          </div>
        ) : (
          <>
            {/* ================= MOBILE CARDS (320px - 768px) ================= */}
            <div className="divide-y divide-slate-100 md:hidden">
              {paginatedAppointments.map((app) => (
                <div key={app.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition">
                  {/* Patient Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {(app.name || "P").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {app.name}
                        </h3>
                        <a
                          href={`tel:${app.phone}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline mt-0.5"
                        >
                          <Phone size={11} />
                          <span>{app.phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        app.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : app.status === "completed"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Doctor
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {app.doctor || "Specialist"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Condition
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {app.condition || "General"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Date
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        📅 {app.date || "Upcoming"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Slot
                      </span>
                      <span className="font-semibold text-slate-700 truncate block">
                        ⏰ {app.time || "Clinic Hours"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs">
                      <select
                        value={app.status}
                        onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleView(app)}
                        className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(app)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Edit Appointment"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP TABLE (>= 768px) ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Condition</th>
                    <th className="py-3.5 px-4">Schedule</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {(app.name || "P").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{app.name}</p>
                            <span className="text-[10px] text-slate-400">ID: {app.id.slice(0, 6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4">
                        {app.phone ? (
                          <a
                            href={`tel:${app.phone}`}
                            className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 hover:underline"
                          >
                            <Phone size={12} />
                            <span>{app.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {app.doctor || "Any Specialist"}
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                          {app.condition || "General"}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs">
                          <p className="font-semibold text-slate-800">📅 {app.date || "Upcoming"}</p>
                          <p className="text-slate-500">⏰ {app.time || "Clinic Hours"}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                            app.status === "confirmed"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : app.status === "completed"
                              ? "bg-blue-50 border-blue-200 text-blue-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleView(app)}
                            className="p-2 rounded-xl text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition"
                            title="View Full Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(app)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
                            title="Edit Record"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(app.id)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
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

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAppointments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </>
        )}
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {isEditOpen && editingAppointment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Edit Appointment
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingAppointment(null);
                }}
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
                  value={editingAppointment.name}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.phone}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingAppointment.status || "pending"}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Assigned</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.doctor || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        doctor: e.target.value,
                      })
                    }
                    placeholder="Doctor Name"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Condition / Pain</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.condition || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        condition: e.target.value,
                      })
                    }
                    placeholder="Condition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.date || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.time || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        time: e.target.value,
                      })
                    }
                    placeholder="e.g. 10:30 AM"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Notes</label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={editingAppointment.message || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      message: e.target.value,
                    })
                  }
                  placeholder="Patient medical notes or symptom details"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingAppointment(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateAppointment}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW MODAL ===================== */}
      {isViewOpen && viewAppointment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Appointment Summary
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsViewOpen(false);
                  setViewAppointment(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">{viewAppointment.name}</h3>
                  <a
                    href={`tel:${viewAppointment.phone}`}
                    className="font-bold text-teal-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone size={12} /> {viewAppointment.phone}
                  </a>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    viewAppointment.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : viewAppointment.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {viewAppointment.status || "pending"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Doctor</span>
                  <strong className="text-slate-800">{viewAppointment.doctor || "Any Available"}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Condition</span>
                  <strong className="text-slate-800">{viewAppointment.condition || "General Consultation"}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Date</span>
                  <strong className="text-slate-800">📅 {viewAppointment.date || "Upcoming"}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Slot</span>
                  <strong className="text-slate-800">⏰ {viewAppointment.time || "Clinic Hours"}</strong>
                </div>
              </div>

              {viewAppointment.message && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Patient Note
                  </span>
                  <p className="text-slate-700 italic">"{viewAppointment.message}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <a
                  href={`tel:${viewAppointment.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  <Phone size={13} />
                  <span>Call Patient</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsViewOpen(false);
                    setViewAppointment(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
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

export default Appointments;
