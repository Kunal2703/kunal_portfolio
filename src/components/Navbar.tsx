import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Terminal, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSurface, setSurface } from '../lib/blogSurface';

/**
 * Topmate mark, from topmate.io/favicon.svg. Simple Icons has no Topmate
 * glyph, so the paths are inlined. Drawn in currentColor rather than the
 * brand red so it sits with the lucide icons beside it; the brand colour
 * comes back on hover, the same way LinkedIn and GitHub behave.
 */
const TopmateIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 47 46" fill="none" aria-hidden="true">
        <circle cx="23.62" cy="23" r="21.4" stroke="currentColor" strokeWidth="2.2" />
        <path
            d="M33.0038 29.6411C31.5707 31.6672 29.5206 33.1752 27.1598 33.9401C24.7989 34.705 22.254 34.6857 19.905 33.8851C17.5561 33.0844 15.5291 31.5454 14.1269 29.4978C12.7247 27.4503 12.0225 25.0041 12.1251 22.5246C12.2277 20.045 13.1296 17.6652 14.6962 15.7405C16.2627 13.8158 18.4099 12.4495 20.817 11.8456C23.224 11.2418 25.7619 11.4328 28.0515 12.3901C30.341 13.3474 32.2595 15.0197 33.5204 17.1572L23.6152 23L33.0038 29.6411Z"
            fill="currentColor"
        />
    </svg>
)

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Only the blog pages apply a surface, so the toggle is scoped to them.
    const onBlog = location.pathname.startsWith('/blog');
    const surface = useSurface();
    const toggleSurface = () => setSurface(surface === 'light' ? 'deep' : 'light');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/', isHash: true },
        { name: 'Experience', href: '/#experience', isHash: true },
        { name: 'Projects', href: '/#projects', isHash: true },
        { name: 'Blog', href: '/blog', isHash: false },
        { name: 'Contact', href: '/#contact', isHash: true },
    ];

    const handleLogoClick = () => {
        setIsMobileMenuOpen(false);
        // Already on '/' means the router will not re-render, so nothing would
        // move the viewport; and arriving from an article leaves the browser's
        // restored scroll position. Reset it either way.
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; isHash: boolean }) => {
        if (!link.isHash) {
            setIsMobileMenuOpen(false);
            return;
        }

        e.preventDefault();
        const [path, hash] = link.href.split('#');

        if (location.pathname !== path) {
            navigate(link.href);
            setIsMobileMenuOpen(false);
            return;
        }

        const targetId = hash || 'home';
        const element = targetId === 'home' ? document.getElementById('home') : document.getElementById(targetId);

        if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
                }`}
            style={{
                backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <Link
                    to="/"
                    onClick={handleLogoClick}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }}
                    aria-label="Kunal — back to home"
                >
                    <Terminal size={24} color="var(--accent-primary)" />
                    <span style={{ fontFamily: 'var(--font-mono)' }}>kunal.folio</span>
                </Link>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={(e: any) => handleNavClick(e, link)}
                            style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <a
                            href="https://topmate.io/kunalsingh27/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#E44332'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            aria-label="Book a call on Topmate"
                        >
                            <TopmateIcon size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/kunal27/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#0077b5'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="https://github.com/Kunal2703"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                            aria-label="GitHub"
                        >
                            <Github size={20} />
                        </a>

                        {onBlog && (
                            <button
                                onClick={toggleSurface}
                                className="surface-toggle"
                                aria-label={surface === 'light' ? 'Switch to dark reading theme' : 'Switch to light reading theme'}
                                title={surface === 'light' ? 'Dark theme' : 'Light theme'}
                            >
                                {surface === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ display: 'block', color: 'var(--text-primary)' }}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '80px',
                            left: 0,
                            width: '100%',
                            backgroundColor: 'var(--menu-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            borderBottom: '1px solid var(--menu-edge)',
                            boxShadow: 'var(--menu-shadow)',
                            zIndex: 40
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e: any) => handleNavClick(e, link)}
                                style={{ color: 'var(--menu-text)', fontSize: '1.1rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                            <a
                                href="https://topmate.io/kunalsingh27/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                                aria-label="Book a call on Topmate"
                            >
                                <TopmateIcon size={24} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/kunal27/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <Linkedin size={24} />
                            </a>
                            <a
                                href="https://github.com/Kunal2703"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <Github size={24} />
                            </a>

                            {onBlog && (
                                <button
                                    onClick={toggleSurface}
                                    className="surface-toggle"
                                    aria-label={surface === 'light' ? 'Switch to dark reading theme' : 'Switch to light reading theme'}
                                >
                                    {surface === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Inline styles for media queries simulation */}
            <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
