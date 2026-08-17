export interface LocalPost {
    slug: string
    title: string
    subtitle: string
    brief: string
    coverImage: string
    publishedAt: string
    readTime: number
    tags: string[]
    html: string
}

const BASE = import.meta.env.BASE_URL

/** Path to an image under `public/blog/<folder>/`, base-URL aware for GitHub Pages. */
export const asset = (folder: string) => (name: string) => `${BASE}blog/${folder}/${name}`
