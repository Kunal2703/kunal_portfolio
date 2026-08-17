import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Eyebrow, MaskedHeading, Reveal, Pill } from './ui/primitives'
import { experience } from '../lib/data'

const EASE = [0.16, 1, 0.3, 1] as const

const Experience = () => {
  const [open, setOpen] = useState(0)

  return (
    <section id="experience" className="section" style={{ backgroundColor: '#0f0f0f' }}>
      <div className="container">
        <Eyebrow index="02">Experience</Eyebrow>

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
          <MaskedHeading
            lines={['Work Experience —', <span className="gradient-text-2">where I’ve operated.</span>]}
          />
          <span className="text-faint font-mono text-[13px]">
            {experience.length} roles · 2023 → now
          </span>
        </div>

        <div className="border-line border-t">
          {experience.map((exp, i) => {
            const isOpen = i === open
            return (
              <Reveal key={`${exp.company}-${exp.period}`} delay={i * 0.05}>
                <div className="border-line border-b">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-6 py-8 text-left sm:gap-10 sm:py-9"
                  >
                    <span className="text-faint w-12 shrink-0 pt-2 font-mono text-[13px] sm:w-20">
                      {exp.start}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <span
                          className="font-bold transition-transform duration-500 group-hover:translate-x-1.5"
                          style={{
                            fontSize: 'clamp(1.4rem,3.4vw,2.4rem)',
                            lineHeight: 1.05,
                            letterSpacing: '-0.025em',
                          }}
                        >
                          {exp.company}
                        </span>
                        {exp.current && (
                          <span
                            className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-[0.15em] uppercase"
                            style={{
                              color: '#22c55e',
                              borderColor: 'rgba(34,197,94,0.4)',
                              backgroundColor: 'rgba(34,197,94,0.1)',
                            }}
                          >
                            current
                          </span>
                        )}
                      </span>

                      <span className="text-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px]">
                        <span style={{ color: 'var(--accent-secondary)' }}>{exp.role}</span>
                        <span className="text-faint">·</span>
                        <span className="text-faint">{exp.period}</span>
                        <span className="text-faint">·</span>
                        <span className="text-faint">{exp.location}</span>
                      </span>

                      {!isOpen && (
                        <span className="text-muted mt-4 block max-w-2xl text-[15px] leading-relaxed">
                          {exp.summary}
                        </span>
                      )}
                    </span>

                    <span
                      className={`text-faint mt-1.5 shrink-0 transition-all duration-500 ${isOpen ? 'rotate-45' : ''}`}
                      style={{ lineHeight: 0 }}
                    >
                      <Plus size={26} className="group-hover:text-accent transition-colors" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 sm:pl-30">
                          <p className="text-muted mb-7 max-w-2xl text-[15.5px] leading-relaxed">
                            {exp.summary}
                          </p>

                          <ul className="max-w-3xl space-y-4">
                            {exp.points.map((p, idx) => (
                              <li key={idx} className="flex gap-4">
                                <span
                                  className="mt-2.5 size-1.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: 'var(--accent-primary)' }}
                                />
                                <span className="text-muted text-[15px] leading-relaxed">{p}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-7 flex flex-wrap gap-2">
                            {exp.stack.map((s) => (
                              <Pill key={s}>{s}</Pill>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
