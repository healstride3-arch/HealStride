import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  X,
  ImagePlus,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

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

const emptyForm = {
  title: "",
  slug: "",
  category: "therapies",
  description: "",
  benefits: [""],
  duration: "",
  imageUrl: "",
  icon: "activity",
  showOnHome: true,
  active: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [confirmEditService, setConfirmEditService] = useState(null);
  const [confirmDeleteService, setConfirmDeleteService] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);

    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const data = snapshot.docs.map((serviceDoc) => ({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        }));

        setServices(data);
        setFetching(false);
      },
      (error) => {
        console.error("Failed to fetch services:", error);
        alert("Failed to load services.");
        setFetching(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ----------------------------------------
  // FORM HANDLERS
  // ----------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBenefitChange = (index, value) => {
    setForm((prev) => {
      const benefits = [...prev.benefits];
      benefits[index] = value;

      return {
        ...prev,
        benefits,
      };
    });
  };

  const addBenefit = () => {
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index) => {
    setForm((prev) => {
      const benefits = prev.benefits.filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        benefits: benefits.length ? benefits : [""],
      };
    });
  };

  // ----------------------------------------
  // IMAGE UPLOAD
  // ----------------------------------------

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const uploadedUrl = await uploadImage(
        file,
        "services"
      );

      setForm((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload service image.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // RESET FORM
  // ----------------------------------------

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);

    const fileInput =
      document.getElementById("serviceImage");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ----------------------------------------
  // ADD / UPDATE SERVICE
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.imageUrl
    ) {
      alert(
        "Please fill the service name, description and image."
      );
      return;
    }

    try {
      setLoading(true);

      const cleanedBenefits = form.benefits
        .map((benefit) => benefit.trim())
        .filter(Boolean);

      const categoryMap = {
        spine: "Back & Cervical",
        joints: "Joint & Muscle",
        therapies: "Specialized Therapy",
        rehab: "Rehabilitation",
      };

      const payload = {
        title: form.title.trim(),
        slug:
          form.slug.trim() ||
          form.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        category: form.category || "therapies",
        categoryLabel: categoryMap[form.category] || "Specialized Therapy",
        description: form.description.trim(),
        benefits: cleanedBenefits,
        duration: form.duration.trim(),
        imageUrl: form.imageUrl,
        icon: form.icon,
        showOnHome: form.showOnHome,
        active: form.active,
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        await updateDoc(
          doc(db, "services", editingId),
          payload
        );

        alert("Service updated successfully.");
      } else {
        await addDoc(collection(db, "services"), {
          ...payload,
          createdAt: Timestamp.now(),
        });

        alert("Service added successfully.");
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save service:", error);
      alert("Failed to save service.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // EDIT SERVICE
  // ----------------------------------------

  const handleEdit = (service) => {
  setConfirmEditService(service);
};

const confirmEdit = () => {
  const service = confirmEditService;

  if (!service) return;

  setEditingId(service.id);

  setForm({
    title: service.title || "",
    slug: service.slug || "",
    category: service.category || "therapies",
    description: service.description || "",
    benefits:
      service.benefits?.length > 0
        ? service.benefits
        : [""],
    duration: service.duration || "",
    imageUrl: service.imageUrl || "",
    icon: service.icon || "activity",
    showOnHome:
      service.showOnHome !== false,
    active:
      service.active !== false,
  });

  setConfirmEditService(null);
  setShowForm(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  // ----------------------------------------
  // DELETE SERVICE
  // ----------------------------------------

  const confirmDelete = async () => {
  if (!confirmDeleteService) return;

  const id = confirmDeleteService.id;

  setConfirmDeleteService(null);

  await handleDelete(id);
};

  const handleDelete = async (id) => {
  try {
    await deleteDoc(
      doc(db, "services", id)
    );

    alert("Service deleted successfully.");

  } catch (error) {
    console.error(
      "Failed to delete service:",
      error
    );

    alert("Failed to delete service.");
  }
};

  // ----------------------------------------
  // TOGGLE ACTIVE STATUS
  // ----------------------------------------

  const toggleActive = async (service) => {
    try {
      await updateDoc(
        doc(db, "services", service.id),
        {
          active: !service.active,
          updatedAt: Timestamp.now(),
        }
      );
    } catch (error) {
      console.error(
        "Failed to update service status:",
        error
      );

      alert("Failed to update service status.");
    }
  };

  // ----------------------------------------
  // TOGGLE HOME PAGE
  // ----------------------------------------

  const toggleHomeVisibility = async (service) => {
    try {
      await updateDoc(
        doc(db, "services", service.id),
        {
          showOnHome: !service.showOnHome,
          updatedAt: Timestamp.now(),
        }
      );
    } catch (error) {
      console.error(
        "Failed to update home visibility:",
        error
      );

      alert("Failed to update home visibility.");
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Services Management
          </h1>

          <p className="text-slate-500 mt-1">
            Add, update and manage physiotherapy services
            displayed on the website.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="
              flex items-center justify-center gap-2
              bg-teal-600
              hover:bg-teal-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            <Plus size={18} />
            Add New Service
          </button>
        )}
      </motion.div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-5 md:p-6
            mb-8
          "
        >
          {/* FORM HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {editingId
                ? "Edit Service"
                : "Add New Service"}
            </h2>

            <button
              type="button"
              onClick={resetForm}
              className="text-slate-500 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* BASIC INFORMATION */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* SERVICE NAME */}
            <div>
              <label htmlFor="service-title" className="block text-sm font-medium text-slate-700 mb-1">
                Service Name *
              </label>

              <input
                id="service-title"
                type="text"
                name="title"
                autoComplete="off"
                value={form.title}
                onChange={handleChange}
                placeholder="Physiotherapy"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                "
              />
            </div>

            {/* SLUG */}
            <div>
              <label htmlFor="service-slug" className="block text-sm font-medium text-slate-700 mb-1">
                URL Slug
              </label>

              <input
                id="service-slug"
                type="text"
                name="slug"
                autoComplete="off"
                value={form.slug}
                onChange={handleChange}
                placeholder="physiotherapy"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                "
              />
            </div>

            {/* DURATION */}
            <div>
              <label htmlFor="service-duration" className="block text-sm font-medium text-slate-700 mb-1">
                Duration
              </label>

              <input
                id="service-duration"
                type="text"
                name="duration"
                autoComplete="off"
                value={form.duration}
                onChange={handleChange}
                placeholder="45 Minutes"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                "
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label htmlFor="service-category" className="block text-sm font-medium text-slate-700 mb-1">
                Category *
              </label>

              <select
                id="service-category"
                name="category"
                value={form.category || "therapies"}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                  bg-white
                "
              >
                <option value="spine">Back & Cervical (spine)</option>
                <option value="joints">Joint & Muscle (joints)</option>
                <option value="therapies">Specialized Therapy (therapies)</option>
                <option value="rehab">Rehabilitation (rehab)</option>
              </select>
            </div>

            {/* ICON */}
            <div>
              <label htmlFor="service-icon" className="block text-sm font-medium text-slate-700 mb-1">
                Home Page Icon
              </label>

              <select
                id="service-icon"
                name="icon"
                autoComplete="off"
                value={form.icon}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                  bg-white
                "
              >
                <option value="activity">
                  Activity
                </option>

                <option value="heart">
                  Heart
                </option>

                <option value="dumbbell">
                  Dumbbell
                </option>

                <option value="running">
                  Running
                </option>

                <option value="hands">
                  Helping Hands
                </option>

                <option value="bolt">
                  Lightning
                </option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label htmlFor="service-description" className="block text-sm font-medium text-slate-700 mb-1">
                Service Description *
              </label>

              <textarea
                id="service-description"
                name="description"
                autoComplete="off"
                value={form.description}
                onChange={handleChange}
                placeholder="Personalized rehabilitation programs to restore movement and reduce pain."
                rows="4"
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-teal-500
                "
              />
            </div>
          </div>

          {/* BENEFITS */}
          <div className="mt-6">

            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                Benefits
              </label>

              <button
                type="button"
                onClick={addBenefit}
                className="
                  text-sm
                  text-teal-600
                  hover:text-teal-800
                  font-semibold
                "
              >
                + Add Benefit
              </button>
            </div>

            <div className="space-y-3">
              {form.benefits.map(
                (benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) =>
                        handleBenefitChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Benefit ${
                        index + 1
                      }`}
                      className="
                        flex-1
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-teal-500
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeBenefit(index)
                      }
                      className="
                        px-3
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* IMAGE */}
          <div className="mt-6">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Image *
            </label>

            <input
              type="file"
              id="serviceImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="
                w-full
                text-sm
                text-slate-500
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-xl
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-teal-50
                file:text-teal-700
                hover:file:bg-teal-100
                cursor-pointer
              "
            />

            {form.imageUrl && (
              <div className="mt-4 relative inline-block">

                <img
                  src={form.imageUrl}
                  alt="Service preview"
                  className="
                    h-48
                    w-64
                    object-cover
                    rounded-xl
                    border
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      imageUrl: "",
                    }))
                  }
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    rounded-full
                    p-1.5
                    shadow
                    hover:bg-red-600
                  "
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">

            <label
              className="
                flex
                items-center
                justify-between
                border
                rounded-xl
                p-4
                cursor-pointer
              "
            >
              <div>
                <p className="font-semibold text-slate-800">
                  Show on Home Page
                </p>

                <p className="text-sm text-slate-500">
                  Display this service in the Home
                  page service cards.
                </p>
              </div>

              <input
                type="checkbox"
                name="showOnHome"
                checked={form.showOnHome}
                onChange={handleChange}
                className="w-5 h-5 accent-teal-600"
              />
            </label>

            <label
              className="
                flex
                items-center
                justify-between
                border
                rounded-xl
                p-4
                cursor-pointer
              "
            >
              <div>
                <p className="font-semibold text-slate-800">
                  Active Service
                </p>

                <p className="text-sm text-slate-500">
                  Inactive services will not be
                  displayed publicly.
                </p>
              </div>

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-5 h-5 accent-teal-600"
              />
            </label>

          </div>

          {/* FORM BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-teal-600
                hover:bg-teal-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              {editingId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {loading
                ? "Saving..."
                : editingId
                ? "Update Service"
                : "Add Service"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="
                px-6
                py-3
                rounded-xl
                border
                border-slate-300
                hover:bg-slate-100
                transition
                font-medium
              "
            >
              Cancel
            </button>

          </div>
        </motion.form>
      )}

      {/* SERVICES LIST */}
      <div>

        {fetching ? (
          <div className="bg-white rounded-3xl shadow p-12 text-center">
            <p className="text-slate-500">
              Loading services...
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-12 text-center">

            <ImagePlus
              size={60}
              className="mx-auto text-slate-300 mb-4"
            />

            <h3 className="text-xl font-semibold text-slate-700">
              No Services Found
            </h3>

            <p className="text-slate-500 mt-2">
              Add your first physiotherapy service.
            </p>

          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {paginatedServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{ y: -5 }}
                className="
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-lg
                "
              >

                {/* IMAGE */}
                <div className="relative">

                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="
                      w-full
                      h-52
                      object-cover
                    "
                  />

                  {/* CATEGORY */}
                  {service.categoryLabel && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                      {service.categoryLabel}
                    </span>
                  )}

                  {/* STATUS */}
                  <span
                    className={`
                      absolute
                      top-3
                      right-3
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${
                        service.active
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }
                    `}
                  >
                    {service.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {service.description}
                  </p>

                  {service.duration && (
                    <p className="text-sm mt-3">
                      <span className="font-semibold">
                        Duration:
                      </span>{" "}
                      {service.duration}
                    </p>
                  )}

                  {/* HOME STATUS */}
                  <div className="flex items-center gap-2 mt-3 text-sm">

                    {service.showOnHome ? (
                      <>
                        <Eye
                          size={16}
                          className="text-teal-600"
                        />

                        <span className="text-teal-700">
                          Visible on Home
                        </span>
                      </>
                    ) : (
                      <>
                        <EyeOff
                          size={16}
                          className="text-slate-400"
                        />

                        <span className="text-slate-500">
                          Hidden from Home
                        </span>
                      </>
                    )}

                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-4 mt-5">

                    <button
  onClick={() => handleEdit(service)}
  className="..."
>
  <Edit size={16} />
  Edit
</button>

                    <button
                      onClick={() =>
                        toggleActive(service)
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        text-teal-600
                        hover:text-teal-800
                        font-medium
                      "
                    >
                      {service.active ? (
                        <>
                          <EyeOff size={16} />
                          Disable
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          Enable
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        toggleHomeVisibility(service)
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        text-purple-600
                        hover:text-purple-800
                        font-medium
                      "
                    >
                      {service.showOnHome ? (
                        <>
                          <EyeOff size={16} />
                          Hide Home
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          Show Home
                        </>
                      )}
                    </button>

                    <button
  onClick={() => setConfirmDeleteService(service)}
  className="flex items-center gap-2 text-red-600 hover:text-red-700"
>
  <Trash2 size={16} />
  Delete
</button>

                  </div>

                </div>
              </motion.div>
            ))}

          </div>

          {/* Pagination */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={services.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[3, 6, 12, 24]}
            />
          </div>
        </div>
        )}
    
    {/* EDIT CONFIRMATION MODAL */}
{confirmEditService && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="
        bg-white
        rounded-2xl
        shadow-2xl
        w-full
        max-w-md
        p-6
      "
    >

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
        Edit Service
      </h2>

      <p className="mt-3 text-slate-600 leading-6">
        Do you want to edit{" "}
        <span className="font-semibold text-slate-900">
          {confirmEditService.title}
        </span>
        ?
      </p>

      <div className="mt-7 flex justify-end gap-3">

        <button
          onClick={() => setConfirmEditService(null)}
          className="
            px-5
            py-2.5
            rounded-lg
            border
            border-slate-300
            text-slate-700
            hover:bg-slate-50
            transition
          "
        >
          Cancel
        </button>

        <button
          onClick={confirmEdit}
          className="
            px-5
            py-2.5
            rounded-lg
            bg-teal-600
            text-white
            font-semibold
            hover:bg-teal-700
            transition
          "
        >
          Yes, Edit
        </button>

      </div>

    </motion.div>

  </div>
)} 

{/* DELETE CONFIRMATION MODAL */}
{confirmDeleteService && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="
        bg-white
        rounded-2xl
        shadow-2xl
        w-full
        max-w-md
        p-6
      "
    >

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
        Delete Service
      </h2>

      <p className="mt-3 text-slate-600 leading-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-900">
          {confirmDeleteService.title}
        </span>
        ?
      </p>

      <p className="mt-2 text-sm text-red-500">
        This action cannot be undone.
      </p>

      <div className="mt-7 flex justify-end gap-3">

        <button
          onClick={() => setConfirmDeleteService(null)}
          className="
            px-5
            py-2.5
            rounded-lg
            border
            border-slate-300
            text-slate-700
            hover:bg-slate-50
            transition
          "
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="
            px-5
            py-2.5
            rounded-lg
            bg-red-600
            text-white
            font-semibold
            hover:bg-red-700
            transition
          "
        >
          Yes, Delete
        </button>

      </div>

    </motion.div>

  </div>
)}
      </div>
    </div>
  );
};

export default AdminServices;
