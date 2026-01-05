import { Cloud, Box, Workflow, Code, Activity, Terminal } from 'lucide-react';

const Skills = () => {
    const skillCategories = [
        {
            title: 'Cloud & Orchestration',
            icon: Cloud,
            skills: [
                { name: 'AWS', level: 90 },
                { name: 'Kubernetes', level: 85 },
                { name: 'Docker / EKS', level: 90 },
            ]
        },
        {
            title: 'CI/CD',
            icon: Workflow,
            skills: [
                { name: 'Devtron', level: 95 },
                { name: 'Jenkins', level: 85 },
                { name: 'GitHub Actions', level: 90 },
            ]
        },
        {
            title: 'Monitoring',
            icon: Activity,
            skills: [
                { name: 'Grafana', level: 95 },
                { name: 'Prometheus', level: 90 },
                { name: 'ELK Stack', level: 80 },
            ]
        },
        {
            title: 'Networking & CDN',
            icon: Box,
            skills: [
                { name: 'Akamai / CloudFront', level: 85 },
                { name: 'ALB / NLB', level: 90 },
                { name: 'VPC', level: 85 },
            ]
        },
        {
            title: 'Scripting',
            icon: Terminal,
            skills: [
                { name: 'Python', level: 85 },
                { name: 'Bash', level: 90 },
                { name: 'Shell Scripting', level: 90 },
            ]
        },
        {
            title: 'Databases',
            icon: Code,
            skills: [
                { name: 'MySQL', level: 85 },
                { name: 'Amazon RDS', level: 85 },
                { name: 'PostgreSQL', level: 75 },
            ]
        }
    ];


    return (
        <section className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Technical Arsenal</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Tools and technologies I work with</p>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', margin: '1.5rem auto', borderRadius: '2px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {skillCategories.map((category) => (
                        <div key={category.title} style={{
                            backgroundColor: 'var(--bg-card)',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <category.icon size={24} color="var(--accent-secondary)" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{category.title}</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {category.skills.map((skill) => (
                                    <div key={skill.name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: '500' }}>{skill.name}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{skill.level}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${skill.level}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                                                borderRadius: '3px'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
