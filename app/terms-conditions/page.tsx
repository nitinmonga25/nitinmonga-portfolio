export const revalidate = 86400;

import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using nitinmonga.in and its services.",
  alternates: { canonical: `${SITE_URL}/terms-conditions/` },
  robots: { index: true, follow: true },
  openGraph: {
    title:       "Terms & Conditions — Nitin Monga",
    description: "Terms and conditions for using nitinmonga.in and its services.",
    url:         `${SITE_URL}/terms-conditions/`,
    images:      [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Terms & Conditions — Nitin Monga",
    description: "Terms and conditions for using nitinmonga.in and its services.",
    images:      [OG_IMAGE],
  },
};

const LAST_UPDATED = "14 May 2025";

export default function TermsPage() {
  return (
    <main className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero */}
      <section className="py-20 border-b border-[var(--color-border)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-4">// Legal</p>
          <h1
            className="font-display font-bold text-[var(--color-ink)] mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="font-body text-[var(--color-muted)] text-[15px]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-10">

          <Block title="1. Acceptance of Terms">
            By accessing or using this website (nitinmonga.in), you agree to be
            bound by these Terms &amp; Conditions. If you do not agree with any
            part of these terms, please do not use this website.
          </Block>

          <Block title="2. Services">
            I am an independent freelancer offering graphic design, web
            development, 3D visualisation, and related digital services. Any
            project engagement is governed by a separate written agreement or
            proposal shared between us before work begins.
          </Block>

          <Block title="3. Intellectual Property">
            All content on this website — including text, images, graphics, 3D
            renders, and code — is the property of Nitin Monga unless otherwise
            stated. You may not reproduce, distribute, or use any content
            without prior written permission. Upon full payment for a commissioned
            project, intellectual property rights for that deliverable are
            transferred to you as agreed in the project contract.
          </Block>

          <Block title="4. Tools &amp; Free Resources">
            Free tools provided on this website (e.g., QR Studio, UI Analyzer,
            Color Palette Generator) are offered "as is" without any warranty.
            I do not guarantee uninterrupted availability or accuracy of results.
            You use them at your own risk.
          </Block>

          <Block title="5. Limitation of Liability">
            To the fullest extent permitted by law, I am not liable for any
            direct, indirect, incidental, or consequential damages arising from
            your use of this website or its tools, including but not limited to
            loss of data, business, or revenue.
          </Block>

          <Block title="6. Third-Party Links">
            This website may contain links to third-party websites. I have no
            control over their content and accept no responsibility for them.
            Visiting linked sites is at your own discretion.
          </Block>

          <Block title="7. Governing Law">
            These terms are governed by the laws of India. Any disputes arising
            from the use of this website shall be subject to the jurisdiction of
            courts in Punjab, India.
          </Block>

          <Block title="8. Changes to These Terms">
            I reserve the right to update these Terms &amp; Conditions at any
            time. Changes will be reflected by updating the "Last updated" date
            above. Continued use of the website after changes constitutes your
            acceptance of the revised terms.
          </Block>

          <Block title="9. Contact">
            If you have any questions about these terms, you can reach me at:{" "}
            <a
              href="mailto:nitinmonga14@gmail.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              nitinmonga14@gmail.com
            </a>
          </Block>

        </div>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] p-7">
      <h2 className="font-display font-bold text-[var(--color-ink)] text-[18px] mb-3">
        {title}
      </h2>
      <p className="font-body text-[var(--color-muted)] text-[15px] leading-relaxed">
        {children}
      </p>
    </div>
  );
}
