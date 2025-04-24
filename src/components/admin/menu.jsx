"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  FiGrid,
  FiPieChart,
  FiMenu,
  FiX
} from "react-icons/fi";

const navItems = [
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
    ],
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
    ],
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
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (title) => {
    setExpandedMenu(prev => prev === title ? null : title);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <div className={`md:hidden fixed  left-4 z-50 ${isMobileMenuOpen ? 'top-2 left-[12rem]' : 'top-[6rem]'}`}>
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
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform' : 'relative'}
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
           bg-[#35095E] 
        `}
      >
        <div className="space-y-1 pt-4">
          {navItems.map((nav) => (
            <div key={nav.title} className="overflow-hidden">
              {nav.items ? (
                <>
                  <button
                    onClick={() => toggleMenu(nav.title)}
                    className={`w-full flex items-center relative justify-between p-3 rounded-lg transition-all duration-200 ${
                      isActive(nav.href) || nav.items.some(item => isActive(item.href))
                        ? "bg-transparent side_bar"
                        : "text-white hover:bg-purple-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${
                        isActive(nav.href) || nav.items.some(item => isActive(item.href))
                          ? "text-white"
                          : "text-white"
                      }`}>
                        {nav.icon}
                      </span>
                      <span className={`${
                        isActive(nav.href) || nav.items.some(item => isActive(item.href))
                          ? "text-white font-medium"
                          : "text-white"
                      }`}>
                        {nav.title}
                      </span>
                    </div>
                    {expandedMenu === nav.title ? (
                      <FiChevronDown className={`transition-transform duration-200 ${
                        isActive(nav.href) || nav.items.some(item => isActive(item.href))
                          ? "text-white"
                          : "text-white"
                      }`} />
                    ) : (
                      <FiChevronRight className={`transition-transform duration-200 ${
                        isActive(nav.href) || nav.items.some(item => isActive(item.href))
                          ? "text-white"
                          : "text-white"
                      }`} />
                    )}
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    expandedMenu === nav.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="pl-4 py-1 space-y-1">
                      {nav.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => isMobile && setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 ${
                            isActive(item.href)
                              ? "bg-white"
                              : "text-white hover:bg-purple-800"
                          }`}
                        >
                          <span className={`${
                            isActive(item.href) ? "text-[#35095E]" : "text-white"
                          }`}>
                            {item.icon}
                          </span>
                          <span className={`${
                            isActive(item.href) ? "text-[#35095E] font-medium" : "text-white"
                          }`}>
                            {item.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={nav.href}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive(nav.href)
                      ? "bg-white"
                      : "text-white hover:bg-purple-800"
                  }`}
                >
                  <span className={`${
                    isActive(nav.href) ? "text-[#35095E]" : "text-white"
                  }`}>
                    {nav.icon}
                  </span>
                  <span className={`${
                    isActive(nav.href) ? "text-[#35095E] font-medium" : "text-white"
                  }`}>
                    {nav.title}
                  </span>
                </Link>
              )}
            </div>
          ))}
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