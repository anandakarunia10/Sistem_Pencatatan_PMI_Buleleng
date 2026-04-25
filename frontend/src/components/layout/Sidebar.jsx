"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState("/transaksi"); // untuk highlight aktif

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
    { href: "/transaksi", label: "Dashboard" },
    { href: "/transaksitable", label: "Detail Transaksi" },
    { href: "/jurnal", label: "Jurnal" },
    { href: "/laporan", label: "Laporan" },
  ];

  return (
    <>
      {/* Overlay Mobile */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 40,
          }}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: 70,
          left: open ? 220 : 10,
          zIndex: 60,
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "none",
          background: "#e53935",
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          transition: "all 0.3s ease",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? "◀" : "▶"}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : -240,
          width: 220,
          height: "100vh",
          background: "#fff",
          padding: "80px 16px 20px",
          borderRight: "2px solid #e53935",
          boxShadow: "2px 0 15px rgba(0,0,0,0.08)",
          transition: "all 0.35s ease",
          zIndex: 50,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflowY: "auto",
        }}
      >
        <nav>
          {menuItems.map((item) => (
            <MenuItem
              key={item.href}
              href={item.href}
              label={item.label}
              mobile={mobile}
              setOpen={setOpen}
              active={active}
              setActive={setActive}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

/* Menu Item */
function MenuItem({ href, label, mobile, setOpen, active, setActive }) {
  const isActive = active === href;
  return (
    <Link
      href={href}
      onClick={() => {
        mobile && setOpen(false);
        setActive(href);
      }}
      style={{
        display: "block",
        padding: "12px 16px",
        marginBottom: 10,
        borderRadius: 10,
        textDecoration: "none",
        color: isActive ? "#fff" : "#333",
        background: isActive ? "#e53935" : "transparent",
        fontWeight: 600,
        transition: "all 0.3s ease",
        boxShadow: isActive ? "0 4px 10px rgba(229,57,53,0.3)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "#fdecea";
          e.currentTarget.style.color = "#e53935";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#333";
        }
      }}
    >
      {label}
    </Link>
  );
}
