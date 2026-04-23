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

export type SiteSettings = {
  siteName: string;
  tagline: string;
  tickerItems: string[];
  featuredTopic: string;
  mission: string;
  contactEmail: string;
  socialLinks: Array<{ label: string; href: string }>;
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
      socialLinks: Array<{ label: string; href: string }>;
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
