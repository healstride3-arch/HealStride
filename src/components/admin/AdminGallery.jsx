import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Trash2, Edit, X } from "lucide-react";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import Pagination from "./Pagination";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter & Pagination
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [confirmEditImage, setConfirmEditImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
  });

  const filteredImages = images.filter((img) => {
    if (categoryFilter === "all") return true;
    return img.category === categoryFilter;
  });

  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "gallery"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setImages(data);
      },
      (error) => {
        console.error("Failed to fetch gallery:", error.message || error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadedUrl = await uploadImage(file, "gallery");
      setForm((prev) => ({
        ...prev,
        url: uploadedUrl,
      }));
    } catch (error) {
      console.error("Failed to fetch gallery:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const removePreview = () => {
    setForm({
      ...form,
      url: "",
    });

    const fileInput = document.getElementById("galleryImage");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category) {
      alert("Please fill title and category fields");
      return;
    }

    try {
      setLoading(true);

      const imageUrl =
        form.url ||
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800";

      const payload = {
        title: form.title,
        description: form.description || "",
        category: form.category,
        imageUrl,
      };

      if (editingId) {
        await updateDoc(doc(db, "gallery", editingId), payload);
        alert("Image Updated Successfully");
      } else {
        await addDoc(collection(db, "gallery"), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        alert("Image Added Successfully");
      }

      setEditingId(null);
      setForm({
        title: "",
        description: "",
        category: "",
        url: "",
      });

      const fileInput = document.getElementById("galleryImage");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error(error);
      alert("Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(
        doc(db, "gallery", id)
      );

    } catch (error) {
      console.error("Failed to delete gallery item:", error.message || error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Gallery Management
        </h1>

        <p className="text-slate-500 mt-1">
          Upload and manage clinic gallery images.
        </p>
      </motion.div>

      {/* Upload Form */}
      <motion.form
        onSubmit={handleAdd}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-lg p-5 md:p-6 mb-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Image Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">
              Select Category
            </option>

            <option value="clinic">
              Clinic Photos
            </option>

            <option value="machine">
              Machine Photos
            </option>

            <option value="treatment">
              Treatment Photos
            </option>
          </select>

          <textarea
            name="description"
            placeholder="Image Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none md:col-span-2"
          />
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Image File
            </label>
            <input
              type="file"
              id="galleryImage"
              accept="image/*"
              onChange={handleUpload}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Or Image URL
            </label>
            <input
              type="text"
              name="url"
              placeholder="https://..."
              value={form.url}
              onChange={handleChange}
              className="border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none w-full text-sm"
            />
          </div>
        </div>

        {form.url && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mt-4 relative inline-block"
          >
            <img
              src={form.url}
              alt="Preview"
              className="h-40 w-40 rounded-xl object-cover border"
            />

            <button
              type="button"
              onClick={removePreview}
              className="
        absolute
        -top-2
        -right-2
        bg-red-500
        text-white
        rounded-full
        p-1.5
        shadow-lg
        hover:bg-red-600
        transition
      "
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
        >
          <ImagePlus size={18} />
{loading
  ? editingId
    ? "Updating..."
    : "Uploading..."
  : editingId
    ? "Update Image"
    : "Add Image"}
            </button>
      </motion.form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["all", "clinic", "machine", "treatment"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategoryFilter(cat);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition whitespace-nowrap ${
              categoryFilter === cat
                ? "bg-teal-600 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat === "all" ? "All Photos" : `${cat} Photos`}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedImages.map((img) => (
              <motion.div
                key={img.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{
                  y: -5,
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100"
              >
                <div className="relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                  />

                  <span className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg capitalize">
                    {img.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    {img.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {img.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setConfirmEditImage(img)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(img.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredImages.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[4, 8, 12, 24]}
            />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="bg-white rounded-3xl shadow-lg p-12 text-center"
        >
          <ImagePlus
            size={60}
            className="mx-auto text-slate-300 mb-4"
          />

          <h3 className="text-xl font-semibold text-slate-700">
            No Images Found
          </h3>

          <p className="text-slate-500 mt-2">
            Upload your first gallery image.
          </p>
        </motion.div>
      )}

      {/* Edit Confirmation Modal */}
{confirmEditImage && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Edit Gallery Image
      </h2>

      <p className="mt-4 text-gray-600">
        Do you want to edit this gallery image?
      </p>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => setConfirmEditImage(null)}
          className="rounded-lg border px-5 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setEditingId(confirmEditImage.id);

            setForm({
              title: confirmEditImage.title,
              description: confirmEditImage.description || "",
              category: confirmEditImage.category,
              url: confirmEditImage.imageUrl,
            });

            setConfirmEditImage(null);
          }}
          className="rounded-lg bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
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

export default AdminGallery;
