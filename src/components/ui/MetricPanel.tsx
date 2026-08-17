/**
 * Grafana-style metric panel: header strip (name + unit), the stat, a
 * sub-label, then a live visualisation.
 *
 * Headline figures come from the resume and stay fixed; the series streams so
 * the charts read as live telemetry — which is why boards carry a "demo board"
 * tag. Motion is disabled under prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react'
import { TONE, type Tone } from '../../lib/metricTones'

const W = 260
const H = 64
const POINTS = 34

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Streaming series. `shape` maps a continuously advancing phase to a value, so
 * the curve flows leftwards instead of snapping between fixed points.
 */
function useLiveSeries(shape: (t: number) => number, speed = 0.05) {
    const build = (phase: number) =>
        Array.from({ length: POINTS }, (_, i) => shape(phase + i * 0.34))

    const [data, setData] = useState(() => build(0))
    const phase = useRef(0)

    useEffect(() => {
        if (prefersReducedMotion()) return
        let raf = 0
        let last = 0
        const loop = (now: number) => {
            // ~20fps is plenty for a sparkline and keeps re-renders cheap
            if (now - last > 50) {
                last = now
                phase.current += speed
                setData(build(phase.current))
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speed])

    return data
}

const scaleY = (data: number[]) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const span = max - min || 1
    return (v: number) => H - 5 - ((v - min) / span) * (H - 16)
}

const xAt = (i: number, len: number) => (i / (len - 1)) * W

/** Faint y-axis gridlines, as Grafana draws behind a graph. */
const Grid = () => (
    <g stroke="rgba(255,255,255,0.055)" strokeWidth="1">
        {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} strokeDasharray="3 4" />
        ))}
    </g>
)

const Defs = ({ id, color }: { id: string; color: string }) => (
    <defs>
        <filter id={`${id}-glow`} x="-20%" y="-60%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="55%" stopColor={color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
    </defs>
)

function LiveArea({ shape, tone, id }: { shape: (t: number) => number; tone: Tone; id: string }) {
    const data = useLiveSeries(shape)
    const y = scaleY(data)
    const c = TONE[tone]
    const line = data
        .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i, data.length).toFixed(1)},${y(v).toFixed(1)}`)
        .join(' ')
    const lastY = y(data[data.length - 1])

    return (
        <>
            <Defs id={id} color={c} />
            <Grid />
            <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id}-fill)`} />
            <path
                d={line}
                stroke={c}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={`url(#${id}-glow)`}
            />
            {/* leading edge marker */}
            <circle cx={W - 1} cy={lastY} r="5.5" fill={c} fillOpacity="0.22" />
            <circle cx={W - 1} cy={lastY} r="2.6" fill={c} />
        </>
    )
}

function LiveDual({
    shapeA,
    shapeB,
    id,
}: {
    shapeA: (t: number) => number
    shapeB: (t: number) => number
    id: string
}) {
    const a = useLiveSeries(shapeA)
    const b = useLiveSeries(shapeB)
    const y = scaleY([...a, ...b])
    const path = (d: number[]) =>
        d.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i, d.length).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

    return (
        <>
            <Defs id={id} color={TONE.ok} />
            <Grid />
            <path d={`${path(b)} L${W},${H} L0,${H} Z`} fill={`url(#${id}-fill)`} />
            <path d={path(b)} stroke={TONE.ok} strokeWidth="1.8" fill="none" filter={`url(#${id}-glow)`} />
            <path d={path(a)} stroke={TONE.info} strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
            <circle cx={W - 1} cy={y(b[b.length - 1])} r="2.6" fill={TONE.ok} />
            <circle cx={W - 1} cy={y(a[a.length - 1])} r="2.2" fill={TONE.info} />
        </>
    )
}

/** Stepped series — a version/stage ladder that keeps climbing. */
function LiveSteps({ shape, tone, id }: { shape: (t: number) => number; tone: Tone; id: string }) {
    const data = useLiveSeries(shape, 0.03)
    const y = scaleY(data)
    const c = TONE[tone]
    let d = `M0,${y(data[0]).toFixed(1)}`
    for (let i = 1; i < data.length; i++) {
        d += ` H${xAt(i, data.length).toFixed(1)} V${y(data[i]).toFixed(1)}`
    }
    return (
        <>
            <Defs id={id} color={c} />
            <Grid />
            <path d={`${d} L${W},${H} L0,${H} Z`} fill={`url(#${id}-fill)`} />
            <path d={d} stroke={c} strokeWidth="1.8" fill="none" filter={`url(#${id}-glow)`} />
            <circle cx={W - 1} cy={y(data[data.length - 1])} r="2.6" fill={c} />
        </>
    )
}

