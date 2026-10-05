import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  Search,
  Filter,
} from "lucide-react";
import { db } from "../../firebase/firebase";
import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import AppointmentsTable from "./AppointmentsTable";

const normalizeStatus = (rawStatus) => {
  const s = String(rawStatus || "pending").toLowerCase().trim();
  if (s === "confirmed") return "confirmed";
  if (s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "pending";
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ---------------- Firebase Real Time Fetch ---------------- */
  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "appointments"),
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => {
          const raw = docSnap.data();
          return {
            id: docSnap.id,
            ...raw,
            status: normalizeStatus(raw.status),
          };
        });

        // Sort newest first
        data.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });

        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ---------------- Filter & Search ---------------- */
  const filteredAppointments = useMemo(() => {
    const search = query.toLowerCase().trim();

    return appointments.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && normalizeStatus(item.status) !== statusFilter) {
        return false;
      }

      // Search query
      if (search) {
        const matchesSearch =
          item.name?.toLowerCase().includes(search) ||
          item.phone?.toLowerCase().includes(search) ||
          item.service?.toLowerCase().includes(search) ||
          item.condition?.toLowerCase().includes(search) ||
          item.doctor?.toLowerCase().includes(search) ||
          item.date?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [appointments, query, statusFilter]);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, itemsPerPage]);

  // Paginated items
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  // Summary counts in real-time matching AdminDashboard logic
  const pendingCount = appointments.filter((a) => normalizeStatus(a.status) === "pending").length;
  const confirmedCount = appointments.filter((a) => normalizeStatus(a.status) === "confirmed").length;
  const completedCount = appointments.filter((a) => normalizeStatus(a.status) === "completed").length;
  const cancelledCount = appointments.filter((a) => normalizeStatus(a.status) === "cancelled").length;

  return (
    <div className="space-y-6">
      {/* Page Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Patient Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time clinic bookings, scheduling, and patient records
          </p>
        </div>

        {/* Quick KPI Badges in Real-Time */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-2xs">
            <span className="text-slate-600 font-medium">Total: </span>
            <strong className="text-slate-900 font-bold">{appointments.length}</strong>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-amber-50/60 border border-amber-300 text-xs shadow-2xs">
            <span className="text-amber-800 font-medium">Pending: </span>
            <strong className="text-amber-950 font-bold">{pendingCount}</strong>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-emerald-50/60 border border-emerald-300 text-xs shadow-2xs">
            <span className="text-emerald-800 font-medium">Confirmed: </span>
            <strong className="text-emerald-950 font-bold">{confirmedCount}</strong>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-blue-50/60 border border-blue-300 text-xs shadow-2xs">
            <span className="text-blue-800 font-medium">Completed: </span>
            <strong className="text-blue-950 font-bold">{completedCount}</strong>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-rose-50/60 border border-rose-300 text-xs shadow-2xs">
            <span className="text-rose-800 font-medium">Cancelled: </span>
            <strong className="text-rose-950 font-bold">{cancelledCount}</strong>
          </div>
        </div>
      </div>

      {/* Modern Search & Status Filter Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, phone, doctor, condition, or date..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 pl-1">
            <Filter size={12} /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({appointments.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("confirmed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "confirmed"
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
          >
            Confirmed ({confirmedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100"
            }`}
          >
            Completed ({completedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("cancelled")}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              statusFilter === "cancelled"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100"
            }`}
          >
            Cancelled ({cancelledCount})
          </button>
        </div>
      </div>

      {/* Main Table & Mobile Cards Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <AppointmentsTable appointments={paginatedAppointments} loading={loading} />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAppointments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
};

export default Appointments;
