"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ArticleAdminActionsProps = {
  slug: string;
};

export function ArticleAdminActions({ slug }: ArticleAdminActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType: "post", slug })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Delete failed. Please try again.");
        setDeleting(false);
      }
    } catch {
      alert("Delete failed. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="article-admin-actions">
      <Link href={`/admin?mode=post&slug=${encodeURIComponent(slug)}#content-editor`} className="article-admin-btn article-admin-edit">
        Edit
      </Link>
      <button
        className="article-admin-btn article-admin-delete"
        onClick={handleDelete}
        disabled={deleting}
        type="button"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
