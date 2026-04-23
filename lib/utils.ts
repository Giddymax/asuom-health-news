import { clsx } from "clsx";

export const cn = (...values: Array<string | false | null | undefined>) => clsx(values);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long"
  }).format(new Date(value));

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0
  }).format(value);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const absoluteUrl = (path: string) => {
  try {
    return new URL(path, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").toString();
  } catch {
    return path;
  }
};
