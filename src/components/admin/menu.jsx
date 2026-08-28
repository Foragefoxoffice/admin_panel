import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FiCloud,
  FiFile,
  FiMessageSquare,
  FiPlus,
  FiFileText,
  FiBook,
  FiUpload,
  FiBell,
  FiImage,
  FiChevronDown,
  FiChevronRight,
  FiLayers,
  FiAlertCircle,
  FiGrid,
  FiPieChart,
  FiMenu,
  FiX,
  FiUser,
  FiDownload,
  FiClipboard,
  FiSettings,
  FiCpu,
} from "react-icons/fi";

const navItems = [
  {
    title: "Test Series",
    icon: <FiClipboard size={18} />,
    items: [
      {
        title: "Packages",
        icon: <FiGrid size={16} />,
        href: "/admin/test-series",
      },
      {
        title: "Purchases",
        icon: <FiUser size={16} />,
        href: "/admin/test-series/purchases",
      },
      {
        title: "Banners",
        icon: <FiImage size={16} />,
        href: "/admin/test-series/banners",
      },
    ],
  },
  {
    title: "Types",
    icon: <FiLayers size={18} />,
    href: "/admin/types",
  },
  {
    title: "Question",
    icon: <FiFileText size={18} />,
    items: [
      {
        title: "Questions",
        icon: <FiMessageSquare size={16} />,
        href: "/admin/questions",
      },
      {
        title: "Upload",
        icon: <FiUpload size={16} />,
        href: "/admin/upload",
      },
      {
        title: "Question Add",
        icon: <FiPlus size={16} />,
        href: "/admin/question",
      },
      {
        title: "Question Export",
        icon: <FiDownload size={16} />,
        href: "/admin/export",
      },
    ],
  },
  {
    title: "Users",
    icon: <FiUser size={18} />,
    items: [
      {
        title: "Users",
        icon: <FiMessageSquare size={16} />,
        href: "/admin/user",
      },
      {
        title: "Coupons",
        icon: <FiUpload size={16} />,
        href: "/admin/coupons",
      },
      {
        title: "Payments",
        icon: <FiPlus size={16} />,
        href: "/admin/payments",
      },
    ],
  },
  {
    title: "NEET Plans",
    icon: <FiCloud size={18} />,
    items: [
      {
        title: "All Plans",
        icon: <FiGrid size={16} />,
        href: "/admin/neet-plans",
      },
      {
        title: "Create Plan",
        icon: <FiPlus size={16} />,
        href: "/admin/neet-plans/create",
      },
    ],
  },
  {
    title: "Plan Features",
    icon: <FiFile size={18} />,
    href: "/admin/subscription-features",
  },
  {
    title: "Materials",
    icon: <FiBook size={18} />,
    items: [
      {
        title: "Materials",
        icon: <FiFileText size={16} />,
        href: "/admin/materials",
      },
      {
        title: "Materials Add",
        icon: <FiPlus size={16} />,
        href: "/admin/material-upload",
      },
      {
        title: "Materials Blocks",
        icon: <FiAlertCircle size={16} />,
        href: "/admin/pdf-premium",
      },
    ],
  },
  {
    title: "Free Materials",
    icon: <FiAlertCircle size={18} />,
    items: [
      {
        title: "Free Materials",
        icon: <FiFileText size={16} />,
        href: "/admin/free-materials",
      },
      {
        title: "Free Materials Add",
        icon: <FiPlus size={16} />,
        href: "/admin/free-material-upload",
      },
    ],
  },
  {
    title: "Send Notification",
    icon: <FiAlertCircle size={18} />,
    href: "/admin/send-notification",
  },

  {
    title: "Blocks",
    icon: <FiAlertCircle size={18} />,
    href: "/admin/blocks",
  },
  {
    title: "App Settings",
    icon: <FiSettings size={18} />,
    href: "/admin/settings",
  },
  {
    title: "AI Dictionary",
    icon: <FiCpu size={18} />,
    href: "/admin/ai/dictionary",
  },
  {
    title: "Reports",
    icon: <FiFile size={18} />,
    href: "/admin/reports",
  },
  {
    title: "News",
    icon: <FiBell size={18} />,
    items: [
      {
        title: "All News",
        icon: <FiGrid size={16} />,
        href: "/admin/news",
      },
      {
        title: "Add News",
        icon: <FiPlus size={16} />,
        href: "/admin/addnews",
      },
    ],
  },
  {
    title: "Banner",
    icon: <FiImage size={18} />,
    items: [
      {
        title: "All Banners",
        icon: <FiPieChart size={16} />,
        href: "/admin/banners",
      },
      {
        title: "Add Banner",
        icon: <FiPlus size={16} />,
        href: "/admin/addbanners",
      },
    ],
  },
];

