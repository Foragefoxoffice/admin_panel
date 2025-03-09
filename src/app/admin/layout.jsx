"use client";
import Menu from "@/components/admin/menu";
import Navbar from "@/components/admin/navbar";
import Image from "next/image";

export default function dashboardLayout({
  children,
}) {
  return (
    <div className="flex h-screen relative">
      {/* left side */}

      <div className=" w-[14%] md:w-[10%] lg:w-[16%] xl:[14%] md:p-6 p-2 pt-10 sidebar ">
        <div className="bg-white rounded-md hidden md:flex md:p-5">
        <Image src={"/images/logo/logo.png"} alt="" width={150} height={80} />
        </div>
        <div className="bg-white rounded-md md:hidden ">
        <Image src={"/images/logo/logo1.png"} alt="" width={150} height={80} />
        </div>
        <header>
<Menu/>
        </header>
      </div>

      {/* Right side */}

      <div className=" w-[86%] md:w-[90%] lg:w-[84%] xl:[84%] p-0 md:p-10 overflow-y-scroll">
       
        {children}
      </div>
    </div>
  );
}
