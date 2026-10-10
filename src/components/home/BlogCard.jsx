import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Calendar, ArrowRight } from "lucide-react";

const BlogCard = ({ blog }) => {
  const { t } = useTranslation();
  const blogUrl = `/blogs/${blog.slug || blog.id}`;

  return (
    <Link
      to={blogUrl}
      className="group h-full flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-teal-500 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      <div className="relative overflow-hidden h-52 sm:h-56 w-full shrink-0 bg-slate-100 flex items-center justify-center">
        <img
          src={blog.coverImage || blog.image}
          alt={blog.title}
          className="w-full h-full object-cover object-center block group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 xs:top-3 left-2.5 xs:left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] xs:text-[11px] font-medium text-teal-300 border border-white/10 flex items-center gap-1.5 shadow-sm max-w-[55%] truncate">
          <User className="w-3 h-3 text-teal-400 shrink-0" />
          <span className="truncate">{blog.author || t("blogSection.authorBadge", "Dr. MD Rashid (PT)")}</span>
        </div>

        {blog.category && (
          <div className="absolute top-2.5 xs:top-3 right-2.5 xs:right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9.5px] xs:text-[10px] font-bold text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1 max-w-[40%] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d71920] shrink-0" />
            <span className="truncate">{blog.category}</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#008272]" />
          <span>
            {blog.createdAt?.seconds
              ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
              : blog.date || "July 2026"}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#008272] transition-colors">
          {blog.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {blog.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-[#008272] font-bold text-xs sm:text-sm group-hover:text-[#d71920] transition-colors">
            <span>{t("blogSection.readArticle", "Read More")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {blog.readTime || "6 min read"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;