import Link from "next/link";

import { ArticleCard } from "@/components/site/article-card";
import { ContactForm } from "@/components/site/contact-form";
import { NewsTicker } from "@/components/site/news-ticker";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { VideoCard } from "@/components/site/video-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getActiveDonationCampaign,
  getSiteSettings,
  listCategories,
  listFeaturedArticles,
  listPublishedArticles,
  listVideos
} from "@/lib/repositories/cms-repository";
import { formatMoney } from "@/lib/utils";

export default async function HomePage() {
  const [settings, categories, featuredArticles, allArticles, videos, campaign] = await Promise.all([
    getSiteSettings(),
    listCategories(),
    listFeaturedArticles(),
    listPublishedArticles(),
    listVideos(),
    getActiveDonationCampaign()
  ]);

  const lead = featuredArticles[0] ?? allArticles[0];
  const secondary = featuredArticles.slice(1, 3);
  const latest = allArticles.slice(0, 6);

  return (
    <main>
      <NewsTicker items={settings.tickerItems} />

      <section className="hero-section">
        <Container className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Community Health Desk</span>
            <h1>{settings.featuredTopic}</h1>
            <p>{settings.mission}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href={lead ? `/articles/${lead.slug}` : "/categories/community-health"}>
                Read Lead Story
              </Link>
              <Link className="button button-ghost" href="/donate">
                Support the Newsroom
              </Link>
            </div>
          </div>
          <div className="hero-panel surface-elevated">
            {lead ? <ArticleCard article={lead} category={categories.find((item) => item.slug === lead.categorySlug)} featured /> : null}
          </div>
        </Container>
      </section>

      <Container className="stack-xl">
        <section className="two-column-highlight">
          <div>
            <SectionHeading
              eyebrow="Top Stories"
              title="Latest reporting from the newsroom"
              description="Coverage shaped by local realities, practical health questions, and public service value."
            />
          </div>
          <div className="mini-grid">
            {secondary.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categories.find((item) => item.slug === article.categorySlug)}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Categories"
            title="Coverage areas built for real community needs"
            description="Each desk combines explainers, field reporting, and local service updates."
          />
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="category-panel">
                <span className="category-swatch" style={{ backgroundColor: category.color }} />
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <strong>{category.statsLabel}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Latest Articles"
            title="Fresh reporting across the newsroom"
            description="A responsive article feed ready for desktop, tablet, and mobile reading."
          />
          <div className="article-grid">
            {latest.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categories.find((item) => item.slug === article.categorySlug)}
              />
            ))}
          </div>
        </section>

        <section className="video-section">
          <SectionHeading
            eyebrow="Video Briefings"
            title="Short explainers for readers on the move"
            description="Use these modules for embedded journalism, sponsored health explainers, or outreach campaigns."
          />
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        <section className="donation-callout">
          <div>
            <span className="eyebrow">{campaign.kicker}</span>
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
          </div>
          <div className="donation-stats">
            <div>
              <strong>{formatMoney(campaign.raisedAmount)}</strong>
              <span>Raised so far</span>
            </div>
            <div>
              <strong>{formatMoney(campaign.goalAmount)}</strong>
              <span>Funding goal</span>
            </div>
            <Link href="/donate" className="button button-primary">
              Donate Now
            </Link>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="surface-elevated">
            <SectionHeading
              eyebrow="Newsletter"
              title="Receive the week’s most useful health reporting"
              description="Newsletter signups are wired to Supabase when configured, with a zero-friction demo fallback during setup."
            />
            <NewsletterForm />
          </div>
          <div className="surface-elevated">
            <SectionHeading
              eyebrow="Contact"
              title="Share a story tip, question, or correction"
              description="This form stores submissions in Supabase once your project variables are connected."
            />
            <ContactForm />
          </div>
        </section>
      </Container>
    </main>
  );
}
