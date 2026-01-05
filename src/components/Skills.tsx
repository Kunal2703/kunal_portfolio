import { Cloud, Box, Workflow, Code, Activity, Terminal } from 'lucide-react';
import {
    SiAmazon, SiKubernetes, SiDocker,
    SiJenkins, SiGithubactions,
    SiGrafana, SiPrometheus, SiElastic,
    SiAkamai, SiPython, SiGnubash,
    SiMysql, SiPostgresql
} from 'react-icons/si';

const Skills = () => {
    const skillCategories = [
        {
            title: 'Cloud & Orchestration',
            icon: Cloud,
            skills: [
                { name: 'AWS', icon: SiAmazon, color: '#FF9900' },
                { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
                { name: 'Docker / EKS', icon: SiDocker, color: '#2496ED' },
            ]
        },
        {
            title: 'CI/CD',
            icon: Workflow,
            skills: [
                { name: 'Devtron', icon: Workflow, color: '#6366f1' }, // Devtron logo not in simple-icons, using generic
                { name: 'Jenkins', icon: SiJenkins, color: '#D24939' },
                { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
            ]
        },
        {
            title: 'Monitoring',
            icon: Activity,
            skills: [
                { name: 'Grafana', icon: SiGrafana, color: '#F46800' },
                { name: 'Prometheus', icon: SiPrometheus, color: '#E6522C' },
                { name: 'ELK Stack', icon: SiElastic, color: '#005571' },
            ]
        },
        {
            title: 'Networking & CDN',
            icon: Box,
            skills: [
                { name: 'Akamai / CloudFront', icon: SiAkamai, color: '#FF9900' },
                { name: 'ALB / NLB', icon: Cloud, color: '#FF9900' },
                { name: 'VPC', icon: Box, color: '#8c8c8c' },
            ]
        },
        {
            title: 'Scripting',
            icon: Terminal,
            skills: [
                { name: 'Python', icon: SiPython, color: '#3776AB' },
                { name: 'Bash', icon: SiGnubash, color: '#4EAA25' },
                { name: 'Shell Scripting', icon: Terminal, color: '#fff' },
            ]
        },
        {
            title: 'Databases',
            icon: Code,
            skills: [
                { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
                { name: 'Amazon RDS', icon: SiAmazon, color: '#527FFF' },
                { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
            ]
        }
    ];


    return (
        <section id="skills" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Technical Arsenal</h2>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', marginBottom: '3rem', borderRadius: '2px' }} />
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '700px' }}>
                    Tools and technologies I work with
                </p>

                <style>{`
                    .skills-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                    }
                    .skill-tag {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.75rem 1.25rem;
                        background-color: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 2rem;
                        font-size: 0.95rem;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }
                    @media (max-width: 768px) {
                        .skills-grid {
                            grid-template-columns: 1fr;
                            gap: 1.5rem;
                        }
                        .skill-tag {
                            padding: 0.6rem 1rem;
                            font-size: 0.85rem;
                        }
                        .skills-container {
                            gap: 0.6rem !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .skill-tag {
                            padding: 0.5rem 0.85rem;
                            font-size: 0.8rem;
                        }
                    }
                `}</style>

                <div className="skills-grid">
                    {skillCategories.map((category) => (
                        <div key={category.title} style={{
                            backgroundColor: 'var(--bg-card)',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--accent-primary)'
                                }}>
                                    <category.icon size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{category.title}</h3>
                            </div>
                            <div className="skills-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {category.skills.map((skill) => {
                                    const Icon = skill.icon;
                                    return (
                                        <div
                                            key={skill.name}
                                            className="skill-tag"
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = `${skill.color}15`;
                                                e.currentTarget.style.borderColor = `${skill.color}40`;
                                                e.currentTarget.style.boxShadow = `0 0 20px ${skill.color}30`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <Icon size={18} color={skill.color} />
                                            <span>{skill.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
