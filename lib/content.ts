import { prisma } from "@/lib/prisma";

// ─── Default content for every section on every page ─────────────────────────

export const CONTENT_DEFAULTS: Record<string, unknown> = {
  "content.home.hero": {
    bio: "10+ years creating websites, brands, 3D campaigns and digital platforms. Based in Punjab, India.",
    roles: ["Graphic Designer", "3D Artist", "Full-Stack Developer", "Creative Director"],
  },
  "content.home.stats": [
    { value: 84, suffix: "K+", label: "Social Followers" },
    { value: 400, suffix: "+", label: "Websites Built" },
    { value: 75, suffix: "K+", label: "Graphics Created" },
    { value: 40, suffix: "+", label: "CGI Ads Produced" },
  ],
  "content.home.about": {
    heading: "Designer, Developer &\n3D Artist",
    photo: "",
    bioParagraphs: [
      "I'm Nitin Monga — a graphic designer, 3D artist and full-stack developer based in Punjab, India.",
      "Over the past decade I've built 400+ websites, produced 40+ CGI ad campaigns, and grown a network of live platforms to 84K+ followers and 75K+ monthly impressions.",
      "I run a design and development studio in Punjab — blending editorial aesthetics with technical precision to build things that look great and perform even better.",
      "Every project I take on is built to perform, convert, and last.",
    ],
    chips: ["Figma", "Next.js", "WordPress", "Blender", "GSAP", "Prisma"],
    timeline: [
      { year: "2013", title: "First Design Freelance", desc: "Started freelancing as a graphic designer — logos, brochures, and brand identities for local Punjab businesses." },
      { year: "2015", title: "First Digital Platform", desc: "Built and launched a niche content platform from scratch. It grew to 40,000+ monthly active users over the next decade." },
      { year: "2017", title: "Entered Web Development", desc: "Mastered WordPress, PHP and MySQL. Started building full client websites professionally — 400+ delivered since." },
      { year: "2019", title: "3D & CGI Production", desc: "Expanded into 3D advertising. Delivered 40+ CGI campaigns for brands across India using Blender and Cinema 4D." },
      { year: "2021", title: "Founded My Studio", desc: "Registered a formal design and development studio in Punjab. Scaled to larger contracts and a full-service offering." },
      { year: "2025", title: "84K+ Following", desc: "Grew combined social presence to 84,000+ across Instagram, YouTube and LinkedIn. 75K+ monthly platform impressions." },
    ],
  },
  "content.home.services": {
    services: [
      { title: "Web Design", description: "Conversion-focused designs delivered as pixel-perfect Figma mockups before development begins." },
      { title: "WordPress Dev", description: "Fast, SEO-optimized WordPress sites with custom themes. Hand-coded — no page-builder bloat." },
      { title: "Next.js Dev", description: "Modern web apps with Next.js 14, TypeScript, Prisma and Tailwind. SSR, SSG, API routes included." },
      { title: "Branding & Identity", description: "Logo design, brand guidelines, colour systems and typography that make you instantly recognizable." },
      { title: "3D & CGI Production", description: "Product visualization, CGI ads and 3D motion graphics. 40+ campaigns delivered using Blender & C4D." },
      { title: "SEO & Monetization", description: "Technical SEO audits, content strategy, AdSense & affiliate setup. My platforms hit 75K+ monthly impressions." },
    ],
  },
  "content.home.contact": {
    heading: "Have a Project\nin Mind?",
    body: "Whether you need a website, brand identity, 3D campaign, or SEO strategy — I'd love to hear about it.",
    email: "nitinmonga14@gmail.com",
    location: "Punjab, India",
  },
  "content.about.hero": {
    title: "Designer.\nDeveloper.\nCreator.",
    chips: ["Graphic Design", "3D / CGI", "Full-Stack Dev", "SEO", "Branding", "WordPress"],
    stats: [
      { label: "Years Experience", value: "10+" },
      { label: "Websites Built", value: "400+" },
      { label: "CGI Campaigns", value: "40+" },
      { label: "Social Following", value: "84K+" },
      { label: "Based In", value: "Punjab, India" },
      { label: "Languages", value: "Hindi · English · Punjabi" },
    ],
  },
  "content.about.bio": {
    sectionHeading: "More than a portfolio page.",
    paragraphs: [
      "I'm Nitin Monga — a graphic designer, 3D artist and full-stack developer based in Punjab, India. I've been building digital products professionally since 2013.",
      "Over the past decade I've delivered 400+ websites across WordPress and Next.js, produced 40+ CGI advertising campaigns for brands across India, and grown a network of digital platforms to 84K+ followers.",
      "My work sits at the intersection of aesthetics and engineering. I care about how things look, how they perform, and how they convert — not just one of the three.",
      "I run a full-service design and development studio in Punjab. Whether you need a brand identity, a high-performance website, or a 3D product campaign, I handle it end-to-end.",
    ],
    services: [
      "Web Design & Figma Mockups",
      "WordPress & Next.js Development",
      "Brand Identity & Logo Design",
      "3D Product Visualization",
      "CGI Advertising (Blender / C4D)",
      "SEO, AdSense & Monetization",
    ],
  },
  "content.about.skills": {
    groups: [
      {
        category: "Design",
        items: [
          { name: "Figma", level: 95 },
          { name: "Adobe Illustrator", level: 92 },
          { name: "Adobe Photoshop", level: 90 },
          { name: "Adobe InDesign", level: 80 },
        ],
      },
      {
        category: "3D & Motion",
        items: [
          { name: "Blender", level: 88 },
          { name: "Cinema 4D", level: 82 },
          { name: "After Effects", level: 78 },
        ],
      },
      {
        category: "Development",
        items: [
          { name: "Next.js / React", level: 90 },
          { name: "TypeScript", level: 85 },
          { name: "WordPress / PHP", level: 93 },
          { name: "Tailwind CSS", level: 92 },
          { name: "MySQL / Prisma", level: 82 },
        ],
      },
      {
        category: "Marketing & SEO",
        items: [
          { name: "Technical SEO", level: 87 },
          { name: "Google AdSense", level: 84 },
          { name: "Google Analytics", level: 80 },
        ],
      },
    ],
  },
  "content.about.timeline": {
    heading: "A Decade of Building",
    milestones: [
      { year: "2013", title: "First Freelance Project", desc: "Started as a graphic designer — logos, brochures and brand identities for local Punjab businesses. Built a client base from zero." },
      { year: "2015", title: "First Digital Platform", desc: "Built and launched a niche content platform from scratch. Grew it to 40,000+ monthly active users using content strategy and SEO." },
      { year: "2017", title: "Full-Stack Web Development", desc: "Mastered WordPress, PHP and MySQL. Began delivering complete client websites professionally. 400+ sites delivered since." },
      { year: "2019", title: "3D & CGI Production", desc: "Expanded into 3D advertising. Delivered 40+ CGI campaigns for brands across India using Blender and Cinema 4D." },
      { year: "2021", title: "Studio Founded", desc: "Registered a formal design and development studio in Punjab. Scaled to larger enterprise contracts and a full-service offering." },
      { year: "2023", title: "Next.js & Modern Stack", desc: "Shifted primary development to Next.js 14 App Router, TypeScript and Tailwind. Built high-performance SSR applications at scale." },
      { year: "2025", title: "84K+ Community", desc: "Grew combined social presence to 84,000+ across Instagram, YouTube and LinkedIn. 75K+ monthly platform impressions." },
    ],
  },
  "content.services.hero": {
    title: "Everything you need\nto ship online.",
    subtitle: "From a single landing page to a full brand system with 3D assets — I handle design, development and SEO as a single engagement.",
    pills: ["Web Design", "WordPress Dev", "Next.js Dev", "Branding", "3D & CGI", "SEO & Monetization"],
  },
  "content.services.grid": {
    services: [
      { id: "web-design", title: "Web Design", description: "Conversion-focused designs delivered as pixel-perfect Figma mockups before a single line of code is written.", includes: ["Wireframing & UX flow", "High-fidelity Figma mockups", "Mobile-first responsive design", "Design system & style guide", "2 rounds of revisions"] },
      { id: "wordpress-dev", title: "WordPress Development", description: "Fast, SEO-ready WordPress sites with custom themes. Hand-coded — zero page-builder bloat.", includes: ["Custom theme development", "WooCommerce / LMS support", "Performance optimisation", "On-page SEO setup", "12 months of support"] },
      { id: "nextjs-dev", title: "Next.js Development", description: "Modern web applications with Next.js 14 App Router, TypeScript, Prisma and Tailwind — SSR, SSG and API routes included.", includes: ["Next.js 14 App Router", "TypeScript + Tailwind CSS", "MySQL / Prisma ORM", "Authentication & dashboard", "Deployment & CI/CD setup"] },
      { id: "branding", title: "Branding & Identity", description: "Logo design, brand guidelines, colour systems and typography that make you instantly recognizable.", includes: ["Logo design (3 concepts)", "Brand guidelines PDF", "Colour & type system", "Business card / stationery", "Social media kit"] },
      { id: "3d-cgi", title: "3D & CGI Production", description: "Product visualization, CGI ads and 3D motion graphics. 40+ campaigns delivered using Blender and Cinema 4D.", includes: ["Product 3D modelling", "Photorealistic rendering", "CGI ad compositing", "Motion graphics & animation", "Final export in all formats"] },
      { id: "seo", title: "SEO & Monetization", description: "Technical SEO audits, content strategy, AdSense and affiliate setup. My platforms hit 75K+ monthly impressions.", includes: ["Full technical SEO audit", "Keyword research & strategy", "Google AdSense setup", "Site speed optimisation", "Monthly reporting"] },
    ],
  },
  "content.services.process": {
    heading: "My Process",
    steps: [
      { num: "01", title: "Discovery Call", desc: "We talk through your goals, timeline and budget. I ask the right questions to understand the scope before sending any proposal." },
      { num: "02", title: "Proposal & Kickoff", desc: "You receive a detailed proposal with deliverables, milestones and price. On approval, I send the contract and we begin." },
      { num: "03", title: "Design Phase", desc: "I build mockups in Figma first — you see exactly what you're getting before development starts. No surprises." },
      { num: "04", title: "Build & Review", desc: "Development begins on the approved design. You get a live staging URL to review at every milestone." },
      { num: "05", title: "Launch & Handover", desc: "Once approved, I handle the full deployment. You get all source files, credentials and a recorded walkthrough." },
    ],
  },
  "content.services.faq": {
    heading: "Common Questions",
    faqs: [
      { q: "Do you work with international clients?", a: "Yes. I work with clients across India and internationally. All communication happens via email, WhatsApp or Zoom, and payments are accepted in INR and USD." },
      { q: "What's your typical turnaround time?", a: "A logo or brand identity takes 5–7 business days. A WordPress site takes 2–4 weeks. A full Next.js application is 4–8 weeks depending on complexity. Timelines are confirmed in the proposal." },
      { q: "Do you provide maintenance after launch?", a: "Yes. All web projects include 30 days of post-launch support. Extended maintenance retainers are available on a monthly basis." },
      { q: "How many revisions are included?", a: "Design projects include 2 rounds of revisions in the standard package. Additional rounds can be added to any package." },
      { q: "Can you handle both design and development?", a: "Absolutely — that's my main value proposition. I handle everything from Figma design to code to deployment, so there's no handoff friction between designer and developer." },
      { q: "What's the payment structure?", a: "I work on a 50% upfront, 50% on delivery model for most projects. Larger engagements use milestone-based payments split across the project." },
    ],
  },
  "content.work.hero": {
    title: "Projects &\nCase Studies",
    subtitle: "A curated selection from 400+ projects across web design, development, branding and 3D production.",
    stats: [
      { num: "400+", label: "Total Projects" },
      { num: "40+", label: "CGI Campaigns" },
      { num: "10+", label: "Years Active" },
    ],
  },
  "content.blog.hero": {
    title: "Thoughts &\nInsights",
    subtitle: "Practical articles on web design, 3D production, development and building digital products.",
    topics: ["Web Design", "Development", "3D & Design", "SEO", "Entrepreneurship"],
  },
  "content.contact.hero": {
    title: "Let's Build\nSomething.",
    subtitle: "Tell me about your project. I respond to every message within 24 hours.",
    email: "nitinmonga14@gmail.com",
    location: "Punjab, India",
    responseTime: "Within 24 hours",
  },
  "content.contact.form": {
    heading: "Tell me about your project",
    subtitle: "Fill in the form and I'll get back to you within 24 hours with a response and next steps.",
    steps: [
      { num: "01", label: "Fill the form" },
      { num: "02", label: "I respond within 24h" },
      { num: "03", label: "Discovery call" },
      { num: "04", label: "Proposal sent" },
    ],
  },
  "meta.home": {
    title: "Nitin Monga — Graphic Designer & Full-Stack Developer | Punjab India",
    description: "Nitin Monga — Graphic Designer, 3D Artist & Full-Stack Developer from Punjab, India. 10+ years building websites, CGI ads, and digital platforms.",
  },
  "meta.about": {
    title: "About Me",
    description: "Learn about Nitin Monga — a Graphic Designer, 3D Artist and Full-Stack Developer from Punjab, India with 10+ years of experience building digital products.",
  },
  "meta.services": {
    title: "Services",
    description: "Web design, Next.js development, WordPress, 3D CGI production, branding and SEO services by Nitin Monga — a full-service designer and developer based in Punjab, India.",
  },
  "meta.work": {
    title: "Work & Case Studies",
    description: "Portfolio of 400+ projects — web design, Next.js development, WordPress sites, branding identities and 3D CGI campaigns by Nitin Monga.",
  },
  "meta.blog": {
    title: "Blog",
    description: "Articles on web design, full-stack development, 3D production, SEO and entrepreneurship by Nitin Monga.",
  },
  "meta.contact": {
    title: "Contact",
    description: "Get in touch with Nitin Monga for web design, development, branding and 3D CGI projects. Based in Punjab, India.",
  },
  "content.home.testimonials": [
    {
      name: "Rahul Sharma",
      role: "Founder, TechStartup India",
      quote: "Nitin delivered a Next.js application that exceeded every expectation. The attention to detail in both design and code is exceptional. Our conversion rate improved by 40% after launch.",
      avatar: "",
      rating: 5,
    },
    {
      name: "Priya Kapoor",
      role: "Marketing Director, BrandCo",
      quote: "The CGI campaign Nitin produced for our product launch was world-class. We've worked with agencies that charge 10x more and delivered less. Genuinely talented.",
      avatar: "",
      rating: 5,
    },
    {
      name: "James Mitchell",
      role: "CEO, UK E-commerce Brand",
      quote: "Our WordPress site went from slow and dated to fast and beautiful in three weeks. Nitin handles design, code and SEO with zero handoff friction. Rare find.",
      avatar: "",
      rating: 5,
    },
    {
      name: "Ananya Singh",
      role: "Content Creator, 200K Followers",
      quote: "The personal brand identity Nitin created is exactly who I am. He understood the brief on the first call and nailed it. I get compliments on my branding constantly.",
      avatar: "",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "CTO, SaaS Platform",
      quote: "Clean TypeScript, proper Prisma schema, excellent component architecture. Nitin doesn't just build things — he builds them right. We've extended the contract twice.",
      avatar: "",
      rating: 5,
    },
    {
      name: "Meera Patel",
      role: "Business Owner, Punjab",
      quote: "From logo to website to Google rankings — Nitin handled everything. Within 6 months we were on page 1 for our main keywords. Absolutely worth every rupee.",
      avatar: "",
      rating: 5,
    },
  ],
  "content.footer.social": {
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    facebook: "",
    behance: "",
  },
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getContent<T = unknown>(key: string): Promise<T> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    if (setting) {
      const parsed = setting.type === "JSON" ? JSON.parse(setting.value) : setting.value;
      return parsed as T;
    }
  } catch {
    // DB not connected — fall through to defaults
  }
  return (CONTENT_DEFAULTS[key] ?? null) as T;
}

export async function getPageContent(page: string): Promise<Record<string, unknown>> {
  const prefix = `content.${page}.`;
  const metaKey = `meta.${page}`;

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { startsWith: prefix } },
    });

    const result: Record<string, unknown> = {};

    // Fill defaults first
    for (const [key, val] of Object.entries(CONTENT_DEFAULTS)) {
      if (key.startsWith(prefix) || key === metaKey) {
        result[key] = val;
      }
    }

    // Override with DB values
    for (const s of settings) {
      result[s.key] = s.type === "JSON" ? JSON.parse(s.value) : s.value;
    }

    // Also fetch meta
    const meta = await prisma.siteSetting.findUnique({ where: { key: metaKey } });
    if (meta) {
      result[metaKey] = meta.type === "JSON" ? JSON.parse(meta.value) : meta.value;
    } else {
      result[metaKey] = CONTENT_DEFAULTS[metaKey];
    }

    return result;
  } catch {
    // DB not connected — return all defaults for this page
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(CONTENT_DEFAULTS)) {
      if (key.startsWith(prefix) || key === metaKey) {
        result[key] = val;
      }
    }
    return result;
  }
}
