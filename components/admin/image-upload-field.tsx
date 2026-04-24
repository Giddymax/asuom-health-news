"use client";

import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  supabaseEnabled: boolean;
};

export function ImageUploadField({ name, label, defaultValue = "", supabaseEnabled }: ImageUploadFieldProps) {
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

      let data: { url?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        setUploadError(`Upload failed (HTTP ${res.status}).`);
        return;
      }

      if (res.status === 401) {
        window.location.href = "/admin/login";
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
        <div className="image-preview-wrap">
          <img src={value} alt="Preview" />
        </div>
      ) : (
        <div className="image-preview-empty">No image set</div>
      )}
      <input type="hidden" name={name} value={value} />
      <div className="image-upload-controls">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste image URL or upload a file…"
        />
        {supabaseEnabled ? (
          <>
            <button
              type="button"
              className="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload File"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="image-file-input"
              aria-label={`Upload ${label} image file`}
              onChange={handleFileChange}
            />
          </>
        ) : null}
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
