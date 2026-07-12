"use client";

import { useRef, useState } from "react";

import type { VideoClip } from "@/lib/types";

const MAX_EXTRA_CLIPS = 2;

type VideoClipsFieldProps = {
  name: string;
  label: string;
  defaultValues?: VideoClip[];
};

const createClipId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function VideoClipsField({ name, label, defaultValues = [] }: VideoClipsFieldProps) {
  const [items, setItems] = useState<VideoClip[]>(defaultValues.slice(0, MAX_EXTRA_CLIPS));
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateItem(id: string, patch: Partial<VideoClip>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) =>
      current.length >= MAX_EXTRA_CLIPS ? current : [...current, { id: createClipId(), url: "", caption: "" }]
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function uploadClip(id: string, file?: File) {
    if (!file) return;

    setUploadingId(id);
    setUploadError("");

    try {
      const signRes = await fetch("/api/admin/sign-video-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, type: file.type, size: file.size })
      });

      let signData: { signedUrl?: string; publicUrl?: string; useServerUpload?: boolean; message?: string } = {};
      try {
        signData = await signRes.json();
      } catch {
        setUploadError(`Upload failed (HTTP ${signRes.status}).`);
        return;
      }

      if (signRes.status === 401) {
        setUploadError("Session expired — please save your work, then log in again.");
        return;
      }

      if (!signRes.ok) {
        setUploadError(signData.message ?? "Upload failed.");
        return;
      }

      if (signData.useServerUpload) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/admin/upload-video", { method: "POST", body: fd });
        let uploadData: { url?: string; message?: string } = {};
        try { uploadData = await uploadRes.json(); } catch { /* ignore */ }
        if (!uploadRes.ok) {
          setUploadError(uploadData.message ?? "Upload failed.");
          return;
        }
        if (uploadData.url) updateItem(id, { url: uploadData.url });
        return;
      }

      const uploadRes = await fetch(signData.signedUrl!, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });

      if (!uploadRes.ok) {
        setUploadError(`Upload failed (HTTP ${uploadRes.status}).`);
        return;
      }

      updateItem(id, { url: signData.publicUrl! });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Network error — check your connection.");
    } finally {
      setUploadingId(null);
      if (fileRefs.current[id]) fileRefs.current[id]!.value = "";
    }
  }

  const savedItems = items.filter((item) => item.url.trim());

  return (
    <div className="article-gallery-field field-full">
      <div className="article-gallery-header">
        <span className="image-upload-label">{label} ({items.length}/{MAX_EXTRA_CLIPS})</span>
        <button type="button" className="button" onClick={addItem} disabled={items.length >= MAX_EXTRA_CLIPS}>
          Add Clip
        </button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(savedItems)} />

      {items.length ? (
        <div className="article-gallery-admin-list">
          {items.map((item, index) => (
            <div key={item.id} className="article-gallery-admin-item">
              {item.url ? (
                <div className="video-preview-wrap article-gallery-preview">
                  <video src={item.url} controls preload="metadata" />
                </div>
              ) : (
                <div className="image-preview-empty article-gallery-preview-empty">No video set</div>
              )}

              <div className="article-gallery-controls">
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, { url: e.target.value })}
                  placeholder="Paste video URL or upload a file..."
                />
                <input
                  type="text"
                  value={item.caption}
                  onChange={(e) => updateItem(item.id, { caption: e.target.value })}
                  placeholder="Caption"
                />
                <div className="article-gallery-actions">
                  <button
                    type="button"
                    className="button"
                    onClick={() => fileRefs.current[item.id]?.click()}
                    disabled={uploadingId === item.id}
                  >
                    {uploadingId === item.id ? "Uploading..." : "Upload File"}
                  </button>
                  <input
                    ref={(node) => {
                      fileRefs.current[item.id] = node;
                    }}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                    className="image-file-input"
                    aria-label={`Upload ${label} ${index + 1}`}
                    onChange={(e) => uploadClip(item.id, e.target.files?.[0])}
                  />
                  <button type="button" className="button button-danger" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="image-preview-empty">No extra clips set</div>
      )}

      {uploadError ? <p className="image-upload-error">{uploadError}</p> : null}
    </div>
  );
}
