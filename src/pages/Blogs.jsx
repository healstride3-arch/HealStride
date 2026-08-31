import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { blogs } from "../data/blogs";

const Blogs = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-50 py-10 sm:py-16 lg:py-20 border-b border-slate-100 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/#blogs"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-teal-600 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            {t("blogsPage.badge")}
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-slate-900 leading-tight">
            {t("blogsPage.title")}
          </h1>

          <p className="text-slate-600 text-xs sm:text-base mt-2.5 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
            {t("blogsPage.subtitle")}
          </p>
        </div>

        {/* Blogs */}
        {blogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No blogs available.
          </div>
        ) : (
          blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8 sm:mb-12"
            >
              {/* Cover Image */}
              <div className="overflow-hidden h-52 sm:h-72 md:h-80 w-full">
                <img
                  src={blog.coverImage || blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-8">
                {/* Date */}
                <p className="text-teal-600 font-semibold text-xs sm:text-sm">
                  {blog.createdAt?.seconds
                    ? new Date(
                        blog.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : blog.date || ""}
                </p>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-slate-900 leading-snug">
                  {blog.title}
                </h2>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed mt-3">
                  {blog.description}
                </p>

                {/* Blog Content */}
                <div className="mt-6 space-y-4">
                  {blog.content?.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                        {section.heading}
                      </h3>

                      <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                        {section.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Author Details */}
                <div className="mt-8 border-t border-slate-100 pt-5 text-xs sm:text-sm text-slate-700">
                  <p>
                    <span className="font-bold text-slate-900">
                      Author:
                    </span>{" "}
                    {blog.author}
                  </p>

                  <p className="mt-1">
                    <span className="font-bold text-slate-900">
                      Designation:
                    </span>{" "}
                    {blog.designation}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Blogs;
