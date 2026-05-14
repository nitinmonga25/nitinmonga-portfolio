import Script from "next/script";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Paste your Auto Ads script src here */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
