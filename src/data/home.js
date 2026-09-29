/**
 * =====================================================================
 *  ZNFU home page — single source of truth for all page content.
 * =====================================================================
 *
 *  ⚠️  TODO (needs sign-off from the ZNFU secretariat before launch):
 *
 *      1. `stats` figures — only "1905" is verified. The member,
 *         association and commodity counts are placeholders.
 *      2. `news` items — sample headlines written to demonstrate the
 *         layout. Replace with real newsroom output.
 *      3. `systems.prices` — sample e-Farm Prices rows. Replace with the
 *         current weekly price book.
 *      4. `vision` — drafted copy, not Union-approved wording.
 *      5. `partners` / `affiliations` — confirm which relationships may
 *         be published, and supply approved logos.
 *
 *  Facts taken from ZNFU's own published material (safe to keep):
 *      · founded 1905, non-political, member-led
 *      · Farmers' Village, Tiyende Pamodzi Road, Showgrounds, Lusaka
 *      · P.O. Box 30395 · +260 211 252 649 / 255 769 · info@znfu.org.zm
 *      · core functions: lobbying & advocacy, member services, information
 * =====================================================================
 */

/* ------------------------------------------------------------------ */
/*  Brand assets                                                       */
/* ------------------------------------------------------------------ */
/**
 * Imported through the bundler (not copied into /public) so Vite hashes it
 * and emits it for both dev and production builds.
 */
import znfuLogo from '../../assets/znfu-logo.jpeg'

export const logo = znfuLogo

/* ------------------------------------------------------------------ */
/*  Media — everything is served from /public/media                    */
/* ------------------------------------------------------------------ */
export const media = {
  heroForeground: {
    mp4: '/media/hero-foreground.mp4',
    poster: '/media/hero-foreground-poster.jpg',
  },
  heroBackground: {
    mp4: '/media/hero-background.mp4',
    poster: '/media/hero-background-poster.jpg',
  },
  fieldFootage: {
    mp4: '/media/field-footage.mp4',
    poster: '/media/field-footage-poster.jpg',
  },
  fieldSoybeanTeam: '/media/field-soybean-team.jpg',
  livestockCattleWater: '/media/livestock-cattle-water.jpg',
  livestockGoatsKraal: '/media/livestock-goats-kraal.jpg',
  horticulturePassionFruit: '/media/horticulture-passion-fruit.jpg',
  fieldMaizeDemoDay: '/media/field-maize-demo-day.jpg',
  gardenSunsetIrrigation: '/media/garden-sunset-irrigation.jpg',
  haulageAerialHarvest: '/media/haulage-aerial-harvest.jpg',
  producePeppersBaskets: '/media/produce-peppers-baskets.jpg',
  growerCabbageField: '/media/grower-cabbage-field.jpg',
  growerMaizeField: '/media/grower-maize-field.jpg',
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Systems', href: '#systems' },
  { label: 'News', href: '#news' },
  { label: 'Membership', href: '#membership' },
  { label: 'Contact', href: '#contact' },
]

