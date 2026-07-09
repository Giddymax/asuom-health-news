"use client";

import { useRef, useState } from "react";

const MAX_EXTRA_CLIPS = 2;

type VideoClipsFieldProps = {
  name: string;
  label: string;
  defaultValues?: string[];
};

export function VideoClipsField({ name, label, defaultValues = [] }: VideoClipsFieldProps) {
  const [items, setItems] = useState<string[]>(defaultValues.slice(0, MAX_EXTRA_CLIPS));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function updateItem(index: number, value: string) {
    setItems((current) => current.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    setItems((current) => (current.length >= MAX_EXTRA_CLIPS ? current : [...current, ""]));
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function uploadClip(index: number, file?: File) {
    if (!file) return;

    setUploadingIndex(index);
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
        if (uploadData.url) updateItem(index, uploadData.url);
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

      updateItem(index, signData.publicUrl!);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Network error — check your connection.");
    } finally {
      setUploadingIndex(null);
      if (fileRefs.current[index]) fileRefs.current[index]!.value = "";
    }
  }

  const savedItems = items.filter((item) => item.trim());

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
            <div key={index} className="article-gallery-admin-item">
              {item ? (
                <div className="video-preview-wrap article-gallery-preview">
                  <video src={item} controls preload="metadata" />
                </div>
              ) : (
                <div className="image-preview-empty article-gallery-preview-empty">No video set</div>
              )}

              <div className="article-gallery-controls">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder="Paste video URL or upload a file..."
                />
                <div className="article-gallery-actions">
                  <button
                    type="button"
                    className="button"
                    onClick={() => fileRefs.current[index]?.click()}
                    disabled={uploadingIndex === index}
                  >
                    {uploadingIndex === index ? "Uploading..." : "Upload File"}
                  </button>
                  <input
                    ref={(node) => {
                      fileRefs.current[index] = node;
                    }}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                    className="image-file-input"
                    aria-label={`Upload ${label} ${index + 1}`}
                    onChange={(e) => uploadClip(index, e.target.files?.[0])}
                  />
                  <button type="button" className="button button-danger" onClick={() => removeItem(index)}>
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
