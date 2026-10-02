import { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Bell,
  Calendar,
  MessageCircleQuestion,
  Star,
  Search,
  CheckCheck,
  Volume2,
  VolumeX,
  Phone,
  ArrowRight,
  Trash2,
  Check,
  ExternalLink,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { db } from "../../firebase/firebase";
import { playNotificationSound } from "../../utils/notificationSound";
import Pagination from "./Pagination";

const AdminNotificationsPage = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filterType, setFilterType] = useState("all"); // 'all' | 'appointments' | 'faqs' | 'testimonials' | 'unread'
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Format timestamp helper
  const formatTime = (timestamp) => {
    if (!timestamp) return "Recent";
    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (e) {
      // fallback
    }
    return "Recent";
  };

  // Real-time Firestore Listeners
  useEffect(() => {
    const unsubAppointments = onSnapshot(collection(db, "appointments"), (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        notifType: "appointment",
        collectionName: "appointments",
        title: "Appointment Booking",
        name: d.data().name || "Patient",
        phone: d.data().phone || "",
        doctor: d.data().doctor || "Specialist",
        condition: d.data().condition || "Consultation",
        date: d.data().date || "",
        time: d.data().time || "",
        message: d.data().message || "",
        createdAt: d.data().createdAt,
        isRead: d.data().notificationRead === true || d.data().read === true,
        redirect: "/admin/appointments",
      }));
      setAppointments(data);
      setLoading(false);
    });

    const unsubFaqs = onSnapshot(collection(db, "faqSubmissions"), (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        notifType: "faq",
        collectionName: "faqSubmissions",
        title: "Patient Question / FAQ",
        name: d.data().name || "Visitor",
        phone: d.data().email || "",
        doctor: "Helpdesk",
        condition: "Question",
        date: "",
        time: "",
        message: d.data().question || "Inquiry submitted",
        createdAt: d.data().createdAt,
        isRead: d.data().notificationRead === true || d.data().read === true,
        redirect: "/admin/faq",
      }));
      setFaqs(data);
    });

    const unsubTestimonials = onSnapshot(collection(db, "testimonials"), (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        notifType: "testimonial",
        collectionName: "testimonials",
        title: "Patient Review",
        name: d.data().name || "Patient",
        phone: `${d.data().rating || 5} Stars Rating`,
        doctor: "Clinic Review",
        condition: "Testimonial",
        date: "",
        time: "",
        message: d.data().review || "",
        createdAt: d.data().createdAt,
        isRead: d.data().notificationRead === true || d.data().read === true,
        redirect: "/admin/testimonials",
      }));
      setTestimonials(data);
    });

    return () => {
      unsubAppointments();
      unsubFaqs();
      unsubTestimonials();
    };
  }, []);

  // Combined notifications sorted newest first
  const allNotifications = useMemo(() => {
    const list = [...appointments, ...faqs, ...testimonials];
    return list.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return timeB - timeA;
    });
  }, [appointments, faqs, testimonials]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((item) => {
      // Type filter
      if (filterType === "appointments" && item.notifType !== "appointment") return false;
      if (filterType === "faqs" && item.notifType !== "faq") return false;
      if (filterType === "testimonials" && item.notifType !== "testimonial") return false;
      if (filterType === "unread" && item.isRead) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.name || "").toLowerCase().includes(q) ||
          (item.phone || "").toLowerCase().includes(q) ||
          (item.doctor || "").toLowerCase().includes(q) ||
          (item.condition || "").toLowerCase().includes(q) ||
          (item.message || "").toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [allNotifications, filterType, searchQuery]);

  // Counts
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;
  const appointmentCount = appointments.length;
  const faqCount = faqs.length;
  const reviewCount = testimonials.length;

  // Pagination calculation
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery, itemsPerPage]);

  // Mark single as read
  const handleToggleRead = async (item) => {
    try {
      await updateDoc(doc(db, item.collectionName, item.id), {
        notificationRead: !item.isRead,
        read: !item.isRead,
      });
      toast.success(item.isRead ? "Marked as unread" : "Marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const promises = allNotifications
        .filter((n) => !n.isRead)
        .map((n) =>
          updateDoc(doc(db, n.collectionName, n.id), {
            notificationRead: true,
            read: true,
          })
        );
      await Promise.all(promises);
      toast.success("All notifications marked as read!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as read");
    }
  };

  // Delete notification
  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this notification record?")) return;
    try {
      await deleteDoc(doc(db, item.collectionName, item.id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  // Sound chime test
  const handleTestChime = () => {
    playNotificationSound();
    toast.success("🎵 Notification Chime Played!", { duration: 2000 });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Notification Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time patient bookings, inquiries, and reviews feed
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleTestChime}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
            title="Test chime sound"
          >
            <Volume2 size={15} className="text-teal-600" />
            <span className="hidden xs:inline">Test Sound</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition shadow-2xs ${
              soundEnabled
                ? "bg-teal-50 border-teal-200 text-teal-800"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
            title="Toggle notification sound"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? "Sound On" : "Muted"}</span>
          </button>

          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition shadow-xs"
          >
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, phone, doctor, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterType === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>All Activities</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {allNotifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType("unread")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterType === "unread"
                ? "bg-red-600 text-white shadow-2xs"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <span>Unread Leads</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
              {unreadCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType("appointments")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterType === "appointments"
                ? "bg-teal-600 text-white shadow-2xs"
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
          >
            <Calendar size={13} />
            <span>Appointments</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
              {appointmentCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType("faqs")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterType === "faqs"
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-orange-50 text-orange-800 hover:bg-orange-100"
            }`}
          >
            <MessageCircleQuestion size={13} />
            <span>Inquiries / FAQs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
              {faqCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType("testimonials")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterType === "testimonials"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100"
            }`}
          >
            <Star size={13} />
            <span>Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
              {reviewCount}
            </span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Bell size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No activity matching "${searchQuery}"`
                : "All caught up! New patient leads and questions will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedNotifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !item.isRead ? "bg-teal-50/40 hover:bg-teal-50/70" : "bg-white hover:bg-slate-50"
                }`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Avatar / Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                      item.notifType === "appointment"
                        ? "bg-teal-100 text-teal-700 border border-teal-200"
                        : item.notifType === "faq"
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {item.notifType === "appointment" ? (
                      <Calendar size={18} />
                    ) : item.notifType === "faq" ? (
                      <MessageCircleQuestion size={18} />
                    ) : (
                      <Star size={18} />
                    )}
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {item.name}
                      </h4>

                      {!item.isRead && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                          New
                        </span>
                      )}

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.title}
                      </span>

                      {item.time && (
                        <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md">
                          ⏰ {item.time}
                        </span>
                      )}
                    </div>

                    {/* Contact & Date row */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 hover:underline"
                        >
                          <Phone size={12} />
                          <span>{item.phone}</span>
                        </a>
                      )}

                      {item.date && <span>📅 Date: <strong>{item.date}</strong></span>}
                      {item.doctor && (
                        <span className="text-slate-500">
                          Dr: <strong>{item.doctor}</strong>
                        </span>
                      )}
                    </div>

                    {/* Message / Condition preview */}
                    {item.message && (
                      <p className="text-xs text-slate-600 line-clamp-2 bg-white/60 p-2 rounded-xl border border-slate-200/60 mt-1.5">
                        {item.message}
                      </p>
                    )}

                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(item)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition ${
                      item.isRead
                        ? "border-slate-200 text-slate-500 hover:bg-slate-100"
                        : "border-teal-200 bg-teal-100/70 text-teal-800 hover:bg-teal-200"
                    }`}
                    title={item.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    <Check size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(item.redirect)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition shadow-2xs"
                  >
                    <span>View Detail</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredNotifications.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
