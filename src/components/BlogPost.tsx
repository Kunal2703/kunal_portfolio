import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useApplySurface } from '../lib/blogSurface';
import BlogBackdrop from './ui/BlogBackdrop';
import { backdropForSlug } from '../lib/backdropKind';
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

    useApplySurface();

    const bodyRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<string>('');

    /* Inject heading ids into the HTML string rather than setting them on the
       DOM afterwards: React owns this subtree via dangerouslySetInnerHTML and
       re-renders would drop any attribute we added out of band. */
    const { html, toc } = useMemo(() => {
        if (!article) return { html: '', toc: [] as { id: string; text: string }[] };

        const decode = (raw: string) => {
            const el = document.createElement('textarea');
            el.innerHTML = raw;
            return el.value;
        };

        const items: { id: string; text: string }[] = [];
        const seen = new Set<string>();

        const out = article.html.replace(
            /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g,
            (_m, attrs: string | undefined, inner: string) => {
                const text = decode(inner.replace(/<[^>]+>/g, '')).trim();
                let id =
                    text
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '')
                        .slice(0, 60) || `section-${items.length}`;
                while (seen.has(id)) id = `${id}-${items.length}`;
                seen.add(id);
                items.push({ id, text });
                return `<h2 id="${id}"${attrs || ''}>${inner}</h2>`;
            }
        );

        return { html: out, toc: items };
    }, [article]);

    /* Highlight whichever section the reader is currently in. A scroll check
       rather than IntersectionObserver: with an observer, a heading sitting
       between the band edges fires nothing and the highlight goes stale. */
    useEffect(() => {
        const root = bodyRef.current;
        if (!root || toc.length < 2) return;

        let raf = 0;

        const update = () => {
            raf = 0;
            /* Query fresh each time: React re-sets this subtree's innerHTML, and
               nodes captured once go stale. Detached nodes report top: 0, which
               would make every heading look scrolled past. */
            const heads = Array.from(root.querySelectorAll('h2')).filter((h) => h.id);
            if (!heads.length) return;

            /* A heading becomes "current" once it reaches the upper third of
               the viewport, not the moment it clears the navbar. At a fixed
               140px offset a heading could fill the screen while the previous
               section stayed highlighted, which reads as the index lagging. */
            const line = Math.max(160, Math.round(window.innerHeight * 0.34));
            let current = heads[0];
            for (const h of heads) {
                if (h.getBoundingClientRect().top <= line) current = h;
                else break;
            }
            setActiveId(current.id);
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        /* Images and webfonts land after the first paint and shift every
           heading, so re-measure once everything has settled. */
        window.addEventListener('load', onScroll);
        const settle = window.setTimeout(update, 600);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            window.removeEventListener('load', onScroll);
            window.clearTimeout(settle);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [html, toc.length]);

    const jumpTo = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
        setActiveId(id);
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <article className="section" style={{ paddingTop: '150px', minHeight: '100vh' }}>
            <BlogBackdrop kind={backdropForSlug(slug ?? '')} />
            <div className="article-wide">

                <Link to="/blog" className="article-back">
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
                            border: '1px solid rgba(255,255,255,0.07)',
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
                        <div className="card-meta">
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
                                    border: '1px solid var(--edge)',
                                    marginBottom: '3rem',
                                }}
                            />
                        )}

                        {/* Body + section index */}
                        <div className="article-layout">
                            <div className="article-main" ref={bodyRef}>
                                <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
                            </div>

                            {toc.length > 1 && (
                                <aside className="article-toc">
                                    <p className="toc-title">Outline</p>
                                    <nav>
                                        {toc.map((t) => (
                                            <a
                                                key={t.id}
                                                href={`#${t.id}`}
                                                onClick={(e) => jumpTo(e, t.id)}
                                                className={`toc-link${t.id === activeId ? ' is-active' : ''}`}
                                            >
                                                {t.text}
                                            </a>
                                        ))}
                                    </nav>
                                </aside>
                            )}
                        </div>

                        <div
                            style={{
                                marginTop: '4rem',
                                paddingTop: '2rem',
                                borderTop: '1px solid var(--edge)',
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
                    background: linear-gradient(90deg, #1a1a1a 25%, #232323 50%, #1a1a1a 75%);
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
