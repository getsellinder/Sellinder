import Link from "next/link";
import React, { useState } from "react";
import { Images } from "./images";
import { usePathname } from "next/navigation";

const Header = () => {

  const [active,setActive]=useState("home")
    const pathname = usePathname();
    const links = [
    { name: "Home", path: "/home" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
       { name: "Contact Us", path: "/contact" },
       { name: "Login", path: "/login" },
 
  ];
  return (
    <div className=" bg-white text-slate-800 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <img
                src={Images.logowhitebg}
                alt="Sellinder"
                className="h-10 w-auto"
              />
            </Link>

            <nav className="hidden md:flex gap-6 text-slate-600">
                  {links.map((link) => (
        <Link
          key={link.name}
          href={link.path}
          className={`px-4 py-2 rounded-lg transition ${
            pathname === link.path
              ? "bg-orange-500 text-white font-semibold"
              : "hover:bg-orange-100"
          }`}
        >
          {link.name}
        </Link>
      ))}
              
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pricing">
              <button className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-2xl font-semibold">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
