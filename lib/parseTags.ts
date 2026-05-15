/**
 * Safely parse tags stored as a JSON string in the DB.
 * Handles clean arrays AND corrupted double-encoded arrays where
 * individual items still contain JSON bracket/quote artifacts
 * e.g. ["[\"Product Design\"","\"Brand Identity\"]"]
 */
export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((t) => String(t).replace(/^[\["\\]+|[\\"\]]+$/g, "").trim())
        .filter(Boolean);
    }
  } catch {
    // Stored as plain comma-separated string
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

/** Convert a stored JSON tags string into a comma-separated string for admin input fields */
export function tagsToInput(raw: string | null | undefined): string {
  return parseTags(raw).join(", ");
}
