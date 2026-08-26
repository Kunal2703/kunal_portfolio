import { useEffect } from 'react'

/**
 * Blog index and article pages render on a deeper, blue-tinted dark surface
 * than the rest of the portfolio. Flipping one attribute on <html> re-points
 * the theme tokens, so the navbar, footer and .prose styles follow along.
 */
export const useDeepSurface = () => {
    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-surface', 'deep')
        return () => root.removeAttribute('data-surface')
    }, [])
}
