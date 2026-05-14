import Script from "next/script";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="adsense-script-blog"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5308405517093129"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Enable all Auto Ads formats: display, anchor, vignette, in-article */}
      <Script id="adsense-init-blog" strategy="afterInteractive">
        {`(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-5308405517093129",enable_page_level_ads:true,overlays:{bottom:true}});`}
      </Script>
      {children}
    </>
  );
}
