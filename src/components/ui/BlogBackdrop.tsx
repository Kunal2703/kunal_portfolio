import { useEffect, useRef, useState } from 'react'
import type { BackdropKind } from '../../lib/backdropKind'

/**
 * Fixed watermark behind the blog pages, in four variants so the index and
 * each article do not all share one backdrop:
 *
 *   telemetry - latency trace with an SLO line over a throughput histogram
 *   mesh      - service topology with packets in flight along the edges
 *   pipeline  - CI/CD lanes with stages filling and commits flowing through
 *   cluster   - isometric grid of pods, rolling on a scheduling wave
 *
 * Every colour comes from CSS custom properties set per surface in index.css,
 * so the same layer reads correctly on both the dark and Solarized surfaces.
 * The whole thing is decorative - aria-hidden, pointer-events: none - and
 * holds a single static frame under prefers-reduced-motion.
 */

const W = 1440
const H = 900

const FLOOR = 726        // baseline the histogram stands on
const DEPTH = 13         // isometric extrusion offset
const BARS = 30
const BAR_GAP = 6

const TRACE_POINTS = 78
const TRACE_TOP = 300
const TRACE_BAND = 150   // vertical range the trace moves within
const SLO_Y = TRACE_TOP + TRACE_BAND * 0.28

const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Latency: a slow swell with smaller harmonics riding on it. */
const latency = (t: number) =>
    0.5 +
    0.26 * Math.sin(t * 0.55) +
    0.13 * Math.sin(t * 1.63 + 1.1) +
    0.06 * Math.sin(t * 3.4 + 0.4)

/** Throughput: a different period so the two layers never march in step. */
const throughput = (t: number) =>
    0.46 + 0.3 * Math.sin(t * 0.42 + 0.8) + 0.16 * Math.sin(t * 1.17)

