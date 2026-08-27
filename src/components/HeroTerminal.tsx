import { useState, useEffect } from 'react';

/**
 * Modern terminal panel for the hero.
 *
 * A short static scrollback of completed commands sits above a live prompt that
 * types a rotating message — so the window reads as a real session instead of a
 * mostly-empty box.
 */

const C = {
    bg: '#0b0b10',
    chrome: '#15151c',
    line: 'rgba(255,255,255,0.075)',
    text: '#d7dae0',
    dim: '#7b8190',
    faint: '#5a606e',
    green: '#3ddc84',
    cyan: '#4fd1c5',
    blue: '#6ea8fe',
    violet: '#b48cff',
    amber: '#f0b849',
    red: '#ff6b6b',
};

const MESSAGES = [
    "Hi, I'm Kunal — DevOps & SRE Engineer with 2.5+ years across AWS and GCP.",
    'Terraform IaC, multi-tenant Kubernetes, observability and FinOps.',
    'Open to collaborating on scalable, reliable infrastructure. Say hello ↗',
];

/** Reserves the tallest possible line so the frame never resizes mid-cycle. */
const LONGEST = MESSAGES.reduce((a, b) => (b.length > a.length ? b : a));

/**
 * A command "block" in the Warp sense: context line, the command, then its
 * output — grouped by a left rail. The rail is a CSS border rather than box
 * glyphs, which do not join up across a 1.75 line-height.
 */
function Block({
    command,
    live,
    children,
}: {
    command: React.ReactNode;
    live?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <div className={`term-block${live ? ' term-block-live' : ''}`}>
            <div style={{ display: 'flex', gap: '0.75ch', flexWrap: 'wrap' }}>
                <span style={{ color: C.green, fontWeight: 600 }}>kunal@prod</span>
                <span style={{ color: C.blue }}>~/infra</span>
                <span style={{ color: C.violet }}>git:(main)</span>
                <span style={{ color: C.green }}>✔</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75ch' }}>
                <span style={{ color: C.cyan, fontWeight: 600 }}>❯</span>
                <span style={{ flex: 1, minWidth: 0 }}>{command}</span>
            </div>
            {children}
        </div>
    );
}

const Out = ({ children, color = C.dim }: { children: React.ReactNode; color?: string }) => (
    <div style={{ color, paddingLeft: '2ch' }}>{children}</div>
);

