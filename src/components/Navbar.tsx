import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Terminal } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/', isHash: true },
        { name: 'Projects', href: '/#projects', isHash: true },
        { name: 'Experience', href: '/#experience', isHash: true },
        { name: 'Blog', href: '/blog', isHash: false },
        { name: 'Contact', href: '/#contact', isHash: true },
    ];

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
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <Terminal size={24} color="var(--accent-primary)" />
                    <span style={{ fontFamily: 'var(--font-mono)' }}>kunal.folio</span>
                </a>

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
                            backgroundColor: 'rgba(10, 10, 10, 0.98)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                            zIndex: 40
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e: any) => handleNavClick(e, link)}
                                style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
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
