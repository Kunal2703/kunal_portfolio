import { asset, type LocalPost } from './types'

const img = asset('eks-131-oidc')

const html = `
<p>Recently, I upgraded our Amazon EKS cluster from v1.30 to v1.31, and along the way, I encountered a critical Identity Provider issue that halted the upgrade. Here's a breakdown of the issue, how I resolved it, and the best practices I followed for upgrading the cluster and node groups.</p>

<h2>🧩 Issue Faced: OIDC Identity Provider Conflict</h2>
<p>After triggering the upgrade:</p>
<pre><code>aws eks update-cluster-version --name &lt;cluster-name&gt; --kubernetes-version 1.31</code></pre>

<p>I received the following error:</p>
<pre><code>Cluster has incorrect Identity Provider URL configuration.
The Identity Provider URL cannot be the same as the OpenID Connect issuer URL.
Please fix the Identity Provider configuration before updating the cluster version.</code></pre>

<p>This occurs when the OIDC Identity Provider (IdP) configuration for your EKS cluster incorrectly uses the same URL for the IdP and OIDC issuer, causing a validation conflict during upgrades.</p>

<h2>✅ Resolution</h2>
<p>To resolve this, I disassociated the Identity Provider using the AWS CLI:</p>
<pre><code>aws eks disassociate-identity-provider-config \\
    --cluster-name &lt;cluster-name&gt; \\
    --region &lt;region-name&gt; \\
    --identity-provider-config type=oidc,name=&lt;oidc-config-name&gt;</code></pre>

<p>This removed the conflicting IdP config. I then used this command to monitor the update process:</p>
<pre><code>aws eks describe-update \\
    --name &lt;cluster-name&gt; \\
    --update-id &lt;update-id-from-previous-output&gt; \\
    --region &lt;region-name&gt;</code></pre>

<p>Once the control plane was successfully upgraded to 1.31, I proceeded to upgrade the worker nodes.</p>

<h2>🧱 Node Group Upgrade Strategy (Blue/Green Approach)</h2>
<p>Rather than upgrading existing node groups in-place, I opted for a blue/green deployment pattern:</p>
<ol>
  <li>
    Created new managed node groups from the upgraded control plane (via AWS Console).
    <ul><li>These new node groups automatically inherited the latest Kubernetes version (v1.31).</li></ul>
  </li>
  <li>
    Drained the old node groups to gracefully evict pods and shift workloads:
    <pre><code>eksctl drain nodegroup --cluster=&lt;cluster-name&gt; --name=&lt;old-nodegroup-name&gt;</code></pre>
  </li>
  <li>Confirmed pod rescheduling to the new node groups, ensuring zero downtime and safe rollout.</li>
  <li>Decommissioned the old node groups once everything was stable.</li>
</ol>

<h2>🧠 Key Commands &amp; Tips</h2>
<pre><code># Check kubectl versions
kubectl version
kubectl get nodes

# List all clusters
aws eks list-clusters

# Describe cluster version
aws eks describe-cluster --name &lt;cluster-name&gt; --query "cluster.version" --output text

# Upgrade control plane
aws eks update-cluster-version --name &lt;cluster-name&gt; --kubernetes-version 1.31

# Monitor cluster upgrade
aws eks describe-cluster --name &lt;cluster-name&gt; --query "cluster.status" --output text

# List all node groups
aws eks list-nodegroups --cluster-name &lt;cluster-name&gt;

# Drain old node groups
eksctl drain nodegroup --cluster=&lt;cluster-name&gt; --name=&lt;nodegroup-name&gt;</code></pre>

<h2>🎯 Takeaways</h2>
<ul>
  <li>Ensure that your OIDC Identity Provider is correctly configured before control plane upgrades.</li>
  <li>Prefer blue/green node group upgrades to reduce risk and enable zero-downtime deployments.</li>
  <li>Use <code>eksctl drain</code> for smooth pod rescheduling across node groups.</li>
  <li>Always monitor the update using AWS CLI to track progress and issues in real-time.</li>
</ul>

<p>Have you faced similar issues during EKS upgrades? Let's connect and share our war stories! 💬</p>
`

export const eks131Oidc: LocalPost = {
    slug: 'eks-cluster-upgrade-version-from-130-to-131',
    title: '🚀 Successfully Upgraded Amazon EKS Cluster to v1.31 — Lessons Learned + Identity Provider Fix 🛠️',
    subtitle:
        'An OIDC Identity Provider conflict halted the upgrade from v1.30 to v1.31. Here is the error, the fix, and the blue/green node group strategy that followed.',
    brief:
        'An OIDC Identity Provider conflict halted our upgrade from v1.30 to v1.31. Here is the exact error, how I disassociated the conflicting IdP config to fix it, and the blue/green node group strategy I used for a zero-downtime rollout.',
    coverImage: img('cover.png'),
    publishedAt: '2025-06-27',
    readTime: 3,
    tags: [
        'aws',
        'eks-upgrade',
        'eks-cluster',
        'eks',
        'kubernetes',
        'devops',
        'cluster-upgrade',
        'oidc',
        'bluegreen-deployment',
        'eksctl',
    ],
    html,
}
