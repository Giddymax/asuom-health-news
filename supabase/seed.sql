-- Demo seed data for Asuom Health News
-- Run via: supabase db reset  (applies migrations + this file)
-- Or manually in the Supabase SQL editor.

-- Categories
insert into categories (slug, name, description, color, hero_title, hero_description, hero_image_path, stats_label)
values
  ('community-health', 'Community Health', 'Local clinic updates, outreach work, and practical prevention stories from the district.', '#2ECC8E', 'Community health stories that start where people live.', 'From vaccination drives to safe water access, these reports connect public health policy with lived community realities.', '/images/placeholders/community.svg', 'Community stories'),
  ('maternal-care', 'Maternal Care', 'Pregnancy, newborn, and women''s health reporting grounded in evidence and empathy.', '#1BA870', 'Maternal care coverage with dignity, clarity, and urgency.', 'We follow the systems, education, and frontline care that shape safer pregnancies and healthier families.', '/images/placeholders/maternal.svg', 'Maternal care stories'),
  ('mental-health', 'Mental Health', 'Awareness, support, and practical guidance for emotional wellbeing and resilience.', '#0F9E60', 'Mental health reporting that is calm, useful, and stigma-free.', 'We spotlight local services, public education efforts, and lived experiences that make support easier to reach.', '/images/placeholders/mental.svg', 'Mental health stories'),
  ('international-news', 'International News', 'Global health developments with clear context for local readers and health workers.', '#145C34', 'Global health developments, translated for local impact.', 'We track major international health updates and explain why they matter for Ghanaian communities and practitioners.', '/images/placeholders/international.svg', 'International reports')
on conflict (slug) do nothing;

