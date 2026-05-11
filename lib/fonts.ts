import { Bricolage_Grotesque } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

/* Keep legacy exports so layout.tsx compiles without changes */
export const playfair = bricolage;
export const dmSans   = bricolage;
