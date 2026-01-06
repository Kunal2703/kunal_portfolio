import { Briefcase, Calendar } from 'lucide-react';
import HighlightText from './HighlightText';

const Experience = () => {
    const experiences = [
        {
            role: 'DevOps Engineer',
            company: 'Careers360',
            period: 'Sep 2024 - Present',
            points: [
                'Managed end-to-end release and deployment processes across staging, beta, and production environments, ensuring smooth application rollouts with zero disruptions.',
                'Achieved significant FinOps cost reductions across multiple AWS accounts - 25% cost reduction in primary production account and 65% cost reduction in secondary staging account through strategic resource management and optimization.',
                'Architected and implemented Devtron CI/CD platform from scratch for build and deployment across staging, beta, and production environments, while managing entire EKS cluster operations through Devtron interface.',
                'Successfully upgraded Amazon EKS clusters from version 1.24 to 1.28, then 1.28 to 1.30 and finally to 1.31 across staging, beta, and production environments with zero downtime.',
                'Migrated 30% of legacy applications from traditional servers to Amazon EKS, improving scalability, fault tolerance, and resource optimization.',
                'Led migration from AWS CloudFront to Akamai CDN, enhancing performance and reducing latency by 30% for global content delivery.',
                'Consolidated 2 existing load balancers into a single ALB, streamlining traffic management and reducing infrastructure complexity by 40%.',
                'Improved CDN performance by separating subdomains into individual CloudFront distributions, optimizing content delivery and enhancing security.',
                'Replaced the use of env-based access and secret keys with an RBAC role-based approach, improving security and compliance across all environments (staging, beta, and production).'
            ]
        },
        {
            role: 'DevOps Engineer Internship',
            company: 'Careers360',
            period: 'March 2024 - August 2024',
            points: [
                'Utilized a comprehensive suite of AWS services (EC2, RDS, CloudWatch, Route53, CloudFront, VPC, etc.) to manage and optimize cloud infrastructure.',
                'Employed Devtron for streamlined build and deployment processes and automated tasks and workflows using Jenkins cron jobs, enhancing operational efficiency.',
                'Migrated CloudWatch metrics and logs to Grafana, reducing monthly 70 percent cost.'
            ]
        },
        {
            role: 'Summer Intern',
            company: 'Visvesvaraya National Institute of Technology',
            period: 'June 2023 - July 2023',
            points: [
                'Implemented smart irrigation system optimizing plant watering decisions using sensor data and Machine Learning algorithms, enhancing overall system performance through data-driven automation.',
                'Improved water usage efficiency and automated agricultural practices while managing and analyzing 18 million data points for fine-tune irrigation strategies.'
            ]
        }
    ];

    return (
        <section id="experience" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Work Experience</h2>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', marginBottom: '4rem', borderRadius: '2px' }} />

                <div style={{ position: 'relative', paddingLeft: '2rem', maxWidth: '800px' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }} />

                    {experiences.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '3rem', position: 'relative' }}>
                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-2.4rem',
                                top: '0.25rem',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-primary)',
                                border: '4px solid var(--bg-primary)',
                                boxShadow: '0 0 0 1px var(--accent-primary)'
                            }} />

                            <style>{`
                                .experience-header {
                                    display: flex;
                                    align-items: center;
                                    gap: 2rem;
                                    color: var(--accent-secondary);
                                    font-size: 0.95rem;
                                    font-weight: 500;
                                }
                                @media (max-width: 600px) {
                                    .experience-header {
                                        flex-direction: column;
                                        align-items: flex-start;
                                        gap: 0.5rem;
                                        margin-top: 0.25rem;
                                    }
                                }
                            `}</style>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.3' }}>{exp.role}</h3>
                                <div className="experience-header">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Briefcase size={16} /> {exp.company}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} /> {exp.period}
                                    </span>
                                </div>
                                <ul style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                                    {exp.points.map((point, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                            <HighlightText text={point} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
