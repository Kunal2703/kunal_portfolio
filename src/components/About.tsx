import { Server, Activity, Container, Shield } from 'lucide-react';

const About = () => {
    const customStats = [
        { label: 'Uptime', value: 'Zero Disruptions', icon: Shield },
        { label: 'Cost Reduction', value: '65%', icon: Activity },
        { label: 'EKS Upgrade', value: '1.24 -> 1.31', icon: Server },
        { label: 'CGPA', value: '8.56', icon: Container },
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
                            I am a DevOps Engineer at <strong>Careers360</strong> and a Computer Science graduate from <strong>University of Petroleum and Energy Studies (UPES)</strong>. My expertise lies in architecting resilient cloud infrastructure, optimizing FinOps, and ensuring seamless deployment cycles.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            From migrating legacy applications to Amazon EKS to slashing infrastructure costs by up to 65%, I focus on delivering tangible business value through engineering excellence. I thrive on solving complex reliability challenges and automating the mundane.
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
