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
              <Link href="/admin/login" className="footer-settings-link" aria-label="Dashboard login">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.04.08a2 2 0 0 1-3.84 0L10.08 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.08-.04a2 2 0 0 1 0-3.84L4 10.08a1.7 1.7 0 0 0 .6-1A1.7 1.7 0 0 0 4.26 7.2l-.06-.06A2 2 0 1 1 7.03 4.3l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.04-.08a2 2 0 0 1 3.84 0L13.92 4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.22.37.47.72.6 1l.08.04a2 2 0 0 1 0 3.84L20 13.92a1.7 1.7 0 0 0-.6 1.08Z" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
