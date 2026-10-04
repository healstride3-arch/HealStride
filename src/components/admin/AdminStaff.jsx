import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import { toast } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  UserRound,
} from "lucide-react";
import Pagination from "./Pagination";

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const paginatedStaff = staff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [confirmEdit, setConfirmEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    certifications: "",
    order: 1,
    active: true,
    imageUrl: "",
  });

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        const staffData = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

        setStaff(staffData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching staff:", error);
        toast.error("Failed to load staff");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      certifications: "",
      order: staff.length + 1,
      active: true,
      imageUrl: "",
    });

    setImageFile(null);
    setImagePreview("");
    setEditingStaff(null);
  };

  // Open add form
  const handleAddStaff = () => {
    resetForm();
    setShowForm(true);
  };

  // Open edit confirmation
  const handleEditClick = (member) => {
    setConfirmEdit(member);
  };

  // Start editing after confirmation
  const startEditing = (member) => {
    setEditingStaff(member);

    setFormData({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      certifications: member.certifications || "",
      order: member.order || 1,
      active: member.active ?? true,
      imageUrl: member.imageUrl || "",
    });

    setImageFile(null);
    setImagePreview(member.imageUrl || "");

    setConfirmEdit(null);
    setShowForm(true);
  };

  // Upload image
  const uploadStaffImage = async (file, staffId) => {
  if (!file) return null;

  return await uploadImage(file, `staff/${staffId}`);
};


  // Save staff
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter staff name");
      return;
    }

    if (!formData.role.trim()) {
      toast.error("Please enter staff designation");
      return;
    }

    try {
      if (editingStaff) {
        let imageUrl = editingStaff.imageUrl || "";

        // Upload new image if selected
        if (imageFile) {
          const newImageUrl = await uploadStaffImage(
            imageFile,
            editingStaff.id
          );

          

          imageUrl = newImageUrl;
        }

        await updateDoc(doc(db, "staff", editingStaff.id), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          bio: formData.bio.trim(),
          certifications: formData.certifications.trim(),
          order: Number(formData.order),
          active: formData.active,
          imageUrl,
          updatedAt: new Date(),
        });

        toast.success("Staff updated successfully");
      } else {
        // Create document first
        const staffRef = await addDoc(collection(db, "staff"), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          bio: formData.bio.trim(),
          certifications: formData.certifications.trim(),
          order: Number(formData.order),
          active: formData.active,
          imageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        let imageUrl = "";

        // Upload image
        if (imageFile) {
          imageUrl = await uploadStaffImage(imageFile, staffRef.id);

          await updateDoc(doc(db, "staff", staffRef.id), {
            imageUrl,
          });
        }

        toast.success("Staff added successfully");
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error("Failed to save staff");
    }
  };

  // Delete staff
  const handleDelete = async (member) => {
    try {
      

      await deleteDoc(doc(db, "staff", member.id));

      toast.success("Staff deleted successfully");

      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Staff Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage clinic staff and their professional information.
          </p>
        </div>

        <button
          onClick={handleAddStaff}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading staff...
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <UserRound
            size={45}
            className="mx-auto text-gray-400 mb-4"
          />

          <h3 className="text-lg font-semibold text-gray-700">
            No staff members yet
          </h3>

          <p className="text-gray-500 mt-1">
            Add your first staff member.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedStaff.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover block"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserRound size={60} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {member.name}
                      </h3>

                      <p className="text-[#0f766e] font-medium mt-1">
                        {member.role}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        member.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {member.active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setConfirmDelete(member)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalItems={staff.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[3, 6, 12]}
            />
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingStaff ? "Edit Staff" : "Add Staff"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter the professional details of the staff member.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Image
                </label>

                <div className="flex items-center gap-5">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserRound className="text-gray-400" size={35} />
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload size={17} />
                    Choose Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Md Wajhul Qumar (PT)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation / Role *
                </label>

                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Clinic Partner & Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About / Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a short professional description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] resize-none"
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications / Certifications
                </label>

                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  rows="6"
                  placeholder={`Enter one qualification per line

Example:
Certified in Cupping Therapy
Certified in Dry Needling Therapy
Certified in Taping Therapy
Certified in Mulligan’s Mobilization with Movement (MWM)
Certified in Basic Life Support (BLS) & Critical Care Management`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] resize-none"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>

                <input
                  type="number"
                  name="order"
                  min="1"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4"
                  id="staff-active"
                />

                <label
                  htmlFor="staff-active"
                  className="text-sm text-gray-700"
                >
                  Show this staff member on the website
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59]"
                >
                  {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Confirmation */}
      {confirmEdit && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">
              Edit Staff?
            </h3>

            <p className="text-gray-600 mt-2">
              Do you want to edit the details of{" "}
              <strong>{confirmEdit.name}</strong>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmEdit(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => startEditing(confirmEdit)}
                className="px-4 py-2 bg-[#0f766e] text-white rounded-lg"
              >
                Yes, Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">
              Delete Staff?
            </h3>

            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.name}</strong>?
            </p>

            <p className="text-sm text-red-500 mt-2">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
