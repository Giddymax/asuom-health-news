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
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link href="/categories/community-health">Community Health</Link>
            </li>
            <li>
              <Link href="/categories/maternal-care">Maternal Care</Link>
            </li>
            <li>
              <Link href="/categories/mental-health">Mental Health</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Newsroom</h4>
          <ul>
            <li>
              <Link href="/info/about">About</Link>
            </li>
            <li>
              <Link href="/info/contact">Contact</Link>
            </li>
            <li>
              <Link href="/info/advertise">Advertise</Link>
            </li>
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
              <Link href="/admin/login">Dashboard Login</Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
