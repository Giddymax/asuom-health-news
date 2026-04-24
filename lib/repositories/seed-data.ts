import type {
  Article,
  Category,
  DonationCampaign,
  InfoPage,
  SiteSettings,
  Video
} from "@/lib/types";
import {
  defaultFooterExploreLinks,
  defaultFooterNewsroomLinks,
  defaultHomepageContent,
  defaultNavLinks,
  defaultTheme
} from "@/lib/types";

export const seedSettings: SiteSettings = {
  siteName: "Asuom Health News",
  tagline: "Your Health Is Our Priority",
  featuredTopic: "Community-first health reporting for Eastern Region and beyond.",
  mission:
    "We publish practical, trusted health reporting for families, health workers, and local leaders across Ghana.",
  contactEmail: "info@asuomhealthnews.com",
  tickerItems: [
    "WHO reports new progress on malaria elimination across sub-Saharan Africa.",
    "Eastern Region expands maternal care outreach for rural clinics.",
    "Community clean water investments linked to lower child illness rates.",
    "Mental wellness campaign reaches 50,000 residents with local-language education."
  ],
  socialLinks: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" }
  ],
  theme: defaultTheme,
  logoImage: "/images/brand/ahn.jpg",
  heroImage: "",
  midSectionImage: "",
  navLinks: defaultNavLinks,
  footerExploreLinks: defaultFooterExploreLinks,
  footerNewsroomLinks: defaultFooterNewsroomLinks,
  footerCopyright: `© ${new Date().getFullYear()} Asuom Health News. All rights reserved.`,
  homepageContent: defaultHomepageContent,
  metaDescription:
    "Trusted community health journalism for families, health workers, and local leaders across Ghana.",
  ogImage: "",
  heroImageOpacity: 0.28,
  imageContrast: 1.16,
  imageSaturation: 1.2,
  imageBrightness: 1.03
};

export const seedCategories: Category[] = [
  {
    id: "cat-community",
    slug: "community-health",
    name: "Community Health",
    description: "Local clinic updates, outreach work, and practical prevention stories from the district.",
    color: "#2ECC8E",
    heroTitle: "Community health stories that start where people live.",
    heroDescription:
      "From vaccination drives to safe water access, these reports connect public health policy with lived community realities.",
    heroImage: "/images/placeholders/community.svg",
    statsLabel: "Community stories"
  },
  {
    id: "cat-maternal",
    slug: "maternal-care",
    name: "Maternal Care",
    description: "Pregnancy, newborn, and women’s health reporting grounded in evidence and empathy.",
    color: "#1BA870",
    heroTitle: "Maternal care coverage with dignity, clarity, and urgency.",
    heroDescription:
      "We follow the systems, education, and frontline care that shape safer pregnancies and healthier families.",
    heroImage: "/images/placeholders/maternal.svg",
    statsLabel: "Maternal care stories"
  },
  {
    id: "cat-mental",
    slug: "mental-health",
    name: "Mental Health",
    description: "Awareness, support, and practical guidance for emotional wellbeing and resilience.",
    color: "#0F9E60",
    heroTitle: "Mental health reporting that is calm, useful, and stigma-free.",
    heroDescription:
      "We spotlight local services, public education efforts, and lived experiences that make support easier to reach.",
    heroImage: "/images/placeholders/mental.svg",
    statsLabel: "Mental health stories"
  },
  {
    id: "cat-global",
    slug: "international-news",
    name: "International News",
    description: "Global health developments with clear context for local readers and health workers.",
    color: "#145C34",
    heroTitle: "Global health developments, translated for local impact.",
    heroDescription:
      "We track major international health updates and explain why they matter for Ghanaian communities and practitioners.",
    heroImage: "/images/placeholders/international.svg",
    statsLabel: "International reports"
  }
];

