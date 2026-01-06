import { Server, Activity, Container, Shield } from 'lucide-react';

const About = () => {
    const customStats = [
        { label: 'Uptime', value: 'Zero Downtime', icon: Shield },
        { label: 'Cloud Costs', value: 'Reduced by 25%', icon: Activity },
        { label: 'EKS Upgrade', value: '1.24 ➜ 1.32', icon: Server },
        { label: 'Devtron From Scratch', value: '150+ Apps', icon: Container },
    ];

    return (
        <section id="about" className="section" style={{ backgroundColor: '#0f0f0f' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>About Me</h2>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', marginBottom: '3rem', borderRadius: '2px' }} />

                <style>{`
                    .about-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr; /* Default to 2 columns for text + stats */
                        gap: 4rem;
                        align-items: center;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1.5rem;
                    }
                    @media (max-width: 968px) {
                        .about-grid {
                            grid-template-columns: 1fr; /* Stack text and stats */
                            gap: 2rem;
                        }
                        .stats-grid {
                            grid-template-columns: 1fr 1fr; /* Keep 2 columns for stats on mobile */
                            gap: 1rem;
                        }
                    }
                     @media (max-width: 480px) {
                        .stats-grid {
                            gap: 0.75rem; /* Tighter gap on very small screens */
                        }
                     }
                `}</style>

                <div className="about-grid">

                    <div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            I am a <strong>DevOps & SRE Engineer</strong> with <strong>2 years of experience</strong> in architecting resilient cloud infrastructure, prioritizing <strong>FinOps</strong> and security. Currently at <strong>Careers360</strong>, I bridge the gap between development and operations to deliver scalable solutions.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            My work involves managing complex <strong>Kubernetes (EKS)</strong> clusters and automating workflows. I successfully architected a <strong>Devtron CI/CD</strong> platform from scratch for <strong>150+ applications</strong> and led a major migration from AWS CloudFront to <strong>Akamai CDN</strong>, significantly boosting global performance.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            I thrive on solving reliability challenges. Whether it's consolidating load balancers to reduce complexity by <strong>40%</strong> or implementing strict <strong>RBAC</strong> policies for better security, I focus on building systems that are robust, secure, and cost-efficient.
                        </p>
                    </div>

                    <div className="stats-grid">
                        {customStats.map((stat) => (
                            <div key={stat.label} style={{
                                backgroundColor: 'var(--bg-card)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
