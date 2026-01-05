import { Briefcase, Calendar } from 'lucide-react';

const Experience = () => {
    const experiences = [
        {
            role: 'DevOps Engineer I',
            company: 'Careers360',
            period: 'Sep 2024 - Present',
            description: 'Managed end-to-end release/deployment with zero disruptions. Achieved significant FinOps cost reductions (25-65%). Architected Devtron CI/CD platform and upgraded EKS clusters from 1.24 to 1.31.'
        },
        {
            role: 'DevOps Engineer Internship',
            company: 'Careers360',
            period: 'March 2024 - August 2024',
            description: 'Utilized AWS services (EC2, RDS, CloudFront) to optimize infra. Employed Devtron for streamlined builds. Migrated CloudWatch metrics to Grafana reducing monthly costs by 70%.'
        },
        {
            role: 'Summer Intern',
            company: 'Visvesvaraya National Institute of Technology',
            period: 'June 2023 - July 2023',
            description: 'Implemented smart irrigation system using sensor data and Machine Learning algorithms to optimize plant watering decisions.'
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
                                <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
