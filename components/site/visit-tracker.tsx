"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname })
    }).catch(() => {
      // best-effort tracking — a failed request shouldn't affect the visitor
    });
  }, []);

  return null;
}
