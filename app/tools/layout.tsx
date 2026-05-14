import Script from "next/script";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5308405517093129"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Enable all Auto Ads formats — guarded so it only runs once across navigations */}
      <Script id="adsense-init" strategy="afterInteractive">
        {`if(!window.__adsInitDone){window.__adsInitDone=true;(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-5308405517093129",enable_page_level_ads:true,overlays:{bottom:true}});}`}
      </Script>
      {children}
    </>
  );
}
