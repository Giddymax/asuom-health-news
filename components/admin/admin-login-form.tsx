"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      })
    });

    const data = (await response.json()) as { message?: string };
    setPending(false);

    if (!response.ok) {
      setError(data.message ?? "Unable to sign in.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" action={handleSubmit}>
      <label>
        Admin Email
        <input type="email" name="email" placeholder="admin@asuomhealthnews.com" required />
      </label>
      <label>
        Password
        <input type="password" name="password" placeholder="Enter password" required />
      </label>
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
