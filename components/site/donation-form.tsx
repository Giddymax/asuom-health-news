"use client";

import { useState } from "react";

type DonationFormProps = {
  paymentLink?: string;
};

export function DonationForm({ paymentLink }: DonationFormProps) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      location: String(formData.get("location") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      paymentMethod: String(formData.get("paymentMethod") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      note: String(formData.get("note") ?? "")
    };

    const response = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { message?: string };
    setPending(false);
    setMessage(data.message ?? "Donation details submitted.");
  }

  return (
    <form className="donation-form" action={handleSubmit}>
      <div className="field-grid">
        <label>
          Full Name
          <input name="fullName" required />
        </label>
        <label>
          Location
          <input name="location" required />
        </label>
        <label>
          Amount (GHS)
          <input name="amount" type="number" min="1" required />
        </label>
        <label>
          Payment Method
          <select name="paymentMethod" defaultValue="Mobile Money">
            <option>Mobile Money</option>
            <option>Bank Transfer</option>
            <option>Card / Payment Link</option>
            <option>Cash / In-person</option>
          </select>
        </label>
        <label>
          Phone
          <input name="phone" required />
        </label>
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label className="field-full">
          Donation Note
          <textarea name="note" rows={5} />
        </label>
      </div>
      <div className="donation-actions">
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Submitting..." : "Send Donation Details"}
        </button>
        {paymentLink ? (
          <a className="button button-ghost" href={paymentLink} target="_blank" rel="noreferrer">
            Open Payment Link
          </a>
        ) : null}
      </div>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
