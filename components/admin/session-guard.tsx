"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SESSION_MS = 30 * 60 * 1000;      // 30 minutes — must match JWT expiry
const WARN_BEFORE_MS = 2 * 60 * 1000;   // show warning 2 minutes before timeout
const REFRESH_THROTTLE_MS = 5 * 60 * 1000; // call refresh API at most every 5 minutes

export function SessionGuard() {
  const router = useRouter();
  const lastActivityRef = useRef(Date.now());
  const lastRefreshRef = useRef(Date.now());
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    function refreshSession() {
      fetch("/api/admin/refresh", { method: "POST" }).catch(() => {});
    }

    // Refresh immediately on mount so a short-lived token is extended before any action
    refreshSession();

    function recordActivity() {
      const now = Date.now();
      lastActivityRef.current = now;

      if (now - lastRefreshRef.current >= REFRESH_THROTTLE_MS) {
        lastRefreshRef.current = now;
        refreshSession();
      }
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, recordActivity, { passive: true }));

    const ticker = setInterval(() => {
      const idle = Date.now() - lastActivityRef.current;
      const remaining = SESSION_MS - idle;

      if (remaining <= 0) {
        clearInterval(ticker);
        fetch("/api/admin/logout", { method: "POST" }).finally(() => {
          router.replace("/admin/login");
        });
        return;
      }

      if (remaining <= WARN_BEFORE_MS) {
        setSecondsLeft(Math.ceil(remaining / 1000));
      } else {
        setSecondsLeft(null);
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, recordActivity));
      clearInterval(ticker);
    };
  }, [router]);

  function extendSession() {
    lastActivityRef.current = Date.now();
    lastRefreshRef.current = Date.now();
    fetch("/api/admin/refresh", { method: "POST" }).catch(() => {});
    setSecondsLeft(null);
  }

  if (secondsLeft === null) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="session-warning" role="alert">
      <span>
        Session expires in{" "}
        <strong>
          {mins}:{String(secs).padStart(2, "0")}
        </strong>{" "}
        — move or click to stay signed in.
      </span>
      <button type="button" className="session-warning-btn" onClick={extendSession}>
        Stay Signed In
      </button>
    </div>
  );
}
