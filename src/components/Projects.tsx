import { ArrowRight } from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            title: 'QuillPost: Microservice Blog App',
            description: 'Scalable microservices architecture with Django (Auth), Spring Boot (Posting), and React. Containerized with Docker and orchestrated via Kubernetes.',
            tags: ['Kubernetes', 'Docker', 'Django', 'Spring Boot', 'React'],
            link: '#'
        },
        {
            title: 'Cloud Provider Advisor',
            description: 'Multi-cloud VM comparison platform using SDKs to aggregate virtual machine data. UI for filtering and comparing VMs by memory, storage, and pricing.',
            tags: ['AWS', 'GCP', 'Azure', 'Python', 'SDKs'],
            link: '#'
        },
        {
            title: 'Parking Spot Assigner (ML/CV)',
            description: 'Computer vision system using YOLOv7 and Tesseract OCR for automated license plate recognition and intelligent parking allocation.',
            tags: ['YOLOv7', 'OpenCV', 'OCR', 'Python', 'ML'],
            link: '#'
        }
    ];

    return (
        <section id="projects" className="section" style={{ backgroundColor: '#0f0f0f' }}>
            <div className="container">
                <style>{`
                    .projects-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: end;
                        margin-bottom: 3rem;
                    }
                    .projects-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                        gap: 2rem;
                    }
                    @media (max-width: 768px) {
                        .projects-header {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 1rem;
                            margin-bottom: 2rem;
                        }
                        .projects-grid {
                            grid-template-columns: 1fr;
                            gap: 1.5rem;
                        }
                    }
                    @media (max-width: 480px) {
                        .projects-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>

                <div className="projects-header">
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Featured Projects</h2>
                        <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', borderRadius: '2px' }} />
                    </div>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
                        View All <ArrowRight size={18} />
                    </a>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card" style={{
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s ease, border-color 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99, 102, 241, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{project.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                                {project.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: '0.8rem',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '1rem',
                                        color: 'var(--text-secondary)',
                                        fontFamily: 'var(--font-mono)'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a href={project.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.95rem', fontWeight: '500' }}>
                                View Details <ArrowRight size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
