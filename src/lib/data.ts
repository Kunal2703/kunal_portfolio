/**
 * Single source of truth for every piece of content on the site.
 * Kept in one file so the resume and the portfolio can be reconciled in one place.
 */

export const profile = {
  name: 'Kunal',
  role: 'DevOps & SRE Engineer',
  tagline: 'I build infrastructure that survives the traffic spike.',
  blurb:
    'DevOps & SRE Engineer with 2.5+ years across AWS and GCP. I turn greenfield requirements into Terraform, multi-tenant Kubernetes and observability that other engineers can operate without me.',
  location: 'Goa, IN',
  email: 'kunalsingh2703@gmail.com',
  experienceYears: '2.5+',
  resumeUrl:
    'https://drive.google.com/file/d/1XF_8iUQdNo0rvsFDqktNYxyoDC28bVNH/view?usp=sharing',
  github: 'https://github.com/Kunal2703',
  githubUser: 'Kunal2703',
  linkedin: 'https://www.linkedin.com/in/kunal27/',
  blog: 'https://kunaltheengineer.hashnode.dev/',
  hashnodeHost: 'kunaltheengineer.hashnode.dev',
} as const

/** Hero metric tiles — the four numbers worth leading with. */
export const metrics = [
  {
    key: 'cost',
    label: 'Cloud cost reduced',
    value: 65,
    suffix: '%',
    caption: 'secondary AWS account',
    tone: 'ok',
    trend: [88, 84, 79, 73, 70, 62, 55, 48, 42, 38, 35, 35],
  },
  {
    key: 'peak',
    label: 'Peak load served',
    value: 5,
    suffix: 'L+',
    caption: 'requests / 30 min',
    tone: 'info',
    trend: [10, 14, 22, 30, 55, 88, 96, 74, 52, 33, 22, 16],
  },
  {
    key: 'downtime',
    label: 'Downtime on upgrades',
    value: 0,
    suffix: '',
    caption: 'EKS 1.24 → 1.31',
    tone: 'ok',
    trend: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    key: 'services',
    label: 'AWS services as IaC',
    value: 8,
    suffix: '+',
    caption: 'EmDash, from scratch',
    tone: 'accent',
    trend: [0, 1, 1, 2, 3, 3, 5, 6, 6, 7, 8, 8],
  },
] as const

/** Rotating status lines under the hero heading. */
export const statusLines = [
  'terraform apply — 34 added, 0 destroyed',
  'helm upgrade emdash — release healthy',
  'kubectl rollout status — 12/12 ready',
  'gcp finops report — posted to #eng-costs',
  'pagerduty — L1 escalation policy armed',
] as const

export type Experience = {
  company: string
  short: string
  role: string
  period: string
  start: string
  location: string
  current?: boolean
  summary: string
  stack: string[]
  points: string[]
}

