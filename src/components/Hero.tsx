import { useState, useEffect } from 'react';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
    const [text, setText] = useState('');
    const fullText = "kubectl apply -f infrastructure.yaml";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '300px',
                height: '300px',
                backgroundColor: 'var(--accent-primary)',
                filter: 'blur(150px)',
                opacity: 0.15,
                borderRadius: '50%',
                zIndex: -1
            }} />

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                {/* Helper for responsive grid */}
                <style>{`
          @media (max-width: 968px) {
            .container { grid-template-columns: 1fr !important; text-align: center; }
            .hero-content { align-items: center !important; }
            .hero-buttons { justify-content: center; }
            .terminal-window { margin-top: 3rem; }
          }
        `}</style>

                <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '2rem',
                        color: 'var(--accent-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                            <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--accent-primary)' }}></span>
                        </span>
                        Available for hire
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', fontWeight: 'bold' }}>
                        Building Reliable <span className="gradient-text">Infrastructure</span><br />
                        & Automating Scale
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: '1.6' }}>
                        DevOps Engineer & SRE | Specializing in FinOps, Kubernetes Orchestration, and Automated Chaos. I architect systems for zero downtime and maximum efficiency.
                    </p>

                    <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <a href="#projects" className="btn btn-primary">
                            View Work <ArrowRight size={18} />
                        </a>
                        <a href="/resume.pdf" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                            Download CV <Download size={18} />
                        </a>
                    </div>
                </div>

                {/* Terminal Animation */}
                <div className="terminal-window" style={{
                    backgroundColor: '#1e1e1e',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem'
                }}>
                    {/* Terminal Header */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#252526',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                        <div style={{ marginLeft: '1rem', color: '#888', fontSize: '0.8rem' }}>user@devops:~/projects</div>
                    </div>

                    {/* Terminal Content */}
                    <div style={{ padding: '1.5rem', color: '#d4d4d4', minHeight: '300px' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> <span className="typing-cursor">{text}</span>
                        </div>

                        <div style={{
                            opacity: text.length === fullText.length ? 1 : 0,
                            transition: 'opacity 0.5s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ color: '#a3a3a3' }}>Applying configuration...</div>
                            <div>deployment.apps/backend-api <span style={{ color: '#27c93f' }}>created</span></div>
                            <div>service/backend-api <span style={{ color: '#27c93f' }}>created</span></div>
                            <div>ingress.networking.k8s.io/api-gateway <span style={{ color: '#27c93f' }}>created</span></div>

                            <div style={{ marginTop: '1rem' }}>
                                <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> terraform plan
                            </div>
                            <div style={{ color: '#27c93f', fontWeight: 'bold' }}>
                                Plan: 12 to add, 0 to change, 0 to destroy.
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> <span style={{ animation: 'blink 1s step-start infinite' }}>_</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
