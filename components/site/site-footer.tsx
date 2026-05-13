import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/repositories/cms-repository";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="site-footer">
      <Container className="footer-grid">
        <div>
          <h3>{settings.siteName}</h3>
          <p>{settings.mission}</p>
          {settings.footerCopyright ? (
            <small className="footer-copyright">{settings.footerCopyright}</small>
          ) : null}
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            {settings.footerExploreLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Newsroom</h4>
          <ul>
            {settings.footerNewsroomLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            {settings.socialLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="https://wa.me/233558813062" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </li>
            <li>
              <Link href="/admin/login">Dashboard Login</Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
