import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";
import SectionHeader from "../common/SectionHeader";
import { blogs as staticBlogs } from "../../data/blogs";
import { ArrowRight } from "lucide-react";

const BlogSection = ({
  blogsToShow = [],
}) => {
  const { t } = useTranslation();
  const blogs = blogsToShow.length > 0 ? blogsToShow : staticBlogs;

  return (
    <section
      id="blogs"
      className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 overflow-hidden"
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
          {blogs.slice(0, 6).map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button: Explore More Blogs */}
        <div className="flex justify-center items-center mt-8 sm:mt-12">
          <Link
            to="/blogs"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-[0.98] text-white px-7 sm:px-8 py-3.5 min-h-[46px] rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <span>{t("blogSection.exploreMore", "Explore More")}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
