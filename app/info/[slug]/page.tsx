export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { ContactForm } from "@/components/site/contact-form";
import { Container } from "@/components/ui/container";
import { getInfoPageBySlug } from "@/lib/repositories/cms-repository";
import { formatDate } from "@/lib/utils";

type InfoPageProps = {
  params: Promise<{ slug: string }>;
};

const safeCssUrl = (v: string) =>
  /^(https?:\/\/|\/)[^\s"';<>{}|\\^`[\]]*$/.test(v) ? v : "";

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);

  if (!page) notFound();

  return (
    <main>
      <section className="simple-hero">
        {page.heroImage && safeCssUrl(page.heroImage) ? (
          <>
            <style dangerouslySetInnerHTML={{ __html: `.simple-hero-bg{background-image:url("${safeCssUrl(page.heroImage)}")}` }} />
            <div className="simple-hero-bg" />
          </>
        ) : null}
        <Container>
          <span className="eyebrow">Information</span>
          <h1>{page.title}</h1>
          <p>{page.excerpt}</p>
        </Container>
      </section>
      <Container className="info-layout">
        <article className="surface-elevated prose-panel">
          {page.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <small>Updated {formatDate(page.updatedAt)}</small>
        </article>
        {page.slug === "contact" ? (
          <div className="surface-elevated">
            <ContactForm />
          </div>
        ) : null}
      </Container>
    </main>
  );
}
