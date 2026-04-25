"use client";

import { useRef, useState } from "react";

type VideoUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
};

export function VideoUploadField({ name, label, defaultValue = "" }: VideoUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-video", { method: "POST", body: fd });

      let data: { url?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        setUploadError(`Upload failed (HTTP ${res.status}).`);
        return;
      }

      if (res.status === 401) {
        setUploadError("Session expired — please save your work, then log in again.");
        return;
      }

      if (!res.ok) {
        setUploadError(data.message ?? "Upload failed.");
        return;
      }

      if (data.url) setValue(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Network error — check your connection.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="image-upload-field field-full">
      <span className="image-upload-label">{label}</span>
      {value ? (
        <div className="video-preview-wrap">
          <video src={value} controls preload="metadata" />
        </div>
      ) : (
        <div className="image-preview-empty">No video set</div>
      )}
      <input type="hidden" name={name} value={value} />
      <div className="image-upload-controls">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste video URL or upload a file…"
        />
        <button
          type="button"
          className="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload Video"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
          className="image-file-input"
          aria-label={`Upload ${label} video file`}
          onChange={handleFileChange}
        />
        {value ? (
          <button
            type="button"
            className="button button-danger"
            onClick={() => setValue("")}
          >
            Clear
          </button>
        ) : null}
      </div>
      {uploadError ? <p className="image-upload-error">{uploadError}</p> : null}
    </div>
  );
}
