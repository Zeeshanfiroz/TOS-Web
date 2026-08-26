import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import GrowthRings from '../../components/home/GrowthRings';
import FieldLedger from '../../components/home/FieldLedger';
import WorkGrid from '../../components/home/WorkGrid';
import JoinCta from '../../components/home/JoinCta';
import Button from '../../components/ui/Button';
import SEO from '../../components/common/SEO';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Checkpoint 1: three rings = three real years of logged history.
const RING_YEARS = [
  { year: '2024', note: 'Founded. First nursery behind the workshops.' },
  { year: '2025', note: '500 saplings across Plots A–D. Recycling begins.' },
  { year: '2026', note: 'Every entry on record. December planting next.' },
];

export default function Home() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Full choreography — only when the user allows motion
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitType('.hero-title', { types: 'lines,words' });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-eyebrow', { opacity: 0, x: -16, duration: 0.5 })
          .from('.hero-title .word', { yPercent: 110, duration: 0.9, stagger: 0.09 }, 0.15)
          .from('.hero-sub', { opacity: 0, y: 12, duration: 0.5 }, '-=0.45')
          .from('.hero-cta > *', { opacity: 0, y: 12, duration: 0.45, stagger: 0.08 }, '-=0.3')
          // Rings draw themselves while the headline settles
          .from('.hero-ring', { strokeDashoffset: 1, duration: 1.8, ease: 'power2.inOut', stagger: 0.3 }, 0.25)
          .from('.ring-legend > *', { opacity: 0, y: 10, stagger: 0.1, duration: 0.4 }, '-=0.9');

        // Scroll reveals — 'top 85%' keeps triggers below the sticky navbar
        gsap.from('.ledger-row', {
          x: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.ledger-strip', start: 'top 85%' },
        });
        gsap.from('.work-tile', {
          clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.work-grid', start: 'top 85%' },
        });

        return () => split.revert();
      });

      // Reduced motion: jump straight to final state — rings fully drawn,
      // no SplitType split, no reveals.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero-ring', { strokeDashoffset: 0 });
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="paper-texture bg-kraft text-humus">
      <SEO
        title="Home"
        description="500 saplings planted at VSSUT Burla. 412 still standing. Team of Sustainability — engineering students doing logged, verifiable campus work."
      />

      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 md:pb-2 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-12">
          {/* Rings — first on mobile, right column on desktop */}
          <div className="order-first flex justify-center md:order-none md:col-span-5 md:justify-end">
            <GrowthRings className="w-[240px] md:w-[420px]" />
          </div>

          <div className="md:col-span-7">
            <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.08em] text-mahanadi">
              Est. 2024 · VSSUT Burla · Mahanadi basin
            </p>
            <h1 className="hero-title mt-4 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-humus">
              500 saplings planted.{' '}
              <span className="text-neem">412 still standing.</span> The rest is
              in the ledger.
            </h1>
            <p className="hero-sub mt-6 max-w-lg text-[15px] font-medium leading-relaxed text-humus/85">
              We are Team of Sustainability — engineering students at VSSUT Burla who
              plant in the campus laterite, compost every kilo of waste, and log what
              survives. No filters, just numbers.
            </p>

            <div className="hero-cta mt-8 flex flex-wrap gap-4">
              <Button to="/gallery">See the work</Button>
              <Button variant="text" to="/announcements">Field log →</Button>
            </div>

            {/* Mobile ring legend — vertical timeline (checkpoint 2) */}
            <ol className="mt-12 space-y-4 border-l-2 border-neem/30 pl-5 md:hidden">
              {RING_YEARS.map((r) => (
                <li key={r.year} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-kraft bg-neem" aria-hidden="true" />
                  <p className="font-display text-sm font-semibold text-laterite">{r.year}</p>
                  <p className="text-sm font-medium leading-snug text-humus/85">{r.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Desktop ring legend — under the rings */}
        <div className="mt-10 hidden justify-end md:flex">
          <ol className="grid w-full max-w-[420px] grid-cols-3 gap-5 border-t border-humus/15 pt-4">
            {RING_YEARS.map((r) => (
              <li key={r.year}>
                <p className="font-display text-sm font-semibold text-laterite">{r.year}</p>
                <p className="mt-1 text-xs font-medium leading-snug text-humus/75">{r.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FIELD LEDGER (signature) ── */}
      <FieldLedger />

      {/* ── RECENT WORK ── */}
      <WorkGrid />

      {/* ── JOIN ── */}
      <JoinCta />
    </div>
  );
}
