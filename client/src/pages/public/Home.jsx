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

      {/* ── HERO PROOF PHOTO — placeholder, swap with a real club photo ── */}
      <figure className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-md border border-humus/30">
          <img
            src="https://picsum.photos/seed/tos-hero/1600/700?grayscale"
            alt="Placeholder — replace with a real club photo from the archive"
            loading="lazy"
            decoding="async"
            className="aspect-[21/9] w-full object-cover"
          />
          <div className="absolute inset-0 bg-neem/20 mix-blend-multiply" aria-hidden="true" />
          <figcaption className="absolute bottom-0 left-0 border-t border-humus/15 bg-kraft/95 px-4 py-2 text-xs font-medium text-humus/70">
            Placeholder frame — swap with a real club photo (VIRTOSWA, Robosumo or a drive).
          </figcaption>
        </div>
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
