import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/site/article-card";
import { VideoCard } from "@/components/site/video-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCategoryBySlug,
  listArticlesByCategory,
  listCategories,
  listVideos
} from "@/lib/repositories/cms-repository";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, categories, articles, videos] = await Promise.all([
    getCategoryBySlug(slug),
    listCategories(),
    listArticlesByCategory(slug),
    listVideos()
  ]);

  if (!category) notFound();

  const matchingVideos = videos.filter((video) => video.categorySlug === slug);

  const safeCssUrl = (v: string) =>
    /^(https?:\/\/|\/)[^\s"';<>{}|\\^`[\]]*$/.test(v) ? v : "";

  return (
    <main>
      <section className="category-hero" style={{ "--category-color": category.color } as CSSProperties}>
        {category.heroImage && safeCssUrl(category.heroImage) ? (
          <>
            <style dangerouslySetInnerHTML={{ __html: `.category-hero-bg{background-image:url("${safeCssUrl(category.heroImage)}")}` }} />
            <div className="category-hero-bg" />
          </>
        ) : null}
        <Container className="category-hero-grid">
          <div>
            <span className="eyebrow">{category.name}</span>
            <h1>{category.heroTitle}</h1>
            <p>{category.heroDescription}</p>
            <Link className="button button-primary" href="/donate">
              Support Coverage
            </Link>
          </div>
          <div className="category-summary surface-elevated">
            <strong>{articles.length}</strong>
            <span>Published stories</span>
            <strong>{matchingVideos.length}</strong>
            <span>Video briefings</span>
          </div>
        </Container>
      </section>

      <Container className="stack-xl">
        <section>
          <SectionHeading
            eyebrow="Stories"
            title={`${category.name} reporting`}
            description={category.description}
          />
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={categories.find((item) => item.slug === article.categorySlug)}
              />
            ))}
          </div>
        </section>

        {matchingVideos.length ? (
          <section>
            <SectionHeading
              eyebrow="Video"
              title={`${category.name} video explainers`}
              description="A dedicated video shelf for short, practical health briefings."
            />
            <div className="video-grid">
              {matchingVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
