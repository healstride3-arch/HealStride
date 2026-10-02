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
} from "lucide-react";
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
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [faqSubmissions, setFaqSubmissions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Track known IDs so we only alert for NEW events arriving in real-time
  const knownAppointmentIds = useRef(new Set());
  const knownFaqIds = useRef(new Set());
  const knownTestimonialIds = useRef(new Set());
  const isInitialLoad = useRef({ appointments: true, faqs: true, testimonials: true });

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

      // Any appointment not marked as read
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
        // Initial snapshot load: record IDs without playing sound
        snapshot.docs.forEach((d) => knownAppointmentIds.current.add(d.id));
        isInitialLoad.current.appointments = false;
      }

      setAppointments(unread);
    });

    return () => unsub();
  }, [soundEnabled, navigate]);

  // ---------------- 2. Real-time FAQs Listener ----------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "faqSubmissions"), (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const unread = all.filter(
        (item) => item.notificationRead !== true && item.read !== true
      );

      if (!isInitialLoad.current.faqs) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newDoc = { id: change.doc.id, ...change.doc.data() };
            if (!knownFaqIds.current.has(newDoc.id)) {
              knownFaqIds.current.add(newDoc.id);

              if (soundEnabled) {
                playNotificationSound();
              }

              toast(
                `❓ New Question from ${newDoc.name || "Visitor"}: "${(newDoc.question || "").slice(0, 40)}..."`,
                { icon: "❓", duration: 5000, position: "top-right" }
              );

              triggerBrowserNotification("New Patient Question! ❓", {
                body: `${newDoc.name || "Visitor"}: ${newDoc.question || "Asked a question"}`,
                onClick: () => navigate("/admin/faq"),
              });
            }
          }
        });
      } else {
        snapshot.docs.forEach((d) => knownFaqIds.current.add(d.id));
        isInitialLoad.current.faqs = false;
      }

      setFaqSubmissions(unread);
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

  // Build combined notification list
  const appointmentNotifications = appointments.map((item) => ({
    id: item.id,
    type: "appointment",
    title: "New Appointment Booked",
    subtitle: `${item.name || "Patient"} • ${item.phone || ""}`,
    message: `${item.condition || "Physiotherapy Consultation"} with ${item.doctor || "Specialist"} on ${item.date || "Upcoming"} at ${item.time || ""}`,
    time: formatTime(item.createdAt),
    redirect: "/admin/appointments",
  }));

  const faqNotifications = faqSubmissions.map((item) => ({
    id: item.id,
    type: "faq",
    title: "New Patient Question",
    subtitle: `${item.name || "Visitor"} • ${item.email || ""}`,
    message: item.question || "Submitted an inquiry.",
    time: formatTime(item.createdAt),
    redirect: "/admin/faq",
  }));

  const testimonialNotifications = testimonials.map((item) => ({
    id: item.id,
    type: "testimonial",
    title: "New Review Received",
    subtitle: `${item.name || "Patient"} • ${item.rating || 5} Stars`,
    message: item.review || "Submitted positive feedback.",
    time: formatTime(item.createdAt),
    redirect: "/admin/testimonials",
  }));

  const notifications = [
    ...appointmentNotifications,
    ...faqNotifications,
    ...testimonialNotifications,
  ];

  // Helper for notification type icon
  const getIcon = (type) => {
    switch (type) {
      case "appointment":
        return (
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Calendar size={16} />
          </div>
        );
      case "faq":
        return (
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <MessageCircleQuestion size={16} />
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
          : item.type === "faq"
          ? "faqSubmissions"
          : "testimonials";

      await updateDoc(doc(db, collectionName, item.id), {
        notificationRead: true,
        read: true,
      });

      setOpen(false);
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
        ...faqSubmissions.map((f) =>
          updateDoc(doc(db, "faqSubmissions", f.id), {
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

      {/* Notification Dropdown / Drawer */}
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
                  New appointments, reviews, and questions will appear here with instant sound alert.
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
                      {item.subtitle}
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
  );
};

export default AdminNotifications;