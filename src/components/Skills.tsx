import { Eyebrow, MaskedHeading, Reveal } from './ui/primitives'
import Backdrop from './ui/Backdrop'
import { ICONS } from '../lib/icons'
import { skillGroups } from '../lib/data'

function Chip({ name, icon }: { name: string; icon: string }) {
  const def = ICONS[icon]
  if (!def) return null
  const { Icon, color } = def

  return (
    <span className="border-line bg-card/60 hover:border-line2 hover:bg-card group/chip inline-flex items-center gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5">
      <span
        className="shrink-0 transition-transform duration-300 group-hover/chip:scale-115"
        style={{ color, lineHeight: 0 }}
      >
        <Icon size={20} />
      </span>
      <span className="text-muted group-hover/chip:text-txt text-[14.5px] whitespace-nowrap transition-colors">
        {name}
      </span>
    </span>
  )
}

const Skills = () => {
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0)

  return (
    <section id="skills" className="section tex tex-rule" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Backdrop kind="manifest" />
      <div className="container">
        <Eyebrow index="01">Capabilities</Eyebrow>

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
            lines={['Technical Skills —', <span className="gradient-text-2">what I work with.</span>]}
          />
          <span className="text-faint font-mono text-[13px]">
            {total} tools · {skillGroups.length} areas
          </span>
        </div>

        <div className="space-y-11">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.04}>
              <div className="border-line grid gap-5 border-t pt-7 lg:grid-cols-[240px_1fr] lg:gap-10">
                <div>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    {group.title}
                  </h3>
                  <span className="text-faint font-mono text-[12px]">{group.hint}</span>
                </div>

                {/* items-start: without it the flex line stretches to the grid row
                    height, so chips grow tall and crowd the divider rules. */}
                <div className="flex flex-wrap items-start content-start gap-2.5">
                  {group.items.map((item) => (
                    <Chip key={item.name} name={item.name} icon={item.icon} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
