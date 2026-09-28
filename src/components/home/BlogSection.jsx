import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";
import BlogModal from "./BlogModal";
import { useState } from "react";
import { blogs as staticBlogs } from "../../data/blogs";
import { ChevronDown, Sparkles } from "lucide-react";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

const BlogSection = ({
  blogsToShow = [],
}) => {
  const { t } = useTranslation();

  const { items: dynamicBlogs } = useFirestoreCollection("blogs", {
    constraints: [where("active", "!=", false)],
    fallback: blogsToShow.length > 0 ? blogsToShow : staticBlogs,
  });
  const blogs = dynamicBlogs;
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  return (
    <section
      id="blogs"
      className="py-8 sm:py-12 lg:py-16 bg-slate-50 border-b border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            {t("blogSection.badge", "Health & Wellness")}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("blogSection.title", "Latest Physiotherapy Articles & Health Tips")}
          </h2>

          <p className="text-slate-600 mt-2.5 text-xs sm:text-base leading-relaxed">
            {t("blogSection.subtitle", "Expert guidance, home exercise tips, and evidence-based recovery advice from our specialists.")}
          </p>
        </motion.div>

        {/* Blog Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {blogs.slice(0, visibleCount).map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <BlogCard
                blog={blog}
                onSelect={setSelectedBlog}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {blogs.length > 6 && (
          <div className="flex justify-center items-center gap-3 mt-8 sm:mt-12">
            {visibleCount < blogs.length ? (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 cursor-pointer"
              >
                <span>{t("blogSection.loadMore", "Load More Articles")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="inline-flex items-center justify-center gap-2 bg-white border border-teal-500 text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 cursor-pointer"
              >
                <span>{t("blogSection.showLess", "Show Less")}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Interactive Blog Details Modal */}
      <BlogModal
        blog={selectedBlog}
        isOpen={Boolean(selectedBlog)}
        onClose={() => setSelectedBlog(null)}
      />
    </section>
  );
};

export default BlogSection;