export const experience: Experience[] = [
  {
    company: 'Urumi (UrumiAI)',
    short: 'Urumi',
    role: 'DevOps Engineer',
    period: 'Jun 2026 — Present',
    start: '2026',
    location: 'Goa, IN',
    current: true,
    summary:
      'Owning the platform for an AI-native e-commerce product from first commit — AWS provisioning, multi-tenant Kubernetes, and the observability the team runs on.',
    stack: ['AWS', 'GCP', 'Terraform', 'Helm', 'EKS', 'GKE', 'PagerDuty'],
    points: [
      'Architected and delivered a new AI-native e-commerce platform (EmDash) end-to-end on AWS from scratch — from POC to production — provisioning 8+ AWS services (EKS, ECR, RDS, S3, IAM/IRSA, ALB, VPC, ACM) as Terraform IaC with a multi-tenant Helm provisioner that spins up isolated per-tenant stores, and engineered a dual-cloud (AWS to GCP) integration linking AWS workloads to existing GCP services (dashboard, GitHub CI, MCP gateway).',
      'Built a production observability stack (Grafana, Google Managed Prometheus, Cloud Monitoring) across 2 GKE regions, delivering 12+ dashboards for Cloud SQL, PHP-FPM, HPA, and endpoint uptime.',
      'Implemented alerting-as-code (GCP alert policies, HPA to Slack alerter, crash/restart-storm alerts) with 4-tier (L1-L4) PagerDuty on-call escalation.',
      'Drove resource and cost optimization through zero-downtime deployments and migrations via Helm on GKE, a blue-green node-pool migration (4 to 8 vCPU) right-sizing the largest tenant and a dedicated to shared Cloud SQL migration that eliminated 1 redundant instance, reducing DB spend.',
      'Resolved multi-tenant Cloud SQL saturation and crash-loops by tuning wp-cron (2s to 60s), Action Scheduler concurrency, HPA, and Redis (up to 4.5GB cache), restoring stability at peak load.',
      'Built an internal self-service tool that automates infrastructure operations, letting the team run pre-approved Terraform and Helm workflows from a browser with live-streamed output, role-based permissions, and full audit logging — removing the need for direct cluster access — and automated a daily GCP FinOps cost report to Slack.',
    ],
  },
  {
    company: 'Careers360',
    short: 'Careers360',
    role: 'DevOps Engineer',
    period: 'Sep 2024 — May 2026',
    start: '2024',
    location: 'Gurugram, IN',
    summary:
      'Ran release engineering and cluster operations for a high-traffic education platform, through the largest traffic event in the company’s history.',
    stack: ['AWS', 'EKS', 'Devtron', 'Akamai', 'Kafka', 'ELK'],
    points: [
      'Successfully managed and scaled infrastructure during high-traffic events, handling peak loads of over 5 lakh+ requests within 30 minutes and 1.5 lakh+ requests within 5 minutes during the UP Board Results event, the highest traffic surge in the organization’s history ensuring real-time monitoring, high availability, and zero downtime.',
      'Managed end-to-end release and deployment processes across staging, beta, and production environments, ensuring smooth application rollouts with zero disruptions.',
      'Achieved significant FinOps cost reductions across multiple AWS accounts — 25% cost reduction in primary production account and 65% cost reduction in secondary staging account through strategic resource management and optimization.',
      'Architected and implemented Devtron CI/CD platform from scratch for build and deployment across staging, beta, and production environments, while managing entire EKS cluster operations through Devtron interface.',
      'Successfully upgraded Amazon EKS clusters from version 1.24 to 1.28, then 1.28 to 1.30 and finally to 1.31 across staging, beta, and production environments with zero downtime.',
      'Migrated 30% of legacy applications from traditional servers to Amazon EKS, improving scalability, fault tolerance, and resource optimization.',
      'Led migration from AWS CloudFront to Akamai CDN, enhancing performance and reducing latency by 30% for global content delivery.',
      'Consolidated 2 existing load balancers into a single ALB, streamlining traffic management and reducing infrastructure complexity by 40%.',
      'Replaced the use of env-based access and secret keys with an RBAC role-based approach, improving security and compliance across all environments (staging, beta, and production).',
      'Managed and monitored Kafka consumers and event-driven workflows, ensuring reliable message processing across services.',
      'Implemented centralized monitoring and logging using the ELK stack to observe and troubleshoot frontend and backend applications, improving system reliability and incident response.',
    ],
  },
  {
    company: 'Careers360',
    short: 'C360 intern',
    role: 'DevOps Engineer — Internship',
    period: 'Mar 2024 — Aug 2024',
    start: '2024',
    location: 'Gurugram, IN',
    summary:
      'First exposure to production cloud operations — AWS estate management and the beginnings of the observability migration.',
    stack: ['EC2', 'RDS', 'CloudWatch', 'Jenkins', 'Grafana'],
    points: [
      'Utilized a comprehensive suite of AWS services (EC2, RDS, CloudWatch, Route53, CloudFront, VPC, etc.) to manage and optimize cloud infrastructure.',
      'Employed Devtron for streamlined build and deployment processes and automated tasks and workflows using Jenkins cron jobs, enhancing operational efficiency.',
      'Migrated CloudWatch metrics and logs to Grafana, reducing monthly cost by 70 percent.',
    ],
  },
  {
    company: 'Visvesvaraya National Institute of Technology',
    short: 'VNIT',
    role: 'Summer Intern',
    period: 'Jun 2023 — Jul 2023',
    start: '2023',
    location: 'Nagpur, IN',
    summary:
      'Research internship applying machine learning to agricultural sensor data at scale.',
    stack: ['Python', 'Machine Learning', 'IoT'],
    points: [
      'Implemented smart irrigation system optimizing plant watering decisions using sensor data and Machine Learning algorithms, enhancing overall system performance through data-driven automation.',
      'Improved water usage efficiency and automated agricultural practices while managing and analyzing 18 million data points for fine-tune irrigation strategies.',
    ],
  },
]

