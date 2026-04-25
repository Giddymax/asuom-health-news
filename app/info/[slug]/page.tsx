export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { ContactForm } from "@/components/site/contact-form";
import { Container } from "@/components/ui/container";
import { getInfoPageBySlug } from "@/lib/repositories/cms-repository";
import { formatDate } from "@/lib/utils";

type InfoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const page = await getInfoPageBySlug(slug);

  if (!page) notFound();

  return (
    <main>
      <section className="simple-hero">
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
