import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow, MaskedHeading, Reveal, Pill } from './ui/primitives'
import { projects } from '../lib/data'

function ProjectRow({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [hover, setHover] = useState(false)

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="border-line group relative block border-t py-8 sm:py-10"
    >
      {/* accent wash on hover */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 -z-10 rounded-2xl"
            style={{
              background:
                'linear-gradient(90deg, rgba(99,102,241,0.14) 0%, rgba(168,85,247,0.07) 48%, transparent 88%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <span className="text-faint w-8 shrink-0 font-mono text-[13px]">
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3
          className="flex-1 font-extrabold transition-transform duration-500 group-hover:translate-x-2"
          style={{
            fontSize: 'clamp(1.6rem,4.2vw,3rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}
        >
          {project.title}
        </h3>

        <span className="text-muted hidden max-w-[230px] text-right text-[14px] leading-snug lg:block">
          {project.subtitle}
        </span>

        <span
          className="text-faint shrink-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
          style={{ lineHeight: 0 }}
        >
          <ArrowUpRight size={26} className="group-hover:text-accent transition-colors" />
        </span>
      </div>

      <p className="text-muted mt-4 max-w-3xl text-[14.5px] leading-relaxed sm:pl-14">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 sm:pl-14">
        {project.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </a>
  )
}

const Projects = () => {
  return (
    <section id="projects" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <Eyebrow index="03">Selected work</Eyebrow>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <MaskedHeading lines={['Featured', <span className="gradient-text-2">Projects.</span>]} />
          <span className="text-faint font-mono text-[13px]">{projects.length} repositories</span>
        </div>

        <div>
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <ProjectRow project={p} index={i} />
            </Reveal>
          ))}
          <div className="border-line border-t" />
        </div>
      </div>
    </section>
  )
}

export default Projects
