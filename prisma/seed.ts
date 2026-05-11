import { PrismaClient, SkillCategory, SettingType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Services ───────────────────────────────────────────────────────────
  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Web Design",
        description:
          "Custom, conversion-focused website designs that reflect your brand identity. Pixel-perfect Figma mockups delivered before development begins.",
        icon: "monitor",
        startingPrice: "₹15,000",
        deliverables: JSON.stringify([
          "Figma design files",
          "Mobile-first responsive layouts",
          "Brand-consistent UI components",
          "Prototype with interactions",
        ]),
        order: 1,
      },
      {
        title: "WordPress Development",
        description:
          "Fast, SEO-optimized WordPress websites with custom themes and plugins. No page-builder bloat — hand-coded for performance.",
        icon: "wordpress",
        startingPrice: "₹20,000",
        deliverables: JSON.stringify([
          "Custom WordPress theme",
          "SEO plugin configuration",
          "Speed optimization",
          "1 month free support",
        ]),
        order: 2,
      },
      {
        title: "Next.js Development",
        description:
          "Modern web applications built with Next.js 14 App Router, TypeScript, and Tailwind. SSR, SSG, and API routes for production-grade performance.",
        icon: "code",
        startingPrice: "₹40,000",
        deliverables: JSON.stringify([
          "Next.js App Router architecture",
          "TypeScript + Tailwind CSS",
          "Prisma + MySQL integration",
          "Vercel deployment & CI/CD",
        ]),
        order: 3,
      },
      {
        title: "Branding & Identity",
        description:
          "Logo design, brand guidelines, color systems, and typography that make your business instantly recognizable and memorable.",
        icon: "palette",
        startingPrice: "₹12,000",
        deliverables: JSON.stringify([
          "Logo (3 concepts)",
          "Brand style guide PDF",
          "Color palette & typography",
          "All source files (AI, SVG, PNG)",
        ]),
        order: 4,
      },
      {
        title: "3D & CGI Production",
        description:
          "Product visualization, CGI ads, and 3D motion graphics. 40+ CGI ads delivered for brands across India using Blender and Cinema 4D.",
        icon: "cube",
        startingPrice: "₹8,000",
        deliverables: JSON.stringify([
          "3D product renders",
          "CGI advertisement videos",
          "Motion graphics & VFX",
          "Multiple format exports",
        ]),
        order: 5,
      },
      {
        title: "SEO & Monetization",
        description:
          "Technical SEO audits, content strategy, and AdSense/affiliate monetization setup. Sites I manage generate 75,000+ monthly impressions.",
        icon: "trending-up",
        startingPrice: "₹10,000",
        deliverables: JSON.stringify([
          "Technical SEO audit",
          "On-page optimization",
          "Google Search Console setup",
          "AdSense configuration & optimization",
        ]),
        order: 6,
      },
    ],
  });

  // ─── Skills ─────────────────────────────────────────────────────────────
  await prisma.skill.createMany({
    skipDuplicates: true,
    data: [
      { name: "Figma", percentage: 95, category: SkillCategory.DESIGN, icon: "figma", order: 1 },
      { name: "Adobe Photoshop", percentage: 90, category: SkillCategory.DESIGN, icon: "photoshop", order: 2 },
      { name: "Adobe Illustrator", percentage: 88, category: SkillCategory.DESIGN, icon: "illustrator", order: 3 },
      { name: "After Effects", percentage: 80, category: SkillCategory.DESIGN, icon: "aftereffects", order: 4 },
      { name: "Next.js", percentage: 92, category: SkillCategory.DEV, icon: "nextjs", order: 5 },
      { name: "WordPress", percentage: 95, category: SkillCategory.DEV, icon: "wordpress", order: 6 },
      { name: "TypeScript", percentage: 85, category: SkillCategory.DEV, icon: "typescript", order: 7 },
      { name: "Tailwind CSS", percentage: 90, category: SkillCategory.DEV, icon: "tailwind", order: 8 },
      { name: "Blender", percentage: 78, category: SkillCategory.THREE_D, icon: "blender", order: 9 },
      { name: "Cinema 4D", percentage: 72, category: SkillCategory.THREE_D, icon: "cinema4d", order: 10 },
      { name: "Three.js", percentage: 70, category: SkillCategory.THREE_D, icon: "threejs", order: 11 },
      { name: "Google SEO", percentage: 88, category: SkillCategory.SEO, icon: "google", order: 12 },
      { name: "Google AdSense", percentage: 85, category: SkillCategory.SEO, icon: "adsense", order: 13 },
    ],
  });

  // ─── Products ────────────────────────────────────────────────────────────
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "DJYoungster",
        url: "https://djyoungster.com",
        monthlyUsers: 40000,
        techStack: JSON.stringify(["WordPress", "PHP", "MySQL", "AdSense"]),
        role: "Founder & Developer",
        description:
          "India's leading DJ music portal with 40,000+ monthly active users. Built and monetized from scratch — covers DJ mixes, remixes, and music news.",
        order: 1,
      },
      {
        name: "KineTools",
        url: "https://kinetools.com",
        monthlyUsers: 12000,
        techStack: JSON.stringify(["WordPress", "PHP", "AdSense"]),
        role: "Founder & Developer",
        description:
          "KineMaster templates and presets resource site. Serves 12,000+ monthly users downloading free and premium video editing assets.",
        order: 2,
      },
      {
        name: "Voxyon",
        url: "https://voxyon.com",
        monthlyUsers: 8000,
        techStack: JSON.stringify(["Next.js", "TypeScript", "MySQL"]),
        role: "Founder & Developer",
        description:
          "Audio tools and resources platform built with Next.js. Provides voice effects, audio presets, and sound design assets to creators.",
        order: 3,
      },
      {
        name: "CineLions",
        url: "https://cinelions.com",
        monthlyUsers: 5000,
        techStack: JSON.stringify(["WordPress", "WooCommerce"]),
        role: "Founder & Developer",
        description:
          "Cinema and filmmaking resources platform. Premiere Pro presets, LUTs, and video templates for professional filmmakers and content creators.",
        order: 4,
      },
      {
        name: "TutorialsByNitin",
        url: "https://tutorialsbynitin.com",
        monthlyUsers: 3000,
        techStack: JSON.stringify(["WordPress", "YouTube Integration"]),
        role: "Founder & Educator",
        description:
          "Design and development tutorials site complementing my YouTube channel. Step-by-step guides covering Figma, WordPress, Next.js, and After Effects.",
        order: 5,
      },
    ],
  });

  // ─── Timeline Milestones ─────────────────────────────────────────────────
  await prisma.timelineMilestone.createMany({
    skipDuplicates: true,
    data: [
      {
        year: "2013",
        title: "First Design Freelance",
        description:
          "Started freelancing as a graphic designer while still in college. First client: a local Punjab business needing a logo and brochure.",
        order: 1,
      },
      {
        year: "2015",
        title: "Launched DJYoungster",
        description:
          "Built and launched DJYoungster — a DJ music portal that would grow to 40,000+ monthly users over the next decade.",
        order: 2,
      },
      {
        year: "2017",
        title: "Entered Web Development",
        description:
          "Transitioned from pure design to full-stack development. Mastered WordPress, PHP, and MySQL. Started building client websites professionally.",
        order: 3,
      },
      {
        year: "2019",
        title: "3D & CGI Production",
        description:
          "Expanded into 3D and CGI advertising. Delivered 40+ CGI ad campaigns for brands across India using Blender and Cinema 4D.",
        order: 4,
      },
      {
        year: "2021",
        title: "Founded Xdecoders",
        description:
          "Registered Xdecoders Programming Services Pvt. Ltd. in Punjab. Formalized a team and started taking larger web design and development contracts.",
        order: 5,
      },
      {
        year: "2023",
        title: "Scaled to Next.js & Modern Stack",
        description:
          "Adopted Next.js 14, TypeScript, and Prisma for all new projects. Built Voxyon and KineTools on the modern stack. Portfolio of live platforms: 75K+ combined monthly users.",
        order: 6,
      },
      {
        year: "2025",
        title: "84K+ Social Following",
        description:
          "Grew social media presence to 84,000+ combined followers across Instagram, YouTube, and LinkedIn. Recognized as a leading design and dev creator from Punjab.",
        order: 7,
      },
    ],
  });

  // ─── Site Settings ────────────────────────────────────────────────────────
  const settings = [
    { key: "hero.name", value: "Nitin Monga", type: SettingType.TEXT },
    { key: "hero.tagline", value: "Graphic Designer · 3D Artist · Full-Stack Developer", type: SettingType.TEXT },
    { key: "hero.subtitle", value: "10+ years building digital products that perform and last", type: SettingType.TEXT },
    { key: "hero.cta_primary_text", value: "View My Work", type: SettingType.TEXT },
    { key: "hero.cta_primary_url", value: "/work/", type: SettingType.TEXT },
    { key: "hero.cta_secondary_text", value: "Download Resume", type: SettingType.TEXT },
    { key: "hero.resume_url", value: "/nitin-monga-resume.pdf", type: SettingType.TEXT },
    { key: "hero.profile_photo", value: "https://assets.nitinmonga.in/profile.jpg", type: SettingType.TEXT },
    { key: "stats.followers", value: "84000", type: SettingType.NUMBER },
    { key: "stats.websites", value: "400", type: SettingType.NUMBER },
    { key: "stats.graphics", value: "75000", type: SettingType.NUMBER },
    { key: "stats.cgi_ads", value: "40", type: SettingType.NUMBER },
    {
      key: "about.bio",
      value:
        "I'm Nitin Monga — a graphic designer, 3D artist, and full-stack developer based in Punjab, India. With over 10 years of experience, I've built 400+ websites, produced 40+ CGI ad campaigns, and grown platforms to 84K+ social followers and 75K+ monthly impressions. I run Xdecoders Programming Services Pvt. Ltd. — a design and development studio serving brands across India and internationally. My work sits at the intersection of editorial aesthetics and technical precision. Every project I take on is built to perform, convert, and last.",
      type: SettingType.TEXT,
    },
    { key: "contact.email", value: "nitin@xdecoders.com", type: SettingType.TEXT },
    { key: "contact.whatsapp", value: "+91XXXXXXXXXX", type: SettingType.TEXT },
    { key: "contact.location", value: "Punjab, India", type: SettingType.TEXT },
    { key: "seo.default_og_image", value: "https://assets.nitinmonga.in/og-default.jpg", type: SettingType.TEXT },
    { key: "seo.google_analytics_id", value: "", type: SettingType.TEXT },
    { key: "adsense.publisher_id", value: "", type: SettingType.TEXT },
    { key: "adsense.slot_homepage_banner", value: "", type: SettingType.TEXT },
    { key: "adsense.slot_blog_post_top", value: "", type: SettingType.TEXT },
    { key: "adsense.slot_blog_list", value: "", type: SettingType.TEXT },
    { key: "adsense.enabled", value: "false", type: SettingType.BOOLEAN },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // ─── Sample Projects ─────────────────────────────────────────────────────
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "DJYoungster — Music Portal",
        slug: "djyoungster-music-portal",
        description:
          "India's leading DJ music portal with 40,000+ monthly active users. Full WordPress build with custom theme, AdSense monetization, and SEO optimization.",
        category: "Web Design",
        thumbnail: "https://assets.nitinmonga.in/projects/djyoungster.jpg",
        liveUrl: "https://djyoungster.com",
        featured: true,
        order: 1,
        tags: JSON.stringify(["WordPress", "SEO", "AdSense", "Music"]),
        techStack: JSON.stringify(["WordPress", "PHP", "MySQL", "CSS"]),
      },
      {
        title: "Xdecoders — Agency Website",
        slug: "xdecoders-agency-website",
        description:
          "Official website for Xdecoders Programming Services Pvt. Ltd. Built with Next.js 14, featuring service showcases, client testimonials, and a contact portal.",
        category: "Next.js Dev",
        thumbnail: "https://assets.nitinmonga.in/projects/xdecoders.jpg",
        liveUrl: "https://xdecoders.com",
        featured: true,
        order: 2,
        tags: JSON.stringify(["Next.js", "TypeScript", "Tailwind", "Agency"]),
        techStack: JSON.stringify(["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma"]),
      },
      {
        title: "CGI Product Ad — Beauty Brand",
        slug: "cgi-product-ad-beauty-brand",
        description:
          "30-second CGI advertisement for a Punjab-based beauty brand. Full 3D product visualization, particle effects, and cinematic camera work in Blender.",
        category: "3D",
        thumbnail: "https://assets.nitinmonga.in/projects/cgi-beauty.jpg",
        featured: true,
        order: 3,
        tags: JSON.stringify(["Blender", "CGI", "3D", "Advertisement"]),
        techStack: JSON.stringify(["Blender 4.0", "After Effects", "DaVinci Resolve"]),
      },
      {
        title: "Voxyon — Audio Platform",
        slug: "voxyon-audio-platform",
        description:
          "Audio tools and resources platform serving 8,000+ monthly users. Built with Next.js 14 and Prisma — offers voice effects, presets, and sound design assets.",
        category: "Next.js Dev",
        thumbnail: "https://assets.nitinmonga.in/projects/voxyon.jpg",
        liveUrl: "https://voxyon.com",
        featured: false,
        order: 4,
        tags: JSON.stringify(["Next.js", "Audio", "Platform"]),
        techStack: JSON.stringify(["Next.js 14", "TypeScript", "MySQL", "Prisma"]),
      },
      {
        title: "Brand Identity — Tech Startup",
        slug: "brand-identity-tech-startup",
        description:
          "Complete brand identity for a Punjab-based SaaS startup: logo system, color palette, typography guide, and social media templates.",
        category: "Branding",
        thumbnail: "https://assets.nitinmonga.in/projects/brand-startup.jpg",
        featured: false,
        order: 5,
        tags: JSON.stringify(["Branding", "Logo", "Identity", "Figma"]),
        techStack: JSON.stringify(["Figma", "Adobe Illustrator", "Adobe Photoshop"]),
      },
    ],
  });

  // ─── Sample Blog Posts ────────────────────────────────────────────────────
  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "How I Built a 40K-User Music Portal with WordPress in 2015",
        slug: "how-i-built-djyoungster-40k-users",
        excerpt:
          "From a blank WordPress install to 40,000 monthly active users — the full story of building DJYoungster, the monetization strategy, and the SEO plays that made it work.",
        content: "<p>Full article content goes here...</p>",
        category: "Entrepreneurship",
        tags: JSON.stringify(["WordPress", "SEO", "Monetization", "DJYoungster"]),
        published: true,
        publishedAt: new Date("2025-01-15"),
        seoTitle: "How I Built a 40K-User Music Portal | Nitin Monga",
        seoDesc:
          "The full story of DJYoungster — a WordPress music portal I built in 2015 that grew to 40,000 monthly users through SEO and AdSense monetization.",
        readTime: 8,
        views: 1240,
      },
      {
        title: "Next.js 14 App Router: The Setup I Use for Every Project",
        slug: "nextjs-14-app-router-setup",
        excerpt:
          "My battle-tested Next.js 14 starter: TypeScript, Tailwind, Prisma 5, NextAuth, and GSAP. The exact configuration and folder structure I use to ship fast.",
        content: "<p>Full article content goes here...</p>",
        category: "Development",
        tags: JSON.stringify(["Next.js", "TypeScript", "Prisma", "Setup"]),
        published: true,
        publishedAt: new Date("2025-03-10"),
        seoTitle: "Next.js 14 App Router Setup I Use — Nitin Monga",
        readTime: 6,
        views: 890,
      },
      {
        title: "CGI Advertising for Indian Brands: What Works in 2025",
        slug: "cgi-advertising-indian-brands-2025",
        excerpt:
          "After producing 40+ CGI ads for brands across India, here's what I've learned about what makes a 3D ad campaign convert in the Indian market.",
        content: "<p>Full article content goes here...</p>",
        category: "3D & Design",
        tags: JSON.stringify(["CGI", "3D", "Advertising", "India"]),
        published: true,
        publishedAt: new Date("2025-04-22"),
        seoTitle: "CGI Advertising for Indian Brands 2025 | Nitin Monga",
        readTime: 7,
        views: 560,
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
