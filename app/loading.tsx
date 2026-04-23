import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main className="simple-hero">
      <Container className="surface-elevated">
        <span className="eyebrow">Loading</span>
        <h1>Preparing the newsroom.</h1>
        <p>The content layer is loading and the responsive layout is getting ready.</p>
      </Container>
    </main>
  );
}
