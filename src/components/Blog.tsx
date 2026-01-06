import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface BlogPost {
    title: string;
    brief: string;
    slug: string;
    coverImage: string;
    publishedAt: string;
}

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `
                query GetUserArticles {
                    publication(host: "kunaltheengineer.hashnode.dev") {
                        posts(first: 6) {
                            edges {
                                node {
                                    title
                                    brief
                                    slug
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
                    publishedAt: edge.node.publishedAt
                }));

                setPosts(fetchedPosts);
            } catch (error: any) {
                console.error("Error fetching blogs:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="section" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <header style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Technical Blog</h2>
                    <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px', marginBottom: '1.5rem' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                        Sharing my experiences and insights in DevOps, Cloud Engineering, and System reliability.
                    </p>
                </header>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                        <div className="loading-spinner" />
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                        <p>Unable to load blogs: {error}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>You can visit my blog directly at <a href="https://kunaltheengineer.hashnode.dev/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>kunaltheengineer.hashnode.dev</a></p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {posts.map((post, index) => (
                            <a
                                key={index}
                                href={`https://kunaltheengineer.hashnode.dev/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-card"
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400/1f1f1f/a3a3a3?text=Development';
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={14} /> 5 min read
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.4' }}>
                                        {post.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                                        {post.brief}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: '500', fontSize: '0.95rem' }}>
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .blog-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(99, 102, 241, 0.3);
                }
                .blog-card:hover h3 {
                    color: var(--accent-primary);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(99, 102, 241, 0.1);
                    border-top: 3px solid var(--accent-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default Blog;
