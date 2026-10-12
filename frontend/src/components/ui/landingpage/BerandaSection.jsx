"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BerandaSection() {
  const fullText = "Selamat Datang di PMI Kabupaten Buleleng";

  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= TYPING EFFECT ================= */
  useEffect(() => {
    const typingSpeed = isDeleting ? 25 : 70;
    const pauseTime = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === fullText.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayText(fullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting]);

  /* ================= TEXT LAYOUT ================= */
  const words = displayText.split(" ");
  const line1 = words.slice(0, 4); // Selamat Datang di PMI
  const line2 = words.slice(4); // Kabupaten Buleleng

  return (
    <section
      id="beranda"
      className="relative min-h-screen overflow-hidden text-white"
    >
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/images/login.jpeg"
          alt="Buleleng Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-red-950/30" />

      {/* GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[340px] h-[340px] bg-red-500/15 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[340px] h-[340px] bg-red-400/10 blur-3xl rounded-full" />

      {/* LIGHT DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_65%)]" />

      {/* CONTENT */}
      <div className="relative z-20 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT SIDE */}
          <div className="max-w-3xl">
            {/* TITLE */}
            <div className="min-h-[100px] sm:min-h-[120px]">
              <h1
                className="
                  text-[40px]
                  sm:text-[64px]
                  font-semibold
                  leading-[0.95]
                  tracking-[-1.5px]
                  font-poppins
                  flex flex-col
                "
              >
                {/* BARIS PERTAMA */}
                <div className="flex flex-wrap">
                  {line1.map((word, i) => (
                    <span
                      key={i}
                      className={`${
                        word.toLowerCase() === "pmi"
                          ? "text-[#ED1B24]"
                          : "text-white"
                      } mr-3`}
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* BARIS KEDUA */}
                <div className="flex flex-wrap mt-2">
                  {line2.map((word, i) => (
                    <span key={i} className="text-white mr-3">
                      {word}
                    </span>
                  ))}
                </div>
              </h1>
            </div>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="
    mt-6
    max-w-2xl
    text-[18px] 
    leading-[1.9]
    font-poppins
    font-normal 
    text-white/95 
    text-justify
    tracking-wide
  "
            >
              Selamat datang di website resmi PMI Kabupaten Buleleng. Bersama
              kami membangun pelayanan kemanusiaan yang profesional, transparan,
              dan bermanfaat bagi masyarakat.
            </motion.p>

            {/* BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <a
                href="#tentang"
                className="
      group inline-flex items-center gap-4
      px-9 py-4
      rounded-full
      bg-white/10
      backdrop-blur-xl
      border border-white/15
      text-white
      font-semibold
      text-[15px]
      tracking-wide

      shadow-[0_8px_25px_rgba(0,0,0,0.20)]

      transition-all duration-300
      hover:-translate-y-1
      hover:bg-[#d61f26]/90
      hover:border-[#d61f26]/80

      hover:shadow-[0_10px_28px_rgba(214,31,38,0.18)]

      active:scale-[0.97]
      active:shadow-[0_6px_18px_rgba(214,31,38,0.15)]
    "
              >
                <span>Tentang Kami</span>

                {/* DOUBLE ARROW */}
                <div
                  className="
        flex items-center justify-center
        w-9 h-9
        rounded-full
        bg-white/15
        transition-all duration-300
        group-hover:bg-white
      "
                >
                  <span
                    className="
          text-sm
          font-semibold
          tracking-[-2px]
          transition-all duration-300
          group-hover:text-[#d61f26]
          group-hover:translate-x-0.5
        "
                  >
                    &gt;&gt;
                  </span>
                </div>
              </a>
            </motion.div>
          </div>

          {/* RIGHT SIDE - COIN ANIMATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-[470px] h-[470px] flex items-center justify-center"
              style={{ perspective: "2000px" }}
            >
              {/* GLOW */}
              <div className="absolute inset-0 rounded-full bg-red-500/15 blur-3xl" />

              {/* COIN */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative w-[360px] h-[360px]"
                style={{ transformStyle: "preserve-3d" }}
              >
              {/* FRONT */}
<div
  className="absolute inset-0 rounded-2xl overflow-hidden bg-white flex items-center justify-center"
  style={{
    backfaceVisibility: "hidden",
    // Menaikkan intensitas red ke 1.0 dan menambah jangkauan blur
    filter: "drop-shadow(0 0 25px rgba(255, 0, 0, 0.9))", 
  }}
>
  <Image
    src="/images/pmilogo.png"
    alt="PMI Logo"
    fill
    className="object-contain p-6"
  />
</div>

{/* BACK */}
<div
  className="absolute inset-0 rounded-2xl overflow-hidden bg-white flex items-center justify-center"
  style={{
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
    // Menggunakan glow merah yang lebih pekat dan terang
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
    filter: "drop-shadow(0 0 30px rgba(255, 0, 0, 1))", 
  }}
>
  <Image
    src="/images/pmilogo.png"
    alt="PMI Logo Back"
    fill
    className="object-contain p-6"
  />
</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
