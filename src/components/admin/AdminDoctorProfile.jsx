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
  Search,
  Sparkles,
} from "lucide-react";

import { db, storage } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import { doctors as defaultDoctors } from "../../data/team";
import Pagination from "./Pagination";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

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

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (doc.name || "").toLowerCase().includes(q) ||
      (doc.role || "").toLowerCase().includes(q) ||
      (doc.education || "").toLowerCase().includes(q) ||
      (doc.specialization || "").toLowerCase().includes(q) ||
      (doc.slug || "").toLowerCase().includes(q)
    );
  });

  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

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

  const seedDefaultDoctors = async () => {
    if (
      !window.confirm(
        "Do you want to initialize default clinic doctors (Dr. MD Rashid (PT) & Dr. Md Wajhul Quamar (PT)) into the database?"
      )
    )
      return;

    try {
      setUploading(true);
      for (const d of defaultDoctors) {
        await addDoc(collection(db, "doctors"), {
          name: d.name,
          slug: d.slug,
          role: d.role,
          image: d.imageUrl || d.image || "",
          imagePath: "",
          education: d.education || "",
          experience: d.experience || "",
          registration: d.registration || "",
          specialization: d.specialization || "",
          certifications: d.certifications || [],
          description: d.description || "",
          active: true,
          createdAt: serverTimestamp(),
        });
      }
      alert("Clinic doctors successfully loaded into Firestore! You can now edit them directly.");
    } catch (err) {
      console.error(err);
      alert("Failed to initialize doctors: " + err.message);
    } finally {
      setUploading(false);
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
    sm:w-fit
    flex
    items-center
    justify-center
    gap-2
    bg-teal-600
    hover:bg-teal-700
    text-white
    px-5
    py-2.5
    rounded-xl
    font-bold
    text-sm
    shadow-sm
    transition
    whitespace-nowrap
  "
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors by name, role, degree, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Mobile View: Responsive Cards (320px, 375px, 425px) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedDoctors.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="font-bold text-slate-700 text-sm mb-1">
                {searchQuery ? `No doctor matching "${searchQuery}"` : "No doctor profiles found."}
              </p>
              {doctors.length === 0 && (
                <button
                  type="button"
                  onClick={seedDefaultDoctors}
                  disabled={uploading}
                  className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                >
                  {uploading ? (
                    "Loading..."
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Initialize Default Doctors</span>
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : (
            paginatedDoctors.map((doctor) => (
              <div key={doctor.id} className="p-4 space-y-3 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
                      Dr
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5 leading-snug">
                      {doctor.role}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      slug: /{doctor.slug}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleActive(doctor)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                      doctor.active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {doctor.active ? <CheckCircle size={13} /> : <XCircle size={13} />}
                    <span>{doctor.active ? "Active" : "Inactive"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmEditDoctor(doctor)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(doctor)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      title="Delete Doctor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider">Photo</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider">Role</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider">Slug</th>
                <th className="p-3.5 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="p-3.5 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <p className="font-semibold text-slate-700 text-base mb-1">
                      {searchQuery ? `No doctor matching "${searchQuery}"` : "No doctor profiles in Firestore yet."}
                    </p>
                    {doctors.length === 0 && (
                      <>
                        <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                          Click below to load Dr. MD Rashid (PT) and Dr. Md Wajhul Quamar (PT) into the database so you can edit and manage their details in real time.
                        </p>
                        <button
                          type="button"
                          onClick={seedDefaultDoctors}
                          disabled={uploading}
                          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                        >
                          {uploading ? (
                            "Loading..."
                          ) : (
                            <span className="inline-flex items-center gap-1.5">
                              <Sparkles size={14} />
                              <span>Initialize Default Doctors to Database</span>
                            </span>
                          )}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
                          Dr
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 text-sm">
                      {doctor.name}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs font-medium">
                      {doctor.role}
                    </td>
                    <td className="p-3.5 text-xs text-slate-400 font-mono">
                      /{doctor.slug}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleActive(doctor)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                          doctor.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {doctor.active ? (
                          <>
                            <CheckCircle size={13} />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setConfirmEditDoctor(doctor)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Edit Doctor"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete Doctor"
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

        {/* Pagination Controls */}
        <Pagination
          totalItems={filteredDoctors.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[3, 6, 12, 24]}
        />
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