/** The EmDash build, told as a case study rather than a bullet list. */
export const caseStudy = {
  id: 'emdash',
  eyebrow: 'Featured build · Urumi',
  title: 'EmDash — an AI-native commerce platform, POC to production',
  problem:
    'A brand-new product with no infrastructure at all: no accounts, no pipelines, no way to stand up a customer. Every new tenant had to become a fully isolated store, and an existing GCP estate (dashboard, GitHub CI, MCP gateway) had to keep working alongside whatever got built.',
  approach: [
    {
      title: 'Everything as Terraform',
      body: '8+ AWS services — EKS, ECR, RDS, S3, IAM/IRSA, ALB, VPC, ACM — defined as code from the first commit, so the estate is reviewable and reproducible rather than click-assembled.',
    },
    {
      title: 'Multi-tenant Helm provisioner',
      body: 'A single workflow spins up an isolated per-tenant store: its own release, its own boundaries, no hand-editing manifests per customer.',
    },
    {
      title: 'Dual-cloud, not cloud migration',
      body: 'AWS workloads wired to the pre-existing GCP services instead of forcing a rewrite — the dashboard, GitHub CI and MCP gateway kept running throughout.',
    },
    {
      title: 'Observability before incidents',
      body: 'Grafana + Google Managed Prometheus across 2 GKE regions, 12+ dashboards, and alerting-as-code escalating through 4 PagerDuty tiers.',
    },
    {
      title: 'Self-service, not ticket queues',
      body: 'An internal browser tool runs pre-approved Terraform and Helm workflows with live-streamed output, RBAC and full audit logging — nobody needs direct cluster access.',
    },
  ],
  outcomes: [
    { value: '8+', label: 'AWS services as IaC' },
    { value: '12+', label: 'Grafana dashboards' },
    { value: '2', label: 'GKE regions covered' },
    { value: 'L1–L4', label: 'PagerDuty escalation' },
  ],
  /** Architecture graph rendered as an animated SVG. */
  architecture: {
    nodes: [
      { id: 'tf', label: 'Terraform', sub: 'IaC', col: 0, row: 1, tone: 'purple' },
      { id: 'vpc', label: 'VPC', sub: 'network', col: 1, row: 0, tone: 'info' },
      { id: 'eks', label: 'EKS', sub: 'workloads', col: 2, row: 0, tone: 'accent' },
      { id: 'alb', label: 'ALB', sub: 'ingress', col: 1, row: 2, tone: 'info' },
      { id: 'rds', label: 'RDS', sub: 'data', col: 3, row: 1, tone: 'warn' },
      { id: 'helm', label: 'Helm', sub: 'per-tenant', col: 3, row: 0, tone: 'ok' },
      { id: 'gcp', label: 'GCP', sub: 'dashboard · CI', col: 3, row: 2, tone: 'cyan' },
    ],
    edges: [
      ['tf', 'vpc'],
      ['tf', 'alb'],
      ['vpc', 'eks'],
      ['alb', 'eks'],
      ['eks', 'helm'],
      ['eks', 'rds'],
      ['eks', 'gcp'],
    ],
  },
} as const