export const seedArticles: Article[] = [
  {
    id: "post-1",
    slug: "new-community-clinic-improves-preventive-care",
    title: "New community clinic improves preventive care access for five surrounding towns",
    excerpt:
      "A new facility is reducing travel time for screenings, child welfare services, and chronic care follow-ups.",
    body: [
      "Residents across five towns in the Asuom district are beginning to feel the practical impact of a new community clinic designed to bring essential preventive care closer to home.",
      "The clinic’s early services include blood pressure checks, antenatal support, immunisation follow-ups, child welfare reviews, and referral coordination for more specialised treatment when needed.",
      "Local health workers say the biggest early win is time. Families who once spent hours travelling for routine services can now access care in a single trip, making it easier to seek help earlier rather than waiting for symptoms to worsen.",
      "The district health team expects the clinic to strengthen record-keeping, improve continuity of care, and support broader health education campaigns through community outreach events."
    ],
    author: "Ama Boateng",
    publishedAt: "2026-04-15T09:00:00.000Z",
    readTime: "5 min read",
    coverImage: "/images/placeholders/clinic.svg",
    status: "published",
    featured: true,
    featuredRank: 1,
    categorySlug: "community-health",
    tags: ["Clinics", "Primary Care", "Eastern Region"],
    gallery: [
      { id: "gallery-1", image: "/images/placeholders/gallery-1.svg", alt: "Clinic waiting area" },
      { id: "gallery-2", image: "/images/placeholders/gallery-2.svg", alt: "Community outreach team" }
    ],
    metaTitle: "New community clinic improves preventive care access | Asuom Health News",
    metaDescription:
      "A new Asuom district clinic is making screenings, maternal care, and chronic care follow-ups easier to access."
  },
  {
    id: "post-2",
    slug: "maternal-outreach-programme-expands-home-visits",
    title: "Maternal outreach programme expands home visits for high-risk pregnancies",
    excerpt:
      "Midwives are extending home-based support to help expectant mothers keep appointments and spot warning signs earlier.",
    body: [
      "A maternal outreach programme in Eastern Region has expanded home visits for mothers who face transport, cost, or scheduling barriers that make clinic attendance difficult.",
      "Midwives involved in the programme say home visits help build trust and improve continuity, especially for pregnant women who need closer monitoring after earlier complications or long travel times.",
      "The expanded outreach also reinforces nutrition counselling, birth preparedness, medication adherence, and family support planning before delivery.",
      "Health officials say the programme is meant to complement, not replace, clinic care by making it easier for women to remain connected to professional support throughout pregnancy."
    ],
    author: "Mabel Owusu",
    publishedAt: "2026-04-10T10:15:00.000Z",
    readTime: "4 min read",
    coverImage: "/images/placeholders/midwife.svg",
    status: "published",
    featured: true,
    featuredRank: 2,
    categorySlug: "maternal-care",
    tags: ["Maternal Care", "Midwives", "Outreach"],
    gallery: [],
    metaTitle: "Maternal outreach programme expands home visits | Asuom Health News",
    metaDescription:
      "Midwives are extending home-based support to improve pregnancy follow-up and early warning sign detection."
  },
  {
    id: "post-3",
    slug: "mental-health-campaign-reaches-schools-and-market-women",
    title: "Mental health campaign reaches schools and market women with local-language support",
    excerpt:
      "A district-wide campaign is widening access to mental health education through practical, community-friendly conversations.",
    body: [
      "A district-wide mental health campaign is using schools, market spaces, and local radio conversations to bring practical mental wellbeing education closer to everyday life.",
      "Organisers say local-language communication has made a major difference, especially when discussing stress, grief, anxiety, and when to seek professional support.",
      "Teachers and traders involved in the campaign described the sessions as more useful when examples reflect work, caregiving, and financial pressure rather than relying on abstract clinical language alone.",
      "The programme will continue with referral partnerships so participants who need more support can be connected to trained providers."
    ],
    author: "Kwesi Larbi",
    publishedAt: "2026-04-05T13:30:00.000Z",
    readTime: "6 min read",
    coverImage: "/images/placeholders/mental-campaign.svg",
    status: "published",
    featured: false,
    featuredRank: 0,
    categorySlug: "mental-health",
    tags: ["Mental Health", "Education", "Community"],
    gallery: [],
    metaTitle: "Mental health campaign reaches schools and market women",
    metaDescription:
      "Schools and market spaces are becoming entry points for accessible mental health education in the district."
  },
  {
    id: "post-4",
    slug: "global-malaria-update-what-it-means-for-local-prevention",
    title: "Global malaria update: what new international guidance means for local prevention work",
    excerpt:
      "Recent global reporting highlights why local surveillance, mosquito control, and fast treatment still matter.",
    body: [
      "New global malaria reporting shows progress in some regions, but health leaders say local prevention work remains essential where climate, vector exposure, and access gaps still create risk.",
      "For communities in Ghana, the message is practical: insecticide-treated nets, timely testing, early treatment, and consistent district surveillance remain the backbone of malaria control.",
      "Public health teams also note that international progress can support local advocacy, especially when it helps attract funding, attention, and innovation for community-level response systems.",
      "Experts say the strongest outcomes still come from combining global evidence with local delivery that people can actually reach and trust."
    ],
    author: "Esi Appiah",
    publishedAt: "2026-03-28T08:20:00.000Z",
    readTime: "5 min read",
    coverImage: "/images/placeholders/malaria.svg",
    status: "published",
    featured: false,
    featuredRank: 0,
    categorySlug: "international-news",
    tags: ["Malaria", "WHO", "Prevention"],
    gallery: [],
    metaTitle: "Global malaria update and local prevention meaning",
    metaDescription:
      "A clear breakdown of how international malaria guidance maps onto practical prevention at community level."
  },
  {
    id: "post-5",
    slug: "nutrition-education-drive-supports-new-mothers",
    title: "Nutrition education drive supports new mothers with practical feeding guidance",
    excerpt:
      "Community educators are focusing on affordable, realistic food choices for postpartum recovery and infant feeding.",
    body: [
      "A community nutrition education drive is helping new mothers make practical feeding decisions using local foods, realistic budgets, and consistent support from frontline educators.",
      "The programme focuses on postpartum recovery, exclusive breastfeeding, food hygiene, and meal planning that reflects what families can actually source and prepare.",
      "Organisers say the sessions are most effective when caregivers can ask questions openly and leave with examples they recognise from daily life.",
      "Local health volunteers plan to continue the sessions alongside maternal care check-ins and child welfare visits."
    ],
    author: "Joana Aidoo",
    publishedAt: "2026-03-22T14:00:00.000Z",
    readTime: "4 min read",
    coverImage: "/images/placeholders/nutrition.svg",
    status: "published",
    featured: false,
    featuredRank: 0,
    categorySlug: "maternal-care",
    tags: ["Nutrition", "Breastfeeding", "Community Education"],
    gallery: [],
    metaTitle: "Nutrition education drive supports new mothers",
    metaDescription:
      "Local educators are sharing practical postpartum and infant feeding guidance with new mothers."
  },
  {
    id: "post-6",
    slug: "water-and-sanitation-project-lowers-child-illness-risks",
    title: "Water and sanitation project lowers child illness risks in vulnerable communities",
    excerpt:
      "Better access to clean water and handwashing facilities is reshaping how families prevent avoidable illness.",
    body: [
      "A district water and sanitation project is helping families reduce exposure to avoidable childhood illness by improving access to cleaner water points and practical hygiene education.",
      "Local leaders say the combination matters. Infrastructure alone is not enough if households do not also receive clear, repeated guidance on storage, handling, and handwashing.",
      "Health workers involved in the programme say they are already hearing fewer reports of repeated stomach illness from some communities benefiting from the first phase.",
      "The project is expected to continue with school partnerships and household demonstrations that keep prevention visible over time."
    ],
    author: "Samuel Tetteh",
    publishedAt: "2026-03-16T11:40:00.000Z",
    readTime: "5 min read",
    coverImage: "/images/placeholders/water.svg",
    status: "published",
    featured: false,
    featuredRank: 0,
    categorySlug: "community-health",
    tags: ["Water", "Sanitation", "Child Health"],
    gallery: [],
    metaTitle: "Water and sanitation project lowers child illness risks",
    metaDescription:
      "Improved clean water access and hygiene education are helping reduce preventable child illness."
  }
];

