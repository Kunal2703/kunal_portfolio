/**
 * Section backdrops built from real infrastructure artefacts — Kubernetes
 * manifests, a commit/pipeline graph, kubectl output, a service topology and
 * Grafana-style telemetry — rather than abstract grids.
 *
 * Every layer is decorative: aria-hidden, pointer-events: none, and kept at a
 * low enough opacity that it reads as texture behind the content.
 */

type Kind = 'manifest' | 'pipeline' | 'terminal' | 'topology' | 'telemetry'

const MANIFEST = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-service
  namespace: production
spec:
  replicas: 6
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: web
          image: ecr/web:1.29
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: "1"
              memory: 1Gi
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
spec:
  minReplicas: 4
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`

const TERMINAL = [
    ['$', 'kubectl get pods -n production'],
    ['', 'NAME                        READY   STATUS    RESTARTS   AGE'],
    ['', 'frontend-7d9f4b8c6-2xvql    1/1     Running   0          4d'],
    ['', 'frontend-7d9f4b8c6-9kmtz    1/1     Running   0          4d'],
    ['', 'backend-5c8b9d7f4-lp3nw     1/1     Running   0          2d'],
    ['$', 'terraform plan -out=tfplan'],
    ['', 'Plan: 34 to add, 2 to change, 0 to destroy.'],
    ['$', 'helm upgrade emdash ./chart --atomic'],
    ['', 'Release "emdash" has been upgraded. Revision: 12'],
    ['$', 'kubectl rollout status deploy/frontend'],
    ['', 'deployment "frontend" successfully rolled out'],
    ['$', 'aws eks describe-cluster --query cluster.status'],
    ['', 'ACTIVE'],
]

/* ── manifest: YAML watermark down one edge ─────────────────────────── */
function Manifest() {
    return (
        <pre
            className="tex-layer tex-wide"
            style={{
                position: 'absolute',
                top: '-2rem',
                right: '1.5rem',
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                lineHeight: 1.55,
                color: 'var(--accent-primary)',
                opacity: 0.11,
                whiteSpace: 'pre',
                // two masks intersected: fade top/bottom and fade into the right edge
                WebkitMaskImage:
                    'linear-gradient(to bottom, transparent, #000 22%, #000 70%, transparent), linear-gradient(to left, transparent, #000 42%)',
                WebkitMaskComposite: 'source-in',
                maskImage:
                    'linear-gradient(to bottom, transparent, #000 22%, #000 70%, transparent), linear-gradient(to left, transparent, #000 42%)',
                maskComposite: 'intersect',
            }}
        >
            {MANIFEST}
        </pre>
    )
}

/* ── pipeline: commit / deploy graph rail ───────────────────────────── */
function Pipeline() {
    const stages = [0, 1, 2, 3, 4, 5, 6, 7]
    return (
        <svg
            // needs the left gutter outside the 1200px container, which only
            // exists on wide viewports — below that it lands on the bullet text
            className="tex-layer tex-wide"
            style={{ position: 'absolute', top: 0, bottom: 0, left: '2%', height: '100%', opacity: 0.5 }}
            width="150"
            viewBox="0 0 150 900"
            preserveAspectRatio="none"
            fill="none"
        >
            <defs>
                <linearGradient id="bd-rail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                    <stop offset="18%" stopColor="#6366f1" stopOpacity="0.5" />
                    <stop offset="82%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* trunk */}
            <line x1="26" y1="0" x2="26" y2="900" stroke="url(#bd-rail)" strokeWidth="1.5" />

            {/* branch that forks out and merges back — a release branch */}
            <path
                d="M26,250 C26,300 96,300 96,350 L96,520 C96,570 26,570 26,620"
                stroke="url(#bd-rail)"
                strokeWidth="1.25"
                strokeDasharray="4 5"
            />

            {/* commit nodes on the trunk */}
            {stages.map((i) => {
                const y = 70 + i * 108
                return (
                    <g key={i}>
                        <circle cx="26" cy={y} r="5.5" fill="#0f0f0f" stroke="#6366f1" strokeOpacity="0.55" />
                        <circle cx="26" cy={y} r="2" fill="#6366f1" fillOpacity="0.7" />
                    </g>
                )
            })}

            {/* nodes on the branch */}
            {[350, 440, 520].map((y) => (
                <circle key={y} cx="96" cy={y} r="4" fill="#0f0f0f" stroke="#a855f7" strokeOpacity="0.5" />
            ))}
        </svg>
    )
}

/* ── terminal: faint kubectl / terraform session ────────────────────── */
function Terminal() {
    return (
        <div
            className="tex-layer tex-wide"
            style={{
                position: 'absolute',
                top: '4rem',
                right: '1.5rem',
                width: '40rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.85,
                opacity: 0.13,
                whiteSpace: 'pre',
                WebkitMaskImage:
                    'linear-gradient(to bottom, #000 55%, transparent), linear-gradient(to left, transparent, #000 45%)',
                WebkitMaskComposite: 'source-in',
                maskImage:
                    'linear-gradient(to bottom, #000 55%, transparent), linear-gradient(to left, transparent, #000 45%)',
                maskComposite: 'intersect',
            }}
        >
            {TERMINAL.map(([prompt, line], i) => (
                <div key={i}>
                    {prompt && <span style={{ color: '#22c55e' }}>{prompt} </span>}
                    <span style={{ color: prompt ? 'var(--text-primary)' : 'var(--accent-primary)' }}>
                        {line}
                    </span>
                </div>
            ))}
        </div>
    )
}

/* ── topology: service mesh node graph ──────────────────────────────── */
function Topology() {
    const nodes = [
        { x: 60, y: 120, r: 9 },
        { x: 190, y: 60, r: 7 },
        { x: 190, y: 190, r: 7 },
        { x: 320, y: 40, r: 6 },
        { x: 320, y: 130, r: 6 },
        { x: 320, y: 230, r: 6 },
        { x: 440, y: 90, r: 5 },
        { x: 440, y: 180, r: 5 },
    ]
    const edges: [number, number][] = [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4],
        [2, 4],
        [2, 5],
        [3, 6],
        [4, 6],
        [4, 7],
        [5, 7],
    ]
    return (
        <svg
            className="tex-layer"
            style={{
                position: 'absolute',
                right: '-2rem',
                bottom: '-1rem',
                width: '34rem',
                opacity: 0.16,
            }}
            viewBox="0 0 500 280"
            fill="none"
        >
            {edges.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#a855f7"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                />
            ))}
            {nodes.map((n, i) => (
                <g key={i}>
                    <circle cx={n.x} cy={n.y} r={n.r + 5} fill="#6366f1" fillOpacity="0.12" />
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.r}
                        fill="#0f0f0f"
                        stroke="#6366f1"
                        strokeWidth="1.25"
                        strokeOpacity="0.9"
                    />
                </g>
            ))}
        </svg>
    )
}

/* ── telemetry: Grafana-style latency graph + uptime bar ────────────── */
function Telemetry() {
    // deterministic pseudo-random series so the shape is stable across renders
    const pts = Array.from({ length: 64 }, (_, i) => {
        const v =
            Math.sin(i * 0.42) * 16 +
            Math.sin(i * 1.13) * 8 +
            Math.sin(i * 2.7) * 4 +
            (i === 41 ? -26 : 0) // one spike, because there is always one
        return `${(i / 63) * 900},${70 - v}`
    }).join(' ')

    const uptime = Array.from({ length: 60 }, (_, i) => (i === 41 || i === 42 ? 'warn' : 'ok'))

    return (
        <div
            className="tex-layer"
            style={{
                position: 'absolute',
                inset: 'auto 0 2rem 0',
                opacity: 0.22,
                WebkitMaskImage: 'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)',
                maskImage: 'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)',
            }}
        >
            <svg viewBox="0 0 900 120" width="100%" height="120" fill="none" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="bd-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* threshold line — the SLO */}
                <line
                    x1="0"
                    y1="34"
                    x2="900"
                    y2="34"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                    strokeOpacity="0.6"
                />
                <polygon points={`0,120 ${pts} 900,120`} fill="url(#bd-area)" />
                <polyline points={pts} stroke="#6366f1" strokeWidth="1.5" />
            </svg>

            {/* uptime strip */}
            <div style={{ display: 'flex', gap: '3px', marginTop: '0.85rem', padding: '0 1px' }}>
                {uptime.map((s, i) => (
                    <span
                        key={i}
                        style={{
                            flex: 1,
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: s === 'ok' ? '#22c55e' : '#f59e0b',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

const VARIANTS: Record<Kind, () => React.ReactElement> = {
    manifest: Manifest,
    pipeline: Pipeline,
    terminal: Terminal,
    topology: Topology,
    telemetry: Telemetry,
}

export default function Backdrop({ kind }: { kind: Kind }) {
    const Layer = VARIANTS[kind]
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <Layer />
        </div>
    )
}
