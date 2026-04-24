import { redirect } from "next/navigation";

import { AdminContentForms } from "@/components/admin/admin-content-forms";
import { ArticleAdminActions } from "@/components/admin/article-admin-actions";
import { SessionGuard } from "@/components/admin/session-guard";
import { Container } from "@/components/ui/container";
import { getAdminSession } from "@/lib/auth";
import { hasSupabase } from "@/lib/env";
import {
  getAdminSiteSnapshot,
  getDashboardStats,
  listRecentDonations
} from "@/lib/repositories/cms-repository";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string; slug?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { mode: initialMode, slug: initialSlug } = await searchParams;

  const [stats, snapshot, donations] = await Promise.all([
    getDashboardStats(),
    getAdminSiteSnapshot(),
    listRecentDonations()
  ]);

  return (
    <main className="admin-dashboard-page">
      <SessionGuard />
      <Container className="stack-xl">
        <section className="admin-hero surface-elevated">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Editorial operations and website content</h1>
            <p>
              The public site stays readable without Supabase, while the forms below unlock real
              persistence once your database variables are configured in Vercel and locally.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="button button-ghost" type="submit">
              Sign Out
            </button>
          </form>
        </section>

        <section className="stats-grid">
          <div className="surface-elevated stat-card">
            <strong>{stats.articleCount}</strong>
            <span>Articles</span>
          </div>
          <div className="surface-elevated stat-card">
            <strong>{stats.categoryCount}</strong>
            <span>Categories</span>
          </div>
          <div className="surface-elevated stat-card">
            <strong>{stats.newsletterCount}</strong>
            <span>Subscribers</span>
          </div>
          <div className="surface-elevated stat-card">
            <strong>{stats.donationCount}</strong>
            <span>Donations</span>
          </div>
        </section>

        <section className="admin-grid">
          <div className="surface-elevated">
            <h2>Recent Published Articles</h2>
            <div className="admin-list">
              {snapshot.posts.slice(0, 5).map((article) => (
                <div key={article.id} className="admin-list-row admin-list-row-article">
                  <div className="admin-list-row-info">
                    <strong>{article.title}</strong>
                    <span>{article.author} &middot; {formatDate(article.publishedAt)}</span>
                  </div>
                  <ArticleAdminActions slug={article.slug} />
                </div>
              ))}
            </div>
          </div>
          <div className="surface-elevated">
            <h2>Recent Donations</h2>
            <div className="admin-list">
              {donations.length ? (
                donations.map((donation) => (
                  <div key={donation.id} className="admin-list-row">
                    <div>
                      <strong>{donation.full_name}</strong>
                      <span>{donation.payment_method}</span>
                    </div>
                    <small>{formatMoney(donation.amount)}</small>
                  </div>
                ))
              ) : (
                <p className="muted">
                  No live donation rows yet. Once Supabase is connected, new submissions will show
                  up here.
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="content-editor" className="surface-elevated">
          <h2>Content Publishing</h2>
          <p className="muted">
            Create or edit articles, homepage videos, categories, pages, donation content, and
            site-wide settings from one dashboard.
          </p>
          <AdminContentForms
            categories={snapshot.categories}
            posts={snapshot.posts}
            pages={snapshot.pages}
            videos={snapshot.videos}
            settings={snapshot.settings}
            donationCampaign={snapshot.donationCampaign}
            supabaseEnabled={hasSupabase}
            initialMode={initialMode}
            initialSlug={initialSlug}
          />
        </section>
      </Container>
    </main>
  );
}
