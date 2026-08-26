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
                borderTop: '1px solid var(--hairline-soft)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}>
                <div className="container">
                    <p>© 2026 Kunal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
