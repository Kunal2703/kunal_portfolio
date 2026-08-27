import { useEffect, useSyncExternalStore } from 'react'

/**
 * Blog index and article pages render on their own surface, separate from the
 * rest of the portfolio: `deep` (blue-tinted dark, the default) or `light`
 * (Solarized Light). Flipping one attribute on <html> re-points every theme
 * token, so the navbar, footer and .prose styles follow along.
 *
 * The reader's choice is shared between the pages and the navbar toggle, which
 * live in different branches of the tree, so it is held in a module-level
 * store rather than threaded through context.
 */
export type Surface = 'deep' | 'light'

const KEY = 'blog-surface'
const listeners = new Set<() => void>()

const read = (): Surface => {
    try {
        return localStorage.getItem(KEY) === 'light' ? 'light' : 'deep'
    } catch {
        // Safari in private mode throws on access rather than returning null.
        return 'deep'
    }
}

let current: Surface = read()

const subscribe = (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
}

const snapshot = () => current

export const setSurface = (next: Surface) => {
    if (next === current) return
    current = next
    try {
        localStorage.setItem(KEY, next)
    } catch {
        // Preference simply does not persist; the session still works.
    }
    listeners.forEach((fn) => fn())
}

/** Read the current surface and re-render when it changes. */
export const useSurface = (): Surface =>
    useSyncExternalStore(subscribe, snapshot, snapshot)

/**
 * Own the <html> attribute for as long as a blog page is mounted. Removing it
 * on unmount is what returns the home page to its own dark theme.
 */
export const useApplySurface = () => {
    const surface = useSurface()

    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-surface', surface)
        return () => root.removeAttribute('data-surface')
    }, [surface])

    return surface
}
