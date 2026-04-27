export const dynamic = "force-dynamic";

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
  const hpc = settings.homepageContent;

  const safeCssUrl = (v: string) =>
    /^(https?:\/\/|\/)[^\s"';<>{}|\\^`[\]]*$/.test(v) ? v : "";

  return (
    <main>
      <NewsTicker items={settings.tickerItems} />

      <section className="hero-section">
        {settings.heroImage && safeCssUrl(settings.heroImage) ? (
          <>
            <style dangerouslySetInnerHTML={{ __html: `.hero-bg{background-image:url("${safeCssUrl(settings.heroImage)}")}` }} />
            <div className="hero-bg" />
          </>
        ) : null}
        <Container className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{hpc.heroEyebrow}</span>
            <h1>{settings.featuredTopic}</h1>
            <p>{settings.mission}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href={lead ? `/articles/${lead.slug}` : "/categories/community-health"}>
                {hpc.heroPrimaryBtn}
              </Link>
              <Link className="button button-ghost" href="/donate">
                {hpc.heroSecondaryBtn}
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
              eyebrow={hpc.topStoriesEyebrow}
              title={hpc.topStoriesTitle}
              description={hpc.topStoriesDescription}
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
            eyebrow={hpc.categoriesEyebrow}
            title={hpc.categoriesTitle}
            description={hpc.categoriesDescription}
          />
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="category-panel">
                {category.heroImage ? (
                  <div className="category-img">
                    <img src={category.heroImage} alt={category.name} />
                  </div>
                ) : (
                  <span className="category-swatch" style={{ ["--swatch-color" as string]: category.color }} />
                )}
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <strong>{category.statsLabel}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow={hpc.latestEyebrow}
            title={hpc.latestTitle}
            description={hpc.latestDescription}
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

        {settings.midSectionImage && safeCssUrl(settings.midSectionImage) ? (
          <section className="mid-section-banner">
            <img src={safeCssUrl(settings.midSectionImage)} alt="Featured banner" />
          </section>
        ) : null}

        <section className="video-section">
          <SectionHeading
            eyebrow={hpc.videoEyebrow}
            title={hpc.videoTitle}
            description={hpc.videoDescription}
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
              {hpc.donateBtn}
            </Link>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="surface-elevated">
            <SectionHeading
              eyebrow={hpc.newsletterEyebrow}
              title={hpc.newsletterTitle}
              description={hpc.newsletterDescription}
            />
            <NewsletterForm />
          </div>
          <div className="surface-elevated">
            <SectionHeading
              eyebrow={hpc.contactEyebrow}
              title={hpc.contactTitle}
              description={hpc.contactDescription}
            />
            <ContactForm />
          </div>
        </section>
      </Container>
    </main>
  );
}