/** Bars with a lighter top cap and side face, so they read as extruded. */
function LiveBars({ shape, tone }: { shape: (t: number) => number; tone: Tone }) {
    const data = useLiveSeries(shape, 0.04).slice(-14)
    const max = Math.max(...data)
    const bw = W / data.length
    const c = TONE[tone]
    const depth = Math.min(5, bw * 0.24)

    return (
        <>
            <Grid />
            {data.map((v, i) => {
                const h = Math.max(4, (v / max) * (H - 14))
                const x = i * bw + bw * 0.14
                const w = bw * 0.58
                const top = H - h
                const o = 0.45 + (i / data.length) * 0.5
                return (
                    <g key={i} opacity={o}>
                        {/* side face */}
                        <path
                            d={`M${x + w},${top} l${depth},${-depth} v${h - depth} l${-depth},${depth} Z`}
                            fill={c}
                            fillOpacity="0.4"
                        />
                        {/* top cap */}
                        <path d={`M${x},${top} l${depth},${-depth} h${w} l${-depth},${depth} Z`} fill={c} fillOpacity="0.9" />
                        {/* front face */}
                        <rect x={x} y={top} width={w} height={h} rx="1" fill={c} />
                    </g>
                )
            })}
        </>
    )
}

/** Gauge with a soft glow; the arc breathes slightly so it isn't dead still. */
function LiveGauge({ pct, tone, id }: { pct: number; tone: Tone; id: string }) {
    const [t, setT] = useState(0)
    useEffect(() => {
        if (prefersReducedMotion()) return
        const iv = setInterval(() => setT((n) => n + 1), 90)
        return () => clearInterval(iv)
    }, [])

    const R = 34
    const CIRC = Math.PI * R
    const c = TONE[tone]
    const breathe = 1 + Math.sin(t * 0.07) * 0.015

    return (
        <svg viewBox="0 0 90 62" width="100%" height={H} fill="none">
            <defs>
                <filter id={`${id}-gglow`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.4" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path d={`M11,52 A${R},${R} 0 0 1 79,52`} stroke="rgba(255,255,255,0.09)" strokeWidth="7.5" strokeLinecap="round" />
            <path
                d={`M11,52 A${R},${R} 0 0 1 79,52`}
                stroke={c}
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * CIRC * breathe} ${CIRC}`}
                filter={`url(#${id}-gglow)`}
            />
            <text x="9" y="60" fill="#525252" style={{ fontSize: 7, fontFamily: 'var(--font-mono)' }}>
                0
            </text>
            <text x="81" y="60" textAnchor="end" fill="#525252" style={{ fontSize: 7, fontFamily: 'var(--font-mono)' }}>
                100
            </text>
        </svg>
    )
}

export type Metric = {
    title: string
    unit: string
    value: string
    sub: string
    tone: Tone
    viz: 'area' | 'steps' | 'bars' | 'gauge' | 'dual'
    /** maps an advancing phase to a value — drives the streaming series */
    shape?: (t: number) => number
    shapeB?: (t: number) => number
    pct?: number
}

export default function MetricPanel({ m }: { m: Metric }) {
    const id = `mp-${m.title.replace(/[^a-z]/gi, '')}`
    const big = m.value.length > 9 ? '1.35rem' : m.value.length > 6 ? '1.6rem' : '1.9rem'

    return (
        <div className="metric-panel">
            <div className="metric-panel-head">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="metric-live-dot" style={{ backgroundColor: TONE[m.tone] }} />
                    {m.title}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
            </div>

            <div
                style={{
                    fontSize: big,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: TONE[m.tone],
                    padding: '0.75rem 0.9rem 0',
                    whiteSpace: 'nowrap',
                }}
            >
                {m.value}
            </div>
            <div
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    color: 'var(--text-muted)',
                    padding: '0.3rem 0.9rem 0.6rem',
                    lineHeight: 1.4,
                }}
            >
                {m.sub}
            </div>

            <div style={{ padding: m.viz === 'gauge' ? '0 0.9rem 0.7rem' : 0 }}>
                {m.viz === 'gauge' ? (
                    <LiveGauge pct={m.pct ?? 100} tone={m.tone} id={id} />
                ) : (
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} fill="none" preserveAspectRatio="none">
                        {m.viz === 'area' && <LiveArea shape={m.shape!} tone={m.tone} id={id} />}
                        {m.viz === 'steps' && <LiveSteps shape={m.shape!} tone={m.tone} id={id} />}
                        {m.viz === 'bars' && <LiveBars shape={m.shape!} tone={m.tone} />}
                        {m.viz === 'dual' && <LiveDual shapeA={m.shape!} shapeB={m.shapeB!} id={id} />}
                    </svg>
                )}
            </div>
        </div>
    )
}