export type SkillGroup = {
  title: string
  hint: string
  /** `icon` keys map to the brand-icon table in components/Stack.tsx */
  items: { name: string; icon: string }[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Cloud platforms',
    hint: 'aws · gcp',
    items: [
      { name: 'AWS', icon: 'aws' },
      { name: 'Google Cloud', icon: 'gcp' },
    ],
  },
  {
    title: 'Containers & orchestration',
    hint: 'k8s',
    items: [
      { name: 'Kubernetes', icon: 'k8s' },
      { name: 'Amazon EKS', icon: 'eks' },
      { name: 'GKE', icon: 'gcp' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Helm', icon: 'helm' },
      { name: 'Istio', icon: 'istio' },
    ],
  },
  {
    title: 'IaC & automation',
    hint: 'terraform',
    items: [
      { name: 'Terraform', icon: 'terraform' },
      { name: 'Ansible', icon: 'ansible' },
      { name: 'Bash', icon: 'bash' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    title: 'CI/CD & GitOps',
    hint: 'delivery',
    items: [
      { name: 'Devtron', icon: 'devtron' },
      { name: 'Argo CD', icon: 'argo' },
      { name: 'Jenkins', icon: 'jenkins' },
      { name: 'GitHub Actions', icon: 'ghactions' },
      { name: 'GitLab', icon: 'gitlab' },
    ],
  },
  {
    title: 'Observability',
    hint: 'o11y',
    items: [
      { name: 'Grafana', icon: 'grafana' },
      { name: 'Prometheus', icon: 'prometheus' },
      { name: 'CloudWatch', icon: 'cloudwatch' },
      { name: 'Alertmanager', icon: 'alertmanager' },
      { name: 'Elastic', icon: 'elastic' },
      { name: 'Kibana', icon: 'kibana' },
      { name: 'OpenTelemetry', icon: 'otel' },
    ],
  },
  {
    title: 'Incident response',
    hint: 'on-call',
    items: [
      { name: 'PagerDuty', icon: 'pagerduty' },
      { name: 'Slack alerting', icon: 'slack' },
      { name: 'Runbooks', icon: 'runbook' },
      { name: 'Postmortems', icon: 'postmortem' },
    ],
  },
  {
    title: 'Data stores',
    hint: 'stateful',
    items: [
      { name: 'Amazon RDS', icon: 'rds' },
      { name: 'Cloud SQL', icon: 'gcp' },
      { name: 'DocumentDB', icon: 'documentdb' },
      { name: 'OpenSearch', icon: 'opensearch' },
      { name: 'PostgreSQL', icon: 'postgres' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Redis', icon: 'redis' },
      { name: 'Kafka', icon: 'kafka' },
    ],
  },
  {
    title: 'Edge & networking',
    hint: 'traffic',
    items: [
      { name: 'Akamai', icon: 'akamai' },
      { name: 'CloudFront', icon: 'cloudfront' },
      { name: 'NGINX', icon: 'nginx' },
      { name: 'ALB / NLB', icon: 'lb' },
      { name: 'VPC / DNS', icon: 'vpc' },
    ],
  },
  {
    title: 'Systems',
    hint: 'linux',
    items: [
      { name: 'Linux', icon: 'linux' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'S3', icon: 's3' },
      { name: 'IAM / IRSA', icon: 'iam' },
    ],
  },
]

/**
 * Reliability posture — every figure here comes from the resume
 * (4-tier PagerDuty, 12+ dashboards, 2 GKE regions, EKS 1.24→1.31, 3 envs).
 */
export const reliability = {
  oncall: {
    tiers: ['L1', 'L2', 'L3', 'L4'],
    note: 'PagerDuty escalation policy, alerting-as-code',
  },
  coverage: [
    { label: 'Grafana dashboards', value: '12+' },
    { label: 'GKE regions monitored', value: '2' },
    { label: 'Signals', value: 'Cloud SQL · PHP-FPM · HPA · uptime' },
  ],
  changeSafety: [
    { label: 'EKS control-plane upgrades', value: '1.24 → 1.31', detail: 'zero downtime' },
    { label: 'Node-pool migration', value: '4 → 8 vCPU', detail: 'blue-green' },
    { label: 'Promotion path', value: 'staging → beta → prod', detail: 'zero disruptions' },
  ],
} as const

export const projects = [
  {
    title: 'QuillPost',
    subtitle: 'Microservice blog platform',
    description:
      'A blog platform split into independent services — Django for auth and comments, Spring Boot for posts, React for the UI — talking over REST and shipping via Docker Compose or Kubernetes manifests.',
    tags: ['Kubernetes', 'Docker', 'Django', 'Spring Boot', 'React'],
    link: 'https://github.com/Kunal2703/QuillPost.git',
    status: 'running',
  },
  {
    title: 'Cloud Provider Advisor',
    subtitle: 'Multi-cloud VM comparison',
    description:
      'Aggregates compute offerings from AWS, Azure and GCP through their SDKs, then lets small teams filter by vCPU, memory, storage, OS and region to find the cheapest viable machine.',
    tags: ['AWS', 'GCP', 'Azure', 'Python', 'React'],
    link: 'https://github.com/Kunal2703/Cloud-Provider-Advisor.git',
    status: 'running',
  },
  {
    title: 'Parking Spot Assigner',
    subtitle: 'Computer vision + OCR',
    description:
      'Reads number plates with YOLOv7 and Tesseract OCR, matches them against the employee database, and assigns the nearest free bay — cutting queueing at the campus gate.',
    tags: ['YOLOv7', 'OpenCV', 'OCR', 'Python', 'ML'],
    link: 'https://github.com/Kunal2703/Parking-Spot-Assigner-with-License-Plate-Detector.git',
    status: 'archived',
  },
  {
    title: 'Build-our-own-Compiler',
    subtitle: 'Compiler from scratch',
    description:
      'A staged compiler that walks source through lexical, syntax and grammar analysis, emits assembly-like intermediate code, and produces target output.',
    tags: ['Python', 'C++', 'Compilers'],
    link: 'https://github.com/Kunal2703/Build-our-own-Compiler.git',
    status: 'archived',
  },
] as const

/** Synthetic log lines for the ambient log stream — flavour, clearly presentational. */
export const logLines = [
  { level: 'info', svc: 'terraform', msg: 'apply complete — 34 added, 0 destroyed' },
  { level: 'ok', svc: 'helm', msg: 'release emdash-tenant-07 → deployed' },
  { level: 'info', svc: 'eks', msg: 'node group scaled 4 → 8 vCPU (blue-green)' },
  { level: 'ok', svc: 'grafana', msg: 'dashboard cloud-sql-saturation provisioned' },
  { level: 'warn', svc: 'hpa', msg: 'php-fpm replicas 6/10 — scaling up' },
  { level: 'ok', svc: 'pagerduty', msg: 'escalation policy L1→L4 armed' },
  { level: 'info', svc: 'finops', msg: 'daily cost report posted to #eng-costs' },
  { level: 'ok', svc: 'cloudsql', msg: 'dedicated → shared migration complete' },
  { level: 'info', svc: 'akamai', msg: 'edge config pushed — p95 latency -30%' },
  { level: 'ok', svc: 'devtron', msg: 'pipeline prod/api-gateway succeeded' },
  { level: 'info', svc: 'kafka', msg: 'consumer lag 0 across 12 partitions' },
  { level: 'ok', svc: 'eks', msg: 'control plane 1.30 → 1.31, zero downtime' },
] as const

export const education = {
  school: 'University of Petroleum and Energy Studies (UPES)',
  degree: 'B.Tech, Computer Science and Engineering',
  period: 'Jul 2020 — Jul 2024',
  location: 'Dehradun, India',
  cgpa: '8.56',
} as const

export const certifications = [
  { name: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft' },
  {
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS Training and Certification',
  },
] as const
