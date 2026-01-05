import { Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Get In Touch</h2>
                <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--accent-primary)', marginBottom: '3rem', borderRadius: '2px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                    <style>{`
            @media (max-width: 768px) {
              .container {
                  grid-template-columns: 1fr !important;
              }
              #contact .container > div {
                 grid-template-columns: 1fr !important;
              }
            }
          `}</style>

                    <div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Interested in working together? Have a question? Send me a message and I'll get back to you as soon as possible.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Mail size={24} color="var(--accent-primary)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Email</div>
                                    <a href="mailto:kunalsingh2703@gmail.com" style={{ color: 'var(--text-secondary)' }}>kunalsingh2703@gmail.com</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <MapPin size={24} color="var(--accent-secondary)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Location</div>
                                    <div style={{ color: 'var(--text-secondary)' }}>Gurugram, IN / Remote</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: 'var(--bg-card)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderLeft: '4px solid #22c55e'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
                                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Available for new opportunities</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                I'm currently looking for new roles in DevOps, SRE, or Platform Engineering. I typically respond within 24 hours.
                            </p>
                        </div>
                    </div>

                    <form style={{
                        backgroundColor: 'var(--bg-card)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }} onSubmit={(e) => e.preventDefault()}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="name" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Name</label>
                            <input type="text" id="name" placeholder="John Doe" style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                color: 'white',
                                fontFamily: 'inherit'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="email" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                            <input type="email" id="email" placeholder="john@example.com" style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                color: 'white',
                                fontFamily: 'inherit'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="message" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Message</label>
                            <textarea id="message" rows={5} placeholder="Tell me about your project or opportunity..." style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                color: 'white',
                                fontFamily: 'inherit',
                                resize: 'none'
                            }} />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                            Send Message <Send size={18} />
                        </button>

                    </form>

                </div>
            </div>
        </section>
    );
};

export default Contact;
