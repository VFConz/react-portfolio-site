import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Navigation } from '@/components/Navigation';
import { Marquee } from '@/components/ui/Marquee';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function Home() {
  return (
    <>
      <Navigation />
      {/* Offset main content for desktop sidebar nav (w-16 = 4rem) */}
      <main className="lg:ml-16">
        <section id="hero">
          <Hero />
        </section>

        {/* Marquee tech ticker between hero and about */}
        <Marquee />

        <section id="about" className="bg-bg-primary">
          <About />
        </section>

        <SectionDivider />

        <section id="experience" className="bg-bg-secondary">
          <Experience />
        </section>

        <SectionDivider />

        <section id="projects" className="bg-bg-primary">
          <Projects />
        </section>

        <SectionDivider />

        <section id="education" className="bg-bg-secondary">
          <Education />
        </section>

        <SectionDivider />

        <section id="contact" className="relative overflow-hidden bg-bg-primary">
          {/* Gradient glow behind contact section */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[120px]" />
          </div>
          <Contact />
        </section>
      </main>
    </>
  );
}