-- Posts
insert into posts (slug, title, excerpt, body, category_id, author_name, published_at, read_time_label, cover_image_path, status, featured, featured_rank, tags, meta_title, meta_description)
values
  (
    'new-community-clinic-improves-preventive-care',
    'New community clinic improves preventive care access for five surrounding towns',
    'A new facility is reducing travel time for screenings, child welfare services, and chronic care follow-ups.',
    'Residents across five towns in the Asuom district are beginning to feel the practical impact of a new community clinic designed to bring essential preventive care closer to home.' || chr(10) || chr(10) ||
    'The clinic''s early services include blood pressure checks, antenatal support, immunisation follow-ups, child welfare reviews, and referral coordination for more specialised treatment when needed.' || chr(10) || chr(10) ||
    'Local health workers say the biggest early win is time. Families who once spent hours travelling for routine services can now access care in a single trip, making it easier to seek help earlier rather than waiting for symptoms to worsen.' || chr(10) || chr(10) ||
    'The district health team expects the clinic to strengthen record-keeping, improve continuity of care, and support broader health education campaigns through community outreach events.',
    (select id from categories where slug = 'community-health'),
    'Ama Boateng', '2026-04-15T09:00:00.000Z', '5 min read', '/images/placeholders/clinic.svg',
    'published', true, 1, array['Clinics','Primary Care','Eastern Region'],
    'New community clinic improves preventive care access | Asuom Health News',
    'A new Asuom district clinic is making screenings, maternal care, and chronic care follow-ups easier to access.'
  ),
  (
    'maternal-outreach-programme-expands-home-visits',
    'Maternal outreach programme expands home visits for high-risk pregnancies',
    'Midwives are extending home-based support to help expectant mothers keep appointments and spot warning signs earlier.',
    'A maternal outreach programme in Eastern Region has expanded home visits for mothers who face transport, cost, or scheduling barriers that make clinic attendance difficult.' || chr(10) || chr(10) ||
    'Midwives involved in the programme say home visits help build trust and improve continuity, especially for pregnant women who need closer monitoring after earlier complications or long travel times.' || chr(10) || chr(10) ||
    'The expanded outreach also reinforces nutrition counselling, birth preparedness, medication adherence, and family support planning before delivery.' || chr(10) || chr(10) ||
    'Health officials say the programme is meant to complement, not replace, clinic care by making it easier for women to remain connected to professional support throughout pregnancy.',
    (select id from categories where slug = 'maternal-care'),
    'Mabel Owusu', '2026-04-10T10:15:00.000Z', '4 min read', '/images/placeholders/midwife.svg',
    'published', true, 2, array['Maternal Care','Midwives','Outreach'],
    'Maternal outreach programme expands home visits | Asuom Health News',
    'Midwives are extending home-based support to improve pregnancy follow-up and early warning sign detection.'
  ),
  (
    'mental-health-campaign-reaches-schools-and-market-women',
    'Mental health campaign reaches schools and market women with local-language support',
    'A district-wide campaign is widening access to mental health education through practical, community-friendly conversations.',
    'A district-wide mental health campaign is using schools, market spaces, and local radio conversations to bring practical mental wellbeing education closer to everyday life.' || chr(10) || chr(10) ||
    'Organisers say local-language communication has made a major difference, especially when discussing stress, grief, anxiety, and when to seek professional support.' || chr(10) || chr(10) ||
    'Teachers and traders involved in the campaign described the sessions as more useful when examples reflect work, caregiving, and financial pressure rather than relying on abstract clinical language alone.' || chr(10) || chr(10) ||
    'The programme will continue with referral partnerships so participants who need more support can be connected to trained providers.',
    (select id from categories where slug = 'mental-health'),
    'Kwesi Larbi', '2026-04-05T13:30:00.000Z', '6 min read', '/images/placeholders/mental-campaign.svg',
    'published', false, 0, array['Mental Health','Education','Community'],
    'Mental health campaign reaches schools and market women',
    'Schools and market spaces are becoming entry points for accessible mental health education in the district.'
  ),
  (
    'global-malaria-update-what-it-means-for-local-prevention',
    'Global malaria update: what new international guidance means for local prevention work',
    'Recent global reporting highlights why local surveillance, mosquito control, and fast treatment still matter.',
    'New global malaria reporting shows progress in some regions, but health leaders say local prevention work remains essential where climate, vector exposure, and access gaps still create risk.' || chr(10) || chr(10) ||
    'For communities in Ghana, the message is practical: insecticide-treated nets, timely testing, early treatment, and consistent district surveillance remain the backbone of malaria control.' || chr(10) || chr(10) ||
    'Public health teams also note that international progress can support local advocacy, especially when it helps attract funding, attention, and innovation for community-level response systems.' || chr(10) || chr(10) ||
    'Experts say the strongest outcomes still come from combining global evidence with local delivery that people can actually reach and trust.',
    (select id from categories where slug = 'international-news'),
    'Esi Appiah', '2026-03-28T08:20:00.000Z', '5 min read', '/images/placeholders/malaria.svg',
    'published', false, 0, array['Malaria','WHO','Prevention'],
    'Global malaria update and local prevention meaning',
    'A clear breakdown of how international malaria guidance maps onto practical prevention at community level.'
  ),
  (
    'nutrition-education-drive-supports-new-mothers',
    'Nutrition education drive supports new mothers with practical feeding guidance',
    'Community educators are focusing on affordable, realistic food choices for postpartum recovery and infant feeding.',
    'A community nutrition education drive is helping new mothers make practical feeding decisions using local foods, realistic budgets, and consistent support from frontline educators.' || chr(10) || chr(10) ||
    'The programme focuses on postpartum recovery, exclusive breastfeeding, food hygiene, and meal planning that reflects what families can actually source and prepare.' || chr(10) || chr(10) ||
    'Organisers say the sessions are most effective when caregivers can ask questions openly and leave with examples they recognise from daily life.' || chr(10) || chr(10) ||
    'Local health volunteers plan to continue the sessions alongside maternal care check-ins and child welfare visits.',
    (select id from categories where slug = 'maternal-care'),
    'Joana Aidoo', '2026-03-22T14:00:00.000Z', '4 min read', '/images/placeholders/nutrition.svg',
    'published', false, 0, array['Nutrition','Breastfeeding','Community Education'],
    'Nutrition education drive supports new mothers',
    'Local educators are sharing practical postpartum and infant feeding guidance with new mothers.'
  ),
  (
    'water-and-sanitation-project-lowers-child-illness-risks',
    'Water and sanitation project lowers child illness risks in vulnerable communities',
    'Better access to clean water and handwashing facilities is reshaping how families prevent avoidable illness.',
    'A district water and sanitation project is helping families reduce exposure to avoidable childhood illness by improving access to cleaner water points and practical hygiene education.' || chr(10) || chr(10) ||
    'Local leaders say the combination matters. Infrastructure alone is not enough if households do not also receive clear, repeated guidance on storage, handling, and handwashing.' || chr(10) || chr(10) ||
    'Health workers involved in the programme say they are already hearing fewer reports of repeated stomach illness from some communities benefiting from the first phase.' || chr(10) || chr(10) ||
    'The project is expected to continue with school partnerships and household demonstrations that keep prevention visible over time.',
    (select id from categories where slug = 'community-health'),
    'Samuel Tetteh', '2026-03-16T11:40:00.000Z', '5 min read', '/images/placeholders/water.svg',
    'published', false, 0, array['Water','Sanitation','Child Health'],
    'Water and sanitation project lowers child illness risks',
    'Improved clean water access and hygiene education are helping reduce preventable child illness.'
  )
