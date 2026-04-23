"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const payload = {
      email: String(formData.get("email") ?? ""),
      source: "homepage-newsletter"
    };

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };
    setPending(false);
    setMessage(data.message ?? "Thanks for subscribing.");
  }

  return (
    <form
      className="newsletter-form"
      action={handleSubmit}
    >
      <input type="email" name="email" placeholder="Enter your email address" required />
      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Subscribe"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
