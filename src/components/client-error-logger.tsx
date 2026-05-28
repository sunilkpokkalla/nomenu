"use client";
import { useEffect } from "react";

export function ClientErrorLogger() {
  useEffect(() => {
    window.onerror = (msg, src, line, col, err) => {
      console.error("CAUGHT CLIENT ERROR:", msg, err);
    };
  }, []);

  return null;
}
