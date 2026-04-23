import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="simple-hero">
      <Container className="surface-elevated" style={{ paddingBottom: 48 }}>
        <span className="eyebrow">404</span>
        <h1>We couldn’t find that page.</h1>
        <p>
          The link may be outdated, or the content may not have been published yet. Return to the
          homepage to keep exploring.
        </p>
        <Link href="/" className="button button-primary">
          Back to Homepage
        </Link>
      </Container>
    </main>
  );
}
