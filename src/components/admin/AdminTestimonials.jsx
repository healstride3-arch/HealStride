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
import { db } from "../../firebase/firebase";
import { uploadImage } from "../../utils/imageUpload";
import { PlusIcon } from "lucide-react";

const AdminTestimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState(null);

  const [editingId, setEditingId] = useState(null);
  const [confirmEditTestimonial, setConfirmEditTestimonial] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    rating: 5,
    image: "/default-user.png",
    active: true,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "testimonials"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTestimonials(data);
      },
      (err) => {
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.review.trim()) {
      alert("Please fill required fields (Name and Review)");
      return;
    }

    try {
      let imageUrl = formData.image;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, "testimonials");
      }

      const payload = {
        name: formData.name,
        designation: formData.designation || "",
        review: formData.review,
        rating: Number(formData.rating) || 5,
        image: imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        active: formData.active !== undefined ? formData.active : true,
        status: "approved",
      };

      if (editingId) {
        await updateDoc(doc(db, "testimonials", editingId), payload);
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
      setEditingId(null);
      setSelectedImage(null);
      setFormData({
        name: "",
        designation: "",
        review: "",
        rating: 5,
        image: "/default-user.png",
        active: true,
      });

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(
        doc(db, "testimonials", id),
        {
          active: true,
          status: "approved",
        }
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      name: item.name || "",
      designation:
        item.designation || "",
      review: item.review || "",
      rating: item.rating || 5,
      image:
        item.image ||
        "/default-user.png",
      active: item.active,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this testimonial?"
      );
    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "testimonials", id)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleView = (item) => {
    setSelectedTestimonial(item);
    setIsViewOpen(true);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Testimonials
          </h1>

          <p className="text-slate-500 mt-2">
            Manage patient reviews and
            testimonials.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);

            setFormData({
              name: "",
              designation: "",
              review: "",
              rating: 5,
              image: "/default-user.png",
              active: true,
            });

            setIsModalOpen(true);
          }}
          className="
    w-full
    md:w-fit
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
         + Add Testimonial
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Designation
                </th>

                <th className="p-4 text-left">
                  Rating
                </th>

                <th className="p-4 text-left">
                  Review
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

              {testimonials.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No testimonials found.
                  </td>
                </tr>

              ) : (

                testimonials.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-3 sm:p-4">
                      <img
                        src={
                          item.image ||
                          "/default-user.png"
                        }
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>


                    <td className="p-4 font-medium">
                      {item.name}
                    </td>


                    <td className="p-3 sm:p-4">
                      {item.designation || "-"}
                    </td>


                    <td className="p-3 sm:p-4">
                      <span className="text-yellow-500 whitespace-nowrap">
                        {"⭐".repeat(item.rating)}
                      </span>
                    </td>


                    <td className="p-4 max-w-[220px] truncate">
                      {item.review}
                    </td>


                    <td className="p-3 sm:p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >

                        {item.status || "pending"}

                      </span>

                    </td>


                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-center gap-2">

                        {
                          item.status !== "approved" && (

                            <button
                              className="h-9 w-9 rounded-lg bg-green-50 hover:bg-green-100"
                              onClick={() =>
                                handleApprove(item.id)
                              }
                              title="Approve"
                            >
                              ✅
                            </button>

                          )
                        }


                        <button

                          onClick={() =>
                            handleView(item)
                          }
                          title="View"
                          className="h-9 w-9 rounded-lg bg-blue-50 hover:bg-blue-100"
                        >
                          👁️
                        </button>


                        <button
                          title="Edit"
                          onClick={() => setConfirmEditTestimonial(item)}
                          className="h-9 w-9 rounded-lg bg-yellow-50 hover:bg-yellow-100"
                        >
                          ✏️
                        </button>


                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          title="Delete"
                          className="h-9 w-9 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          🗑️
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

      {/* Edit Confirmation */}
      {confirmEditTestimonial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h3 className="text-xl font-bold text-slate-900">
              Edit Testimonial
            </h3>

            <p className="mt-3 text-slate-600">
              Do you want to edit this testimonial?
            </p>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setConfirmEditTestimonial(null)}
                className="rounded-lg border px-5 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleEdit(confirmEditTestimonial);
                  setConfirmEditTestimonial(null);
                }}
                className="rounded-lg bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
              >
                Yes, Edit
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Add / Edit Modal */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div
            className="
  bg-white
  rounded-2xl
  p-4 sm:p-6 md:p-8
  w-[95%]
  max-w-lg
  max-h-[90vh]
  overflow-y-auto
  "
          >

            <h2 className="text-2xl font-bold mb-6">

              {editingId
                ? "Edit Testimonial"
                : "Add Testimonial"}

            </h2>


            <div className="space-y-4">


              <input
                type="text"
                placeholder="Patient Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                className="w-full border rounded-lg p-3"
              />



              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    designation: e.target.value
                  })
                }
                className="w-full border rounded-lg p-3"
              />



              <textarea
                rows="4"
                placeholder="Review"
                value={formData.review}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    review: e.target.value
                  })
                }
                className="w-full border rounded-lg p-3"
              />



              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: Number(e.target.value)
                  })
                }
                className="w-full border rounded-lg p-3"
              >

                <option value={5}>
                  Excellent ⭐⭐⭐⭐⭐
                </option>

                <option value={4}>
                  Very Good ⭐⭐⭐⭐
                </option>

                <option value={3}>
                  Good ⭐⭐⭐
                </option>

                <option value={2}>
                  Fair ⭐⭐
                </option>

                <option value={1}>
                  Poor ⭐
                </option>

              </select>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Patient Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
                {(selectedImage || (formData.image && formData.image !== "/default-user.png")) && (
                  <img
                    src={selectedImage ? URL.createObjectURL(selectedImage) : formData.image}
                    alt="Preview"
                    className="w-16 h-16 mt-3 rounded-full object-cover border"
                  />
                )}
              </div>



              <label className="flex gap-3 items-center">

                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      active: e.target.checked
                    })
                  }
                />

                Active

              </label>


            </div>



            <div className="flex justify-end gap-3 mt-8">


              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>



              <button
                onClick={handleSave}
                className="bg-teal-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>


            </div>


          </div>

        </div>

      )}



      {/* View Modal */}

      {
        isViewOpen &&
        selectedTestimonial && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


            <div
              className="
  bg-white
  rounded-xl
  p-4 sm:p-6 md:p-8
  w-[95%]
  max-w-lg
  max-h-[90vh]
  overflow-y-auto
  "
            >

              <h2 className="text-2xl font-bold mb-5">
                Testimonial Details
              </h2>


              <p>
                <b>Name:</b>{" "}
                {selectedTestimonial.name}
              </p>


              <p className="mt-2">
                <b>Designation:</b>{" "}
                {selectedTestimonial.designation}
              </p>


              <p className="mt-2">
                <b>Rating:</b>{" "}
                {"⭐".repeat(
                  selectedTestimonial.rating
                )}
              </p>


              <div className="mt-4">

                <b>Review:</b>

                <p className="bg-gray-50 p-4 rounded-lg mt-2">
                  {selectedTestimonial.review}
                </p>

              </div>



              <p className="mt-4">

                <b>Status:</b>{" "}

                {selectedTestimonial.status || "pending"}

              </p>



              <button
                onClick={() =>
                  setIsViewOpen(false)
                }
                className="mt-6 bg-teal-600 text-white px-5 py-2 rounded-lg"
              >
                Close
              </button>


            </div>

          </div>

        )}


    </div>
  );
};


export default AdminTestimonials;
