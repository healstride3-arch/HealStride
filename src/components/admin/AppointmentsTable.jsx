import { useState } from "react";
import {
  Calendar,
  Phone,
  Eye,
  Pencil,
  Trash2,
  X,
  Clock,
  User,
  Stethoscope,
  Activity,
  FileText,
  MessageCircle,
} from "lucide-react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../../firebase/firebase";

// Official Heal Stride Services List
const CLINIC_SERVICES_OPTIONS = [
  "Chiropractic Treatment",
  "Spinal Decompression Therapy",
  "Posture Correction Therapy",
  "Ultrasound Therapy",
  "Cupping Therapy (Hijama)",
  "Cranio Sacral Therapy",
  "Cryo Therapy",
  "Laser Therapy",
  "Clinical Physiotherapy",
  "Home Physiotherapy",
  "Sports Injury Rehabilitation",
  "Stroke / Paralysis Rehabilitation",
  "Interferential Therapy (IFT)",
  "Shockwave Therapy",
  "Red Light Therapy",
  "General Physical Assessment & Consultation",
  "Other Consultation",
];

const formatDateTime = (timestamp, fallbackDate) => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (typeof timestamp === "string") {
    try {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {
      // fallback
    }
  }
  return fallbackDate || "Recent";
};

const getWhatsAppUrl = (phone, name, service) => {
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const pNum = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const text = encodeURIComponent(
    `Hello ${name || "Patient"}, this is Heal Stride Physiotherapy Bhopal regarding your consultation request for ${service || "Physiotherapy"}.`
  );
  return `https://wa.me/${pNum}?text=${text}`;
};

/**
 * Reusable Appointment Table & Mobile Card component.
 * Displays real-time 3-field booking data: Name, Mobile, Service + Status & Actions.
 */
