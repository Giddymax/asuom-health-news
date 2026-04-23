import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/repositories/cms-repository";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/categories/community-health", label: "Community" },
  { href: "/categories/international-news", label: "International" },
  { href: "/info/about", label: "About" },
  { href: "/donate", label: "Donate" }
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="site-header">
      <Container className="header-shell">
        <Link href="/" className="brand-mark">
          <Image src="/images/brand/ahn.jpg" alt="Asuom Health News" width={52} height={52} priority />
          <span>
            <strong>{settings.siteName}</strong>
            <small>{settings.tagline}</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/info/contact" className="button button-ghost">
            Contact
          </Link>
          <Link href="/admin/login" className="button button-primary">
            Admin
          </Link>
        </div>
      </Container>
    </header>
  );
}
