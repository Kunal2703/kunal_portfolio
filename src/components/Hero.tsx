import { ArrowRight, Download } from 'lucide-react';
import HeroTerminal from './HeroTerminal';
import { profile } from '../lib/data';

const Hero = () => {
  return (
    <section id="home" className="section tex tex-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
        zIndex: -1
      }} />

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '6rem', alignItems: 'start', maxWidth: '1400px', paddingTop: '4rem' }}>

        {/* Helper for responsive grid */}
        <style>{`
          .hero-profile-image {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 1.5rem;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @media (max-width: 968px) {
            #home .container { 
              grid-template-columns: 1fr !important; 
              text-align: center;
              gap: 2rem !important;
              padding-top: 0 !important;
            }
            .hero-content { 
              align-items: center !important; 
            }
            .hero-profile-image {
              width: 140px;
              height: 140px;
              margin-bottom: 1rem;
            }
            .hero-content h1 {
              font-size: 2.25rem !important;
              line-height: 1.2 !important;
            }
            .hero-content p {
              font-size: 1rem !important;
              max-width: 100% !important;
            }
            .hero-buttons { 
              justify-content: center;
              width: 100%;
            }
            .hero-buttons a {
              flex: 1;
              justify-content: center;
            }
          }
          @media (max-width: 480px) {
            .hero-profile-image {
              width: 120px;
              height: 120px;
            }
            .hero-content h1 {
              font-size: 1.85rem !important;
            }
            .hero-buttons {
              flex-direction: column;
            }
            .hero-buttons a {
              width: 100%;
            }
          } }
        `}</style>

        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
          {/* Profile Image */}
          <div className="hero-profile-image"
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Multi-layered Glow */}
            <div style={{
              position: 'absolute',
              inset: '-8px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)',
              borderRadius: '50%',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              inset: '-2px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: '50%',
              opacity: 0.8,
              zIndex: 1
            }} />
            <img
              src={`${import.meta.env.BASE_URL}profile.jpg`}
              alt="Kunal Singh"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                border: '4px solid #0a0a0a',
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6)',
                zIndex: 2
              }}
            />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '2rem',
            color: 'var(--accent-primary)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--accent-primary)' }}></span>
            </span>
            Open to Work
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1.1' }}>
            Building Reliable
            <br />
            <span className="gradient-text">Infrastructure</span>
            <br />
            & Automating Scale
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: '1.6' }}>
            DevOps Engineer & SRE with <strong>2.5+ years of experience</strong> across <strong>AWS &amp; GCP</strong>. Specializing in Terraform IaC, multi-tenant Kubernetes, observability, and FinOps. I architect systems for zero downtime and maximum efficiency.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary">
              View Work <ArrowRight size={18} />
            </a>
            <a href={profile.resumeUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              Download CV <Download size={18} />
            </a>
          </div>
        </div>

        <HeroTerminal />
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
