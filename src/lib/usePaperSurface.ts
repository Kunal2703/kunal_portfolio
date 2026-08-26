import { useEffect } from 'react'

/**
 * Blog index and article pages render on a light paper surface while the rest
 * of the portfolio stays dark. Flipping one attribute on <html> re-points the
 * theme tokens, so the navbar, footer and .prose styles all follow along.
 */
export const usePaperSurface = () => {
    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-surface', 'paper')
        return () => root.removeAttribute('data-surface')
    }, [])
}