const usePhase = (speed: number) => {
    const [phase, setPhase] = useState(0)
    const value = useRef(0)

    useEffect(() => {
        if (reduced()) return
        let raf = 0
        let last = 0
        const loop = (now: number) => {
            // ~16fps: this is a background texture, not a readout, and every
            // frame re-renders two full paths.
            if (now - last > 62) {
                last = now
                value.current += speed
                setPhase(value.current)
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [speed])

    return phase
}

const traceGeometry = (phase: number) => {
    const step = W / (TRACE_POINTS - 1)
    const pts = Array.from({ length: TRACE_POINTS }, (_, i) => {
        const y = TRACE_TOP + TRACE_BAND * (1 - latency(phase + i * 0.22))
        return [i * step, y] as const
    })
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
    return { line, area: `${line} L${W} ${FLOOR} L0 ${FLOOR} Z`, pts }
}

const Histogram = ({ phase }: { phase: number }) => {
    const width = (W - BAR_GAP * (BARS - 1)) / BARS
    return (
        <g>
            {Array.from({ length: BARS }, (_, i) => {
                const h = 26 + 150 * throughput(phase * 0.8 + i * 0.42)
                const x = i * (width + BAR_GAP)
                const y = FLOOR - h
                return (
                    <g key={i}>
                        {/* front */}
                        <rect x={x} y={y} width={width} height={h} fill="var(--wm-bar-face)" />
                        {/* top cap */}
                        <polygon
                            points={`${x},${y} ${x + DEPTH},${y - DEPTH} ${x + width + DEPTH},${y - DEPTH} ${x + width},${y}`}
                            fill="var(--wm-bar-top)"
                        />
                        {/* right side */}
                        <polygon
                            points={`${x + width},${y} ${x + width + DEPTH},${y - DEPTH} ${x + width + DEPTH},${FLOOR - DEPTH} ${x + width},${FLOOR}`}
                            fill="var(--wm-bar-side)"
                        />
                    </g>
                )
            })}
        </g>
    )
}

const Telemetry = ({ phase }: { phase: number }) => {
    const { line, area, pts } = traceGeometry(phase)
    const head = pts[pts.length - 1]
    return (
        <>
            <path d={area} fill="url(#wm-fill)" />
            <path d={line} fill="none" stroke="var(--wm-trace)" strokeWidth="2.5" strokeLinejoin="round" />
            <line x1="0" y1={SLO_Y} x2={W} y2={SLO_Y} stroke="var(--wm-slo)" strokeWidth="1.5" strokeDasharray="7 9" />
            <circle cx={head[0]} cy={head[1]} r="5" fill="var(--wm-trace)" />
            <Histogram phase={phase} />
            <line x1="0" y1={FLOOR} x2={W} y2={FLOOR} stroke="var(--wm-grid-strong)" strokeWidth="1.5" />
        </>
    )
}

/* ---------- mesh: services and the traffic between them ---------- */

const NODES = [
    { x: 190, y: 250, r: 30, label: 'edge' },
    { x: 470, y: 170, r: 24, label: 'api' },
    { x: 430, y: 470, r: 26, label: 'auth' },
    { x: 750, y: 300, r: 34, label: 'orders' },
    { x: 1010, y: 190, r: 24, label: 'cache' },
    { x: 1050, y: 520, r: 28, label: 'db' },
    { x: 1290, y: 360, r: 22, label: 'queue' },
    { x: 700, y: 660, r: 25, label: 'worker' },
]

const EDGES: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [3, 7], [7, 5],
]

const Mesh = ({ phase }: { phase: number }) => (
    <>
        {EDGES.map(([a, b], i) => {
            const A = NODES[a]
            const B = NODES[b]
            // Each packet runs its own offset so they never pulse in unison.
            const t = ((phase * 0.22 + i * 0.17) % 1 + 1) % 1
            return (
                <g key={i}>
                    <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--wm-grid-strong)" strokeWidth="1.5" />
                    <circle
                        cx={A.x + (B.x - A.x) * t}
                        cy={A.y + (B.y - A.y) * t}
                        r="5"
                        fill="var(--wm-trace)"
                    />
                </g>
            )
        })}
        {NODES.map((n, i) => {
            // A slow breath on the radius reads as load moving through the mesh.
            const pulse = 1 + 0.06 * Math.sin(phase * 0.9 + i)
            return (
                <g key={n.label}>
                    <circle cx={n.x} cy={n.y} r={n.r * pulse} fill="var(--wm-bar-face)" stroke="var(--wm-trace)" strokeWidth="1.5" />
                    <circle cx={n.x} cy={n.y} r={n.r * 0.28} fill="var(--wm-bar-top)" />
                </g>
            )
        })}
    </>
)

/* ---------- pipeline: stages filling, commits flowing ---------- */

const LANES = [190, 340, 490, 640]
const STAGES = [140, 440, 740, 1040]
const STAGE_W = 220
const STAGE_H = 74

const Pipeline = ({ phase }: { phase: number }) => (
    <>
        {LANES.map((y, lane) => (
            <g key={y}>
                <line x1="60" y1={y + STAGE_H / 2} x2={W - 60} y2={y + STAGE_H / 2} stroke="var(--wm-grid-strong)" strokeWidth="1.5" />
                {STAGES.map((x, si) => {
                    // Progress sweeps left to right across the lane, one stage
                    // at a time, each lane trailing the one above it.
                    const cycle = ((phase * 0.16 - lane * 0.18) % 4 + 4) % 4
                    const fill = Math.max(0, Math.min(1, cycle - si))
                    return (
                        <g key={x}>
                            <rect x={x} y={y} width={STAGE_W} height={STAGE_H} rx="10" fill="var(--wm-bar-face)" stroke="var(--wm-grid-strong)" strokeWidth="1.5" />
                            <rect x={x} y={y} width={STAGE_W * fill} height={STAGE_H} rx="10" fill="var(--wm-bar-top)" />
                        </g>
                    )
                })}
                {Array.from({ length: 3 }, (_, k) => {
                    const t = ((phase * 0.1 + lane * 0.25 + k * 0.33) % 1 + 1) % 1
                    return <circle key={k} cx={60 + (W - 120) * t} cy={y + STAGE_H / 2} r="5" fill="var(--wm-trace)" />
                })}
            </g>
        ))}
    </>
)

/* ---------- cluster: isometric pods on a scheduling wave ---------- */

const COLS = 11
const ROWS = 9
// Wide enough that the diamond reaches both margins. The mask clears the
// middle of the page, so a grid tuned to sit centred would be almost entirely
// invisible - the cubes have to be out where the texture is allowed to show.
const CUBE_W = 58
const CUBE_D = 29

const Cube = ({ cx, cy, h }: { cx: number; cy: number; h: number }) => (
    <g>
        <polygon
            points={`${cx},${cy - h} ${cx + CUBE_W},${cy - h + CUBE_D} ${cx},${cy - h + CUBE_D * 2} ${cx - CUBE_W},${cy - h + CUBE_D}`}
            fill="var(--wm-bar-top)"
        />
        <polygon
            points={`${cx - CUBE_W},${cy - h + CUBE_D} ${cx},${cy - h + CUBE_D * 2} ${cx},${cy + CUBE_D * 2} ${cx - CUBE_W},${cy + CUBE_D}`}
            fill="var(--wm-bar-face)"
        />
        <polygon
            points={`${cx + CUBE_W},${cy - h + CUBE_D} ${cx},${cy - h + CUBE_D * 2} ${cx},${cy + CUBE_D * 2} ${cx + CUBE_W},${cy + CUBE_D}`}
            fill="var(--wm-bar-side)"
        />
    </g>
)

const Cluster = ({ phase }: { phase: number }) => (
    <g>
        {Array.from({ length: ROWS }, (_, row) =>
            Array.from({ length: COLS }, (_, col) => {
                const cx = W / 2 - CUBE_W + (col - row) * CUBE_W
                const cy = 120 + (col + row) * CUBE_D
                // A diagonal wave, so pods look scheduled in bands.
                const h = 14 + 34 * (0.5 + 0.5 * Math.sin(phase * 0.7 + col * 0.55 + row * 0.42))
                return <Cube key={`${row}-${col}`} cx={cx} cy={cy} h={h} />
            }),
        )}
    </g>
)

const VARIANTS = { telemetry: Telemetry, mesh: Mesh, pipeline: Pipeline, cluster: Cluster }

export default function BlogBackdrop({ kind = 'telemetry' }: { kind?: BackdropKind }) {
    const phase = usePhase(0.055)
    const Layer = VARIANTS[kind]

    return (
        <div className="blog-backdrop" aria-hidden="true">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
                <defs>
                    <pattern id="wm-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M48 0 L0 0 0 48" fill="none" stroke="var(--wm-grid)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="wm-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--wm-fill-top)" />
                        <stop offset="100%" stopColor="var(--wm-fill-bottom)" />
                    </linearGradient>
                </defs>

                <rect width={W} height={H} fill="url(#wm-grid)" />
                <Layer phase={phase} />
            </svg>
        </div>
    )
}
