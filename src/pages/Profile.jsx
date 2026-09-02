import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  LogOut,
  Camera,
  Phone,
  Shield,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  auth,
  db,
  storage,
} from "../firebase/firebase";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const Profile = () => {
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }

      setUser(u);

      setPhotoURL(u.photoURL || "");

      setDisplayName(
        u.displayName ||
          (u.email
            ? u.email.split("@")[0]
            : "User")
      );

      try {
        const q = query(
          collection(db, "appointments"),
          where("userId", "==", u.uid)
        );

        const snapshot = await getDocs(q);

        const appointmentData = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setAppointments(appointmentData);
      } catch (error) {
        console.error("Appointment Fetch Error:", error.message || error);
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setUploading(true);

      const imageRef = ref(
        storage,
        `profile-images/${Date.now()}-${file.name}`
      );

      await uploadBytes(imageRef, file);

      const downloadURL =
        await getDownloadURL(imageRef);

      await updateProfile(
        auth.currentUser,
        {
          photoURL: downloadURL,
        }
      );

      await auth.currentUser.reload();

      setUser({
        ...auth.currentUser,
      });

      setPhotoURL(downloadURL);

      toast.success(
        "Photo uploaded successfully"
      );
    } catch (error) {
      console.error("Upload Error:", error.message || error);

      toast.error(
        "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfile(auth.currentUser, {
        displayName:
          displayName.trim() || "User",
        photoURL: photoURL.trim(),
      });

      toast.success(t("common.success"));
    } catch (e) {
      console.error("Save profile error:", e.message || e);
      toast.error(t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("role");

    toast.success(t("profile.logout"));

    navigate("/");
  };

  if (!user) return null;

  const initials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-[600px] bg-slate-50 py-10 sm:py-16 lg:py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800">
            {t("profile.dashboardTitle")}
          </h1>

          <p className="text-gray-500 mt-1">
            {t("profile.dashboardSubtitle")}
          </p>
        </motion.div>

        {/* Top Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-teal-700 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <img
                  src={
                    photoURL ||
                    user?.photoURL ||
                    "/default-avatar.png"
                  }
                  alt="profile"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src =
                      "/default-avatar.png";
                  }}
                />
              </div>

              <span className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {displayName}
              </h2>

              <p className="opacity-90 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail size={16} />
                {user.email}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
                  <Shield size={12} />
                  {t("profile.verifiedPatient")}
                </span>

                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
                  <Calendar size={12} />
                  {t("profile.joined")}{" "}
                  {new Date(
                    user.metadata?.creationTime ||
                      Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 font-semibold px-5 py-2.5 rounded-xl transition shadow"
            >
              <LogOut size={18} />
              {t("profile.logout")}
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            {
              label: t("profile.total"),
              value: appointments.length,
              icon: Calendar,
              color: "teal",
            },
            {
              label: t("profile.upcoming"),
              value: appointments.filter(
                (a) => a.status === "upcoming"
              ).length,
              icon: Clock,
              color: "blue",
            },
            {
              label: t("profile.completed"),
              value: appointments.filter(
                (a) => a.status === "completed"
              ).length,
              icon: CheckCircle2,
              color: "green",
            },
            {
              label: t("profile.sessions"),
              value: 0,
              icon: Shield,
              color: "purple",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3"
            >
              <div
                className={`p-3 rounded-xl bg-${s.color}-100 text-${s.color}-700`}
              >
                <s.icon size={20} />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {s.value}
                </p>

                <p className="text-xs text-gray-500">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Edit Profile */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Camera
                size={18}
                className="text-teal-700"
              />
              {t("profile.editProfile")}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {t("profile.updateDetails")}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="profile-name" className="text-sm font-medium text-gray-700">
                  {t("profile.fullName")}
                </label>

                <input
                  id="profile-name"
                  type="text"
                  name="displayName"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="profile-photo-url" className="text-sm font-medium text-gray-700">
                  {t("profile.photoURL")}
                </label>

                <input
                  id="profile-photo-url"
                  type="text"
                  name="photoURL"
                  value={photoURL}
                  onChange={(e) =>
                    setPhotoURL(
                      e.target.value
                    )
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="https://..."
                />

                <div className="mt-4">
                  <label htmlFor="profile-file-upload" className="text-sm font-medium text-gray-700">
                    Upload Photo
                  </label>

                  <input
                    id="profile-file-upload"
                    type="file"
                    name="profileFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="
                      w-full
                      mt-1
                      border
                      rounded-lg
                      p-2
                      bg-white
                    "
                  />

                  {uploading && (
                    <p className="text-sm text-teal-600 mt-2">
                      Uploading...
                    </p>
                  )}
                </div>

                {photoURL && (
                  <div className="mt-3">
                    <img
                      src={photoURL}
                      alt="preview"
                      className="
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        object-center
                        border
                        border-gray-200
                      "
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="profile-email" className="text-sm font-medium text-gray-700">
                  {t("profile.email")}
                </label>

                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={user.email}
                  disabled
                  className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {saving
                  ? t("profile.saving")
                  : t("profile.saveChanges")}
              </button>
            </div>
          </motion.div>

          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar
                    size={18}
                    className="text-teal-700"
                  />
                  {t("profile.myAppointments")}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {t("profile.bookedSessions")}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/booking")
                }
                className="text-sm bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-2 rounded-lg font-medium transition"
              >
                {t("profile.bookNew")}
              </button>
            </div>

            <div className="mt-5">
              {appointments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                  <Calendar
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p className="font-medium text-slate-700">
                    {t("profile.noAppointments")}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {t("profile.bookFirst")}
                  </p>

                  <button
                    onClick={() =>
                      navigate("/booking")
                    }
                    className="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition"
                  >
                    {t("profile.bookBtn")}
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {appointments.map((a) => (
                    <li
                      key={a.id}
                      className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-lg">
                            {a.condition}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            📅 {a.date}
                          </p>

                          <p className="text-sm text-gray-500">
                            📞 {a.phone}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            a.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : a.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;