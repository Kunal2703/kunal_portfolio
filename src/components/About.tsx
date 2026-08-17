import { Server, Activity, Container, Shield } from 'lucide-react';

const About = () => {
    const customStats = [
        { label: 'Uptime', value: 'Zero Downtime', icon: Shield },
        { label: 'AWS Cost Cut — Prod / Staging', value: '25% / 65%', icon: Activity },
        { label: 'Peak Traffic Handled', value: '5 Lakh+ Reqs', icon: Server },
        { label: 'Platform Built on AWS', value: 'POC ➜ Prod', icon: Container },
        { label: 'EKS Upgrade', value: '1.24 ➜ 1.33', icon: Server },
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
                            I am a <strong>DevOps &amp; SRE Engineer</strong> with <strong>2.5+ years of experience</strong> architecting resilient cloud infrastructure across <strong>AWS and GCP</strong>, prioritizing <strong>FinOps</strong> and security. Currently at <strong>Urumi (UrumiAI)</strong>, I bridge the gap between development and operations to deliver scalable solutions.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            At Urumi I built an AI-native e-commerce platform end-to-end — from POC to production — provisioning <strong>8+ AWS services</strong> as <strong>Terraform IaC</strong> with a <strong>multi-tenant Helm provisioner</strong>, alongside a <strong>dual-cloud (AWS ➜ GCP)</strong> integration and a full observability stack on <strong>GKE</strong>.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            Previously at <strong>Careers360</strong>, I scaled infrastructure through the highest traffic surge in the company's history (<strong>5 lakh+ requests in 30 minutes</strong>), architected a <strong>Devtron CI/CD</strong> platform from scratch, and upgraded <strong>EKS 1.24 ➜ 1.31</strong> with zero downtime.
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
