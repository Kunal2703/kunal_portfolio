import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <footer style={{
                padding: '2rem 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}>
                <div className="container">
                    <p>© {new Date().getFullYear()} Alex Devops. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Built with React, TypeScript & Vanilla CSS</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
