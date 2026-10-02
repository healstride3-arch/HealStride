import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Bell,
  MessageCircleQuestion,
  Star,
  Calendar,
  Volume2,
  VolumeX,
  CheckCheck,
  X,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Phone,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { db } from "../../firebase/firebase";
import {
  playNotificationSound,
  requestNotificationPermission,
  triggerBrowserNotification,
} from "../../utils/notificationSound";

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Track known IDs so we only alert for NEW events arriving in real-time
  const knownAppointmentIds = useRef(new Set());
  const knownTestimonialIds = useRef(new Set());
  const isInitialLoad = useRef({ appointments: true, testimonials: true });
  const hasTriggeredWelcomeModal = useRef(false);

  // Format timestamp helper
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (e) {
      // fallback
    }
    return "Just now";
  };

  // ---------------- 1. Real-time Appointments Listener ----------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "appointments"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const unread = all.filter(
        (item) => item.notificationRead !== true && item.read !== true
      );

      // Detect newly created appointments in real-time
      if (!isInitialLoad.current.appointments) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newDoc = { id: change.doc.id, ...change.doc.data() };
            if (!knownAppointmentIds.current.has(newDoc.id)) {
              knownAppointmentIds.current.add(newDoc.id);

              // Play Sound!
              if (soundEnabled) {
                playNotificationSound();
              }

              // Show Modal Popup on Screen!
              setShowModal(true);

              // Show Toast Popup
              toast.success(
                `🔔 New Appointment: ${newDoc.name || "Patient"} (${newDoc.date || "Upcoming"} at ${newDoc.time || "Clinic"})`,
                { duration: 6000, position: "top-right" }
              );

              // Desktop Push Notification
              triggerBrowserNotification("New Appointment Booked! 📅", {
                body: `${newDoc.name || "A patient"} booked an appointment with ${newDoc.doctor || "Specialist"} for ${newDoc.date || ""} ${newDoc.time || ""}`,
                onClick: () => navigate("/admin/appointments"),
              });
            }
          }
        });
      } else {
        snapshot.docs.forEach((d) => knownAppointmentIds.current.add(d.id));
        isInitialLoad.current.appointments = false;
      }

      setAppointments(unread);
    });

    return () => unsub();
  }, [soundEnabled, navigate]);


  // ---------------- 3. Real-time Testimonials Listener ----------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const unread = all.filter(
        (item) => item.notificationRead !== true && item.read !== true
      );

      if (!isInitialLoad.current.testimonials) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newDoc = { id: change.doc.id, ...change.doc.data() };
            if (!knownTestimonialIds.current.has(newDoc.id)) {
              knownTestimonialIds.current.add(newDoc.id);

              if (soundEnabled) {
                playNotificationSound();
              }

              setShowModal(true);

              toast.success(
                `⭐ New Patient Review: ${newDoc.name || "Patient"} gave ${newDoc.rating || 5} Stars!`,
                { duration: 5000, position: "top-right" }
              );

              triggerBrowserNotification("New Patient Review! ⭐", {
                body: `${newDoc.name || "Patient"} left a ${newDoc.rating || 5}-star review: "${newDoc.review || ""}"`,
                onClick: () => navigate("/admin/testimonials"),
              });
            }
          }
        });
      } else {
        snapshot.docs.forEach((d) => knownTestimonialIds.current.add(d.id));
        isInitialLoad.current.testimonials = false;
      }

      setTestimonials(unread);
    });

    return () => unsub();
  }, [soundEnabled, navigate]);

  // Combined notifications
  const appointmentNotifications = appointments.map((item) => ({
    id: item.id,
    type: "appointment",
    title: "New Appointment Booked",
    patientName: item.name || "Patient",
    phone: item.phone || "Not provided",
    doctor: item.doctor || "Any Specialist",
    condition: item.condition || "General Consultation",
    date: item.date || "Upcoming",
    timeSlot: item.time || "",
    message: `${item.condition || "Consultation"} with ${item.doctor || "Specialist"} on ${item.date || "Upcoming"} at ${item.time || ""}`,
    time: formatTime(item.createdAt),
    redirect: "/admin/appointments",
  }));

  const testimonialNotifications = testimonials.map((item) => ({
    id: item.id,
    type: "testimonial",
    title: "New Review Received",
    patientName: item.name || "Patient",
    phone: `${item.rating || 5} Stars`,
    doctor: "Clinic Review",
    condition: "Testimonial",
    date: "",
    timeSlot: "",
    message: item.review || "Submitted feedback.",
    time: formatTime(item.createdAt),
    redirect: "/admin/testimonials",
  }));

  const notifications = [
    ...appointmentNotifications,
    ...testimonialNotifications,
  ];

  // ---------------- Tab Title Flashing Alert (when admin is on another tab/website) ----------------
  useEffect(() => {
    if (notifications.length > 0) {
      let isAlt = false;
      const interval = setInterval(() => {
        document.title = isAlt
          ? `(${notifications.length}) 🔔 New Patient Booking!`
          : `Heal Stride Admin Panel`;
        isAlt = !isAlt;
      }, 1500);
      return () => {
        clearInterval(interval);
        document.title = "Heal Stride Physiotherapy - Admin Panel";
      };
    } else {
      document.title = "Heal Stride Physiotherapy - Admin Panel";
    }
  }, [notifications.length]);

  // ---------------- 4. Auto-Popup Modal when Admin Logs In / Opens Admin Panel ----------------
  useEffect(() => {
    if (notifications.length > 0 && !hasTriggeredWelcomeModal.current) {
      hasTriggeredWelcomeModal.current = true;
      // Slight smooth delay so admin sees the dashboard before popup presents itself
      const timer = setTimeout(() => {
        setShowModal(true);
        if (soundEnabled) {
          playNotificationSound();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [notifications.length, soundEnabled]);

  // ---------------- 5. Auto-Popup Modal when Admin returns from other websites/tabs ----------------
  const wasAwayRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasAwayRef.current = true;
      } else if (document.visibilityState === "visible") {
        if (wasAwayRef.current && notifications.length > 0) {
          setShowModal(true);
          if (soundEnabled) {
            playNotificationSound();
          }
          wasAwayRef.current = false;
        }
      }
    };

    const handleWindowBlur = () => {
      wasAwayRef.current = true;
    };

    const handleWindowFocus = () => {
      if (wasAwayRef.current && notifications.length > 0) {
        setShowModal(true);
        if (soundEnabled) {
          playNotificationSound();
        }
        wasAwayRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [notifications.length, soundEnabled]);

  // Helper for notification type icon
  const getIcon = (type) => {
    switch (type) {
      case "appointment":
        return (
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar size={16} />
          </div>
        );
      case "testimonial":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Star size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
        );
    }
  };

  // Mark single notification read
  const handleView = async (item) => {
    try {
      const collectionName =
        item.type === "appointment"
          ? "appointments"
          : "testimonials";

      await updateDoc(doc(db, collectionName, item.id), {
        notificationRead: true,
        read: true,
      });

      setOpen(false);
      setShowModal(false);
      navigate(item.redirect);
    } catch (error) {
      console.error("Notification click error:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const promises = [
        ...appointments.map((a) =>
          updateDoc(doc(db, "appointments", a.id), {
            notificationRead: true,
            read: true,
          })
        ),
        ...testimonials.map((t) =>
          updateDoc(doc(db, "testimonials", t.id), {
            notificationRead: true,
            read: true,
          })
        ),
      ];

      await Promise.all(promises);
      toast.success("All notifications marked as read!");
      setShowModal(false);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  // Test sound function
  const handleTestChime = () => {
    playNotificationSound();
    toast.success("🎵 Playing notification chime!", { duration: 2000 });
  };

  return (
    <>
      <div className="relative">
        {/* Bell Button */}
        <button
          onClick={() => {
            setOpen(!open);
            requestNotificationPermission();
          }}
          className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-teal-700 transition"
          title="Admin Notifications"
        >
          <Bell size={22} />

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-3 w-[340px] xs:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-teal-400" />
                <h3 className="font-bold text-sm">Real-time Notifications</h3>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {notifications.length} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    soundEnabled
                      ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                      : "bg-white/10 text-slate-400 hover:bg-white/20"
                  }`}
                  title={soundEnabled ? "Sound Alert ON (Click to Mute)" : "Sound Alert Muted (Click to Unmute)"}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Sound & Permission Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <button
                type="button"
                onClick={handleTestChime}
                className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold transition"
              >
                <Volume2 size={13} />
                <span>Test Chime Sound</span>
              </button>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-700 font-medium transition"
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <Bell size={32} className="mx-auto text-slate-300 mb-2 stroke-1" />
                  <p className="text-xs font-medium">No unread notifications</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    New appointments and reviews will appear here with instant sound alert.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleView(item)}
                    className="p-3.5 hover:bg-teal-50/60 transition cursor-pointer flex items-start gap-3 group"
                  >
                    {getIcon(item.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-teal-700 mt-0.5 truncate">
                        {item.patientName} • {item.phone}
                      </p>

                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <ExternalLink size={13} className="text-slate-300 group-hover:text-teal-600 shrink-0 mt-1" />
                  </div>
                ))
              )}
            </div>

            {/* Footer View All */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/appointments");
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 transition"
              >
                Go to Appointments Panel &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- POPUP MODAL ON ENTRY OR NEW ARRIVAL ----------------- */}
      <AnimatePresence>
        {showModal && notifications.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 xs:p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-teal-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-teal-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
                    <Bell size={20} className="animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-white">
                        New Activity Alert!
                      </h3>
                      <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        {notifications.length} New
                      </span>
                    </div>
                    <p className="text-xs text-teal-300/90 mt-0.5">
                      New patient appointments & reviews received while away
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) {
                        playNotificationSound();
                        toast.success("Sound notifications enabled!");
                      } else {
                        toast("Sound notifications muted", { icon: "🔇" });
                      }
                    }}
                    className={`p-2 rounded-xl transition ${
                      soundEnabled
                        ? "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                        : "bg-white/10 text-slate-400 hover:bg-white/20"
                    }`}
                    title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                    title="Close popup"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body: List of Unread Bookings */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Unread Leads ({notifications.length})
                </p>

                {appointmentNotifications.length > 0 && (
                  <div className="space-y-2.5">
                    {appointmentNotifications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleView(app)}
                        className="p-3.5 rounded-2xl bg-teal-50/50 hover:bg-teal-100/70 border border-teal-200/80 transition cursor-pointer flex flex-col xs:flex-row items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <Calendar size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                                {app.patientName}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900">
                                {app.timeSlot || "New Booking"}
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                              {app.phone && app.phone !== "Not provided" ? (
                                <a
                                  href={`tel:${app.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 font-bold text-teal-700 bg-white hover:bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200"
                                >
                                  <Phone size={11} />
                                  <span>{app.phone}</span>
                                </a>
                              ) : (
                                <span className="font-semibold text-slate-500">No phone</span>
                              )}
                              {app.date && <span>📅 {app.date}</span>}
                            </div>

                            <p className="text-xs text-slate-500 mt-1 truncate">
                              <strong>Doctor:</strong> {app.doctor} • <strong>Condition:</strong> {app.condition}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-teal-700 group-hover:translate-x-1 transition shrink-0 self-end xs:self-center">
                          View &rarr;
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Testimonial previews if any */}
                {testimonialNotifications.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {testimonialNotifications.slice(0, 3).map((other) => (
                      <div
                        key={other.id}
                        onClick={() => handleView(other)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          {getIcon(other.type)}
                          <div>
                            <p className="text-xs font-bold text-slate-800">{other.title}: {other.patientName}</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[280px]">{other.message}</p>
                          </div>
                        </div>
                        <span className="text-xs text-teal-600 font-semibold shrink-0">Open &rarr;</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-3 xs:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition"
                >
                  <CheckCheck size={14} />
                  <span>Mark All as Read</span>
                </button>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition text-center whitespace-nowrap"
                  >
                    Dismiss
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/admin/appointments");
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition whitespace-nowrap"
                  >
                    <span>Appointments</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNotifications;