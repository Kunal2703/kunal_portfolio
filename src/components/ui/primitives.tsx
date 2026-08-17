import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/** Numbered eyebrow label above a section heading. */
export function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <motion.div
      className="eyebrow"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      <span style={{ color: 'var(--accent-primary)' }}>{index}</span>
      <span className="eyebrow-rule" />
      <span>{children}</span>
    </motion.div>
  )
}

/**
 * Heading whose lines slide up from behind a clip.
 *
 * The viewport trigger sits on the <h2>, not on the sliding line — each line
 * starts translated 110% below its clip box, so observing the line itself
 * watches a rect that can sit off-screen and the reveal never fires.
 */
export function MaskedHeading({
  lines,
  className = 'section-heading',
}: {
  lines: ReactNode[]
  className?: string
}) {
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
          <motion.span
            style={{ display: 'block' }}
            variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
            transition={{ duration: 0.85, delay: i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

/** Fade-and-rise on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Small outlined tag. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="border-line text-muted inline-flex items-center rounded-full border px-3 py-1 font-mono text-[12.5px]">
      {children}
    </span>
  )
}
