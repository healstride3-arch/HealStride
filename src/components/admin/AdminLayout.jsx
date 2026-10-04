import { useState, useEffect } from "react";
import BrandName from "../common/BrandName";
import logo from "../../assets/images/logo.png";
import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import AdminNotifications from "./AdminNotifications";

import {
  Menu,
  X,
  LayoutDashboard,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  ImageIcon,
  MessageSquare,
  CircleHelp,
  UserRound,
  FileText,
  BriefcaseBusiness,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Realtime badge counts for Appointments and Notifications
  useEffect(() => {
    const unsubApp = onSnapshot(collection(db, "appointments"), (snap) => {
      const pending = snap.docs.filter(
        (d) =>
          d.data().status === "pending" ||
          (d.data().notificationRead !== true && d.data().read !== true)
      ).length;
      const unreadApp = snap.docs.filter(
        (d) => d.data().notificationRead !== true && d.data().read !== true
      ).length;
      setPendingAppointmentsCount(pending);
      setUnreadNotificationsCount(unreadApp);
    });

    return () => unsubApp();
  }, []);

  // Professional clinic sidebar navigation grouped logically
  const navigationGroups = [
    {
      group: "MAIN OVERVIEW",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/admin",
          exact: true,
        },
        {
          name: "Appointments",
          icon: CalendarDays,
          path: "/admin/appointments",
          badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null,
          badgeColor: "bg-teal-500 text-white",
        },
        {
          name: "Notifications",
          icon: Bell,
          path: "/admin/notifications",
          badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null,
          badgeColor: "bg-rose-500 text-white",
        },
      ],
    },
    {
      group: "CLINIC MANAGEMENT",
      items: [
        {
          name: "Doctor Profile",
          icon: UserRound,
          path: "/admin/doctor-profile",
        },
        {
          name: "Services & Treatments",
          icon: BriefcaseBusiness,
          path: "/admin/services",
        },
      ],
    },
    {
      group: "CONTENT & MARKETING",
      items: [
        {
          name: "Blogs & Articles",
          icon: FileText,
          path: "/admin/blogs",
        },
        {
          name: "FAQ Management",
          icon: CircleHelp,
          path: "/admin/faq",
        },
        {
          name: "Patient Reviews",
          icon: MessageSquare,
          path: "/admin/testimonials",
        },
        {
          name: "Clinic Gallery",
          icon: ImageIcon,
          path: "/admin/gallery",
        },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        {
          name: "Settings",
          icon: Settings,
          path: "/admin/settings",
        },
      ],
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/adminlogin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Find current active page title
  const getCurrentPageTitle = () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (isActive(item)) {
          return item.name;
        }
      }
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen w-full bg-slate-100/80 flex overflow-x-hidden font-sans">
      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 lg:w-72 bg-slate-950 text-white flex-col z-40 border-r border-slate-800/80 shadow-2xl">
        {/* Brand Header */}
        <div className="p-5 lg:p-6 border-b border-slate-800/70">
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Heal Stride Logo"
              className="w-10 h-10 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 drop-shadow"
            />
            <div>
              <BrandName variant="dark" size="sm" showSubtitle={false} />
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest">
                  Admin Workspace
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation links with logical groups and hidden ugly scrollbars */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navigationGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 select-none">
                {group.group}
              </p>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      active
                        ? "bg-teal-600 text-white shadow-md shadow-teal-950/60 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={17}
                        className={`shrink-0 transition-transform duration-150 ${
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-teal-400 group-hover:scale-110"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                          active ? "bg-white text-teal-900" : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-black text-xs shrink-0">
              HS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">healstride.in</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Logout from Admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ===================== MOBILE DRAWER (320px - 768px) ===================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="relative w-[85vw] max-w-[290px] xs:max-w-[320px] bg-slate-950 text-white flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-extrabold text-sm text-white">HealStride Admin</span>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4 [scrollbar-width:none]">
              {navigationGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <p className="px-2 text-[10px] font-black uppercase text-slate-500 mb-1">
                    {group.group}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          navigate(item.path);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          active
                            ? "bg-teal-600 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon size={16} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-teal-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Logout button */}
            <div className="p-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs transition"
              >
                <LogOut size={15} />
                <span>Logout Session</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 w-full min-w-0 md:ml-64 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 py-3 transition">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Mobile hamburger + breadcrumbs */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Open menu"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Admin</span>
                  <ChevronRight size={11} />
                  <span className="text-teal-700 font-bold truncate">
                    {getCurrentPageTitle()}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {getCurrentPageTitle()}
                </h2>
              </div>
            </div>

            {/* Right: Actions, Sound, Notifications, Website link */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <AdminNotifications />

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-bold transition border border-slate-200"
              >
                <span>Live Site</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </header>

        {/* Routed Admin Content with perfect padding for 320px, 375px, 425px, desktop */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;