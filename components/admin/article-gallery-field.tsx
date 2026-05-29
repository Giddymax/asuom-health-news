"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { uploadImageAction } from "@/app/admin/actions";
import type { GalleryItem } from "@/lib/types";

type ArticleGalleryFieldProps = {
  defaultItems?: GalleryItem[];
  supabaseEnabled: boolean;
};

const createGalleryId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function ArticleGalleryField({ defaultItems = [], supabaseEnabled }: ArticleGalleryFieldProps) {
  const [items, setItems] = useState<GalleryItem[]>(defaultItems);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateItem(id: string, patch: Partial<GalleryItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) => [...current, { id: createGalleryId(), image: "", alt: "" }]);
  }

  async function uploadImage(id: string, file?: File) {
    if (!file) return;

    setUploadingId(id);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const result = await uploadImageAction(fd);
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        updateItem(id, { image: result.url });
      }
    } catch {
      setUploadError("Upload failed — please try again.");
    } finally {
      setUploadingId(null);
      if (fileRefs.current[id]) fileRefs.current[id]!.value = "";
    }
  }

  const savedItems = items.filter((item) => item.image.trim());

  return (
    <div className="article-gallery-field field-full">
      <div className="article-gallery-header">
        <span className="image-upload-label">Article Gallery Images</span>
        <button type="button" className="button" onClick={addItem}>
          Add Image
        </button>
      </div>

      <input type="hidden" name="galleryJson" value={JSON.stringify(savedItems)} />

      {items.length ? (
        <div className="article-gallery-admin-list">
          {items.map((item, index) => (
            <div key={item.id} className="article-gallery-admin-item">
              {item.image ? (
                <div className="image-preview-wrap article-gallery-preview">
                  <Image
                    src={item.image}
                    alt={item.alt || `Gallery image ${index + 1}`}
                    width={360}
                    height={240}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="image-preview-empty article-gallery-preview-empty">No image set</div>
              )}

              <div className="article-gallery-controls">
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => updateItem(item.id, { image: e.target.value })}
                  placeholder="Paste image URL or upload a file..."
                />
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateItem(item.id, { alt: e.target.value })}
                  placeholder="Alt text / caption"
                />
                <div className="article-gallery-actions">
                  {supabaseEnabled ? (
                    <>
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
                        accept="image/*"
                        className="image-file-input"
                        aria-label={`Upload article gallery image ${index + 1}`}
                        onChange={(e) => uploadImage(item.id, e.target.files?.[0])}
                      />
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="image-preview-empty">No gallery images set</div>
      )}

      {uploadError ? <p className="image-upload-error">{uploadError}</p> : null}
    </div>
  );
}
