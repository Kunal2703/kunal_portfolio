const HighlightText = ({ text }: { text: string }) => {
    const keywords = [
        // New Phrases from user
        'zero disruptions',
        'staging, beta',
        'production',
        'upgraded Amazon EKS',
        '1.24 to 1.28',
        '1.28 to 1.30',
        'zero downtime',
        'optimization',
        // Technologies
        'Amazon EKS', 'AWS', 'EKS', 'Akamai CDN', 'CloudFront', 'Devtron', 'Grafana', 'Jenkins', 'EC2', 'RDS', 'CloudWatch', 'Route53', 'VPC', 'ALB',
        // Key Terms
        'CI/CD', 'FinOps', 'cost reduction', 'RBAC', 'migration', 'Machine Learning', 'automation', 'scalability', 'fault tolerance', 'smart irrigation',
        // Metrics & Stats
        '25%', '65%', '30%', '40%', '70 percent', '18 million'
    ];

    // Sort keywords by length descending to match longer phrases first
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

    // Create a regex from keywords
    const regex = new RegExp(`(${sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            <style>{`
                @keyframes highlight-pulse {
                    0% { color: #60a5fa; text-shadow: 0 0 2px #60a5fa; opacity: 0.8; }
                    50% { color: #3b82f6; text-shadow: 0 0 10px #60a5fa; opacity: 1; }
                    100% { color: #60a5fa; text-shadow: 0 0 2px #60a5fa; opacity: 0.8; }
                }
                .dynamic-highlight {
                    animation: highlight-pulse 3s infinite ease-in-out;
                    font-weight: 600;
                    display: inline-block;
                }
            `}</style>
            {parts.map((part, i) =>
                keywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
                    <span key={i} className="dynamic-highlight">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
};

export default HighlightText;
