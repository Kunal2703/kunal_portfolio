/**
 * Colour tokens for metric panels. Kept out of the component file so
 * react-refresh can fast-refresh MetricPanel cleanly.
 */

export type Tone = 'ok' | 'info' | 'warn' | 'accent' | 'violet'

export const TONE: Record<Tone, string> = {
    ok: '#22c55e',
    info: '#38bdf8',
    warn: '#f59e0b',
    accent: '#6366f1',
    violet: '#a855f7',
}
