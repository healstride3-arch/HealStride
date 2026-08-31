import { useParams, Link } from "react-router-dom";
import { blogs } from "../data/blogs";
import { useTranslation } from "react-i18next";

const BlogDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          {t("blogDetails.notFound")}
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <Link
          to="/blogs"
          className="text-teal-600 font-semibold hover:underline"
        >
          {t("blogDetails.back")}
        </Link>

        {/* Hero Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-60 xs:h-72 sm:h-[360px] lg:h-[450px] object-cover rounded-2xl mt-6 shadow-lg"
        />

        {/* Date */}
        <p className="mt-8 text-gray-500">
          {blog.date}
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-3 leading-tight">
          {blog.title}
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-5 sm:mt-6 leading-8 sm:leading-9">
          {blog.description}
        </p>

        {/* Blog Content */}
        <div className="mt-12 space-y-10">
          {blog.content.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 leading-tight">
                {section.heading}
              </h2>

              <p className="text-gray-700 text-base sm:text-lg leading-8 sm:leading-9">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        {/* Author Details */}
        <div className="mt-16 bg-white rounded-2xl border border-teal-500 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
            Written & Verified By
          </h3>

          <div className="flex flex-col xs:flex-row xs:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
              HS
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base sm:text-lg">
                HealStride Physiotherapy & Wellness Centre
              </p>
              <p className="text-xs sm:text-sm text-teal-600 font-medium">
                Clinical Physical Therapy & Rehabilitation Specialists
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-20 bg-teal-600 rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            {t("blogDetails.ctaTitle")}
          </h2>

          <p className="mt-4 text-sm sm:text-lg">
            {t("blogDetails.ctaSubtitle")}
          </p>

          <Link
            to="/booking"
            className="inline-flex justify-center w-full xs:w-auto mt-6 sm:mt-8 bg-white text-teal-600 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-gray-100 transition"
          >
            {t("blogDetails.bookBtn")}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BlogDetails;
