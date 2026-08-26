import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

import GrowthRings from '../../components/home/GrowthRings';
import FieldLedger from '../../components/home/FieldLedger';
import Projects from '../../components/home/Projects';
import Domains from '../../components/home/Domains';
import JoinCta from '../../components/home/JoinCta';
import Button from '../../components/ui/Button';
import SEO from '../../components/common/SEO';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Checkpoint 1: three rings = three real years, verified from the club's
// achievement record (Makers Fest 2023 → VIRTOSWA/Robosumo 2024 → 2025).
const RING_YEARS = [
  { year: '2023', note: 'First public build — paper recycling at Makers Fest.' },
  { year: '2024', note: 'VIRTOSWA on stage. Robosumo wins at NIT Rourkela.' },
  { year: '2025', note: '72 women trained in Sambalpuri crafts. SAMAVESH. Research bootcamp.' },
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
        gsap.from('.project-card', {
          clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' },
        });
        gsap.from('.domain-card', {
          opacity: 0, y: 16, duration: 0.5, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.domains-grid', start: 'top 85%' },
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
        description="Team of Sustainability — the official sustainability club of VSSUT Burla. Members build waste-sorting robots and solar trackers, run drives and workshops, and take sustainability skills to schools."
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
              Official sustainability club · VSSUT Burla, Odisha
            </p>
            <h1 className="hero-title mt-4 font-display text-[clamp(2.6rem,6.5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-humus">
              Sustainability, engineered.
            </h1>
            <p className="hero-sub mt-6 max-w-lg text-[15px] font-medium leading-relaxed text-humus/85">
              We are Team of Sustainability — the official club of VSSUT Burla.
              Our members build waste-sorting robots and solar trackers, run
              plantation and recycling drives, and take what they learn into
              classrooms, fests and communities.
            </p>

            <div className="hero-cta mt-8 flex flex-wrap gap-4">
              <Button to="/events">Upcoming drives</Button>
              <Button variant="text" to="/gallery">
                Proof of work →
              </Button>
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

      {/* ── FEATURED — VIRTOSWA 2K25 ──
        Photo slot: when the club shares the full-resolution stage photo,
        drop it in as an <img> over this panel (keep the neem duotone).
        Until then the engineering-drawing motif carries the section. */}
      <figure className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="paper-texture relative overflow-hidden rounded-md border border-humus/30 bg-humus">
          <svg viewBox="0 0 1200 480" className="block h-auto w-full" aria-hidden="true">
            {/* circuit-trace motif — engineering drawing, not decoration:
                the club's actual builds (waste sorter, solar tracker) look like this */}
            <g stroke="#3E7A4C" strokeOpacity="0.55" strokeWidth="1.5" fill="none">
              <polyline points="0,90 180,90 240,150 460,150" />
              <polyline points="1200,140 1020,140 960,200 740,200" />
              <polyline points="0,330 260,330 320,390 560,390" />
              <polyline points="1200,300 940,300 880,360 660,360" />
            </g>
            <g stroke="#31605F" strokeOpacity="0.45" strokeWidth="1.5" fill="none">
              <polyline points="0,210 300,210 360,270 600,270" />
              <polyline points="1200,420 900,420 840,470 620,470" />
            </g>
            <g fill="#3E7A4C" fillOpacity="0.6">
              <circle cx="240" cy="150" r="4" />
              <circle cx="960" cy="200" r="4" />
              <circle cx="320" cy="390" r="4" />
              <circle cx="880" cy="360" r="4" />
              <circle cx="360" cy="270" r="4" />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 p-8 md:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-kraft/60">
              Featured · October 2025
            </p>
            <p className="font-display text-3xl font-semibold text-kraft md:text-5xl">
              VIRTOSWA 2K25
            </p>
            <p className="max-w-md text-sm font-medium leading-relaxed text-kraft/75 md:text-base">
              Club projects on stage — a year of builds and drives, presented to
              the new batch.
            </p>
          </div>
        </div>
        <figcaption className="mt-2 text-xs text-humus/60">
          VIRTOSWA 2K25 · October 2025 · VSSUT Burla
        </figcaption>
      </figure>

      {/* ── FIELD LEDGER (signature) ── */}
      <FieldLedger />

      {/* ── PROJECTS ── */}
      <Projects />

      {/* ── FOUR DOMAINS ── */}
      <Domains />

      {/* ── JOIN ── */}
      <JoinCta />
    </div>
  );
}