export const brand = {
  fullName: 'Zambia National Farmers’ Union',
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export const hero = {
  title: 'Growing Zambia, Together',
  eyebrow: 'Est. 1905 · Lusaka, Zambia',
  scrollHint: 'Scroll to expand',
  tagline: 'A united voice for Zambian agriculture.',
  body: 'The Zambia National Farmers’ Union is a non-political, member-led union that promotes and safeguards the interests of farmers, commodity associations and agribusinesses across Zambia.',
  primaryCta: { label: 'Become a member', href: '#membership' },
  secondaryCta: { label: 'Explore the Union', href: '#about' },
}

/* ------------------------------------------------------------------ */
/*  By the numbers  ⚠️ unverified figures below (see TODO note above)  */
/* ------------------------------------------------------------------ */
export const stats = {
  eyebrow: 'By the numbers',
  title: 'One industry voice, more than a century strong.',
  items: [
    { value: 1905, label: 'Founded in Lusaka', prefix: '', suffix: '', raw: true },
    { value: 250, label: 'Thousand farmers represented', suffix: 'k+' },
    { value: 90, label: 'District Farmers’ Associations', suffix: '+' },
    { value: 30, label: 'Commodity associations', suffix: '+' },
  ],
  footnote: 'Figures are indicative and pending confirmation by the Union.',
}

/* ------------------------------------------------------------------ */
/*  Purpose / Vision                                                   */
/* ------------------------------------------------------------------ */
export const purposeVision = {
  eyebrow: 'Who we are',
  title: 'A member-led union for every Zambian farmer.',
  lede: 'From small-scale growers in the most distant districts to large commercial operations, ZNFU exists so that Zambian agriculture speaks, negotiates and plans as one industry.',
  image: media.fieldSoybeanTeam,
  blocks: [
    {
      number: '01',
      heading: 'Our purpose',
      /* Sourced from ZNFU's published mission statement. */
      body: 'Promoting and safeguarding the interests of our members — individual farmers, corporations and organisations involved in the business of agriculture — for sustainable agriculture and for economic and social development.',
    },
    {
      number: '02',
      heading: 'Our vision',
      /* Draft copy — awaiting Union approval. */
      body: 'A Zambian agricultural economy where every farmer is productive, profitable and heard — and where the land is cared for so it can feed generations to come.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  What we do — the three core functions                              */
/* ------------------------------------------------------------------ */
export const whatWeDo = {
  eyebrow: 'What we do',
  title: 'Three core functions, one industry voice.',
  lede: 'Everything the Union does sits on three foundations.',
  items: [
    {
      number: '01',
      icon: 'Scale',
      title: 'Lobbying & advocacy',
      body: 'One voice at the table. We represent members before government, regulators and trading partners on the policies, prices and processes that shape Zambian agriculture.',
      image: media.fieldMaizeDemoDay,
      imageAlt: 'Farmers and agronomists inspecting a maize demonstration plot',
    },
    {
      number: '02',
      icon: 'Users',
      title: 'Member services',
      body: 'Strength in organisation. We bring farmers together into District Farmers’ Associations and commodity bodies, so the industry negotiates as one effective voice.',
      image: media.livestockGoatsKraal,
      imageAlt: 'A kraal of goats held by farmers at a livestock pen',
    },
    {
      number: '03',
      icon: 'Newspaper',
      title: 'Information & insight',
      body: 'Facts for every decision. Market prices, weather outlooks, policy briefs and the Zambian Farmer magazine — reaching members nationwide.',
      image: media.horticulturePassionFruit,
      imageAlt: 'Passion fruit ripening on a trellised orchard',
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Member systems                                                     */
/* ------------------------------------------------------------------ */
export const systems = {
  eyebrow: 'Member systems',
  title: 'Built for the harvest window.',
  lede: 'Practical systems that put prices, haulage and market access in members’ hands.',
  items: [
    {
      id: 'e-farm-prices',
      number: '01',
      icon: 'TrendingUp',
      title: 'e-Farm Prices',
      body: 'Weekly commodity prices gathered by the Union from markets across Zambia. Compare every market, track the week’s movers and download the price book.',
      image: media.producePeppersBaskets,
      imageAlt: 'Baskets of green, yellow and red peppers graded for market',
      features: [
        'Prices collected from all major markets every week',
        'Compare markets and spot the week’s movers',
        'Downloadable price book for associations',
      ],
      cta: { label: 'Open e-Farm Prices', href: '#systems' },
      /* ⚠️ Sample data — replace with the live weekly price book. */
      prices: [
        { market: 'Chipata', commodity: 'White maize', price: 'ZMW 299.60', unit: '50kg bag' },
        { market: 'Chipata', commodity: 'Soya beans', price: 'ZMW 443.40', unit: '50kg bag' },
        { market: 'Chipata', commodity: 'Urea', price: 'ZMW 908.08', unit: '50kg bag' },
        { market: 'Chipata', commodity: 'Cattle (live)', price: 'ZMW 7,922.76', unit: 'head' },
      ],
    },
    {
      id: 'e-transport',
      number: '02',
      icon: 'Truck',
      title: 'e-Transport',
      body: 'Book haulage from farm to market, FRA depot or processor. Matching, quotes and delivery tracked in one place — built for the harvest window.',
      image: media.haulageAerialHarvest,
      imageAlt: 'Aerial view of harvesters and trailers working a green field',
      features: [
        'Pickup, 7, 15 and 30-ton plus refrigerated options',
        'Grain, livestock and horticulture cargo types',
        'Secretariat matching with live job status',
      ],
      cta: { label: 'Open e-Transport', href: '#systems' },
    },
    {
      id: 'znfu-market',
      number: '03',
      icon: 'Store',
      title: 'ZNFU Market',
      body: 'A member marketplace for produce, livestock, equipment and inputs. Only paid-up members can list — and a listing leaves the market the day membership lapses.',
      image: media.livestockCattleWater,
      imageAlt: 'A brown cattle beast drinking at a concrete trough',
      features: [
        'Paid-up sellers only — verified membership',
        'Produce, livestock, equipment and inputs',
        'Listings lapse automatically with membership',
      ],
      cta: { label: 'Open the market', href: '#membership' },
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  News  ⚠️ sample headlines — replace with real newsroom output      */
/* ------------------------------------------------------------------ */
export const news = {
  eyebrow: 'From the newsroom',
  title: 'Policy, weather, markets and member affairs.',
  lede: 'The same stories the Union publishes for farmers nationwide.',
  allLink: { label: 'All news', href: '#news' },
  featured: {
    category: 'Policy',
    date: '28 September 2026',
    title: 'Planting window opens: what the 2026/27 crop-weather outlook means for your district',
    excerpt:
      'The Union’s agronomy desk unpacks the seasonal forecast district by district, with guidance on planting dates, variety choice and input timing for the season ahead.',
    image: media.gardenSunsetIrrigation,
    imageAlt: 'A vegetable garden at sunset with a water tank and drip irrigation lines',
    href: '#news',
  },
  items: [
    {
      category: 'Policy',
      date: '24 September 2026',
      title: 'Union tables input-cost submission ahead of the national budget',
      href: '#news',
    },
    {
      category: 'Member affairs',
      date: '18 September 2026',
      title: 'FISP distribution: guidance for District Farmers’ Associations',
      href: '#news',
    },
    {
      category: 'Livestock',
      date: '12 September 2026',
      title: 'Livestock movement permits — the new digital process explained',
      href: '#news',
    },
  ],
  fridayBrief: {
    label: 'Friday Briefs',
    title: 'Policy, markets and weather in one briefing.',
    body: 'The fortnightly note for association chairs and farm businesses. Subscribe to get it by email, free.',
    cta: 'Subscribe',
  },
}

/* ------------------------------------------------------------------ */
/*  Membership                                                         */
/* ------------------------------------------------------------------ */
export const membership = {
  eyebrow: 'Membership',
  title: 'Five ways to belong to the Union.',
  lede: 'Whoever you are in Zambian agriculture, there is a seat for you at the table.',
  image: media.growerMaizeField,
  imageAlt: 'A farmer in a straw hat walking through tall maize',
  imageCaption: 'One Union. Every farmer.',
  ways: [
    {
      number: '01',
      title: 'District Farmers’ Associations',
      body: 'The grassroots voice of small and emerging farmers in every province.',
    },
    {
      number: '02',
      title: 'Commodity & specialised associations',
      body: 'Crop and livestock groups that speak with technical precision.',
    },
    {
      number: '03',
      title: 'Corporate farming businesses',
      body: 'Commercial producers anchoring national food and export supply.',
    },
    {
      number: '04',
      title: 'Agribusiness chamber',
      body: 'Input, finance, processing and trade partners in the value chain.',
    },
    {
      number: '05',
      title: 'Association members',
      body: 'Allied organisations working alongside the Union on shared goals.',
    },
  ],
  cta: { label: 'Apply for membership', href: '#contact' },
  secondaryCta: { label: 'Types of membership', href: '#membership' },
}

/* ------------------------------------------------------------------ */
/*  Partners & affiliations   ⚠️ confirm which may be published        */
/* ------------------------------------------------------------------ */
export const partners = {
  title: 'Working with',
  items: [
    'Ministry of Agriculture',
    'Ministry of Finance & National Planning',
    'Zambia Statistics Agency',
    'Agriculture Consultative Forum',
    'National Assembly of Zambia',
    'Zambia Meteorological Department',
    'Conservation Farming Unit',
    'Zambia Agricultural Research Institute',
    'Water Resources Management Authority',
    'Food Reserve Agency',
  ],
  affiliations: [
    { label: 'Member of SACAU', sub: 'Southern African Confederation of Agricultural Unions' },
    { label: 'Member of WFO', sub: 'World Farmers’ Organisation' },
  ],
}

/* ------------------------------------------------------------------ */
/*  Contact / footer                                                   */
/* ------------------------------------------------------------------ */
export const contact = {
  addressLines: [
    'Farmers’ Village, Tiyende Pamodzi Road',
    'Showgrounds, Lusaka, Zambia',
    'P.O. Box 30395',
  ],
  phones: ['+260 211 252 649', '+260 211 255 769'],
  email: 'info@znfu.org.zm',
  socials: [
    { network: 'Facebook', href: 'https://www.facebook.com/', label: 'ZNFU on Facebook' },
    { network: 'LinkedIn', href: 'https://www.linkedin.com/', label: 'ZNFU on LinkedIn' },
    { network: 'YouTube', href: 'https://www.youtube.com/', label: 'ZNFU on YouTube' },
  ],
}

export const footer = {
  mission:
    'A non-political, member-led union promoting and safeguarding the interests of farmers, corporations and organisations in the business of agriculture.',
  meta: 'Founded 1905 · Non-political · Member-led',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'About the Union', href: '#about' },
        { label: 'What we do', href: '#what-we-do' },
        { label: 'Newsroom', href: '#news' },
        { label: 'Membership', href: '#membership' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Member systems',
      links: [
        { label: 'e-Farm Prices', href: '#e-farm-prices' },
        { label: 'e-Transport', href: '#e-transport' },
        { label: 'ZNFU Market', href: '#znfu-market' },
        { label: 'Zambian Farmer magazine', href: '#news' },
      ],
    },
  ],
  newsletter: {
    title: 'Keep ahead of the season',
    body: 'Policy, market prices and weather — sent to members.',
    placeholder: 'you@farm.co.zm',
    success: 'Thank you — please check your inbox to confirm.',
  },
  legal: [
    { label: 'Privacy policy', href: '#contact' },
    { label: 'Disclaimer', href: '#contact' },
  ],
}
