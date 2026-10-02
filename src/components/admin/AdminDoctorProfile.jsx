import { useEffect, useState } from "react";
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
  deleteObject,
  ref,
} from "firebase/storage";

import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

import { db, storage } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";

const emptyForm = {
  slug: "",
  name: "",
  role: "",
  image: "", // Image URL
  imagePath: "",
  education: "",
  experience: "",
  registration: "",
  specialization: "",
  certifications: "",
  description: "",
  active: true,
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [confirmEditDoctor, setConfirmEditDoctor] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "doctors"),
      (snap) => {
        setDoctors(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      ...emptyForm,
      ...doctor,
      certifications: Array.isArray(doctor.certifications)
        ? doctor.certifications.join("\n")
        : (doctor.certifications || ""),
    });

    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (
        field === "name" &&
        !editingId &&
        !prev.slug
      ) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert("Name and Slug are required");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = "";
      let imagePath = formData.imagePath || "";

      // Priority 1: Upload Image
      if (imageFile) {
        // Delete old uploaded image (while editing)
        if (imagePath) {
          try {
            await deleteObject(ref(storage, imagePath));
          } catch (e) {
            console.warn("Old image delete failed:", e.message);
          }
        }

        imageUrl = await uploadImage(imageFile, "doctors");
        imagePath = "";
      }

      // Priority 2: Image URL
      else if (formData.image.trim()) {
        imageUrl = formData.image.trim();
      }

      // Default Placeholder
      else {
        imageUrl =
          "https://ui-avatars.com/api/?name=Doctor&background=0D9488&color=fff&size=300";
      }

      const certificationsArray =
        typeof formData.certifications === "string"
          ? formData.certifications
              .split("\n")
              .map((c) => c.trim())
              .filter(Boolean)
          : Array.isArray(formData.certifications)
          ? formData.certifications
          : [];

      const payload = {
        ...formData,
        certifications: certificationsArray,
        slug: slugify(formData.slug),
        image: imageUrl,
        imagePath,
        active: formData.active,
      };

      if (editingId) {
        await updateDoc(
          doc(db, "doctors", editingId),
          payload
        );
      } else {
        await addDoc(
          collection(db, "doctors"),
          {
            ...payload,
            createdAt: serverTimestamp(),
          }
        );
      }

      // Reset Form
      setIsModalOpen(false);
      setEditingId(null);
      setImageFile(null);
      setFormData(emptyForm);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doctor) => {
    if (
      !window.confirm(
        `Delete ${doctor.name}?`
      )
    )
      return;

    try {
      if (doctor.imagePath) {
        try {
          await deleteObject(
            ref(storage, doctor.imagePath)
          );
        } catch (e) {
          console.warn(e.message);
        }
      }

      await deleteDoc(
        doc(db, "doctors", doctor.id)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const toggleActive = async (doctor) => {
    try {
      await updateDoc(
        doc(db, "doctors", doctor.id),
        {
          active: !doctor.active,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Doctor Management
          </h1>

          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Add, edit, or remove doctor profiles.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="
    w-full
    md:w-fit
    flex
    items-center
    justify-center
    gap-2
    bg-teal-600
    hover:bg-teal-700
    text-white
    px-5
    py-3
    rounded-xl
    font-medium
    transition
    whitespace-nowrap
  "
        >
          
          + Add Doctor
        </button>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-teal-600 text-white">

              <tr>
                <th className="p-4 text-left">
                  Photo
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Slug
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {doctors.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No doctors added yet.
                  </td>
                </tr>

              ) : (

                doctors.map((doctor) => (

                  <tr
                    key={doctor.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4">

                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-200" />
                      )}

                    </td>

                    <td className="p-4 font-medium">
                      {doctor.name}
                    </td>

                    <td className="p-4 text-slate-600">
                      {doctor.role}
                    </td>

                    <td className="p-4 text-sm text-slate-500">
                      {doctor.slug}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          toggleActive(doctor)
                        }
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${doctor.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {doctor.active ? (
                          <>
                            <CheckCircle size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Inactive
                          </>
                        )}
                      </button>

                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => setConfirmEditDoctor(doctor)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(doctor)
                          }
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>
      </div>
      {/* Modal */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div
            className="
            bg-white
            rounded-2xl
            w-full
            max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            p-5
            sm:p-8
            relative
          "
          >

            {/* Close Button */}

            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData(emptyForm);
                setImageFile(null);
              }}
              disabled={uploading}
              className="
              absolute
              top-4
              right-4
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-full
              hover:bg-slate-100
            "
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 pr-10">
              {editingId
                ? "Edit Doctor"
                : "Add Doctor"}
            </h2>

            {/* Form */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Image Upload */}

              {/* Profile Image */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profile Image
                </label>

                {/* Upload Image */}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                  className="
      w-full
      border
      rounded-lg
      p-2
      file:mr-4
      file:px-4
      file:py-2
      file:border-0
      file:rounded-lg
      file:bg-teal-50
      file:text-teal-700
      file:font-medium
      hover:file:bg-teal-100
    "
                />

                <p className="text-center text-sm text-slate-500 my-3">
                  OR
                </p>

                {/* Image URL */}

                <input
                  type="url"
                  placeholder="https://example.com/doctor.jpg"
                  value={formData.image}
                  onChange={(e) =>
                    handleChange("image", e.target.value)
                  }
                  className="
      w-full
      border
      rounded-lg
      p-3
      focus:ring-2
      focus:ring-teal-500
      outline-none
    "
                />

                {/* Preview */}

                {(imageFile || formData.image) && (
                  <div className="mt-5 flex justify-center">

                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : formData.image
                      }
                      alt="Preview"
                      className="
          w-24
          h-24
          rounded-full
          object-cover
          border-4
          border-teal-100
          shadow
        "
                    />

                  </div>
                )}

              </div>



              {/* Name */}

              <input
                type="text"
                placeholder="Doctor Name"
                value={formData.name}
                onChange={(e) =>
                  handleChange(
                    "name",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Slug */}

              <input
                type="text"
                placeholder="doctor-slug"
                value={formData.slug}
                onChange={(e) =>
                  handleChange(
                    "slug",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Role */}

              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) =>
                  handleChange(
                    "role",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
                md:col-span-2
              "
              />

              {/* Education */}

              <input
                type="text"
                placeholder="Education"
                value={formData.education}
                onChange={(e) =>
                  handleChange(
                    "education",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Experience */}

              <input
                type="text"
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) =>
                  handleChange(
                    "experience",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Registration */}

              <input
                type="text"
                placeholder="Registration Number"
                value={formData.registration}
                onChange={(e) =>
                  handleChange(
                    "registration",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Specialization */}

              <input
                type="text"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  handleChange(
                    "specialization",
                    e.target.value
                  )
                }
                className="
                border
                rounded-lg
                p-3
              "
              />

              {/* Certifications (one per line) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Certifications (One per line)
                </label>
                <textarea
                  rows="4"
                  placeholder="Certified in Cupping Therapy&#10;Certified in Dry Needling Therapy&#10;Certified in Taping Therapy&#10;Certified in Mulligan’s Mobilization with Movement (MWM)&#10;Certified in Basic Life Support (BLS) & Critical Care Management"
                  value={formData.certifications}
                  onChange={(e) =>
                    handleChange(
                      "certifications",
                      e.target.value
                    )
                  }
                  className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Profile Bio / Description
                </label>
                <textarea
                  rows="5"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  className="
                  border
                  rounded-lg
                  p-3
                  w-full
                "
                />
              </div>

              {/* Active */}

              <label className="flex items-center gap-3 md:col-span-2">

                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    handleChange(
                      "active",
                      e.target.checked
                    )
                  }
                />

                Active (Show on website)

              </label>

            </div>

            {/* Footer Buttons */}

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                disabled={uploading}
                className="
                px-5
                py-3
                border
                rounded-lg
                w-full
                sm:w-auto
              "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={uploading}
                className="
                bg-teal-600
                hover:bg-teal-700
                text-white
                px-5
                py-3
                rounded-lg
                w-full
                sm:w-auto
                disabled:opacity-50
              "
              >
                {uploading
                  ? "Saving..."
                  : "Save Doctor"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Edit Confirmation */}
      {confirmEditDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <h3 className="text-xl font-bold text-slate-900">
              Edit Doctor
            </h3>

            <p className="text-slate-600 mt-3">
              Do you want to edit
              <span className="font-semibold">
                {" "}{confirmEditDoctor.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setConfirmEditDoctor(null)}
                className="px-5 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  openEdit(confirmEditDoctor);
                  setConfirmEditDoctor(null);
                }}
                className="px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
              >
                Yes, Edit
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDoctors;
