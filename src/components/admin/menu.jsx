"use client";

import Image from "next/image";
import Link from "next/link";

const navItem = [
  {
    title: "Menus",
    items: [
      {
        title: "Questions",
        image: "/images/menu/conversation.png",
        href: "/admin/questions",
      },
      {
        title: "Materials",
        image: "/images/menu/pdf.png",
        href: "/admin/materials",
      },
      {
        title: "Types", 
        image: "/images/menu/cloud.png",
        href: "/admin/types",
      },
      {
        title: "Upload",
        image: "/images/menu/file.png",
        href: "/admin/upload",
      },
      {
        title: "Question Add",
        image: "/images/menu/add.png",
        href: "/admin/question",
      },
      {
        title: "Materials Add",
        image: "/images/menu/new-document.png",
        href: "/admin/material-upload",
      },
    ],
  },
];

const Menu = () => {
  return (
    <div>
      {navItem.map((nav) => (
        <nav key={nav.title}>
          <ul className="pt-16 grid gap-6">
            {nav.items.map((item) => (
              <li key={item.title} className="flex items-center justify-center md:justify-start gap-3">
                <Link href={item.href} className="flex items-center gap-3">
                  <Image
                    className="menuicons cursor-pointer"
                    src={item.image}
                    alt={item.title}
                    width={25}
                    height={20}
                  />
                  <span className="text-white menutitle">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
};

export default Menu;
