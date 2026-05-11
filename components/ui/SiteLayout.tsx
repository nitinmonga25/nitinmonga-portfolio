"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { CustomCursor } from "./CustomCursor";
import { LenisProvider } from "./LenisProvider";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
    </LenisProvider>
  );
}
