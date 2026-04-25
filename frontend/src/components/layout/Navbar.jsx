"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        w-full h-14
        bg-red-700
        flex items-center justify-between
        px-4 md:px-6
        shadow-md
      "
    >
      {/* BRAND + LOGO */}
      <div
        className="
          flex items-center gap-3 flex-1 min-w-0
          ml-12 md:ml-[220px]   /* responsif mengikuti sidebar */
        "
      >
        <Image
          src="/images/pmilogo.png"
          alt="Logo PMI"
          width={35}
          height={32}
          className="object-contain"
        />

        <span className="text-lg md:text-xl text-white font-semibold truncate tracking-wide">
          PMI Buleleng
        </span>
      </div>

      {/* BUTTON LOGOUT */}
      <button
  onClick={handleLogout}
  className="
    group flex items-center gap-2
    text-xs md:text-sm font-semibold
    bg-white text-red-700
    px-3 py-1.5
    rounded-full
    shadow-md
    hover:bg-red-600 hover:text-white
    transition-all duration-300
    active:scale-95
    mr-6 md:mr-10   /* 👈 lebih ke kiri lagi */
  "
>
        <span className="text-sm group-hover:rotate-180 transition-transform duration-300">
          ⏻
        </span>
        Logout
      </button>
    </header>
  );
}