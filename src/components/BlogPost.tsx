import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { usePaperSurface } from '../lib/usePaperSurface';
import { findLocalPost } from '../lib/posts';

interface Article {
    title: string;
    subtitle: string | null;
    coverImage: string | null;
    publishedAt: string;
    readTime: number;
    tags: string[];
    html: string;
}

const HOST = 'kunaltheengineer.hashnode.dev';

const QUERY = `
  query GetPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        title
        subtitle
        publishedAt
        readTimeInMinutes
        coverImage { url }
        tags { name }
        content { html }
      }
    }
  }
`;

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (!slug) return;

        // Articles hosted in this repo render straight away — no network needed.
        const local = findLocalPost(slug);
        if (local) {
            setArticle({
                title: local.title,
                subtitle: local.subtitle,
                coverImage: local.coverImage,
                publishedAt: local.publishedAt,
                readTime: local.readTime,
                tags: local.tags,
                html: local.html,
            });
            setError(null);
            setLoading(false);
            return;
        }

        let alive = true;

        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://gql.hashnode.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: QUERY, variables: { host: HOST, slug } }),
                });
                const result = await response.json();
                if (!alive) return;

                if (result.errors) throw new Error(result.errors[0].message);

                const post = result.data?.publication?.post;
                if (!post) throw new Error('Article not found.');

                setArticle({
                    title: post.title,
                    subtitle: post.subtitle ?? null,
                    coverImage: post.coverImage?.url ?? null,
                    publishedAt: post.publishedAt,
                    readTime: post.readTimeInMinutes ?? 5,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tags: (post.tags ?? []).map((t: any) => t.name),
                    html: post.content?.html ?? '',
                });
            } catch (err) {
                if (alive) setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchPost();
        return () => { alive = false; };
    }, [slug]);

    usePaperSurface();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <article className="section" style={{ paddingTop: '140px', minHeight: '100vh' }}>
            <div className="article-shell">

                <Link to="/blog" className="back-link">
                    <ArrowLeft size={15} /> All articles
                </Link>

                {loading && (
                    <div>
                        <div className="skeleton" style={{ height: '1.25rem', width: '30%', marginBottom: '1.5rem' }} />
                        <div className="skeleton" style={{ height: '3rem', width: '90%', marginBottom: '0.75rem' }} />
                        <div className="skeleton" style={{ height: '3rem', width: '60%', marginBottom: '2.5rem' }} />
                        <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%', marginBottom: '2.5rem' }} />
                        {[95, 100, 88, 100, 72].map((w, i) => (
                            <div key={i} className="skeleton" style={{ height: '1rem', width: `${w}%`, marginBottom: '0.9rem' }} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.85rem',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--hairline)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <AlertCircle size={18} style={{ color: '#eab308', flexShrink: 0, marginTop: '2px' }} />
                        <span>
                            Couldn’t load this article ({error}). It may have been renamed or unpublished.{' '}
                            <Link to="/blog" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                                Back to all articles
                            </Link>
                        </span>
                    </div>
                )}

                {!loading && !error && article && (
                    <>
                        <header className="article-head">
                        <div className="post-meta">
                            <span><Calendar size={13} /> {formatDate(article.publishedAt)}</span>
                            <span><Clock size={13} /> {article.readTime} min read</span>
                        </div>

                        <h1>{article.title}</h1>

                        {article.subtitle && <p className="article-sub">{article.subtitle}</p>}

                        {article.tags.length > 0 && (
                            <div className="article-tags">
                                {article.tags.slice(0, 6).map((tag) => (
                                    <span key={tag} className="article-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                        </header>

                        {/* Cover image — skipped when the body already shows it, so
                            posts whose cover *is* their in-article diagram (e.g. the
                            architecture write-ups) don't render it twice. */}
                        {article.coverImage && !article.html.includes(article.coverImage) && (
                            <img
                                src={article.coverImage}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--hairline)',
                                    marginBottom: '3rem',
                                }}
                            />
                        )}

                        {/* Body — Hashnode-authored HTML, styled by .prose */}
                        <div className="prose" dangerouslySetInnerHTML={{ __html: article.html }} />

                        <div
                            style={{
                                marginTop: '4rem',
                                paddingTop: '2rem',
                                borderTop: '1px solid var(--hairline)',
                            }}
                        >
                            <Link
                                to="/blog"
                                className="btn btn-outline"
                                style={{ display: 'inline-flex' }}
                            >
                                <ArrowLeft size={16} /> Read more articles
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .skeleton {
                    background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%);
                    background-size: 200% 100%;
                    border-radius: var(--radius-md);
                    animation: skeleton-shimmer 1.4s ease-in-out infinite;
                }
                @keyframes skeleton-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </article>
    );
};

export default BlogPost;
