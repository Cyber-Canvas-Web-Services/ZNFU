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
 *      6. `typesOfMembership` — categories condensed from ZNFU’s own
 *         published membership material; the subscription band ranges
 *         and fees are placeholders until the Secretariat supplies the
 *         current schedule.
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
import znfuLogo from "../../assets/znfu-logo.jpeg";

export const logo = znfuLogo;

/* ------------------------------------------------------------------ */
/*  Media — everything is served from /public/media                    */
/* ------------------------------------------------------------------ */
export const media = {
  /* The hero rotates between the montage and two stills of Zambian farmland,
     so they are grouped together. `scripts/optimize-media.sh` builds all of
     these from `assets/media-source/`. */
  heroBackground: {
    /* Two encodes of the same montage: 1280×720 desktop, 540×720 phones. */
    mp4: "/media/hero-background.mp4",
    mp4Mobile: "/media/hero-background-mobile.mp4",
    poster: "/media/hero-background-poster.webp",
  },
  /* Still order. The first entry is the hero's opening frame — it is what the
     visitor sees before the montage plays, so put the strongest photograph
     here. The rest follow the video in the order listed. */
  heroStills: ["/media/agri.webp", "/media/cows.webp"],
  fieldFootage: {
    mp4: "/media/field-footage.mp4",
    poster: "/media/field-footage-poster.webp",
  },
  /* From origin/main: the stills were re-encoded to WebP. */
  fieldSoybeanTeam: "/media/field-soybean-team.webp",
  livestockCattleWater: "/media/livestock-cattle-water.webp",
  livestockGoatsKraal: "/media/livestock-goats-kraal.webp",
  horticulturePassionFruit: "/media/horticulture-passion-fruit.webp",
  fieldMaizeDemoDay: "/media/field-maize-demo-day.webp",
  gardenSunsetIrrigation: "/media/garden-sunset-irrigation.webp",
  haulageAerialHarvest: "/media/haulage-aerial-harvest.webp",
  producePeppersBaskets: "/media/produce-peppers-baskets.webp",
  growerMaizeField: "/media/grower-maize-field.webp",
};

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
export const navLinks = [
  /* Each entry opens its own page rather than scrolling the home page. */
  { label: "About", href: "/about" },
  { label: "What we do", href: "/what-we-do" },
  { label: "Systems", href: "/systems" },
  { label: "News", href: "/news" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
];

export const brand = {
  fullName: "Zambia National Farmers’ Union",
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export const hero = {
  title: "Growing Zambia, Together",
  /* Verified facts only — the badge is the visitor's first introduction to the
     Union, since the headline deliberately does not name it. */
  badge: { chip: "Est. 1905", text: "Zambia National Farmers’ Union" },
  tagline: "A united voice for Zambian agriculture.",
  body: "The Zambia National Farmers’ Union is a non-political, member-led union that promotes and safeguards the interests of farmers, commodity associations and agribusinesses across Zambia.",
  primaryCta: { label: "Become a member", href: "#membership" },
  secondaryCta: { label: "Explore the Union", href: "#about" },
};

/* ------------------------------------------------------------------ */
/*  By the numbers  ⚠️ unverified figures below (see TODO note above)  */
/* ------------------------------------------------------------------ */
export const stats = {
  eyebrow: "By the numbers",
  title: "One industry voice, more than a century strong.",
  items: [
    {
      value: 1905,
      label: "Founded in Lusaka",
      prefix: "",
      suffix: "",
      raw: true,
    },
    { value: 250, label: "Thousand farmers represented", suffix: "k+" },
    { value: 90, label: "District Farmers’ Associations", suffix: "+" },
    { value: 30, label: "Commodity associations", suffix: "+" },
  ],
  /* ⚠️ The figures above are still placeholders awaiting ZNFU confirmation.
     They used to carry an on-page note saying so; that was removed at the
     client's request because it read as unfinished on a public page. The
     caveat therefore lives here and in the TODO block at the top of this file
     — it must not be dropped from the record just because the page no longer
     says it. Do not present these numbers as verified until the Secretariat
     signs them off. */
};

/* ------------------------------------------------------------------ */
/*  Purpose / Vision                                                   */
/* ------------------------------------------------------------------ */
export const purposeVision = {
  eyebrow: "Who we are",
  title: "A member-led union for every Zambian farmer.",
  lede: "From small-scale growers in the most distant districts to large commercial operations, ZNFU exists so that Zambian agriculture speaks, negotiates and plans as one industry.",
  image: media.fieldSoybeanTeam,
  blocks: [
    {
      number: "01",
      heading: "Our purpose",
      /* Sourced from ZNFU's published mission statement. */
      body: "Promoting and safeguarding the interests of our members — individual farmers, corporations and organisations involved in the business of agriculture — for sustainable agriculture and for economic and social development.",
    },
    {
      number: "02",
      heading: "Our vision",
      /* Draft copy — awaiting Union approval. */
      body: "A Zambian agricultural economy where every farmer is productive, profitable and heard — and where the land is cared for so it can feed generations to come.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  What we do — the three core functions                              */
/* ------------------------------------------------------------------ */
export const whatWeDo = {
  eyebrow: "What we do",
  title: "Our mission",
  lede: "“Promoting and safeguarding the interest of members as individual farmers, corporations, companies, purveyors and other organisations involved in the business of agriculture — in order to achieve sustainable agriculture, economic and social development”",
  /* ⚠️ Card copy is confirmed-only. Pending items are tracked in docs/what-we-do-page.md. */
  items: [
    {
      number: "01",
      icon: "Scale",
      title: "Lobbying & advocacy",
      body: "We use the Union’s voice to promote and safeguard the interest of our members.",
      image: media.fieldMaizeDemoDay,
      imageAlt: "Farmers and agronomists inspecting a maize demonstration plot",
    },
    {
      number: "02",
      icon: "Users",
      title: "Member services",
      body: "We provide services that support our members directly.",
      image: media.livestockGoatsKraal,
      imageAlt: "A kraal of goats held by farmers at a livestock pen",
    },
    {
      number: "03",
      icon: "Newspaper",
      title: "Information",
      body: "We gather and share information for members in the business of agriculture.",
      image: media.horticulturePassionFruit,
      imageAlt: "Passion fruit ripening on a trellised orchard",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Member systems                                                     */
/* ------------------------------------------------------------------ */
export const systems = {
  eyebrow: "Member systems",
  title: "Built for the harvest window.",
  lede: "Practical systems that put prices, haulage and market access in members’ hands.",
  items: [
    {
      id: "e-farm-prices",
      number: "01",
      icon: "TrendingUp",
      title: "e-Farm Prices",
      body: "Weekly commodity prices gathered by the Union from markets across Zambia. Compare every market, track the week’s movers and download the price book.",
      image: media.producePeppersBaskets,
      imageAlt: "Baskets of green, yellow and red peppers graded for market",
      features: [
        "Prices collected from all major markets every week",
        "Compare markets and spot the week’s movers",
        "Downloadable price book for associations",
      ],
      cta: { label: "Open e-Farm Prices", href: "#systems" },
      /* ⚠️ Sample data — replace with the live weekly price book. */
      prices: [
        {
          market: "Chipata",
          commodity: "White maize",
          price: "ZMW 299.60",
          unit: "50kg bag",
        },
        {
          market: "Chipata",
          commodity: "Soya beans",
          price: "ZMW 443.40",
          unit: "50kg bag",
        },
        {
          market: "Chipata",
          commodity: "Urea",
          price: "ZMW 908.08",
          unit: "50kg bag",
        },
        {
          market: "Chipata",
          commodity: "Cattle (live)",
          price: "ZMW 7,922.76",
          unit: "head",
        },
      ],
    },
    {
      id: "e-transport",
      number: "02",
      icon: "Truck",
      title: "e-Transport",
      body: "Book haulage from farm to market, FRA depot or processor. Matching, quotes and delivery tracked in one place — built for the harvest window.",
      image: media.haulageAerialHarvest,
      imageAlt: "Aerial view of harvesters and trailers working a green field",
      features: [
        "Pickup, 7, 15 and 30-ton plus refrigerated options",
        "Grain, livestock and horticulture cargo types",
        "Secretariat matching with live job status",
      ],
      cta: { label: "Open e-Transport", href: "#systems" },
    },
    {
      id: "znfu-market",
      number: "03",
      icon: "Store",
      title: "ZNFU Market",
      body: "A member marketplace for produce, livestock, equipment and inputs. Only paid-up members can list — and a listing leaves the market the day membership lapses.",
      image: media.livestockCattleWater,
      imageAlt: "A brown cattle beast drinking at a concrete trough",
      features: [
        "Paid-up sellers only — verified membership",
        "Produce, livestock, equipment and inputs",
        "Listings lapse automatically with membership",
      ],
      cta: { label: "Open the market", href: "#membership" },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  News  ⚠️ sample headlines — replace with real newsroom output      */
/* ------------------------------------------------------------------ */
export const news = {
  eyebrow: "From the newsroom",
  title: "Policy, weather, markets and member affairs.",
  lede: "The same stories the Union publishes for farmers nationwide.",
  allLink: { label: "All news", href: "#news" },
  featured: {
    category: "Policy",
    date: "28 September 2026",
    title:
      "Planting window opens: what the 2026/27 crop-weather outlook means for your district",
    excerpt:
      "The Union’s agronomy desk unpacks the seasonal forecast district by district, with guidance on planting dates, variety choice and input timing for the season ahead.",
    image: media.gardenSunsetIrrigation,
    imageAlt:
      "A vegetable garden at sunset with a water tank and drip irrigation lines",
    href: "#news",
  },
  items: [
    {
      category: "Policy",
      date: "24 September 2026",
      title: "Union tables input-cost submission ahead of the national budget",
      href: "#news",
    },
    {
      category: "Member affairs",
      date: "18 September 2026",
      title: "FISP distribution: guidance for District Farmers’ Associations",
      href: "#news",
    },
    {
      category: "Livestock",
      date: "12 September 2026",
      title: "Livestock movement permits — the new digital process explained",
      href: "#news",
    },
  ],
  fridayBrief: {
    label: "Friday Briefs",
    title: "Policy, markets and weather in one briefing.",
    body: "The fortnightly note for association chairs and farm businesses. Subscribe to get it by email, free.",
    cta: "Subscribe",
  },
};

/* ------------------------------------------------------------------ */
/*  Membership                                                         */
/* ------------------------------------------------------------------ */
export const membership = {
  eyebrow: "Membership",
  title: "Who can join?",
  lede: "Whoever you are in Zambian agriculture, there is a seat for you at the table.",
  image: media.growerMaizeField,
  imageAlt: "A farmer in a straw hat walking through tall maize",
  imageCaption: "One Union. Every farmer.",
  /* ⚠️ Only confirmed facts are listed. Benefits and fees entries
     to be added when supplied by the Secretariat. */
  ways: [
    {
      number: "01",
      title: "Who may apply",
      body: "Any person or organisation in the business of agriculture in Zambia.",
    },
    {
      number: "02",
      title: "Complete the online form",
      body: "Include how many people work on the farm and, if you know it, farm size in hectares.",
    },
    {
      number: "03",
      title: "Submit to create your login",
      body: "The system issues an invoice from those figures and emails it with a button to checkout.",
    },
    {
      number: "04",
      title: "Pay by mobile money or Visa",
      body: "Pay on the same page. Until then you remain a pending member and can pay later from Invoices.",
    },
    {
      number: "05",
      title: "Paid members receive",
      body: "A membership number and one year of e-Farm Prices and e-Transport. Reminders go out one week, three days and one day before expiry, and again when it ends.",
    },
  ],
  cta: { label: "Apply for membership", href: "/apply-membership" },
  secondaryCta: { label: "Types of membership", href: "/types-of-membership" },
};

/* ------------------------------------------------------------------ */
/*  Types of Membership — the standalone page at /types-of-membership   */
/* ------------------------------------------------------------------ */
/**
 * ⚠️  The categories below are condensed from ZNFU’s own published
 * membership material (the Union’s “Types of Membership” page). The band
 * ranges and fees in `bands` are PLACEHOLDERS in the shape the application
 * and invoice flow needs — number of people on the farm and farm size in
 * hectares — and must be replaced with the Secretariat’s current schedule
 * before launch.
 */
export const typesOfMembership = {
  eyebrow: "Membership",
  title: "Types of Membership",
  intro: {
    before:
      "Membership is open to farmers, individuals, corporations and companies — and any other organisation — engaged in the business of farming in Zambia. Individual farmers join through their ",
    linkLabel: "District Farmers’ Association",
    linkHref: "#contact",
    after:
      "; if you are unsure which association covers your area, the Secretariat will point you to your DFA chairman.",
  },

  categoriesHeading: "Membership categories",
  categories: [
    {
      title: "Small-scale farmers",
      whoFor:
        "Farmers who grow crops or keep livestock themselves, joining the Union through their District Farmers’ Association.",
      notes:
        "The association pays a fixed annual affiliation fee raised from its members. Once it is paid, every member of the association is a member of the Union.",
    },
    {
      title: "Large-scale & commercial farmers",
      whoFor:
        "Commercial and large-scale farming operations, farmed by their owners or by companies.",
      notes:
        "Individual members are levied directly by the Union, with the fee based on the scale of the operation.",
    },
    {
      title: "Corporate members",
      whoFor:
        "Large farming businesses and multinationals, and individuals whose operations are at corporate scale.",
      notes:
        "Subscriptions are negotiated with the Union, guided by the size and turnover of the operation.",
    },
    {
      title: "Commodity & specialised associations",
      whoFor:
        "Associations organised around one commodity or activity — coffee, tobacco and export vegetables and flowers, for example.",
      notes:
        "A levy is collected on the Union’s behalf by the respective association; other enterprises pay directly or through the area association.",
    },
    {
      title: "Agribusiness members",
      whoFor:
        "Processors, traders, and input and service providers across the agricultural value chain.",
      notes:
        "Members of the Agri-Business Chamber pay the annual Chamber levy and work with the Union on industry-wide matters.",
    },
    {
      title: "Associate members",
      whoFor:
        "Companies and organisations that work with, or provide a service to, farmers.",
      notes:
        "Associate members pay a fixed annual subscription and are non-voting members of the Union.",
    },
  ],

  bandsHeading: "Annual subscription bands",
  bandsNote:
    "Subscription is assessed from the number of people on the farm and the farm size in hectares — the two figures the application form asks for. Confirm your band with the Secretariat when you apply.",
  bandColumns: {
    band: "Band",
    people: "People on the farm",
    hectares: "Farm size (ha)",
    fee: "Annual fee",
  },
  /* ⚠️ PLACEHOLDER ladder — illustrative ranges and fees only. */
  bands: [
    { band: "Band 1", people: "1 – 4", hectares: "Up to 5", fee: "ZMW 500" },
    { band: "Band 2", people: "5 – 9", hectares: "6 – 20", fee: "ZMW 1,000" },
    {
      band: "Band 3",
      people: "10 – 19",
      hectares: "21 – 50",
      fee: "ZMW 2,500",
    },
    {
      band: "Band 4",
      people: "20 – 49",
      hectares: "51 – 200",
      fee: "ZMW 5,000",
    },
    {
      band: "Band 5",
      people: "50 or more",
      hectares: "Over 200",
      fee: "ZMW 10,000",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Apply for Membership — the standalone page reached from the         */
/*  “Apply for membership” and “Join ZNFU” buttons                      */
/* ------------------------------------------------------------------ */
export const applyMembership = {
  eyebrow: "Membership",
  title: "Apply for Membership",
  /* Reuses the welcome line already published in the membership section. */
  lede: membership.lede,
  /* The same five confirmed application facts shown on the home page. */
  steps: membership.ways,
  contactHeading: "Contact the ZNFU Secretariat",
};

/* ------------------------------------------------------------------ */
/*  Partners & affiliations   ⚠️ confirm which may be published        */
/* ------------------------------------------------------------------ */
/**
 * Partner logos are normalised by `scripts/optimize-logos.py`, which trims
 * each one, flattens it onto a shared white ground and exports it on an
 * identical 160x64 chip (at 3x). The chips are therefore already the right
 * shape and size — the markup only places them, it does not fit them.
 *
 * Two assets needed repair to be usable as supplied, both documented in that
 * script: Conservation Farming Unit arrived as a scan with a grey backdrop,
 * and WARMA arrived with a white wordmark that is invisible on any light
 * surface (it is cropped to its emblem). If the client can supply vector or
 * transparent originals, re-run the script and both repairs stop applying.
 */
export const partners = {
  title: "Working with",
  items: [
    {
      name: "Ministry of Agriculture",
      logo: "/media/partners/ministry-of-agriculture.webp",
    },
    {
      name: "Ministry of Finance & National Planning",
      logo: "/media/partners/ministry-of-finance.webp",
    },
    {
      name: "Zambia Statistics Agency",
      logo: "/media/partners/zambia-statistics-agency.webp",
    },
    /* ⚠️ No logo supplied for this one, so it renders as its name on the same
       chip rather than a gap in the row. Drop a file into `assets/logos/`,
       add it to the SET in `scripts/optimize-logos.py`, and give it a `logo`
       path here to bring it in line with the rest. */
    { name: "Agriculture Consultative Forum" },
    {
      name: "National Assembly of Zambia",
      logo: "/media/partners/national-assembly.webp",
    },
    {
      name: "Zambia Meteorological Department",
      logo: "/media/partners/zambia-meteorological-department.webp",
    },
    {
      name: "Conservation Farming Unit",
      logo: "/media/partners/conservation-farming-unit.webp",
    },
    {
      name: "Zambia Agricultural Research Institute",
      logo: "/media/partners/zari.webp",
    },
    {
      name: "Water Resources Management Authority",
      logo: "/media/partners/warma.webp",
    },
    { name: "Food Reserve Agency", logo: "/media/partners/food-reserve-agency.webp" },
  ],
  affiliations: [
    {
      label: "Member of SACAU",
      sub: "Southern African Confederation of Agricultural Unions",
    },
    { label: "Member of WFO", sub: "World Farmers’ Organisation" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Contact / footer                                                   */
/* ------------------------------------------------------------------ */
export const contact = {
  addressLines: [
    "Farmers’ Village, Tiyende Pamodzi Road",
    "Showgrounds, Lusaka, Zambia",
    "P.O. Box 30395",
  ],
  phones: ["+260 211 252 649", "+260 211 255 769"],
  email: "info@znfu.org.zm",
  socials: [
    {
      network: "Facebook",
      href: "https://www.facebook.com/",
      label: "ZNFU on Facebook",
    },
    {
      network: "LinkedIn",
      href: "https://www.linkedin.com/",
      label: "ZNFU on LinkedIn",
    },
    {
      network: "YouTube",
      href: "https://www.youtube.com/",
      label: "ZNFU on YouTube",
    },
  ],
};

export const footer = {
  mission:
    "A non-political, member-led union promoting and safeguarding the interests of farmers, corporations and organisations in the business of agriculture.",
  meta: "Founded 1905 · Non-political · Member-led",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "About the Union", href: "/about" },
        { label: "What we do", href: "/what-we-do" },
        { label: "Newsroom", href: "/news" },
        { label: "Membership", href: "/membership" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Member systems",
      links: [
        { label: "e-Farm Prices", href: "#e-farm-prices" },
        { label: "e-Transport", href: "#e-transport" },
        { label: "ZNFU Market", href: "#znfu-market" },
        { label: "Zambian Farmer magazine", href: "#news" },
      ],
    },
  ],
  newsletter: {
    title: "Keep ahead of the season",
    body: "Policy, market prices and weather — sent to members.",
    placeholder: "you@farm.co.zm",
    success: "Thank you — please check your inbox to confirm.",
  },
  legal: [
    { label: "Privacy policy", href: "/contact" },
    { label: "Disclaimer", href: "/contact" },
  ],
};