export const seedVideos: Video[] = [
  {
    id: "video-1",
    slug: "postnatal-care-basics",
    title: "Postnatal care basics every new family should know",
    excerpt: "A quick explainer on recovery, warning signs, and support after birth.",
    thumbnail: "/images/placeholders/video-postnatal.svg",
    duration: "7:21",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    categorySlug: "maternal-care",
    publishedAt: "2026-04-18T09:10:00.000Z"
  },
  {
    id: "video-2",
    slug: "preventing-malaria-at-home",
    title: "Preventing malaria at home with simple routines that work",
    excerpt: "Bed nets, testing, and home habits that lower risk.",
    thumbnail: "/images/placeholders/video-malaria.svg",
    duration: "5:48",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    categorySlug: "international-news",
    publishedAt: "2026-04-08T09:10:00.000Z"
  },
  {
    id: "video-3",
    slug: "stress-support-for-caregivers",
    title: "Stress support for caregivers balancing work and family",
    excerpt: "A calm, practical conversation on boundaries, rest, and support-seeking.",
    thumbnail: "/images/placeholders/video-stress.svg",
    duration: "6:14",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    categorySlug: "mental-health",
    publishedAt: "2026-03-30T09:10:00.000Z"
  }
];

export const seedPages: InfoPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "About Asuom Health News",
    excerpt: "A community-focused health newsroom serving readers with clear, practical reporting.",
    content: [
      "Asuom Health News is a community-first health journalism platform dedicated to making reliable health information easier to understand and easier to use.",
      "We report on primary care, maternal health, mental wellbeing, nutrition, public health policy, and district-level health stories that affect daily life.",
      "Our editorial approach is simple: factual reporting, accessible language, and consistent respect for the people and communities we cover."
    ],
    updatedAt: "2026-04-01T09:00:00.000Z",
    heroImage: "/images/placeholders/about.svg"
  },
  {
    id: "page-advertise",
    slug: "advertise",
    title: "Advertise With Us",
    excerpt: "Reach a health-conscious local audience without compromising editorial trust.",
    content: [
      "We offer selected advertising placements, newsletter sponsorships, and branded awareness opportunities for organisations whose work aligns with community health outcomes.",
      "Every campaign is reviewed carefully so sponsored visibility never weakens reader trust or misrepresents health information.",
      "To request our media kit, send a note to info@asuomhealthnews.com and share your campaign goals, timeline, and preferred placement."
    ],
    updatedAt: "2026-04-03T09:00:00.000Z",
    heroImage: "/images/placeholders/advertise.svg"
  },
  {
    id: "page-contact",
    slug: "contact",
    title: "Contact the Newsroom",
    excerpt: "Reach the editorial team for story tips, partnerships, corrections, or support.",
    content: [
      "We welcome story ideas, corrections, newsroom questions, and partnership enquiries from readers, health workers, and organisations.",
      "Use the contact form on the homepage or email info@asuomhealthnews.com. We review incoming messages daily and route urgent health misinformation concerns faster.",
      "If you are sharing a sensitive story tip, include only the details you are comfortable sending initially."
    ],
    updatedAt: "2026-04-04T09:00:00.000Z",
    heroImage: "/images/placeholders/contact.svg"
  }
];

export const seedDonationCampaign: DonationCampaign = {
  id: "campaign-1",
  slug: "community-reporting-fund",
  kicker: "Current Health Cause",
  title: "Help us expand trusted health reporting into more communities",
  description:
    "Your support helps us fund field reporting, photography, district outreach, and clearer local-language health journalism.",
  raisedAmount: 8400,
  goalAmount: 25000,
  paymentLabel: "Asuom Health News Fund",
  paymentNumber: "+233 24 000 0000",
  paymentLink: "https://example.com/pay",
  image: "/images/placeholders/donate.svg"
};
