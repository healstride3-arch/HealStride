import { useState, useEffect } from "react";

import {
  Building2,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  Save,
  Check,
  Stethoscope,
  MapPin,
  Share2,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

const SECTIONS = [
  {
    id: "location",
    title: "Location & Hours",
    description: "Where patients find you and when you're open.",
    icon: MapPin,
    fields: [
      {
        key: "address",
        label: "Clinic Address",
        placeholder: "Clinic address",
        type: "text",
        icon: Building2,
        full: true,
      },
      {
        key: "hours",
        label: "Working Hours",
        placeholder: "Mon-Sat, 9:00 AM - 8:00 PM",
        type: "text",
        icon: Clock,
        full: true,
      },
    ],
  },

  {
    id: "contact",
    title: "Contact Channels",
    description: "Primary ways for patients to reach you.",
    icon: Phone,
    fields: [
      {
        key: "phone",
        label: "Phone",
        placeholder: "+91 9876543210",
        type: "tel",
        icon: Phone,
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        placeholder: "+91 9876543210",
        type: "tel",
        icon: MessageCircle,
      },
      {
        key: "email",
        label: "Email",
        placeholder: "hello@clinic.com",
        type: "email",
        icon: Mail,
        full: true,
      },
    ],
  },

  {
    id: "social",
    title: "Social Presence",
    description: "Links shown in your public footer.",
    icon: Share2,
    fields: [
      {
        key: "instagram",
        label: "Instagram",
        placeholder: "https://instagram.com/yourclinic",
        type: "url",
        icon: FaInstagram,
      },
      {
        key: "facebook",
        label: "Facebook",
        placeholder: "https://facebook.com/yourclinic",
        type: "url",
        icon: FaFacebook,
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        placeholder: "https://linkedin.com/company/yourclinic",
        type: "url",
        icon: FaLinkedin,
        full: true,
      },
    ],
  },
];

const ALL_FIELDS = SECTIONS.flatMap(
  (section) => section.fields
);

const INITIAL = ALL_FIELDS.reduce(
  (acc, field) => ({
    ...acc,
    [field.key]: "",
  }),
  {}
);

function AdminSettings() {
  const [values, setValues] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "clinic"),
      (snap) => {
        if (snap.exists()) {
          setValues({
            ...INITIAL,
            ...snap.data(),
          });
        }

        setLoading(false);
      },
      (error) => {
        console.error("Failed to save settings:", error.message || error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const update = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filledCount = Object.values(values)
    .filter((value) => value.trim() !== "")
    .length;

  const progress = Math.round(
    (filledCount / ALL_FIELDS.length) * 100
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await setDoc(
        doc(db, "settings", "clinic"),
        values,
        { merge: true }
      );

      setSaved(true);
      setIsEditing(false);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (error) {
      console.error(error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Settings...
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-5xl px-4 py-10">

        <header className="mb-8">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center">
              <Stethoscope className="text-white" />
            </div>

            <p className="font-semibold text-teal-700">
              Admin / Clinic Settings
            </p>

          </div>

          <h1 className="text-4xl font-bold mt-5">
            Clinic Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Manage clinic contact information and social links.
          </p>

          <div className="mt-6">

            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-teal-600 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="text-sm mt-2">
              Profile completeness {filledCount}/{ALL_FIELDS.length}
            </p>

          </div>

        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {SECTIONS.map((section) => {

            const SectionIcon = section.icon;

            return (
              <section
                key={section.id}
                className="bg-white rounded-2xl border shadow-sm"
              >

                <div className="flex gap-3 p-5 border-b">

                  <SectionIcon className="text-teal-600" />

                  <div>
                    <h2 className="font-semibold">
                      {section.title}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {section.description}
                    </p>
                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5 p-6">

                  {section.fields.map((field) => {

                    const Icon = field.icon;

                    return (
                      <div
                        key={field.key}
                        className={
                          field.full
                            ? "md:col-span-2"
                            : ""
                        }
                      >

                        <label className="block text-sm font-medium mb-2">
                          {field.label}
                        </label>

                        <div className="relative">

                          <Icon
                            className="absolute left-3 top-3 text-slate-400"
                            size={18}
                          />

                          <input
                            type={field.type}
                            value={values[field.key]}
                            placeholder={field.placeholder}
                            disabled={!isEditing}
                            onChange={(e) =>
                              update(
                                field.key,
                                e.target.value
                              )
                            }
                            className="
                              w-full
                              border
                              rounded-xl
                              py-3
                              pl-10
                              pr-3
                              outline-none
                              focus:border-teal-500
                              disabled:bg-slate-100
                            "
                          />

                        </div>

                      </div>
                    );

                  })}

                </div>

              </section>
            );
          })}

          <div className="flex justify-end gap-3">

            {!isEditing ? (

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-teal-600
                  text-teal-600
                  font-medium
                "
              >
                Edit Settings
              </button>

            ) : (

              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  items-center
                  gap-2
                  bg-teal-600
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  disabled:opacity-50
                "
              >
                {saved ? (
                  <>
                    <Check size={18} />
                    Saved
                  </>
                ) : saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save Settings
                  </>
                )}
              </button>

            )}

          </div>

        </form>

      </div>

    </div>
  );
}

export default AdminSettings;
