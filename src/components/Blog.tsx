import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localPosts } from '../lib/posts';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useApplySurface } from '../lib/blogSurface';

interface BlogPost {
    title: string;
    brief: string;
    slug: string;
    coverImage: string;
    publishedAt: string;
    readTime: number;
}

/** Articles hosted in this repo, always shown first and never network-dependent. */
const LOCAL: BlogPost[] = localPosts.map((p) => ({
    title: p.title,
    brief: p.brief,
    slug: p.slug,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt,
    readTime: p.readTime,
}));

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>(LOCAL);
    const [loading, setLoading] = useState(LOCAL.length === 0);
    const [error, setError] = useState<string | null>(null);

    useApplySurface();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `
                query GetUserArticles {
                    publication(host: "kunaltheengineer.hashnode.dev") {
                        posts(first: 20) {
                            edges {
                                node {
                                    title
                                    brief
                                    slug
                                    readTimeInMinutes
                                    coverImage {
                                        url
                                    }
                                    publishedAt
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const response = await fetch('https://gql.hashnode.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });
                const result = await response.json();

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                if (!result.data?.publication) {
                    throw new Error("Publication not found. Please check the host name.");
                }

                const fetchedPosts = result.data.publication.posts.edges.map((edge: any) => ({
                    title: edge.node.title,
                    brief: edge.node.brief,
                    slug: edge.node.slug,
                    coverImage: edge.node.coverImage?.url || 'https://placehold.co/600x400/1f1f1f/a3a3a3?text=No+Image',
                    publishedAt: edge.node.publishedAt,
                    readTime: edge.node.readTimeInMinutes ?? 5
                }));

                // Locally hosted articles win; Hashnode fills in the rest.
                const localSlugs = new Set(LOCAL.map((p) => p.slug));
                const remote = fetchedPosts.filter((p: BlogPost) => !localSlugs.has(p.slug));
                setPosts([...LOCAL, ...remote]);
            } catch (error: any) {
                console.error("Error fetching blogs:", error);
                // Only surface an error if there is nothing at all to show.
                if (LOCAL.length === 0) setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <section className="section" style={{ paddingTop: '150px', minHeight: '100vh' }}>
            <div className="blog-shell">
                <header className="blog-hero">
                    <p className="blog-kicker">Writing</p>
                    <h1>Notes from production</h1>
                    <p className="lede">
                        Field notes on DevOps, cloud infrastructure and the migrations that
                        did not go the way the documentation said they would.
                    </p>
                </header>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : error ? (
                    <div style={{ padding: '5rem 0', color: 'var(--text-secondary)' }}>
                        <p>Unable to load articles: {error}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            You can read them directly at{' '}
                            <a href="https://kunaltheengineer.hashnode.dev/" target="_blank" rel="noopener noreferrer"
                               style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                                kunaltheengineer.hashnode.dev
                            </a>
                        </p>
                    </div>
                ) : (
                    <ul className="post-grid">
                        {posts.map((post, index) => (
                            <li key={post.slug || index} style={index === 0 ? { gridColumn: '1 / -1' } : undefined}>
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className={`post-card${index === 0 ? ' post-card--featured' : ''}`}
                                >
                                    <div className="card-cover">
                                        <img
                                            src={post.coverImage}
                                            alt=""
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="card-body">
                                        {index === 0 && (
                                            <span className="badge-new"><i /> Latest</span>
                                        )}
                                        <div className="card-meta">
                                            <span><Calendar size={13} /> {formatDate(post.publishedAt)}</span>
                                            <span><Clock size={13} /> {post.readTime} min read</span>
                                        </div>
                                        <h2 className="card-title">{post.title}</h2>
                                        <p className="card-brief">{post.brief}</p>
                                        <span className="card-more">
                                            Read article <ArrowRight size={15} />
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <style>{`
                .loading-spinner {
                    width: 34px;
                    height: 34px;
                    border: 3px solid var(--edge);
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    animation: spin 0.9s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
};

export default Blog;
