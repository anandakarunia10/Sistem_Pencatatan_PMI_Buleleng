"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  FileBarChart,
  ChevronLeft,
  Menu,
  LogOut,
   UserCheck,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) {
        setMobile(true);
        setOpen(false);
      } else {
        setMobile(false);
        setOpen(true);
      }
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const menuItems = [
    {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/transaksi",
    label: "Input Transaksi",
    icon: LayoutDashboard,
  },
  {
    href: "/transaksitable",
    label: "Data Transaksi",
    icon: ClipboardList,
  },
  {
    href: "/jurnal",
    label: "Jurnal Umum",
    icon: BookOpen,
  },
  {
    href: "/laporan",
    label: "Laporan Keuangan",
    icon: FileBarChart,
  },
  {
    href: "/aktivasi",
    label: "Aktivasi Akun",
    icon: UserCheck,
  },
];

  return (
    <>
      {/* Overlay Mobile */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          left: open ? 248 : 12,
        }}
        className="
          fixed
          top-20
          z-[60]
          w-10
          h-10
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          flex
          items-center
          justify-center
          hover:bg-slate-50
          transition-all
        "
      >
        {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          h-screen
          w-[260px]
          bg-white
          border-r
          border-slate-200
          flex
          flex-col
          transition-all
          duration-300
          z-50
          ${open ? "left-0" : "-left-[260px]"}
        `}
      >
       {/* Header */}
<div className="pt-10 px-5">
  <div className="flex flex-col items-center">
    <Image
      src="/images/pmilogo.png"
      alt="PMI Logo"
      width={190}
      height={190}
      priority
      className="object-contain"
    />

    <h2 className="mt-2 text-[22px] font-bold tracking-wide text-red-600 leading-tight">
      PMI BULELENG
    </h2>

    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mt-[2px]">
      Sistem Keuangan
    </p>
  </div>

          <div className="mt-10 mb-4">
            
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4">
          <nav>
            {menuItems.map((item) => (
              <MenuItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={pathname === item.href}
                mobile={mobile}
                setOpen={setOpen}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => router.push("/")}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              border
              border-slate-200
              text-red-600
              font-medium
              hover:bg-red-50
              transition-all
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* MENU ITEM */

function MenuItem({ href, label, icon: Icon, active, mobile, setOpen }) {
  return (
    <Link
      href={href}
      onClick={() => {
        mobile && setOpen(false);
      }}
      className={`
        flex
        items-center
        gap-4
        px-4
        py-3
        mb-2
        rounded-xl
        transition-all
        duration-200

        ${
          active
            ? "bg-slate-100 text-slate-800"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }
      `}
    >
      <Icon
        size={19}
        strokeWidth={1.8}
        className={active ? "text-slate-700" : "text-slate-400"}
      />

      <span className="font-medium text-[15px]">{label}</span>
    </Link>
  );
}
