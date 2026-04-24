export type PublishStatus = "draft" | "published";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  statsLabel: string;
};

export type GalleryItem = {
  id: string;
  image: string;
  alt: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  status: PublishStatus;
  featured: boolean;
  featuredRank: number;
  categorySlug: string;
  tags: string[];
  gallery: GalleryItem[];
  metaTitle?: string;
  metaDescription?: string;
};

export type Video = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  duration: string;
  videoUrl: string;
  categorySlug: string;
  publishedAt: string;
};

export type InfoPage = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  updatedAt: string;
  heroImage: string;
};

export type DonationCampaign = {
  id: string;
  slug: string;
  kicker: string;
  title: string;
  description: string;
  raisedAmount: number;
  goalAmount: number;
  paymentLabel: string;
  paymentNumber: string;
  paymentLink?: string;
  image: string;
};

export type NewsletterSignup = {
  email: string;
  source: string;
};

export type DonationSubmission = {
  fullName: string;
  location: string;
  amount: number;
  paymentMethod: string;
  phone: string;
  email?: string;
  note?: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
};

export type SiteTheme = {
  primary: string;
  primaryDark: string;
  secondary: string;
  bg: string;
  surface: string;
  text: string;
};

export const defaultTheme: SiteTheme = {
  primary: "#2ecc8e",
  primaryDark: "#1ba870",
  secondary: "#153a28",
  bg: "#f7faf7",
  surface: "#ffffff",
  text: "#23312b"
};

export type SiteNavLink = { label: string; href: string };

export const defaultNavLinks: SiteNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/categories/community-health" },
  { label: "International", href: "/categories/international-news" },
  { label: "About", href: "/info/about" },
  { label: "Donate", href: "/donate" }
];

export const defaultFooterExploreLinks: SiteNavLink[] = [
  { label: "Community Health", href: "/categories/community-health" },
  { label: "Maternal Care", href: "/categories/maternal-care" },
  { label: "Mental Health", href: "/categories/mental-health" }
];

export const defaultFooterNewsroomLinks: SiteNavLink[] = [
  { label: "About", href: "/info/about" },
  { label: "Contact", href: "/info/contact" },
  { label: "Advertise", href: "/info/advertise" }
];

export type HomepageContent = {
  heroEyebrow: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  topStoriesEyebrow: string;
  topStoriesTitle: string;
  topStoriesDescription: string;
  categoriesEyebrow: string;
  categoriesTitle: string;
  categoriesDescription: string;
  latestEyebrow: string;
  latestTitle: string;
  latestDescription: string;
  videoEyebrow: string;
  videoTitle: string;
  videoDescription: string;
  donateBtn: string;
  newsletterEyebrow: string;
  newsletterTitle: string;
  newsletterDescription: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
};

export const defaultHomepageContent: HomepageContent = {
  heroEyebrow: "Community Health Desk",
  heroPrimaryBtn: "Read Lead Story",
  heroSecondaryBtn: "Support the Newsroom",
  topStoriesEyebrow: "Top Stories",
  topStoriesTitle: "Latest reporting from the newsroom",
  topStoriesDescription: "Coverage shaped by local realities, practical health questions, and public service value.",
  categoriesEyebrow: "Categories",
  categoriesTitle: "Coverage areas built for real community needs",
  categoriesDescription: "Each desk combines explainers, field reporting, and local service updates.",
  latestEyebrow: "Latest Articles",
  latestTitle: "Fresh reporting across the newsroom",
  latestDescription: "A responsive article feed ready for desktop, tablet, and mobile reading.",
  videoEyebrow: "Video Briefings",
  videoTitle: "Short explainers for readers on the move",
  videoDescription: "Use these modules for embedded journalism, sponsored health explainers, or outreach campaigns.",
  donateBtn: "Donate Now",
  newsletterEyebrow: "Newsletter",
  newsletterTitle: "Receive the week's most useful health reporting",
  newsletterDescription: "Newsletter signups are wired to Supabase when configured, with a zero-friction demo fallback during setup.",
  contactEyebrow: "Contact",
  contactTitle: "Share a story tip, question, or correction",
  contactDescription: "This form stores submissions in Supabase once your project variables are connected."
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  tickerItems: string[];
  featuredTopic: string;
  mission: string;
  contactEmail: string;
  socialLinks: SiteNavLink[];
  theme: SiteTheme;
  logoImage: string;
  heroImage: string;
  midSectionImage: string;
  navLinks: SiteNavLink[];
  footerExploreLinks: SiteNavLink[];
  footerNewsroomLinks: SiteNavLink[];
  footerCopyright: string;
  homepageContent: HomepageContent;
  metaDescription: string;
  ogImage: string;
  heroImageOpacity: number;
  imageContrast: number;
  imageSaturation: number;
  imageBrightness: number;
};

export type DashboardStats = {
  articleCount: number;
  categoryCount: number;
  newsletterCount: number;
  donationCount: number;
};

export type AdminContentInput =
  | {
      entityType: "post";
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      categorySlug: string;
      author: string;
      coverImage: string;
      status: PublishStatus;
      featured: boolean;
      featuredRank: number;
      readTime: string;
    }
  | {
      entityType: "category";
      slug: string;
      name: string;
      description: string;
      color: string;
      heroTitle: string;
      heroDescription: string;
      heroImage: string;
    }
  | {
      entityType: "page";
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      heroImage: string;
    }
  | {
      entityType: "video";
      slug: string;
      title: string;
      excerpt: string;
      thumbnail: string;
      duration: string;
      videoUrl: string;
      categorySlug: string;
      publishedAt: string;
    }
  | {
      entityType: "settings";
      siteName: string;
      tagline: string;
      featuredTopic: string;
      mission: string;
      contactEmail: string;
      tickerItems: string[];
      socialLinks: SiteNavLink[];
      theme: SiteTheme;
      logoImage: string;
      heroImage: string;
      midSectionImage: string;
      navLinks: SiteNavLink[];
      footerExploreLinks: SiteNavLink[];
      footerNewsroomLinks: SiteNavLink[];
      footerCopyright: string;
      homepageContent: HomepageContent;
      metaDescription: string;
      ogImage: string;
      heroImageOpacity: number;
      imageContrast: number;
      imageSaturation: number;
      imageBrightness: number;
    }
  | {
      entityType: "donation";
      slug: string;
      kicker: string;
      title: string;
      description: string;
      raisedAmount: number;
      goalAmount: number;
      paymentLabel: string;
      paymentNumber: string;
      paymentLink?: string;
      image: string;
      isActive: boolean;
    };

export type AdminDeleteInput = {
  entityType: "post" | "video" | "category" | "page";
  slug: string;
};
