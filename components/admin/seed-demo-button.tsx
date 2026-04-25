"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedDemoButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    const confirmed = window.confirm(
      "Load all demo articles, categories, videos, pages, and donation campaign into your database?"
    );
    if (!confirmed) return;

    setPending(true);
    setMessage("");

    const response = await fetch("/api/admin/seed", { method: "POST" });

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    const data = (await response.json()) as { message?: string };
    setPending(false);
    setMessage(data.message ?? "Done.");
    if (response.ok) router.refresh();
  }

  return (
    <div className="admin-seed-prompt surface-elevated">
      <div>
        <strong>Your database is empty</strong>
        <p className="muted">
          Load demo articles, categories, videos, and pages to preview the site. You can edit or
          delete any of it from this dashboard.
        </p>
      </div>
      <div className="admin-seed-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={handleSeed}
          disabled={pending}
        >
          {pending ? "Loading..." : "Load Demo Data"}
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </div>
    </div>
  );
}
