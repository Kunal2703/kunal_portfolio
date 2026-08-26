import Backdrop from './ui/Backdrop';
import MetricPanel, { type Metric } from './ui/MetricPanel';

const METRICS: Metric[] = [
    {
        title: 'uptime',
        unit: 'on upgrades',
        value: '100%',
        sub: 'zero downtime · staging → beta → prod',
        tone: 'ok',
        viz: 'gauge',
        pct: 100,
    },
    {
        // two accounts trending down at different rates
        title: 'aws cost cut',
        unit: 'prod / staging',
        value: '25% / 65%',
        sub: 'FinOps right-sizing, 2 accounts',
        tone: 'ok',
        viz: 'dual',
        shape: (t) => 74 + Math.sin(t * 0.5) * 3 + Math.sin(t * 1.7) * 1.4,
        shapeB: (t) => 42 + Math.sin(t * 0.42) * 7 + Math.sin(t * 1.3) * 3,
    },
    {
        // bursty request volume with an occasional spike
        title: 'peak traffic',
        unit: 'req / 30 min',
        value: '5 Lakh+',
        sub: 'UP Board Results event',
        tone: 'info',
        viz: 'area',
        shape: (t) =>
            52 +
            Math.sin(t * 0.55) * 20 +
            Math.sin(t * 1.4) * 10 +
            Math.sin(t * 3.1) * 5 +
            (Math.sin(t * 0.13) > 0.94 ? 22 : 0),
    },
    {
        title: 'platform build',
        unit: 'urumi · emdash',
        value: 'POC ➜ Prod',
        sub: '8+ AWS services as Terraform IaC',
        tone: 'violet',
        viz: 'steps',
        shape: (t) => 4 + Math.round((Math.sin(t * 0.34) + 1) * 3),
    },
    {
        title: 'eks upgrade',
        unit: 'control plane',
        value: '1.24 ➜ 1.33',
        sub: 'stepped, zero downtime',
        tone: 'accent',
        viz: 'steps',
        shape: (t) => 28 + Math.round((Math.sin(t * 0.28) + 1) * 2.5),
    },
    {
        title: 'devtron',
        unit: 'from scratch',
        value: '150+ Apps',
        sub: 'build & deploy across 3 envs',
        tone: 'violet',
        viz: 'bars',
        shape: (t) => 60 + Math.sin(t * 0.7) * 26 + Math.sin(t * 1.9) * 12,
    },
];

const About = () => {

    return (
        <section id="about" className="section tex tex-grid tex-bloom" style={{ backgroundColor: '#0f0f0f' }}>
            <Backdrop kind="topology" />
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>About Me</h2>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', marginBottom: '3rem', borderRadius: '2px' }} />

                <style>{`
                    .about-grid {
                        display: grid;
                        grid-template-columns: 0.85fr 1.15fr; /* text + metric board */
                        gap: 3.5rem;
                        align-items: start;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.85rem;
                    }
                    @media (max-width: 968px) {
                        .about-grid {
                            grid-template-columns: 1fr; /* Stack text and stats */
                            gap: 2rem;
                        }
                        .stats-grid {
                            grid-template-columns: 1fr 1fr; /* Keep 2 columns for stats on mobile */
                            gap: 0.7rem;
                        }
                    }
                     @media (max-width: 480px) {
                        .stats-grid {
                            grid-template-columns: 1fr;
                            gap: 0.6rem;
                        }
                     }
                `}</style>

                <div className="about-grid">

                    <div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            I am a <strong>DevOps &amp; SRE Engineer</strong> with <strong>2.5+ years of experience</strong> architecting resilient cloud infrastructure across <strong>AWS and GCP</strong>, prioritizing <strong>FinOps</strong> and security. Currently at <strong>Urumi (UrumiAI)</strong>, I bridge the gap between development and operations to deliver scalable solutions.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            At Urumi I built an AI-native e-commerce platform end-to-end — from POC to production — provisioning <strong>8+ AWS services</strong> as <strong>Terraform IaC</strong> with a <strong>multi-tenant Helm provisioner</strong>, alongside a <strong>dual-cloud (AWS ➜ GCP)</strong> integration and a full observability stack on <strong>GKE</strong>. I also led <strong>3 production e-commerce migrations</strong> (2 UK, 1 US) onto multi-tenant GKE — the largest at <strong>~150GB MySQL</strong> — cutting over at <strong>zero replication lag</strong> through a staged CDC chain on <strong>GCP Database Migration Service</strong>.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            Previously at <strong>Careers360</strong>, I scaled infrastructure through the highest traffic surge in the company's history (<strong>5 lakh+ requests in 30 minutes</strong>), architected a <strong>Devtron CI/CD</strong> platform from scratch, and upgraded <strong>EKS 1.24 ➜ 1.31</strong> with zero downtime.
                        </p>
                    </div>

                    <div>
                        {/* board header, like a Grafana dashboard title row */}
                        <div className="metric-board-head">
                            <span className="metric-board-dot" />
                            impact overview
                            <span className="metric-board-rule" />
                            <span style={{ letterSpacing: '0.08em', textTransform: 'none' }}>demo board</span>
                        </div>

                        <div className="stats-grid">
                            {METRICS.map((m) => (
                                <MetricPanel key={m.title} m={m} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
