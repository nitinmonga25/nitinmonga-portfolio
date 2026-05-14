export const revalidate = 86400;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for nitinmonga.in — how your data is collected and used.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "14 May 2025";

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero */}
      <section className="py-20 border-b border-[var(--color-border)]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <p className="section-label mb-4">// Legal</p>
          <h1
            className="font-display font-bold text-[var(--color-ink)] mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Privacy Policy
          </h1>
          <p className="font-body text-[var(--color-muted)] text-[15px]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 space-y-10">

          <Block title="1. Who I Am">
            I am Nitin Monga, an independent freelancer based in Punjab, India,
            operating this website at nitinmonga.in. This policy explains how I
            collect, use, and protect any information you provide when using this
            website.
          </Block>

          <Block title="2. Information I Collect">
            <span className="block mb-2">I may collect the following information:</span>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <strong>Contact form submissions</strong> — your name, email
                address, and message when you reach out via the contact form.
              </li>
              <li>
                <strong>Usage data</strong> — anonymised analytics data such as
                page views, device type, and browser via Google Analytics (no
                personally identifiable information).
              </li>
              <li>
                <strong>Tool inputs</strong> — data you enter into free tools
                (QR Studio, UI Analyzer, etc.) is processed entirely in your
                browser and is never stored on my servers.
              </li>
            </ul>
          </Block>

          <Block title="3. How I Use Your Information">
            <ul className="list-disc list-inside space-y-1.5">
              <li>To respond to your enquiries and project requests.</li>
              <li>To improve the website based on usage patterns.</li>
              <li>
                I do not sell, trade, or share your personal information with
                third parties for marketing purposes.
              </li>
            </ul>
          </Block>

          <Block title="4. Cookies">
            This website uses cookies to analyse traffic via Google Analytics.
            These cookies do not store personally identifiable information. You
            can disable cookies in your browser settings at any time.
          </Block>

          <Block title="5. Google AdSense">
            This website displays ads via Google AdSense. Google may use cookies
            to show you relevant ads based on your browsing activity. You can
            opt out via{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </Block>

          <Block title="6. Data Retention">
            Contact form messages are retained only as long as necessary to
            respond to your enquiry and are not shared with any third party.
          </Block>

          <Block title="7. Your Rights">
            You have the right to request access to, correction of, or deletion
            of any personal data I hold about you. To make such a request,
            contact me directly.
          </Block>

          <Block title="8. Security">
            I take reasonable precautions to protect your information. However,
            no transmission over the internet is 100% secure and I cannot
            guarantee absolute security.
          </Block>

          <Block title="9. Changes to This Policy">
            This privacy policy may be updated from time to time. Any changes
            will be reflected by updating the "Last updated" date above.
            Continued use of the website after changes constitutes your
            acceptance of the updated policy.
          </Block>

          <Block title="10. Contact">
            For any questions or concerns about this privacy policy, please
            contact me at:{" "}
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
      <div className="font-body text-[var(--color-muted)] text-[15px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