const Menu = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile/desktop detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (title) => {
    setExpandedMenu((prev) => (prev === title ? null : title));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActive = (href) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Auto-open submenu when on a child route
  useEffect(() => {
    const parentWithActiveChild = navItems.find(
      (nav) => nav.items && nav.items.some((item) => isActive(item.href))
    );
    if (parentWithActiveChild) {
      setExpandedMenu(parentWithActiveChild.title);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <div
          className={`md:hidden fixed left-4 z-50 ${isMobileMenuOpen ? "top-2 left-[12rem]" : "top-[6rem]"
            }`}
        >
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-purple-700 text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div

      >
        <div className="space-y-1 pt-4">
          {navItems.map((nav) => {
            const hasChildren = !!nav.items;
            const isParentActive =
              (nav.href && isActive(nav.href)) ||
              (hasChildren && nav.items.some((item) => isActive(item.href)));

            return (
              <div key={nav.title} className="overflow-hidden">
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(nav.title)}
                      className={`w-full flex items-center relative justify-between p-3 rounded-lg transition-all duration-200 ${isParentActive
                        ? "bg-transparent side_bar"
                        : "text-white hover:bg-purple-800"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${isParentActive ? "text-white" : "text-white"}`}>
                          {nav.icon}
                        </span>
                        <span
                          className={`${isParentActive
                            ? "text-white font-medium"
                            : "text-white"
                            }`}
                        >
                          {nav.title}
                        </span>
                      </div>
                      {expandedMenu === nav.title ? (
                        <FiChevronDown
                          className={`transition-transform duration-200 ${isParentActive ? "text-white" : "text-white"
                            }`}
                        />
                      ) : (
                        <FiChevronRight
                          className={`transition-transform duration-200 ${isParentActive ? "text-white" : "text-white"
                            }`}
                        />
                      )}
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out ${expandedMenu === nav.title
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="pl-4 py-1 space-y-1">
                        {nav.items.map((item) => (
                          <Link
                            key={item.title}
                            to={item.href} // ✅ correct prop for react-router-dom
                            onClick={() =>
                              isMobile && setIsMobileMenuOpen(false)
                            }
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 ${isActive(item.href)
                              ? "bg-white"
                              : "text-white hover:bg-purple-800"
                              }`}
                          >
                            <span
                              className={`${isActive(item.href)
                                ? "text-[#35095E]"
                                : "text-white"
                                }`}
                            >
                              {item.icon}
                            </span>
                            <span
                              className={`${isActive(item.href)
                                ? "text-[#35095E] font-medium"
                                : "text-white"
                                }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={nav.href}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${isActive(nav.href)
                      ? "bg-white"
                      : "text-white hover:bg-purple-800"
                      }`}
                  >
                    <span
                      className={`${isActive(nav.href)
                        ? "text-[#35095E]"
                        : "text-white"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    <span
                      className={`${isActive(nav.href)
                        ? "text-[#35095E] font-medium"
                        : "text-white"
                        }`}
                    >
                      {nav.title}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Menu;
