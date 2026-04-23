import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().min(2).max(100)
});

export const donationSchema = z.object({
  fullName: z.string().min(2).max(120),
  location: z.string().min(2).max(120),
  amount: z.coerce.number().positive(),
  paymentMethod: z.string().min(2).max(80),
  phone: z.string().min(5).max(40),
  email: z.string().email().optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal(""))
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  topic: z.string().min(2).max(120),
  message: z.string().min(10).max(1500)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const adminContentSchema = z.discriminatedUnion("entityType", [
  z.object({
    entityType: z.literal("post"),
    slug: z.string().min(2),
    title: z.string().min(2),
    excerpt: z.string().min(10),
    content: z.string().min(20),
    categorySlug: z.string().min(2),
    author: z.string().min(2),
    coverImage: z.string().min(2),
    status: z.enum(["draft", "published"]),
    featured: z.coerce.boolean(),
    featuredRank: z.coerce.number().int().min(0),
    readTime: z.string().min(2)
  }),
  z.object({
    entityType: z.literal("category"),
    slug: z.string().min(2),
    name: z.string().min(2),
    description: z.string().min(10),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    heroTitle: z.string().min(10),
    heroDescription: z.string().min(20),
    heroImage: z.string().min(2)
  }),
  z.object({
    entityType: z.literal("page"),
    slug: z.string().min(2),
    title: z.string().min(2),
    excerpt: z.string().min(10),
    content: z.string().min(20),
    heroImage: z.string().min(2)
  }),
  z.object({
    entityType: z.literal("video"),
    slug: z.string().min(2),
    title: z.string().min(2),
    excerpt: z.string().min(10),
    thumbnail: z.string().min(2),
    duration: z.string().min(2),
    videoUrl: z.string().url(),
    categorySlug: z.string().min(2),
    publishedAt: z.string().min(4)
  }),
  z.object({
    entityType: z.literal("settings"),
    siteName: z.string().min(2),
    tagline: z.string().min(2),
    featuredTopic: z.string().min(10),
    mission: z.string().min(20),
    contactEmail: z.string().email(),
    tickerItems: z.array(z.string().min(2)),
    socialLinks: z.array(
      z.object({
        label: z.string().min(2),
        href: z.string().url()
      })
    ),
    theme: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
      primaryDark: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
      bg: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
      surface: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
      text: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/)
    }),
    logoImage: z.string(),
    heroImage: z.string(),
    midSectionImage: z.string(),
    navLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    footerExploreLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    footerNewsroomLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    footerCopyright: z.string(),
    homepageContent: z.object({
      heroEyebrow: z.string(),
      heroPrimaryBtn: z.string(),
      heroSecondaryBtn: z.string(),
      topStoriesEyebrow: z.string(),
      topStoriesTitle: z.string(),
      topStoriesDescription: z.string(),
      categoriesEyebrow: z.string(),
      categoriesTitle: z.string(),
      categoriesDescription: z.string(),
      latestEyebrow: z.string(),
      latestTitle: z.string(),
      latestDescription: z.string(),
      videoEyebrow: z.string(),
      videoTitle: z.string(),
      videoDescription: z.string(),
      donateBtn: z.string(),
      newsletterEyebrow: z.string(),
      newsletterTitle: z.string(),
      newsletterDescription: z.string(),
      contactEyebrow: z.string(),
      contactTitle: z.string(),
      contactDescription: z.string()
    }),
    metaDescription: z.string(),
    ogImage: z.string()
  }),
  z.object({
    entityType: z.literal("donation"),
    slug: z.string().min(2),
    kicker: z.string().min(2),
    title: z.string().min(10),
    description: z.string().min(20),
    raisedAmount: z.coerce.number().min(0),
    goalAmount: z.coerce.number().positive(),
    paymentLabel: z.string().min(2),
    paymentNumber: z.string().min(2),
    paymentLink: z.string().url().optional().or(z.literal("")),
    image: z.string().min(2),
    isActive: z.coerce.boolean()
  })
]);

export const adminDeleteSchema = z.object({
  entityType: z.enum(["post", "video", "category", "page"]),
  slug: z.string().min(2)
});
