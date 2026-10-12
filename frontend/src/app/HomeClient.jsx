"use client";

import { useState, useEffect } from "react";
import LandingPage from "../components/ui/landingpage/LandingPage";
import Loading from "@/components/loading/loading";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return <LandingPage />;
}