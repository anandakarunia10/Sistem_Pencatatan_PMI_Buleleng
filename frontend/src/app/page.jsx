"use client";

import { useState, useEffect } from "react";
import LandingPage from "../components/ui/landingpage/LandingPage";
import Loading from "@/components/loading/loading";


export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi delay untuk menampilkan loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 detik, bisa diganti sesuai kebutuhan

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return <LandingPage />;
}
