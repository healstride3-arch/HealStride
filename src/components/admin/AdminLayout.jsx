import { useState } from "react";
import BrandName from "../common/BrandName";
import logo from "../../assets/images/logo.png";
import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import AdminNotifications from "./AdminNotifications";

import {
  Menu,
  X,
  LayoutDashboard,
  CalendarDays,
  Settings,
  LogOut,
  ImageIcon,
  MessageSquare,
  CircleHelp,
  UserRound,
  FileText,
  UsersRound,
  BriefcaseBusiness,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Appointments",
      icon: <CalendarDays size={18} />,
      path: "/admin/appointments",
    },
    {
      name: "Blogs",
      icon: <FileText size={18} />,
      path: "/admin/blogs",
    },
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin",
    },
    {
      name: "Doctor Profile",
      icon: <UserRound size={18} />,
      path: "/admin/doctor-profile",
    },
    {
      name: "FAQ",
      icon: <CircleHelp size={18} />,
      path: "/admin/faq",
    },
    {
      name: "Gallery",
      icon: <ImageIcon size={18} />,
      path: "/admin/gallery",
    },
    
    {
      name: "Services",
      icon: <BriefcaseBusiness size={18} />,
      path: "/admin/services",
    },
    {
      name: "Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
    },
    { name: "Staff", 
      icon: <UsersRound size={18} />, 
      path: "/admin/staff" 
    },
    {
      name: "Testimonials",
      icon: <MessageSquare size={18} />,
      path: "/admin/testimonials",
    },
    
  ];

  const getButtonClass = (path) => {
    return `
      flex items-center gap-3
      w-full
      px-3 sm:px-4
      py-3
      rounded-xl
      text-sm sm:text-base
      transition-all duration-300
      ${
        location.pathname === path
          ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
          : "bg-slate-800 text-slate-300 hover:bg-teal-600 hover:text-white"
      }
    `;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/adminlogin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex overflow-x-hidden">

      {/* Desktop Sidebar */}
      <aside
        className="
        hidden
        md:flex
        fixed
        left-0
        top-0
        h-screen
        w-64
        lg:w-72
        bg-[#0F172A]
        text-white
        p-5
        lg:p-6
        flex-col
        z-40
        "
      >
        <Link to="/admin" className="flex items-center gap-3 mb-8 lg:mb-10 group">
          <img
            src={logo}
            alt="Heal Stride Logo"
            className="w-9 h-9 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
          <div>
            <BrandName variant="dark" size="sm" showSubtitle={false} />
            <span className="block text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-0.5">
              Admin Portal
            </span>
          </div>
        </Link>

        <nav className="space-y-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={getButtonClass(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="
          flex items-center justify-center gap-3
          w-full
          mt-6
          px-4 py-3
          rounded-xl
          bg-red-600
          hover:bg-red-700
          transition
          text-white
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">

          <aside
            className="
            w-[85vw]
            max-w-[300px]
            bg-[#0F172A]
            text-white
            p-5
            flex flex-col
            "
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-6 self-end"
            >
              <X size={26} />
            </button>

            <h1 className="text-xl font-bold mb-8">
              HealStride Admin
            </h1>

            <nav className="space-y-3 flex-1 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={getButtonClass(item.path)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={async () => {
                await handleLogout();
                setSidebarOpen(false);
              }}
              className="
              flex items-center justify-center gap-3
              w-full
              mt-6
              px-4 py-3
              rounded-xl
              bg-red-600
              hover:bg-red-700
              transition
              text-white
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </aside>

          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main
        className="
        flex-1
        w-full
        min-w-0
        md:ml-64
        lg:ml-72
        px-3
        sm:px-4
        md:px-6
        lg:px-8
        py-4
        overflow-x-hidden
        "
      >
        {/* Admin Top Header Bar */}
        <div className="flex items-center justify-between mb-4 bg-white px-3.5 sm:px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Open Menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 capitalize">
                {location.pathname.replace("/admin", "").replace("/", "") || "Dashboard"}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">HealStride Medical Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AdminNotifications />
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold transition"
            >
              <span>View Website &rarr;</span>
            </Link>
          </div>
        </div>

        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;