import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  PlusIcon,
} from "lucide-react";

import {
  deleteObject,
  ref,
} from "firebase/storage";

import { db, storage } from "../../firebase/firebase";

import toast from "react-hot-toast";

import { uploadImage } from "../../utils/imageUpload";
import Pagination from "./Pagination";


const emptyForm = {
  slug: "",
  title: "",
  category: "",
  author: "",
  designation: "",
  excerpt: "",
  content: [
    {
      heading: "",
      text: "",
    },
  ],
  coverImage: "",
  imagePath: "",
  active: true,
};


const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");


const AdminBlogs = () => {


  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);


  const [viewBlog, setViewBlog] = useState(null);

  const [confirmEditBlog, setConfirmEditBlog] = useState(null);

  const [confirmDeleteBlog, setConfirmDeleteBlog] = useState(null);


  const [formData, setFormData] = useState(emptyForm);


  const [imageFile, setImageFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredBlogs = blogs.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.title || "").toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q) ||
      (b.author || "").toLowerCase().includes(q)
    );
  });

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, "blogs"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
      const data = snap.docs.map((item) => ({

        id: item.id,

        ...item.data()

      }));


      setBlogs(data);

        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Failed to load blogs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);





  const handleChange = (field, value) => {


    setFormData((prev) => {


      const updated = {

        ...prev,

        [field]: value

      };


      if (
        field === "title" &&
        !editingId &&
        !prev.slug
      ) {

        updated.slug = slugify(value);

      }


      return updated;


    });


  };






  const handleSectionChange = (index, field, value) => {


    const updated = [...formData.content];


    updated[index][field] = value;


    setFormData((prev) => ({

      ...prev,

      content: updated

    }));

  };






  const addSection = () => {


    setFormData((prev) => ({

      ...prev,

      content: [

        ...prev.content,

        {
          heading: "",
          text: ""
        }

      ]

    }));

  };







  const removeSection = (index) => {


    if (formData.content.length === 1)
      return;



    setFormData((prev) => ({


      ...prev,


      content: prev.content.filter(
        (_, i) => i !== index
      )


    }));


  };







  const openAdd = () => {


    setEditingId(null);

    setFormData(emptyForm);

    setImageFile(null);

    setIsModalOpen(true);


  };








  const openEdit = (blog) => {


    setEditingId(blog.id);



    setFormData({

      slug: blog.slug || "",

      title: blog.title || "",

      category: blog.category || "",

      author: blog.author || "",

      designation: blog.designation || "",

      excerpt: blog.description || "",

      content: blog.content || [],

      coverImage: blog.coverImage || "",

      imagePath: blog.imagePath || "",

      active: blog.active ?? true,


    });


    setImageFile(null);

    setIsModalOpen(true);


  };







  const handleSave = async () => {


    if (!formData.title.trim()) {

      toast.error("Blog title required");

      return;

    }



    try {


      setUploading(true);



      let imageUrl = "";

      let imagePath = formData.imagePath || "";





      if (imageFile) {


        if (imagePath) {

          try {

            await deleteObject(
              ref(storage, imagePath)
            );


          } catch (error) {

            console.error("Failed to save blog post:", error.message || error);

          }

        }



        imageUrl = await uploadImage(
          imageFile,
          "blogs"
        );


        imagePath = "";



      } else if (formData.coverImage) {


        imageUrl = formData.coverImage;



      } else {


        imageUrl =
          "https://placehold.co/1200x700?text=HealStride+Blog";


      }





      const payload = {


        title: formData.title,


        slug: slugify(formData.slug),


        category: formData.category,


        author: formData.author,


        designation: formData.designation,


        description: formData.excerpt,


        content:
          formData.content.filter(
            item =>
              item.heading.trim() ||
              item.text.trim()
          ),



        coverImage: imageUrl,


        imagePath,


        active: formData.active,


      };





      if (editingId) {


        await updateDoc(
          doc(db, "blogs", editingId),
          payload
        );


      } else {


        await addDoc(
          collection(db, "blogs"),
          {

            ...payload,

            createdAt: serverTimestamp()

          }

        );


      }






      toast.success(
        editingId
          ?
          "Blog updated successfully"
          :
          "Blog created successfully"
      );



      setIsModalOpen(false);

      setEditingId(null);

      setImageFile(null);

      setFormData(emptyForm);


    } catch (error) {


      console.error(error);

      toast.error(error.message);



    } finally {


      setUploading(false);


    }



  };







  const handleDelete = async (blog) => {


    try {


      await deleteDoc(
        doc(db, "blogs", blog.id)
      );


      setConfirmDeleteBlog(null);

      toast.success(
        "Blog deleted successfully"
      );



    } catch (error) {


      console.error(error);


      toast.error(
        "Delete failed"
      );


    }


  };




  if (loading) {


    return (

      <div className="
      flex
      justify-center
      items-center
      py-24
      ">

        Loading...

      </div>

    );

  }






  return (

    <div
      className="
      flex-1
      min-w-0
      p-4
      sm:p-6
      lg:p-8
      "
    >


      {/* Header */}

      <div
        className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        "
      >


        <div>


          <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
          ">

            Blog Management

          </h1>


          <p className="
          text-slate-500
          mt-1
          ">

            Create, edit and publish physiotherapy blogs.

          </p>


        </div>





        <button
          onClick={openAdd}
          className="
    flex
    items-center
    justify-center
    gap-2
    bg-teal-600
    hover:bg-teal-700
    text-white
    px-4
    sm:px-5
    py-2.5
    sm:py-3
    rounded-xl
    font-medium
    w-full
    sm:w-fit
    text-sm
    sm:text-base
    transition
    duration-200
    whitespace-nowrap
  "
        >
         + Add Blog
        </button>



      </div>

      {/* Search */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow
        border
        p-4
        sm:p-5
        mt-6
        mb-5
        "
      >

        <div className="relative">

          <Search
            size={18}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search blogs by title, category, author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="
            w-full
            border
            rounded-xl
            py-3
            pl-11
            pr-4
            outline-none
            focus:ring-2
            focus:ring-teal-500
            "
          />

        </div>

      </div>





      {/* Blogs */}

      {
        blogs.length === 0 ? (

          <div
            className="
            bg-white
            rounded-2xl
            shadow
            border
            py-20
            px-6
            text-center
            "
          >


            <div
              className="
              w-20
              h-20
              rounded-full
              bg-teal-100
              mx-auto
              flex
              items-center
              justify-center
              "
            >

              <FileText
                size={36}
                className="text-teal-600"
              />

            </div>



            <h2
              className="
              text-xl
              sm:text-2xl
              font-semibold
              mt-6
              "
            >

              No Blogs Yet

            </h2>


            <p
              className="
              text-slate-500
              mt-3
              max-w-lg
              mx-auto
              "
            >

              Create informative physiotherapy articles
              to educate patients.

            </p>



            <button

              onClick={openAdd}

              className="
              mt-8
              bg-teal-600
              hover:bg-teal-700
              text-white
              px-6
              py-3
              rounded-xl
              "
            >

              Create First Blog

            </button>


          </div>



        ) : (


          <>


            {/* ================= MOBILE CARD VIEW ================= */}


            <div
              className="
            md:hidden
            space-y-4
            "
            >


              {
                paginatedBlogs.map((blog) => (


                  <div
                    key={blog.id}
                    className="
                bg-white
                rounded-xl
                shadow
                border
                p-4
                "
                  >


                    <img

                      src={blog.coverImage}

                      alt={blog.title}

                      className="
                  w-full
                  h-40
                  object-cover
                  rounded-lg
                  "

                    />



                    <h3
                      className="
                  font-bold
                  text-lg
                  mt-3
                  text-slate-800
                  "
                    >

                      {blog.title}

                    </h3>




                    <p
                      className="
                  text-sm
                  text-slate-500
                  mt-1
                  "
                    >

                      {blog.category || "-"}

                    </p>




                    <p className="text-sm mt-2">

                      <span className="font-medium">
                        Author:
                      </span>{" "}

                      {blog.author || "-"}

                    </p>





                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${blog.active
                        ?
                        "bg-green-100 text-green-700"
                        :
                        "bg-red-100 text-red-700"
                        }`}
                    >

                      {
                        blog.active
                          ?
                          "Published"
                          :
                          "Draft"
                      }

                    </span>






                    <div
                      className="
                  flex
                  gap-3
                  mt-4
                  "
                    >



                      <button

                        onClick={() =>
                          setViewBlog(blog)
                        }

                        className="
                    p-2
                    bg-green-100
                    text-green-700
                    rounded-lg
                    "
                      >

                        <Eye size={18} />

                      </button>





                      <button

                        onClick={() =>
                          setConfirmEditBlog(blog)
                        }

                        className="
                    p-2
                    bg-blue-100
                    text-blue-700
                    rounded-lg
                    "
                      >

                        <Pencil size={18} />

                      </button>





                      <button

                        onClick={() =>
                          setConfirmDeleteBlog(blog)
                        }

                        className="
                    p-2
                    bg-red-100
                    text-red-700
                    rounded-lg
                    "
                      >

                        <Trash2 size={18} />

                      </button>



                    </div>


                  </div>


                ))
              }


            </div>








            {/* ================= TABLET + DESKTOP ================= */}


            <div
              className="
            hidden
            md:block
            bg-white
            rounded-2xl
            shadow
            border
            overflow-hidden
            w-full
            "
            >


              <div className="overflow-x-auto">


                <table
                  className="
                w-full
                min-w-[850px]
                text-sm
                "
                >



                  <thead
                    className="
                  bg-slate-100
                  "
                  >


                    <tr>


                      <th className="p-4 text-left">
                        Cover
                      </th>


                      <th className="p-4 text-left">
                        Title
                      </th>


                      <th className="p-4 text-left">
                        Category
                      </th>


                      <th className="p-4 text-left">
                        Author
                      </th>


                      <th className="p-4 text-left">
                        Created
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


                    {
                      paginatedBlogs.map((blog) => (


                        <tr

                          key={blog.id}

                          className="
                      border-t
                      hover:bg-slate-50
                      transition
                      "
                        >



                          <td className="p-4">


                            <img

                              src={blog.coverImage}

                              alt={blog.title}

                              className="
                          w-20
                          h-14
                          object-cover
                          rounded-lg
                          border
                          "

                            />


                          </td>





                          <td className="p-4">


                            <div
                              className="
                          font-semibold
                          text-slate-800
                          "
                            >

                              {blog.title}

                            </div>



                            <div
                              className="
                          text-xs
                          text-slate-500
                          mt-1
                          "
                            >

                              {blog.slug}

                            </div>


                          </td>





                          <td className="p-4">

                            {blog.category || "-"}

                          </td>





                          <td className="p-4">


                            <div>

                              {blog.author || "-"}

                            </div>



                            <div
                              className="
                          text-xs
                          text-slate-500
                          "
                            >

                              {blog.designation}

                            </div>


                          </td>






                          <td className="p-4">


                            {
                              blog.createdAt?.seconds

                                ?

                                new Date(
                                  blog.createdAt.seconds * 1000
                                )
                                  .toLocaleDateString()

                                :

                                "-"
                            }


                          </td>







                          <td className="p-4">


                            <span

                              className={`px-3 py-1 rounded-full text-xs font-medium ${blog.active
                                ?
                                "bg-green-100 text-green-700"
                                :
                                "bg-red-100 text-red-700"
                                }`}

                            >

                              {
                                blog.active
                                  ?
                                  "Published"
                                  :
                                  "Draft"
                              }


                            </span>


                          </td>








                          <td className="p-4">


                            <div
                              className="
                          flex
                          justify-center
                          gap-2
                          "
                            >



                              <button

                                onClick={() =>
                                  setViewBlog(blog)
                                }

                                className="
                            p-2
                            bg-green-100
                            text-green-700
                            rounded-lg
                            "
                              >

                                <Eye size={18} />

                              </button>






                              <button

                                onClick={() =>
                                  setConfirmEditBlog(blog)
                                }

                                className="
                            p-2
                            bg-blue-100
                            text-blue-700
                            rounded-lg
                            "
                              >

                                <Pencil size={18} />

                              </button>






                              <button

                                onClick={() =>
                                  setConfirmDeleteBlog(blog)
                                }

                                className="
                            p-2
                            bg-red-100
                            text-red-700
                            rounded-lg
                            "
                              >

                                <Trash2 size={18} />

                              </button>



                            </div>


                          </td>






                        </tr>



                      ))
                    }



                  </tbody>



                </table>



              </div>

              {/* Pagination */}
              <div className="bg-white rounded-2xl shadow border p-2 mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredBlogs.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  pageSizeOptions={[4, 8, 12, 24]}
                />
              </div>

            </div>

          </>


        )
      }



      {
        isModalOpen && (

          <div
            className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      p-4
      "
          >


            <div
              className="
        bg-white
        rounded-2xl
        w-full
        max-w-5xl
        max-h-[95vh]
        overflow-y-auto
        p-4
        sm:p-6
        lg:p-8
        relative
        "
            >


              <button

                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                  setFormData(emptyForm);
                  setImageFile(null);
                }}

                className="
          absolute
          right-4
          top-4
          w-9
          h-9
          rounded-full
          hover:bg-slate-100
          "
              >

                ✕

              </button>





              <h2
                className="
          text-2xl
          font-bold
          mb-6
          "
              >

                {
                  editingId
                    ?
                    "Edit Blog"
                    :
                    "Add Blog"
                }

              </h2>





              <div
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
          "
              >





                {/* Cover Image */}

                <div className="sm:col-span-2">


                  <label className="
            block
            font-medium
            mb-2
            ">

                    Cover Image

                  </label>



                  <input

                    type="file"

                    accept="image/*"

                    onChange={(e) =>
                      setImageFile(
                        e.target.files?.[0] || null
                      )
                    }

                    className="
              w-full
              border
              rounded-lg
              p-2
              "

                  />




                  <p className="
            text-center
            text-sm
            text-gray-500
            my-3
            ">

                    OR

                  </p>




                  <input

                    type="url"

                    placeholder="
              https://example.com/blog-image.jpg
              "

                    value={formData.coverImage}

                    onChange={(e) =>
                      handleChange(
                        "coverImage",
                        e.target.value
                      )
                    }

                    className="
              w-full
              border
              rounded-lg
              p-3
              "

                  />




                  {
                    (imageFile || formData.coverImage) &&

                    <img

                      src={
                        imageFile
                          ?
                          URL.createObjectURL(imageFile)
                          :
                          formData.coverImage
                      }

                      className="
                mt-4
                w-full
                max-w-lg
                mx-auto
                h-56
                object-cover
                rounded-xl
                "
                    />

                  }



                </div>





                <input

                  placeholder="Blog Title"

                  value={formData.title}

                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }

                  className="
            border
            rounded-lg
            p-3
            "

                />






                <input

                  placeholder="blog-slug"

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







                <input

                  placeholder="Category"

                  value={formData.category}

                  onChange={(e) =>
                    handleChange(
                      "category",
                      e.target.value
                    )
                  }

                  className="
            border
            rounded-lg
            p-3
            "

                />






                <input

                  placeholder="Author Name"

                  value={formData.author}

                  onChange={(e) =>
                    handleChange(
                      "author",
                      e.target.value
                    )
                  }

                  className="
            border
            rounded-lg
            p-3
            "

                />








                <input

                  placeholder="Author Designation"

                  value={formData.designation}

                  onChange={(e) =>
                    handleChange(
                      "designation",
                      e.target.value
                    )
                  }

                  className="
            border
            rounded-lg
            p-3
            sm:col-span-2
            "

                />







                <textarea

                  rows="3"

                  placeholder="Short Description"

                  value={formData.excerpt}

                  onChange={(e) =>
                    handleChange(
                      "excerpt",
                      e.target.value
                    )
                  }

                  className="
            border
            rounded-lg
            p-3
            sm:col-span-2
            "

                />








                {/* Sections */}

                <div className="sm:col-span-2">


                  <label className="
            font-medium
            block
            mb-3
            ">

                    Blog Sections

                  </label>




                  {
                    formData.content.map(
                      (section, index) => (


                        <div

                          key={index}

                          className="
                  border
                  rounded-lg
                  p-4
                  mb-4
                  bg-gray-50
                  "

                        >



                          <input

                            placeholder="Section Heading"

                            value={section.heading}

                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "heading",
                                e.target.value
                              )
                            }

                            className="
                    w-full
                    border
                    rounded-lg
                    p-3
                    mb-3
                    "

                          />





                          <textarea

                            rows="5"

                            placeholder="Section Content"

                            value={section.text}

                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "text",
                                e.target.value
                              )
                            }

                            className="
                    w-full
                    border
                    rounded-lg
                    p-3
                    "

                          />






                          <button

                            onClick={() =>
                              removeSection(index)
                            }

                            className="
                    mt-3
                    text-red-600
                    "

                          >

                            Remove Section

                          </button>



                        </div>


                      ))
                  }




                  <button

                    onClick={addSection}

                    className="
              bg-teal-600
              text-white
              px-4
              py-2
              rounded-lg
              "

                  >

                    + Add Section

                  </button>



                </div>








                <label
                  className="
            flex
            items-center
            gap-3
            sm:col-span-2
            "
                >

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


                  Publish this blog on website


                </label>





              </div>






              <div
                className="
          flex
          justify-end
          gap-3
          mt-8
          "
              >


                <button

                  onClick={() =>
                    setIsModalOpen(false)
                  }

                  className="
            px-5
            py-3
            border
            rounded-lg
            "

                >

                  Cancel

                </button>





                <button

                  disabled={uploading}

                  onClick={handleSave}

                  className="
            bg-teal-600
            text-white
            px-5
            py-3
            rounded-lg
            "

                >

                  {
                    uploading
                      ?
                      "Saving..."
                      :
                      editingId
                        ?
                        "Update Blog"
                        :
                        "Save Blog"
                  }

                </button>


              </div>



            </div>


          </div>


        )
      }


      {
        confirmEditBlog && (

          <div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


            <div className="
bg-white
rounded-xl
p-6
w-full
max-w-md
">


              <h2 className="
text-xl
font-bold
">

                Confirm Edit

              </h2>



              <p className="
mt-3
text-gray-600
">

                Do you want to edit this blog?

              </p>




              <div className="
flex
justify-end
gap-3
mt-6
">


                <button

                  onClick={() =>
                    setConfirmEditBlog(null)
                  }

                  className="
border
px-4
py-2
rounded-lg
"

                >

                  No

                </button>



                <button

                  onClick={() => {
                    openEdit(confirmEditBlog);
                    setConfirmEditBlog(null);
                  }}

                  className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
"

                >

                  Yes

                </button>


              </div>


            </div>


          </div>

        )
      }



      {
        confirmDeleteBlog && (

          <div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">


            <div className="
bg-white
rounded-xl
p-6
w-full
max-w-md
">


              <h2 className="
text-xl
font-bold
text-red-600
">

                Delete Blog

              </h2>


              <p className="mt-3">

                Are you sure you want to delete
                <b>
                  {" "}
                  {confirmDeleteBlog.title}
                </b>

              </p>




              <div className="
flex
justify-end
gap-3
mt-6
">


                <button

                  onClick={() =>
                    setConfirmDeleteBlog(null)
                  }

                  className="
border
px-4
py-2
rounded-lg
"

                >

                  Cancel

                </button>



                <button

                  onClick={() =>
                    handleDelete(confirmDeleteBlog)
                  }

                  className="
bg-red-600
text-white
px-4
py-2
rounded-lg
"

                >

                  Delete

                </button>



              </div>



            </div>


          </div>

        )
      }


      {
        viewBlog && (

          <div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
p-4
">


            <div className="
bg-white
rounded-2xl
w-full
max-w-3xl
max-h-[90vh]
overflow-y-auto
p-6
">


              <div className="
flex
justify-between
items-center
mb-5
">


                <h2 className="
text-2xl
font-bold
">

                  Blog Details

                </h2>


                <button

                  onClick={() =>
                    setViewBlog(null)
                  }

                >

                  ✕

                </button>


              </div>





              <img

                src={viewBlog.coverImage}

                className="
w-full
h-64
object-cover
rounded-xl
"

              />





              <h1 className="
text-3xl
font-bold
mt-5
">

                {viewBlog.title}

              </h1>





              <p className="mt-3">

                {viewBlog.description}

              </p>





              {
                viewBlog.content?.map(
                  (section, index) => (

                    <div key={index}
                      className="mt-5"
                    >

                      <h3 className="
font-bold
text-lg
">

                        {section.heading}

                      </h3>


                      <p>

                        {section.text}

                      </p>


                    </div>

                  )
                )
              }




              <button

                onClick={() =>
                  setViewBlog(null)
                }

                className="
mt-6
bg-teal-600
text-white
px-6
py-2
rounded-lg
"

              >

                Close

              </button>



            </div>


          </div>

        )
      }



    </div>

  );

};


export default AdminBlogs;
