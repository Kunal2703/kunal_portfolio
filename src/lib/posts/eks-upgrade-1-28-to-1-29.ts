import { asset, type LocalPost } from './types'

const img = asset('eks-upgrade')

const html = `
<p>Here are the steps in point form:</p>

<ol>
  <li>
    <strong>Upgrade EKS Cluster:</strong>
    <ul><li>Update the EKS cluster to the latest Kubernetes version, ensuring workload compatibility.</li></ul>
  </li>
  <li>
    <strong>Upgrade Node Groups:</strong>
    <ul><li>Sequentially upgrade each node group.</li></ul>
  </li>
  <li>
    <strong>Upgrade Add-ons:</strong>
    <ul><li>Update all installed add-ons to align with the new cluster and node versions, ensuring stability and optimization.</li></ul>
  </li>
</ol>

<p><strong>Current Version: 1.28</strong></p>

<img src="${img('01-cluster-1-28.png')}" alt="EKS console showing demo-eks-cluster running Kubernetes version 1.28" loading="lazy" />

<h2>List Nodes</h2>
<p>To view the status of all nodes in your EKS cluster, use the following command:</p>
<pre><code>kubectl get nodes</code></pre>

<img src="${img('02-kubectl-get-nodes.png')}" alt="Terminal output of kubectl get nodes showing one node on v1.28.13-eks-a737599" loading="lazy" />

<h2>List Clusters</h2>
<p>To retrieve a list of all EKS clusters in your AWS account, use the following command:</p>
<pre><code>aws eks list-clusters --query "clusters[*]" --output text</code></pre>

<img src="${img('03-list-clusters.png')}" alt="Terminal output of aws eks list-clusters showing demo-eks-cluster" loading="lazy" />

<h2>Check Current Cluster Version</h2>
<p>To check the current Kubernetes version of your EKS cluster, use the following command:</p>
<pre><code>aws eks describe-cluster --name demo-eks-cluster --query "cluster.version" --output text</code></pre>

<img src="${img('04-cluster-version-1-28.png')}" alt="Terminal output showing the cluster version is 1.28" loading="lazy" />

<h2>Upgrade the Cluster Version</h2>
<p>To upgrade your EKS cluster to version 1.29, use the following command:</p>
<pre><code>aws eks update-cluster-version --name demo-eks-cluster --kubernetes-version 1.29</code></pre>

<img src="${img('05-update-cluster-version.png')}" alt="Terminal output of update-cluster-version returning an InProgress VersionUpdate for 1.29" loading="lazy" />

<h2>Monitor the Upgrade</h2>
<p>To monitor the status of the upgrade process for your EKS cluster, use the following command:</p>
<pre><code>aws eks describe-cluster --name demo-eks-cluster --query "cluster.status" --output text</code></pre>

<h3>Expected Output</h3>
<p>You should see the upgraded version:</p>

<img src="${img('06-cluster-1-29.png')}" alt="EKS console showing demo-eks-cluster upgraded to Kubernetes version 1.29" loading="lazy" />

<h2>Node Groups upgrading using AWS console &amp; CLI</h2>

<h3>Upgrading Node Groups Using AWS Console</h3>
<p>The node group is running version 1.28. To update, click the "Update Now" button located at the top right. After some time, the node group will be upgraded.</p>

<img src="${img('07-nodegroup-1-28-update-now.png')}" alt="demo-nodegroup at Kubernetes version 1.28 with the Update now button highlighted" loading="lazy" />

<p>You can verify this upgrade in the screenshot, where it indicates that the node group has been upgraded.</p>

<img src="${img('08-nodegroup-verified.png')}" alt="EKS Compute tab showing two ready nodes and node group AMI release version 1.29.8-20241016" loading="lazy" />

<h3>Upgrading Node Groups Using CLI</h3>
<p>First, list all node groups in your cluster to identify the one you want to upgrade. Use the following command:</p>
<pre><code>aws eks list-nodegroups --cluster-name demo-eks-cluster</code></pre>

<img src="${img('09-list-nodegroups.png')}" alt="Terminal output of list-nodegroups showing demo-nodegroup" loading="lazy" />

<p>Ensure that your node group is running the desired version. For example, if it is running version 1.28, verify this using the CLI:</p>
<pre><code>aws eks describe-nodegroup --cluster-name demo-eks-cluster --nodegroup-name demo-nodegroup --query "nodegroup.version" --output text</code></pre>

<p>Upgrade each node group one by one to avoid disruptions. Use the following command.</p>
<pre><code>aws eks update-nodegroup-version --cluster-name demo-eks-cluster --nodegroup-name demo-nodegroup --kubernetes-version 1.29</code></pre>

<h4>Repeat for Each Node Group</h4>
<p>Please refer to the provided screenshot, which shows that the node group is currently in an updating state.</p>

<img src="${img('10-nodegroup-updating.png')}" alt="demo-nodegroup configuration with status Updating" loading="lazy" />

<p>Additionally, you can verify the status by running the following command:</p>
<pre><code>aws eks describe-nodegroup --cluster-name demo-eks-cluster --nodegroup-name demo-nodegroup --query "nodegroup.status" --output text</code></pre>

<img src="${img('11-nodegroup-status-updating.png')}" alt="Terminal output showing the node group status is UPDATING" loading="lazy" />

<p>Before starting the upgrade process, the Auto Scaling Group (ASG) configuration was set to a</p>
<ul><li>Max: 1</li><li>Min: 1</li><li>Desired: 1</li></ul>

<p>During the upgrade process, the ASG automatically adjusted its settings to accommodate the additional resources needed, resulting in a new configuration with</p>
<ul><li>Max: 6</li><li>Min: 6</li><li>Desired: 6</li></ul>

<p>After the upgrade was completed successfully, the ASG configuration reverted to its original settings to ensure optimal resource usage and cost efficiency.</p>

<p>Please refer to the attached screenshot, which indicates that the node group has been successfully upgraded.</p>

<img src="${img('12-nodegroup-1-29.png')}" alt="demo-nodegroup configuration showing Kubernetes version 1.29 and status Active" loading="lazy" />

<h2>ADD-ONS</h2>
<p>Additionally, the upgrade process for the add-ons will be conducted. The steps for this process are outlined below:</p>

<p>To retrieve the list of add-ons associated with the specified EKS cluster, use the following command:</p>
<pre><code>eksctl get addon --cluster demo-eks-cluster --region us-east-1</code></pre>

<img src="${img('13-eksctl-get-addon.png')}" alt="Terminal output of eksctl get addon listing coredns, kube-proxy and vpc-cni with available versions" loading="lazy" />

<h3>CoreDNS</h3>
<p>For details on compatible versions of the CoreDNS add-on, please refer to the following link:<br />
<a href="https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html</a></p>

<p>To upgrade the <strong>CoreDNS</strong> add-on in your EKS cluster to a specific version, use the following command:</p>
<pre><code>aws eks update-addon \\
    --cluster-name demo-eks-cluster \\
    --addon-name coredns \\
    --addon-version v1.11.3-eksbuild.1 \\
    --region us-east-1</code></pre>

<img src="${img('14-coredns-update.png')}" alt="Terminal output of the CoreDNS update-addon call returning an InProgress AddonUpdate" loading="lazy" />

<p>To check the status of the CoreDNS add-on and determine whether it has been upgraded to a compatible version, use the following command:</p>
<pre><code>aws eks describe-addon --cluster-name demo-eks-cluster --addon-name coredns --region us-east-1</code></pre>

<img src="${img('15-coredns-describe.png')}" alt="Terminal output showing CoreDNS status ACTIVE at addonVersion v1.11.3-eksbuild.1" loading="lazy" />

<p>Please refer to the provided screenshot for further confirmation of the upgrade status.</p>

<img src="${img('16-addons-before.png')}" alt="EKS Add-ons list showing kube-proxy v1.28.2-eksbuild.2, CoreDNS v1.11.3-eksbuild.1 and Amazon VPC CNI v1.15.1-eksbuild.1" loading="lazy" />

<h3>Kube-proxy:</h3>
<p>For details on compatible versions of Kube-proxy, please refer to the following link:<br />
<a href="https://docs.aws.amazon.com/eks/latest/userguide/managing-kube-proxy.html#managing-kube-proxy-images" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/eks/latest/userguide/managing-kube-proxy.html#managing-kube-proxy-images</a></p>

<p>To upgrade the Kube-proxy add-on in your EKS cluster to a specific version, use the following command:</p>
<pre><code>aws eks update-addon \\
    --cluster-name demo-eks-cluster \\
    --addon-name kube-proxy \\
    --addon-version v1.29.7-eksbuild.9 \\
    --region us-east-1</code></pre>

<img src="${img('17-kubeproxy-update.png')}" alt="Terminal output of the kube-proxy update-addon call returning an InProgress AddonUpdate" loading="lazy" />

<p>To check the status of the Kube-proxy add-on and determine whether it has been successfully upgraded, use the following command:</p>
<pre><code>aws eks describe-addon --cluster-name demo-eks-cluster --addon-name kube-proxy --region us-east-1</code></pre>

<img src="${img('18-kubeproxy-describe.png')}" alt="Terminal output showing kube-proxy status ACTIVE at addonVersion v1.29.7-eksbuild.9" loading="lazy" />

<h3>VPC CNI</h3>
<p>For details on compatible versions of the VPC CNI plugin, please refer to the following link:<br />
<a href="https://docs.aws.amazon.com/eks/latest/userguide/managing-vpc-cni.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/eks/latest/userguide/managing-vpc-cni.html</a></p>

<p>To upgrade the VPC CNI add-on in your EKS cluster to a specific version, use the following command:</p>
<pre><code>aws eks update-addon \\
    --cluster-name demo-eks-cluster \\
    --addon-name vpc-cni \\
    --addon-version v1.18.5-eksbuild.1 \\
    --region us-east-1</code></pre>

<img src="${img('19-vpccni-update.png')}" alt="Terminal output of the VPC CNI update-addon call returning an InProgress AddonUpdate" loading="lazy" />

<img src="${img('20-addons-after.png')}" alt="EKS Add-ons list after the upgrade: kube-proxy v1.29.7-eksbuild.9, Amazon VPC CNI v1.18.5-eksbuild.1 and CoreDNS v1.11.3-eksbuild.1" loading="lazy" />

<p>Thank you for reading! ❤️</p>
`

export const eksUpgrade128To129: LocalPost = {
        slug: 'upgrading-the-eks-cluster',
        title: 'Upgrading the EKS Cluster, Node Groups, and Add-Ons from Version 1.28 to 1.29',
        subtitle:
            'A step-by-step walkthrough of upgrading an Amazon EKS control plane, its node groups, and CoreDNS, kube-proxy and VPC CNI — with the console and the CLI side by side.',
        brief:
            'A step-by-step walkthrough of upgrading an Amazon EKS control plane, its node groups, and the CoreDNS, kube-proxy and VPC CNI add-ons from 1.28 to 1.29, using both the AWS console and the CLI.',
        coverImage: img('cover.png'),
        publishedAt: '2024-10-25',
        readTime: 4,
        tags: ['eks', 'eks-cluster', 'eks-upgrade', 'aws', 'aws-eks'],
        html,
    }
