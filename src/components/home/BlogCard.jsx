import { useTranslation } from "react-i18next";
import { User, Calendar, ArrowRight } from "lucide-react";

const BlogCard = ({ blog, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onSelect && onSelect(blog)}
      className="group h-full flex flex-col bg-white rounded-2xl border border-teal-500 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="relative overflow-hidden h-48 sm:h-52 w-full flex-shrink-0 bg-slate-100">
        <img
          src={blog.coverImage || blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-teal-300 border border-white/10 flex items-center gap-1.5">
          <User className="w-3 h-3 text-teal-400" />
          <span>{t("blogSection.authorBadge", "HealStride Physiotherapy")}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>
            {blog.createdAt?.seconds
              ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
              : blog.date || "August 2026"}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors">
          {t(`blogsList.blog${blog.id}.title`, { defaultValue: blog.title })}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {t(`blogsList.blog${blog.id}.desc`, { defaultValue: blog.description })}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-xs sm:text-sm group-hover:text-teal-700 transition-colors">
            <span>{t("blogSection.readArticle", "Read Article")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;