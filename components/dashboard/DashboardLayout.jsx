import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut, FiHome, FiCreditCard, FiClock, FiLayers, FiHelpCircle ,cilCommentBubble} from "react-icons/fi";
import { LuTickets } from "react-icons/lu";
import { Images } from "../images";
import { isAutheticated, signout } from "../isAuthticated";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome },
  { label: "History", href: "/dashboard/history", icon: FiClock },
  { label: "Billing", href: "/dashboard/billing", icon: FiCreditCard },
  { label: "Plans", href: "/dashboard/plans", icon: FiLayers },
    { label: "Ticketes", href: "/dashboard/tickets", icon: LuTickets },
  { label: "Help", href: "/dashboard/help", icon: FiHelpCircle }
];

const SidebarItem = ({ label, href, Icon, collapsed, active }) => {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out ${
        active ? "bg-white text-sky-900 shadow-sm" : "text-sky-800 hover:bg-[#DFF6FF]"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-sky-600" : "text-slate-600"}`} />
      {!collapsed && (
        <span className={`font-medium transition-transform duration-200 ease-out group-hover:translate-x-1 ${active ? "text-sky-900" : ""}`}>
          {label}
        </span>
      )}
    </Link>
  );
};

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState({ name: "User", email: "" });
  const modalRef = useRef(null);

  useEffect(() => {
    const authed = isAutheticated();
    if (!authed) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored && (stored.name || stored.email)) {
        setUser({
          name: stored.name || "User",
          email: stored.email || ""
        });
      }
    } catch (err) {
      // ignore missing user data
    }
  }, []);

  useEffect(() => {
    function onDocClick(event) {
      if (showProfileModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showProfileModal]);

  const sidebarWidth = sidebarOpen ? "w-64" : "w-20";
  const activeItem = useMemo(() => {
    return navItems.find((item) => router.pathname === item.href) || navItems[0];
  }, [router.pathname]);

  const content = typeof children === "function" ? children({ user }) : children;

  return (
    <div className="min-h-screen bg-gray-50 flex text-slate-800">
      <aside
        className={`relative h-screen sticky top-0 ${sidebarWidth} bg-[#E6F4FF] border-r border-[#CDEAFB] flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className={`flex items-center ${sidebarOpen ? "gap-3" : "justify-center w-full"}`}>
            <img
              src={Images.logowhitebg}
              alt="Sellinder"
              className={`${sidebarOpen ? "h-12 w-auto" : "h-10 w-10"} object-contain`}
            />
          </div>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="ml-2 px-2 py-1 rounded-lg hover:bg-[#DFF6FF] text-slate-700 font-bold text-lg"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? "<" : ">"}
          </button>
        </div>

        <nav className="p-3 flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              label={item.label}
              href={item.href}
              Icon={item.icon}
              collapsed={!sidebarOpen}
              active={router.pathname === item.href}
            />
          ))}
        </nav>

  <div className="p-3 border-t border-[#CDEAFB] relative">
          {showProfileModal && (
            <div
              ref={modalRef}
              className="absolute bottom-20 left-3 right-3 bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-10"
            >
              <div className="mb-2">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{user.email || "—"}</p>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <ul className="text-sm space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      router.push("/dashboard/profile");
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-orange-50"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      router.push("/dashboard/resetpassword");
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-orange-50"
                  >
                    Reset Password
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div className={`flex items-center ${sidebarOpen ? "justify-between" : "flex-col gap-2"}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              {sidebarOpen && (
                <button
                  className="text-sm font-semibold text-slate-800 truncate"
                  title="View profile"
                  onClick={() => setShowProfileModal((prev) => !prev)}
                >
                  {user?.name || "User"}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                signout();
                router.push("/login");
              }}
              className="p-2 text-slate-600 hover:text-orange-600"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100 text-slate-600 font-bold text-lg"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "<" : ">"}
          </button>
          <span className="font-semibold">{activeItem.label}</span>
        </div>

        <div className="p-6">{content}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