export default function HeroTerminal() {
    const [msg, setMsg] = useState(0);
    const [typed, setTyped] = useState('');

    useEffect(() => {
        const full = MESSAGES[msg];
        if (typed.length < full.length) {
            const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 28);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => {
            setTyped('');
            setMsg((n) => (n + 1) % MESSAGES.length);
        }, 2800);
        return () => clearTimeout(t);
    }, [typed, msg]);

    return (
        <div className="terminal-window">
            {/* ── chrome: traffic lights + tab + path ── */}
            <div className="term-chrome">
                <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
                    <span className="term-dot" style={{ backgroundColor: '#ff5f57' }} />
                    <span className="term-dot" style={{ backgroundColor: '#febc2e' }} />
                    <span className="term-dot" style={{ backgroundColor: '#28c840' }} />
                </div>

                <div className="term-tab">
                    <span style={{ color: C.green }}>●</span> zsh
                </div>

                <span className="term-path">kunal@prod: ~/infra</span>
            </div>

            {/* ── session ── */}
            <div className="term-body">
                <Block
                    command={
                        <>
                            <span style={{ color: C.text }}>terraform </span>
                            <span style={{ color: C.amber }}>apply</span>
                            <span style={{ color: C.faint }}> -auto-approve</span>
                        </>
                    }
                >
                    <Out>
                        <span style={{ color: C.green }}>✔</span> Apply complete — 34 added, 2 changed,{' '}
                        <span style={{ color: C.text }}>0 destroyed</span>
                    </Out>
                </Block>

                <Block
                    command={
                        <>
                            <span style={{ color: C.text }}>kubectl </span>
                            <span style={{ color: C.amber }}>get nodes</span>
                        </>
                    }
                >
                    <Out color={C.faint}>NAME{'\u00a0'.repeat(10)}STATUS{'\u00a0'.repeat(3)}VERSION</Out>
                    <Out>
                        ip-10-0-1-42{'\u00a0\u00a0'}
                        <span style={{ color: C.green }}>Ready</span>
                        {'\u00a0\u00a0\u00a0\u00a0'}v1.33-eks
                    </Out>
                    <Out>
                        ip-10-0-2-17{'\u00a0\u00a0'}
                        <span style={{ color: C.green }}>Ready</span>
                        {'\u00a0\u00a0\u00a0\u00a0'}v1.33-eks
                    </Out>
                </Block>

                <Block
                    command={
                        <>
                            <span style={{ color: C.text }}>helm </span>
                            <span style={{ color: C.amber }}>upgrade</span>
                            <span style={{ color: C.text }}> emdash ./chart</span>
                            <span style={{ color: C.faint }}> --atomic</span>
                        </>
                    }
                >
                    <Out>
                        <span style={{ color: C.green }}>✔</span> Release{' '}
                        <span style={{ color: C.text }}>emdash</span> upgraded — revision 12
                    </Out>
                </Block>

                <Block
                    command={
                        <>
                            <span style={{ color: C.text }}>aws </span>
                            <span style={{ color: C.amber }}>eks describe-cluster</span>
                            <span style={{ color: C.faint }}> --query cluster.status</span>
                        </>
                    }
                >
                    <Out color={C.green}>ACTIVE</Out>
                </Block>

                <Block
                    live
                    command={
                        /* The typed line is the only thing in the terminal whose
                           height changes over time, and on a narrow viewport the
                           longest message wraps while the shortest does not - so
                           the whole frame grew and shrank on every cycle. An
                           invisible copy of the longest message holds the box
                           open and the live text is laid over it, which keeps
                           the height fixed at any width without hardcoding one. */
                        <span className="term-typing">
                            <span className="term-typing-sizer" aria-hidden="true">{LONGEST}</span>
                            <span className="term-typing-text">
                                <span style={{ color: C.text }}>{typed}</span>
                                <span className="term-caret" />
                            </span>
                        </span>
                    }
                />
            </div>

            {/* ── status bar ── */}
            <div className="term-status">
                <span className="term-seg">
                    <span className="term-led" style={{ backgroundColor: C.violet }} />
                    main
                </span>
                <span className="term-seg">
                    <span className="term-led" style={{ backgroundColor: C.green }} />
                    healthy
                </span>
                <span style={{ flex: 1 }} />
                <span className="term-seg">
                    AWS <b style={{ color: C.green }}>connected</b>
                </span>
                <span className="term-seg">
                    K8s <b style={{ color: C.cyan }}>v1.33</b>
                </span>
                <span className="term-seg">
                    TF <b style={{ color: C.violet }}>v1.9</b>
                </span>
            </div>

            <style>{`
                .terminal-window {
                    background-color: ${C.bg};
                    border: 1px solid ${C.line};
                    border-radius: 14px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 750px;
                    font-family: var(--font-mono);
                    /* the hero container sets text-align:center under 968px;
                       terminal output must stay left-aligned */
                    text-align: left;
                    box-shadow:
                        0 1px 0 rgba(255,255,255,0.06) inset,
                        0 30px 70px -20px rgba(0,0,0,0.75),
                        0 0 60px -25px rgba(99,102,241,0.35);
                }
                .term-chrome {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.6rem 0.85rem;
                    background: linear-gradient(180deg, ${C.chrome}, #101015);
                    border-bottom: 1px solid ${C.line};
                }
                .term-dot {
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    display: block;
                }
                .term-tab {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    padding: 0.2rem 0.7rem;
                    border-radius: 7px;
                    background-color: rgba(255,255,255,0.055);
                    border: 1px solid ${C.line};
                    font-size: 0.72rem;
                    color: ${C.text};
                }
                .term-path {
                    margin-left: auto;
                    font-size: 0.72rem;
                    color: ${C.faint};
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .term-body {
                    padding: 1.1rem 1.15rem;
                    display: flex;
                    flex-direction: column;
                    font-size: 0.83rem;
                    line-height: 1.75;
                    color: ${C.text};
                }
                .term-block {
                    border-left: 2px solid rgba(255,255,255,0.09);
                    padding-left: 0.85rem;
                    margin-bottom: 0.85rem;
                    transition: border-color 0.3s ease;
                }
                .term-block:last-child { margin-bottom: 0; }
                .term-block-live {
                    border-left-color: ${C.cyan};
                }
                .term-typing {
                    position: relative;
                    display: block;
                    flex: 1;
                    min-width: 0;
                }
                .term-typing-sizer { visibility: hidden; }
                .term-typing-text {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                .term-caret {
                    display: inline-block;
                    width: 8px;
                    height: 1em;
                    margin-left: 2px;
                    vertical-align: text-bottom;
                    background-color: ${C.cyan};
                    animation: term-blink 1.05s step-end infinite;
                }
                @keyframes term-blink { 50% { opacity: 0; } }
                .term-status {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.45rem 0.7rem;
                    background: linear-gradient(180deg, #101015, ${C.chrome});
                    border-top: 1px solid ${C.line};
                    font-size: 0.68rem;
                    color: ${C.dim};
                    flex-wrap: wrap;
                }
                .term-seg {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.15rem 0.5rem;
                    border-radius: 5px;
                    background-color: rgba(255,255,255,0.04);
                }
                .term-seg b { font-weight: 600; }
                .term-led {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: block;
                }
                @media (max-width: 968px) {
                    .terminal-window { max-width: none; }
                    .term-body { font-size: 0.76rem; padding: 0.9rem; }
                }
                @media (max-width: 480px) {
                    .term-body { font-size: 0.68rem; }
                    .term-status { font-size: 0.6rem; }
                    .term-path { display: none; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .term-caret { animation: none; }
                }
            `}</style>
        </div>
    );
}
