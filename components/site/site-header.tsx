import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/repositories/cms-repository";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="site-header">
      <Container className="header-shell">
        <Link href="/" className="brand-mark">
          <Image
            src={settings.logoImage || "/images/brand/ahn.jpg"}
            alt={settings.siteName}
            width={52}
            height={52}
            priority
          />
          <span>
            <strong>{settings.siteName}</strong>
            <small>{settings.tagline}</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Primary">
          {settings.navLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/info/contact" className="button button-primary">
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