on conflict (slug) do nothing;

-- Videos
insert into videos (slug, title, excerpt, thumbnail_path, duration_label, video_url, category_slug, published_at)
values
  ('postnatal-care-basics', 'Postnatal care basics every new family should know', 'A quick explainer on recovery, warning signs, and support after birth.', '/images/placeholders/video-postnatal.svg', '7:21', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'maternal-care', '2026-04-18T09:10:00.000Z'),
  ('preventing-malaria-at-home', 'Preventing malaria at home with simple routines that work', 'Bed nets, testing, and home habits that lower risk.', '/images/placeholders/video-malaria.svg', '5:48', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'international-news', '2026-04-08T09:10:00.000Z'),
  ('stress-support-for-caregivers', 'Stress support for caregivers balancing work and family', 'A calm, practical conversation on boundaries, rest, and support-seeking.', '/images/placeholders/video-stress.svg', '6:14', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'mental-health', '2026-03-30T09:10:00.000Z')
on conflict (slug) do nothing;

-- Info pages
insert into pages (slug, title, excerpt, content, hero_image_path)
values
  ('about', 'About Asuom Health News', 'A community-focused health newsroom serving readers with clear, practical reporting.', 'Asuom Health News is a community-first health journalism platform dedicated to making reliable health information easier to understand and easier to use.' || chr(10) || chr(10) || 'We report on primary care, maternal health, mental wellbeing, nutrition, public health policy, and district-level health stories that affect daily life.' || chr(10) || chr(10) || 'Our editorial approach is simple: factual reporting, accessible language, and consistent respect for the people and communities we cover.', '/images/placeholders/about.svg'),
  ('advertise', 'Advertise With Us', 'Reach a health-conscious local audience without compromising editorial trust.', 'We offer selected advertising placements, newsletter sponsorships, and branded awareness opportunities for organisations whose work aligns with community health outcomes.' || chr(10) || chr(10) || 'Every campaign is reviewed carefully so sponsored visibility never weakens reader trust or misrepresents health information.' || chr(10) || chr(10) || 'To request our media kit, send a note to info@asuomhealthnews.com and share your campaign goals, timeline, and preferred placement.', '/images/placeholders/advertise.svg'),
  ('contact', 'Contact the Newsroom', 'Reach the editorial team for story tips, partnerships, corrections, or support.', 'We welcome story ideas, corrections, newsroom questions, and partnership enquiries from readers, health workers, and organisations.' || chr(10) || chr(10) || 'Use the contact form on the homepage or email info@asuomhealthnews.com. We review incoming messages daily and route urgent health misinformation concerns faster.' || chr(10) || chr(10) || 'If you are sharing a sensitive story tip, include only the details you are comfortable sending initially.', '/images/placeholders/contact.svg')
on conflict (slug) do nothing;

-- Donation campaign
insert into donation_campaigns (slug, kicker, title, description, raised_amount, goal_amount, payment_label, payment_number, payment_link, image_path, is_active)
values (
  'community-reporting-fund',
  'Current Health Cause',
  'Help us expand trusted health reporting into more communities',
  'Your support helps us fund field reporting, photography, district outreach, and clearer local-language health journalism.',
  8400, 25000,
  'Asuom Health News Fund',
  '+233 24 000 0000',
  'https://example.com/pay',
  '/images/placeholders/donate.svg',
  true
)
on conflict (slug) do nothing;

-- Site settings (insert only if empty)
insert into site_settings (site_name, tagline, featured_topic, mission, contact_email, ticker_items, social_links)
select
  'Asuom Health News',
  'Your Health Is Our Priority',
  'Community-first health reporting for Eastern Region and beyond.',
  'We publish practical, trusted health reporting for families, health workers, and local leaders across Ghana.',
  'info@asuomhealthnews.com',
  '["WHO reports new progress on malaria elimination across sub-Saharan Africa.","Eastern Region expands maternal care outreach for rural clinics.","Community clean water investments linked to lower child illness rates.","Mental wellness campaign reaches 50,000 residents with local-language education."]'::jsonb,
  '[{"label":"Facebook","href":"https://facebook.com"},{"label":"Instagram","href":"https://instagram.com"},{"label":"YouTube","href":"https://youtube.com"}]'::jsonb
where not exists (select 1 from site_settings);
