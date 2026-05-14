import Image from "next/image";

export interface ClientLogo {
  id:   string;
  name: string;
  logo: string;
  url?: string;
}

interface Props {
  logos: ClientLogo[];
}

function LogoItem({ logo }: { logo: ClientLogo }) {
  const inner = (
    <div
      className="flex items-center justify-center mx-5 flex-shrink-0"
      style={{ width: 140, height: 60 }}
    >
      <Image
        src={logo.logo}
        alt={logo.name}
        width={120}
        height={50}
        className="object-contain transition-all duration-300 grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
        style={{ maxHeight: 50, maxWidth: 120 }}
      />
    </div>
  );

  return logo.url ? (
    <a href={logo.url} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
      {inner}
    </a>
  ) : (
    <div aria-label={logo.name}>{inner}</div>
  );
}

export function ClientLogos({ logos }: Props) {
  if (!logos || logos.length === 0) return null;

  // Split into two rows; if odd number, first row gets one more
  const mid   = Math.ceil(logos.length / 2);
  const row1  = logos.slice(0, mid);
  const row2  = logos.slice(mid);

  // Need at least enough items to fill the track — duplicate until we have ≥8 per row
  function fill(arr: ClientLogo[]) {
    if (arr.length === 0) return logos; // fallback
    const result = [...arr];
    while (result.length < 8) result.push(...arr);
    return result;
  }

  const track1 = fill(row1);
  const track2 = fill(row2.length > 0 ? row2 : row1);

  return (
    <section className="py-16 overflow-hidden" style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-10">
        <p className="section-label mb-2">// Trusted By</p>
        <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px]">
          Clients &amp; brands I&apos;ve worked with
        </h2>
      </div>

      {/* Row 1 — LTR */}
      <div className="relative overflow-hidden mb-4" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div className="marquee-track">
          {[...track1, ...track1].map((logo, i) => (
            <LogoItem key={`r1-${logo.id}-${i}`} logo={logo} />
          ))}
        </div>
      </div>

      {/* Row 2 — RTL */}
      <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div className="marquee-track-rtl">
          {[...track2, ...track2].map((logo, i) => (
            <LogoItem key={`r2-${logo.id}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