const AppointmentsTable = ({
  appointments = [],
  loading = false,
  emptyMessage = "No appointments found",
}) => {
  const [viewAppointment, setViewAppointment] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Quick Status change directly from view / table
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

  // View appointment modal
  const handleView = (appointment) => {
    setViewAppointment(appointment);
    setIsViewOpen(true);
  };

  // Edit appointment modal
  const handleEdit = (appointment) => {
    setEditingAppointment({
      ...appointment,
      service: appointment.service || appointment.condition || "General Physical Assessment & Consultation",
    });
    setIsEditOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const selectedService =
        editingAppointment.service ||
        editingAppointment.condition ||
        "General Physical Assessment & Consultation";

      await updateDoc(doc(db, "appointments", editingAppointment.id), {
        name: editingAppointment.name?.trim() || "",
        phone: editingAppointment.phone?.trim() || "",
        service: selectedService,
        condition: selectedService, // maintains backward compatibility
        status: editingAppointment.status || "pending",
        message: editingAppointment.message || "",
        updatedAt: new Date().toISOString(),
      });

      toast.success("Appointment updated successfully");
      setIsEditOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment record?")) {
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

  // Helper for normalizing status strings
  const normalizeStatus = (rawStatus) => {
    const s = String(rawStatus || "pending").toLowerCase().trim();
    if (s === "confirmed") return "confirmed";
    if (s === "completed") return "completed";
    if (s === "cancelled" || s === "canceled") return "cancelled";
    return "pending";
  };

  // Helper for status badge style
  const getStatusBadgeStyle = (rawStatus) => {
    const status = normalizeStatus(rawStatus);
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusSelectStyle = (rawStatus) => {
    const status = normalizeStatus(rawStatus);
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "completed":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "cancelled":
        return "bg-rose-50 border-rose-200 text-rose-800";
      default:
        return "bg-amber-50 border-amber-200 text-amber-800";
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Calendar size={24} />
        </div>
        <h3 className="font-bold text-slate-800 text-base">{emptyMessage}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No patient appointment leads in this list yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE CARDS (320px - 768px) ================= */}
      <div className="divide-y divide-slate-100 md:hidden">
        {appointments.map((app) => {
          const serviceName = app.service || app.condition || "General Consultation";
          const isCallback =
            app.type === "callback" ||
            app.isCallback === true ||
            app.name?.toLowerCase().includes("callback") ||
            app.source?.toLowerCase().includes("callback") ||
            app.service?.toLowerCase().includes("callback");

          return (
            <div
              key={app.id}
              className={`p-4 space-y-3 transition ${
                isCallback ? "bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-amber-500" : "hover:bg-slate-50/70"
              }`}
            >
              {/* Patient Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl ${
                      isCallback ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"
                    } font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {isCallback ? <Phone size={15} /> : (app.name || "P").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {app.name}
                      </h3>
                      {isCallback && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 uppercase tracking-wider animate-pulse">
                          📞 Callback
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`tel:${app.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
                      >
                        <Phone size={11} />
                        <span>{app.phone}</span>
                      </a>
                      {app.phone && (
                        <a
                          href={getWhatsAppUrl(app.phone, app.name, serviceName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 p-0.5"
                          title="WhatsApp Patient"
                        >
                          <MessageCircle size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Pill */}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${getStatusBadgeStyle(
                    app.status
                  )}`}
                >
                  {normalizeStatus(app.status)}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Service Requested
                  </span>
                  <span className="font-semibold text-teal-800 truncate block">
                    {serviceName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Received At
                  </span>
                  <span className="font-semibold text-slate-700 truncate flex items-center gap-1">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>{formatDateTime(app.createdAt, app.date)}</span>
                  </span>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-xs">
                  <select
                    value={normalizeStatus(app.status)}
                    onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                    className={`border rounded-lg px-2 py-1 text-[11px] font-bold outline-none cursor-pointer ${getStatusSelectStyle(
                      app.status
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleView(app)}
                    className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(app)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                    title="Edit Appointment"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(app.id)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP TABLE (>= 768px) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Patient</th>
              <th className="py-3.5 px-4">Phone Number</th>
              <th className="py-3.5 px-4">Service Requested</th>
              <th className="py-3.5 px-4">Received Date &amp; Time</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {appointments.map((app) => {
              const serviceName = app.service || app.condition || "General Consultation";
              const isCallback =
                app.type === "callback" ||
                app.isCallback === true ||
                app.name?.toLowerCase().includes("callback") ||
                app.source?.toLowerCase().includes("callback") ||
                app.service?.toLowerCase().includes("callback");

              return (
                <tr
                  key={app.id}
                  className={`transition-colors ${
                    isCallback ? "bg-amber-50/40 hover:bg-amber-50/80" : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Patient */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl ${
                          isCallback ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"
                        } font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {isCallback ? <Phone size={14} /> : (app.name || "P").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-900 leading-snug">{app.name}</p>
                          {isCallback && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 uppercase tracking-wider animate-pulse">
                              📞 Callback
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">ID: {app.id.slice(0, 6)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Phone with Call & WhatsApp quick triggers */}
                  <td className="py-3.5 px-4">
                    {app.phone ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${app.phone}`}
                          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 hover:underline"
                        >
                          <Phone size={12} />
                          <span>{app.phone}</span>
                        </a>
                        <a
                          href={getWhatsAppUrl(app.phone, app.name, serviceName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No phone</span>
                    )}
                  </td>

                  {/* Service Requested */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-semibold text-xs border border-teal-200/80">
                      {serviceName}
                    </span>
                  </td>

                  {/* Received Time */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 flex items-center gap-1.5 text-xs font-medium">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      <span>{formatDateTime(app.createdAt, app.date)}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <select
                      value={normalizeStatus(app.status)}
                      onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition ${getStatusSelectStyle(
                        app.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleView(app)}
                        className="p-2 rounded-xl text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(app)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition cursor-pointer"
                        title="Edit Appointment"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {isEditOpen && editingAppointment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Edit Consultation Request
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingAppointment(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={editingAppointment.name || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      name: e.target.value,
                    })
                  }
                  placeholder="Patient Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={editingAppointment.phone || ""}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Mobile Number"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={normalizeStatus(editingAppointment.status)}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Choose Service</label>
                <select
                  value={editingAppointment.service || editingAppointment.condition || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      service: e.target.value,
                      condition: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white cursor-pointer"
                >
                  <option value="" disabled>Select Service</option>
                  {CLINIC_SERVICES_OPTIONS.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                  {/* If custom condition exists outside the list, keep it visible */}
                  {editingAppointment.condition &&
                    !CLINIC_SERVICES_OPTIONS.includes(editingAppointment.condition) && (
                      <option value={editingAppointment.condition}>
                        {editingAppointment.condition}
                      </option>
                    )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Notes / Remarks</label>
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
                  placeholder="Clinic notes, callback status, or patient response..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingAppointment(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateAppointment}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs cursor-pointer"
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
                Consultation Lead Summary
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsViewOpen(false);
                  setViewAppointment(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 mt-4 text-xs sm:text-sm text-slate-700">
              {/* Patient Banner */}
              <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
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
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusBadgeStyle(
                    viewAppointment.status
                  )}`}
                >
                  {normalizeStatus(viewAppointment.status)}
                </span>
              </div>

              {/* Service & Received Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested Service</span>
                  <strong className="text-teal-800 text-sm mt-0.5 block">
                    {viewAppointment.service || viewAppointment.condition || "General Consultation"}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Received At</span>
                  <strong className="text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <span>{formatDateTime(viewAppointment.createdAt, viewAppointment.date)}</span>
                  </strong>
                </div>
              </div>

              {/* Patient / Admin Notes */}
              {(viewAppointment.notes || viewAppointment.message) && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Details / Callback Notes
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                    {viewAppointment.notes || viewAppointment.message}
                  </p>
                </div>
              )}

              {/* Fast Action Buttons: Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${viewAppointment.phone}`}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl transition border border-slate-200 text-xs"
                >
                  <Phone size={14} className="text-teal-700" />
                  <span>Call Patient</span>
                </a>

                <a
                  href={getWhatsAppUrl(
                    viewAppointment.phone,
                    viewAppointment.name,
                    viewAppointment.service || viewAppointment.condition
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 px-3 rounded-xl transition shadow-xs text-xs"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Bottom Edit Trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Status: <strong className="text-slate-700 capitalize">{viewAppointment.status}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsViewOpen(false);
                    handleEdit(viewAppointment);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsTable;
