"use client";

import { useState } from "react";

type Link = { label: string; href: string };

type LinksEditorProps = {
  name: string;
  sectionLabel: string;
  defaultLinks: Link[];
  labelPlaceholder?: string;
  hrefPlaceholder?: string;
};

export function LinksEditor({
  name,
  sectionLabel,
  defaultLinks,
  labelPlaceholder = "Label",
  hrefPlaceholder = "https://..."
}: LinksEditorProps) {
  const [links, setLinks] = useState(defaultLinks);

  function add() {
    setLinks((prev) => [...prev, { label: "", href: "" }]);
  }

  function remove(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: "label" | "href", value: string) {
    setLinks((prev) => prev.map((link, idx) => (idx === i ? { ...link, [field]: value } : link)));
  }

  return (
    <div className="social-links-editor field-full">
      <span className="social-links-label">{sectionLabel}</span>
      <input type="hidden" name={name} value={JSON.stringify(links)} />
      {links.map((link, i) => (
        <div key={i} className="social-link-row">
          <input
            type="text"
            placeholder={labelPlaceholder}
            value={link.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <input
            type="text"
            placeholder={hrefPlaceholder}
            value={link.href}
            onChange={(e) => update(i, "href", e.target.value)}
          />
          <button type="button" className="button button-danger" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="button button-ghost social-links-add" onClick={add}>
        + Add Link
      </button>
    </div>
  );
}
