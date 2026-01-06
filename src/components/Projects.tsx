import { ArrowRight } from 'lucide-react';

const Projects = () => {
    const projects = [
        {
            title: 'QuillPost: Microservice Blog App',
            description: 'QuillPost is a microservices-based blog posting application composed of independent services for authentication, comments, posts, and frontend. It uses Django for authentication and comments, Spring Boot for post management, and React.js for the user interface, and can be deployed using Docker Compose or Kubernetes with provided configuration files.',
            tags: ['Kubernetes', 'Docker', 'Django', 'Spring Boot', 'React'],
            link: 'https://github.com/Kunal2703/QuillPost.git'
        },
        {
            title: 'Cloud Provider Advisor',
            description: 'Cloud-Provider-Advisor is an application that helps users choose the most cost-effective cloud service provider by comparing compute offerings from AWS, Microsoft Azure, and Google Cloud Platform. It collects user requirements such as vCPUs, memory, storage, OS, and region, retrieves VM data via provider APIs, and presents suitable options through a user-friendly interface, making cloud selection simpler and more economical for small and medium enterprises.',
            tags: ['AWS', 'GCP', 'Azure', 'Python', 'React', 'SDKs'],
            link: 'https://github.com/Kunal2703/Cloud-Provider-Advisor.git'
        },
        {
            title: 'Parking Spot Assigner (ML/CV)',
            description: 'The Parking Spot Assigner with License Plate Detector automates vehicle identification and parking slot allocation using machine learning and OCR. It scans license plates, identifies employees, and assigns the nearest available parking slot, reducing waiting time, manual effort, and congestion at the campus entry gate.',
            tags: ['YOLOv7', 'OpenCV', 'OCR', 'Python', 'ML'],
            link: 'https://github.com/Kunal2703/Parking-Spot-Assigner-with-License-Plate-Detector.git'
        },
        {
            title: 'Build-our-own-Compiler (Custom Compiler)',
            description: 'A compiler translates source code from one language to another without changing its meaning while generating efficient target code. The compilation process works in multiple stages, where each stage analyzes the code, performs lexical, syntax, and grammar checks, and produces intermediate (assembly-like) code before final output.',
            tags: ['Python', 'C++'],
            link: 'https://github.com/Kunal2703/Build-our-own-Compiler.git'
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
                        grid-template-columns: repeat(2, 1fr);
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
