"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };
    setPending(false);
    setMessage(data.message ?? "Message received.");
  }

  return (
    <form className="contact-form" action={handleSubmit}>
      <div className="field-grid">
        <label>
          Full Name
          <input name="name" type="text" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" />
        </label>
        <label>
          Topic
          <input name="topic" type="text" required />
        </label>
        <label className="field-full">
          Message
          <textarea name="message" rows={5} required />
        </label>
      </div>
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
