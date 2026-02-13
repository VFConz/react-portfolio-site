'use client';

const keywords = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Three.js',
  'GSAP',
  'Tailwind CSS',
  'AWS',
  'Java',
  'Kotlin',
  'REST APIs',
  'Auth0',
  'PostgreSQL',
  'Git',
  'Framer Motion',
];

export function Marquee() {
  // Duplicate the list so the animation seamlessly loops
  const doubled = [...keywords, ...keywords];

  return (
    <div className="relative overflow-hidden border-y border-border bg-bg-secondary py-5">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-secondary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-secondary to-transparent" />

      <div className="marquee-track flex w-max gap-8">
        {doubled.map((keyword, i) => (
          <span
            key={`${keyword}-${i}`}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-text-muted"
          >
            {keyword}
            <span className="h-1 w-1 rounded-full bg-accent opacity-60" />
          </span>
        ))}
      </div>
    </div>
  );
}
