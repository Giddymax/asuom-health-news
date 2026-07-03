"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstall() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // registration failed (e.g. unsupported browser) — app still works without offline support
      });
    }

    if (window.localStorage.getItem("ahn-install-dismissed") === "1") {
      setDismissed(true);
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!installEvent || dismissed) return null;

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  function handleDismiss() {
    window.localStorage.setItem("ahn-install-dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="pwa-install-banner" role="complementary" aria-label="Install app">
      <span>Install Asuom Health News for quick, offline-friendly access.</span>
      <div className="pwa-install-actions">
        <button type="button" className="button button-primary" onClick={handleInstall}>
          Install App
        </button>
        <button type="button" className="pwa-install-dismiss" onClick={handleDismiss} aria-label="Dismiss install prompt">
          &times;
        </button>
      </div>
    </div>
  );
}
