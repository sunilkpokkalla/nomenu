"use client";
import { useEffect } from "react";

export function ClientErrorLogger() {
  useEffect(() => {
    window.onerror = (msg, src, line, col, err) => {
      console.error("CAUGHT CLIENT ERROR:", msg, err);
      // Optional: you can also log this to an external service if needed
    };
  }, []);

  return null;
}
