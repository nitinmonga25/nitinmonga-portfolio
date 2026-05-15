export const SITE_URL = "https://nitinmonga.in";
export const OG_IMAGE  = "https://assets.nitinmonga.in/og-default.jpg";

/** Returns the custom OG image if set, otherwise falls back to the site default */
export function resolveOg(custom?: string | null): string {
  return custom?.trim() || OG_IMAGE;
}
