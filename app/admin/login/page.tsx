import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Container } from "@/components/ui/container";

export default async function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <Container className="admin-login-shell">
        <section className="surface-elevated admin-intro">
          <span className="eyebrow">Control Centre</span>
          <h1>Manage a full Supabase-backed health newsroom from one dashboard.</h1>
          <p>
            Create categories, publish posts, update information pages, review donations, and keep
            the public site in sync with one structured content model.
          </p>
        </section>
        <section className="surface-elevated admin-login-card">
          <h2>Admin Sign In</h2>
          <p>Use the email and password credentials.</p>
          <AdminLoginForm />
        </section>
      </Container>
    </main>
  );
}
