import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable, responsive pagination component for Admin tables and lists.
 * Perfectly styled for mobile (320px, 375px, 425px) and desktop.
 */
const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis for desktop
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200/80 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">
      {/* Left: Info & items per page */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto">
        <span className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{startItem}</span> to{" "}
          <span className="font-bold text-slate-800">{endItem}</span> of{" "}
          <span className="font-bold text-slate-800">{totalItems}</span> results
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-slate-400 hidden xs:inline">•</span>
            <span className="text-slate-500 text-xs">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-40 disabled:pointer-events-none transition text-xs shadow-2xs"
          title="Previous page"
        >
          <ChevronLeft size={15} />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Mobile Page indicator (for 320px - 425px) */}
        <div className="sm:hidden px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
          Page {currentPage} of {totalPages}
        </div>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-400 font-bold select-none">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  currentPage === page
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-40 disabled:pointer-events-none transition text-xs shadow-2xs"
          title="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
