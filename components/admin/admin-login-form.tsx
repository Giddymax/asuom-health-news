"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/admin/login/actions";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form className="admin-login-form" action={action}>
      <label>
        Admin Email
        <input type="email" name="email" placeholder="Email address" required />
      </label>
      <label>
        Password
        <input type="password" name="password" placeholder="Enter password" required />
      </label>
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </button>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
    </form>
  );
}
