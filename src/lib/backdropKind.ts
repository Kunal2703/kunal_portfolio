import { localPosts } from './posts'

/**
 * Which watermark a blog page gets. The index keeps the telemetry layer; each
 * article takes one of the others so no two adjacent posts look alike.
 *
 * Assignment is by position in the post list rather than by hashing the slug:
 * with only a handful of articles a hash leaves whole variants unused - the
 * slugs here are long and similar, and both djb2 and FNV-1a put every post
 * into two of the three buckets. Cycling the list guarantees all three appear
 * and stays stable for as long as the ordering does.
 */
export const BACKDROP_KINDS = ['telemetry', 'mesh', 'pipeline', 'cluster'] as const

export type BackdropKind = (typeof BACKDROP_KINDS)[number]

/** Article variants — telemetry is reserved for the index. */
const ARTICLE_KINDS = BACKDROP_KINDS.filter((k) => k !== 'telemetry')

/** Stable fallback for a post that is not in the local list (e.g. fetched). */
const hash = (s: string) => {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

export const backdropForSlug = (slug: string): BackdropKind => {
    const index = localPosts.findIndex((p) => p.slug === slug)
    const seat = index >= 0 ? index : hash(slug)
    return ARTICLE_KINDS[seat % ARTICLE_KINDS.length]
}
