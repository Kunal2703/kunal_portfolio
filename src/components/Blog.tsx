import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localPosts } from '../lib/posts';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { usePaperSurface } from '../lib/usePaperSurface';

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

    usePaperSurface();

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

    const totalMinutes = posts.reduce((n, p) => n + (p.readTime || 0), 0);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <section className="section" style={{ paddingTop: '140px', minHeight: '100vh' }}>
            <div className="blog-shell">
                <header className="blog-hero">
                    <div className="term-path">
                        <span className="prompt">&gt;_</span>
                        <span>~/</span>
                        <span className="seg-current">writing</span>
                    </div>
                    <h1>Notes from production</h1>
                    <p className="lede">
                        Field notes on DevOps, cloud infrastructure and the migrations that
                        did not go the way the documentation said they would.
                    </p>
                    <div className="hero-stats">
                        <div><b>{posts.length}</b> entries</div>
                        <div><b>{totalMinutes}</b> min total</div>
                        <div>
                            <b><i className="status-dot" /> live</b>
                            build status
                        </div>
                    </div>
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
                    <ul className="post-index">
                        {posts.map((post, index) => (
                            <li
                                key={post.slug || index}
                                className={`post-row${index === 0 ? ' post-row--featured' : ''}`}
                            >
                                <Link to={`/blog/${post.slug}`} className="post-link">
                                    <div className="post-panel">
                                        <div className="panel-bar">
                                            <i /><i /><i />
                                            <span>{index === 0 ? 'latest' : `entry ${String(index + 1).padStart(2, '0')}`}</span>
                                        </div>
                                        <div className="post-thumb">
                                            <img
                                                src={post.coverImage}
                                                alt=""
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="status-line">
                                            <span><i className="status-dot" /><span className="status-ok">published</span></span>
                                            <span><Calendar size={12} /> {formatDate(post.publishedAt)}</span>
                                            <span><Clock size={12} /> {post.readTime} min</span>
                                        </div>
                                        <h2 className="post-title">{post.title}</h2>
                                        <p className="post-brief">{post.brief}</p>
                                        <span className="post-more">
                                            read --article <ArrowRight size={14} />
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
                    border: 3px solid var(--hairline);
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
