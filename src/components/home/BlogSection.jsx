import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";
import BlogModal from "./BlogModal";
import SectionHeader from "../common/SectionHeader";
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
        <SectionHeader
          badge={t("blogSection.badge", "Health & Wellness")}
          title={t("blogSection.title", "Latest Physiotherapy Articles & Health Tips")}
          subtitle={t(
            "blogSection.subtitle",
            "Expert guidance, home exercise tips, and evidence-based recovery advice from our specialists."
          )}
        />

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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-[0.98] text-white px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
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
