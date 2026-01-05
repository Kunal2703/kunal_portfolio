import { useState, useEffect } from 'react';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
  const [terminalStep, setTerminalStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  // Sequence Constants
  const bioText = "Hi, I'm Kunal from Bihar 🚀 | B.Tech in Computer Science from UPES | DevOps Engineer @Careers360 | Architecting cloud-native solutions with AWS, Kubernetes & Terraform | Passionate about FinOps, automation, and zero-downtime deployments";
  const finalText = "Open to collaborating on scalable solutions, DevOps automation, and impactful engineering problems.";

  useEffect(() => {
    let timeout: number;

    // Step 0: Initial delay before showing output for kubectl command
    if (terminalStep === 0) {
      timeout = setTimeout(() => {
        setTerminalStep(1);
        setShowOutput(true);
      }, 1500);
    }
    // Step 1: Wait after showing output, then clear (Step 2)
    else if (terminalStep === 1) {
      timeout = setTimeout(() => {
        setTerminalStep(2); // Clear screen
      }, 3500);
    }
    // Step 2: Clear screen state -> Move to Step 3 (Start typing bio)
    else if (terminalStep === 2) {
      setDisplayedText('');
      setTerminalStep(3);
    }
    // Step 3: Type Bio
    else if (terminalStep === 3) {
      if (displayedText.length < bioText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(bioText.slice(0, displayedText.length + 1));
        }, 50); // Typing speed
      } else {
        timeout = setTimeout(() => setTerminalStep(4), 3000); // Wait after typing bio
      }
    }
    // Step 4: Clear for final message
    else if (terminalStep === 4) {
      setDisplayedText('');
      setTerminalStep(5);
    }
    // Step 5: Type Final Message
    else if (terminalStep === 5) {
      if (displayedText.length < finalText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(finalText.slice(0, displayedText.length + 1));
        }, 50);
      } else {
        // Reset to start after delay
        timeout = setTimeout(() => {
          setTerminalStep(0);
          setDisplayedText('');
          setShowOutput(false);
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [terminalStep, displayedText, bioText, finalText]);

  return (
    <section id="home" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
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
            margin-bottom: 1rem;
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
              margin-bottom: 0.5rem;
            }
            .hero-content h1 {
              font-size: 2rem !important;
              line-height: 1.2 !important;
            }
            .hero-content p {
              font-size: 0.95rem !important;
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
            .terminal-window { 
              margin-top: 2rem;
              font-size: 0.8rem !important;
            }
            .terminal-window > div:last-child {
              padding: 1rem !important;
              min-height: 200px !important;
            }
          }
          @media (max-width: 480px) {
            .hero-profile-image {
              width: 120px;
              height: 120px;
            }
            .hero-content h1 {
              font-size: 1.75rem !important;
            }
            .hero-buttons {
              flex-direction: column;
            }
            .hero-buttons a {
              width: 100%;
            }
          }
          .typing-cursor::after {
            content: '▋';
            animation: blink 1s step-start infinite;
            color: var(--accent-primary);
            margin-left: 2px;
          }
          @keyframes blink { 50% { opacity: 0; } }
        `}</style>

        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
          {/* Profile Image */}
          <div className="hero-profile-image" style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              position: 'absolute',
              inset: '-4px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: '50%',
              opacity: 0.6,
              filter: 'blur(8px)'
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
                objectPosition: 'center 20%',
                border: '4px solid var(--bg-primary)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
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
            DevOps Engineer & SRE | Specializing in FinOps, Kubernetes Orchestration, and Automated Chaos. I architect systems for zero downtime and maximum efficiency.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary">
              View Work <ArrowRight size={18} />
            </a>
            <a href="/resume.pdf" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              Download CV <Download size={18} />
            </a>
          </div>
        </div>

        {/* Terminal Animation */}
        <div className="terminal-window" style={{
          backgroundColor: '#1e1e1e',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem',
          maxWidth: '750px',
          width: '100%',
          alignSelf: 'start',
          marginTop: '16rem',
          display: 'flex',
          flexDirection: 'column',
          height: '460px'
        }}>
          {/* Terminal Header */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div style={{ marginLeft: '1rem', color: '#888', fontSize: '0.8rem' }}>user@kunal:~/projects</div>
          </div>

          {/* Terminal Content */}
          <div style={{ padding: '1.5rem', color: '#d4d4d4', fontSize: '1.05rem', lineHeight: '1.6', flex: 1, overflowY: 'hidden' }}>

            {(terminalStep <= 1) && (
              <>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> kubectl apply -f kunal.yaml
                </div>
                {showOutput && (
                  <div style={{ color: '#a0a0a0', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <div style={{ color: '#888' }}>⚡ Applying configuration...</div>
                    <div style={{ marginTop: '0.5rem' }}>deployment.apps/<span style={{ color: '#27c93f', fontWeight: '600' }}>kunal-profile</span> <span style={{ color: '#27c93f' }}>created</span></div>
                    <div>service/<span style={{ color: '#27c93f', fontWeight: '600' }}>portfolio-svc</span> <span style={{ color: '#27c93f' }}>created</span></div>
                    <div>ingress.networking.k8s.io/<span style={{ color: '#27c93f', fontWeight: '600' }}>gateway</span> <span style={{ color: '#27c93f' }}>created</span></div>
                    <div style={{ marginTop: '0.75rem', color: '#6366f1' }}>✓ Infrastructure deployed successfully</div>
                  </div>
                )}
                {showOutput && terminalStep === 1 && (
                  <div>
                    <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> <span className="typing-cursor"></span>
                  </div>
                )}
              </>
            )}

            {(terminalStep >= 3 && terminalStep <= 4) && (
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#27c93f' }}>➜</span> <span style={{ color: '#6366f1' }}>~</span> {displayedText}<span className="typing-cursor"></span>
                </div>
              </div>
            )}

            {(terminalStep === 5) && (
              <div>
                <div style={{ marginBottom: '0.5rem', fontSize: '1.25rem', lineHeight: '1.6', color: '#fff' }}>
                  <span style={{ color: '#27c93f', fontSize: '1.05rem' }}>➜</span> <span style={{ color: '#6366f1', fontSize: '1.05rem' }}>~</span> {displayedText}<span className="typing-cursor"></span>
                </div>
              </div>
            )}


          </div>

          {/* Status Bar */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '0.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#888',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span><span style={{ color: '#6366f1' }}>branch:</span> main</span>
              <span><span style={{ color: '#27c93f' }}>status:</span> healthy</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>AWS: <span style={{ color: '#27c93f' }}>connected</span></span>
              <span>K8s: <span style={{ color: '#27c93f' }}>v1.32</span></span>
              <span>TF: <span style={{ color: '#27c93f' }}>v1.6</span></span>
            </div>
          </div>
        </div>
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
