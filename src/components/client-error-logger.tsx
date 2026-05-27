"use client";
import { useEffect } from "react";

export function ClientErrorLogger() {
  useEffect(() => {
    window.onerror = (msg, src, line, col, err) => {
      console.error("CAUGHT CLIENT ERROR:", msg, err);
      alert("CLIENT CRASH LOG: " + msg + "\n\nPlease copy this exact message and send it to the developer.");
    };
  }, []);

  return null;
}
