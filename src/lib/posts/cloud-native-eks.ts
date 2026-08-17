import { asset, type LocalPost } from './types'

const img = asset('cloud-native-eks')

const html = `
<p>At "www.example.com", the platform is designed to deliver fast, secure, and reliable digital experiences through a cloud-native, microservices architecture built on Amazon EKS. Here's an overview of how we structure and scale our production infrastructure.</p>

<img src="${img('architecture.png')}" alt="End-to-end architecture: Route 53 to CDN to NLB into an EKS cluster, an ingress controller routing to three frontend services, API subdomains through a second NLB to three backend services, and those backends connected to Solr, Elasticsearch, Amazon RDS, Amazon S3, Celery and Redis." loading="lazy" />

<h2>🌐 Entry Point and Traffic Flow</h2>
<p>User requests begin at Amazon Route 53, where DNS resolution is followed by a Content Delivery Network (CDN) for edge-level caching and performance. These requests are then routed through an AWS Network Load Balancer (NLB), which distributes traffic into our Kubernetes-based EKS cluster.</p>

<h2>🎯 Frontend Layer</h2>
<p>Within the EKS cluster, an Ingress Controller manages routing rules based on the request path or host:</p>
<ul>
  <li><code>/path1</code> → <code>frontend-service-1</code></li>
  <li><code>/path2</code> → <code>frontend-service-2</code></li>
  <li><code>/path3</code> → <code>frontend-service-3</code></li>
</ul>
<p>Each service is independently deployable and scalable, ensuring flexibility and isolation across the frontend stack.</p>

<h2>🔄 API Routing &amp; Backend Communication</h2>
<p>Frontend services communicate with backend APIs via subdomains like <code>api1.abc.com</code> and <code>api2.abc.com</code>. These subdomains are managed through Route 53 and exposed via a dedicated NLB, which handles secure and efficient traffic routing to backend services — all hosted within the same EKS cluster.</p>

<h2>⚙️ Backend Layer</h2>
<p>The backend stack consists of <code>backend-service-1</code>, <code>backend-service-2</code>, and <code>backend-service-3</code>, each deployed as Kubernetes Deployments with ReplicaSets. This setup ensures fault tolerance, auto-recovery, and smooth scaling under load.</p>

<h2>🧠 Data and Processing Ecosystem</h2>
<p>Backend services are deeply integrated with AWS-native and open-source systems:</p>
<ul>
  <li><strong>Amazon RDS</strong> – Relational data storage</li>
  <li><strong>Amazon S3</strong> – Object storage for assets and data dumps</li>
  <li><strong>Elasticsearch &amp; Solr</strong> – Distributed search and indexing</li>
  <li><strong>Redis</strong> – High-performance in-memory cache</li>
  <li><strong>Celery</strong> – Asynchronous task queues and background job processing</li>
</ul>
`

export const cloudNativeEks: LocalPost = {
    slug: 'cloud-native-architecture-on-eks',
    title: 'Behind the Scenes of "www.example.com" – A Scalable Cloud-Native Architecture Built on Amazon EKS',
    subtitle:
        'How a production platform is structured on Amazon EKS — from Route 53 and the CDN at the edge, through ingress and frontend services, down to the backend layer and its data ecosystem.',
    brief:
        'How a production platform is structured on Amazon EKS — Route 53 and a CDN at the edge, NLBs into the cluster, an ingress controller fronting independent frontend services, and a backend layer wired to RDS, S3, Elasticsearch, Solr, Redis and Celery.',
    coverImage: img('architecture.png'),
    publishedAt: '2025-04-24',
    readTime: 2,
    tags: [
        'aws',
        'kubernetes',
        'k8s',
        'eks',
        'eks-cluster',
        'infrastructure',
        'cloud-computing',
        'devops',
        'sre',
    ],
    html,
}
