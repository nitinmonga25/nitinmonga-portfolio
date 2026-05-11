import type { Metadata } from "next";
import { bricolage } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Nitin Monga",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className="antialiased bg-[#0F0F0F] text-white">
        {children}
      </body>
    </html>
  );
}
