import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  CalendarCheck,
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Phone,
} from "lucide-react";
import drRashidImg from "../assets/images/Dr.MD.Rashid.png";
import { blogs as staticBlogs } from "../data/blogs";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";
import SEO from "../components/common/SEO";
import BlogCard from "../components/home/BlogCard";

const BlogDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { items: firestoreBlogs } = useFirestoreCollection("blogs", {
    constraints: [where("active", "!=", false)],
    fallback: staticBlogs,
  });

  const blogs = useMemo(() => {
    const hasClinicalBlogs = firestoreBlogs.some(
      (b) => b.slug === "neck-stiffness-karan-aur-exercise-se-rahat" || (b.title && b.title.includes("Neck Stiffness"))
    );
    return hasClinicalBlogs ? firestoreBlogs : staticBlogs;
  }, [firestoreBlogs]);

  const blog = useMemo(() => {
    return (
      blogs.find((item) => String(item.id) === String(id) || item.slug === id) ||
      staticBlogs.find((item) => String(item.id) === String(id) || item.slug === id)
    );
  }, [blogs, id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          {t("blogDetails.notFound", "Article Not Found")}
        </h1>
        <p className="text-slate-600 mb-6 text-sm">
          The article you are looking for may have been moved or updated.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md"
        >
          <ArrowLeft size={16} />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  // Related blogs (excluding current)
  const relatedBlogs = blogs
    .filter((b) => String(b.id) !== String(blog.id) && b.slug !== blog.slug)
    .slice(0, 3);

  return (
    <article className="bg-slate-50/60 min-h-screen pt-3 sm:pt-5 pb-12 sm:pb-16">
      <SEO
        title={`${blog.title} | Heal Stride Physiotherapy Bhopal`}
        description={blog.description?.slice(0, 160)}
        keywords={`${blog.category || "Physiotherapy"}, Bhopal Physiotherapist, Dr MD Rashid, Pain Relief, ${blog.title}`}
      />

      <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Navigation Breadcrumb - Compact & Grouped */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#008272] font-semibold text-xs sm:text-sm transition-colors py-1.5 px-3 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>{t("blogDetails.back", "Back to Blogs")}</span>
          </Link>

          {blog.category && (
            <>
              <span className="text-slate-300 text-sm">/</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008272] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                <Tag size={11} />
                <span>{blog.category}</span>
              </span>
            </>
          )}
        </div>

        {/* 2-Column Responsive Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Main Article Content (Col 8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-sm">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            {/* Metadata Strip */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 mt-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-teal-500 shadow-xs">
                  <img
                    src={drRashidImg}
                    alt="Dr. MD Rashid"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight text-xs sm:text-sm">
                    {blog.author || "Dr. MD Rashid (PT)"}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-teal-600 font-medium">
                    {blog.designation || "Senior Physiotherapist"}
                  </span>
                </div>
              </div>

              <span className="text-slate-300 hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#008272]" />
                <span className="text-xs">
                  {blog.createdAt?.seconds
                    ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
                    : blog.date || "July 2026"}
                </span>
              </div>

              <span className="text-slate-300 hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#d71920]" />
                <span className="text-xs">5 min read</span>
              </div>
            </div>

            {/* Hero Featured Image */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mt-6 shadow-sm border border-slate-200/80 w-full">
              <img
                src={blog.coverImage || blog.image}
                alt={blog.title}
                className="w-full h-auto max-h-[580px] object-cover object-center block"
              />
            </div>

            {/* Lead Excerpt */}
            {blog.description && (
              <div className="mt-8 p-5 sm:p-6 bg-teal-50/70 border-l-4 border-[#008272] rounded-r-2xl">
                <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Main Article Sections */}
            <div className="mt-10 space-y-10 sm:space-y-12">
              {blog.content?.map((section, index) => (
                <div key={index} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 pt-3 leading-snug">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs && section.paragraphs.length > 0 ? (
                    section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-8"
                      >
                        {para}
                      </p>
                    ))
                  ) : section.text ? (
                    <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-8">
                      {section.text}
                    </p>
                  ) : null}

                  {section.points && section.points.length > 0 && (
                    <ul className="space-y-3 my-4 bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
                      {section.points.map((point, ptIdx) => (
                        <li
                          key={ptIdx}
                          className="flex items-start gap-3 text-slate-800 text-xs sm:text-sm md:text-base leading-relaxed"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#008272] shrink-0 mt-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Author Bio Box */}
            <div className="mt-12 sm:mt-14 bg-slate-50/90 rounded-3xl border border-teal-200/80 p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-teal-50 border-2 border-teal-500 overflow-hidden shrink-0 shadow-md">
                  <img
                    src={drRashidImg}
                    alt="Dr. MD Rashid (PT)"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1">
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2.5 py-1 rounded-full border border-teal-200">
                      Medical Author &amp; Clinician
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
                    Dr. MD Rashid (PT)
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-700 font-semibold mt-0.5">
                    Senior Consultant Physiotherapist | MPT (Sports)
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    Lead Physiotherapist at Heal Stride Physiotherapy &amp; Wellness Centre Bhopal, specializing in sports injury rehabilitation, spine adjustments, cupping therapy, dry needling, and non-surgical pain management with 5+ years of clinical excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Right Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Consultation Card */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-teal-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
                क्लीनिकल परामर्श
              </span>
              <h3 className="text-xl font-black text-white leading-tight">
                दर्द से तुरंत राहत पाएं
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                हील्सट्राइड फिजियोथेरेपी क्लिनिक, भोपाल में डॉ. मोहम्मद रशीद (PT) से परामर्श लें या अपने घर पर ही होम फिजियोथेरेपी बुक करें।
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  to="/booking"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-[#008272] hover:from-teal-400 hover:to-teal-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CalendarCheck size={16} />
                  <span>क्लिनिक विजिट बुक करें</span>
                </Link>

                <a
                  href="tel:09630224488"
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={15} className="text-teal-400" />
                  <span>कॉल करें: +91 96302 24488</span>
                </a>
              </div>

              {/* Clinic Timings */}
              <div className="mt-5 pt-5 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                <span>सोम - शनि (Mon - Sat):</span>
                <span className="font-semibold text-teal-300">10:00 AM - 08:30 PM</span>
              </div>
            </div>

            {/* Clinic Highlights */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#008272]" />
                <span>Heal Stride क्लिनिक की विशेषताएं</span>
              </h4>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#008272] font-bold">✓</span>
                  <span>100% सर्टिफाइड एवं अनुभवी फिजियोथेरेपिस्ट</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#008272] font-bold">✓</span>
                  <span>एडवांस्ड लेज़र एवं यूएसटी (Ultrasound) थेरेपी</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#008272] font-bold">✓</span>
                  <span>घर बैठे होम फिजियोथेरेपी विजिट सुविधा</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#008272] font-bold">✓</span>
                  <span>जीरो वेटिंग टाइम (Zero Waiting Time)</span>
                </li>
              </ul>
            </div>

            {/* Trending / More Articles in Sidebar */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  अन्य प्रमुख स्वास्थ्य लेख
                </h4>
                <div className="space-y-4">
                  {relatedBlogs.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blogs/${item.slug || item.id}`}
                      className="group flex gap-3 items-center"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <img
                          src={item.coverImage || item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#008272] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {item.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Appointment CTA Banner (Full Width) */}
        <div className="mt-14 sm:mt-16 bg-gradient-to-r from-[#d71920] to-[#008272] rounded-3xl p-6 sm:p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Need Expert Physiotherapy or Pain Relief?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-teal-50 max-w-2xl mx-auto leading-relaxed">
            Consult Dr. MD Rashid and certified physiotherapists at Heal Stride Bhopal for personalized assessment and evidence-based rehabilitation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-white text-[#008272] hover:text-[#d71920] font-bold px-6 py-3 min-h-[44px] rounded-xl text-xs sm:text-sm hover:bg-slate-50 shadow-md transition-all cursor-pointer"
            >
              <CalendarCheck size={16} />
              <span>Book In-Clinic Appointment</span>
            </Link>
            <a
              href="tel:09630224488"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 min-h-[44px] rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Phone size={15} className="text-emerald-400" />
              <span>Call: +91 96302 24488</span>
            </a>
          </div>
        </div>

        {/* Related Blogs Full-Width Grid */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#008272]">
                  Recommended Reading
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  More Clinical Articles
                </h3>
              </div>
              <Link
                to="/blogs"
                className="px-5 py-2.5 rounded-xl bg-teal-50 hover:bg-[#008272] text-[#008272] hover:text-white border border-teal-200 hover:border-[#008272] font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs cursor-pointer inline-flex items-center justify-center"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogDetails;
